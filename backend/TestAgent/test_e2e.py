"""
End-to-End Testing Suite for AI Document Generator
Tests the complete user journey and validates core functionality
"""

import requests
import json
import time
import os
from typing import Dict, Any, Optional
from datetime import datetime

# Configuration
BASE_URL = "http://localhost:8000"
TEST_USER_EMAIL = f"test_user_{int(time.time())}@example.com"
TEST_USER_PASSWORD = "TestPassword123!"
TEST_USER_NAME = "Test User"

# Color codes for terminal output
class Colors:
    GREEN = '\033[92m'
    RED = '\033[91m'
    YELLOW = '\033[93m'
    BLUE = '\033[94m'
    RESET = '\033[0m'
    BOLD = '\033[1m'

class TestResults:
    def __init__(self):
        self.passed = 0
        self.failed = 0
        self.skipped = 0
        self.errors = []
        self.start_time = time.time()
    
    def add_pass(self, test_name: str):
        self.passed += 1
        print(f"{Colors.GREEN}✓{Colors.RESET} {test_name}")
    
    def add_fail(self, test_name: str, error: str):
        self.failed += 1
        self.errors.append({"test": test_name, "error": error})
        print(f"{Colors.RED}✗{Colors.RESET} {test_name}")
        print(f"  {Colors.RED}Error: {error}{Colors.RESET}")
    
    def add_skip(self, test_name: str, reason: str):
        self.skipped += 1
        print(f"{Colors.YELLOW}⊘{Colors.RESET} {test_name} (Skipped: {reason})")
    
    def print_summary(self):
        duration = time.time() - self.start_time
        total = self.passed + self.failed + self.skipped
        
        print(f"\n{Colors.BOLD}{'='*70}{Colors.RESET}")
        print(f"{Colors.BOLD}TEST SUMMARY{Colors.RESET}")
        print(f"{Colors.BOLD}{'='*70}{Colors.RESET}")
        print(f"Total Tests: {total}")
        print(f"{Colors.GREEN}Passed: {self.passed}{Colors.RESET}")
        print(f"{Colors.RED}Failed: {self.failed}{Colors.RESET}")
        print(f"{Colors.YELLOW}Skipped: {self.skipped}{Colors.RESET}")
        print(f"Duration: {duration:.2f}s")
        
        if self.errors:
            print(f"\n{Colors.RED}Failed Tests:{Colors.RESET}")
            for error in self.errors:
                print(f"  - {error['test']}: {error['error']}")
        
        print(f"{Colors.BOLD}{'='*70}{Colors.RESET}\n")
        
        return self.failed == 0

