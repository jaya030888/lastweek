# Her Voice 💜

> **“Your story matters. Your identity is yours to protect.”**

**Her Voice** is a trauma-informed, production-ready full-stack web application dedicated to women’s safety, support, legal literacy, and community awareness. The platform brings together an anonymous peer-to-peer solidarity community, streamlined crisis triage, practical safety planning tools, an open-weight local AI companion (**Saathi AI**), interactive educational branching scenarios (**The Reality Simulator**), a digital memorial honoring landmark legal reforms (**Remember Her, Change Tomorrow**), and a searchable directory of verified NGOs.

---

## 🎃 Hackathon Theme: Halloween & Día de los Muertos

Inspired by the Hacktober / Día de los Muertos hackathon themes, the central ethos of **Her Voice** is that **real-world violence, coercive control, and victim-blaming are vastly more terrifying than fictional monsters or haunted houses**. 

Drawing from Día de los Muertos traditions, remembrance is not passive grief—it is **active commemoration through systemic awakening, legal literacy, and collective community protection**.

---

## 🌟 Comprehensive Feature Set

### 1. HerSpace — Anonymous Empathy Feed
- **Pseudonymous Handles:** Automatically generates or lets users customize safe handles (e.g. `CourageousCedar`, `ResilientOrchid`) without storing real identities.
- **Categorized Support Channels:** Discussions segmented into Domestic Abuse, Workplace Harassment, Sexual Violence, Relationships, Discrimination, and Recovery & Healing.
- **Lucide Reaction System:** Empathetic, uncluttered solidarity reactions (Heart, Smile, Users, Listening Ear).
- **Proactive PII Scanner:** Built-in client and server regex inspection detecting phone numbers, addresses, emails, and identifiers before submission.
- **Supportive Threading & Private Bookmarks:** Exchange messages and bookmark posts stored locally on-device.

### 2. Quick Report — Accessible Crisis Triage Wizard
- **5-Step Accessible Flow:** Guided triage through incident classification, danger evaluation, optional narrative/voice simulation, and explicit-consent location sharing.
- **Emergency Number 112 Integration:** Prominent direct-call integration for India's unified 112 emergency and 1091 Women Helpline.
- **Transparency Safeguard:** Explicitly clarifies that reports are **internal support drafts and NOT automatically sent to police**, preventing false senses of security.
- **Pathways of Care:** Instantly routes survivors to verified shelter locators, cybercrime reporting (1930 / cybercrime.gov.in), or the Saathi AI FIR draft generator.

### 3. SafePath — Practical Safety Hub
- **Interactive Emergency Grab-Bag Checklist:** Check off essential physical supplies (identities, medications, spare keys, emergency cash, secondary prepaid phone).
- **Secret Code Word Protocol:** Practical safety guides for coordinating discreet check-ins with friends and family.
- **8-Question Relationship Red-Flag Diagnostic:** Trauma-informed assessment for coercive control, digital surveillance, financial denial, and gaslighting with automated risk scoring.
- **Verified Resources Catalog:** Filterable directory of 24x7 crisis lines, Sakhi One Stop Centres, and legal aid clinics with verification stamps.

### 4. Saathi AI — Support Companion (साथी AI)
- **Local Open-Weight AI Inference:** Direct integration with Ollama (supporting `llama3`, `mistral`, `qwen2.5`) ensuring zero survivor data leaves the host machine.
- **Trauma-Informed Ethical Guardrails:** Saathi clearly identifies as an AI, refuses to judge credibility or advise confrontation with abusers, and provides verified emergency numbers.
- **Bilingual Assistance:** Fluent in both English and Hindi / Hinglish.
- **Statutory RAG Retrieval:** Accurate citations of Indian statutory frameworks (Protection of Women from Domestic Violence Act 2005, POSH Act 2013, Zero FIR directives, IT Act Section 66E/67A).
- **Deterministic Offline Fallback:** If Ollama is offline or unavailable, seamlessly switches to a deterministic, expert-curated RAG guidance engine with zero downtime.
- **Structured Legal Complaint Generator:** Generates formal complaint drafts for Police (Zero FIR), Workplace Internal Committees (POSH), NCW, or Cyber Crime Cells.

