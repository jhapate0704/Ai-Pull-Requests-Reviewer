import { useState } from 'react'

export default function AutomationsPage({ token, onLogin }) {
  const [copiedUrl, setCopiedUrl] = useState(false)
  const [copiedSecret, setCopiedSecret] = useState(false)

  // In a real app, this would be fetched from the backend for the logged-in user
  const webhookUrl = 'https://your-api.com/webhook/user_12345'
  const webhookSecret = 'sk_web_987654321'

  const copyToClipboard = (text, setCopied) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-12 sm:px-6">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
          ⚡ Automations
        </h1>
        <p className="mt-3 text-lg text-gray-600 dark:text-gray-400">
          Set up automatic PR reviews directly in your GitHub repositories.
        </p>
      </div>

      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-white/10 dark:bg-gray-800/40">
        <div className="border-b border-gray-200 px-6 py-5 dark:border-white/10 sm:px-8">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Webhook Configuration</h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Configure this webhook in your GitHub repository to get automated AI reviews every time a Pull Request is opened or updated.
          </p>
        </div>

        <div className="px-6 py-6 sm:px-8">
          {/* Missing Token Warning */}
          {!token && (
            <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-500/30 dark:bg-amber-500/10">
              <div className="flex">
                <div className="flex-shrink-0">⚠️</div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-amber-800 dark:text-amber-400">GitHub Login Required</h3>
                  <div className="mt-2 text-sm text-amber-700 dark:text-amber-500">
                    <p>
                      The bot cannot post automated comments without authorization. Please{' '}
                      <button onClick={onLogin} className="font-bold underline hover:text-amber-900 dark:hover:text-amber-300">
                        login with GitHub
                      </button>{' '}
                      first.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Credentials */}
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">Payload URL</label>
              <div className="mt-2 flex rounded-xl shadow-sm">
                <input
                  type="text"
                  readOnly
                  value={webhookUrl}
                  className="block w-full min-w-0 flex-1 rounded-none rounded-l-xl border border-gray-300 bg-gray-50 px-4 py-2 text-sm text-gray-500 dark:border-white/10 dark:bg-gray-900 dark:text-gray-400 focus:outline-none"
                />
                <button
                  onClick={() => copyToClipboard(webhookUrl, setCopiedUrl)}
                  className="relative -ml-px inline-flex items-center space-x-2 rounded-r-xl border border-gray-300 bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 dark:border-white/10 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                >
                  {copiedUrl ? '✅ Copied' : '📋 Copy'}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">Secret</label>
              <div className="mt-2 flex rounded-xl shadow-sm">
                <input
                  type="text"
                  readOnly
                  value={webhookSecret}
                  className="block w-full min-w-0 flex-1 rounded-none rounded-l-xl border border-gray-300 bg-gray-50 px-4 py-2 font-mono text-sm text-gray-500 dark:border-white/10 dark:bg-gray-900 dark:text-gray-400 focus:outline-none"
                />
                <button
                  onClick={() => copyToClipboard(webhookSecret, setCopiedSecret)}
                  className="relative -ml-px inline-flex items-center space-x-2 rounded-r-xl border border-gray-300 bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 dark:border-white/10 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                >
                  {copiedSecret ? '✅ Copied' : '📋 Copy'}
                </button>
              </div>
            </div>
          </div>

          <hr className="my-8 border-gray-200 dark:border-white/10" />

          {/* Setup Guide */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Step-by-Step Guide</h3>
            <ol className="mt-4 list-decimal space-y-4 pl-5 text-sm text-gray-600 dark:text-gray-400">
              <li>
                Go to your GitHub repository and navigate to <strong>Settings</strong> &gt; <strong>Webhooks</strong>.
              </li>
              <li>
                Click the <strong>Add webhook</strong> button.
              </li>
              <li>
                Paste the <strong>Payload URL</strong> from above into the "Payload URL" field.
              </li>
              <li>
                Change the <strong>Content type</strong> to <code>application/json</code>.
              </li>
              <li>
                Paste the <strong>Secret</strong> from above into the "Secret" field.
              </li>
              <li>
                Under "Which events would you like to trigger this webhook?", select <strong>Let me select individual events.</strong>
              </li>
              <li>
                Uncheck "Pushes" and check <strong>Pull requests</strong>.
              </li>
              <li>
                Ensure "Active" is checked, and click <strong>Add webhook</strong>.
              </li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  )
}
