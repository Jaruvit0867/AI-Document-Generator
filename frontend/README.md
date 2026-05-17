# Vision Draft Frontend

Vision Draft is a SaaS-style frontend for turning raw requirements and uploaded documents into actionable development plans. It connects to the FastAPI backend, lets users manage projects, upload source documents, run the AI processing pipeline, review generated proposals and diagrams, chat with project documents, and export deliverables.

## What This App Does

- Public landing page for the product story and demo entry point.
- Login and registration screens with JWT authentication.
- Project dashboard with a project navigator and workspace area.
- Document input through pasted text or file upload.
- Processing pipeline for embeddings, extraction, diagrams, and proposal readiness.
- Proposal viewer with structured requirement sections.
- Diagram viewer for Mermaid diagrams with tabs, zoom, fullscreen, annotation, and export controls.
- RAG-style project chat using uploaded documents as context.
- Export tools for Markdown, PDF, Word, and diagram assets.

## Tech Stack

| Area | Technology | Purpose |
| --- | --- | --- |
| Framework | Next.js 16 App Router | Routing, layouts, production build, static pages |
| UI runtime | React 19 | Component model and client-side interactivity |
| Language | TypeScript 5 | Type-safe API contracts, props, and component state |
| Styling | TailwindCSS 4 | Utility-first design system and responsive layout |
| Motion | Framer Motion 12 | Landing/auth/dashboard transitions and micro-interactions |
| Diagrams | Mermaid 11 | Rendering generated architecture/user-flow/data diagrams |
| Markdown | react-markdown 9 | Rendering AI chat responses cleanly |
| Export | html2canvas, jsPDF, docx, file-saver | Proposal and diagram export flows |
| Dates | date-fns | Date formatting helpers |
| Utilities | clsx, tailwind-merge | Class composition and style merging |

## How The Frontend Works

### 1. App Routes

- `app/page.tsx` renders the public landing page.
- `app/auth/login/page.tsx` and `app/auth/register/page.tsx` handle authentication.
- `app/dashboard/page.tsx` is the protected workspace for projects.
- `app/layout.tsx` sets global fonts, metadata, and `AuthProvider`.
- `app/globals.css` defines Tailwind theme tokens, global styles, and print/export styles.

### 2. Authentication

- Auth forms call `api.auth.login` or `api.auth.register` from `src/lib/api.ts`.
- The backend returns a JWT access token.
- `src/lib/auth.ts` stores the token in `localStorage`.
- `apiFetch` automatically attaches `Authorization: Bearer <token>` to protected requests.
- A `401` response clears the token and redirects the user to `/auth/login`.

Current MVP tradeoff: token storage uses `localStorage`, which is simple for a hackathon demo. A production version should consider httpOnly cookies and refresh tokens.

### 3. Project Workspace Flow

1. `ProjectList` loads projects from `GET /projects/`.
2. Selecting a project mounts `WorkspaceLayout` with that project id.
3. `WorkspaceLayout` loads project documents from `GET /projects/{id}/documents/`.
4. Users can upload files or paste text. Pasted text is converted to a `requirements.txt` file before upload because the backend accepts document uploads.
5. `ProcessingPipeline` runs the backend pipeline in order:
   - `POST /projects/{id}/process-embeddings`
   - `POST /projects/{id}/extract`
   - `POST /projects/{id}/diagrams/generate`
6. After processing completes, the project is refreshed and `ResultsPanel` appears.

The workspace is keyed by project id so switching projects remounts project-specific state. Results, diagrams, and chat also guard against stale async responses from a previous project.

### 4. Proposal Output

`ProposalView` displays the structured extraction result:

- Project Overview
- Requirements
- Feature Breakdown
- User Flow
- Business Process
- Project Scope
- Technical Architecture
- Timeline & Milestones
- Risks & Open Questions, only when the backend sends them

Export note: Risks and Open Questions are intentionally shown only in the app UI. They are not included in Markdown/PDF/Word exports.

### 5. Diagram Output

- `ResultsPanel` fetches diagrams from `GET /projects/{id}/diagrams`.
- `DiagramView` groups diagrams by type and renders the selected diagram.
- `MermaidDiagram` renders Mermaid source, supports zoom/pan/fullscreen, and includes annotation tools.
- `DiagramControls` provides copy/download/open actions for Mermaid content and diagram assets.

Diagram types currently supported by the frontend type contract:

- `system_architecture`
- `user_flow`
- `development_workflow`
- `data_model`

### 6. Chat Output

- `ChatView` loads history from `GET /projects/{id}/chat`.
- Sending a message calls `POST /projects/{id}/chat`.
- Clearing history calls `DELETE /projects/{id}/chat`.
- Chat is enabled when the project has documents and embeddings context.
- AI responses are rendered with markdown formatting.

### 7. Export Flow

- Markdown export is generated directly in `ProposalView`.
- PDF export uses a hidden `ProposalDocument` render target plus `html2canvas` and `jsPDF`.
- Word export uses `docx` and attempts to render Mermaid diagrams into images before packaging the document.
- Export actions show an in-app loading overlay instead of browser alerts.