### 5. The Reality Simulator — Interactive Branching Scenarios
- **Three Educational Scenarios:**
  1. *The Subtle Cage* — Identifying early signs of coercive control, isolation, and financial tracking.
  2. *The Breakroom Echo* — Workplace sexual harassment, power dynamics, and the 5 D’s of Bystander Intervention under the POSH Act.
  3. *Digital Shadows* — Cyberstalking, non-consensual image blackmail, and filing evidence with 1930 without stigma.
- **Choice-Driven Consequences:** Explores psychological and legal dynamics without victim-blaming.
- **Trauma-Informed Safety:** Content warnings, skip options, and instant Quick Exit available on all decision screens.

### 6. Remember Her, Change Tomorrow — Digital Memorial
- **Honoring Pioneer Lives & Legal Reforms:**
  - *Jyoti Singh ("Nirbhaya")* — Celebrates her dreams of medicine and details the Criminal Law Amendment Act 2013 and the Nirbhaya Fund.
  - *Bhanwari Devi* — Grassroots courage in Rajasthan that led directly to the landmark Supreme Court Vishaka Guidelines and POSH Act 2013.
  - *Mahsa Amini* — Celebrates her memory and the global "Woman, Life, Freedom" human rights movement.
- **Interactive Tributes:** Digital flickering candles and marigold offerings (*cempasúchil*) with anonymous solidarity notes and real-time counters.

### 7. NGO Connect & Verified Support
- **Searchable Directory:** Includes accredited non-profits across India (SNEHA Mumbai, Majlis Legal Centre, Jagori Delhi, Sayfty, Breakthrough India, Prerana, Aks Foundation).
- **Filter by Specialization:** Shelter, Free Legal Aid, Trauma Counseling, Rehabilitation, and Prevention.
- **Direct-Link Solidarity Policy:** 100% outbound direct links to official websites and donation portals. Her Voice never holds or processes intermediary funds.

### 8. Privacy, Anonymity & Digital Camouflage Controls
- **Universal Quick Exit (ESC Key):** Floating escape button and keyboard shortcut that immediately redirects to an innocuous weather site.
- **Discreet Camouflage Mode:** Replaces the screen with a mock weather forecast card in a single click.
- **Local Data Clearance:** One-click instant wipe of all cached bookmarks, pseudonyms, drafts, and session preferences.
- **Moderation Console:** Community safety review queue to approve, hide, or dismiss flagged posts and user reports.

---

## 🛠️ Complete Tech Stack

| Domain | Technology / Library | Purpose |
| :--- | :--- | :--- |
| **Frontend Framework** | React 18 + Vite 5 + TypeScript | Ultra-fast SPA with optimized HMR |
| **Styling & UI** | Tailwind CSS + Lucide React | Clean, uncluttered, accessible iconography |
| **Animations & Effects**| Framer Motion + Canvas Confetti | Trauma-sensitive UI transitions and memorial petals |
| **Routing & Code Split**| React Router DOM v6 + `React.lazy()` | Dynamic route-level code splitting (~59% bundle reduction) |
| **Backend API** | Node.js + Express.js + TypeScript | REST API with modular controllers and error propagation |
| **Database & ORM** | SQLite (Dev) / PostgreSQL (Prod) via Prisma 5.22 | Type-safe migrations, queries, and schema management |
| **Security & Protection**| Helmet + Express-Rate-Limit + CORS | Security headers, request quotas, and origin whitelisting |
| **AI & Retrieval (RAG)**| Local Ollama LLM + Custom Deterministic RAG | Privacy-first local inference with high-availability fallback |
| **Testing** | Vitest + Supertest | Automated unit and integration test coverage |
| **CI / CD** | GitHub Actions (`.github/workflows/ci.yml`) | Automated build verification, linting, and tests |

---

## 📋 20-Point Production Checklist (Verified 100%)

