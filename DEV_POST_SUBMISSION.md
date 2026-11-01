---
title: 👻 Her Voice 💜 — The Ghost in the Machine That Listens Without Judging
published: true
tags: devchallenge, hf26challenge, hacktoberfest, ai
cover_image: https://raw.githubusercontent.com/jaya030888/her-voice/main/client/public/vite.svg
---

*This is a submission for the [Hacktoberfest Open-Source AI Challenge Week 4: Ghost in the Machine](https://dev.to/challenges/hacktoberfest-week4-2026-10-26)*

> **Team Submission**: Developed in equal partnership by [@YourDevUsername](https://dev.to/) & [@TeammateDevUsername](https://dev.to/).

---

## 👥 Teamwork & Collaborative Contribution

This project was built from the ground up as a balanced, equal team collaboration between two developers. Every component of **Her Voice** was designed, implemented, and verified together across frontend and backend boundaries:

* **Developer 1 ([@YourDevUsername](https://dev.to/))**:
  * **AI Architecture & Fallback Engine**: Engineered the local Ollama LLM integration (Llama 3 / Mistral) and the deterministic trauma-informed RAG retrieval engine with legal citations (PWDVA 2005, POSH Act, BNS).
  * **Backend API & Data Models**: Designed Express routes, Prisma schema, server-side PII moderation middleware, and automated unit testing suites with Vitest and Supertest.
  * **Crisis Triage Engine**: Architected the multi-stage Quick Report crisis triage flow and emergency escalation pathways.

* **Developer 2 ([@TeammateDevUsername](https://dev.to/))**:
  * **Frontend Experience & Design System**: Crafted the accessible, responsive React 18 & Tailwind UI, high-contrast typography, and calming trauma-informed aesthetic.
  * **Memorial & NGO Action**: Built the unified *Remember Her, Change Tomorrow* memorial with virtual candle tributes and direct donation pledges to verified grassroots NGOs.
  * **Community & Safety Controls**: Developed HerSpace pseudonym generation, empathetic reactions, interactive comment flows, and the instant Quick Exit escape system.

---

## What We Built

### *What if the ghost inside the machine wasn't something to fear, but something that listened when nobody else would?*

**Her Voice** is an open-source, trauma-informed digital platform built to protect, support, educate, and empower women facing domestic abuse, workplace harassment, digital stalking, and gender-based violence.

Inspired by the Halloween and Día de los Muertos themes, we wanted to confront a different kind of horror. The real horror isn't always supernatural. Often, it exists in silence, coercive control, isolation, and the voices society ignores or silences.

Her Voice reimagines this concept into a sanctuary where technology acts as an empathetic shield rather than a surveillance mechanism.

### Key Pillars of Her Voice

#### 💜 1. HerSpace — Anonymous Solidarity Community
* A pseudonymous safe space where women share personal experiences and find community support without exposing their real identities.
* Features automatic pseudonym allocation (e.g. *SilverLily88*, *CourageWing42*).
* Filterable across six recovery categories: Domestic Abuse, Harassment, Sexual Violence, Relationships, Discrimination, and Recovery.
* Empathetic reactions (Solidarity, Hug, Heart), supportive commenting threads, and private bookmarks.
* Client-side and server-side PII regex scanning that flags accidental phone numbers, emails, or physical addresses before publication.

#### 🛡️ 2. Quick Report — Guided Crisis Triage
* A five-step structured crisis workflow designed to help users document incidents calmly and methodically:
  1. Immediate danger self-assessment.
  2. Incident category and narrative documentation.
  3. Timeline & evidence logging (with simulated voice-note preservation).
  4. Explicit-consent city-level location sharing for localized help.
  5. Actionable pathways to emergency helplines, legal aid, and cybercrime reporting.
* Direct one-tap connections to India's **112** universal emergency line and **1091 / 181** Women Helplines.
* *Note: Reports remain strictly internal private drafts and are never transmitted to authorities without survivor consent.*

#### 🌱 3. SafePath — Practical Safety Hub
* Concrete, action-oriented survival tools for women in crisis:
  * **Emergency Grab-Bag Checklist**: Vital documents, cash, medicines, emergency keys, and digital backups.
  * **Secret Code-Word Protocol**: Discreet distress phrases to alert trusted friends without alerting abusers.
  * **8-Question Relationship Red-Flag Reflection**: Objective assessment of coercive control and emotional manipulation.
  * **Verified Helpline Directory**: Direct access to Sakhi One Stop Centres, District Legal Services Authorities (DLSA), and NCW helplines.

#### 🤖 4. Saathi AI — Support Companion (साथी AI)
* The technical heart of our *Ghost in the Machine* concept: a privacy-first conversational companion powered by open-weight models through Ollama (Llama 3, Mistral, Qwen 2.5).
* **Zero Commercial API Dependency**: Operates entirely with local open weights or on-device deterministic RAG.
* **Trauma-Informed Boundaries**: Never claims to be a lawyer or therapist, never victim-blames, and never validates abusive behavior.
* **Bilingual Support**: Fluent in English, Hindi, and conversational Hinglish.
* **Graceful Fallback**: If Ollama or local LLM instances are offline, Saathi transitions to a deterministic RAG knowledge base covering Indian legal frameworks (PWDVA 2005, POSH Act, BNS provisions) and verified helplines.

#### 🕯️ 5. Remember Her, Change Tomorrow & NGO Connect
* A digital memorial honoring historic women whose lives sparked movements for reform (Jyoti Singh / Nirbhaya, Bhanwari Devi, Mahsa Amini).
* Visitors can light digital candles of remembrance and read their stories.
* **Transform Tribute into Action**: Seamlessly connects memorial stories to verified Indian grassroots NGOs (Sneha India, Majlis Legal Centre, Jagori, Sayfty, Breakthrough India) with direct links and solidarity donation pledges.

#### 🔐 6. Privacy & Digital Safety Controls
* **Quick Exit (ESC)**: Instantly redirects the browser to Google Search and clears temporary inputs.
* **Discreet Camouflage Mode**: Toggles the screen into a generic weather dashboard.
* **Zero Tracking**: No advertising cookies or third-party behavioral trackers.

---

## Demo

* **Live Platform**: [https://lastweek-three.vercel.app/](https://lastweek-three.vercel.app/)
* **Interactive Features**: Test out Saathi AI, explore the verified safety checklists on SafePath, read community stories in HerSpace, and light a tribute candle.

---

## Code

{% github jaya030888/her-voice %}

The complete codebase is 100% open-source under the **MIT License**. Repository: [https://github.com/jaya030888/her-voice](https://github.com/jaya030888/her-voice)

---

## How We Built It

We wanted to build an architecture where artificial intelligence wasn't an opaque third-party black box, but a transparent, reproducible, privacy-first companion.

```
       ┌───────────────────────────────┐
       │     React 18 + Vite SPA       │
       │    (HerSpace / SafePath)      │
       └──────────────┬────────────────┘
                      │ (REST /api)
                      ▼
       ┌───────────────────────────────┐
       │     Express + TypeScript      │
       │  (Helmet, Rate-Limits, CORS)  │
       └───────┬──────────────┬────────┘
               │              │
       ┌───────▼───────┐  ┌───▼────────────────────────┐
       │  Prisma ORM   │  │    Saathi AI Engine        │
       │ (SQLite/PG)   │  │ ┌────────────────────────┐ │
       └───────────────┘  │ │ Ollama (Llama 3 Local) │ │
                          │ └───────────┬────────────┘ │
                          │             │ (fallback)   │
                          │ ┌───────────▼────────────┐ │
                          │ │ Verified RAG & Legal KB│ │
                          │ └────────────────────────┘ │
                          └────────────────────────────┘
```

### The AI Architecture Behind Saathi AI
* **Local Inference**: Ollama daemon hosting open-weight models (`llama3:latest`, `mistral`, `qwen2.5`).
* **Deterministic RAG Pipeline**: Curated dataset of Indian legal rights, procedural safety protocols, and emergency helpline networks.
* **Safety Guardrails**: Strict regex pre-filters for physical danger indicators (triggering emergency 112/181 alerts) and zero victim-blaming prompt constraints.
* **Graceful Degradation**: Serverless-friendly design ensuring users still receive accurate legal and safety guidance even when local Ollama inference is offline.

### Full Technology Stack
* **Frontend**: React 18, Vite 5, TypeScript, Tailwind CSS, Framer Motion, Lucide React.
* **Backend**: Node.js, Express.js, TypeScript, Prisma ORM, SQLite / PostgreSQL.
* **Security**: Helmet, Express Rate Limiter, Zod schema validation, PII scrubbing.
* **Testing & CI/CD**: Vitest, Supertest, GitHub Actions CI matrix.
* **Deployment**: Configured for single-domain multi-service orchestration via Vercel Services (`vercel.json`).

---

## Why Does Open Innovation Matter?

1. **Privacy is Not a Premium Luxury**: Survivors discussing sensitive trauma should never have their words harvested for commercial advertising or sent to closed proprietary clouds. Open weights keep data sovereign.
2. **Accessible to Grassroots Non-Profits**: Small NGOs and shelters cannot afford recurring per-token commercial API costs. Open-source models allow non-profits to host resilient guidance tools affordably.
3. **Auditability & Algorithmic Trust**: In sensitive domains like legal aid and domestic violence, opaque black boxes can cause harm. Open innovation allows advocates, survivors, and legal scholars to inspect every prompt and rule.
4. **Community Co-Creation**: Anyone can contribute legal updates, local helpline numbers, translated regional dialects, and trauma-informed improvements.

---

## The Spirit of It 💜

Building Her Voice brought us back to one central thought:

> *What happens when someone finally finds a place where they can speak without fear of judgment?*

For anyone enduring abuse or coercive control, seeking help can be the most terrifying step of all. We built Her Voice so that nobody has to surrender their identity before receiving guidance, nobody has their credibility questioned, and nobody is forced to speak before they are ready.

Saathi AI is the ghost in the machine: an invisible ally that stays awake through the darkest hours, listens with compassion, and reminds survivors that they are never truly alone.

And through the memorial, we remember that honoring the women who were silenced must inspire real-world action to protect those who are still here.

---

## Team Credits

* **Developer 1**: [@YourDevUsername](https://dev.to/) — *AI Architecture, Backend APIs, Crisis Triage & Tests*
* **Developer 2**: [@TeammateDevUsername](https://dev.to/) — *Frontend Architecture, UI/UX, Memorial & Community Features*

---

*A woman's voice should never have to disappear for the world to finally listen.* 💜

#devchallenge #hf26challenge #hacktoberfest #opensource #ai

