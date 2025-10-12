"""
Syntax Forge - Core parser interfaces and AST utilities
Original implementation by Joshua Terranova
"""

from setuptools import setup, find_packages

with open("README.md", "r", encoding="utf-8") as fh:
    long_description = fh.read()

setup(
    name="syntax-forge",
    version="1.0.0",
    author="Joshua Terranova",
    author_email="",
    description="Core parser interfaces and AST utilities for Code Lab",
    long_description=long_description,
    long_description_content_type="text/markdown",
    url="https://github.com/joshua-terranova/code-lab",
    packages=find_packages(),
    classifiers=[
        "Development Status :: 4 - Beta",
        "Intended Audience :: Developers",
        "Topic :: Software Development :: Code Generators",
        "License :: OSI Approved :: MIT License",
        "Programming Language :: Python :: 3",
        "Programming Language :: Python :: 3.8",
        "Programming Language :: Python :: 3.9",
        "Programming Language :: Python :: 3.10",
        "Programming Language :: Python :: 3.11",
    ],
    python_requires=">=3.8",
    install_requires=[],
    extras_require={
        "dev": ["pytest>=7.0", "black>=22.0", "mypy>=0.950"],
    },
)