- [x] **1. Custom 404 Page:** `client/src/pages/NotFoundPage.tsx` with quick emergency pathways.
- [x] **2. CTA Above the Fold:** Hero section features primary action buttons for HerSpace, Emergency Report, and Simulator.
- [x] **3. Unique Meta Title per Page:** Dynamic `<SEO>` component updates page title across all 15 routes.
- [x] **4. Unique Meta Description per Page:** Accessible, search-engine-ready descriptions per view.
- [x] **5. Open Graph Image:** Vector-rendered social sharing card (`client/public/og-image.svg`).
- [x] **6. Favicon Set:** `favicon.svg`, `apple-touch-icon.svg`, and `site.webmanifest` linked in header.
- [x] **7. robots.txt:** Directs search crawlers while protecting `/moderation`, `/privacy`, and `/api`.
- [x] **8. sitemap.xml:** Complete XML sitemap indexing all public educational routes.
- [x] **9. Accessible Alt Text & Icons:** Lucide icons use `aria-hidden="true"`, buttons have explicit `aria-label` tags.
- [x] **10. Responsive Mobile Breakpoints:** Full Tailwind `sm:`, `md:`, `lg:` coverage with a dedicated mobile nav drawer.
- [x] **11. Sticky Mobile CTA:** Fixed bottom quick-action bar with one-touch 112 calling, reporting, and feed.
- [x] **12. Loading States:** Skeletons (`PostCardSkeleton`, `CardGridSkeleton`) for all asynchronous data views.
- [x] **13. Form Error States:** Inline validation with error banners and `aria-invalid` state handling.
- [x] **14. Dedicated Thank-You Page:** Parameterized confirmation screen (`/thank-you?type=report|story|tribute`).
- [x] **15. Privacy Policy:** DPDP Act 2023 & IT Rules compliant privacy terms with grievance contact.
- [x] **16. Terms of Service:** Disclaimers regarding crisis liability, non-retaliation, and acceptable use.
- [x] **17. Cookie Consent Banner:** Privacy-respecting banner offering choice between essential and analytics.
- [x] **18. Privacy-Preserving Analytics:** Local telemetry utility (`analytics.ts`) respecting Do-Not-Track (DNT).
- [x] **19. Real Physical Office & Grievance Contact:** Civil society address in Lodhi Institutional Area, New Delhi.
- [x] **20. Bandwidth-Optimized Media:** Pure SVG assets used across all iconography and cards for zero image bloat.

---

## 🚀 Quick Start Guide

### Prerequisites
- Node.js (v18.0.0 or higher recommended)
- npm (v9.0.0 or higher)
- *(Optional)* [Ollama](https://ollama.ai/) with `llama3` for local AI features.

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/her-voice.git
   cd her-voice
   ```

2. **Install all dependencies:**
   ```bash
   npm run install:all
   ```

3. **Initialize the SQLite Database & Seed Data:**
   ```bash
   cd server
   npx prisma generate
   npx prisma db push
   npm run prisma:seed
   cd ..
   ```

4. **Start Both Client and Server Concurrently:**
   ```bash
   npm run dev
   ```
   - **Frontend:** `http://localhost:3000`
   - **Backend API:** `http://localhost:5000`
   - **API Health Check:** `http://localhost:5000/api/health`

---

## 🧪 Testing & Production Builds

### Running Automated Tests
```bash
npm test
```
*Runs all 9 backend integration and endpoint test suites via Vitest.*

### Creating Production Builds
```bash
npm run build
```
*Executes `tsc` and Vite chunk splitting on the client, and compiles TypeScript into `dist/` on the server.*

---

## 📚 Engineering Documentation

- [ARCHITECTURE.md](ARCHITECTURE.md) — Architectural overview, data flow diagrams, SOLID application, and algorithmic Big-O complexity reports.
- [docs/ADR.md](docs/ADR.md) — Architecture Decision Records (Local AI fallback, pseudonymous identity models, and SQLite/PostgreSQL trade-offs).
- [.github/workflows/ci.yml](.github/workflows/ci.yml) — GitHub Actions CI pipeline running database preparation, tests, and production compilation on all PRs.
- [LICENSE](LICENSE) — Open-source MIT License.
