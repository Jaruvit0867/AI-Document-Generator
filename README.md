# AI Document Generator - Frontend

A modern web application for AI-powered document analysis, proposal generation, and interactive chat with your documents. Built with Next.js 16, React 19, and TypeScript.

## 🎯 Overview

This frontend application provides an intuitive interface for:
- Managing multiple projects with document collections
- Uploading and analyzing requirements documents
- AI-powered extraction of project requirements
- Automatic generation of technical proposals
- Interactive Mermaid diagrams (system architecture, user flows, data models)
- RAG-based chat interface for querying your documents
- Export functionality for proposals and diagrams

## ✨ Features

### Authentication
- User registration and login
- JWT-based authentication with localStorage
- Protected routes and automatic token refresh
- Session management with 24-hour token expiration

### Project Management
- Create and manage multiple projects
- Project-level document organization
- Delete projects with confirmation
- Project status tracking

### Document Processing
- **Text Input**: Paste requirements directly (auto-converts to file)
- **File Upload**: Drag-and-drop or click to upload
- Supported formats: TXT, MD, PDF, DOCX
- Multiple document upload per project

### AI-Powered Processing Pipeline
1. **Document Upload**: Add requirements documents
2. **Embedding Generation**: Process documents for semantic search
3. **AI Extraction**: Extract structured requirements (30-60 seconds)
4. **Diagram Generation**: Create Mermaid diagrams automatically
5. **Proposal Generation**: Generate comprehensive technical proposal

### Interactive Diagrams
- **System Architecture**: High-level system design
- **User Flow**: User journey and interactions
- **Development Workflow**: Development process and stages
- **Data Model**: Database schema and relationships
- Zoom controls and fullscreen mode
- Export diagrams as PNG or SVG

### Proposal Viewer
- Project overview and objectives
- Detailed requirements breakdown
- Feature specifications
- Technical architecture
- Timeline and milestones
- Business process analysis
- Scope definition
- Risks and open questions
- User flow documentation

### RAG Chat
- Chat with your documents using AI
- Context-aware responses based on uploaded documents
- Chat history per project
- Markdown formatting support
- Requires documents and embeddings to be processed first

### Export Capabilities
- Export full proposal as Markdown
- Export individual diagrams
- Download chat history

## 🛠 Tech Stack

- **Framework**: Next.js 16 (App Router)
- **UI Library**: React 19
- **Language**: TypeScript 5
- **Styling**: TailwindCSS 4
- **Diagrams**: Mermaid.js 11.4
- **Date Handling**: date-fns 4.1
- **Markdown**: react-markdown 9.0
- **Utilities**: clsx, tailwind-merge

## 📋 Prerequisites

- Node.js 18+ (LTS recommended)
- npm, yarn, pnpm, or bun
- Backend API running at `https://backend-hackaton-v2.vercel.app`

## 🚀 Installation

1. **Clone the repository**:
```bash
git clone <repository-url>
cd ibm_hackathon/frontend
```

2. **Install dependencies**:
```bash
npm install
# or
yarn install
# or
pnpm install
```

3. **Set up environment variables**:
Create a `.env.local` file in the frontend directory:
```env
NEXT_PUBLIC_API_BASE_URL=https://backend-hackaton-v2.vercel.app
```

For local backend development:
```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
```

## 🏃 Running the Application

### Development Mode
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build
```bash
npm run build
npm start
```

### Linting
```bash
npm run lint
```

## 📁 Project Structure

