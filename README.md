# 🤖 AI PR Reviewer - Comprehensive Documentation

AI PR Reviewer is an intelligent, full-stack application that automates code reviews using advanced Large Language Models via the Groq API. It fetches GitHub Pull Requests, analyzes code diffs file-by-file for bugs, security vulnerabilities, and code quality issues, and provides actionable suggestions.

---

## ✨ Comprehensive Feature List (Small to Big)

### 📄 Reporting & Exporting
*   **Markdown File & PDF Report Generation**: Automatically exports the complete AI review into downloadable Markdown files and beautifully formatted PDF reports, allowing teams to keep offline records of code quality audits and share them easily.

### 🧠 Core AI & Review Engine
*   **Detailed File-by-File Review**: Processes each file's diff individually rather than merging them, ensuring context is accurately maintained, hallucination is minimized, and feedback is highly targeted.
*   **Groq API Integration**: Leverages ultra-fast LPU inference (LLaMA 3.3 70B) for generating reviews in seconds.
*   **Structured Issue Categorization**: AI categorizes findings into strictly defined buckets: Bugs, Security Issues, Edge Cases, Optimizations, and Code Quality Improvements.
*   **Quality Scoring Algorithm**: Calculates a deterministic `PR Score` (0-100) by analyzing the severity of found issues (Critical: -20, High: -10, Medium: -5, Low: -1).
*   **Direct Fix Suggestions**: AI provides actionable code snippets and suggestions (`💡 Fix: ...`) for developers to quickly resolve issues.

### 🔐 Authentication & Security
*   **GitHub OAuth Integration**: Complete OAuth2 flow replacing the need for manual Personal Access Tokens (PATs).
*   **Symmetric Token Encryption**: GitHub tokens are encrypted before being stored in the PostgreSQL database, ensuring user credentials are safe in the event of a breach.
*   **JWT App Sessions**: Authenticated users receive a JWT token for secure communication between the React frontend and FastAPI backend.

### 🤖 GitHub Integration
*   **Contextual Markdown Comments**: Formats the AI's review into a highly readable GitHub comment featuring emojis, collapsible sections, and severity badges (`🔴 Critical`, `🟡 Medium`).
*   **Direct API Posting**: Automatically posts the review comment to the user's Pull Request via `PyGithub`.
*   **PR Metadata Extraction & Display**: Extracts pull request details seamlessly from standard GitHub URLs. The application also provides rich visibility by displaying the **Last Commit hash, number of Changed Files, current PR State (Open/Closed), and the Author's Name** directly in the UI.

### ⚡ Automation & Webhooks
*   **Zero-Click Reviews**: A dedicated `/webhook/{user_id}` endpoint listens for `pull_request` events from GitHub.
*   **Asynchronous Background Tasks**: Webhook events trigger FastAPI `BackgroundTasks`, immediately returning a 202 status to GitHub to prevent timeouts during LLM processing.
*   **HMAC SHA-256 Verification**: Cryptographically verifies webhook payloads to ensure they genuinely originated from GitHub.

### 🎨 Frontend UI & User Experience
*   **Responsive Sidebar Navigation**: A sleek sidebar that adapts to desktop, collapses to icons on tablets, and hides in a hamburger drawer on mobile.
*   **Dynamic Theming**: First-class support for Light and Dark modes, complete with ambient background glow blobs.
*   **Review History Panel**: A slide-out drawer that stores and allows users to revisit past PR reviews from local storage.
*   **Analytics Dashboard**: Visualizes the repository's health over time by pulling data from the `/analytics` backend endpoint.

---

## 📸 Screenshots

*   **Home Page / Full App View**
      
    <img width="1917" height="867" alt="Screenshot 2026-06-17 005330" src="https://github.com/user-attachments/assets/6dfa2553-7062-4edc-a969-cdc0512a4cb8" />

*   **Team Analytical Dashboard**

    <img width="1593" height="862" alt="Screenshot 2026-06-17 005428" src="https://github.com/user-attachments/assets/98068765-5512-4bc1-9ac3-8077178f16ce" />
    
*   **AI Review**
   
    <img width="1507" height="747" alt="Screenshot 2026-06-17 014900" src="https://github.com/user-attachments/assets/b9c66ebf-4f99-4021-9548-e88caa162384" />

*   **Automations Dashboard**
    
    <img width="1588" height="851" alt="Screenshot 2026-06-17 005446" src="https://github.com/user-attachments/assets/7c7009d1-cb6a-4dad-8083-5267c5bcdb0d" />

