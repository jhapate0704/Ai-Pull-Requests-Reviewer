"""
File: github_service.py

Purpose:
Handles requests to the GitHub API for fetching Pull Request information
and posting comments.

Responsibilities:
- Fetch metadata about a specific pull request (title, author, status).
- Fetch list of changed files and their code diff patches.
- Post Markdown review feedback comments directly to GitHub PR timelines.

Dependencies:
- requests
"""

import requests

def fetch_pr_details(owner: str, repo: str, pull_number: int, github_token: str = None) -> dict:
    """
    Fetches basic metadata for a given GitHub Pull Request.

    Why:
    Loads PR details (such as title, author, and status) to present in the user interface 
    and store in review history logs.

    What happens:
    Sends a GET request to the GitHub API pulls endpoint. Returns compiled pull request metadata.
    Uses OAuth token if provided to authenticate/increase rate limits.

    Args:
        owner (str): Owner of the GitHub repository.
        repo (str): Repository name.
        pull_number (int): Pull Request identifier.
        github_token (str, optional): GitHub access token. Defaults to None.

    Returns:
        dict: Metadata dictionary containing 'title', 'author', 'state', and 'changed_files'.

    Raises:
        Exception: If GitHub API returns a non-200 status code.
    """
    url = f"https://api.github.com/repos/{owner}/{repo}/pulls/{pull_number}"

    headers = {
        "Accept": "application/vnd.github+json",
        "User-Agent": "AI-PR-Reviewer"
    }

    # If a GitHub token is provided, attach it — unlocks private repos
    # and raises rate limit from 60 → 5000 requests/hour
    if github_token:
        headers["Authorization"] = f"Bearer {github_token}"

    response = requests.get(url, headers=headers)

    # Validate response status code
    if response.status_code != 200:
        raise Exception(
            f"GitHub API Error: {response.status_code}"
        )

    data = response.json()

    return {
        "title": data.get("title"),
        "author": data.get("user", {}).get("login"),
        "state": data.get("state"),
        "changed_files": data.get("changed_files")
    }

def fetch_pr_files(owner: str, repo: str, pull_number: int, github_token: str = None) -> list:
    """
    Fetches list of files modified/added in the Pull Request along with their patch diffs.

    Why:
    Extracts the changed code snippets (patches) to submit to the AI Review engine.

    What happens:
    Sends a GET request to the GitHub pulls files API endpoint, filters down the file 
    details, and extracts the filename, additions/deletions count, and the patch strings.

    Args:
        owner (str): Owner of the GitHub repository.
        repo (str): Repository name.
        pull_number (int): Pull Request identifier.
        github_token (str, optional): GitHub access token. Defaults to None.

    Returns:
        list: List of dictionaries representing files containing keys 'filename', 
              'status', 'additions', 'deletions', 'changes', and 'patch'.

    Raises:
        Exception: If GitHub API returns a non-200 status code.
    """
    url = (
        f"https://api.github.com/repos/"
        f"{owner}/{repo}/pulls/"
        f"{pull_number}/files"
    )

    headers = {
        "Accept": "application/vnd.github+json",
        "User-Agent": "AI-PR-Reviewer"
    }

    if github_token:
        headers["Authorization"] = f"Bearer {github_token}"

    response = requests.get(url, headers=headers)

    if response.status_code != 200:
        raise Exception(
            f"GitHub API Error: {response.status_code}"
        )

    files_data = response.json()

    changed_files = []

    # Map raw GitHub API response items into a structured list of changed file payloads
    for file in files_data:
        changed_files.append({
            "filename": file.get("filename"),
            "status": file.get("status"),
            "additions": file.get("additions"),
            "deletions": file.get("deletions"),
            "changes": file.get("changes"),
            "patch": file.get("patch")  # Contains the actual git diff line insertions/deletions
        })

    return changed_files


# -----------------------------------------------------------------------
# FEATURE #1: Auto-Post Review as GitHub Comment
#
# How it works:
#   GitHub has a public API endpoint to create a comment on any PR:
#   POST https://api.github.com/repos/{owner}/{repo}/issues/{pr_number}/comments
#
#   All you need is:
#     1. The repo owner, repo name, PR number (parsed from the URL)
#     2. A GitHub Personal Access Token (PAT) with "repo" scope
#     3. The comment text (formatted markdown string)
#
#   This function sends ONE HTTP POST request to GitHub and the comment
#   appears instantly on the PR page — just like a human typed it.
#
# Example:
#   post_pr_comment(
#       owner="facebook",
#       repo="react",
#       pull_number=36487,
#       comment_body="🤖 AI Review: Found 2 bugs...",
#       github_token="ghp_xxxxxxxxxxxx"
#   )
#   → Returns the URL of the posted comment on GitHub
# -----------------------------------------------------------------------
def post_pr_comment(owner: str, repo: str, pull_number: int, comment_body: str, github_token: str) -> str:
    """
    Post a formatted AI review as a comment on a GitHub Pull Request.

    Why:
    Enables auto-posting capabilities, writing the review summary/report back to the GitHub PR timeline.

    What happens:
    Dispatches a POST request to GitHub API issues comments endpoint with comment content.
    Returns the URL link of the newly posted comment.

    Args:
        owner (str): GitHub repo owner.
        repo (str): GitHub repo name.
        pull_number (int): PR identification number.
        comment_body (str): Markdown text to post as the comment.
        github_token (str): GitHub Personal Access Token (needs repo scope).

    Returns:
        str: The HTML URL of the posted comment.

    Raises:
        Exception: If the GitHub API returns a status code other than 201 (Created).
    """
    url = f"https://api.github.com/repos/{owner}/{repo}/issues/{pull_number}/comments"

    headers = {
        "Accept": "application/vnd.github+json",
        "Authorization": f"Bearer {github_token}",
        "User-Agent": "AI-PR-Reviewer"
    }

    # Execute HTTP POST request containing comment body
    response = requests.post(url, headers=headers, json={"body": comment_body})

    # GitHub returns 201 Created on success
    if response.status_code != 201:
        error_msg = response.json().get("message", "Unknown error")
        raise Exception(
            f"Failed to post GitHub comment: {response.status_code} — {error_msg}"
        )

    return response.json().get("html_url")
