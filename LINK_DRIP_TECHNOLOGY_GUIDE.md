# 💧 Link Drip & Video Analytics - Technology Stack & Architecture Guide

This guide details the exact technologies, APIs, backend worker services, and machine learning models powering the **Link Drip & Video Analytics Engine** in **Ai Appsec Lab**.

---

## 🏗️ System Architecture Overview

```
 ┌───────────────────────────┐      ┌───────────────────────────┐      ┌───────────────────────────┐
 │   YouTube IFrame / Video  │ ───► │  Lightweight Telemetry    │ ───► │   Python Flask Backend    │
 │   Player SDK Listener     │      │  (navigator.sendBeacon)   │      │   & SQLAlchemy ORM        │
 └───────────────────────────┘      └───────────────────────────┘      └─────────────┬─────────────┘
                                                                                     │
 ┌───────────────────────────┐      ┌───────────────────────────┐                    │
 │  Vercel / Vite React      │ ◄─── │  Celery + Redis Worker    │ ◄──────────────────┘
 │  Recharts Visualization   │      │  Cron Drip Scheduler      │
 └───────────────────────────┘      └───────────────────────────┘
```

---

## 1. 💧 Link Drip Scheduling & Automated Triggers

Link Drip allows creators to schedule links to "drip" (unlock automatically) over time or when video play targets are achieved.

### Key Technologies Used:
* **APScheduler / Celery + Redis**: Background asynchronous job queues that evaluate scheduled link drips without blocking the main Flask HTTP thread.
* **Cron Expression Engine**: Evaluates `drip_date <= UTC_NOW()` to toggle `link.is_active = True`.
* **Database Triggers**: SQLAlchemy event listeners (`@event.listens_for(Analytics, 'after_insert')`) that track view thresholds and automatically unlock locked drip links once target view counts (e.g., 10,000 plays) are reached.

---

## 2. 📹 Video Analytics & Telemetry

Tracks embedded video watch performance, retention rates, and conversion from video views to link clicks.

### Key Technologies Used:
* **YouTube IFrame Player API & Vimeo SDK**: Captures real-time video player events (`PLAYING`, `PAUSED`, `BUFFERING`, `ENDED`) and tracks exact watch seconds (`player.getCurrentTime()`).
* **Client-Side Telemetry (`navigator.sendBeacon`)**: Non-blocking asynchronous heartbeat API that sends video watch progress to `/api/analytics/video-heartbeat` even if the user closes the browser tab.
* **GeoIP & Device Intelligence (`MaxMind GeoIP2` / `ua-parser-js`)**: Parses incoming request IPs and User-Agents to calculate device breakdowns (Mobile vs. Desktop) and country referral stats.

---

## 3. 🤖 Machine Learning & Predictive Engine

Provides predictive traffic forecasts and automated AI recommendations for video drip links.

### Key Technologies Used:
* **NumPy & Scikit-learn (Linear Regression)**: Computes 30-day click velocity and projected total visitors (`mlForecast`) based on historic timeline data.
* **Audience Retention Clustering (K-Means)**: Groups visitors into engagement cohorts based on watch duration and referrer source (e.g. YouTube vs Instagram).
* **NLP Summary Engine**: Processes referrer distribution counters to generate natural language posting recommendations (e.g., *"Best Posting Time: 6 PM - 8 PM EST"*).

---

## 4. 🎨 Frontend Visualization & Real-Time UI

Renders interactive analytics cards, progress bars, and scheduled drip modals.

### Key Technologies Used:
* **React 19 + Vite**: High-performance Single Page Application (SPA) framework.
* **Recharts**: Responsive SVG charting library for gradient timeline curves, pie charts, and bar charts.
* **Lucide Icons & Tailwind CSS**: Curated UI components with dynamic HSL color tokens for real-time status badges (`🟢 Live Now`, `⏳ Dripping Next`, `🔒 Locked`).

---

## 🛠️ API Endpoints Summary

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/analytics` | Fetches overall link clicks, timeline, referrers, and ML predictions |
| `POST` | `/api/analytics/video-heartbeat` | Records video watch duration and updates retention metrics |
| `POST` | `/api/links/drip` | Schedules a new time-based or goal-based Link Drip |
| `GET` | `/api/links/drip/status` | Evaluates active/pending drip links for the creator profile |

---
*Powered by Ai Appsec Lab Analytics Engine*
