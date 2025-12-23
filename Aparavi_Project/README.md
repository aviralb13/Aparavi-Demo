# Aparavi Demo

A lightweight React + Vite client that submits PDF documents to Aparavi's AI detection webhook and returns a classification (AI vs. human), confidence score, and the model's reasoning. The UI lives in `Aparavi_Project` and provides a simple upload form plus formatted reasoning output.

## Tech stack
- React 19 with Vite 7
- Tailwind (utility classes pulled in via CDN; minimal custom CSS)
- React Markdown for rendering model reasoning

## Getting started
1) Prerequisites: Node.js 18+ and npm.
2) Install dependencies:
	- `cd Aparavi_Project`
	- `npm install`
3) Run the dev server:
	- `npm run dev`
	- Open the printed local URL (typically http://localhost:5173).
4) Build for production (optional):
	- `npm run build`
	- Preview the build with `npm run preview`.

## Usage
- From the running app, choose a PDF file and submit it.
- The client streams the PDF bytes to the Aparavi webhook (`src/App.jsx`) and displays:
  - Classification (e.g., human or AI)
  - Confidence score
  - Reasoning rendered as Markdown
- Errors and invalid responses are surfaced inline to help with troubleshooting.

## Configuration notes
- The webhook URL and authorization token are currently hardcoded in `src/App.jsx`. For production, move these values into environment variables (e.g., via Vite env files) and avoid committing secrets.
