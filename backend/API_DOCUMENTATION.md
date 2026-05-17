# AI Document Generator API Documentation

Base URL: `https://backend-hackaton-v2.vercel.app/`

## Table of Contents
1. [Authentication](#authentication)
2. [Projects](#projects)
3. [Documents](#documents)
4. [Extraction](#extraction)
5. [Diagrams](#diagrams)
6. [Chat](#chat)
7. [Frontend Implementation Guide](#frontend-implementation-guide)

---

## Authentication

### 1. Register User
Create a new user account.

**Endpoint:** `POST /auth/register`

**Headers:**
```
Content-Type: application/json
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securepassword123"
}
```

**Response:** `201 Created`
```json
{
  "id": 1,
  "email": "user@example.com"
}
```

**Error Responses:**
- `400 Bad Request` - Email already registered
- `422 Unprocessable Entity` - Invalid email format or password too short

---

### 2. Login
Login and receive JWT access token.

**Endpoint:** `POST /auth/login`

**Headers:**
```
Content-Type: application/json
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securepassword123"
}
```

**Response:** `200 OK`
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer"
}
```

**Error Responses:**
- `401 Unauthorized` - Incorrect email or password

**Note:** Save the `access_token` for use in subsequent requests.

---

### 3. Get Current User
Get authenticated user information.

**Endpoint:** `GET /auth/me`

**Headers:**
```
Authorization: Bearer <your_access_token>
```

**Response:** `200 OK`
```json
{
  "id": 1,
  "email": "user@example.com"
}
```

**Error Responses:**
- `401 Unauthorized` - Invalid or missing token

---

## Projects

All project endpoints require authentication.

### 4. Create Project
Create a new project.

**Endpoint:** `POST /projects`

**Headers:**
```
Authorization: Bearer <your_access_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "E-commerce Platform",
  "description": "Building a modern e-commerce platform with AI recommendations"
}
```

**Response:** `201 Created`
```json
{
  "id": 1,
  "user_id": 1,
  "name": "E-commerce Platform",
  "description": "Building a modern e-commerce platform with AI recommendations",
  "extraction_result": null,
  "created_at": "2024-01-15T10:30:00Z",
  "updated_at": "2024-01-15T10:30:00Z"
}
```

---

### 5. List Projects
Get all projects for authenticated user.

**Endpoint:** `GET /projects`

**Headers:**
```
Authorization: Bearer <your_access_token>
```

**Query Parameters:**
- `skip` (optional): Number of projects to skip (default: 0)
- `limit` (optional): Maximum number of projects (default: 100)

**Response:** `200 OK`
```json
{
  "total": 5,
  "projects": [
    {
      "id": 1,
      "user_id": 1,
      "name": "E-commerce Platform",
      "description": "Building a modern e-commerce platform",
      "extraction_result": null,
      "created_at": "2024-01-15T10:30:00Z",
      "updated_at": "2024-01-15T10:30:00Z"
    }
  ]
}
```

---

### 6. Get Project
Get a specific project by ID.

**Endpoint:** `GET /projects/{project_id}`

**Headers:**
```
Authorization: Bearer <your_access_token>
```

**Response:** `200 OK`
```json
{
  "id": 1,
  "user_id": 1,
  "name": "E-commerce Platform",
  "description": "Building a modern e-commerce platform",
  "extraction_result": {
    "project_overview": {...},
    "requirements": {...}
  },
  "created_at": "2024-01-15T10:30:00Z",
  "updated_at": "2024-01-15T10:30:00Z"
}
```

**Error Responses:**
- `404 Not Found` - Project not found or doesn't belong to user

---

### 7. Update Project
Update project details.

**Endpoint:** `PUT /projects/{project_id}`

**Headers:**
```
Authorization: Bearer <your_access_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "Updated Project Name",
  "description": "Updated description"
}
```

**Response:** `200 OK`
```json
{
  "id": 1,
  "user_id": 1,
  "name": "Updated Project Name",
  "description": "Updated description",
  "extraction_result": null,
  "created_at": "2024-01-15T10:30:00Z",
  "updated_at": "2024-01-15T11:00:00Z"
}
```

---

### 8. Delete Project
Delete a project and all associated data.

**Endpoint:** `DELETE /projects/{project_id}`

**Headers:**
```
Authorization: Bearer <your_access_token>
```

**Response:** `204 No Content`

**Error Responses:**
- `404 Not Found` - Project not found

---

## Documents

All document endpoints require authentication.

### 9. Upload Document
Upload a document to a project.

**Endpoint:** `POST /projects/{project_id}/documents/upload`

**Headers:**
```
Authorization: Bearer <your_access_token>
Content-Type: multipart/form-data
```

**Form Data:**
- `file`: File to upload (.txt, .docx, or .pdf)

**Response:** `201 Created`
```json
{
  "id": 1,
  "project_id": 1,
  "filename": "requirements.pdf",
  "content": "Extracted text content from the document...",
  "file_type": ".pdf",
  "file_size": 45678,
  "created_at": "2024-01-15T10:35:00Z"
}
```

**Error Responses:**
- `400 Bad Request` - Unsupported file type
- `404 Not Found` - Project not found
- `500 Internal Server Error` - Failed to process file

**Supported File Types:**
- `.txt` - Plain text files
- `.docx` - Microsoft Word documents
- `.pdf` - PDF documents

---

### 10. List Documents
Get all documents for a project.

**Endpoint:** `GET /projects/{project_id}/documents/`

**Headers:**
```
Authorization: Bearer <your_access_token>
```

**Query Parameters:**
- `skip` (optional): Number of documents to skip (default: 0)
- `limit` (optional): Maximum number of documents (default: 100)

**Response:** `200 OK`
```json
{
  "total": 3,
  "documents": [
    {
      "id": 1,
      "project_id": 1,
      "filename": "requirements.pdf",
      "content": "Extracted text...",
      "file_type": ".pdf",
      "file_size": 45678,
      "created_at": "2024-01-15T10:35:00Z"
    }
  ]
}
```

---

### 11. Get Document
Get a specific document by ID.

**Endpoint:** `GET /projects/{project_id}/documents/{document_id}`

**Headers:**
```
Authorization: Bearer <your_access_token>
```

**Response:** `200 OK`
```json
{
  "id": 1,
  "project_id": 1,
  "filename": "requirements.pdf",
  "content": "Full extracted text content...",
  "file_type": ".pdf",
  "file_size": 45678,
  "created_at": "2024-01-15T10:35:00Z"
}
```

---

### 12. Delete Document
Delete a document.

**Endpoint:** `DELETE /projects/{project_id}/documents/{document_id}`

**Headers:**
```
Authorization: Bearer <your_access_token>
```

**Response:** `204 No Content`

---

## Extraction

All extraction endpoints require authentication.

### 13. Process Embeddings
Generate vector embeddings for all documents in a project.

**Endpoint:** `POST /projects/{project_id}/process-embeddings`

**Headers:**
```
Authorization: Bearer <your_access_token>
```

**Response:** `200 OK`
```json
{
  "message": "Embeddings processed successfully",
  "embeddings_created": 45
}
```

**Note:** This endpoint should be called after uploading documents and before extraction. It chunks documents and generates embeddings for RAG.

---

### 14. Extract Project Information
Extract structured information from project documents using AI.

**Endpoint:** `POST /projects/{project_id}/extract`

**Headers:**
```
Authorization: Bearer <your_access_token>
```

**Response:** `200 OK`
```json
{
  "message": "Extraction completed successfully",
  "extraction": {
    "project_overview": {
      "project_name": "E-commerce Platform",
      "problem": "Current shopping experience lacks personalization",
      "proposed_solution": "AI-powered recommendation engine",
      "target_users": ["Online shoppers", "Retail businesses"]
    },
    "requirements": {
      "functional": [
        "User authentication and profile management",
        "Product catalog with search and filters",
        "Shopping cart and checkout process"
      ],
      "non_functional": [
        "System should handle 10,000 concurrent users",
        "Page load time under 2 seconds",
        "99.9% uptime"
      ]
    },
    "feature_breakdown": [
      "User registration and login",
      "Product browsing and search",
      "AI-based recommendations",
      "Shopping cart",
      "Payment integration"
    ],
    "user_flow": [
      "User visits homepage",
      "Browses products or searches",
      "Views product details",
      "Adds to cart",
      "Proceeds to checkout",
      "Completes payment"
    ],
    "business_process": [
      "Customer places order",
      "Payment is processed",
      "Order is confirmed",
      "Warehouse picks and packs",
      "Shipping carrier delivers"
    ],
    "scope": {
      "in_scope": [
        "Web application development",
        "Mobile responsive design",
        "Payment gateway integration"
      ],
      "out_of_scope": [
        "Mobile native apps",
        "Physical store integration",
        "Inventory management system"
      ]
    },
    "architecture": {
      "frontend": "React with TypeScript",
      "backend": "Node.js with Express",
      "database": "PostgreSQL",
      "integrations": ["Stripe for payments", "SendGrid for emails"],
      "infrastructure": "AWS with Docker containers"
    },
    "timeline": [
      "Phase 1: Core features (8 weeks)",
      "Phase 2: AI recommendations (4 weeks)",
      "Phase 3: Testing and launch (2 weeks)"
    ],
    "risks": [
      "AI model accuracy may need tuning",
      "Payment gateway integration complexity",
      "Scalability challenges with high traffic"
    ],
    "open_questions": [
      "What payment methods should be supported?",
      "Should we support international shipping?",
      "What is the budget for AI infrastructure?"
    ]
  }
}
```

**Note:** This operation may take 30-60 seconds depending on document size. The extraction is automatically saved to the project.

---

### 15. Get Extraction
Get the extraction result for a project.

**Endpoint:** `GET /projects/{project_id}/extraction`

**Headers:**
```
Authorization: Bearer <your_access_token>
```

**Response:** `200 OK`
```json
{
  "project_overview": {...},
  "requirements": {...},
  "feature_breakdown": [...],
  "user_flow": [...],
  "business_process": [...],
  "scope": {...},
  "architecture": {...},
  "timeline": [...],
  "risks": [...],
  "open_questions": [...]
}
```

**Note:** If extraction hasn't been performed yet, this will trigger it automatically.

---

### 16. Get Proposal
Get proposal data (extraction without internal fields).

**Endpoint:** `GET /projects/{project_id}/proposal`

**Headers:**
```
Authorization: Bearer <your_access_token>
```

**Response:** `200 OK`
```json
{
  "project_overview": {...},
  "requirements": {...},
  "feature_breakdown": [...],
  "user_flow": [...],
  "business_process": [...],
  "scope": {...},
  "architecture": {...},
  "timeline": [...]
}
```

**Note:** This endpoint returns the same data as `/extraction` but excludes `risks` and `open_questions` fields, making it suitable for client-facing proposals.

---

## Complete Workflow Example

### Step 1: Register and Login
```bash
# Register
POST /auth/register
{
  "email": "demo@example.com",
  "password": "demo123"
}

# Login
POST /auth/login
{
  "email": "demo@example.com",
  "password": "demo123"
}
# Save the access_token from response
```

### Step 2: Create Project
```bash
POST /projects
Authorization: Bearer <token>
{
  "name": "My Project",
  "description": "Project description"
}
# Save the project id from response
```

### Step 3: Upload Documents
```bash
POST /projects/1/documents/upload
Authorization: Bearer <token>
Content-Type: multipart/form-data
file: requirements.pdf

POST /projects/1/documents/upload
Authorization: Bearer <token>
Content-Type: multipart/form-data
file: meeting-notes.docx
```

### Step 4: Process Embeddings
```bash
POST /projects/1/process-embeddings
Authorization: Bearer <token>
```

### Step 5: Extract Information
```bash
POST /projects/1/extract
Authorization: Bearer <token>
```

### Step 6: Get Proposal
```bash
GET /projects/1/proposal
Authorization: Bearer <token>
```

---

## Error Responses

All endpoints may return the following error responses:

### 400 Bad Request
```json
{
  "detail": "Error message describing what went wrong"
}
```

### 401 Unauthorized
```json
{
  "detail": "Invalid authentication credentials"
}
```

### 404 Not Found
```json
{
  "detail": "Resource not found"
}
```

### 422 Unprocessable Entity
```json
{
  "detail": [
    {
      "loc": ["body", "email"],
      "msg": "value is not a valid email address",
      "type": "value_error.email"
    }
  ]
}
```

### 500 Internal Server Error
```json
{
  "detail": "Internal server error message"
}
```

---

## Rate Limiting

Currently, there are no rate limits implemented. In production, consider implementing rate limiting to prevent abuse.

---

## Notes

1. All timestamps are in ISO 8601 format with UTC timezone
2. JWT tokens expire after 24 hours (1440 minutes)
3. Maximum file upload size: Check your server configuration
4. OpenAI API calls may take time - be patient with extraction endpoints
5. Vector embeddings are automatically created during extraction if not already present

---

## Testing with Postman

1. Import this documentation into Postman
2. Create an environment with variable `base_url` = `http://localhost:8000`
3. Create an environment variable `token` to store your access token
4. Use `{{base_url}}` and `{{token}}` in your requests
5. After login, manually set the `token` variable with the received access_token

---

## Support

For issues or questions, please refer to the project repository or contact the development team.

---

## Chat

### 1. Send Chat Message
Send a message and get AI response using RAG (Retrieval Augmented Generation).

**Endpoint:** `POST /projects/{project_id}/chat`

**Headers:**
```
Authorization: Bearer <your_jwt_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "message": "What are the main features of this project?"
}
```

**Response:** `201 Created`
```json
{
  "id": 1,
  "user_message": "What are the main features of this project?",
  "ai_response": "Based on the uploaded documents, the main features include:\n\n1. **User Authentication** - Secure login and registration system\n2. **Document Upload** - Support for .txt, .docx, and .pdf files\n3. **AI Extraction** - Automated extraction of project information\n4. **Interactive Chat** - Ask questions about your documents\n\nThese features are mentioned in the requirements.txt and design.docx files.",
  "created_at": "2024-01-15T10:30:00Z"
}
```

**How it works:**
1. The system searches for relevant document chunks using vector similarity
2. Uses the project's extraction result as additional context
3. Generates a contextual response using GPT-4
4. Stores the conversation in chat history

**Error Responses:**
- `401 Unauthorized` - Invalid or missing token
- `404 Not Found` - Project not found or access denied
- `500 Internal Server Error` - Failed to process chat message

---

### 2. Get Chat History
Retrieve chat history for a project.

**Endpoint:** `GET /projects/{project_id}/chat`

**Headers:**
```
Authorization: Bearer <your_jwt_token>
```

**Query Parameters:**
- `limit` (optional): Maximum number of messages to return (default: 50, max: 100)

**Example:** `GET /projects/1/chat?limit=20`

**Response:** `200 OK`
```json
[
  {
    "id": 1,
    "user_message": "What are the main features?",
    "ai_response": "The main features include...",
    "created_at": "2024-01-15T10:30:00Z"
  },
  {
    "id": 2,
    "user_message": "What technologies are used?",
    "ai_response": "Based on the documents, the technologies include...",
    "created_at": "2024-01-15T10:35:00Z"
  }
]
```

**Notes:**
- Messages are ordered by creation time (oldest first)
- Maximum 100 messages can be retrieved at once

**Error Responses:**
- `401 Unauthorized` - Invalid or missing token
- `404 Not Found` - Project not found or access denied
- `500 Internal Server Error` - Failed to retrieve chat history

---

### 3. Clear Chat History
Delete all chat history for a project.

**Endpoint:** `DELETE /projects/{project_id}/chat`

**Headers:**
```
Authorization: Bearer <your_jwt_token>
```

**Response:** `204 No Content`

**Notes:**
- This action cannot be undone
- All chat messages for the project will be permanently deleted

**Error Responses:**
- `401 Unauthorized` - Invalid or missing token
- `404 Not Found` - Project not found or access denied
- `500 Internal Server Error` - Failed to delete chat history

---

## Complete Workflow Example (Including Chat)

Here's a complete workflow from registration to chatting with your documents:

### Step 1: Register and Login
```bash
# Register
curl -X POST http://localhost:8000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "password": "securepass123"}'

# Login
curl -X POST http://localhost:8000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "password": "securepass123"}'
```

### Step 2: Create Project
```bash
curl -X POST http://localhost:8000/projects \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name": "My Project", "description": "Project description"}'
```

### Step 3: Upload Documents
```bash
curl -X POST http://localhost:8000/projects/1/documents/upload \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "file=@requirements.txt"
```

### Step 4: Process Embeddings
```bash
curl -X POST http://localhost:8000/projects/1/process-embeddings \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Step 5: Extract Information
```bash
curl -X POST http://localhost:8000/projects/1/extract \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Step 6: Chat with Your Documents
```bash
# Ask a question
curl -X POST http://localhost:8000/projects/1/chat \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"message": "What are the main features of this project?"}'

# Get chat history
curl -X GET http://localhost:8000/projects/1/chat \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Step 7: Get Proposal
```bash
curl -X GET http://localhost:8000/projects/1/proposal \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## Chat Feature Benefits

### 1. **Contextual Understanding**
- AI searches through all your documents to find relevant information
- Uses vector similarity to retrieve the most relevant chunks
- Combines document context with extraction results

### 2. **Natural Conversation**
- Ask questions in plain English
- Get detailed, contextual answers
- Reference specific documents in responses

### 3. **Project Insights**
- Understand your project better
- Clarify requirements
- Explore technical details
- Get recommendations

### 4. **Use Cases**
- "What are the main features?"
- "What technologies are mentioned?"
- "What are the project risks?"
- "Explain the system architecture"
- "What are the timeline estimates?"
- "Who are the stakeholders?"

---

## Rate Limiting

- **Authentication endpoints:** 10 requests per minute
- **Document upload:** 5 requests per minute
- **Chat messages:** 20 requests per minute
- **Other endpoints:** 60 requests per minute

---

## General Notes

1. **Authentication:** All endpoints except `/auth/register` and `/auth/login` require JWT authentication
2. **Token Format:** Include token in Authorization header as `Bearer <token>`
3. **File Size Limits:** Maximum 10MB per document upload
4. **Supported Formats:** .txt, .docx, .pdf
5. **Chat Context:** AI uses up to 5 most relevant document chunks per message
6. **Response Time:** Chat responses typically take 2-5 seconds depending on document size

---

## Testing with Postman

### Import Collection
1. Create a new Postman collection
2. Add environment variables:
   - `base_url`: `http://localhost:8000`
   - `token`: (will be set after login)
   - `project_id`: (will be set after creating project)

### Test Sequence
1. Register user → Save response
2. Login → Save `access_token` to environment
3. Create project → Save `id` to environment
4. Upload documents
5. Process embeddings
6. Extract information
7. Start chatting with your documents!

---

**Made with ❤️ using FastAPI, PostgreSQL, and OpenAI**

---

## Diagrams

### 1. Generate Diagrams
Generate all diagram types from project extraction data.

**Endpoint:** `POST /projects/{project_id}/diagrams/generate`

**Headers:**
```
Authorization: Bearer <your_jwt_token>
```

**Prerequisites:**
- Project must have extraction_result populated
- Run POST `/projects/{id}/extract` first

**Response:** `201 Created`
```json
[
  {
    "id": 1,
    "project_id": 1,
    "diagram_type": "system_architecture",
    "title": "System Architecture",
    "mermaid_content": "graph TB\n    A[Frontend<br/>React] --> B[API Gateway]\n    B --> C[Backend<br/>FastAPI]\n    C --> D[Database<br/>PostgreSQL]\n    C --> E[OpenAI API]",
    "created_at": "2024-01-15T10:00:00Z"
  },
  {
    "id": 2,
    "project_id": 1,
    "diagram_type": "user_flow",
    "title": "User Flow",
    "mermaid_content": "flowchart TD\n    A[User Access] --> B{Authenticated?}\n    B -->|No| C[Login/Register]\n    C --> B\n    B -->|Yes| D[Dashboard]",
    "created_at": "2024-01-15T10:00:01Z"
  },
  {
    "id": 3,
    "project_id": 1,
    "diagram_type": "development_workflow",
    "title": "Development Timeline",
    "mermaid_content": "gantt\n    title Development Timeline\n    dateFormat YYYY-MM-DD\n    section Planning\n    Requirements :2024-01-01, 3d",
    "created_at": "2024-01-15T10:00:02Z"
  },
  {
    "id": 4,
    "project_id": 1,
    "diagram_type": "data_model",
    "title": "Data Model (ERD)",
    "mermaid_content": "erDiagram\n    USER ||--o{ PROJECT : creates\n    PROJECT ||--o{ DOCUMENT : contains",
    "created_at": "2024-01-15T10:00:03Z"
  }
]
```

**Diagram Types Generated:**
- `system_architecture` - System architecture diagram (graph)
- `user_flow` - User flow diagram (flowchart)
- `development_workflow` - Development timeline (gantt)
- `data_model` - Data model / ERD (erDiagram)

**Error Responses:**
- `401 Unauthorized` - Invalid or missing token
- `404 Not Found` - Project not found or extraction not done
- `500 Internal Server Error` - Failed to generate diagrams

---

### 2. Get All Diagrams
Retrieve all diagrams for a project.

**Endpoint:** `GET /projects/{project_id}/diagrams`

**Headers:**
```
Authorization: Bearer <your_jwt_token>
```

**Response:** `200 OK`
```json
[
  {
    "id": 1,
    "project_id": 1,
    "diagram_type": "system_architecture",
    "title": "System Architecture",
    "mermaid_content": "graph TB\n...",
    "created_at": "2024-01-15T10:00:00Z"
  }
]
```

**Notes:**
- Returns diagrams ordered by creation time (newest first)
- Returns empty array if no diagrams generated yet

**Error Responses:**
- `401 Unauthorized` - Invalid or missing token
- `404 Not Found` - Project not found or access denied

---

### 3. Get Specific Diagram
Get a single diagram by ID.

**Endpoint:** `GET /projects/{project_id}/diagrams/{diagram_id}`

**Headers:**
```
Authorization: Bearer <your_jwt_token>
```

**Response:** `200 OK`
```json
{
  "id": 1,
  "project_id": 1,
  "diagram_type": "system_architecture",
  "title": "System Architecture",
  "mermaid_content": "graph TB\n    A[Frontend] --> B[Backend]",
  "created_at": "2024-01-15T10:00:00Z"
}
```

**Error Responses:**
- `401 Unauthorized` - Invalid or missing token
- `404 Not Found` - Diagram or project not found

---

### 4. Delete All Diagrams
Delete all diagrams for a project.

**Endpoint:** `DELETE /projects/{project_id}/diagrams`

**Headers:**
```
Authorization: Bearer <your_jwt_token>
```

**Response:** `204 No Content`

**Notes:**
- This action cannot be undone
- You can regenerate diagrams using POST `/projects/{id}/diagrams/generate`

**Error Responses:**
- `401 Unauthorized` - Invalid or missing token
- `404 Not Found` - Project not found or access denied

---

### 5. Get Proposal with Diagrams
Get complete proposal including diagrams.

**Endpoint:** `GET /projects/{project_id}/proposal`

**Headers:**
```
Authorization: Bearer <your_jwt_token>
```

**Response:** `200 OK`
```json
{
  "project_name": "AI Document Generator",
  "description": "An AI-powered system...",
  "tech_stack": {
    "frontend": ["React", "TypeScript"],
    "backend": ["FastAPI", "Python"],
    "database": ["PostgreSQL"]
  },
  "features": [
    {
      "name": "Document Upload",
      "description": "Upload and process documents"
    }
  ],
  "timeline": {
    "total_duration": "6 weeks",
    "phases": [...]
  },
  "diagrams": [
    {
      "id": 1,
      "type": "system_architecture",
      "title": "System Architecture",
      "mermaid_content": "graph TB\n...",
      "created_at": "2024-01-15T10:00:00Z"
    },
    {
      "id": 2,
      "type": "user_flow",
      "title": "User Flow",
      "mermaid_content": "flowchart TD\n...",
      "created_at": "2024-01-15T10:00:01Z"
    }
  ]
}
```

**Notes:**
- Excludes internal fields: `risks`, `open_questions`
- Includes all generated diagrams
- Ready for client-facing proposals

---

## Frontend Implementation Guide

### Complete Workflow Implementation

Here's how to implement the complete workflow in your frontend:

#### 1. Authentication Flow

```typescript
// Register
const register = async (email: string, password: string) => {
  const response = await fetch('http://localhost:8000/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  return response.json();
};

// Login
const login = async (email: string, password: string) => {
  const response = await fetch('http://localhost:8000/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  const data = await response.json();
  localStorage.setItem('token', data.access_token);
  return data;
};

// Get current user
const getCurrentUser = async () => {
  const token = localStorage.getItem('token');
  const response = await fetch('http://localhost:8000/auth/me', {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  return response.json();
};
```

#### 2. Project Management

```typescript
// Create project
const createProject = async (name: string, description: string) => {
  const token = localStorage.getItem('token');
  const response = await fetch('http://localhost:8000/projects', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ name, description })
  });
  return response.json();
};

// Get all projects
const getProjects = async () => {
  const token = localStorage.getItem('token');
  const response = await fetch('http://localhost:8000/projects', {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  return response.json();
};
```

#### 3. Document Upload

```typescript
// Upload document
const uploadDocument = async (projectId: number, file: File) => {
  const token = localStorage.getItem('token');
  const formData = new FormData();
  formData.append('file', file);
  
  const response = await fetch(
    `http://localhost:8000/projects/${projectId}/documents/upload`,
    {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` },
      body: formData
    }
  );
  return response.json();
};

// Get documents
const getDocuments = async (projectId: number) => {
  const token = localStorage.getItem('token');
  const response = await fetch(
    `http://localhost:8000/projects/${projectId}/documents/`,
    {
      headers: { 'Authorization': `Bearer ${token}` }
    }
  );
  return response.json();
};
```

#### 4. Processing Pipeline

```typescript
// Process embeddings
const processEmbeddings = async (projectId: number) => {
  const token = localStorage.getItem('token');
  const response = await fetch(
    `http://localhost:8000/projects/${projectId}/process-embeddings`,
    {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` }
    }
  );
  return response.json();
};

// Extract information
const extractInformation = async (projectId: number) => {
  const token = localStorage.getItem('token');
  const response = await fetch(
    `http://localhost:8000/projects/${projectId}/extract`,
    {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` }
    }
  );
  return response.json();
};

// Generate diagrams
const generateDiagrams = async (projectId: number) => {
  const token = localStorage.getItem('token');
  const response = await fetch(
    `http://localhost:8000/projects/${projectId}/diagrams/generate`,
    {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` }
    }
  );
  return response.json();
};
```

#### 5. Chat Implementation

```typescript
// Send chat message
const sendChatMessage = async (projectId: number, message: string) => {
  const token = localStorage.getItem('token');
  const response = await fetch(
    `http://localhost:8000/projects/${projectId}/chat`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ message })
    }
  );
  return response.json();
};

// Get chat history
const getChatHistory = async (projectId: number) => {
  const token = localStorage.getItem('token');
  const response = await fetch(
    `http://localhost:8000/projects/${projectId}/chat`,
    {
      headers: { 'Authorization': `Bearer ${token}` }
    }
  );
  return response.json();
};
```

#### 6. Rendering Mermaid Diagrams

Install Mermaid:
```bash
npm install mermaid
```

React component example:
```tsx
import React, { useEffect, useRef } from 'react';
import mermaid from 'mermaid';

interface DiagramProps {
  content: string;
  type: string;
}

const MermaidDiagram: React.FC<DiagramProps> = ({ content, type }) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    mermaid.initialize({ 
      startOnLoad: true,
      theme: 'default',
      securityLevel: 'loose'
    });

    if (ref.current) {
      ref.current.innerHTML = content;
      mermaid.contentLoaded();
    }
  }, [content]);

  return (
    <div className="mermaid-diagram">
      <div ref={ref} className="mermaid">
        {content}
      </div>
    </div>
  );
};

// Usage
const DiagramsView = ({ diagrams }) => {
  return (
    <div>
      {diagrams.map(diagram => (
        <div key={diagram.id}>
          <h3>{diagram.title}</h3>
          <MermaidDiagram 
            content={diagram.mermaid_content}
            type={diagram.diagram_type}
          />
        </div>
      ))}
    </div>
  );
};
```

#### 7. Complete Project Workflow Component

```tsx
import React, { useState } from 'react';

const ProjectWorkflow = ({ projectId }) => {
  const [status, setStatus] = useState('idle');
  const [progress, setProgress] = useState(0);

  const runCompleteWorkflow = async () => {
    try {
      // Step 1: Process embeddings
      setStatus('Processing embeddings...');
      setProgress(25);
      await processEmbeddings(projectId);

      // Step 2: Extract information
      setStatus('Extracting information...');
      setProgress(50);
      await extractInformation(projectId);

      // Step 3: Generate diagrams
      setStatus('Generating diagrams...');
      setProgress(75);
      await generateDiagrams(projectId);

      // Step 4: Get proposal
      setStatus('Preparing proposal...');
      setProgress(90);
      const proposal = await fetch(
        `http://localhost:8000/projects/${projectId}/proposal`,
        {
          headers: { 
            'Authorization': `Bearer ${localStorage.getItem('token')}` 
          }
        }
      ).then(r => r.json());

      setStatus('Complete!');
      setProgress(100);
      return proposal;

    } catch (error) {
      setStatus('Error: ' + error.message);
      throw error;
    }
  };

  return (
    <div>
      <button onClick={runCompleteWorkflow}>
        Process Project
      </button>
      <div className="progress">
        <div style={{ width: `${progress}%` }}>{progress}%</div>
      </div>
      <p>{status}</p>
    </div>
  );
};
```

### Error Handling

```typescript
const handleApiError = (error: any) => {
  if (error.status === 401) {
    // Unauthorized - redirect to login
    localStorage.removeItem('token');
    window.location.href = '/login';
  } else if (error.status === 404) {
    // Not found
    alert('Resource not found');
  } else if (error.status === 500) {
    // Server error
    alert('Server error. Please try again later.');
  }
};

// Usage
try {
  const result = await extractInformation(projectId);
} catch (error) {
  handleApiError(error);
}
```

### State Management (React Context Example)

```tsx
import React, { createContext, useContext, useState } from 'react';

interface AppState {
  user: any;
  token: string | null;
  currentProject: any;
}

const AppContext = createContext<AppState | null>(null);

export const AppProvider: React.FC = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [currentProject, setCurrentProject] = useState(null);

  return (
    <AppContext.Provider value={{
      user, setUser,
      token, setToken,
      currentProject, setCurrentProject
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
```

### Recommended Frontend Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── Auth/
│   │   │   ├── Login.tsx
│   │   │   └── Register.tsx
│   │   ├── Projects/
│   │   │   ├── ProjectList.tsx
│   │   │   ├── ProjectCard.tsx
│   │   │   └── CreateProject.tsx
│   │   ├── Documents/
│   │   │   ├── DocumentUpload.tsx
│   │   │   └── DocumentList.tsx
│   │   ├── Diagrams/
│   │   │   ├── DiagramViewer.tsx
│   │   │   └── MermaidDiagram.tsx
│   │   ├── Chat/
│   │   │   ├── ChatInterface.tsx
│   │   │   └── ChatMessage.tsx
│   │   └── Proposal/
│   │       └── ProposalView.tsx
│   ├── services/
│   │   ├── api.ts
│   │   ├── auth.ts
│   │   ├── projects.ts
│   │   ├── documents.ts
│   │   ├── diagrams.ts
│   │   └── chat.ts
│   ├── contexts/
│   │   └── AppContext.tsx
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   ├── useProjects.ts
│   │   └── useDiagrams.ts
│   └── App.tsx
```

### Key Frontend Libraries

```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-router-dom": "^6.20.0",
    "mermaid": "^10.6.0",
    "axios": "^1.6.0",
    "react-query": "^3.39.0"
  }
}
```

---

**Made with ❤️ using FastAPI, PostgreSQL, OpenAI, and Mermaid**
