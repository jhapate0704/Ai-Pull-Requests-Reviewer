from urllib.parse import urlparse


def parse_pr_url(pr_url: str):
    """
    Extract owner, repo, and PR number
    from GitHub Pull Request URL.
    """

    try:
        parsed_url = urlparse(pr_url)

        path_parts = parsed_url.path.strip("/").split("/")

        owner = path_parts[0]
        repo = path_parts[1]
        pull_number = int(path_parts[3])

        return {
            "owner": owner,
            "repo": repo,
            "pull_number": pull_number
        }

    except Exception:
        raise ValueError("Invalid GitHub Pull Request URL")