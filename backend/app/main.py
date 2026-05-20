from fastapi import FastAPI, HTTPException
from backend.app.services.pr_parser import parse_pr_url
from backend.app.services.github_service import (
    fetch_pr_details,
    fetch_pr_files
)
from backend.app.services.ai_review_service import (review_code_diff)

app = FastAPI(
    title="AI PR Reviewer",
    description="AI-powered GitHub Pull Request Reviewer",
    version="1.0.0"
)


@app.get("/")
def home():
    return {
        "status": "success",
        "message": "AI PR Reviewer backend is running"
    }


@app.get("/parse-pr")
def parse_pull_request(pr_url: str):

    try:
        parsed_data = parse_pr_url(pr_url)

        return {
            "success": True,
            "data": parsed_data
        }

    except ValueError as e:
        raise HTTPException(
            status_code=400,
            detail=str(e)
        )
    
@app.get("/pr-details")
def get_pr_details(pr_url: str):

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
    
@app.get("/pr-files")
def get_pr_files(pr_url: str):

    try:
        parsed_data = parse_pr_url(pr_url)

        files = fetch_pr_files(
            parsed_data["owner"],
            parsed_data["repo"],
            parsed_data["pull_number"]
        )

        return {
            "success": True,
            "files": files
        }

    except Exception as e:
        raise HTTPException(
            status_code=400,
            detail=str(e)
        )
    
@app.get("/ai-review")
def ai_review(pr_url: str):

    try:
        parsed_data = parse_pr_url(pr_url)

        files = fetch_pr_files(
            parsed_data["owner"],
            parsed_data["repo"],
            parsed_data["pull_number"]
        )

        combined_patch = ""

        for file in files:
            if file.get("patch"):
                combined_patch += (
                    f"\nFile: {file['filename']}\n"
                    f"{file['patch']}\n"
                )

        review = review_code_diff(combined_patch)

        return {
            "success": True,
            "review": review
        }

    except Exception as e:
        raise HTTPException(
            status_code=400,
            detail=str(e)
        )