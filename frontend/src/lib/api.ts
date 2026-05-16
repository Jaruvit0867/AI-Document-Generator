// ============================================================================
// API Client for AI Document Generator
// ============================================================================
// Type-safe API client with automatic authentication and error handling

import {
  User,
  LoginRequest,
  RegisterRequest,
  AuthResponse,
  Project,
  ProjectCreate,
  ProjectUpdate,
  ProjectListResponse,
  Document,
  DocumentListResponse,
  ExtractionResult,
  ExtractionResponse,
  ProposalResponse,
  ProcessEmbeddingsResponse,
  Diagram,
  ChatMessage,
  ChatResponse,
  PaginationParams,
  ChatHistoryParams,
  APIError,
} from '../types/api';
import { getToken, clearToken } from './auth';

// ============================================================================
// Configuration
// ============================================================================

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://backend-hackaton-v2.vercel.app';

// ============================================================================
// Error Handling
// ============================================================================

export class APIClientError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public details?: unknown
  ) {
    super(message);
    this.name = 'APIClientError';
  }
}

/**
 * Handle API errors and throw appropriate exceptions
 */
async function handleResponse<T>(response: Response): Promise<T> {
  if (response.ok) {
    // Handle 204 No Content
    if (response.status === 204) {
      return undefined as T;
    }
    return response.json();
  }

  // Handle 401 Unauthorized - clear token and redirect
  if (response.status === 401) {
    clearToken();
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
    throw new APIClientError('Unauthorized - please login again', 401);
  }

  // Try to parse error response
  let errorData: APIError | null = null;
  try {
    errorData = await response.json();
  } catch {
    // If JSON parsing fails, use status text
    throw new APIClientError(
      response.statusText || 'An error occurred',
      response.status
    );
  }

  // Handle validation errors (422)
  if (response.status === 422 && errorData?.detail) {
    const details = Array.isArray(errorData.detail)
      ? errorData.detail.map((err) => err.msg).join(', ')
      : errorData.detail;
    throw new APIClientError('Validation error: ' + details, 422, errorData.detail);
  }

  // Handle other errors
  const message = typeof errorData?.detail === 'string'
    ? errorData.detail
    : 'An error occurred';
  throw new APIClientError(message, response.status, errorData);
}

// ============================================================================
// Base Fetch Wrapper
// ============================================================================

interface FetchOptions extends RequestInit {
  requiresAuth?: boolean;
}

/**
 * Base fetch wrapper with automatic authentication and error handling
 */
async function apiFetch<T>(
  endpoint: string,
  options: FetchOptions = {}
): Promise<T> {
  const { requiresAuth = true, headers = {}, ...fetchOptions } = options;

  const url = `${API_BASE_URL}${endpoint}`;

  const requestHeaders: Record<string, string> = {
    ...(headers as Record<string, string>),
  };

  // Add Authorization header if required
  if (requiresAuth) {
    const token = getToken();
    if (!token) {
      throw new APIClientError('No authentication token found', 401);
    }
    requestHeaders['Authorization'] = `Bearer ${token}`;
  }

  // Add Content-Type for JSON requests (unless it's FormData)
  if (
    options.body &&
    !(options.body instanceof FormData) &&
    !requestHeaders['Content-Type']
  ) {
    requestHeaders['Content-Type'] = 'application/json';
  }

  try {
    const response = await fetch(url, {
      ...fetchOptions,
      headers: requestHeaders,
    });

    return handleResponse<T>(response);
  } catch (error) {
    if (error instanceof APIClientError) {
      throw error;
    }
    throw new APIClientError(
      error instanceof Error ? error.message : 'Network error occurred'
    );
  }
}

// ============================================================================
// Authentication API
// ============================================================================

export const authAPI = {
  /**
   * Register a new user
   */
  async register(data: RegisterRequest): Promise<User> {
    return apiFetch<User>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
      requiresAuth: false,
    });
  },

  /**
   * Login and receive JWT token
   */
  async login(data: LoginRequest): Promise<AuthResponse> {
    return apiFetch<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
      requiresAuth: false,
    });
  },

  /**
   * Get current authenticated user
   */
  async getCurrentUser(): Promise<User> {
    return apiFetch<User>('/auth/me', {
      method: 'GET',
    });
  },
};

// ============================================================================
// Projects API
// ============================================================================