```
frontend/
├── app/                          # Next.js App Router
│   ├── auth/                     # Authentication pages
│   │   ├── login/               # Login page
│   │   └── register/            # Registration page
│   ├── dashboard/               # Main dashboard
│   ├── layout.tsx               # Root layout
│   ├── page.tsx                 # Landing page
│   └── globals.css              # Global styles
├── src/
│   ├── components/              # React components
│   │   ├── auth/               # Auth components (inputs, buttons, forms)
│   │   ├── chat/               # Chat interface components
│   │   ├── diagrams/           # Diagram viewer and controls
│   │   ├── projects/           # Project management components
│   │   ├── proposal/           # Proposal viewer sections
│   │   ├── ui/                 # Reusable UI components
│   │   └── workspace/          # Document upload and processing
│   ├── contexts/               # React contexts
│   │   └── AuthContext.tsx    # Authentication state management
│   ├── lib/                    # Utility libraries
│   │   ├── api.ts             # API client functions
│   │   ├── auth.ts            # Auth utilities
│   │   └── utils.ts           # Helper functions
│   └── types/                  # TypeScript type definitions
│       └── api.ts             # API response types
├── public/                      # Static assets
├── .env.local                   # Environment variables (create this)
├── next.config.ts              # Next.js configuration
├── tailwind.config.ts          # TailwindCSS configuration
├── tsconfig.json               # TypeScript configuration
└── package.json                # Dependencies and scripts
```

## 🔑 Key Components

### Authentication (`src/components/auth/`)
- **AuthInput**: Styled input fields for forms
- **AuthButton**: Primary action buttons
- **AuthError**: Error message display
- **AuthLink**: Navigation links between auth pages

### Workspace (`src/components/workspace/`)
- **WorkspaceLayout**: Main project workspace container
- **InputPanel**: Document upload interface
- **FileUploadZone**: Drag-and-drop file upload
- **TextInputForm**: Text paste with auto-conversion to file
- **DocumentList**: Display uploaded documents
- **ProcessingPipeline**: Step-by-step processing status
- **ResultsPanel**: Tabbed view for diagrams, proposal, and chat

### Diagrams (`src/components/diagrams/`)
- **DiagramView**: Main diagram container
- **DiagramTabs**: Switch between diagram types
- **MermaidDiagram**: Mermaid.js renderer with zoom/export
- **DiagramControls**: Zoom, fullscreen, export controls

### Proposal (`src/components/proposal/`)
- **ProposalView**: Main proposal container
- **ProposalSection**: Reusable section wrapper
- **ProjectOverview**: Project summary and objectives
- **Requirements**: Functional and non-functional requirements
- **FeatureBreakdown**: Detailed feature specifications
- **Architecture**: Technical architecture details
- **Timeline**: Project timeline and milestones
- **Scope**: In-scope and out-of-scope items
- **RisksAndQuestions**: Risk assessment and open questions

### Chat (`src/components/chat/`)
- **ChatView**: Main chat interface
- **ChatHistory**: Message list with markdown support
- **ChatInput**: Message input with send button
- **ChatMessage**: Individual message component
- **ChatWelcome**: Empty state with instructions

## 🔌 API Integration

### Base URL Configuration
All API calls use the `NEXT_PUBLIC_API_BASE_URL` environment variable:
```typescript
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://backend-hackaton-v2.vercel.app';
```

### Authentication Flow
1. User registers/logs in via `/auth/register` or `/auth/login`
2. Backend returns JWT token
3. Token stored in `localStorage` as `token`
4. All subsequent requests include: `Authorization: Bearer ${token}`
5. 401 responses clear token and redirect to login

### API Endpoints Used
- `POST /auth/register` - User registration
- `POST /auth/login` - User login
- `GET /projects/` - List user's projects
- `POST /projects/` - Create new project (note trailing slash!)
- `DELETE /projects/{id}` - Delete project
- `POST /projects/{id}/documents/upload` - Upload documents
- `POST /projects/{id}/process-embeddings` - Generate embeddings
- `POST /projects/{id}/extract` - Extract requirements (long-running)
- `POST /projects/{id}/diagrams/generate` - Generate diagrams
- `POST /projects/{id}/proposal/generate` - Generate proposal
- `POST /projects/{id}/chat` - Send chat message
- `GET /projects/{id}/chat/history` - Get chat history

### Important API Quirks
- **Trailing Slash Required**: Use `POST /projects/` not `POST /projects`
- **Text to File Conversion**: Backend only accepts file uploads, not raw text
  ```typescript
  const file = new File([text], 'requirements.txt', { type: 'text/plain' });
  ```
- **Long-Running Operations**: Extraction takes 30-60 seconds, show loading state
- **Sequential Processing**: Must follow pipeline order: upload → embeddings → extract → diagrams → proposal

## 🎨 Styling

