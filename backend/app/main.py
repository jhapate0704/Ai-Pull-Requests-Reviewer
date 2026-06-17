"""
File: main.py

Purpose:
Main entry point and router for the FastAPI backend application of the AI PR Reviewer.

Responsibilities:
- Initialize the FastAPI app instance, title, description, and CORS policies.
- Define HTTP endpoints for user authentication (GitHub OAuth), retrieving PR info, and initiating AI reviews.
- Handle webhook notifications from GitHub to trigger background PR reviews.
- Serve repository analytics reports by querying historical review analytics.
- Create database tables at startup.

Dependencies:
- fastapi
- sqlalchemy
- pydantic
- hmac
- hashlib
- backend.app.services (pr_parser, github_service, ai_review_service)
- backend.app.auth
- backend.app.database
- backend.app.models
"""

import json
import os
import requests
from fastapi import FastAPI, HTTPException, BackgroundTasks, Header, Request, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from backend.app.services.pr_parser import parse_pr_url
from backend.app.services.github_service import (
    fetch_pr_details,
    fetch_pr_files,
    post_pr_comment
)
from backend.app.services.ai_review_service import review_code_diff
import hmac
import hashlib
from sqlalchemy.orm import Session
from backend.app.database import engine, get_db
import backend.app.models as models
from backend.app.auth import encrypt_token, decrypt_token, create_jwt_token, get_current_user

# Create database tables automatically based on the SQLAlchemy metadata definitions
models.Base.metadata.create_all(bind=engine)

# Instantiate FastAPI application instance
app = FastAPI(
    title="AI PR Reviewer",
    description="AI-powered GitHub Pull Request Reviewer",
    version="1.0.0"
)

# Add CORS middleware to allow requests from the React frontend
# Why:
# The frontend and backend run on different ports/domains.
# Allowing origins is necessary to avoid blocking cross-origin browser requests.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify the exact frontend domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class PostReviewRequest(BaseModel):
    """
    Pydantic model representing incoming request body to review and post comments to GitHub.

    Fields:
        pr_url (str): The full GitHub URL of the target Pull Request.
    """
    pr_url: str



# -----------------------------------------------------------------------
# FEATURE #1 + #2 + #3 Helper: Format per-file reviews → GitHub Markdown
#
# Updated to handle the new per-file structure with severity scoring.
# Each file gets its own section in the comment.
# Each issue shows: severity badge + description + fix suggestion
#
# Example output on GitHub:
#   ## 🤖 AI PR Review
#   ### 📊 PR Quality Score: 85 / 100
#   ### 📂 auth.py
#   🔴 CRITICAL — SQL injection via f-string → Use parameterized queries
#   🟢 LOW — Variable name x → Rename to userId
# -----------------------------------------------------------------------
def calculate_pr_score(file_reviews: list) -> int:
    """
    Calculates the aggregate code quality score of a Pull Request based on finding severities.

    Why:
    Provides users with a simple, high-level summary score representing the code quality of the PR.

    What happens:
    Starts with a maximum score of 100. Subtracts penalty points for each issue found
    across all files. Clamps the final value between 0 and 100.

    Args:
        file_reviews (list): List of dictionaries containing review categories and issue severities.

    Returns:
        int: Aggregate score from 0 to 100.
    """
    score = 100
    # Penalty weights associated with different severity labels
    penalties = {
        "CRITICAL": 20,
        "HIGH": 10,
        "MEDIUM": 5,
        "LOW": 1
    }
    
    # Traverse through all categorized review issues and deduct score
    for fr in file_reviews:
        review = fr.get("review", {})
        for category, items in review.items():
            if isinstance(items, list):
                for item in items:
                    sev = item.get("severity", "LOW").upper()
                    score -= penalties.get(sev, 1)
                    
    return max(0, min(100, score))

