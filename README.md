# 🎨 DevSecOps AI Code Reviewer — Next.js Frontend

An interactive DevSecOps workspace powered by **Next.js (App Router)**, **Monaco Editor**, and **Vercel AI SDK**. It renders live AI security review streams, automatically highlights vulnerable code lines directly in the editor, calculates security health scores, and provides 1-click side-by-side **Diff Previews** for instant code remediation.

---

## 🌟 Key Features

* **Monaco Editor Integration:** Embedded VS Code editor engine with syntax highlighting, custom line decorators, and gutter markers.
* **Real-time SSE Token Hydration:** Uses Vercel AI SDK's `useObject` hook to progressively render structured JSON review payloads as tokens stream in.
* **Side-by-Side Diff Patch Inspector:** 1-click comparison mode allowing developers to inspect original vulnerable code alongside AI-generated security patches.
* **Live Security Health Scorecard:** Dynamic status badges, severity indicators (`CRITICAL`, `WARNING`, `INFO`), and score gauges based on OWASP benchmarks.
* **Zero-Lag UI State Machine:** Optimized React rendering that hides full-page loaders the moment the first streaming token arrives.

---

## 🛠️ Tech Stack

* **Framework:** Next.js 15 (App Router, React 19)
* **Code Editor Engine:** `@monaco-editor/react` (Monaco Editor & Diff Editor)
* **Streaming Client:** Vercel AI SDK (`ai/react` - `experimental_useObject`)
* **Styling & UI Components:** Tailwind CSS, Lucide React Icons, clsx, Framer Motion
* **Type Validation:** Zod, TypeScript

---

## 📁 Repository Structure

```text
ai-reviewer-frontend/
├── src/
│   ├── app/
│   │   ├── layout.tsx         # Root Layout
│   │   └── page.tsx           # Main DevSecOps Workspace Page
│   ├── components/
│   │   ├── CodeEditor.tsx     # Monaco Editor & Side-by-Side Diff View
│   │   └── SecurityPanel.tsx  # Live Security Scorecard & OWASP Issues Feed
│   └── lib/
│       └── types.ts           # Shared Zod CodeReviewSchema & TS Definitions
├── .env.local
├── package.json
└── tsconfig.json
```

⚙️ Environment Configuration
Create a `.env.local` file in the frontend root directory:

Code snippet
```text
NEXT_PUBLIC_BACKEND_URL=http://localhost:5001/api/v1/review
```

🚦 Getting Started
1. Install Dependencies
```bash
npm install
```

2. Start Development Server
```bash
npm run dev
```
Open http://localhost:3000 in your browser.

🖥️ How to Use the Workspace
* **Select Language:** Choose your target language (JavaScript, TypeScript, Python, Go) from the navbar dropdown.
* **Paste Code:** Enter or edit your code snippet in the Monaco Editor on the left panel.
* **Run Scan:** Click Run Security Scan.
* **Observe Real-time Feedback:**
  * Watch issues, scores, and summaries populate live on the right panel.
  * Look for red/yellow gutter markers and inline line highlights directly inside Monaco.
* **Inspect Security Patches:** Click Inspect & Compare Security Fix (Diff) under any issue to switch Monaco into side-by-side comparison mode and review proposed security fixes.
