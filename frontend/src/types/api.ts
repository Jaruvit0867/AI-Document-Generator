// ============================================================================
// Type Definitions for AI Document Generator API
// ============================================================================

// ============================================================================
// User & Authentication Types
// ============================================================================

export interface User {
  id: number;
  email: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
}

// ============================================================================
// Project Types
// ============================================================================

export interface Project {
  id: number;
  user_id: number;
  name: string;
  description: string;
  extraction_result: ExtractionResult | null;
  created_at: string;
  updated_at: string;
}

export interface ProjectCreate {
  name: string;
  description: string;
}

export interface ProjectUpdate {
  name?: string;
  description?: string;
}

export type ProjectResponse = Project;

export interface ProjectListResponse {
  total: number;
  projects: Project[];
}

// ============================================================================
// Document Types
// ============================================================================

export interface Document {
  id: number;
  project_id: number;
  filename: string;
  content: string;
  file_type: string;
  file_size: number;
  created_at: string;
  uploaded_at?: string; // Optional for backward compatibility
  content_preview?: string; // Optional preview of content
}

export interface DocumentListResponse {
  total: number;
  documents: Document[];
}

export interface DocumentUpload {
  file: File;
}

// ============================================================================
// Extraction Types
// ============================================================================

export interface ProjectOverview {
  project_name: string;
  problem: string;
  proposed_solution: string;
  target_users: string[];
}

export interface Requirements {
  functional: string[];
  non_functional: string[];
}

export interface Scope {
  in_scope: string[];
  out_of_scope: string[];
}

export interface Architecture {
  frontend: string;
  backend: string;
  database: string;
  integrations: string[];
  infrastructure: string;
}

export interface ExtractionResult {
  project_overview: ProjectOverview;
  requirements: Requirements;
  feature_breakdown: string[];
  user_flow: string[];
  business_process: string[];
  scope: Scope;
  architecture: Architecture;
  timeline: string[];
  risks?: string[];
  open_questions?: string[];
}

export interface ExtractionResponse {
  message: string;
  extraction: ExtractionResult;
}

export interface ProposalResponse {
  project_overview: ProjectOverview;
  requirements: Requirements;
  feature_breakdown: string[];
  user_flow: string[];
  business_process: string[];
  scope: Scope;
  architecture: Architecture;
  timeline: string[];
  diagrams?: Diagram[];
}

export interface ProcessEmbeddingsResponse {
  message: string;
  embeddings_created: number;
}

// ============================================================================
// Diagram Types
// ============================================================================

export type DiagramType = 
  | 'system_architecture'
  | 'user_flow'
  | 'development_workflow'
  | 'data_model';

export interface Diagram {
  id: number;
  project_id: number;
  diagram_type: DiagramType;
  title: string;
  mermaid_content: string;
  created_at: string;
}

export interface DiagramGenerateRequest {
  project_id: number;
}

// ============================================================================
// Chat Types
// ============================================================================

export interface ChatMessage {
  id: number;
  user_message: string;
  ai_response: string;
  created_at: string;
}

export interface ChatRequest {
  message: string;
}

export interface ChatResponse {
  id: number;
  user_message: string;
  ai_response: string;
  created_at: string;
}

// ============================================================================
// Error Types
// ============================================================================

export interface APIError {
  detail: string | { msg: string; type: string }[];
}

export interface ValidationError {
  loc: (string | number)[];
  msg: string;
  type: string;
}

// ============================================================================
// Query Parameter Types
// ============================================================================

export interface PaginationParams {
  skip?: number;
  limit?: number;
}

export interface ChatHistoryParams {
  limit?: number;
}

// Made with Bob
