"""
Diagram service for generating Mermaid diagrams from extraction data
"""
from typing import Dict, Any, List
from sqlalchemy.orm import Session
from models.diagram import Diagram
from models.project import Project
import logging

logger = logging.getLogger(__name__)


def generate_system_architecture_diagram(extraction_data: Dict[str, Any]) -> str:
    """
    Generate system architecture diagram from extraction data.
    
    Args:
        extraction_data: Extracted project information
        
    Returns:
        Mermaid diagram syntax
    """
    tech_stack = extraction_data.get("tech_stack", {})
    frontend = tech_stack.get("frontend", [])
    backend = tech_stack.get("backend", [])
    database = tech_stack.get("database", [])
    infrastructure = tech_stack.get("infrastructure", [])
    
    # Build Mermaid diagram
    mermaid = "graph TB\n"
    
    # Frontend layer
    if frontend:
        frontend_str = " + ".join(frontend[:2])  # Limit to 2 items
        mermaid += f"    A[Frontend<br/>{frontend_str}] --> B[API Gateway]\n"
    else:
        mermaid += "    A[Frontend] --> B[API Gateway]\n"
    
    # Backend layer
    if backend:
        backend_str = " + ".join(backend[:2])
        mermaid += f"    B --> C[Backend<br/>{backend_str}]\n"
    else:
        mermaid += "    B --> C[Backend]\n"
    
    # Database layer
    if database:
        db_str = " + ".join(database[:2])
        mermaid += f"    C --> D[Database<br/>{db_str}]\n"
    else:
        mermaid += "    C --> D[Database]\n"
    
    # External services
    external_services = tech_stack.get("external_services", [])
    if external_services:
        for idx, service in enumerate(external_services[:3], 1):  # Limit to 3
            service_id = chr(68 + idx)  # E, F, G
            mermaid += f"    C --> {service_id}[{service}]\n"
    
    # Infrastructure
    if infrastructure:
        infra_str = " + ".join(infrastructure[:2])
        mermaid += f"    C -.-> Z[Infrastructure<br/>{infra_str}]\n"
    
    return mermaid


def generate_user_flow_diagram(extraction_data: Dict[str, Any]) -> str:
    """
    Generate user flow diagram from extraction data.
    
    Args:
        extraction_data: Extracted project information
        
    Returns:
        Mermaid diagram syntax
    """
    features = extraction_data.get("features", [])
    
    mermaid = "flowchart TD\n"
    mermaid += "    A[User Access] --> B{Authenticated?}\n"
    mermaid += "    B -->|No| C[Login/Register]\n"
    mermaid += "    C --> B\n"
    mermaid += "    B -->|Yes| D[Dashboard]\n"
    
    # Add main features
    if features:
        for idx, feature in enumerate(features[:5], 1):  # Limit to 5 features
            feature_name = feature.get("name", f"Feature {idx}")
            feature_id = chr(68 + idx)  # E, F, G, H, I
            mermaid += f"    D --> {feature_id}[{feature_name}]\n"
    else:
        mermaid += "    D --> E[Main Features]\n"
    
    return mermaid


def generate_development_workflow_diagram(extraction_data: Dict[str, Any]) -> str:
    """
    Generate development workflow diagram from extraction data.
    
    Args:
        extraction_data: Extracted project information
        
    Returns:
        Mermaid diagram syntax
    """
    timeline = extraction_data.get("timeline", {})
    phases = timeline.get("phases", [])
    
    if not phases:
        # Default workflow
        mermaid = """gantt
    title Development Timeline
    dateFormat YYYY-MM-DD
    section Planning
    Requirements Analysis :2024-01-01, 3d
    Design :2024-01-04, 2d
    section Development
    Backend Development :2024-01-06, 5d
    Frontend Development :2024-01-11, 5d
    section Testing
    Integration Testing :2024-01-16, 3d
    Deployment :2024-01-19, 2d"""
    else:
        mermaid = "gantt\n"
        mermaid += "    title Development Timeline\n"
        mermaid += "    dateFormat YYYY-MM-DD\n"
        
        current_date = "2024-01-01"
        for phase in phases[:6]:  # Limit to 6 phases
            phase_name = phase.get("name", "Phase")
            duration = phase.get("duration", "5d")
            mermaid += f"    section {phase_name}\n"
            
            tasks = phase.get("tasks", [phase_name])
            for task in tasks[:3]:  # Limit to 3 tasks per phase
                mermaid += f"    {task} :{current_date}, {duration}\n"
    
    return mermaid


def generate_data_model_diagram(extraction_data: Dict[str, Any]) -> str:
    """
    Generate data model (ERD) diagram from extraction data.
    
    Args:
        extraction_data: Extracted project information
        
    Returns:
        Mermaid diagram syntax
    """
    data_models = extraction_data.get("data_models", [])
    
    if not data_models:
        # Default ERD
        mermaid = """erDiagram
    USER ||--o{ PROJECT : creates
    PROJECT ||--o{ DOCUMENT : contains
    PROJECT ||--o{ TASK : has
    USER ||--o{ TASK : assigned"""
    else:
        mermaid = "erDiagram\n"
        
        # Build relationships
        for model in data_models[:8]:  # Limit to 8 models
            model_name = model.get("name", "Entity").upper()
            relationships = model.get("relationships", [])
            
            for rel in relationships[:3]:  # Limit to 3 relationships per model
                related_to = rel.get("related_to", "OTHER").upper()
                rel_type = rel.get("type", "one-to-many")
                
                # Convert relationship type to Mermaid syntax
                if rel_type == "one-to-one":
                    symbol = "||--||"
                elif rel_type == "one-to-many":
                    symbol = "||--o{"
                elif rel_type == "many-to-many":
                    symbol = "}o--o{"
                else:
                    symbol = "||--o{"
                
                action = rel.get("action", "relates")
                mermaid += f"    {model_name} {symbol} {related_to} : {action}\n"
    
    return mermaid


