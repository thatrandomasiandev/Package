"""
Production Test Runner
A lightweight testing framework similar to pytest
Original implementation by Joshua Terranova
"""

from typing import List, Dict, Optional, Any, Callable
from dataclasses import dataclass, field
from enum import Enum
import time
import traceback
import sys


class TestStatus(Enum):
    """Test status"""
    PASSED = "passed"
    FAILED = "failed"
    SKIPPED = "skipped"
    ERROR = "error"


@dataclass
class TestResult:
    """Result of a single test"""
    name: str
    status: TestStatus
    duration: float
    error_message: Optional[str] = None
    stack_trace: Optional[str] = None


@dataclass
class TestSuite:
    """Collection of test results"""
    name: str
    results: List[TestResult] = field(default_factory=list)
    
    @property
    def passed(self) -> int:
        return sum(1 for r in self.results if r.status == TestStatus.PASSED)
    
    @property
    def failed(self) -> int:
        return sum(1 for r in self.results if r.status == TestStatus.FAILED)
    
    @property
    def skipped(self) -> int:
        return sum(1 for r in self.results if r.status == TestStatus.SKIPPED)
    
    @property
    def errors(self) -> int:
        return sum(1 for r in self.results if r.status == TestStatus.ERROR)
    
    @property
    def total(self) -> int:
        return len(self.results)
    
    @property
    def total_duration(self) -> float:
        return sum(r.duration for r in self.results)


class AssertionError(Exception):
    """Custom assertion error"""
    pass


class Assertions:
    """Assertion methods"""
    
    @staticmethod
    def assert_equal(actual, expected, message: Optional[str] = None):
        """Assert two values are equal"""
        if actual != expected:
            msg = message or f"Expected {expected}, but got {actual}"
            raise AssertionError(msg)
    
    @staticmethod
    def assert_not_equal(actual, expected, message: Optional[str] = None):
        """Assert two values are not equal"""
        if actual == expected:
            msg = message or f"Expected values to be different, but both were {actual}"
            raise AssertionError(msg)
    
    @staticmethod
    def assert_true(value, message: Optional[str] = None):
        """Assert value is True"""
        if not value:
            msg = message or f"Expected True, but got {value}"
            raise AssertionError(msg)
    
    @staticmethod
    def assert_false(value, message: Optional[str] = None):
        """Assert value is False"""
        if value:
            msg = message or f"Expected False, but got {value}"
            raise AssertionError(msg)
    
    @staticmethod
    def assert_is_none(value, message: Optional[str] = None):
        """Assert value is None"""
        if value is not None:
            msg = message or f"Expected None, but got {value}"
            raise AssertionError(msg)
    
    @staticmethod
    def assert_is_not_none(value, message: Optional[str] = None):
        """Assert value is not None"""
        if value is None:
            msg = message or "Expected value to not be None"
            raise AssertionError(msg)
    
    @staticmethod
    def assert_in(item, container, message: Optional[str] = None):
        """Assert item is in container"""
        if item not in container:
            msg = message or f"Expected {item} to be in {container}"
            raise AssertionError(msg)
    
    @staticmethod
    def assert_not_in(item, container, message: Optional[str] = None):
        """Assert item is not in container"""
        if item in container:
            msg = message or f"Expected {item} to not be in {container}"
            raise AssertionError(msg)
    
    @staticmethod
    def assert_raises(exception_class, callable_func, *args, **kwargs):
        """Assert function raises specific exception"""
        try:
            callable_func(*args, **kwargs)
            raise AssertionError(f"Expected {exception_class.__name__} to be raised")
        except exception_class:
            pass
        except Exception as e:
            raise AssertionError(f"Expected {exception_class.__name__}, but got {type(e).__name__}: {e}")
    
    @staticmethod
    def assert_greater(value, threshold, message: Optional[str] = None):
        """Assert value is greater than threshold"""
        if not value > threshold:
            msg = message or f"Expected {value} > {threshold}"
            raise AssertionError(msg)
    
    @staticmethod
    def assert_less(value, threshold, message: Optional[str] = None):
        """Assert value is less than threshold"""
        if not value < threshold:
            msg = message or f"Expected {value} < {threshold}"
            raise AssertionError(msg)


