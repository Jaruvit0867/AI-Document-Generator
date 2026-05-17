"""
Diagram service for generating Mermaid diagrams from extraction data
"""
from typing import Dict, Any, List
from sqlalchemy.orm import Session
from models.diagram import Diagram
from models.project import Project
import logging
import re
from datetime import date, timedelta

logger = logging.getLogger(__name__)


def _as_list(value: Any) -> List[str]:
    """Normalize extraction values into a list of readable strings."""
    if value is None or value == "":
        return []
    if isinstance(value, list):
        result = []
        for item in value:
            if isinstance(item, dict):
                name = item.get("name") or item.get("title") or item.get("description")
                result.append(str(name or item))
            else:
                result.append(str(item))
        return [item.strip() for item in result if item and item.strip()]
    return [str(value).strip()] if str(value).strip() else []


def _mermaid_label(value: Any, fallback: str = "Item", max_length: int = 60) -> str:
    """Keep Mermaid labels readable and avoid characters that commonly break nodes."""
    text = str(value or fallback).strip() or fallback
    replacements = {
        "[": "(",
        "]": ")",
        "{": "(",
        "}": ")",
        "|": "-",
        "\n": " ",
        "\r": " ",
        '"': "'",
        "–": "-",
        "—": "-",
        "“": "'",
        "”": "'",
    }
    for old, new in replacements.items():
        text = text.replace(old, new)
    if len(text) > max_length:
        text = text[: max_length - 3].rstrip() + "..."
    return text


def _node_id(prefix: str, index: int) -> str:
    return f"{prefix}{index}"


def _flow_node(label: Any, fallback: str = "Item", max_length: int = 60) -> str:
    label_text = _mermaid_label(label, fallback, max_length)
    return f'["{label_text}"]'


def _entity_id(value: Any, fallback: str = "ENTITY") -> str:
    text = _mermaid_label(value, fallback, 32).upper()
    text = re.sub(r"[^A-Z0-9_]+", "_", text)
    text = re.sub(r"_+", "_", text).strip("_")
    if not text:
        text = fallback
    if text[0].isdigit():
        text = f"{fallback}_{text}"
    return text


def _gantt_label(value: Any, fallback: str = "Task") -> str:
    return _mermaid_label(value, fallback, 80).replace(":", " -")


def _duration_to_days(value: Any, default_days: int = 5) -> int:
    text = str(value or "").lower()
    match = re.search(r"(\d+)\s*(day|days|week|weeks|month|months)", text)
    if not match:
        return default_days

    amount = int(match.group(1))
    unit = match.group(2)
    if unit.startswith("week"):
        return amount * 7
    if unit.startswith("month"):
        return amount * 30
    return amount


def _parse_timeline_item(value: Any, index: int) -> tuple[str, str, int]:
    if isinstance(value, dict):
        phase_name = value.get("name") or value.get("title") or f"Phase {index}"
        duration_source = value.get("duration") or phase_name
        tasks = _as_list(value.get("tasks")) or [phase_name]
    else:
        phase_name = str(value)
        duration_source = phase_name
        tasks = [phase_name]

    if ":" in phase_name:
        possible_name, possible_duration = phase_name.rsplit(":", 1)
        if re.search(r"\d+\s*(day|days|week|weeks|month|months)", possible_duration, re.IGNORECASE):
            phase_name = possible_name.strip()
            duration_source = possible_duration.strip()
            tasks = [phase_name]

    duration_days = _duration_to_days(duration_source)
    return phase_name, f"{duration_days}d", duration_days


def generate_system_architecture_diagram(extraction_data: Dict[str, Any]) -> str:
    """
    Generate system architecture diagram from extraction data.
    
    Args:
        extraction_data: Extracted project information
        
    Returns:
        Mermaid diagram syntax
    """
    architecture = extraction_data.get("architecture", {}) or {}
    legacy_tech_stack = extraction_data.get("tech_stack", {}) or {}

    frontend = _as_list(architecture.get("frontend") or legacy_tech_stack.get("frontend"))
    backend = _as_list(architecture.get("backend") or legacy_tech_stack.get("backend"))
    database = _as_list(architecture.get("database") or legacy_tech_stack.get("database"))
    infrastructure = _as_list(architecture.get("infrastructure") or legacy_tech_stack.get("infrastructure"))
    integrations = _as_list(architecture.get("integrations") or legacy_tech_stack.get("external_services"))
    overview = extraction_data.get("project_overview", {}) or {}
    project_name = _mermaid_label(overview.get("project_name"), "Project")
    
    # Build Mermaid diagram
    mermaid = "graph TB\n"
    mermaid += f"    U{_flow_node('Users')} --> A{_flow_node(f'{project_name}<br/>Client App')}\n"
    
    # Frontend layer
    if frontend:
        frontend_str = _mermaid_label(" + ".join(frontend[:2]))
        mermaid += f"    A --> B{_flow_node(f'Frontend<br/>{frontend_str}')}\n"
    else:
        mermaid += f"    A --> B{_flow_node('Frontend')}\n"

    mermaid += f"    B --> C{_flow_node('API / Backend')}\n"
    
    # Backend layer
    if backend:
        backend_str = _mermaid_label(" + ".join(backend[:2]))
        mermaid += f"    C --> D{_flow_node(f'Application Services<br/>{backend_str}')}\n"
    else:
        mermaid += f"    C --> D{_flow_node('Application Services')}\n"
    
    # Database layer
    if database:
        db_str = _mermaid_label(" + ".join(database[:2]))
        mermaid += f"    D --> E{_flow_node(f'Database<br/>{db_str}')}\n"
    else:
        mermaid += f"    D --> E{_flow_node('Data Storage')}\n"
    
    # External services
    if integrations:
        for idx, service in enumerate(integrations[:4], 1):  # Limit to 4
            service_id = _node_id("X", idx)
            mermaid += f"    D --> {service_id}{_flow_node(service)}\n"
    
    # Infrastructure
    if infrastructure:
        infra_str = _mermaid_label(" + ".join(infrastructure[:2]))
        mermaid += f"    D -.-> Z{_flow_node(f'Infrastructure<br/>{infra_str}')}\n"
    
    return mermaid


