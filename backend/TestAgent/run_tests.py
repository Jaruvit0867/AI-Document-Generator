#!/usr/bin/env python3
"""
Quick Start Script for Running AI Document Generator Tests
This script helps you run tests with proper setup and validation
"""

import os
import sys
import subprocess
import time
import requests
from pathlib import Path

# Color codes
class Colors:
    GREEN = '\033[92m'
    RED = '\033[91m'
    YELLOW = '\033[93m'
    BLUE = '\033[94m'
    RESET = '\033[0m'
    BOLD = '\033[1m'

def print_header(text):
    print(f"\n{Colors.BLUE}{Colors.BOLD}{'='*70}{Colors.RESET}")
    print(f"{Colors.BLUE}{Colors.BOLD}{text}{Colors.RESET}")
    print(f"{Colors.BLUE}{Colors.BOLD}{'='*70}{Colors.RESET}\n")

def print_success(text):
    print(f"{Colors.GREEN}✓ {text}{Colors.RESET}")

def print_error(text):
    print(f"{Colors.RED}✗ {text}{Colors.RESET}")

def print_warning(text):
    print(f"{Colors.YELLOW}⚠ {text}{Colors.RESET}")

def print_info(text):
    print(f"{Colors.BLUE}ℹ {text}{Colors.RESET}")

def check_backend_running():
    """Check if backend is running"""
    try:
        response = requests.get("http://localhost:8000/health", timeout=5)
        if response.status_code == 200:
            return True
    except:
        pass
    return False

def check_python_version():
    """Check Python version"""
    version = sys.version_info
    if version.major >= 3 and version.minor >= 8:
        print_success(f"Python version: {version.major}.{version.minor}.{version.micro}")
        return True
    else:
        print_error(f"Python version {version.major}.{version.minor} is too old. Need 3.8+")
        return False

def check_dependencies():
    """Check if required dependencies are installed"""
    required = ['requests', 'fastapi', 'uvicorn', 'sqlalchemy', 'openai']
    missing = []
    
    for package in required:
        try:
            __import__(package)
            print_success(f"Package '{package}' is installed")
        except ImportError:
            missing.append(package)
            print_error(f"Package '{package}' is missing")
    
    return len(missing) == 0, missing

def check_env_file():
    """Check if .env file exists in backend"""
    env_path = Path("backend/.env")
    if env_path.exists():
        print_success(".env file found in backend directory")
        return True
    else:
        print_error(".env file not found in backend directory")
        print_info("Copy backend/.env.example to backend/.env and configure it")
        return False

def check_test_cases():
    """Check if test case files exist"""
    test_cases = [
        "test_cases/test_case_1_technical_spec.txt",
        "test_cases/test_case_2_meeting_minutes.txt",
        "test_cases/test_case_3_unstructured_notes.txt"
    ]
    
    all_exist = True
    for test_case in test_cases:
        if Path(test_case).exists():
            print_success(f"Test case found: {test_case}")
        else:
            print_error(f"Test case missing: {test_case}")
            all_exist = False
    
    return all_exist

def run_preflight_checks():
    """Run all preflight checks"""
    print_header("PREFLIGHT CHECKS")
    
    checks = {
        "Python Version": check_python_version(),
        "Backend Running": check_backend_running(),
        "Environment File": check_env_file(),
        "Test Cases": check_test_cases()
    }
    
    deps_ok, missing = check_dependencies()
    checks["Dependencies"] = deps_ok
    
    print("\n" + "="*70)
    print(f"{Colors.BOLD}Preflight Check Summary:{Colors.RESET}")
    for check, status in checks.items():
        status_text = f"{Colors.GREEN}PASS{Colors.RESET}" if status else f"{Colors.RED}FAIL{Colors.RESET}"
        print(f"  {check}: {status_text}")
    print("="*70 + "\n")
    
    all_passed = all(checks.values())
    
    if not all_passed:
        print_error("Some preflight checks failed. Please fix the issues above.")
        
        if not checks["Backend Running"]:
            print_info("\nTo start the backend:")
            print("  cd backend")
            print("  uvicorn main:app --reload")
        
        if not checks["Dependencies"]:
            print_info("\nTo install missing dependencies:")
            print("  cd backend")
            print("  pip install -r requirements.txt")
        
        return False
    
    print_success("All preflight checks passed!")
    return True

