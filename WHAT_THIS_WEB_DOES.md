# What Her Voice Does 💜

> **Tagline:** *"Your story matters. Your identity is yours to protect."*

**Her Voice** is an open-source, full-stack, trauma-informed digital platform built to protect, support, educate, and empower women facing domestic abuse, harassment, digital stalking, and gender-based violence.

Below is a clear, comprehensive breakdown of everything this web platform does.

---

## 🎯 1. Platform Purpose & Hackathon Vision

- **The Real Horror:** Inspired by the Halloween & Día de los Muertos theme, Her Voice reminds us that real horror doesn't come from ghosts or fiction—it unfolds quietly in homes, workplaces, and digital spaces through coercive control, violence, and silencing.
- **Active Remembrance:** In the spirit of Día de los Muertos, remembering women lost to violence means fighting for systemic change, legal awareness, and survivor protection.

---

## 🛡️ 2. Core Modules: What Users Can Do

### A. HerSpace — Anonymous Solidarity Community (`/herspace`)
- **Anonymous/Pseudonymous Feed:** Users interact safely using auto-generated nature/celestial pseudonyms (e.g. `CourageousLotus42`) without needing to reveal real names, phone numbers, or emails.
- **Support Categories:** Filter stories and discussions by:
  - Domestic Abuse
  - Workplace Harassment
  - Sexual Violence
  - Relationships & Coercive Control
  - Discrimination
  - Healing & Recovery
- **Empathetic Reactions:** React to survivors' posts with generic, uncluttered Lucide icons:
  - 💜 Heart (Solidarity)
  - 😊 Smile (Warmth & Support)
  - 👥 Community (You Are Not Alone)
  - 👂 Ear (We Hear You)
- **Active PII Scanner:** Client- and server-side safety checks scan for phone numbers, emails, and physical addresses before publication, warning the user before they accidentally reveal identifying details.
- **Private Bookmarks & Comments:** Save posts locally to read later and engage in supportive comment threads.

---

### B. Quick Report — Accessible Crisis Triage Wizard (`/quick-report`)
- **5-Step Accessible Flow:** A simple wizard that allows survivors to record what happened at their own pace:
  1. Incident Category
  2. Immediate Danger Check
  3. Description & Simulated Voice Note
  4. Explicit Consent Location Sharing (City level)
  5. Triage Choice (Support, Complaint Drafting, or Official Portal)
- **Emergency Calling (112):** Immediate, one-click access to call India's unified **112 emergency line** or **1091 Women Helpline**.
- **Transparency Safeguard:** Clearly states that submissions **do NOT automatically transmit to the police**. It is a secure internal draft and triage tool to prevent giving survivors a false sense of police dispatch.
- **Guided Pathways:** Routes the user to verified shelters, cybercrime reporting (1930 / cybercrime.gov.in), or legal complaint drafting.

---

### C. SafePath — Practical Safety Hub (`/safepath`)
- **Interactive Emergency Grab-Bag Checklist:** An interactive checklist of physical items needed when planning a safe departure:
  - Identity cards (Aadhaar, Voter ID, Passport)
  - Birth certificates & marriage documents
  - Emergency cash reserves & bank keys
  - Essential medications & prescriptions
  - Secondary prepaid phone & power banks
- **Secret Code Word Safety Protocol:** Practical advice on agreeing on an emergency code word with trusted friends or family members.
- **8-Question Red-Flag Relationship Diagnostic:** An educational self-assessment measuring subtle signs of:
  - Financial deprivation
  - Digital device surveillance
  - Social isolation from family/friends
  - Gaslighting and reality-twisting
  - Physical intimidation
  *(Clearly disclaimed as an educational reflection tool, not a clinical diagnosis).*
- **Verified Resources Catalog:** A searchable directory of 24/7 helplines, Sakhi One-Stop Centres, and legal aid clinics with verification timestamps.

---

### D. Saathi AI — Support Companion (साथी AI) (`/saathi-ai`)
- **Local, Private AI Inference:** Powered by open-weight models via **Ollama** (`llama3`, `mistral`, `qwen2.5`). Prompts are processed locally on the server without sending user crisis conversations to third-party commercial APIs.
- **Deterministic RAG Fallback:** If Ollama is offline or unavailable, Saathi seamlessly switches to a built-in deterministic, expert-curated safety guidance engine with verified statutory citations.
- **Trauma-Informed Boundaries:**
  - Clearly identifies itself as an AI, not a doctor, lawyer, or police officer.
  - Never questions a survivor's credibility.
  - Never encourages dangerous confrontation with an abuser.
  - Prioritizes physical safety and verified emergency contacts.
