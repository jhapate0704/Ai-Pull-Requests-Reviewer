"""
File: pr_parser.py

Purpose:
Utility for parsing GitHub Pull Request URLs.

Responsibilities:
- Parse a given GitHub Pull Request URL string.
- Deconstruct it into owner, repository name, and pull request numeric identifier.
- Validate the URL structure and throw a clear ValueError if parsing fails.

Dependencies:
- urllib.parse
"""

from urllib.parse import urlparse

def parse_pr_url(pr_url: str) -> dict:
    """
    Extracts the repository owner, repository name, and pull request number from a GitHub Pull Request URL.

    Why:
    Endpoints and GitHub API services receive full user-entered PR links. This utility
    breaks down the URL into variables required for downstream GitHub API queries.

    What happens:
    Parses the URL path using urlparse, splits the path by '/' characters, and extracts:
    - Index 0: Owner (organization or user)
    - Index 1: Repo name
    - Index 3: Pull Request numeric ID
    Raises ValueError if parsing indices fail or PR ID is not an integer.

    Args:
        pr_url (str): The full GitHub PR URL (e.g., https://github.com/owner/repo/pull/123).

    Returns:
        dict: A dictionary containing:
            - 'owner' (str): The owner/organization.
            - 'repo' (str): The repository name.
            - 'pull_number' (int): The Pull Request identifier number.

    Raises:
        ValueError: If the input URL is malformed or does not contain a valid PR number structure.
    """
    try:
        parsed_url = urlparse(pr_url)
        # Strip forward slashes and split path into component segments
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
        # Catch indexing/type conversion exceptions and surface as a simple validation error
        raise ValueError("Invalid GitHub Pull Request URL")