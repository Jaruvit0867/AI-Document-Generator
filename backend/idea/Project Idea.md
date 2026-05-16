Project Idea Document 

Plan to doc-generator apps


1.	Problem Statement 
In many software projects, especially in startups and SMEs, development often begins with scattered information such as meeting notes, chat discussions, voice calls, or rough user requests.
These inputs are usually incomplete, inconsistent, and lack structure.
As a result:
●	scope becomes unclear
●	developers make assumptions
●	project timelines become unstable
●	communication between stakeholders breaks down
●	senior engineers are forced to act as unofficial project managers
This issue becomes even worse in fast-moving teams without dedicated PMs or business analysts.
2.	Proposed Solution 
We propose an AI-assisted pre-development planning platform that transforms raw project discussions into structured development-ready proposal documents.

3.	Why Existing AI Tools Are Not Enough 
Current LLM tools can generate summaries, but they still rely heavily on manually structured prompts and human interpretation.
They do not deeply understand:
1.	project ambiguity
2.	conflicting requirements
3.	missing dependencies
4.	business vs technical gaps
5.	proposal standardization
6.	development planning workflow


4.	Core Features
1.	Upload MOM / raw notes
2.	AI requirement extraction
3.	Proposal document generation

5.	Working Plan : 
Backend Development
Core Goal:
Build a backend service that can transform raw project discussions/documents into structured development-planning data and allow interactive AI discussion around the project context.
The main output structure is already fixed and should remain consistent because it will be used by frontend rendering and proposal generation.
Expected Core Flow:
1.	User login
2.	User Register
3.	Create project
4.	Upload/input raw discussion data
5.	Process document/text
6.	Store vectorized chunks
7.	Generate structured extraction JSON
8.	Interactive AI chat using project context
9.	Generate proposal-ready output
Main Output Structure (this structure for point 7) :
{
  "project_overview": {
    "project_name": "",
    "problem": "",
    "proposed_solution": "",
    "target_users": []
  },
  "requirements": {
    "functional": [],
    "non_functional": []
  },
  "feature_breakdown": [],
  "user_flow": [], -> use chart
  "business_process": [] , -> use chart
  "scope": {
    "in_scope": [],
    "out_of_scope": []
  },
  "architecture": {
    "frontend": "",
    "backend": "",
    "database": "",
    "integrations": [],
    "infrastructure": ""
  },
  "timeline": [], -> use table / chart
  "risks": [],
  "open_questions": []
}

Suggested Backend Scope:
●	Auth Login -> you can send JWT token and then frontend use localstorage to save it or ask bob about the detail
●	Project CRUD 
●	Input file/text handling -> ask bob about the detail
●	Text extraction & normalization -> ask bob about the detail
●	Chunking strategy for unstructured documents -> ask bob about the detail
●	Embedding & vector storage -> ask bob about the detail
●	Retrieval pipeline -> ask bob about the detail
●	LLM extraction pipeline -> ask bob about the detail
●	Interactive AI chat to spesific project (RAG-based) -> ask bob about the detail how to save a chat , how relate this to the different project
●	Proposal export support (dont show the risk and open questions section )-> ask bob about the detail
Input Types:
The system should be flexible enough to handle:
●	structured documents
●	meeting MOM
●	rough notes
●	pasted text
●	partially messy/unstructured project discussions
Possible Technical Direction:
●	PostgreSQL + pgvector or u can use anything for vector db
●	REST API
●	JSON schema validation
●	RAG-based retrieval
●	LLM structured output
Ask Bob about :
●	Chunking strategy for mixed/unstructured documents
●	The exact internal implementation is flexible.
●	Feel free to improve the architecture if there’s a better approach.
●	Prioritize stability and demo flow over overengineering.
●	The extraction output format should stay consistent because frontend and proposal generation depend on it.
●	AI responses should avoid hallucination and clearly identify ambiguity/missing information whenever possible.
●	Chart/table generation approach for:
■	user flow
■	business process
■	timeline
	 
Frontend Development
Frontend Core Flow 
1.	Login Page
2.	Register Page
3.	Dashboard Projects 
4.	Create Project
5.	Project Workspace 
6.	Upload/Input Notes 
7.	Generate Extraction 
8.	Review Structured Output 
9.	Chat with AI 
10.	Proposal Preview
11.	Export DOCX 
Pages : 
1.	Login dummy / simple login
2.	Projects list
3.	Create project modal
4.	Project Workspace

Testing Scenario : 
Create 3 different project cases. Each project must include at least 3 types of input data:
1.	Well-structured document
2.	MOM meeting notes
3.	Unstructured personal notes
Testing Objective
The goal of this testing scenario is to validate whether the system can handle different levels of document structure and still generate a consistent, useful, and accurate project-planning output.
This test should verify that the system can:
●	Extract requirements from both clean and messy input.
●	Identify missing, unclear, duplicated, or conflicting information.
●	Generate the fixed structured output format consistently.
●	Store and retrieve relevant context through vector search.
●	Support AI chat based on the uploaded project context.
●	Produce a proposal-ready document without including internal risks and open questions.
●	Compare extraction quality across different document types and project cases.

6.	Workflow 
Raw Discussion  ⇒ AI Structuring Engine  ⇒ Requirement Validation  ⇒ Proposal Generator ⇒ Output.


