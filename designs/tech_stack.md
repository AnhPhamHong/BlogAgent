# Technology Stack Specification

**Project**: Blog Writing Agent  
**Document Owner**: Technical Architect  
**Last Updated**: 2025-11-26  
**Status**: In Development

---

## Executive Summary

This document defines the complete technology stack for the Blog Writing Agent system, covering both frontend (React/TypeScript) and backend (C#/ASP.NET Core) implementations. The architecture prioritizes type safety, developer experience, performance, maintainability, and seamless integration between the UI and API layers.

---

# Backend Technology Stack

## 1. Core Framework & Runtime

| Technology | Version | Purpose | Justification |
|------------|---------|---------|---------------|
| **.NET** | 9.0 | Runtime platform | Latest LTS version with performance improvements |
| **ASP.NET Core** | 9.0 | Web API framework | Built-in DI, middleware pipeline, high performance |
| **C#** | 13 | Programming language | Type-safe, modern features, excellent tooling |

---

## 2. Architecture & Patterns

| Technology | Version | Purpose | Justification |
|------------|---------|---------|---------------|
| **MediatR** | 13.1.0 | In-process messaging | CQRS pattern, decoupled handlers, testability |
| **Clean Architecture** | Pattern | Code organization | Separation of concerns, Domain → Application → Infrastructure → API |

**Project Structure**:

- `AgentCore.Domain`: Entities, Enums, Interfaces
- `AgentCore.Application`: Business logic, MediatR handlers, Services
- `AgentCore.Infrastructure`: EF Core, Repositories, External integrations
- `AgentCore.Api`: Controllers, Middleware, API endpoints
- `AgentCore.Tests`: Unit and integration tests

---

## 3. Database & ORM

| Technology | Version | Purpose | Justification |
|------------|---------|---------|---------------|
| **PostgreSQL** | 16+ | Relational database | ACID compliance, JSON support, vector capabilities |
| **pgvector** | Latest | Vector similarity search | Embedding storage for semantic search |
| **Entity Framework Core** | 9.0.0 | ORM | Code-first migrations, LINQ queries, DbContext |
| **Npgsql.EntityFrameworkCore.PostgreSQL** | 9.0.0 | PostgreSQL provider | Official EF Core provider for PostgreSQL |

**Database Schema**:

- `Workflows` table: Blog generation workflow state
- `Blogs` table: Published blog content with vector embeddings
- EF Core migrations for schema versioning

---

## 4. AI & LLM Integration

| Technology | Version | Purpose | Justification |
|------------|---------|---------|---------------|
| **Google Gemini API** | Latest | AI content generation | Advanced reasoning, multi-modal support, embeddings |
| **Gemini Pro** | - | Text generation | Content creation, editing, SEO analysis |
| **text-embedding-004** | - | Vector embeddings | Semantic search for blog content |

**Integration Pattern**: Custom `IGeminiClient` interface for abstraction and testability

---

## 5. Caching & State

| Technology | Version | Purpose | Justification |
|------------|---------|---------|---------------|
| **Redis** | Latest | Distributed cache | Workflow state persistence, API result caching |
| **StackExchange.Redis** | Latest | Redis client | Official .NET Redis client |

---

## 6. Resilience & Reliability

| Technology | Version | Purpose | Justification |
|------------|---------|---------|---------------|
| **Polly** | 8.x | Resilience policies | Retry logic, circuit breaker, timeout for API calls |

**Policies**:

- Exponential backoff for transient errors
- Circuit breaker for Gemini API failures
- Timeout policies for long-running operations

---

## 7. API Documentation

| Technology | Version | Purpose | Justification |
|------------|---------|---------|---------------|
| **OpenAPI** | Built-in .NET 9 | API documentation | Auto-generated API specs, `/openapi/v1.json` endpoint |

---

## 8. Testing

| Technology | Version | Purpose | Justification |
|------------|---------|---------|---------------|
| **xUnit** | Latest | Unit testing framework | Industry standard for .NET testing |
| **Moq** | 4.20.72 | Mocking framework | Interface mocking for unit tests |
| **Coverlet** | Latest | Code coverage | Test coverage analysis (target: >70%) |

**Test Coverage**: >70% code coverage achieved for `OrchestratorService`

---

## 9. DevOps & Infrastructure

| Technology | Version | Purpose | Justification |
|------------|---------|---------|---------------|
| **Docker** | Latest | Containerization | PostgreSQL container with pgvector |
| **Docker Compose** | Latest | Multi-container orchestration | Database setup for development |
| **GitHub Actions** | - | CI/CD | Automated builds and tests |

**Docker Services**:

- PostgreSQL with pgvector extension (`agent-core-db`)

---

## 10. Development Tools

| Technology | Version | Purpose | Justification |
|------------|---------|---------|---------------|
| **Serilog** | Latest | Structured logging | Advanced logging with sinks support |
| **Application Insights** | Latest | Monitoring & telemetry | Performance tracking, error monitoring |

---

## 11. Configuration

**appsettings.json**:

```json
{
  "Gemini": {
    "ApiKey": "YOUR_API_KEY",
    "Model": "gemini-pro",
    "EmbeddingModel": "text-embedding-004"
  },
  "ConnectionStrings": {
    "DefaultConnection": "Host=localhost;Database=AgentCoreDb;Username=postgres;Password=password",
    "Redis": "localhost:6379"
  }
}
```

---

# Frontend Technology Stack

## 1. Core Framework & Build Tools

| Technology | Version | Purpose | Justification |
|------------|---------|---------|---------------|
| **Node.js** | 20.x LTS | JavaScript runtime | Long-term support, modern tooling compatibility |
| **npm** | 10.x | Package manager | Standard package manager |
| **Vite** | 5.x | Build tool & dev server | Fast HMR, optimized builds, native ESM |
| **React** | 18.x | UI framework | Component-based, largest ecosystem |
| **TypeScript** | 5.x | Type-safe JavaScript | Compile-time type checking |

---

## 2. State Management

| Technology | Version | Purpose | Justification |
|------------|---------|---------|---------------|
| **Redux Toolkit** | 2.x | Global state management | Best practices built-in, RTK Query |
| **React Redux** | 9.x | React bindings | Official React integration |
| **RTK Query** | Included | API layer & caching | Built-in caching, auto-refetching |

---

## 3. Routing & Navigation

| Technology | Version | Purpose | Justification |
|------------|---------|---------|---------------|
| **React Router** | 6.x | Client-side routing | Industry standard, data loading APIs |

---

## 4. UI & Styling

| Technology | Version | Purpose | Justification |
|------------|---------|---------|---------------|
| **TailwindCSS** | 3.x | Utility-first CSS | Rapid development, consistent design |
| **Headless UI** | 2.x | Accessible components | WCAG-compliant modals, dropdowns |
| **Heroicons** | 2.x | Icon library | Official Tailwind icons |
| **Framer Motion** | 11.x | Animations | Smooth UI transitions |

---

## 5. Rich Text Editing

| Technology | Version | Purpose | Justification |
|------------|---------|---------|---------------|
| **Tiptap** | 2.x | Rich text editor | Headless, extensible, TypeScript support |

---

## 6. Form Management

| Technology | Version | Purpose | Justification |
|------------|---------|---------|---------------|
| **React Hook Form** | 7.x | Form state | Minimal re-renders, excellent performance |
| **Zod** | 3.x | Schema validation | Type-safe validation |

---

## 7. Testing

| Technology | Version | Purpose | Justification |
|------------|---------|---------|---------------|
| **Vitest** | 1.x | Unit testing | Fast, Vite-native, Jest-compatible |
| **Testing Library** | 14.x | Component testing | Best practices for React testing |
| **Cypress** | 13.x | E2E testing | Industry standard |
| **MSW** | 2.x | API mocking | Network request interception |

---

## 8. Development Tools

| Technology | Version | Purpose | Justification |
|------------|---------|---------|---------------|
| **ESLint** | 8.x | Code linting | Enforce consistency |
| **Prettier** | 3.x | Code formatting | Consistent formatting |
| **Husky** | 9.x | Git hooks | Pre-commit linting |

---

## 9. Utilities

| Technology | Version | Purpose | Justification |
|------------|---------|---------|---------------|
| **date-fns** | 3.x | Date manipulation | Lightweight, tree-shakeable |
| **clsx** | 2.x | Conditional classes | Simplify Tailwind classes |
| **react-hot-toast** | 2.x | Notifications | Lightweight toasts |

---

# Integration Architecture

## API Communication

**Frontend → Backend**:

- RTK Query for API calls
- Base URL: `http://localhost:5128` (development)
- OpenAPI spec available at `/openapi/v1.json`

## Data Type Mapping

```typescript
// C# → TypeScript mapping
// Guid → string
// DateTime → string (ISO 8601)
// WorkflowState enum → union type
```

## CORS Configuration

Backend configured to allow frontend origin for development.

---

# Development Workflow

## Backend Setup

```bash
# Navigate to backend
cd src/backend

# Restore packages
dotnet restore

# Start PostgreSQL
cd ../
docker compose up -d

# Run migrations
cd backend
dotnet ef database update --project AgentCore.Infrastructure --startup-project AgentCore.Api

# Run API
dotnet run --project AgentCore.Api
# API runs on http://localhost:5128
```

## Frontend Setup

```bash
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Start dev server
npm run dev
# UI runs on http://localhost:5173
```

---

# Security Considerations

## Backend

- HTTPS enforcement
- Input validation via data annotations
- Parameterized queries (EF Core)
- API key encryption in configuration

## Frontend

- XSS prevention (React auto-escaping)
- DOMPurify for sanitizing HTML
- HTTPS-only API communication
- Regular `npm audit` checks

---

# Performance Targets

| Metric | Target | Implementation |
|--------|--------|----------------|
| **API Response Time** | <200ms | EF Core query optimization, Redis caching |
| **Frontend Load Time** | <2s | Code splitting, lazy loading |
| **Topic Generation** | <10s | Gemini API with retry logic |
| **Draft Generation** | <60s | Parallel section generation |
| **Test Coverage** | >70% | xUnit, Moq for backend; Vitest for frontend |

---

# Browser Support

| Browser | Minimum Version |
|---------|-----------------|
| Chrome | 90+ |
| Firefox | 88+ |
| Safari | 14+ |
| Edge | 90+ |

---

# Deployment Strategy

## Backend

- Docker containerization
- GitHub Actions CI/CD
- Azure App Service or similar

## Frontend

- Static build (`npm run build`)
- Deploy to Vercel, Netlify, or CDN
- Environment-specific API base URLs

---

# References

## Backend

- [ASP.NET Core Docs](https://learn.microsoft.com/en-us/aspnet/core/)
- [EF Core Docs](https://learn.microsoft.com/en-us/ef/core/)
- [MediatR](https://github.com/jbogard/MediatR)
- [Gemini API](https://ai.google.dev/docs)

## Frontend

- [React](https://react.dev/)
- [Redux Toolkit](https://redux-toolkit.js.org/)
- [TailwindCSS](https://tailwindcss.com/)
- [Vite](https://vitejs.dev/)

---

# Revision History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2025-11-26 | Technical Architect | Initial frontend tech stack |
| 2.0 | 2025-11-26 | Technical Architect | Added backend tech stack, combined document |
