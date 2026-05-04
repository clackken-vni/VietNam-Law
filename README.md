<p align="center">
  <img src="output/vietlex-banner.jpg" alt="VietLex Banner" width="100%" />
</p>

<p align="center">
  <img src="https://img.shields.io/badge/status-mvp--in--progress-blue?style=flat-square" alt="Status" />
  <img src="https://img.shields.io/badge/license-MIT-green?style=flat-square" alt="License" />
  <img src="https://img.shields.io/badge/PRs-welcome-brightgreen?style=flat-square" alt="PRs" />
  <img src="https://img.shields.io/badge/node-%3E%3D20-339933?style=flat-square&logo=node.js" alt="Node" />
  <img src="https://img.shields.io/badge/pnpm-9.0-orange?style=flat-square&logo=pnpm" alt="pnpm" />
  <img src="https://img.shields.io/badge/postgres-16-4169E1?style=flat-square&logo=postgresql" alt="PostgreSQL" />
</p>

<h1 align="center">VietLex</h1>
<p align="center"><strong>Vietnam Legal Intelligence Platform</strong></p>

---

## Overview

**VietLex** is an open-source platform for searching, browsing, and researching Vietnam's legal documents. It tackles the fragmentation problem in Vietnamese legal data — where statutes are scattered across multiple government portals with inconsistent quality and no cross-referencing.

### The Problem

Finding a specific Vietnamese legal document today means:
- Jumping between multiple disconnected websites (vbpl.vn, thuvienphapluat.vn, csdl.chinhphu.vn...)
- No way to visualize how documents reference, amend, or supersede each other
- Hard to determine which articles remain in effect and which have been modified
- Poor mobile experience across most existing platforms

### The Solution

VietLex consolidates legal data into a single intelligent platform:

- **Full-text search** — fast, typo-tolerant, Vietnamese-language optimized
- **Smart navigation** — browse by chapter → section → article → clause → point
- **Reference graph** — visualize document-to-document relationships
- **Effectiveness tracking** — per-article status across amendments

---

## Features

### MVP (Phase 1)

| Feature | Description | Status |
|---------|-------------|:------:|
| Document Database | Structured: document → chapter → article → clause → point | ✅ |
| Full-text Search | Meilisearch-powered, Vietnamese language support | ✅ |
| Filter & Browse | By category, document type, issuing authority, year | ✅ |
| Document Viewer | Table of contents tree, breadcrumb, keyword highlight | ✅ |
| Responsive Design | Desktop, tablet, mobile optimized | ✅ |
| Public API | RESTful API with full documentation | ✅ |

### Phase 2 (Planned)

| Feature | Description |
|---------|-------------|
| 🤖 AI Semantic Search | Vector embeddings + RAG — search by meaning, not just keywords |
| 💬 Legal Q&A Chatbot | AI-powered answers grounded in the document database |
| 🕸️ Reference Graph | Interactive DAG visualization of inter-document relationships |
| 📜 Amendment History | Per-article diff tracking across versions |
| 👤 User Accounts | Bookmarks, notes, personal search history |

---

## System Architecture

```mermaid
graph TB
    subgraph "Client Layer"
        WEB["Next.js Web App<br/>SSR + App Router"]
        API_CONSUMER["Third-party API<br/>Consumers"]
    end

    subgraph "API Layer"
        BFF["Next.js API Routes<br/>BFF Pattern"]
        EXPRESS["Express.js Server<br/>RESTful API"]
    end

    subgraph "Data Layer"
        PG[("PostgreSQL 16<br/>Primary Database")]
        MEILI[("Meilisearch<br/>Full-text Search")]
        VECTOR[("pgvector<br/>Semantic Search<br/>Phase 2")]
    end

    subgraph "Ingestion Layer"
        CRAWLER["Playwright Crawler<br/>Data Ingestion"]
    end

    subgraph "External Sources"
        CSDL["csdl.chinhphu.vn"]
        VBPL["vbpl.vn"]
        TVPL["thuvienphapluat.vn"]
    end

    WEB --> BFF
    API_CONSUMER --> EXPRESS
    BFF --> EXPRESS
    EXPRESS --> PG
    EXPRESS --> MEILI
    CRAWLER --> CSDL
    CRAWLER --> VBPL
    CRAWLER --> TVPL
    CRAWLER --> PG
    CRAWLER --> MEILI
```

---

## Data Models