## Project Structure

```text
frontend/
├── app/
│   ├── auth/                  # Login/register routes and auth layout
│   ├── dashboard/             # Protected dashboard route
│   ├── page.tsx               # Landing page route
│   ├── layout.tsx             # Root layout, fonts, AuthProvider
│   └── globals.css            # Tailwind theme and global styles
├── assets/                    # App logo assets
├── public/                    # Static public assets
├── src/
│   ├── components/
│   │   ├── auth/              # Auth form primitives
│   │   ├── brand/             # Vision Draft logo component
│   │   ├── chat/              # Project chat UI
│   │   ├── diagrams/          # Mermaid viewer, tabs, controls
│   │   ├── marketing/         # Landing/auth visual components
│   │   ├── projects/          # Project list, cards, create/delete UI
│   │   ├── proposal/          # Proposal sections and export helpers
│   │   ├── ui/                # Shared UI primitives
│   │   └── workspace/         # Uploads, documents, pipeline, results tabs
│   ├── contexts/
│   │   └── AuthContext.tsx    # Auth state provider
│   ├── lib/
│   │   ├── api.ts             # Typed backend API client
│   │   ├── auth.ts            # Token/session helpers
│   │   └── utils.ts           # Shared utilities
│   └── types/
│       └── api.ts             # API response/request types
├── API_DOCUMENTATION.md       # Backend API reference used by the frontend
├── package.json
└── README.md
```

## Environment Variables

Create `.env.local` in `frontend/`:

```env
NEXT_PUBLIC_API_BASE_URL=https://backend-hackaton-v2.vercel.app
```

For local backend development:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
```

`NEXT_PUBLIC_API_BASE_URL` is required because the frontend runs API calls from the browser.

## Install And Run

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Production build:

```bash
npm run build
npm start
```

Lint:

```bash
npm run lint
```

## API Endpoints Used

Authentication:

- `POST /auth/register`
- `POST /auth/login`
- `GET /auth/me`

Projects:

- `GET /projects/`
- `POST /projects/`
- `GET /projects/{project_id}`
- `PUT /projects/{project_id}`
- `DELETE /projects/{project_id}`

Documents:

- `GET /projects/{project_id}/documents/`
- `POST /projects/{project_id}/documents/upload`
- `GET /projects/{project_id}/documents/{document_id}`
- `DELETE /projects/{project_id}/documents/{document_id}`

Processing:

- `POST /projects/{project_id}/process-embeddings`
- `POST /projects/{project_id}/extract`
- `GET /projects/{project_id}/extraction`
- `GET /projects/{project_id}/proposal`

Diagrams:

- `POST /projects/{project_id}/diagrams/generate`
- `GET /projects/{project_id}/diagrams`
- `GET /projects/{project_id}/diagrams/{diagram_id}`
- `DELETE /projects/{project_id}/diagrams`

Chat:

- `GET /projects/{project_id}/chat`
- `POST /projects/{project_id}/chat`
- `DELETE /projects/{project_id}/chat`

## Important Implementation Notes

- Project creation uses `POST /projects/` with a trailing slash.
- Raw pasted text is converted into a `File` before upload.
- Extraction and diagram generation can take time, so loading states are expected.
- Results are keyed and reset by project id to avoid data from one project appearing in another project.
- The landing page uses decorative animation, but heavy canvas animation is paused when idle to reduce CPU usage.
- `Risks & Open Questions` are app-only review content and are excluded from exports by design.

## Common Troubleshooting

### API requests fail

Check `NEXT_PUBLIC_API_BASE_URL` in `.env.local`, then restart `npm run dev`.

### User gets logged out

A `401` response clears local auth state. Sign in again.

### Upload from text does not appear

The frontend converts pasted text into `requirements.txt` before uploading. Check browser console and backend upload logs if the file is missing.

### Diagrams stay loading or show stale data after switching projects

The current implementation resets results by project id. If it still happens, verify the backend response for the selected project id and check network requests in DevTools.

### Mermaid diagram fails to render

Check the generated Mermaid syntax in the diagram source panel. Invalid Mermaid content can prevent rendering.

### Chat is disabled

Chat requires uploaded documents and embeddings context. Run the processing pipeline first.

## Deployment

This frontend can be deployed on Vercel.

1. Import the GitHub repository in Vercel.
2. Set the project root to `frontend` if deploying this folder separately.
3. Add environment variable:
   - `NEXT_PUBLIC_API_BASE_URL=https://backend-hackaton-v2.vercel.app`
4. Build command: `npm run build`
5. Output is handled by Next.js/Vercel automatically.

## MVP Limitations

- JWT is stored in `localStorage`.
- No automated test suite yet.
- No offline support or realtime collaboration.
- Large Mermaid diagrams may still be heavy in older browsers.
- Backend processing is long-running and currently handled with simple loading states.

## Related Documentation

- [API Documentation](./API_DOCUMENTATION.md)
- [Project Root README](../README.md)