class E2ETestSuite:
    def __init__(self):
        self.results = TestResults()
        self.token: Optional[str] = None
        self.user_id: Optional[int] = None
        self.project_id: Optional[int] = None
        self.document_ids: list = []
        self.extraction_id: Optional[int] = None
    
    def print_section(self, title: str):
        print(f"\n{Colors.BLUE}{Colors.BOLD}{'='*70}{Colors.RESET}")
        print(f"{Colors.BLUE}{Colors.BOLD}{title}{Colors.RESET}")
        print(f"{Colors.BLUE}{Colors.BOLD}{'='*70}{Colors.RESET}\n")
    
    def test_health_check(self):
        """Test if backend is running"""
        try:
            response = requests.get(f"{BASE_URL}/health", timeout=5)
            if response.status_code == 200:
                self.results.add_pass("Health Check")
                return True
            else:
                self.results.add_fail("Health Check", f"Status code: {response.status_code}")
                return False
        except Exception as e:
            self.results.add_fail("Health Check", str(e))
            return False
    
    def test_user_registration(self):
        """Test user registration"""
        try:
            payload = {
                "email": TEST_USER_EMAIL,
                "password": TEST_USER_PASSWORD,
                "full_name": TEST_USER_NAME
            }
            response = requests.post(f"{BASE_URL}/auth/register", json=payload)
            
            if response.status_code == 200:
                data = response.json()
                self.token = data.get("access_token")
                self.user_id = data.get("user", {}).get("id")
                self.results.add_pass("User Registration")
                return True
            else:
                self.results.add_fail("User Registration", f"Status: {response.status_code}, Response: {response.text}")
                return False
        except Exception as e:
            self.results.add_fail("User Registration", str(e))
            return False
    
    def test_user_login(self):
        """Test user login"""
        try:
            payload = {
                "email": TEST_USER_EMAIL,
                "password": TEST_USER_PASSWORD
            }
            response = requests.post(f"{BASE_URL}/auth/login", json=payload)
            
            if response.status_code == 200:
                data = response.json()
                self.token = data.get("access_token")
                self.results.add_pass("User Login")
                return True
            else:
                self.results.add_fail("User Login", f"Status: {response.status_code}")
                return False
        except Exception as e:
            self.results.add_fail("User Login", str(e))
            return False
    
    def test_invalid_login(self):
        """Test login with invalid credentials"""
        try:
            payload = {
                "email": TEST_USER_EMAIL,
                "password": "WrongPassword123!"
            }
            response = requests.post(f"{BASE_URL}/auth/login", json=payload)
            
            if response.status_code == 401:
                self.results.add_pass("Invalid Login Handling")
                return True
            else:
                self.results.add_fail("Invalid Login Handling", f"Expected 401, got {response.status_code}")
                return False
        except Exception as e:
            self.results.add_fail("Invalid Login Handling", str(e))
            return False
    
    def test_create_project(self):
        """Test project creation"""
        if not self.token:
            self.results.add_skip("Create Project", "No auth token")
            return False
        
        try:
            headers = {"Authorization": f"Bearer {self.token}"}
            payload = {
                "name": f"Test Project {int(time.time())}",
                "description": "Automated test project for E2E testing"
            }
            response = requests.post(f"{BASE_URL}/projects/", json=payload, headers=headers)
            
            if response.status_code == 200:
                data = response.json()
                self.project_id = data.get("id")
                self.results.add_pass("Create Project")
                return True
            else:
                self.results.add_fail("Create Project", f"Status: {response.status_code}, Response: {response.text}")
                return False
        except Exception as e:
            self.results.add_fail("Create Project", str(e))
            return False
    
    def test_list_projects(self):
        """Test listing projects"""
        if not self.token:
            self.results.add_skip("List Projects", "No auth token")
            return False
        
        try:
            headers = {"Authorization": f"Bearer {self.token}"}
            response = requests.get(f"{BASE_URL}/projects/", headers=headers)
            
            if response.status_code == 200:
                projects = response.json()
                if isinstance(projects, list) and len(projects) > 0:
                    self.results.add_pass("List Projects")
                    return True
                else:
                    self.results.add_fail("List Projects", "No projects returned")
                    return False
            else:
                self.results.add_fail("List Projects", f"Status: {response.status_code}")
                return False
        except Exception as e:
            self.results.add_fail("List Projects", str(e))
            return False
    
    def test_upload_document(self, content: str, filename: str):
        """Test document upload"""
        if not self.token or not self.project_id:
            self.results.add_skip(f"Upload Document ({filename})", "No auth token or project")
            return False
        
        try:
            headers = {"Authorization": f"Bearer {self.token}"}
            files = {"file": (filename, content, "text/plain")}
            response = requests.post(
                f"{BASE_URL}/projects/{self.project_id}/documents/upload",
                files=files,
                headers=headers
            )
            
            if response.status_code == 200:
                data = response.json()
                doc_id = data.get("id")
                if doc_id:
                    self.document_ids.append(doc_id)
                self.results.add_pass(f"Upload Document ({filename})")
                return True
            else:
                self.results.add_fail(f"Upload Document ({filename})", f"Status: {response.status_code}, Response: {response.text}")
                return False
        except Exception as e:
            self.results.add_fail(f"Upload Document ({filename})", str(e))
            return False
    
    def test_list_documents(self):
        """Test listing documents"""
        if not self.token or not self.project_id:
            self.results.add_skip("List Documents", "No auth token or project")
            return False
        
        try:
            headers = {"Authorization": f"Bearer {self.token}"}
            response = requests.get(f"{BASE_URL}/projects/{self.project_id}/documents/", headers=headers)
            
            if response.status_code == 200:
                documents = response.json()
                if isinstance(documents, list):
                    self.results.add_pass("List Documents")
                    return True
                else:
                    self.results.add_fail("List Documents", "Invalid response format")
                    return False
            else:
                self.results.add_fail("List Documents", f"Status: {response.status_code}")
                return False
        except Exception as e:
            self.results.add_fail("List Documents", str(e))
            return False
    
    def test_generate_extraction(self):
        """Test extraction generation"""
        if not self.token or not self.project_id:
            self.results.add_skip("Generate Extraction", "No auth token or project")
            return False
        
        try:
            headers = {"Authorization": f"Bearer {self.token}"}
            response = requests.post(
                f"{BASE_URL}/projects/{self.project_id}/extraction/generate",
                headers=headers
            )
            
            if response.status_code == 200:
                data = response.json()
                self.extraction_id = data.get("id")
                self.results.add_pass("Generate Extraction")
                return True
            else:
                self.results.add_fail("Generate Extraction", f"Status: {response.status_code}, Response: {response.text}")
                return False
        except Exception as e:
            self.results.add_fail("Generate Extraction", str(e))
            return False
    
    def test_get_extraction(self):
        """Test retrieving extraction"""
        if not self.token or not self.project_id:
            self.results.add_skip("Get Extraction", "No auth token or project")
            return False
        
        try:
            headers = {"Authorization": f"Bearer {self.token}"}
            response = requests.get(
                f"{BASE_URL}/projects/{self.project_id}/extraction/",
                headers=headers
            )
            
            if response.status_code == 200:
                data = response.json()
                # Validate extraction structure
                required_fields = ["project_overview", "requirements", "scope"]
                if all(field in data.get("extraction_data", {}) for field in required_fields):
                    self.results.add_pass("Get Extraction")
                    return True
                else:
                    self.results.add_fail("Get Extraction", "Missing required fields in extraction")
                    return False
            else:
                self.results.add_fail("Get Extraction", f"Status: {response.status_code}")
                return False
        except Exception as e:
            self.results.add_fail("Get Extraction", str(e))
            return False
    
    def test_data_persistence(self):
        """Test data persistence by re-fetching project"""
        if not self.token or not self.project_id:
            self.results.add_skip("Data Persistence", "No auth token or project")
            return False
        
        try:
            headers = {"Authorization": f"Bearer {self.token}"}
            response = requests.get(f"{BASE_URL}/projects/{self.project_id}", headers=headers)
            
            if response.status_code == 200:
                project = response.json()
                if project.get("id") == self.project_id:
                    self.results.add_pass("Data Persistence")
                    return True
                else:
                    self.results.add_fail("Data Persistence", "Project ID mismatch")
                    return False
            else:
                self.results.add_fail("Data Persistence", f"Status: {response.status_code}")
                return False
        except Exception as e:
            self.results.add_fail("Data Persistence", str(e))
            return False
    
    def run_phase1_functional_tests(self):
        """Run Phase 1: Functional Testing"""
        self.print_section("PHASE 1: FUNCTIONAL TESTING")
        
        # Step 1: End-to-End Flow Testing
        print(f"{Colors.BOLD}Step 1: End-to-End Flow Testing{Colors.RESET}\n")
        
        # Check if backend is running
        if not self.test_health_check():
            print(f"\n{Colors.RED}Backend is not running. Please start the backend server first.{Colors.RESET}")
            print(f"Run: cd backend && uvicorn main:app --reload")
            return False
        
        # Test authentication
        self.test_user_registration()
        self.test_user_login()
        
        # Test project management
        self.test_create_project()
        self.test_list_projects()
        
        # Test document upload
        test_doc_content = """
        Project: E-Commerce Platform
        
        Requirements:
        - User authentication and authorization
        - Product catalog with search functionality
        - Shopping cart and checkout process
        - Payment integration (Stripe)
        - Order management system
        
        Technical Stack:
        - Frontend: React with TypeScript
        - Backend: FastAPI (Python)
        - Database: PostgreSQL
        - Deployment: Docker containers
        """
        self.test_upload_document(test_doc_content, "requirements.txt")
        self.test_list_documents()
        
        # Test extraction generation
        self.test_generate_extraction()
        time.sleep(2)  # Wait for extraction to process
        self.test_get_extraction()
        
        # Test data persistence
        self.test_data_persistence()
        
        # Step 2: Error Handling Validation
        print(f"\n{Colors.BOLD}Step 2: Error Handling Validation{Colors.RESET}\n")
        self.test_invalid_login()
        
        return True
    
    def run_all_tests(self):
        """Run all test phases"""
        print(f"\n{Colors.BOLD}{Colors.BLUE}{'='*70}{Colors.RESET}")
        print(f"{Colors.BOLD}{Colors.BLUE}AI DOCUMENT GENERATOR - E2E TEST SUITE{Colors.RESET}")
        print(f"{Colors.BOLD}{Colors.BLUE}{'='*70}{Colors.RESET}\n")
        print(f"Test User: {TEST_USER_EMAIL}")
        print(f"Backend URL: {BASE_URL}")
        print(f"Started: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n")
        
        # Run Phase 1
        self.run_phase1_functional_tests()
        
        # Print summary
        success = self.results.print_summary()
        
        if success:
            print(f"{Colors.GREEN}{Colors.BOLD}✓ ALL TESTS PASSED{Colors.RESET}\n")
        else:
            print(f"{Colors.RED}{Colors.BOLD}✗ SOME TESTS FAILED{Colors.RESET}\n")
        
        return success

def main():
    """Main test execution"""
    suite = E2ETestSuite()
    success = suite.run_all_tests()
    exit(0 if success else 1)

if __name__ == "__main__":
    main()

# Made with Bob
