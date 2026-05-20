import os
from dotenv import load_dotenv
from google import genai


load_dotenv("backend/.env")

api_key = os.getenv("GEMINI_API_KEY")

client = genai.Client(api_key=api_key)


def review_code_diff(code_diff):

    prompt = f"""
    You are a senior software engineer reviewing a GitHub Pull Request.

    Analyze the code diff carefully.

    Return ONLY valid JSON in this format:

    {{
      "bugs": [],
      "security_issues": [],
      "edge_cases": [],
      "optimizations": [],
      "code_quality_improvements": []
    }}

    Rules:
    - Return only JSON
    - Keep suggestions concise
    - If no issue exists, return empty list

    Code Diff:

    {code_diff}
    """

    response = client.models.generate_content(
        model="gemini-2.0-flash",
        contents=prompt
    )

    return response.text