def generate_user_flow_diagram(extraction_data: Dict[str, Any]) -> str:
    """
    Generate user flow diagram from extraction data.
    
    Args:
        extraction_data: Extracted project information
        
    Returns:
        Mermaid diagram syntax
    """
    features = _as_list(
        extraction_data.get("feature_breakdown")
        or extraction_data.get("features")
        or extraction_data.get("requirements", {}).get("functional")
    )
    user_flow = _as_list(extraction_data.get("user_flow"))
    
    mermaid = "flowchart TD\n"
    mermaid += f"    A{_flow_node('User Access')} --> B{_flow_node('Start')}\n"
    
    if user_flow:
        previous = "B"
        for idx, step in enumerate(user_flow[:8], 1):
            node = _node_id("S", idx)
            mermaid += f"    {previous} --> {node}{_flow_node(step)}\n"
            previous = node
    else:
        mermaid += f"    B --> D{_flow_node('Main Workflow')}\n"
        previous = "D"
    
    # Add main features
    if features:
        for idx, feature in enumerate(features[:5], 1):  # Limit to 5 features
            feature_id = _node_id("F", idx)
            mermaid += f"    {previous} --> {feature_id}{_flow_node(feature, f'Feature {idx}')}\n"
    else:
        mermaid += f"    {previous} --> F1{_flow_node('Main Features')}\n"
    
    return mermaid


def generate_development_workflow_diagram(extraction_data: Dict[str, Any]) -> str:
    """
    Generate development workflow diagram from extraction data.
    
    Args:
        extraction_data: Extracted project information
        
    Returns:
        Mermaid diagram syntax
    """
    timeline = extraction_data.get("timeline", [])
    phases = timeline.get("phases", []) if isinstance(timeline, dict) else _as_list(timeline)
    
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
        
        current_date = date(2024, 1, 1)
        for idx, phase in enumerate(phases[:6], 1):  # Limit to 6 phases
            phase_name, duration, duration_days = _parse_timeline_item(phase, idx)
            tasks = _as_list(phase.get("tasks")) if isinstance(phase, dict) else [phase_name]
            tasks = tasks or [phase_name]
            phase_name = _gantt_label(phase_name, f"Phase {idx}")
            mermaid += f"    section {phase_name}\n"
            
            for task in tasks[:3]:  # Limit to 3 tasks per phase
                mermaid += f"    {_gantt_label(task)} :{current_date.isoformat()}, {duration}\n"
            current_date += timedelta(days=duration_days)
    
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
    overview = extraction_data.get("project_overview", {}) or {}
    target_users = _as_list(overview.get("target_users"))
    features = _as_list(extraction_data.get("feature_breakdown") or extraction_data.get("features"))
    business_process = _as_list(extraction_data.get("business_process"))
    
    if not data_models:
        project_entity = _entity_id(overview.get("project_name"), "PROJECT")

        mermaid = "erDiagram\n"
        mermaid += f"    USER ||--o{{ {project_entity} : uses\n"

        source_items = features or business_process
        for idx, item in enumerate(source_items[:6], 1):
            entity = _entity_id(item, f"FEATURE_{idx}")
            mermaid += f"    {project_entity} ||--o{{ {entity} : includes\n"

        for idx, user in enumerate(target_users[:4], 1):
            entity = _entity_id(user, f"USER_GROUP_{idx}")
            mermaid += f"    {entity} ||--o{{ {project_entity} : accesses\n"
    else:
        mermaid = "erDiagram\n"
        
        # Build relationships
        for model in data_models[:8]:  # Limit to 8 models
            model_name = _entity_id(model.get("name"), "ENTITY")
            relationships = model.get("relationships", [])
            
            for rel in relationships[:3]:  # Limit to 3 relationships per model
                related_to = _entity_id(rel.get("related_to"), "OTHER")
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