class TestRunner(Assertions):
    """
    Production test runner with pytest-like features
    """
    
    def __init__(self):
        self.suites: List[TestSuite] = []
        self.current_suite: Optional[TestSuite] = None
        self.setup_func: Optional[Callable] = None
        self.teardown_func: Optional[Callable] = None
    
    def create_suite(self, name: str) -> TestSuite:
        """Create a new test suite"""
        suite = TestSuite(name=name)
        self.suites.append(suite)
        self.current_suite = suite
        return suite
    
    def setup(self, func: Callable):
        """Register setup function"""
        self.setup_func = func
        return func
    
    def teardown(self, func: Callable):
        """Register teardown function"""
        self.teardown_func = func
        return func
    
    def test(self, func: Callable):
        """Decorator to mark a function as a test"""
        func._is_test = True
        return func
    
    def skip(self, reason: str = ""):
        """Decorator to skip a test"""
        def decorator(func):
            func._skip = True
            func._skip_reason = reason
            return func
        return decorator
    
    def run_test(self, test_func: Callable, test_name: Optional[str] = None) -> TestResult:
        """
        Run a single test
        
        Args:
            test_func: Test function to run
            test_name: Optional test name (defaults to function name)
        
        Returns:
            TestResult
        """
        name = test_name or test_func.__name__
        
        # Check if test should be skipped
        if hasattr(test_func, '_skip') and test_func._skip:
            reason = getattr(test_func, '_skip_reason', '')
            return TestResult(
                name=name,
                status=TestStatus.SKIPPED,
                duration=0,
                error_message=f"Skipped: {reason}" if reason else "Skipped"
            )
        
        start_time = time.time()
        
        try:
            # Run setup
            if self.setup_func:
                self.setup_func()
            
            # Run test
            test_func()
            
            # Run teardown
            if self.teardown_func:
                self.teardown_func()
            
            duration = time.time() - start_time
            
            return TestResult(
                name=name,
                status=TestStatus.PASSED,
                duration=duration
            )
        
        except AssertionError as e:
            duration = time.time() - start_time
            return TestResult(
                name=name,
                status=TestStatus.FAILED,
                duration=duration,
                error_message=str(e),
                stack_trace=traceback.format_exc()
            )
        
        except Exception as e:
            duration = time.time() - start_time
            return TestResult(
                name=name,
                status=TestStatus.ERROR,
                duration=duration,
                error_message=f"{type(e).__name__}: {str(e)}",
                stack_trace=traceback.format_exc()
            )
    
    def run_suite(self, suite_name: str, test_functions: List[Callable]) -> TestSuite:
        """
        Run a test suite
        
        Args:
            suite_name: Name of the suite
            test_functions: List of test functions
        
        Returns:
            TestSuite with results
        """
        suite = self.create_suite(suite_name)
        
        for test_func in test_functions:
            result = self.run_test(test_func)
            suite.results.append(result)
        
        return suite
    
    def discover_tests(self, module) -> List[Callable]:
        """
        Discover test functions in a module
        
        Args:
            module: Python module to search
        
        Returns:
            List of test functions
        """
        tests = []
        
        for name in dir(module):
            if name.startswith('test_'):
                obj = getattr(module, name)
                if callable(obj):
                    tests.append(obj)
        
        return tests
    
    def print_results(self, suite: TestSuite):
        """Print test results"""
        print(f"\n{'='*60}")
        print(f"Test Suite: {suite.name}")
        print(f"{'='*60}")
        
        for result in suite.results:
            status_symbol = {
                TestStatus.PASSED: "✓",
                TestStatus.FAILED: "✗",
                TestStatus.SKIPPED: "○",
                TestStatus.ERROR: "⚠"
            }[result.status]
            
            print(f"{status_symbol} {result.name} ({result.duration:.3f}s)")
            
            if result.error_message:
                print(f"  Error: {result.error_message}")
            
            if result.stack_trace and result.status != TestStatus.SKIPPED:
                print(f"  {result.stack_trace}")
        
        print(f"\n{'='*60}")
        print(f"Results: {suite.passed} passed, {suite.failed} failed, "
              f"{suite.skipped} skipped, {suite.errors} errors")
        print(f"Total: {suite.total} tests in {suite.total_duration:.3f}s")
        print(f"{'='*60}\n")
    
    def run_all(self) -> bool:
        """
        Run all test suites
        
        Returns:
            True if all tests passed, False otherwise
        """
        all_passed = True
        
        for suite in self.suites:
            self.print_results(suite)
            if suite.failed > 0 or suite.errors > 0:
                all_passed = False
        
        return all_passed
    
    def to_dict(self) -> Dict[str, Any]:
        """Export results as dictionary"""
        return {
            "suites": [
                {
                    "name": suite.name,
                    "total": suite.total,
                    "passed": suite.passed,
                    "failed": suite.failed,
                    "skipped": suite.skipped,
                    "errors": suite.errors,
                    "duration": suite.total_duration,
                    "results": [
                        {
                            "name": r.name,
                            "status": r.status.value,
                            "duration": r.duration,
                            "error": r.error_message
                        }
                        for r in suite.results
                    ]
                }
                for suite in self.suites
            ]
        }


# Global runner instance
runner = TestRunner()

# Export common assertions
assert_equal = Assertions.assert_equal
assert_not_equal = Assertions.assert_not_equal
assert_true = Assertions.assert_true
assert_false = Assertions.assert_false
assert_is_none = Assertions.assert_is_none
assert_is_not_none = Assertions.assert_is_not_none
assert_in = Assertions.assert_in
assert_not_in = Assertions.assert_not_in
assert_raises = Assertions.assert_raises
assert_greater = Assertions.assert_greater
assert_less = Assertions.assert_less