export const projectsAPI = {
  /**
   * Create a new project
   * IMPORTANT: Uses trailing slash /projects/
   */
  async create(data: ProjectCreate): Promise<Project> {
    return apiFetch<Project>('/projects/', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  /**
   * Get all projects for authenticated user
   */
  async list(params?: PaginationParams): Promise<ProjectListResponse> {
    const queryParams = new URLSearchParams();
    if (params?.skip !== undefined) queryParams.append('skip', params.skip.toString());
    if (params?.limit !== undefined) queryParams.append('limit', params.limit.toString());
    
    const query = queryParams.toString();
    const endpoint = query ? `/projects/?${query}` : '/projects/';
    
    return apiFetch<ProjectListResponse>(endpoint, {
      method: 'GET',
    });
  },

  /**
   * Get a specific project by ID
   */
  async get(projectId: number): Promise<Project> {
    return apiFetch<Project>(`/projects/${projectId}`, {
      method: 'GET',
    });
  },

  /**
   * Update a project
   */
  async update(projectId: number, data: ProjectUpdate): Promise<Project> {
    return apiFetch<Project>(`/projects/${projectId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  /**
   * Delete a project
   */
  async delete(projectId: number): Promise<void> {
    return apiFetch<void>(`/projects/${projectId}`, {
      method: 'DELETE',
    });
  },
};

// ============================================================================
// Documents API
// ============================================================================

export const documentsAPI = {
  /**
   * Upload a document to a project
   */
  async upload(projectId: number, file: File): Promise<Document> {
    const formData = new FormData();
    formData.append('file', file);

    return apiFetch<Document>(`/projects/${projectId}/documents/upload`, {
      method: 'POST',
      body: formData,
    });
  },

  /**
   * Get all documents for a project
   */
  async list(projectId: number, params?: PaginationParams): Promise<DocumentListResponse> {
    const queryParams = new URLSearchParams();
    if (params?.skip !== undefined) queryParams.append('skip', params.skip.toString());
    if (params?.limit !== undefined) queryParams.append('limit', params.limit.toString());
    
    const query = queryParams.toString();
    const endpoint = query 
      ? `/projects/${projectId}/documents/?${query}` 
      : `/projects/${projectId}/documents/`;
    
    return apiFetch<DocumentListResponse>(endpoint, {
      method: 'GET',
    });
  },

  /**
   * Get a specific document
   */
  async get(projectId: number, documentId: number): Promise<Document> {
    return apiFetch<Document>(`/projects/${projectId}/documents/${documentId}`, {
      method: 'GET',
    });
  },

  /**
   * Delete a document
   */
  async delete(projectId: number, documentId: number): Promise<void> {
    return apiFetch<void>(`/projects/${projectId}/documents/${documentId}`, {
      method: 'DELETE',
    });
  },
};

// ============================================================================
// Extraction API
// ============================================================================

export const extractionAPI = {
  /**
   * Process embeddings for all documents in a project
   * Must be called before extraction
   */
  async processEmbeddings(projectId: number): Promise<ProcessEmbeddingsResponse> {
    return apiFetch<ProcessEmbeddingsResponse>(`/projects/${projectId}/process-embeddings`, {
      method: 'POST',
    });
  },

  /**
   * Extract project information from documents
   * This is a long-running operation (30-60 seconds)
   */
  async extract(projectId: number): Promise<ExtractionResponse> {
    return apiFetch<ExtractionResponse>(`/projects/${projectId}/extract`, {
      method: 'POST',
    });
  },

  /**
   * Get extraction result for a project
   */
  async getExtraction(projectId: number): Promise<ExtractionResult> {
    return apiFetch<ExtractionResult>(`/projects/${projectId}/extraction`, {
      method: 'GET',
    });
  },

  /**
   * Get proposal (extraction without internal fields)
   */
  async getProposal(projectId: number): Promise<ProposalResponse> {
    return apiFetch<ProposalResponse>(`/projects/${projectId}/proposal`, {
      method: 'GET',
    });
  },
};

// ============================================================================
// Diagrams API
// ============================================================================

export const diagramsAPI = {
  /**
   * Generate all diagram types for a project
   * Requires extraction to be completed first
   */
  async generate(projectId: number): Promise<Diagram[]> {
    return apiFetch<Diagram[]>(`/projects/${projectId}/diagrams/generate`, {
      method: 'POST',
    });
  },

  /**
   * Get all diagrams for a project
   */
  async list(projectId: number): Promise<Diagram[]> {
    return apiFetch<Diagram[]>(`/projects/${projectId}/diagrams`, {
      method: 'GET',
    });
  },

  /**
   * Get a specific diagram
   */
  async get(projectId: number, diagramId: number): Promise<Diagram> {
    return apiFetch<Diagram>(`/projects/${projectId}/diagrams/${diagramId}`, {
      method: 'GET',
    });
  },

  /**
   * Delete all diagrams for a project
   */
  async deleteAll(projectId: number): Promise<void> {
    return apiFetch<void>(`/projects/${projectId}/diagrams`, {
      method: 'DELETE',
    });
  },
};

// ============================================================================
// Chat API
// ============================================================================

export const chatAPI = {
  /**
   * Send a chat message and get AI response
   * Uses RAG with document embeddings
   */
  async sendMessage(projectId: number, message: string): Promise<ChatResponse> {
    return apiFetch<ChatResponse>(`/projects/${projectId}/chat`, {
      method: 'POST',
      body: JSON.stringify({ message }),
    });
  },

  /**
   * Get chat history for a project
   */
  async getHistory(projectId: number, params?: ChatHistoryParams): Promise<ChatMessage[]> {
    const queryParams = new URLSearchParams();
    if (params?.limit !== undefined) queryParams.append('limit', params.limit.toString());
    
    const query = queryParams.toString();
    const endpoint = query 
      ? `/projects/${projectId}/chat?${query}` 
      : `/projects/${projectId}/chat`;
    
    return apiFetch<ChatMessage[]>(endpoint, {
      method: 'GET',
    });
  },

  /**
   * Clear all chat history for a project
   */
  async clearHistory(projectId: number): Promise<void> {
    return apiFetch<void>(`/projects/${projectId}/chat`, {
      method: 'DELETE',
    });
  },
};

// ============================================================================
// Export Combined API Client
// ============================================================================

const api = {
  auth: authAPI,
  projects: projectsAPI,
  documents: documentsAPI,
  extraction: extractionAPI,
  diagrams: diagramsAPI,
  chat: chatAPI,
};

export default api;

// Made with Bob
