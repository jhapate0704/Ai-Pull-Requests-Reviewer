# 🤖 AI PR Reviewer

An AI-powered GitHub Pull Request Reviewer that analyzes code changes from a GitHub Pull Request and provides intelligent feedback using Gemini AI.

This project automatically fetches Pull Request details, extracts changed code, and generates AI-based code review suggestions including:

- 🐞 Bug Detection
- 🔒 Security Issue Detection
- ⚠️ Edge Case Identification
- ⚡ Optimization Suggestions
- 🧹 Code Quality Improvements

Built as an internship/portfolio project to demonstrate practical implementation of:

**FastAPI + Streamlit + GitHub API + Gemini AI + Prompt Engineering**

---

## 🚀 Features

✅ Analyze GitHub Pull Requests using a PR URL

✅ Fetch Pull Request metadata

✅ Retrieve changed files and code diffs

✅ AI-powered code review using Gemini AI

✅ Detect:
- Bugs
- Security Issues
- Missing Edge Cases
- Optimization Opportunities
- Code Quality Improvements

✅ Interactive frontend using Streamlit

✅ Modular backend architecture using FastAPI

---

## 🛠️ Tech Stack

### Backend
- **Python**
- **FastAPI**
- **Uvicorn**

### Frontend
- **Streamlit**

### APIs & AI
- **GitHub REST API**
- **Google Gemini API**

### Libraries Used
- `requests`
- `python-dotenv`
- `google-genai`
- `urllib`

---

## 🏗️ Project Architecture

```text
User Enters PR URL
          ↓
Frontend (Streamlit UI)
          ↓
FastAPI Backend
          ↓
PR URL Parser
          ↓
GitHub API Service
          ↓
Extract Code Diff
          ↓
Gemini AI Review
          ↓
JSON Response
          ↓
Frontend Displays Review
```

---

## 📂 Project Structure

```text
AI_PR_Reviewer/
│
├── backend/
│   ├── app/
│   │   ├── services/
│   │   │   ├── ai_review_service.py
│   │   │   ├── github_service.py
│   │   │   └── pr_parser.py
│   │   │
│   │   └── main.py
│   │
│   └── .env
│
├── frontend/
│   └── app.py
│
├── requirements.txt
├── .gitignore
└── README.md
```

---

## ⚙️ How It Works

### 1. User enters a GitHub Pull Request URL

Example:

```text
https://github.com/facebook/react/pull/36487
```

### 2. PR URL Parsing

The system extracts:

- Repository Owner
- Repository Name
- Pull Request Number

Example:

```json
{
  "owner": "facebook",
  "repo": "react",
  "pull_number": 36487
}
```

### 3. GitHub API Fetching

The application fetches:

- PR title
- Author
- State
- Changed files
- Code diffs (patches)

### 4. AI Review Generation

The extracted code diff is sent to **Gemini AI**, which reviews the code and returns feedback in structured JSON format.

Example:

```json
{
  "bugs": [
    "Potential null handling issue"
  ],
  "security_issues": [],
  "edge_cases": [
    "Empty input handling missing"
  ],
  "optimizations": [],
  "code_quality_improvements": []
}
```

---

## 🔑 Environment Variables Setup

Create a `.env` file inside the `backend` folder.

Example:

```env
GEMINI_API_KEY=your_api_key_here
```

Get your Gemini API key from:

https://aistudio.google.com/

---

## 💻 Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/Lalita0008/AI_PR_Reviewer.git
```

### 2. Move into Project Folder

```bash
cd AI_PR_Reviewer
```

### 3. Create Virtual Environment

```bash
python -m venv venv
```

### 4. Activate Virtual Environment

#### Windows

```bash
venv\Scripts\activate
```

#### Mac/Linux

```bash
source venv/bin/activate
```

### 5. Install Dependencies

```bash
pip install -r requirements.txt
```

---

## ▶️ Run the Backend Server

Run FastAPI server:

```bash
uvicorn backend.app.main:app --reload
```

Backend runs on:

```text
http://127.0.0.1:8000
```

---

## ▶️ Run the Frontend

Open a new terminal and run:

```bash
streamlit run frontend/app.py
```

Frontend runs on:

```text
http://localhost:8501
```

---

## 📌 API Endpoints

### Home Endpoint

```http
GET /
```

Returns backend status.

---

### Parse PR URL

```http
GET /parse-pr
```

Example:

```text
/parse-pr?pr_url=<github_pr_url>
```

---

### Fetch PR Details

```http
GET /pr-details
```

Returns:

- Title
- Author
- State
- Changed Files Count

---

### Fetch PR Files

```http
GET /pr-files
```

Returns changed files and patches.

---

### AI Review Endpoint

```http
GET /ai-review
```

Returns AI-generated code review.

---



## 🔮 Future Improvements

- Add support for private repositories
- Real GitHub PR commenting integration
- Better UI for displaying review categories
- Severity scoring for issues
- More accurate AI code analysis

---

## 👩‍💻 Learning Outcomes

This project helped in learning:

- REST APIs
- FastAPI Development
- Streamlit UI Development
- API Integration
- GitHub API
- Prompt Engineering
- Gemini AI Integration
- Environment Variables Handling
- Modular Project Structure

---

## 👩‍💻 Author

**Lalita Jhapate**

AI & Machine Learning Student