*   **GitHub OAuth Login**
  
    <img width="558" height="286" alt="Screenshot 2026-06-17 014613" src="https://github.com/user-attachments/assets/df68b9b2-00d6-4d9f-9b68-88dad946f440" />

---

## 📂 File-by-File Codebase Review

### Backend (Python / FastAPI)
*   **`backend/app/main.py`**: The orchestrator. Defines all API routes (`/auth/github`, `/ai-review`, `/post-review`, `/webhook`, `/analytics`). It handles CORS, routes background webhook tasks, and formats the final Markdown comment for GitHub.
*   **`backend/app/auth.py`**: Security module. Contains functions for symmetric encryption/decryption of GitHub tokens, JWT generation, and a FastAPI dependency to protect routes.
*   **`backend/app/database.py`**: SQLAlchemy configuration. Sets up the PostgreSQL engine and provides a session generator for dependency injection.
*   **`backend/app/models.py`**: Defines the database schema. Contains the `User` model and the `ReviewHistory` model.
*   **`backend/app/services/pr_parser.py`**: Utility for parsing raw GitHub URLs to extract the owner, repo, and pull number.
*   **`backend/app/services/github_service.py`**: Abstraction layer for `PyGithub`. Handles fetching diffs and posting comments.
*   **`backend/app/services/ai_review_service.py`**: The AI core. Constructs prompts for the Groq API and handles the inference cycle.

### Frontend (React / Vite)
*   **`frontend/src/App.jsx`**: The root layout component. Manages global state (tokens, UI state). Handles OAuth redirect logic and renders main layout.
*   **`frontend/src/index.css`**: Global stylesheet containing Tailwind directives.
*   **`frontend/src/hooks/useTheme.js` & `useReviewHistory.js`**: Custom hooks for managing Dark/Light modes and persisting review history locally.
*   **`frontend/src/components/layout/Sidebar.jsx`**: Contains navigation logic, Avatar display, OAuth login/logout, and theme toggles.
*   **`frontend/src/components/ui/HistoryPanel.jsx`**: Slide-out UI for past review records.
*   **`frontend/src/pages/ReviewPage.jsx`**: Core view where users submit PR URLs and read structured reviews.
*   **`frontend/src/pages/DashboardPage.jsx` & `AutomationsPage.jsx`**: Dashboard displaying historical analytics metrics and instructions for webhook setups.

---

## 🚀 Setup & Installation

### Prerequisites
*   Node.js (v18+) & Python (v3.10+)
*   PostgreSQL
*   Groq API Key
*   GitHub OAuth App Credentials

### Local Development
1. **Backend**:
    ```bash
    cd backend
    python -m venv venv
    source venv/bin/activate
    pip install -r requirements.txt
    ```
2. **Frontend**:
    ```bash
    cd frontend
    npm install
    ```
3. **Run**: Use `uvicorn app.main:app --reload` for the backend and `npm run dev` for the frontend.

---

## ⚙️ Environment Variables

To run this application locally, you will need to set up environment variables for both the backend and frontend.

### Backend Variables (`backend/.env`)
| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | Your PostgreSQL connection string (e.g., `postgresql://user:password@localhost/dbname`). |
| `GROQ_API_KEY` | Your API key from Groq to enable the LLaMA inference engine. |
| `GITHUB_CLIENT_ID` | The Client ID provided by your GitHub OAuth Application. |
| `GITHUB_CLIENT_SECRET` | The Client Secret provided by your GitHub OAuth Application. |
| `JWT_SECRET_KEY` | A random secure string used to sign JSON Web Tokens for user sessions. |

### Frontend Variables (`frontend/.env`)
| Variable | Description |
|----------|-------------|
| `VITE_GITHUB_CLIENT_ID` | The same Client ID from your GitHub OAuth App, exposed to Vite to initiate the login redirect. |

---

## 📌 Other Information

*   **Contributing**: We welcome pull requests! Please ensure you test locally before submitting changes.
*   **Security Notes**: Never commit your `.env` files to version control. The repository includes a `.gitignore` to prevent accidental leaks.
*   **Limitations**: Extremely large PRs (over 100+ changed files) may hit GitHub API rate limits or Groq context windows. It is recommended to keep PRs small and focused.
*   **License**: Distributed under the MIT License.

---

## 👤 Author

**Niraj Jhapte**
- GitHub: [@ jhapate0704](https://github.com/jhapate0704)
- Copyright © 2026 [Niraj Jhapate](https://github.com/jhapate0704). All rights reserved.

---

