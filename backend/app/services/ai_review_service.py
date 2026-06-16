import os
from dotenv import load_dotenv
from groq import Groq

load_dotenv("backend/.env")

api_key = os.getenv("GROQ_API_KEY")
client = Groq(api_key=api_key)

# -----------------------------------------------------------------------
# FEATURE #3 — Language-Aware Hints
#
# Instead of one generic prompt, each file extension gets specific focus.
# Example:
#   auth.py   → AI focuses on exception handling, SQL injection, type hints
#   index.js  → AI focuses on XSS, async race conditions, memory leaks
#   query.sql → AI focuses on N+1 queries, missing indexes, injection
# -----------------------------------------------------------------------
LANGUAGE_HINTS = {
    ".py":         "Focus on: type hints, PEP8, exception handling, SQL injection, async/await misuse.",
    ".js":         "Focus on: XSS vulnerabilities, async race conditions, memory leaks, ES6 best practices.",
    ".ts":         "Focus on: type safety, null/undefined checks, async patterns, interface correctness.",
    ".sql":        "Focus on: SQL injection, N+1 queries, missing indexes, unoptimized joins.",
    ".java":       "Focus on: null pointer exceptions, thread safety, resource leaks, design patterns.",
    ".go":         "Focus on: error handling, goroutine leaks, race conditions, interface design.",
    ".dockerfile": "Focus on: base image vulnerabilities, hardcoded secrets, missing USER directive.",
    ".yaml":       "Focus on: hardcoded secrets, indentation errors, missing required fields.",
    ".yml":        "Focus on: hardcoded secrets, indentation errors, missing required fields.",
    ".sh":         "Focus on: unquoted variables, command injection, missing error handling.",
    ".env":        "Focus on: hardcoded secrets, sensitive data exposure.",
}

def get_language_hint(filename: str) -> str:
    """Return a language-specific review hint based on the file extension."""
    if "." in filename:
        ext = "." + filename.rsplit(".", 1)[-1].lower()
        return LANGUAGE_HINTS.get(ext, "Focus on general code quality, security, and best practices.")
    return "Focus on general code quality, security, and best practices."


# -----------------------------------------------------------------------
# FEATURE #2 + #3 — Per-File Review with Severity Scoring
#
# OLD approach (before):
#   All files → ONE giant prompt → ONE generic JSON blob
#   Result: AI gets confused, misses language-specific issues
#
# NEW approach (now):
#   Each file → its OWN prompt → structured JSON with severity per issue
#   Result: Precise, language-aware, prioritised feedback
#
# Each issue now returns:
#   {
#     "issue":      "SQL injection via f-string on line 12",
#     "severity":   "CRITICAL",
#     "suggestion": "Use parameterized queries instead"
#   }
#
# Severity levels:
#   CRITICAL → Will crash or corrupt data in production        🔴
#   HIGH     → Security vulnerability or serious logic bug     🟠
#   MEDIUM   → May fail under edge conditions                  🟡
#   LOW      → Style, readability, or minor optimisation       🟢
# -----------------------------------------------------------------------
def review_code_diff(filename: str, code_diff: str) -> str:
    """
    Review a SINGLE file's diff using Groq AI.

    Args:
        filename  : Name of the file being reviewed e.g. "auth.py"
        code_diff : The raw git patch/diff for THIS file only

    Returns:
        JSON string with categorised issues, each having severity + suggestion
    """
    language_hint = get_language_hint(filename)

    prompt = f"""
You are a senior software engineer reviewing a GitHub Pull Request.

File under review: {filename}
Language-specific focus: {language_hint}

Analyse the code diff carefully. Return ONLY valid JSON — no markdown, no extra text.

Exact JSON structure to return:
{{
  "bugs": [
    {{"issue": "brief description", "severity": "CRITICAL", "suggestion": "how to fix"}}
  ],
  "security_issues": [
    {{"issue": "brief description", "severity": "HIGH", "suggestion": "how to fix"}}
  ],
  "edge_cases": [
    {{"issue": "brief description", "severity": "MEDIUM", "suggestion": "how to handle"}}
  ],
  "optimizations": [
    {{"issue": "brief description", "severity": "LOW", "suggestion": "how to optimize"}}
  ],
  "code_quality_improvements": [
    {{"issue": "brief description", "severity": "LOW", "suggestion": "improvement"}}
  ]
}}

Severity guide (choose accurately):
- CRITICAL : Crashes or corrupts data in production
- HIGH     : Security vulnerability or serious logic bug
- MEDIUM   : Works now but may break under edge conditions
- LOW      : Style, readability, or minor improvement

Rules:
- Return ONLY the JSON object. No ```json fences, no extra text.
- If a category has no issues, return an empty list [].
- Write "issue" as a FULL clear sentence explaining exactly what is wrong and where (e.g. "The login function on line 12 uses an f-string to build a SQL query, which allows attackers to inject malicious SQL code").
- Write "suggestion" as a FULL actionable sentence telling the developer exactly how to fix it (e.g. "Replace the f-string with a parameterized query using cursor.execute(query, params) to safely handle user input").
- Aim for 1-3 sentences per field. Be specific, clear, and helpful — like a senior engineer explaining to a junior developer.

Code Diff for {filename}:
{code_diff}
"""

    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[{"role": "user", "content": prompt}],
        response_format={"type": "json_object"},
        temperature=0.2
    )

    return response.choices[0].message.content