```mermaid
erDiagram
    LegalDocument ||--o{ Article : contains
    LegalDocument }o--|| Category : belongs_to
    LegalDocument }o--|| Authority : issued_by
    Article ||--o{ Clause : has
    Clause ||--o{ Point : has
    LegalDocument ||--o{ DocumentReference : references
    Article ||--o{ DocumentReference : article_refs

    LegalDocument {
        string id PK
        string title
        string alias
        string number
        string type "CONSTITUTION|CODE|LAW|DECREE|..."
        date issuedDate
        date effectiveDate
        date expirationDate
        string status "EFFECTIVE|PARTIALLY_EFFECTIVE|EXPIRED|..."
        string categoryId FK
        string authorityId FK
        string sourceUrl
        int viewCount
    }

    Article {
        string id PK
        string documentId FK
        string chapterTitle
        string sectionTitle
        int articleNumber
        string title
        string content
        int sortOrder
    }

    Clause {
        string id PK
        string articleId FK
        int clauseNumber
        string content
        int sortOrder
    }

    Point {
        string id PK
        string clauseId FK
        string pointLetter
        string content
        int sortOrder
    }

    DocumentReference {
        string id PK
        string sourceDocumentId FK
        string targetDocumentId FK
        string referenceType "CITES|REPLACES|AMENDS|GUIDES|BASED_ON"
        string detail
        string sourceArticleId FK
        string targetArticleId FK
    }

    Category {
        string id PK
        string name
        string slug UK
        string description
        string parentId FK
    }

    Authority {
        string id PK
        string name
        string slug UK
        string level "CENTRAL|MINISTRY|LOCAL"
    }
```

---

## Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend** | Next.js 14, React 18, TypeScript | SSR + App Router, SEO-optimized |
| **Styling** | Tailwind CSS | Utility-first, responsive |
| **API** | Express.js 4 | Lightweight REST layer |
| **ORM** | Prisma | Type-safe DB access, migrations |
| **Database** | PostgreSQL 16 | Relational data, built-in FTS |
| **Search** | Meilisearch | Vietnamese full-text, typo-tolerant |
| **Vector** | pgvector | Semantic search (Phase 2) |
| **Crawler** | Playwright + Cheerio | Public source ingestion |
| **Monorepo** | pnpm workspaces + Turborepo | Multi-package orchestration |
| **Infra** | Docker Compose | Reproducible dev environment |
| **Validation** | Zod | Runtime type safety |

---

## Project Structure

```
vietlex/
├── packages/
│   ├── shared/                    # Shared TypeScript types & constants
│   │   └── src/
│   │       └── index.ts           # All type definitions
│   │
│   ├── api/                       # Backend REST API
│   │   ├── prisma/
│   │   │   ├── schema.prisma      # Database schema (6 models)
│   │   │   └── seed.ts            # Seed data
│   │   └── src/
│   │       ├── index.ts           # Express server entry
│   │       ├── lib/
│   │       │   ├── prisma.ts      # Prisma client singleton
│   │       │   └── meilisearch.ts # Meilisearch client
│   │       ├── middleware/
│   │       │   ├── errorHandler.ts
│   │       │   └── validate.ts
│   │       ├── routes/
│   │       │   ├── documents.ts   # CRUD + filter + pagination
│   │       │   ├── categories.ts  # Category tree
│   │       │   ├── authorities.ts # Issuing authorities
│   │       │   ├── search.ts      # Full-text search
│   │       │   └── references.ts  # Document reference graph
│   │       └── services/
│   │           ├── document.service.ts
│   │           ├── search.service.ts
│   │           └── reference.service.ts
│   │
│   ├── web/                       # Next.js frontend
│   │   └── src/
│   │       ├── app/
│   │       │   ├── page.tsx       # Homepage
│   │       │   ├── layout.tsx     # Root layout
│   │       │   ├── globals.css    # Tailwind + custom styles
│   │       │   ├── search/        # Search page
│   │       │   ├── van-ban/[id]/  # Document detail page
│   │       │   └── linh-vuc/      # Category page
│   │       ├── components/
│   │       │   ├── Header.tsx
│   │       │   ├── Footer.tsx
│   │       │   ├── SearchBar.tsx
│   │       │   ├── DocumentCard.tsx
│   │       │   ├── CategoryCard.tsx
│   │       │   └── ArticleTree.tsx
│   │       └── lib/
│   │           └── api.ts         # API client
│   │
│   └── crawler/                   # Data ingestion
│       └── src/
│           └── index.ts           # Base crawler + CSDL source stub
│
├── docs/
│   └── proposal.md                # Project proposal & budget
├── output/                        # Generated assets
├── docker-compose.yml             # PostgreSQL + Meilisearch
├── turbo.json                     # Turborepo config
├── pnpm-workspace.yaml            # pnpm workspace definition
└── tsconfig.base.json             # Shared TypeScript config
```