### TailwindCSS 4
The project uses TailwindCSS 4 with custom configuration:
- Custom color palette
- Responsive design utilities
- Dark mode support (system preference)
- Custom animations and transitions

### Component Patterns
- Consistent spacing with Tailwind utilities
- Reusable UI components in `src/components/ui/`
- Responsive layouts with mobile-first approach
- Accessible components with ARIA labels

## 🐛 Troubleshooting

### Common Issues

**1. API Connection Errors**
```
Error: Failed to fetch
```
**Solution**: Verify `NEXT_PUBLIC_API_BASE_URL` in `.env.local` and restart dev server.

**2. Authentication Errors**
```
401 Unauthorized
```
**Solution**: Token may be expired. Log out and log in again. Tokens expire after 24 hours.

**3. Text Upload Not Working**
**Solution**: Ensure text is being converted to File object before upload:
```typescript
const file = new File([text], 'requirements.txt', { type: 'text/plain' });
```

**4. Extraction Taking Too Long**
**Solution**: Extraction is a long-running operation (30-60 seconds). Ensure loading state is displayed. Check backend logs if it exceeds 2 minutes.

**5. Diagrams Not Rendering**
**Solution**: 
- Ensure extraction completed successfully
- Check browser console for Mermaid errors
- Verify diagram content is valid Mermaid syntax

**6. Chat Not Working**
**Solution**: 
- Ensure documents are uploaded
- Verify embeddings are processed
- Check that extraction is complete
- Documents must be processed before chat is available

**7. Environment Variables Not Loading**
**Solution**: 
- Restart dev server after changing `.env.local`
- Ensure variable starts with `NEXT_PUBLIC_` for client-side access
- Clear `.next` cache: `rm -rf .next && npm run dev`

### Development Tips

**Hot Reload Issues**
```bash
# Clear Next.js cache
rm -rf .next
npm run dev
```

**Type Errors**
```bash
# Regenerate TypeScript types
npm run build
```

**Styling Not Updating**
```bash
# Clear PostCSS cache
rm -rf .next
npm run dev
```

## ⚠️ Known Limitations (Hackathon MVP)

### Security
- JWT tokens stored in localStorage (not httpOnly cookies)
- No token refresh mechanism
- Basic error handling without retry logic

### Features
- No offline support
- No real-time collaboration
- No document versioning
- No undo/redo functionality
- Limited file format support
- No batch operations

### Performance
- No pagination for large document lists
- No lazy loading for chat history
- No caching strategy for API responses
- Large diagrams may impact performance

### UX
- No drag-and-drop reordering
- No keyboard shortcuts
- No customizable themes
- Limited mobile optimization
- No accessibility audit completed

### Data
- No data export beyond proposals
- No backup/restore functionality
- No data migration tools

## 🚢 Deployment

See [DEPLOYMENT.md](../DEPLOYMENT.md) for detailed deployment instructions.

### Quick Deploy to Vercel

1. Push code to GitHub
2. Import project in Vercel
3. Set environment variable:
   - `NEXT_PUBLIC_API_BASE_URL=https://backend-hackaton-v2.vercel.app`
4. Deploy

## 📝 Environment Variables

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `NEXT_PUBLIC_API_BASE_URL` | Backend API URL | `https://backend-hackaton-v2.vercel.app` | Yes |

## 🤝 Contributing

This is a hackathon MVP project. For production use, consider:
- Implementing httpOnly cookie authentication
- Adding comprehensive error handling
- Implementing retry logic for failed requests
- Adding unit and integration tests
- Improving accessibility (WCAG compliance)
- Adding analytics and monitoring
- Implementing proper state management (Redux/Zustand)
- Adding WebSocket support for real-time updates

## 📄 License

MIT License - See LICENSE file for details

## 🔗 Related Documentation

- [Backend README](../backend/README.md)
- [API Documentation](./API_DOCUMENTATION.md)
- [Deployment Guide](../DEPLOYMENT.md)
- [Project Root README](../README.md)

## 📞 Support

For issues and questions:
1. Check the troubleshooting section above
2. Review API documentation
3. Check backend logs for API errors
4. Verify environment variables are set correctly

---

Built with ❤️ for IBM Hackathon 2026
