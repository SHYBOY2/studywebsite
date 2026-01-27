# Student Success & Career Hub - Walkthrough

## Overview
This application is a student-focused dashboard designed to help with competitive exam preparation and government job tracking.

### Key Features
1.  **Government Job Live Tracker**:
    -   Real-time notifications from `freejobalert.com`.
    -   Auto-refreshes and displays latest job links.
    -   Implementation: Server-side scraping with `cheerio` via `/api/jobs` route.
2.  **Math Shortcut Engine**:
    -   Searchable library of math formulas (Algebra, Geometry, etc.).
    -   Interactive LaTeX rendering using `KaTeX`.
    -   Instant search filter.
3.  **Competitive Exam Portal**:
    -   Countdown timer for upcoming major exams (UPSC, SSC, IBPS).
    -   Curated tips and resource links.
4.  **Premium UI**:
    -   Glassmorphism design (blur effects, translucent cards).
    -   Responsive layout with animated tickers.

## How to Run

1.  **Install Dependencies**:
    ```bash
    npm install
    ```
2.  **Start Development Server**:
    ```bash
    npm run dev
    ```
    The app will be available at [http://localhost:3000](http://localhost:3000).

## Project Structure
-   `app/`: Next.js App Router pages and API routes.
-   `components/`: Reusable UI components.
    -   `dashboard/`: Job Tracker.
    -   `math/`: Shortcut Engine.
    -   `exam/`: Timers and Tips.
    -   `ui/`: Base components (GlassCard).
-   `lib/`: Utilities and Scraper logic.
-   `data/`: Static data files (shortcuts.ts).

## Verification
-   **Job Tracker**: Check the "Live Job Tracker" on the left. It should list recent jobs.
-   **Math**: Type "circle" in the search box to see the Area formula render.
-   **Exam**: Check the countdown timers on the right.
