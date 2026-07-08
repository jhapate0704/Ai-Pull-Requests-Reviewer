<div align="center">

# 🤖 AI PR Reviewer

[![GitHub issues](https://img.shields.io/github/issues/jhapate0704/Ai-Pull-Requests-Reviewer?style=for-the-badge)](https://github.com/jhapate0704/Ai-Pull-Requests-Reviewer/issues)
[![GitHub forks](https://img.shields.io/github/forks/jhapate0704/Ai-Pull-Requests-Reviewer?style=for-the-badge)](https://github.com/jhapate0704/Ai-Pull-Requests-Reviewer/network)
[![GitHub stars](https://img.shields.io/github/stars/jhapate0704/Ai-Pull-Requests-Reviewer?style=for-the-badge)](https://github.com/jhapate0704/Ai-Pull-Requests-Reviewer/stargazers)
[![GitHub license](https://img.shields.io/github/license/jhapate0704/Ai-Pull-Requests-Reviewer?style=for-the-badge)](https://github.com/jhapate0704/Ai-Pull-Requests-Reviewer/blob/main/LICENSE)
[![Build Status](https://img.shields.io/badge/build-passing-brightgreen?style=for-the-badge)](#)
[![Version](https://img.shields.io/badge/version-1.0.0-blue?style=for-the-badge)](#)

<!-- Placeholder for Project Logo -->
<!-- <img src="logo_placeholder.png" width="150" alt="AI PR Reviewer Logo"> -->

<!-- Banner Image Placeholder -->
<img src="https://github.com/user-attachments/assets/6dfa2553-7062-4edc-a969-cdc0512a4cb8" alt="Banner Image" width="100%" />

An intelligent, full-stack application that automates code reviews using advanced Large Language Models via the Groq API. It fetches GitHub Pull Requests, analyzes code diffs file-by-file for bugs, security vulnerabilities, and code quality issues, and provides actionable suggestions directly on GitHub.

[Explore the Live Demo (Placeholder)](#) · [Report Bug](https://github.com/jhapate0704/Ai-Pull-Requests-Reviewer/issues) · [Request Feature](https://github.com/jhapate0704/Ai-Pull-Requests-Reviewer/issues)

</div>

---

## 📑 Table of Contents
<details>
<summary>Click to expand</summary>

1. [Project Description](#-project-description)
2. [Live Demo](#-live-demo)
3. [Screenshots](#-screenshots)
4. [Features](#-features)
5. [Why this project was built](#-why-this-project-was-built)
6. [Tech Stack](#-tech-stack)
7. [Architecture Overview](#-architecture-overview)
8. [Folder Structure](#-folder-structure)
9. [Installation](#-installation)
10. [Running Locally](#-running-locally)
11. [Production Build](#-production-build)
12. [Available Scripts](#-available-scripts)
13. [Project Structure Explanation](#-project-structure-explanation)
14. [Routing Overview](#-routing-overview)
15. [API Documentation](#-api-documentation)
16. [Database Schema Overview](#-database-schema-overview)
17. [Authentication Flow](#-authentication-flow)
18. [State Management](#-state-management)
19. [Reusable Components](#-reusable-components)
20. [Custom Hooks](#-custom-hooks)
21. [Utilities](#-utilities)
22. [Third-Party Libraries](#-third-party-libraries)
23. [AI Integrations](#-ai-integrations)
24. [Deployment Guide](#-deployment-guide)
25. [Docker Setup](#-docker-setup)
26. [Performance Optimizations](#-performance-optimizations)
27. [Security Features](#-security-features)
28. [Responsive Design Notes](#-responsive-design-notes)
29. [Browser Compatibility](#-browser-compatibility)
30. [Accessibility Features](#-accessibility-features)
31. [Error Handling Strategy](#-error-handling-strategy)
32. [Logging](#-logging)
33. [Validation](#-validation)
34. [Testing](#-testing)
35. [Debugging Tips](#-debugging-tips)
36. [Common Issues & Solutions](#-common-issues--solutions)
37. [Project Roadmap](#-project-roadmap)
38. [Contributing Guide](#-contributing-guide)
39. [License & Credits](#-license--credits)
40. [Author Information](#-author-information)

</details>

---

## 📝 Project Description

**AI PR Reviewer** replaces expensive automated code review tools by providing the same core functionalities entirely for free. Connect your GitHub repository, and the AI will analyze pull requests, generate meaningful review comments, catch security bugs, and suggest code improvements automatically. No expensive subscriptions, no hidden charges.

## 🌐 Live Demo

*(Update if needed)* - A live version of this application is hosted at: `[Insert Live Link Here]`

## 📸 Screenshots

| Dashboard | AI Review |
| :---: | :---: |
| <img src="https://github.com/user-attachments/assets/98068765-5512-4bc1-9ac3-8077178f16ce" alt="Dashboard" width="100%"> | <img src="https://github.com/user-attachments/assets/b9c66ebf-4f99-4021-9548-e88caa162384" alt="AI Review" width="100%"> |

| Automations | OAuth Login |
| :---: | :---: |
| <img src="https://github.com/user-attachments/assets/7c7009d1-cb6a-4dad-8083-5267c5bcdb0d" alt="Automations" width="100%"> | <img src="https://github.com/user-attachments/assets/df68b9b2-00d6-4d9f-9b68-88dad946f440" alt="Login" width="100%"> |

## ✨ Features

*   **Detailed File-by-File Review**: Processes each file's diff individually ensuring context is maintained.
*   **Quality Scoring Algorithm**: Deterministic PR Score (0-100) based on severity metrics (Critical, High, Medium, Low).
*   **Direct Fix Suggestions**: AI offers actionable code snippets (`💡 Fix: ...`).
*   **Contextual Markdown Comments**: Automatically formats and posts AI reviews to GitHub PRs natively.
*   **Zero-Click Reviews via Webhooks**: Listens to GitHub `pull_request` events for fully automated background reviews.
*   **Reporting**: Export complete AI reviews as Markdown or PDF files.
*   **Analytics Dashboard**: Visualizes repository health over time.
*   **Dynamic Theming**: First-class support for Light and Dark modes.

## 🤔 Why this project was built

Many existing AI-driven PR reviewers are heavily monetized, keeping critical code quality and security feedback behind paywalls (e.g., $24/month+). This project democratizes AI code analysis, giving developers a robust, self-hosted, and free alternative utilizing the speed of Groq APIs and the power of LLaMA models.

## 🛠 Tech Stack

### Frontend
*   **React 19**
*   **Vite** (Build Tool)
*   **Tailwind CSS v4** (Styling)

### Backend
*   **Python 3.10+**
*   **FastAPI**
*   **SQLAlchemy** (ORM)
*   **PostgreSQL** (Database)

### Integrations & AI
*   **Groq API** (LLaMA 3.3 70B inference)
*   **PyGithub** & GitHub OAuth

---

## 🏛 Architecture Overview

The system follows a decoupled client-server architecture:
1.  **Frontend (React/Vite)**: Serves the user interface, handles OAuth flows, and communicates with the FastAPI backend.
2.  **Backend (FastAPI)**: Exposes RESTful APIs, interacts with the PostgreSQL database, and handles secure webhook events from GitHub.
3.  **AI Engine**: The backend calls the Groq API for rapid inference on code diffs, processing the output into structured findings.
4.  **GitHub API**: The application directly reads PR data and posts comments to GitHub.

---

## 📂 Folder Structure

```text
AI_PR_Reviewer/
├── backend/
│   ├── app/
│   │   ├── services/
│   │   │   ├── ai_review_service.py
│   │   │   ├── github_service.py
│   │   │   └── pr_parser.py
│   │   ├── auth.py
│   │   ├── database.py
│   │   ├── main.py
│   │   └── models.py
│   ├── .env
│   ├── migrate_db.py
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── layout/
│   │   │   ├── review/
│   │   │   └── ui/
│   │   ├── hooks/
│   │   ├── pages/
│   │   │   ├── AutomationsPage.jsx
│   │   │   ├── DashboardPage.jsx
│   │   │   └── ReviewPage.jsx
│   │   ├── services/
│   │   ├── utils/
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── eslint.config.js
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.js (or implied via v4)
│   └── vite.config.js
├── .gitignore
└── README.md
```

---

## 🚀 Installation

### 📋 Prerequisites

*   Node.js (v18+)
*   Python (v3.10+)
*   PostgreSQL
*   [Groq API Key](https://console.groq.com/keys)
*   GitHub OAuth App Credentials

### 🔐 Environment Variables

Create `.env` files in both backend and frontend directories.

**`backend/.env`**
```env
DATABASE_URL=postgresql://user:password@localhost:5432/dbname
GROQ_API_KEY=gsk_your_groq_api_key_here
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
JWT_SECRET_KEY=your_super_secret_jwt_key
```

**`frontend/.env`**
```env
VITE_GITHUB_CLIENT_ID=your_github_client_id
```

---

## 💻 Running Locally

### Backend Setup
```bash
cd backend
python -m venv venv

# Activate venv (Windows)
venv\Scripts\activate
# Activate venv (Mac/Linux)
source venv/bin/activate

pip install -r requirements.txt
python migrate_db.py # If migrations are necessary
uvicorn app.main:app --reload
```
*Backend runs on `http://localhost:8000`*

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
*Frontend runs on `http://localhost:5173`*

---

## 🏗 Production Build

To build the frontend for production deployment:
```bash
cd frontend
npm run build
npm run preview # To preview the production build locally
```

## 📜 Available Scripts

### Frontend (`frontend/package.json`)
*   `npm run dev`: Starts the Vite development server.
*   `npm run build`: Bundles the React application for production.
*   `npm run lint`: Runs ESLint to check for code issues.
*   `npm run preview`: Serves the production build locally.

---

## 🏗 Project Structure Explanation

*   **`backend/app/main.py`**: The core API router. Handles webhook routing, GitHub comment formatting, and initializes FastAPI.
*   **`backend/app/models.py`**: Defines SQLAlchemy ORM models (`User`, `ReviewHistory`).
*   **`backend/app/auth.py`**: Handles symmetric token encryption, JWT generation, and OAuth validation.
*   **`backend/app/services/`**: Encapsulates business logic (GitHub communication, AI prompt generation).
*   **`frontend/src/App.jsx`**: Global layout, router wrapper, and state provider.
*   **`frontend/src/components/`**: Reusable UI components grouped by feature (`layout`, `review`, `ui`).
*   **`frontend/src/pages/`**: Main route views.

## 🚦 Routing Overview

### Frontend
*   `/` - Dashboard / Home (Analytics visualization)
*   `/review` - Manual PR Review Interface
*   `/automations` - Webhook configuration and instructions

### Backend API
*   `GET /auth/github` - Handles OAuth callbacks
*   `POST /ai-review` - Triggers a manual PR review
*   `POST /post-review` - Posts the generated review to GitHub
*   `POST /webhook/{user_id}` - GitHub Webhook receiver
*   `GET /analytics` - Fetches PR analytical data for dashboards

## 📚 API Documentation

FastAPI auto-generates Swagger UI documentation. When running locally, visit:
*   **Swagger UI**: `http://localhost:8000/docs`
*   **ReDoc**: `http://localhost:8000/redoc`

## 🗄 Database Schema Overview

*   **User Table**: Stores user ID, encrypted GitHub access tokens, and profile data.
*   **ReviewHistory Table**: Logs PRs reviewed, scores assigned, timestamps, and findings summaries for the Analytics Dashboard.

## 🔐 Authentication Flow

1.  User clicks "Login with GitHub" on the frontend.
2.  Redirects to GitHub OAuth authorization.
3.  GitHub redirects back to the Frontend with a temporary `code`.
4.  Frontend sends `code` to Backend `/auth/github`.
5.  Backend swaps `code` for an Access Token, encrypts it, and saves it to PostgreSQL.
6.  Backend returns a JWT to the Frontend.
7.  Frontend uses the JWT in the `Authorization: Bearer <token>` header for subsequent requests.

## 🧠 State Management

The application leverages React's built-in Context API and localized custom hooks (`useState`, `useEffect`) to manage state, minimizing dependency bloat by avoiding Redux or Zustand.

## 🧩 Reusable Components
*   **Sidebar (`layout/Sidebar.jsx`)**: Responsive navigation and theme toggling.
*   **HistoryPanel (`ui/HistoryPanel.jsx`)**: Slide-out drawer for local review history.

## 🪝 Custom Hooks
*   `useTheme`: Manages light/dark mode preference via `localStorage` and Tailwind classes.
*   `useReviewHistory`: Syncs past PR reviews to browser storage for offline/fast access.

## 🛠 Utilities
*   `pr_parser.py`: Parses arbitrary GitHub URLs into `owner`, `repo`, and `pr_number`.

## 📦 Third-Party Libraries

*   **FastAPI & Uvicorn**: High-performance backend routing.
*   **SQLAlchemy & psycopg2**: Robust relational database management.
*   **PyGithub**: Native Python integration with GitHub REST APIs.
*   **Groq**: Blazing fast AI inference using LPU tech.
*   **React 19 & Vite**: Ultra-fast frontend development experience.
*   **Tailwind CSS 4**: Utility-first styling.

## 🤖 AI Integrations

The core review engine relies on the **Groq API** (defaulting to LLaMA 3.3 70B or similar models) to process code diffs. Prompts are strictly engineered to categorize findings into Bugs, Security, Edge Cases, and Quality improvements, returning standardized data structures.

---

## 🚀 Deployment Guide

*(Optional / Update if needed)*

### Backend (e.g., Render, Railway, AWS)
1.  Connect repository and deploy the `backend` folder.
2.  Set `Start Command` to: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
3.  Inject all backend `.env` variables in the hosting dashboard.

### Frontend (e.g., Vercel, Netlify)
1.  Connect repository and set root directory to `frontend`.
2.  Build command: `npm run build`
3.  Output directory: `dist`
4.  Add `VITE_GITHUB_CLIENT_ID` to environment variables.

## 🐳 Docker Setup

*(Optional / Placeholder - Add your Dockerfile and docker-compose.yml instructions here if implemented in the future).*

---

## ⚡ Performance Optimizations

*   **FastAPI Background Tasks**: Webhooks immediately return `202 Accepted` to GitHub while processing the LLM request asynchronously, preventing timeout drops.
*   **Groq LPU**: Ensures LLM responses are generated in seconds, vastly outperforming standard GPU-based inference endpoints.
*   **Vite**: Ensures near-instant HMR (Hot Module Replacement) during frontend development.

## 🛡 Security Features

*   **Symmetric Token Encryption**: GitHub Personal Access Tokens and OAuth tokens are encrypted via `itsdangerous` or `cryptography` before hitting the database.
*   **HMAC SHA-256 Validation**: Webhooks are cryptographically validated against `GITHUB_WEBHOOK_SECRET` to prevent forged payloads.
*   **JWT Sessions**: API endpoints are protected using short-lived JWTs.

## 📱 Responsive Design Notes

Tailwind's mobile-first breakpoints are heavily utilized. The Sidebar collapses into a hamburger menu on mobile devices, and complex data tables in the dashboard gracefully switch to vertical flex lists on small screens.

## 🌍 Browser Compatibility

Tested and working on all modern browsers: Chrome, Firefox, Safari, and Edge.

## ♿ Accessibility Features

*   Semantic HTML markup.
*   ARIA labels for interactive elements without text content.
*   High contrast ratios in both Light and Dark modes.

---

## 🐛 Error Handling Strategy

*   **Backend**: Broad `HTTPException` usage mapped to specific frontend toast notifications.
*   **Frontend**: API request wrappers capture errors and display user-friendly messages via UI components.

## 📊 Logging

*   Basic `logging` is utilized in the FastAPI backend to track webhook successes/failures and LLM inference timings.

## ✅ Validation

*   **Pydantic Models**: Strictly validates all incoming HTTP requests payload structures before they hit the controller logic.

## 🧪 Testing

*(Optional - Update if needed)*
*   Currently utilizes standard manual testing flows. Future updates will include `pytest` for backend coverage and `Vitest` for frontend component tests.

## 🐞 Debugging Tips

*   **Webhook Issues**: Use [smee.io](https://smee.io/) to forward GitHub webhooks to your `localhost` during development.
*   **AI Timeouts**: Ensure your PRs aren't excessively large (e.g., 50+ files modified heavily), as it might exceed the LLM's context window.

## ❓ Common Issues & Solutions

**Q: GitHub webhook fails with timeout.**
A: Ensure your backend uses `BackgroundTasks` properly, as GitHub expects a response within 10 seconds.

**Q: CORS Error on Login.**
A: Ensure your frontend domain is explicitly listed in the FastAPI `CORSMiddleware` configuration.

---

## 🗺 Project Roadmap

- [x] GitHub OAuth Integration
- [x] Basic AI Review generation
- [x] Automated PR Commenting
- [x] Analytics Dashboard
- [ ] Support for GitLab and BitBucket
- [ ] Custom system prompts tailored to specific organizational coding standards
- [ ] Full Docker support

## 🔮 Future Improvements
*   Implement vector embeddings to give the AI context of the *entire* codebase, not just the diff.
*   Add multi-language localization (i18n).

---

## 🤝 Contributing Guide

1.  Fork the project.
2.  Create your feature branch (`git checkout -b feature/AmazingFeature`).
3.  Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4.  Push to the branch (`git push origin feature/AmazingFeature`).
5.  Open a Pull Request.

## 📏 Coding Standards
*   Python: PEP 8 compliant, enforce with `black` and `flake8`.
*   JavaScript/React: Airbnb style guide via ESLint.

## 🌳 Git Workflow
We use the standard GitHub Flow: Branch from `main`, open a PR, review, merge.

---

## 📄 License & Credits

Distributed under the **MIT License**. See `LICENSE` for more information.

## 🙏 Acknowledgements

*   [Groq](https://groq.com/) for lightning-fast inference APIs.
*   [FastAPI](https://fastapi.tiangolo.com/) & [React](https://react.dev/) ecosystems.

## 📬 Contact Information

**Niraj Jhapte**
*   GitHub: [@jhapate0704](https://github.com/jhapate0704)

## 🔗 Social Links
*   [GitHub Profile](https://github.com/jhapate0704)

## 👤 Author Information
Copyright © 2026 [Niraj Jhapate](https://github.com/jhapate0704). All rights reserved.

## 💬 Support
For support, email `your.email@example.com` or open an issue in the repository.

## ⭐️ Star the Repository
If you found this project helpful or use it in your daily workflow, please consider giving it a star on GitHub! It helps others find the project.

---

## 📝 Changelog
*(Placeholder - see `CHANGELOG.md` for historical details)*

## 🏷 Version History
*   `v1.0.0` - Initial Release: OAuth, Webhooks, AI Reviews, Dashboards.

## 🚧 Known Limitations
*   Extremely large Pull Requests (100+ files) may cause the AI context window to be exceeded. It is highly recommended to review smaller, atomic PRs.

## 🚑 Troubleshooting Guide
If the AI review does not post to your PR:
1.  Verify your Groq API Key limit hasn't been exhausted.
2.  Ensure your GitHub OAuth application has `repo` and `pull_requests:write` permissions.
3.  Check backend server logs for validation or network errors.

---
</div>