def generate_all_diagrams(
    db: Session,
    project_id: int,
    user_id: int
) -> List[Diagram]:
    """
    Generate all diagram types for a project.
    
    Args:
        db: Database session
        project_id: Project ID
        user_id: User ID (for authorization)
        
    Returns:
        List of created diagrams
    """
    # Verify project ownership
    project = db.query(Project).filter(
        Project.id == project_id,
        Project.user_id == user_id
    ).first()
    
    if not project:
        raise ValueError("Project not found or access denied")
    
    if not project.extraction_result:
        raise ValueError("Project extraction not found. Please run extraction first.")
    
    extraction_data = project.extraction_result
    
    # Delete existing diagrams
    db.query(Diagram).filter(Diagram.project_id == project_id).delete()
    
    # Generate diagrams
    diagrams = []
    
    # System Architecture
    try:
        arch_mermaid = generate_system_architecture_diagram(extraction_data)
        arch_diagram = Diagram(
            project_id=project_id,
            diagram_type="system_architecture",
            title="System Architecture",
            mermaid_content=arch_mermaid
        )
        db.add(arch_diagram)
        diagrams.append(arch_diagram)
        logger.info(f"Generated system architecture diagram for project {project_id}")
    except Exception as e:
        logger.error(f"Error generating system architecture diagram: {str(e)}")
    
    # User Flow
    try:
        flow_mermaid = generate_user_flow_diagram(extraction_data)
        flow_diagram = Diagram(
            project_id=project_id,
            diagram_type="user_flow",
            title="User Flow",
            mermaid_content=flow_mermaid
        )
        db.add(flow_diagram)
        diagrams.append(flow_diagram)
        logger.info(f"Generated user flow diagram for project {project_id}")
    except Exception as e:
        logger.error(f"Error generating user flow diagram: {str(e)}")
    
    # Development Workflow
    try:
        workflow_mermaid = generate_development_workflow_diagram(extraction_data)
        workflow_diagram = Diagram(
            project_id=project_id,
            diagram_type="development_workflow",
            title="Development Timeline",
            mermaid_content=workflow_mermaid
        )
        db.add(workflow_diagram)
        diagrams.append(workflow_diagram)
        logger.info(f"Generated development workflow diagram for project {project_id}")
    except Exception as e:
        logger.error(f"Error generating development workflow diagram: {str(e)}")
    
    # Data Model
    try:
        data_mermaid = generate_data_model_diagram(extraction_data)
        data_diagram = Diagram(
            project_id=project_id,
            diagram_type="data_model",
            title="Data Model (ERD)",
            mermaid_content=data_mermaid
        )
        db.add(data_diagram)
        diagrams.append(data_diagram)
        logger.info(f"Generated data model diagram for project {project_id}")
    except Exception as e:
        logger.error(f"Error generating data model diagram: {str(e)}")
    
    db.commit()
    
    # Refresh all diagrams
    for diagram in diagrams:
        db.refresh(diagram)
    
    return diagrams


def get_project_diagrams(
    db: Session,
    project_id: int,
    user_id: int
) -> List[Diagram]:
    """
    Get all diagrams for a project.
    
    Args:
        db: Database session
        project_id: Project ID
        user_id: User ID (for authorization)
        
    Returns:
        List of diagrams
    """
    # Verify project ownership
    project = db.query(Project).filter(
        Project.id == project_id,
        Project.user_id == user_id
    ).first()
    
    if not project:
        raise ValueError("Project not found or access denied")
    
    diagrams = db.query(Diagram).filter(
        Diagram.project_id == project_id
    ).order_by(Diagram.created_at.desc()).all()
    
    return diagrams


def get_diagram_by_id(
    db: Session,
    project_id: int,
    diagram_id: int,
    user_id: int
) -> Diagram:
    """
    Get a specific diagram.
    
    Args:
        db: Database session
        project_id: Project ID
        diagram_id: Diagram ID
        user_id: User ID (for authorization)
        
    Returns:
        Diagram object
    """
    # Verify project ownership
    project = db.query(Project).filter(
        Project.id == project_id,
        Project.user_id == user_id
    ).first()
    
    if not project:
        raise ValueError("Project not found or access denied")
    
    diagram = db.query(Diagram).filter(
        Diagram.id == diagram_id,
        Diagram.project_id == project_id
    ).first()
    
    if not diagram:
        raise ValueError("Diagram not found")
    
    return diagram


def delete_project_diagrams(
    db: Session,
    project_id: int,
    user_id: int
) -> int:
    """
    Delete all diagrams for a project.
    
    Args:
        db: Database session
        project_id: Project ID
        user_id: User ID (for authorization)
        
    Returns:
        Number of diagrams deleted
    """
    # Verify project ownership
    project = db.query(Project).filter(
        Project.id == project_id,
        Project.user_id == user_id
    ).first()
    
    if not project:
        raise ValueError("Project not found or access denied")
    
    count = db.query(Diagram).filter(
        Diagram.project_id == project_id
    ).delete()
    
    db.commit()
    return count

# Made with Bob
