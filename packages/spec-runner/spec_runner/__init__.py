"""
Spec Runner - Production Test Framework
Original implementation by Joshua Terranova
"""

__version__ = "1.0.0"
__author__ = "Joshua Terranova"

from .test_runner import (
    TestRunner,
    TestResult,
    TestSuite,
    TestStatus,
    Assertions,
    runner,
    assert_equal,
    assert_not_equal,
    assert_true,
    assert_false,
    assert_is_none,
    assert_is_not_none,
    assert_in,
    assert_not_in,
    assert_raises,
    assert_greater,
    assert_less,
)

__all__ = [
    "TestRunner",
    "TestResult",
    "TestSuite",
    "TestStatus",
    "Assertions",
    "runner",
    "assert_equal",
    "assert_not_equal",
    "assert_true",
    "assert_false",
    "assert_is_none",
    "assert_is_not_none",
    "assert_in",
    "assert_not_in",
    "assert_raises",
    "assert_greater",
    "assert_less",
]
