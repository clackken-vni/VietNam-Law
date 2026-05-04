# VietLex — Vietnam Legal Intelligence Platform

## 1. Executive Summary

**Project:** VietLex
**Type:** Web platform for Vietnam legal document search & research
**Timeline:** 3 months (MVP)
**Budget:** 100,000,000 VNĐ (~$4,000 USD)

## 2. Problem

Vietnam's legal document ecosystem is fragmented:
- **Scattered sources** — Documents live across csdl.chinhphu.vn, vbpl.vn, thuvienphapluat.vn and more, each with different organization and quality
- **No cross-referencing** — No tool visualizes relationships (citations, amendments, replacements, implementing guidelines) between documents
- **Opaque effectiveness** — Users cannot easily determine which articles remain in force after subsequent amendments
- **Poor UX** — Most existing platforms have dated interfaces, slow performance, and no mobile support

### Target Users

| Segment | Need |
|---------|------|
| Lawyers / Law firms | Fast, accurate lookup; effectiveness tracking |
| Businesses | Industry regulations; compliance research |
| Law students / Academics | Research, comparison, citation |
| General public | Basic rights & obligations lookup |

## 3. Solution

VietLex is a centralized platform providing:

1. **Intelligent Search** — Full-text + semantic search across the entire corpus
2. **Professional Document Viewer** — Navigate by chapter/article/clause/point, keyword highlighting
3. **Legal Reference Graph** — Interactive visualization of inter-document relationships
4. **Effectiveness Timeline** — Per-article status tracking with amendment history

## 4. Features

### MVP (Months 1–3)

| Feature | Description |
|---------|-------------|
| Structured Document DB | Document → chapter → article → clause → point |
| Full-text Search | Meilisearch with Vietnamese language support |
| Filter & Browse | By category, type, authority, year |
| Document Viewer | TOC sidebar, breadcrumbs, keyword highlights |
| Homepage | Recently issued, popular, by category |
| Category Pages | Browse documents by legal field |
| Public API | RESTful API with OpenAPI documentation |

### Phase 2 (Post-MVP)

| Feature | Description |
|---------|-------------|
| Reference Graph | Interactive DAG of legal relationships |
| Semantic Search | Vector embeddings + RAG for meaning-based search |
| Legal Q&A Chatbot | AI assistant grounded in the document DB |
| Amendment Diff | Per-article version history |
| User Accounts | Bookmarks, notes, history |

## 5. Architecture

```
                   ┌──────────────┐
                   │ Nginx / LB   │
                   └──────┬───────┘
          ┌────────────────┼────────────────┐
     ┌────┴────┐     ┌─────┴──────┐    ┌────┴─────┐
     │ Next.js │     │ Express API│    │ Crawler  │
     │ (Web)   │     │ (REST)     │    │ (Ingest) │
     └────┬────┘     └─────┬──────┘    └────┬─────┘
          └───────────────┼────────────────┘
                 ┌────────┴────────┐
                 │  PostgreSQL 16  │
                 │  + pgvector     │
                 └────────────────┘
                 ┌────────────────┐
                 │  Meilisearch    │
                 └────────────────┘
```

## 6. Tech Stack

| Layer | Technology | Rationale |
|-------|-----------|-----------|
| **Frontend** | Next.js 14 + TypeScript | SSR, SEO, App Router |
| **Styling** | Tailwind CSS + shadcn/ui | Fast, accessible, consistent |
| **API** | Express.js | Lightweight, mature ecosystem |
| **Database** | PostgreSQL 16 | Reliable, built-in FTS, pgvector-ready |
| **Search** | Meilisearch | Vietnamese-optimized, typo-tolerant |
| **ORM** | Prisma | Type-safe, auto-migration |
| **Crawler** | Node.js + Playwright | Headless browser for JS-heavy sources |
| **Deploy** | Docker + VPS | Cost-effective for MVP budget |

## 7. Data Models

```
LegalDocument
├── id, title, alias, number, type, dates, status
├── category: Category
├── authority: Authority
└── articles: Article[]
    └── Article
        ├── articleNumber, title, content
        └── clauses: Clause[]
            └── points: Point[]

DocumentReference
├── sourceDocument, targetDocument
└── referenceType: CITES | REPLACES | AMENDS | GUIDES | BASED_ON
```

## 8. Roadmap

### Month 1: Foundation

| Week | Deliverable |
|------|-------------|
| 1–2 | Monorepo scaffold, CI/CD, Docker config |
| 3–4 | DB schema, Prisma setup, seed data |

### Month 2: Core Features

| Week | Deliverable |
|------|-------------|
| 1–2 | API endpoints (CRUD, search, filter) |
| 3 | Frontend: homepage, search, filters |
| 4 | Frontend: document viewer with TOC |

### Month 3: Polish & Ship

| Week | Deliverable |
|------|-------------|
| 1 | Meilisearch indexing + search UI |
| 2 | Data seeding from public sources, QA |
| 3 | Performance optimization, mobile responsive |
| 4 | Production deploy, API docs, handoff |

## 9. Budget Breakdown

| Item | Cost (VNĐ) | Notes |
|------|-----------|-------|
| Development (2 dev × 3 months) | 60,000,000 | Part-time, ~10M/dev/month |
| UI/UX Design | 10,000,000 | Interface design |
| VPS Hosting (12 months) | 12,000,000 | ~1M/month |
| Domain (2 years) | 1,000,000 | vietlex.dev or similar |
| Third-party services | 5,000,000 | Meilisearch Cloud, email, etc. |
| Testing & QA | 7,000,000 | Auto + manual testing |
| Contingency | 5,000,000 | Unforeseen costs |
| **Total** | **100,000,000** | |

## 10. Success Metrics (KPIs)

After 3 months:
- Database: ≥ 5,000 legal documents
- Search response: < 500ms
- Document page LCP: < 2s
- Mobile responsive: full coverage
- Public API: documented and usable

## 11. Risks & Mitigations

| Risk | Severity | Mitigation |
|------|----------|-----------|
| Inconsistent source data | High | Validation layer + manual review |
| Frequent legal updates | Medium | Versioning + diff tracking |
| Budget constraints | Medium | Open-source stack, VPS over cloud |
| Data copyright | Low | Public government sources only, clear attribution |
