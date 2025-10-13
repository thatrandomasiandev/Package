"""
Python Lens
Original implementation by Joshua Terranova
"""

from setuptools import setup, find_packages

setup(
    name="python-lens",
    version="1.0.0",
    author="Joshua Terranova",
    description="Advanced Python code analysis using AST",
    packages=find_packages(),
    classifiers=[
        "Development Status :: 4 - Beta",
        "Intended Audience :: Developers",
        "License :: OSI Approved :: MIT License",
        "Programming Language :: Python :: 3",
        "Programming Language :: Python :: 3.8",
        "Programming Language :: Python :: 3.9",
        "Programming Language :: Python :: 3.10",
        "Programming Language :: Python :: 3.11",
    ],
    python_requires=">=3.8",
    install_requires=[],
)
