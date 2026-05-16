# AI Document Generator

An intelligent document analysis and proposal generation system powered by AI. Upload your requirements documents, and let AI extract structured information, generate technical proposals, create system diagrams, and provide interactive chat capabilities.

![Project Status](https://img.shields.io/badge/status-hackathon%20mvp-orange)
![License](https://img.shields.io/badge/license-MIT-blue)

## 🎯 Overview

This full-stack application combines modern web technologies with AI capabilities to streamline the process of analyzing requirements documents and generating comprehensive technical proposals. Built for the IBM Hackathon 2026.

### Key Capabilities

- **Intelligent Document Processing**: Upload requirements in various formats (TXT, MD, PDF, DOCX)
- **AI-Powered Extraction**: Automatically extract and structure project requirements
- **Proposal Generation**: Generate comprehensive technical proposals with timelines, architecture, and scope
- **Interactive Diagrams**: Auto-generate Mermaid diagrams for system architecture, user flows, and data models
- **RAG-Based Chat**: Ask questions about your documents using retrieval-augmented generation
- **Multi-Project Management**: Organize and manage multiple projects with separate document collections

## 🏗 Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         Frontend                             │
│  Next.js 16 + React 19 + TypeScript + TailwindCSS          │
│  - Authentication UI                                         │
│  - Project Management Dashboard                             │
│  - Document Upload Interface                                │
│  - Diagram Viewer (Mermaid.js)                              │
│  - Proposal Viewer                                           │
│  - RAG Chat Interface                                        │
└─────────────────┬───────────────────────────────────────────┘
                  │
                  │ REST API (JWT Auth)
                  │
┌─────────────────▼───────────────────────────────────────────┐
│                         Backend                              │
│  FastAPI + Python + PostgreSQL + pgvector                   │
│  - User Authentication (JWT)                                 │
│  - Project & Document Management                             │
│  - OpenAI Integration (or compatible providers)             │
│  - Vector Embeddings (RAG)                                   │
│  - AI Extraction Service                                     │
│  - Diagram Generation Service                                │
│  - Chat Service with Context                                 │
└─────────────────┬───────────────────────────────────────────┘
                  │
                  │ OpenAI-compatible API
                  │
┌─────────────────▼───────────────────────────────────────────┐
│                      AI Provider                             │
│  OpenAI / Azure OpenAI / Local LLM / Other                  │
│  - GPT-4 for extraction and chat                            │
│  - text-embedding-3-small for vectors                       │
└─────────────────────────────────────────────────────────────┘
```

## ✨ Features

### 🔐 Authentication & User Management
- Secure user registration and login
- JWT-based authentication
- Session management with 24-hour token expiration
- Protected routes and API endpoints

### 📁 Project Management
- Create and organize multiple projects
- Project-level document collections
- Delete projects with confirmation
- Track processing status per project

### 📄 Document Processing Pipeline
1. **Upload**: Drag-and-drop or paste text (auto-converts to file)
2. **Embeddings**: Generate vector embeddings for semantic search
3. **Extraction**: AI extracts structured requirements (30-60 seconds)
4. **Diagrams**: Auto-generate 4 types of Mermaid diagrams
5. **Proposal**: Generate comprehensive technical proposal

### 📊 Interactive Diagrams
- **System Architecture**: High-level system design and components
- **User Flow**: User journey and interaction patterns
- **Development Workflow**: Development stages and processes
- **Data Model**: Database schema and entity relationships
- Zoom, pan, and fullscreen controls
- Export as PNG or SVG

### 📝 Proposal Generation
Automatically generated sections:
- Project overview and objectives
- Functional and non-functional requirements
- Feature breakdown with priorities
- Technical architecture and stack
- Project timeline and milestones
- Business process analysis
- Scope definition (in/out of scope)
- Risk assessment and open questions
- User flow documentation

### 💬 RAG-Powered Chat
- Ask questions about your uploaded documents
- Context-aware responses using vector similarity search
- Chat history per project
- Markdown formatting support
- Requires documents and embeddings to be processed

### 📤 Export Capabilities
- Export proposals as Markdown
- Download diagrams as images
- Export chat history

## 🚀 Quick Start

### Prerequisites

- **Backend**:
  - Python 3.9+
  - PostgreSQL 14+ with pgvector extension
  - OpenAI API key (or compatible provider)

- **Frontend**:
  - Node.js 18+
  - npm, yarn, pnpm, or bun

### 1. Clone Repository

```bash
git clone <repository-url>
cd ibm_hackathon
```

### 2. Setup Backend

```bash
cd backend

# Install dependencies
pip install -r requirements.txt

# Create database
createdb doc_generator_db

# Run schema
psql -U postgres -d doc_generator_db -f schema.sql

# Configure environment
cp .env.example .env
# Edit .env with your settings

# Generate secret key
python generate_secret_key.py

# Run server
python main.py
```

Backend will be available at `http://localhost:8000`

See [backend/README.md](backend/README.md) for detailed setup instructions.

### 3. Setup Frontend

```bash
cd frontend

# Install dependencies
npm install

# Configure environment
echo "NEXT_PUBLIC_API_BASE_URL=http://localhost:8000" > .env.local

# Run development server
npm run dev
```

Frontend will be available at `http://localhost:3000`

See [frontend/README.md](frontend/README.md) for detailed setup instructions.

## 📖 Documentation

- **[Backend Documentation](backend/README.md)** - API setup, endpoints, and configuration
- **[Frontend Documentation](frontend/README.md)** - UI components, features, and troubleshooting
- **[API Documentation](backend/API_DOCUMENTATION.md)** - Complete API reference
- **[Deployment Guide](DEPLOYMENT.md)** - Production deployment instructions

## 🎮 Demo Workflow

### 1. Register & Login
```
1. Navigate to http://localhost:3000
2. Click "Sign Up" and create an account
3. Login with your credentials
```

### 2. Create Project
```
1. Click "New Project" on dashboard
2. Enter project name and description
3. Click "Create Project"
```

### 3. Upload Documents
```
1. Open your project
2. Paste text or drag-and-drop files
3. Supported formats: TXT, MD, PDF, DOCX
4. Click "Upload Documents"
```

### 4. Process Documents
```
1. Click "Process Embeddings" (generates vectors)
2. Click "Extract Requirements" (30-60 seconds)
3. Wait for extraction to complete
```

### 5. Generate Outputs
```
1. Click "Generate Diagrams" (creates 4 diagram types)
2. Click "Generate Proposal" (creates full proposal)
3. View results in tabs: Diagrams, Proposal, Chat
```

### 6. Interact with Results
```
- Switch between diagram types
- Zoom and export diagrams
- Read and export proposal
- Chat with your documents
```

## 🛠 Tech Stack

### Backend
- **Framework**: FastAPI 0.115+
- **Language**: Python 3.9+
- **Database**: PostgreSQL 14+ with pgvector
- **AI**: OpenAI API (or compatible providers)
- **Authentication**: JWT (python-jose)
- **ORM**: psycopg2 (direct SQL)

### Frontend
- **Framework**: Next.js 16 (App Router)
- **UI Library**: React 19
- **Language**: TypeScript 5
- **Styling**: TailwindCSS 4
- **Diagrams**: Mermaid.js 11.4
- **Markdown**: react-markdown 9.0
- **Date Handling**: date-fns 4.1

## 🔧 Configuration

### Backend Environment Variables

```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/doc_generator_db

# Security
SECRET_KEY=your-secret-key-here

# AI Provider (OpenAI or compatible)
OPENAI_API_KEY=your-api-key
OPENAI_BASE_URL=https://api.openai.com/v1
OPENAI_MODEL=gpt-4
OPENAI_EMBEDDING_MODEL=text-embedding-3-small
```

### Frontend Environment Variables

```env
# API Configuration
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
```

For production:
```env
NEXT_PUBLIC_API_BASE_URL=https://backend-hackaton-v2.vercel.app
```

## 🌐 Deployment

### Backend (Deployed)
- **URL**: `https://backend-hackaton-v2.vercel.app`
- **Platform**: Vercel
- **Database**: PostgreSQL with pgvector

### Frontend (To Deploy)
- **Platform**: Vercel (recommended)
- **Build Command**: `npm run build`
- **Output Directory**: `.next`

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed deployment instructions.

## 🐛 Troubleshooting

### Common Issues

**Backend won't start**
- Verify PostgreSQL is running
- Check database connection string in `.env`
- Ensure pgvector extension is installed
- Run schema.sql to create tables

**Frontend can't connect to backend**
- Verify `NEXT_PUBLIC_API_BASE_URL` in `.env.local`
- Check backend is running on correct port
- Restart frontend dev server after changing env vars

**Extraction takes too long**
- Normal extraction time: 30-60 seconds
- Check OpenAI API key is valid
- Verify model supports JSON mode
- Check backend logs for errors

**Diagrams not rendering**
- Ensure extraction completed successfully
- Check browser console for Mermaid errors
- Verify diagram content is valid Mermaid syntax

**Chat not working**
- Upload documents first
- Process embeddings before chatting
- Complete extraction before using chat
- Check that documents were uploaded successfully

## ⚠️ Known Limitations (Hackathon MVP)

### Security
- JWT tokens stored in localStorage (not httpOnly cookies)
- No token refresh mechanism
- Basic error handling without comprehensive retry logic
- No rate limiting implemented

### Features
- No real-time collaboration
- No document versioning
- No undo/redo functionality
- Limited file format support
- No batch operations
- No offline support

### Performance
- No pagination for large datasets
- No lazy loading for chat history
- No caching strategy for API responses
- Large diagrams may impact browser performance

### Data
- No automated backup/restore
- No data migration tools
- No export beyond proposals and diagrams

## 🤝 Contributing

This is a hackathon MVP project. For production use, consider:

**Security Enhancements**
- Implement httpOnly cookie authentication
- Add token refresh mechanism
- Implement rate limiting
- Add CSRF protection
- Conduct security audit

**Feature Improvements**
- Add real-time collaboration (WebSockets)
- Implement document versioning
- Add more file format support
- Implement batch operations
- Add offline support with service workers

**Performance Optimizations**
- Implement pagination
- Add lazy loading
- Implement caching strategy
- Optimize large diagram rendering
- Add CDN for static assets

**Testing & Quality**
- Add unit tests (pytest, Jest)
- Add integration tests
- Add e2e tests (Playwright)
- Implement CI/CD pipeline
- Add code coverage reporting

**Monitoring & Analytics**
- Add error tracking (Sentry)
- Implement analytics
- Add performance monitoring
- Set up logging infrastructure
- Create admin dashboard

## 📄 License

MIT License - See LICENSE file for details

## 🙏 Acknowledgments

- Built for IBM Hackathon 2026
- Powered by OpenAI GPT-4 and embeddings
- UI components inspired by modern design systems
- Mermaid.js for diagram rendering

## 📞 Support

For issues and questions:
1. Check documentation in respective README files
2. Review troubleshooting sections
3. Check API documentation for endpoint details
4. Verify environment variables are configured correctly
5. Review backend logs for API errors

## 🔗 Quick Links

- [Backend README](backend/README.md)
- [Frontend README](frontend/README.md)
- [API Documentation](backend/API_DOCUMENTATION.md)
- [Deployment Guide](DEPLOYMENT.md)
- [Backend API Docs](http://localhost:8000/docs) (when running locally)

---

**Built with ❤️ for IBM Hackathon 2026**

*Transforming requirements into actionable technical proposals with the power of AI*