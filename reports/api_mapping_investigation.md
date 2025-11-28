# API Mapping Investigation & Recommendations

**Date:** 2025-11-27
**Role:** Solution Architect
**Subject:** Alignment of UI, Agent Core, and Frontend API Implementation

## 1. Executive Summary

An investigation into the alignment between the **UI Implementation Plan**, **Agent Core Implementation Plan**, and the current **Frontend API Code** reveals a significant architectural impedance mismatch.

* **The Mismatch:** The UI Plan and Frontend Code currently imply a **Synchronous/RPC** model (e.g., "Generate Outline", "Generate Draft"), expecting immediate results. The Agent Core, however, is designed around an **Asynchronous State Machine/Workflow** model (e.g., "Start Workflow" -> "Researching" -> "Outlining" -> "Waiting Approval").
* **The Risk:** Implementing the frontend as currently planned will lead to timeouts and poor user experience, as the backend operations (research, drafting) are long-running. Additionally, the frontend lacks the necessary endpoints to drive the workflow transitions (e.g., approving an outline).

This report proposes a **Workflow-Centric API Contract** to resolve these issues, aligning the frontend with the backend's event-driven architecture.

## 2. Gap Analysis

### 2.1 Missing Endpoints in Frontend (`api.ts`)

The following endpoints required by the UI Plan are missing from the current `src/frontend/src/services/api.ts`:

| Feature | Missing Endpoint | Purpose |
| :--- | :--- | :--- |
| **Revision** | `PUT /api/drafts/:id/revise` | Request AI revisions on a specific section. |
| **SEO** | `GET /api/drafts/:id/seo-analysis` | Retrieve SEO scores and suggestions. |
| **Chat** | `POST /api/chat/message` | Send conversational refinement requests. |
| **Publishing** | `POST /api/publish/:platform` | Publish the final content to CMS. |

### 2.2 Architectural Discrepancies

| Aspect | UI Plan / Frontend Code | Agent Core Plan | Conflict |
| :--- | :--- | :--- | :--- |
| **Draft Generation** | `POST /drafts/generate` (Implies "Do it now") | State: `WaitingApproval` -> `Drafting` | The backend generates the draft *automatically* upon outline approval. The frontend should *approve* the outline, not request a draft. |
| **Outline Generation** | `POST /drafts/outline` | State: `Researching` -> `Outlining` | Outline generation is part of a sequence. The frontend should *start the workflow*, and the outline will eventually become available. |
| **State Management** | Implicit (Draft has status) | Explicit (Workflow State Machine) | The frontend needs to be aware of the *Workflow* state (e.g., `Researching`, `Optimizing`) to show the correct UI (Progress Indicator). |

### 2.3 Data Model Alignment

* **Good Alignment:** `TopicSuggestion` and `Draft` structures are largely consistent.
* **Gap:** The `Workflow` concept is central to the Backend but secondary in the Frontend. The Frontend needs to treat `Workflow` as the primary resource that contains the `Draft`.

## 3. Recommendations

### 3.1 Proposed API Contract (Workflow-Centric)

We should shift from "Resource Generation" endpoints to "Workflow Command" endpoints.

#### A. Topic Generation (Stateless)

* `POST /api/topics/generate`
  * **Input:** `{ keywords: string, tone: string }`
  * **Output:** `{ topics: TopicSuggestion[] }`
  * *Note: This remains synchronous/stateless.*

#### B. Workflow Management

* `POST /api/workflows`
  * **Purpose:** Start a new blog generation process.
  * **Input:** `{ topicId: string, selectedTopic: TopicSuggestion }`
  * **Output:** `{ workflowId: string, state: 'Researching' }`

* `GET /api/workflows/{id}`
  * **Purpose:** Polling endpoint for UI to update state.
  * **Output:** `WorkflowState` (includes current `Draft`, `Outline`, `ResearchData`, and `State`).

#### C. Workflow Commands (State Transitions)

* `POST /api/workflows/{id}/approve-outline`
  * **Purpose:** Triggers transition `WaitingApproval` -> `Drafting`.
  * **Input:** `{ modifiedOutline?: Section[] }` (Optional: allow user to save edits before approving).

* `POST /api/workflows/{id}/reject-outline`
  * **Purpose:** Triggers transition `WaitingApproval` -> `Outlining` (Regenerate).
  * **Input:** `{ feedback: string }`

* `POST /api/workflows/{id}/revise`
  * **Purpose:** Request changes during `Review` phase.
  * **Input:** `{ instructions: string, sectionId?: string }`

#### D. Interactive Features

* `POST /api/workflows/{id}/chat`
  * **Purpose:** Chat with the agent about the current workflow context.
  * **Input:** `{ message: string }`
  * **Output:** `{ response: string, suggestedActions: string[] }`

### 3.2 Frontend Refactoring Plan

1. **Update `api.ts`**:
    * Remove `generateOutline` and `generateDraft`.
    * Add `startWorkflow`, `getWorkflow`, `approveOutline`, `rejectOutline`.
    * Add `revise` and `chat` endpoints.
2. **Implement Polling/Sockets**:
    * Use RTK Query's `pollingInterval` on `getWorkflow` to auto-refresh the UI while the backend is working (e.g., during "Researching" or "Drafting" states).
3. **Update UI Components**:
    * **Dashboard**: Should track `WorkflowId`.
    * **DraftViewer**: Should derive its state from the `Workflow` object.

### 3.3 Backend Implementation Guidance

1. **Expose Workflow Resource**: The `OrchestratorService` needs to be wrapped in a Controller that exposes the Workflow state.
2. **Command Mapping**: Map the HTTP `POST` commands directly to MediatR commands (`ApproveOutlineCommand`, `ReviseDraftCommand`).
3. **SignalR (Optional)**: Consider adding SignalR for real-time state updates instead of polling, for a more "premium" feel.

## 4. Conclusion

By adopting this Workflow-Centric API, we ensure that the Frontend accurately reflects the capabilities of the Agent Core and handles long-running AI tasks gracefully. This aligns with the "Solution Architect" vision of a robust, logical flow.