---

## Quick Start

### Prerequisites

| Tool | Version |
|------|---------|
| Node.js | >= 20 |
| pnpm | >= 9.0 |
| Docker | Latest stable |

### Setup

```bash
# 1. Clone & enter
git clone https://github.com/your-org/vietlex.git
cd vietlex

# 2. Install dependencies
pnpm install

# 3. Start infrastructure
docker compose up -d

# 4. Configure environment
cp packages/api/.env.example packages/api/.env

# 5. Run database migrations
cd packages/api
pnpm db:migrate

# 6. Seed sample data
pnpm db:seed

# 7. Start development
cd ../..
pnpm dev
```

### Service URLs

| Service | URL |
|---------|-----|
| **Web App** | http://localhost:3000 |
| **REST API** | http://localhost:3001/api |
| **Health Check** | http://localhost:3001/api/health |
| **Meilisearch** | http://localhost:7700 |
| **Prisma Studio** | `cd packages/api && pnpm db:studio` |

---

## API Reference

### Documents

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/documents` | List documents (filtered, paginated) |
| `GET` | `/api/documents/:id` | Document detail (with articles) |
| `GET` | `/api/documents/:id/articles` | Article list for a document |

### Search

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/search?q=...&type=documents` | Search documents |
| `GET` | `/api/search?q=...&type=articles` | Search within articles |

### Categories & Authorities

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/categories` | Category tree |
| `GET` | `/api/categories/:slug` | Category detail + doc count |
| `GET` | `/api/authorities` | Issuing authorities list |
| `GET` | `/api/authorities/:slug` | Authority detail + doc count |

### References

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/references/:documentId` | Reference graph (inbound + outbound) |

### Query Parameters — `GET /api/documents`

| Param | Type | Description |
|-------|------|-------------|
| `page` | int | Page number (default: 1) |
| `pageSize` | int | Items per page (default: 20, max: 100) |
| `categoryId` | string | Filter by legal category |
| `authorityId` | string | Filter by issuing body |
| `type` | string | Document type (`LAW`, `DECREE`, `CIRCULAR`...) |
| `status` | string | Effectiveness (`EFFECTIVE`, `EXPIRED`...) |
| `year` | int | Issuance year |
| `sortBy` | string | Field: `issuedDate`, `effectiveDate`, `viewCount` |
| `sortOrder` | string | `asc` or `desc` (default: `desc`) |

---

## Roadmap

```mermaid
gantt
    title VietLex Development Roadmap
    dateFormat  YYYY-MM-DD
    section MVP (Phase 1)
    Monorepo Scaffold            :done, p1-1, 2026-05-01, 7d
    DB Schema + Seed Data        :done, p1-2, 2026-05-04, 7d
    API Endpoints                :active, p1-3, 2026-05-08, 14d
    Frontend Pages               :p1-4, 2026-05-15, 14d
    Meilisearch Integration      :p1-5, 2026-05-22, 7d
    Testing + Polish             :p1-6, 2026-05-29, 7d
    MVP Deploy                   :p1-7, 2026-06-05, 3d

    section Phase 2
    AI Semantic Search           :p2-1, 2026-06-08, 21d
    Legal Q&A Chatbot            :p2-2, 2026-06-15, 28d
    Reference Graph Viz          :p2-3, 2026-06-22, 14d
    User Accounts                :p2-4, 2026-07-01, 14d
```

---

## Contributing

We welcome contributions. See [CONTRIBUTING.md](CONTRIBUTING.md) for the full process.

### Areas we need help

- **Crawlers** — connect new data sources (vbpl.vn, thuvienphapluat.vn...)
- **Data** — normalize and clean existing document corpus
- **UI/UX** — improve interface and user experience
- **AI/ML** — RAG pipelines, semantic search, legal QA
- **Docs** — API guides, usage tutorials, translations

---

## License

MIT © 2026 VietLex Contributors

---

<p align="center">
  <sub>Legal data aggregated from publicly available Vietnamese government sources.</sub>
</p>
