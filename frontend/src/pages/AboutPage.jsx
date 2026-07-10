export default function AboutPage() {
  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8 border-b border-gray-200 pb-5 dark:border-white/10">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">About & Help</h1>
        <p className="mt-2 text-lg text-gray-600 dark:text-gray-300">
          Everything you need to know to use the AI PR Reviewer effectively.
        </p>
      </div>

      <div className="space-y-8">
        {/* Core Features */}
        <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-gray-800/40">
          <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">🔍 Reviewing Pull Requests</h2>
          <div className="space-y-3 text-gray-600 dark:text-gray-300 text-sm">
            <p><strong>1. Get a URL:</strong> Copy any public or private GitHub Pull Request URL (e.g. <code>https://github.com/owner/repo/pull/1</code>).</p>
            <p><strong>2. Paste & Review:</strong> Navigate to the <strong>Review</strong> tab, paste the URL into the search bar, and click <strong>Review PR</strong>.</p>
            <p><strong>3. View Findings:</strong> The AI will analyze every changed file and display a Quality Score alongside individual file cards detailing bugs, security issues, and performance improvements.</p>
            <p><strong>4. Post to GitHub:</strong> If you are logged in via GitHub, you can click <strong>Post Review to GitHub</strong> to automatically add the AI's feedback as a comment on the actual PR.</p>
          </div>
        </section>

        {/* Dashboard */}
        <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-gray-800/40">
          <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">📊 Dashboard & Analytics</h2>
          <div className="space-y-3 text-gray-600 dark:text-gray-300 text-sm">
            <p>The <strong>Dashboard</strong> provides a high-level overview of your code quality over time.</p>
            <ul className="list-inside list-disc space-y-2 ml-2">
              <li><strong>Average PR Score:</strong> Tracks the overall health of your merged code.</li>
              <li><strong>Critical Issues Caught:</strong> Shows how many severe bugs the AI prevented.</li>
              <li><strong>Recent Reviews:</strong> A quick access list to reopen and inspect past PR reviews.</li>
            </ul>
          </div>
        </section>

        {/* Automations */}
        <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-gray-800/40">
          <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">⚡ Automations (Webhooks)</h2>
          <div className="space-y-3 text-gray-600 dark:text-gray-300 text-sm">
            <p>You can set up GitHub Webhooks to have the AI automatically review PRs as soon as they are opened.</p>
            <p>Navigate to the <strong>Automations</strong> tab, log in with GitHub, select a repository, and click <strong>Enable Webhook</strong>.</p>
            <p>Once enabled, the AI will automatically post comments on any new PRs in that repository without you needing to open this app!</p>
          </div>
        </section>

        {/* Additional Features */}
        <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-gray-800/40">
          <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">🛠️ Additional Features</h2>
          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">Export to PDF/Markdown</h3>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                Inside any completed review, click the <strong>Export</strong> button to download the findings as a Markdown file or print them to a PDF report to share with your team.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">History Drawer</h3>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                Click the <strong>History</strong> button in the sidebar (or top right on mobile) to slide out a panel containing all your previously reviewed PRs. You can reload them instantly without re-fetching from the AI.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">Dark Mode</h3>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                Toggle the moon/sun icon in the sidebar to switch between light and dark themes. The app remembers your preference!
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
