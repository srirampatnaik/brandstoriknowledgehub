
# Brandstori AI Platform — Knowledge Assistant

## Overview
A modern enterprise AI knowledge assistant with a three-column layout: document library, AI chat, and insights panel. We'll build this as a polished frontend with mock data and simulated API interactions, ready to connect to a real backend later.

---

## Phase 1: Layout & Navigation Shell
- **Three-column responsive layout** with collapsible left sidebar and right panel
- **Top header bar** with Brandstori AI branding, workspace/project selector dropdown, and user profile dropdown
- **Dark/light mode toggle** using next-themes
- **Glassmorphism accents**, subtle shadows, rounded cards, gradient highlights throughout

## Phase 2: Document Library (Left Sidebar)
- **Folder tree** with expandable/collapsible sections
- **Tag-based filtering** with colored tag chips
- **Search bar** to filter documents by name
- **Upload button** that opens a PDF upload modal with drag-and-drop zone and progress bar
- **Document list** showing name, status badge (indexed ✓, processing ⏳, failed ✗), and date
- Mock data for documents and folders

## Phase 3: AI Chat Interface (Center Panel)
- **Chat message bubbles** — user messages right-aligned, AI responses left-aligned, with timestamps
- **Streaming AI response simulation** with typing animation (character-by-character reveal)
- **Loading skeletons** while waiting for responses
- **Source citation cards** embedded in AI responses (clickable, linking to documents)
- **Chat input** with send button and keyboard shortcut
- **Conversation history** sidebar/drawer to switch between past conversations

## Phase 4: Insights & Sources Panel (Right Panel)
- **Source references** — cards showing which documents were used for the current answer
- **Document metadata** — title, upload date, page count, tags, status
- **Key insights** extracted from the response (highlighted excerpts)
- Collapsible on smaller screens

## Phase 5: Admin Analytics Page
- Separate route `/admin` with dashboard layout
- **Usage metrics cards** — total queries, documents indexed, active users
- **Token usage chart** using Recharts (line/bar chart over time)
- **Recent activity feed**
- **Error log table** for failed uploads/queries

## Phase 6: API Integration Layer & Error Handling
- Axios-based API service module with interceptors for error handling
- Mock implementations for all endpoints: `POST /upload`, `POST /ask`, `GET /documents`, `GET /history`
- Toast notifications for errors (network failures, upload errors)
- Retry UI for failed operations
- Environment config setup for API base URL

## Design System
- Professional typography with clear hierarchy
- Glassmorphism cards with backdrop-blur and semi-transparent backgrounds
- Gradient accent highlights on key interactive elements
- Smooth fade/scale animations on panels and messages
- Fully responsive — collapses to single-column on mobile

---

**Note:** All features will use mock/simulated data initially. When you're ready to connect a real backend, we can integrate Lovable Cloud or your own API endpoints.
