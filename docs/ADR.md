# Architecture Decision Records (ADRs)

## ADR-001: Local LLM with Deterministic RAG Fallback

### Context
Survivors seeking crisis support require immediate, legally accurate, and compassionate guidance. Relying exclusively on remote closed-source AI APIs creates third-party data privacy risks, costs, and availability vulnerabilities during network outages.

### Decision
We implemented a dual-engine architecture:
1. Primary engine: Locally hosted open-weight LLMs via Ollama (e.g. `llama3` or `mistral`).
2. Secondary engine: Deterministic rule-based RAG fallback with pre-indexed verified legal rights, domestic violence protocols, and emergency numbers.

### Consequences
- **Pros:** 100% offline uptime guarantee; zero survivor data leaves the local server boundary; verified helplines (112, 181, 1091) cannot be hallucinated.
- **Cons:** Local LLMs require host RAM and inference time; fallback templates must be curated by legal/support experts.

---

## ADR-002: Pseudonymous Identity Model over Traditional Authentication

### Context
Traditional user accounts require email addresses, phone numbers, or passwords. In abusive domestic environments, shared devices and monitoring software can expose survivors' credentials or history.

### Decision
Her Voice does not store real identities, emails, or phone numbers. Users are given pseudonyms on device generation (`hv_pseudonym`), allowing full participation (reading, posting, bookmarking, memorial offerings) without credential trails.

### Consequences
- **Pros:** Eliminates credential theft risks, database leak vulnerabilities, and retaliatory discovery by abusers.
- **Cons:** Account recovery across devices is intentional non-support to protect survivor safety.

---

## ADR-003: SQLite for Prototyping & Seamless PostgreSQL Migration

### Context
Development speed and low developer onboarding friction during hackathons require zero-configuration database setups, while production demands concurrency and managed backups.

### Decision
We use Prisma ORM abstraction targeting SQLite for local environments (`dev.db`), architected to switch to PostgreSQL (`DATABASE_URL=postgresql://...`) in production simply by altering the provider configuration without rewriting queries.

### Consequences
- **Pros:** Zero local setup dependencies, fully portable, type-safe queries.
- **Cons:** Concurrent write locking limits SQLite under heavy multi-threaded production loads.

