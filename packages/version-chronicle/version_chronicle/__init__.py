"""
Version Chronicle - Production Git Integration
Original implementation by Joshua Terranova
"""

__version__ = "1.0.0"
__author__ = "Joshua Terranova"

from .git_integration import GitIntegration, CommitInfo, BranchInfo, DiffInfo

__all__ = [
    "GitIntegration",
    "CommitInfo",
    "BranchInfo",
    "DiffInfo",
]
