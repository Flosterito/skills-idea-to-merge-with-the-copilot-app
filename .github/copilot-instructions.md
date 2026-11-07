# Copilot instructions

Project context Copilot should apply to every session in this repository.

## Stack

- Framework: Astro (static output).
- Language: TypeScript.
- Styling: plain CSS in the base layout.

## Conventions

- Keep components small and focused.
- Prefer semantic HTML and accessible markup.
- Do not close, or add closing keywords for, the exercise walkthrough issue (issue #1) in any pull request. The exercise's GitHub Actions workflows manage that issue. When you open a pull request for app work, link only the specific app work-item issue you are implementing.

## Persistence and hydration rules

- Persist bookmarks as JSON records containing the original URL and generated slug in browser `localStorage`, so they survive reloads and browser sessions.
- Access `localStorage` and other browser-only APIs only from Astro client-side `<script>` code. Keep static markup and build-time code independent of browser globals so static builds never touch browser APIs.