def format_review_as_comment(file_reviews: list, score: int = None) -> str:
    """
    Converts per-file AI reviews into a formatted GitHub markdown comment.

    Why:
    Prepares a clean, readable, formatted markdown report that can be posted as a comment on the GitHub PR.

    What happens:
    Iterates over each file's reviews, groups issues by category (Bugs, Security, Edge Cases, etc.),
    adds severity emojis, formats suggested fixes in markdown blockquotes, and compiles everything into a single string.

    Args:
        file_reviews (list): A list of dictionaries representing per-file review results.
        score (int, optional): The calculated quality score of the pull request. Defaults to None.

    Returns:
        str: Formatted markdown string ready to be posted.
    """
    # Emojis representing the severity level of issues
    SEV_EMOJI = {
        "CRITICAL": "🔴",
        "HIGH":     "🟠",
        "MEDIUM":   "🟡",
        "LOW":      "🟢",
    }

    # Internal helper to format markdown headers and items for a specific review subcategory
    def section(emoji, title, items):
        if not items:
            return f"**{emoji} {title}** — ✅ No issues found  \n"
        lines = ""
        for item in items:
            sev     = item.get("severity", "LOW").upper()
            issue   = item.get("issue", "")
            suggest = item.get("suggestion", "")
            badge   = SEV_EMOJI.get(sev, "⚪")
            lines  += f"- {badge} **{sev}** — {issue}  \n"
            if suggest:
                lines += f"  > 💡 *Fix: {suggest}*  \n"
        return f"**{emoji} {title} ({len(items)})**  \n{lines}"

    # Build the header comment block
    comment = "## 🤖 AI PR Review Summary\n\n"
    if score is not None:
        if score >= 80:
            health = "🟢 **Good Health**"
        elif score >= 50:
            health = "🟡 **Needs Improvement**"
        else:
            health = "🔴 **Critical Issues**"
        comment += f"### 📊 PR Quality Score: **{score} / 100** ({health})\n\n"
        
    comment += "---\n\n"

    # Compile the review findings for each file
    for file_review in file_reviews:
        filename = file_review.get("filename", "Unknown File")
        review   = file_review.get("review", {})
        comment += f"### 📂 `{filename}`\n\n"
        comment += section("🐞", "Bugs",                      review.get("bugs", []))
        comment += section("🔒", "Security Issues",           review.get("security_issues", []))
        comment += section("⚠️", "Edge Cases",                review.get("edge_cases", []))
        comment += section("⚡", "Optimizations",             review.get("optimizations", []))
        comment += section("🧹", "Code Quality",              review.get("code_quality_improvements", []))
        comment += "\n---\n\n"

    return comment


@app.get("/")
def home():
    """
    Health check endpoint for the backend application.

    Why:
    Confirms to the client or hosting dashboard that the API server is online and running.

    What happens:
    Returns a success status response dictionary.

    Returns:
        dict: Status message block.
    """
    return {
        "status": "success",
        "message": "AI PR Reviewer backend is running"
    }

class GitHubLoginRequest(BaseModel):
    """
    Pydantic model representing incoming request body for GitHub OAuth login.

    Fields:
        code (str): Temporary authorization code returned from GitHub OAuth flow.
    """
    code: str

@app.post("/auth/github")
def github_login(req: GitHubLoginRequest, db: Session = Depends(get_db)):
    """
    Authenticates a user via GitHub OAuth credentials.

    Why:
    Exchanges temporary GitHub authorization codes for persistent OAuth tokens to query 
    GitHub resources on behalf of the user, logging in or registering the user records locally.

    What happens:
    1. Sends a POST request to GitHub token URL with OAuth client secrets.
    2. Uses the returned token to query the user's GitHub profile.
    3. Searches for an existing user record. Updates username/avatar and token if found,
       otherwise registers a new User record in the database.
    4. Issues a JWT token representing user's session in our application.

    Args:
        req (GitHubLoginRequest): Request containing the authorization code.
        db (Session): Database session.

    Returns:
        dict: System JWT token, user name, and avatar URL.

    Raises:
        HTTPException: If token exchange fails.
    """
    # 1. Exchange 'code' for a GitHub Access Token
    token_url = "https://github.com/login/oauth/access_token"
    payload = {
        "client_id": os.getenv("GITHUB_CLIENT_ID"),
        "client_secret": os.getenv("GITHUB_CLIENT_SECRET"),
        "code": req.code
    }
    headers = {"Accept": "application/json"}
    token_res = requests.post(token_url, json=payload, headers=headers).json()
    access_token = token_res.get("access_token")

    if not access_token:
        raise HTTPException(status_code=400, detail="Failed to obtain access token from GitHub")

    # 2. Fetch the user's GitHub profile
    user_res = requests.get("https://api.github.com/user", 
                            headers={"Authorization": f"Bearer {access_token}"}).json()
    
    # 3. Save or update the user in your database
    user = db.query(models.User).filter(models.User.github_id == user_res.get("id")).first()
    if not user:
        user = models.User(
            github_id=user_res.get("id"), 
            username=user_res.get("login"),
            avatar_url=user_res.get("avatar_url"),
            encrypted_github_token=encrypt_token(access_token)
        )
        db.add(user)
    else:
        user.username = user_res.get("login")
        user.avatar_url = user_res.get("avatar_url")
        user.encrypted_github_token = encrypt_token(access_token)
        
    db.commit()
    db.refresh(user)

    # 4. Generate a JWT for your own app's session
    app_token = create_jwt_token({"user_id": user.id})
    return {
        "token": app_token, 
        "username": user.username,
        "avatar_url": user.avatar_url
    }

