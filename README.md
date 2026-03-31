# Blitz Analyzer 

## Description

Blitz Analyzer Frontend is the client-side application of a full-stack resume analysis platform. It provides the user interface for authentication, dashboard access, resume analysis results, template selection, report downloads, and payment flow.

---

## What Problem It Solves

This frontend helps users:

* understand resume quality quickly
* view structured feedback in a simple dashboard
* create or customize resumes using templates
* access premium features through a smooth payment flow
* track previous analysis results in one place

---

### What this project demonstrates

* End-to-end product thinking (auth → dashboard → payments)
* Production-ready UI architecture
* Strong form handling and validation
* Clean state management and scalable structure

---

## Key Features (Impact-Oriented)

* 🔐 Authentication + OTP verification
* 📊 Resume analysis dashboard with history tracking
* 📄 Downloadable reports
* 🧩 Template-based resume builder + custom canvas
* 💳 Stripe payment integration (upgrade flow)
* 📱 Fully responsive (mobile-first)
* 🧭 Clear navigation and structured user flow
* ⚡ Reusable UI components for consistent design

---

## What makes it strong (HR view)

* Handles **real-world flows** (auth, payments, dashboards)
* Built with **scalable component architecture**
* Uses **industry-standard tools** (React Hook Form + Zod)
* Clean separation of concerns (UI / state / API)
* Focused on **user experience, clarity, and maintainability**

---

## Tech Stack

* Next.js + TypeScript
* Redux Toolkit
* React Hook Form + Zod
* Tailwind CSS + shadcn/ui
* Bun (development/runtime)

---

## Performance / Quality Notes

* Form validation handled client-side with backend-safe rules
* Optimized re-renders using proper state slices
* Reusable UI components for scalability
* Modular feature-based structure for easier maintenance
* Clean loading and empty states for better UX

---

## Project Structure

```bash
frontend/
├── app/
├── components/
│   ├── modules/
│   │   ├── auth/
│   │   ├── admin/
│   │   └── user/
│   ├── shared/
│   └── ui/
├── hooks/
├── lib/
├── store/
├── services/
└── types/
```

---

## Setup

```bash
bun install
bun dev
```

---

## Environment

> Use placeholder values here in GitHub. Do not commit real secrets.

```env
NEXT_PUBLIC_API_URL=
NEXT_PUBLIC_APP_URL=
APP_URL=
API_URL=
GROQ_API_KEY=
JWT_ACCESS_SECRET=
REFRESH_TOKEN_SECRET=
```

---

## User Flow

1. User opens the landing page
2. User signs up or logs in
3. User verifies email with OTP
4. User enters the dashboard
5. User checks resume analysis results
6. User downloads the report
7. User selects or customizes a template
8. User upgrades through the payment flow if needed

---

## Screen Guide

### 1. Landing Page

**Add image:** `LANDING_PAGE_IMAGE_LINK`

Short description: first impression of the product, value proposition, and main CTA.

### 2. Authentication & OTP

**Add image:** `AUTH_OTP_IMAGE_LINK`

Short description: signup, login, and email verification flow.

### 3. Dashboard

**Add image:** `DASHBOARD_IMAGE_LINK`

Short description: user overview, analytics, and resume history.

### 4. Resume Analysis Result

**Add image:** `ANALYSIS_RESULT_IMAGE_LINK`

Short description: score, insights, recommendations, and report download.

### 5. Template Builder

**Add image:** `TEMPLATE_BUILDER_IMAGE_LINK`

Short description: template selection and custom resume editing.

### 6. Payment Flow

**Add image:** `PAYMENT_FLOW_IMAGE_LINK`

Short description: pricing, checkout, and upgrade flow.

### 7. Admin Panel

**Add image:** `ADMIN_PANEL_IMAGE_LINK`

Short description: user management, pricing control, and KPI view.

---
---

## 🎯 Highlights (Why this project stands out)

* Built a **complete product experience**, not just a UI page
* Focused on **real user flows** and a clean structure
* Implemented **validation, state management, and responsive design**
* Designed to be readable for both **HR and technical reviewers**
* Easy to extend with more features later

---

## 🧠 Technical Strength Signals

* Component-based architecture with reusable modules
* Centralized state management using Redux Toolkit
* Strong input validation using React Hook Form + Zod
* Professional layout and responsive UI behavior
* Structured folders that support long-term maintainability

---
## Demo

Frontend Live URL: `https://blitz-analyzer.vercel.app`

Github URL: `https://github.com/habiburRhaman05/Blitz-Analyzer`


---
