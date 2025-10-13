"""
Graph Dynamics
Original implementation by Joshua Terranova
"""

from setuptools import setup, find_packages

setup(
    name="graph-dynamics",
    version="1.0.0",
    author="Joshua Terranova",
    description="Production network visualization with networkx and plotly",
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
    install_requires=[
        "networkx>=2.6",
        "plotly>=5.0.0",
    ],
)
