---
description: Rules for syncing data between the App and NotebookLM
---
# NotebookLM Data Bridge

## Overview
This rule defines the behavior for keeping the user's Google NotebookLM in sync with the RRB Exam Hub resources properly.

## Guidelines
1.  **Trigger Condition**: Whenever the user interacts with or adds a new 'Syllabus Module' in the RRB section (e.g., in `data/rrb.ts`).
2.  **Action**: 
    -   The agent must verify if the corresponding `pdfLink` or resource is present in the linked NotebookLM.
    -   If not present, the agent should effectively "Add Source".
3.  **Implementation Method**:
    -   Since no public API exists for NotebookLM ingestion, use the **Playwright Browser Tool**.
    -   Navigate to `https://notebooklm.google.com/notebook/[NOTEBOOK_ID]`.
    -   Click "Add Source" -> "Link" -> Paste the `pdfLink`.
4.  **Verification**:
    -   Confirm the source appears in the generic source list before confirming success to the user.