def run_e2e_tests():
    """Run end-to-end tests"""
    print_header("RUNNING END-TO-END TESTS")
    
    try:
        result = subprocess.run(
            [sys.executable, "test_e2e.py"],
            capture_output=False,
            text=True
        )
        return result.returncode == 0
    except Exception as e:
        print_error(f"Failed to run tests: {e}")
        return False

def show_menu():
    """Show interactive menu"""
    print_header("AI DOCUMENT GENERATOR - TEST RUNNER")
    
    print("What would you like to do?\n")
    print("1. Run preflight checks only")
    print("2. Run automated E2E tests")
    print("3. Run preflight checks + E2E tests")
    print("4. Show testing guide")
    print("5. Open test results template")
    print("6. Exit")
    
    choice = input(f"\n{Colors.BOLD}Enter your choice (1-6): {Colors.RESET}")
    return choice.strip()

def show_testing_guide():
    """Display testing guide information"""
    print_header("TESTING GUIDE")
    
    guide_path = Path("TESTING_GUIDE.md")
    if guide_path.exists():
        print_info("Testing guide is available at: TESTING_GUIDE.md")
        print("\nKey sections:")
        print("  - Prerequisites and setup")
        print("  - Phase 1: Functional Testing (2 hours)")
        print("  - Phase 2: Document Quality Testing (2 hours)")
        print("  - Quality assessment rubric")
        print("  - Troubleshooting guide")
        
        open_file = input(f"\n{Colors.BOLD}Open the file? (y/n): {Colors.RESET}")
        if open_file.lower() == 'y':
            if sys.platform == 'win32':
                os.startfile(str(guide_path))
            elif sys.platform == 'darwin':
                subprocess.run(['open', str(guide_path)])
            else:
                subprocess.run(['xdg-open', str(guide_path)])
    else:
        print_error("TESTING_GUIDE.md not found")

def open_results_template():
    """Open test results template"""
    print_header("TEST RESULTS TEMPLATE")
    
    template_path = Path("TEST_RESULTS_TEMPLATE.md")
    if template_path.exists():
        print_info("Test results template is available at: TEST_RESULTS_TEMPLATE.md")
        print("\nThis template includes:")
        print("  - Executive summary section")
        print("  - Functional test results tables")
        print("  - Quality assessment for each test case")
        print("  - Issues tracking")
        print("  - Production readiness checklist")
        
        open_file = input(f"\n{Colors.BOLD}Open the file? (y/n): {Colors.RESET}")
        if open_file.lower() == 'y':
            if sys.platform == 'win32':
                os.startfile(str(template_path))
            elif sys.platform == 'darwin':
                subprocess.run(['open', str(template_path)])
            else:
                subprocess.run(['xdg-open', str(template_path)])
    else:
        print_error("TEST_RESULTS_TEMPLATE.md not found")

def main():
    """Main function"""
    # Change to script directory
    script_dir = Path(__file__).parent
    os.chdir(script_dir)
    
    while True:
        choice = show_menu()
        
        if choice == '1':
            run_preflight_checks()
            input(f"\n{Colors.BOLD}Press Enter to continue...{Colors.RESET}")
        
        elif choice == '2':
            if not check_backend_running():
                print_error("Backend is not running. Please start it first.")
                print_info("Run: cd backend && uvicorn main:app --reload")
            else:
                success = run_e2e_tests()
                if success:
                    print_success("\nAll tests passed!")
                else:
                    print_error("\nSome tests failed. Check the output above.")
            input(f"\n{Colors.BOLD}Press Enter to continue...{Colors.RESET}")
        
        elif choice == '3':
            if run_preflight_checks():
                print("\n")
                success = run_e2e_tests()
                if success:
                    print_success("\nAll tests passed!")
                else:
                    print_error("\nSome tests failed. Check the output above.")
            input(f"\n{Colors.BOLD}Press Enter to continue...{Colors.RESET}")
        
        elif choice == '4':
            show_testing_guide()
            input(f"\n{Colors.BOLD}Press Enter to continue...{Colors.RESET}")
        
        elif choice == '5':
            open_results_template()
            input(f"\n{Colors.BOLD}Press Enter to continue...{Colors.RESET}")
        
        elif choice == '6':
            print_info("Exiting...")
            break
        
        else:
            print_error("Invalid choice. Please enter 1-6.")
            time.sleep(1)
        
        # Clear screen (optional)
        # os.system('cls' if os.name == 'nt' else 'clear')

if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print(f"\n\n{Colors.YELLOW}Interrupted by user{Colors.RESET}")
        sys.exit(0)

# Made with Bob
