import requests


def fetch_pr_details(owner, repo, pull_number):

    url = f"https://api.github.com/repos/{owner}/{repo}/pulls/{pull_number}"

    headers = {
        "Accept": "application/vnd.github+json",
        "User-Agent": "AI-PR-Reviewer"
    }

    response = requests.get(url, headers=headers)

    print("Status Code:", response.status_code)
    print("Response:", response.text)

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

def fetch_pr_files(owner, repo, pull_number):

    url = (
        f"https://api.github.com/repos/"
        f"{owner}/{repo}/pulls/"
        f"{pull_number}/files"
    )

    headers = {
        "Accept": "application/vnd.github+json",
        "User-Agent": "AI-PR-Reviewer"
    }

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