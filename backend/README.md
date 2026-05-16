# AI Document Generator - Backend

FastAPI backend for AI-assisted document generation and project planning.

## Setup Instructions

### 1. Install Dependencies

```bash
pip install -r requirements.txt
```

### 2. Setup PostgreSQL Database

Install PostgreSQL and create a database:

```bash
# Create database
createdb doc_generator_db

# Or using psql
psql -U postgres
CREATE DATABASE doc_generator_db;
```

Run the schema to create all tables:

```bash
# Using psql
psql -U postgres -d doc_generator_db -f schema.sql

# Or connect to database first
psql -U postgres -d doc_generator_db
\i schema.sql
```

The schema will create:
- `users` table - User accounts
- `projects` table - Projects with extraction results
- `documents` table - Uploaded documents
- `embeddings` table - Vector embeddings for RAG
- `chat_history` table - Chat conversation history

### 3. Configure Environment Variables

Copy `.env.example` to `.env` and update the values:

```bash
cp .env.example .env
```

Update the following in `.env`:
- `DATABASE_URL`: Your PostgreSQL connection string
- `SECRET_KEY`: Generate a secure random key
- `OPENAI_API_KEY`: Your OpenAI API key
- `OPENAI_BASE_URL`: OpenAI API base URL (default: https://api.openai.com/v1)
  - Use default for OpenAI
  - Change to use OpenAI-compatible providers (e.g., Azure OpenAI, local LLMs)
- `OPENAI_MODEL`: Chat completion model name (default: gpt-4)
  - Change based on your provider's available models
- `OPENAI_EMBEDDING_MODEL`: Embedding model name (default: text-embedding-3-small)
  - Change based on your provider's available embedding models

### 4. Run the Application

```bash
python main.py
```

Or using uvicorn directly:

```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

The API will be available at: `http://localhost:8000`

API documentation: `http://localhost:8000/docs`

## Project Structure

```
backend/
├── main.py              # FastAPI application entry point
├── config.py            # Configuration management
├── database.py          # Database connection and setup
├── requirements.txt     # Python dependencies
├── .env.example         # Environment variables template
├── models/              # Database models
├── routes/              # API endpoints
├── services/            # Business logic
└── utils/               # Utility functions
```

## API Endpoints

### Health Check
- `GET /` - Basic health check
- `GET /health` - Detailed health status

### Authentication ✅
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login and get JWT token
- `GET /auth/me` - Get current user info

### Projects (Coming in Step 3)
- `POST /projects` - Create new project
- `GET /projects` - List user's projects
- `GET /projects/{id}` - Get project details
- `DELETE /projects/{id}` - Delete project

### Documents (Coming in Step 4)
- `POST /projects/{id}/documents` - Upload documents

### Extraction (Coming in Step 7)
- `POST /projects/{id}/extract` - Generate structured extraction

## Development Notes

- The application uses PostgreSQL with pgvector extension for vector storage
- JWT tokens are used for authentication
- OpenAI API is used for embeddings and extraction
- CORS is configured for local frontend development
- Supports OpenAI-compatible API providers via `OPENAI_BASE_URL` configuration

## Using Alternative LLM Providers

The backend supports any OpenAI-compatible API provider. Configure via environment variables in `.env`:

### OpenAI (default)
```env
OPENAI_BASE_URL=https://api.openai.com/v1
OPENAI_MODEL=gpt-4
OPENAI_EMBEDDING_MODEL=text-embedding-3-small
```

### Azure OpenAI
```env
OPENAI_BASE_URL=https://your-resource.openai.azure.com/openai/deployments/your-deployment
OPENAI_MODEL=gpt-4
OPENAI_EMBEDDING_MODEL=text-embedding-ada-002
```

### Local LLM (LM Studio, Ollama with OpenAI compatibility)
```env
OPENAI_BASE_URL=http://localhost:1234/v1
OPENAI_MODEL=llama-3.1-8b-instruct
OPENAI_EMBEDDING_MODEL=nomic-embed-text
```

### Other Providers (Together AI, Anyscale, etc.)
```env
OPENAI_BASE_URL=https://api.together.xyz/v1
OPENAI_MODEL=meta-llama/Meta-Llama-3.1-8B-Instruct-Turbo
OPENAI_EMBEDDING_MODEL=togethercomputer/m2-bert-80M-8k-retrieval
```

### Custom Provider Example
```env
OPENAI_BASE_URL=https://your-custom-provider.com/v1
OPENAI_MODEL=your-model-name
OPENAI_EMBEDDING_MODEL=your-embedding-model
```

**Important Notes:**
- Make sure your chosen model supports JSON mode for extraction to work properly
- Embedding model dimension must match the database schema (1536 dimensions by default)
- Check your provider's documentation for available model names
- No code changes required - just update environment variables!