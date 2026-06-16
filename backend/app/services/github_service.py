import requests


def fetch_pr_details(owner, repo, pull_number, github_token=None):

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

def fetch_pr_files(owner, repo, pull_number, github_token=None):

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

    for file in files_data:

        changed_files.append({
            "filename": file.get("filename"),
            "status": file.get("status"),
            "additions": file.get("additions"),
            "deletions": file.get("deletions"),
            "changes": file.get("changes"),
            "patch": file.get("patch")
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
def post_pr_comment(owner, repo, pull_number, comment_body, github_token):
    """
    Post a formatted AI review as a comment on a GitHub Pull Request.

    Args:
        owner        : GitHub repo owner  e.g. "facebook"
        repo         : GitHub repo name   e.g. "react"
        pull_number  : PR number          e.g. 36487
        comment_body : Markdown text to post as the comment
        github_token : GitHub Personal Access Token (needs repo scope)

    Returns:
        The HTML URL of the posted comment (direct link to the comment on GitHub)
    """
    url = f"https://api.github.com/repos/{owner}/{repo}/issues/{pull_number}/comments"

    headers = {
        "Accept": "application/vnd.github+json",
        "Authorization": f"Bearer {github_token}",
        "User-Agent": "AI-PR-Reviewer"
    }

    response = requests.post(url, headers=headers, json={"body": comment_body})

    # GitHub returns 201 Created on success
    if response.status_code != 201:
        error_msg = response.json().get("message", "Unknown error")
        raise Exception(
            f"Failed to post GitHub comment: {response.status_code} — {error_msg}"
        )

    return response.json().get("html_url")