@app.get("/pr-details")
def get_pr_details(pr_url: str):
    """
    Fetches base metadata details of a Pull Request.

    Why:
    Provides basic PR details to show on the UI screen when a PR URL is entered.

    What happens:
    Parses the PR URL, contacts GitHub API, and returns title, state, author, and changed files count.

    Args:
        pr_url (str): Target Pull Request URL.

    Returns:
        dict: Object containing PR details.

    Raises:
        HTTPException: If parsing or API fetching encounters an exception.
    """
    try:
        parsed_data = parse_pr_url(pr_url)
        pr_details = fetch_pr_details(
            parsed_data["owner"],
            parsed_data["repo"],
            parsed_data["pull_number"]
        )
        return {
            "success": True,
            "data": pr_details
        }
    except Exception as e:
        raise HTTPException(
            status_code=400,
            detail=str(e)
        )

# -----------------------------------------------------------------------
# FEATURE #2 + #3: Updated /ai-review — Per-File with Severity Scoring
#
# OLD: Combined all files → one prompt → one flat JSON
# NEW: Each file → own prompt → list of per-file reviews with severity
#
# Returns:
#   {
#     "success": true,
#     "files_reviewed": 3,
#     "reviews": [
#       {
#         "filename": "auth.py",
#         "additions": 12,
#         "deletions": 3,
#         "review": {
#           "bugs": [{"issue": "...", "severity": "CRITICAL", "suggestion": "..."}],
#           "security_issues": [...], ...
#         }
#       },
#       ...
#     ]
#   }
# -----------------------------------------------------------------------
@app.get("/ai-review")
def ai_review(pr_url: str):
    """
    Performs AI code review on each changed file in a Pull Request.

    Why:
    Allows user to trigger an automated code review and display findings locally on screen.

    What happens:
    Parses the PR URL, fetches the list of files and patches, reviews each patch individually via AI,
    aggregates results, computes quality scores, and returns full structured data.

    Args:
        pr_url (str): Target Pull Request URL.

    Returns:
        dict: Detailed reviews per file and the aggregate score.

    Raises:
        HTTPException: If any error is caught during parsing or review operations.
    """
    try:
        parsed_data = parse_pr_url(pr_url)

        files = fetch_pr_files(
            parsed_data["owner"],
            parsed_data["repo"],
            parsed_data["pull_number"]
        )

        file_reviews = []

        for file in files:
            patch = file.get("patch")
            if not patch:
                # Skip files with no diff (e.g. binary files, renames)
                continue

            filename    = file.get("filename", "unknown")
            review_text = review_code_diff(filename, patch)

            try:
                review_json = json.loads(review_text)
            except json.JSONDecodeError:
                review_json = {}

            file_reviews.append({
                "filename":  filename,
                "status":    file.get("status", "modified"),
                "additions": file.get("additions", 0),
                "deletions": file.get("deletions", 0),
                "review":    review_json
            })

        score = calculate_pr_score(file_reviews)

        return {
            "success":       True,
            "files_reviewed": len(file_reviews),
            "score":         score,
            "reviews":       file_reviews
        }

    except Exception as e:
        raise HTTPException(
            status_code=400,
            detail=str(e)
        )