- **Bilingual Support:** Responds in both **English** and **Hindi / Hinglish**.
- **Legal Complaint Drafting Assistant:** Helps survivors organize incident details into structured drafts for:
  - Police (Zero FIR under CrPC / BNS)
  - Workplace Internal Complaints Committee (under POSH Act 2013)
  - National Commission for Women (NCW)
  - Cyber Crime Cell (under IT Act Sec 66E / 67A)

---

### E. The Reality Simulator — Interactive Scenarios (`/simulator`)
An educational storytelling USP featuring 3 branching scenarios that dismantle victim-blaming and teach legal rights:
1. **The Subtle Cage:** Recognizing early signs of coercive control, isolation, and financial tracking.
2. **The Breakroom Echo:** Addressing workplace harassment, power dynamics, and the **5 D's of Bystander Intervention** under POSH.
3. **Digital Shadows:** Cyberstalking, blackmail, and reporting to the 1930 Cybercrime Portal without fear or shame.
- Includes skip options, content warnings, and instant exit buttons.

---

### F. Remember Her, Change Tomorrow — Digital Memorial (`/memorial`)
- **Día de los Muertos Tribute:** Celebrates the lives, aspirations, and legal reforms sparked by women lost to gender-based violence:
  - *Jyoti Singh ("Nirbhaya")* — Aspirations in medicine; Criminal Law Amendment Act 2013 & Nirbhaya Fund.
  - *Bhanwari Devi* — Grassroots courage against child marriage that sparked the landmark Supreme Court Vishaka Guidelines and POSH Act 2013.
  - *Mahsa Amini* — Kurdish-Iranian student whose memory ignited the global "Woman, Life, Freedom" movement.
- **Interactive Offerings:** Light a digital flickering candle or offer marigold petals (*cempasúchil*) with anonymous messages of solidarity.

---

### G. NGO Connect & Directory (`/ngos`)
- **Searchable Vetted Directory:** Verified non-profits across India (SNEHA, Majlis Legal Centre, Jagori, Sayfty, Breakthrough, Prerana, Aks Foundation).
- **Service Filters:** Shelter, Free Legal Aid, Trauma Counseling, Rehabilitation, Awareness.
- **Zero-Fee Direct Link Policy:** Links directly to the official websites and donation portals of registered NGOs. Her Voice never holds or takes a cut of donations.

---

### H. Safety & Privacy Controls
- **Quick Exit (ESC Key):** A prominent floating exit button and keyboard shortcut (double-ESC) immediately redirects the browser to an innocuous weather site (`weather.com`) to protect users if an abuser enters the room.
- **Camouflage Mode:** Masks the current web page into a harmless weather forecast widget in a single click.
- **Emergency Local Wipe:** A one-click data clearance tool in `/privacy` that flushes local storage, drafts, pseudonyms, and bookmarks.
- **Moderator Council Console (`/moderation`):** A protected back-office dashboard requiring server-side authentication (`MODERATOR_SECRET`) to review flagged posts and resolve user harassment reports.

---

## ⚙️ 3. How the Tech Stack Works

| Layer | Technologies | What It Does |
| :--- | :--- | :--- |
| **Frontend** | React 18, Vite 5, Tailwind CSS, Lucide Icons | Responsive UI with code-splitting (`React.lazy`), mobile bottom bar, and dark/light accessible themes. |
| **Backend API** | Node.js, Express.js, TypeScript | REST API enforcing rate limits, security headers (`helmet`), and CORS origins. |
| **Database** | SQLite (Dev) / PostgreSQL (Prod) via Prisma ORM | Stores posts, comments, resources, NGOs, memorial tributes, and reports safely. |
| **Security & Privacy** | Zod, Helmet, Express-Rate-Limit, Crypto UUID | Request payload validation, PII pattern detection, server-side auth, and brute-force protection. |
| **AI / NLP** | Local Ollama (`llama3`) + Custom RAG Engine | Local, private conversational triage and statutory legal citation retrieval. |
| **CI / CD** | GitHub Actions (`.github/workflows/ci.yml`) | Automated linting, database migrations, seeding, testing (Vitest), and production builds on push. |

---

## 📌 Summary: In One Sentence
**Her Voice gives every woman a safe, anonymous space to speak, practical tools to plan her safety, AI and legal guidance to understand her rights, and immediate verified pathways to real-world help—all without compromising her identity or privacy.**