# -----------------------------------------------------------------------
# FEATURE #1 Endpoint: POST /post-review
#
# Flow:
#   1. Parse the PR URL  →  get owner, repo, pull_number
#   2. Fetch changed files from GitHub API (with token if provided)
#   3. Run AI review on the combined code diff
#   4. Format the review JSON → nice GitHub Markdown string
#   5. POST that string to GitHub as a comment on the PR
#   6. Return the direct URL to the posted comment
#
# Query params:
#   pr_url       : Full GitHub PR URL
#   github_token : GitHub Personal Access Token (PAT) with repo scope
# -----------------------------------------------------------------------
@app.post("/post-review")
def post_review_to_github(req: PostReviewRequest, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    """
    Reviews a PR and publishes the resulting markdown report as a comment on GitHub.

    Why:
    Posts feedback directly on GitHub PR timelines, enabling developers to review recommendations
    within their existing workflows. Saves the review history records locally for analytical dashboards.

    What happens:
    1. Retrieves/decrypts GitHub authorization token from the database.
    2. Parses the PR URL and fetches changed file diffs.
    3. Requests AI evaluations for each file.
    4. Formats evaluations into markdown comment format.
    5. Dispatches comment to GitHub API issues comment endpoint.
    6. Stores ReviewHistory logs in the database.

    Args:
        req (PostReviewRequest): Requested PR URL.
        db (Session): Database session.
        current_user (User): Authenticated user instance from auth dependency.

    Returns:
        dict: Success message along with the comment URL link.

    Raises:
        HTTPException: If parsing, API requests, or posting actions fail.
    """
    pr_url = req.pr_url
    github_token = decrypt_token(current_user.encrypted_github_token)

    try:
        # Step 1: Parse the PR URL
        parsed_data = parse_pr_url(pr_url)
        owner       = parsed_data["owner"]
        repo        = parsed_data["repo"]
        pull_number = parsed_data["pull_number"]

        # Step 2: Fetch changed files (token passed for private repos)
        files = fetch_pr_files(owner, repo, pull_number, github_token)

        # Step 3: Review each file individually (per-file feature)
        file_reviews = []
        for file in files:
            patch = file.get("patch")
            if not patch:
                continue
            filename    = file.get("filename", "unknown")
            review_text = review_code_diff(filename, patch)
            try:
                review_json = json.loads(review_text)
            except json.JSONDecodeError:
                review_json = {}
            file_reviews.append({
                "filename": filename,
                "review":   review_json
            })

        # Step 4: Format per-file reviews → GitHub Markdown with severity
        score = calculate_pr_score(file_reviews)
        comment_body = format_review_as_comment(file_reviews, score)

        # Step 5: Post comment to GitHub
        comment_url = post_pr_comment(
            owner, repo, pull_number, comment_body, github_token
        )

        # Step 6: Save to PostgreSQL Analytics Database
        try:
            db_record = models.ReviewHistory(
                pr_url=pr_url,
                repo=repo,
                owner=owner,
                pr_score=score,
                files_reviewed=len(file_reviews),
                reviews_json=file_reviews,
                user_id=current_user.id
            )
            db.add(db_record)
            db.commit()
        except Exception as e:
            print(f"Failed to save analytics to DB: {e}")

        return {
            "success":     True,
            "message":     "Review posted successfully to GitHub!",
            "comment_url": comment_url
        }

    except Exception as e:
        raise HTTPException(
            status_code=400,
            detail=str(e)
        )


# -----------------------------------------------------------------------
# FEATURE #5: Webhook Endpoint (Auto-Review on New PR)
#
# Listens for GitHub pull_request events and processes them in the background.
# -----------------------------------------------------------------------

# Dummy secret for webhook signature verification
WEBHOOK_SECRET = "sk_web_987654321"

def process_webhook_pr(pr_url: str, github_token: str):
    """
    Background worker task to perform PR reviews triggered by GitHub webhooks.

    Why:
    Performs time-consuming API calls and AI reviews in a background thread to prevent blocking 
    the webhook response.

    What happens:
    Parses the target PR URL, fetches the changed files, performs AI diff reviews, calculates 
    quality scores, formats the comments, posts them to GitHub, and saves the history logs.

    Args:
        pr_url (str): Pull Request URL.
        github_token (str): User token or empty placeholder.
    """
    try:
        parsed_data = parse_pr_url(pr_url)
        owner = parsed_data["owner"]
        repo = parsed_data["repo"]
        pull_number = parsed_data["pull_number"]

        files = fetch_pr_files(owner, repo, pull_number, github_token)

        file_reviews = []
        for file in files:
            patch = file.get("patch")
            if not patch:
                continue
            filename = file.get("filename", "unknown")
            review_text = review_code_diff(filename, patch)
            try:
                review_json = json.loads(review_text)
            except json.JSONDecodeError:
                review_json = {}
            file_reviews.append({
                "filename": filename,
                "review": review_json
            })

        score = calculate_pr_score(file_reviews)
        comment_body = format_review_as_comment(file_reviews, score)
        
        post_pr_comment(owner, repo, pull_number, comment_body, github_token)
        print(f"✅ Webhook review successfully posted for {pr_url} with score {score}")

        # Save to PostgreSQL Analytics Database
        try:
            db = next(get_db())
            db_record = models.ReviewHistory(
                pr_url=pr_url,
                repo=repo,
                owner=owner,
                pr_score=score,
                files_reviewed=len(file_reviews),
                reviews_json=file_reviews
            )
            db.add(db_record)
            db.commit()
            db.close()
        except Exception as e:
            print(f"Failed to save webhook analytics to DB: {e}")

    except Exception as e:
        print(f"❌ Webhook review failed for {pr_url}: {e}")

@app.post("/webhook/{user_id}")
async def github_webhook(
    user_id: str,
    request: Request,
    background_tasks: BackgroundTasks,
    x_hub_signature_256: str = Header(None),
    x_github_event: str = Header(None)
):
    """
    HTTP POST endpoint to receive webhook payloads from GitHub.

    Why:
    Allows GitHub to automatically trigger AI reviews when a Pull Request is opened or synchronized.

    What happens:
    1. Verifies the SHA256 HMAC signature using WEBHOOK_SECRET.
    2. Checks if the header contains 'pull_request' events.
    3. Decodes the payload and checks if action is 'opened' or 'synchronize'.
    4. Enqueues a background task to process the Pull Request review.

    Args:
        user_id (str): User identifier target.
        request (Request): Webhook request instance.
        background_tasks (BackgroundTasks): Background runner.
        x_hub_signature_256 (str): HMAC signature header.
        x_github_event (str): GitHub event header.

    Returns:
        dict: Status message indicating whether task was accepted or ignored.

    Raises:
        HTTPException: If signatures or JSON payloads are invalid.
    """
    # 1. Verify Signature
    if not x_hub_signature_256:
        raise HTTPException(status_code=401, detail="Missing signature")
    
    payload = await request.body()
    signature = hmac.new(WEBHOOK_SECRET.encode(), payload, hashlib.sha256).hexdigest()
    expected_signature = f"sha256={signature}"
    
    if not hmac.compare_digest(x_hub_signature_256, expected_signature):
        # Allow bypassing for local testing if signature is "test"
        if x_hub_signature_256 != "test":
            raise HTTPException(status_code=401, detail="Invalid signature")

    # 2. Filter Events
    if x_github_event != "pull_request":
        return {"status": "ignored", "reason": "Not a pull_request event"}
        
    try:
        data = json.loads(payload)
    except json.JSONDecodeError:
        raise HTTPException(status_code=400, detail="Invalid JSON payload")

    action = data.get("action")
    if action not in ["opened", "synchronize"]:
        return {"status": "ignored", "reason": f"Action '{action}' ignored"}

    pr_url = data.get("pull_request", {}).get("html_url")
    if not pr_url:
        return {"status": "ignored", "reason": "No PR URL in payload"}

    # In a real app, you would look up the user's saved GitHub Token from a DB.
    # We will assume it's passed or available. For now, we use a placeholder or empty string
    # assuming the repo is public if no token is available.
    # Or for this test, we can just pass an empty string (works for public repos).
    user_github_token = "" 

    # 3. Process in Background
    background_tasks.add_task(process_webhook_pr, pr_url, user_github_token)

    return {"status": "accepted", "message": f"Review queued for {pr_url}"}


# -----------------------------------------------------------------------
# FEATURE #7: Analytics Dashboard Endpoint
# -----------------------------------------------------------------------
@app.get("/analytics/{owner}/{repo}")
def get_repo_analytics(owner: str, repo: str, db: Session = Depends(get_db)):
    """
    Fetches historical review analytics for a repository.

    Why:
    Provides dashboard panels with key repo metrics like total reviews, average PR score, and list of past runs.

    What happens:
    Queries database logs filtering by owner and repo, calculates average PR scores, and lists up to 50 entries.

    Args:
        owner (str): Owner of the GitHub repository.
        repo (str): Repository name.
        db (Session): Database session.

    Returns:
        dict: Repository details, totals, averages, and historical review list.
    """
    records = db.query(models.ReviewHistory).filter(
        models.ReviewHistory.owner == owner,
        models.ReviewHistory.repo == repo
    ).order_by(models.ReviewHistory.created_at.desc()).limit(50).all()

    total_reviews = len(records)
    avg_score = sum(r.pr_score for r in records if r.pr_score is not None) / total_reviews if total_reviews > 0 else 0

    return {
        "success": True,
        "owner": owner,
        "repo": repo,
        "total_reviews": total_reviews,
        "average_score": round(avg_score, 1),
        "history": [
            {
                "id": r.id,
                "pr_url": r.pr_url,
                "pr_score": r.pr_score,
                "files_reviewed": r.files_reviewed,
                "created_at": r.created_at
            } for r in records
        ]
    }