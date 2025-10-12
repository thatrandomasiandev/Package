#!/bin/bash
# Install all Code Lab packages
# Created by Joshua Terranova

echo "========================================="
echo "Code Lab Package Installation"
echo "By Joshua Terranova"
echo "========================================="
echo ""

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "Error: Python 3 is not installed. Please install Python 3.8 or higher."
    exit 1
fi

echo "Python version: $(python3 --version)"
echo ""

# Create virtual environment if it doesn't exist
if [ ! -d "venv" ]; then
    echo "Creating virtual environment..."
    python3 -m venv venv
    echo "✓ Virtual environment created"
fi

# Activate virtual environment
echo "Activating virtual environment..."
source venv/bin/activate

# Upgrade pip
echo "Upgrading pip..."
pip install --upgrade pip setuptools wheel

echo ""
echo "Installing Code Lab packages..."
echo "========================================"

# Array of packages in dependency order
packages=(
    "syntax-forge"
    "runtime-spark"
    "visual-flow"
    "python-lens"
    "java-lens"
    "rust-lens"
    "diagram-weaver"
    "graph-dynamics"
    "data-pulse"
    "spec-runner"
    "performance-lens"
    "step-tracer"
    "color-forge"
    "ui-forge"
    "notebook-bridge"
    "version-chronicle"
    "code-mentor"
    "snippet-vault"
    "output-forge"
    "live-sync"
)

# Install each package
for pkg in "${packages[@]}"; do
    echo ""
    echo "Installing $pkg..."
    if [ -d "packages/$pkg" ]; then
        pip install -e "packages/$pkg"
        if [ $? -eq 0 ]; then
            echo "✓ $pkg installed successfully"
        else
            echo "✗ Failed to install $pkg"
        fi
    else
        echo "✗ Package directory not found: packages/$pkg"
    fi
done

echo ""
echo "========================================"
echo "Installation complete!"
echo "========================================"
echo ""
echo "All packages have been installed in editable mode."
echo "You can now import them in Python:"
echo ""
echo "  from syntax_forge import BaseParser"
echo "  from runtime_spark import Executor"
echo "  from visual_flow import FlowChartGenerator"
echo ""
echo "To activate the environment in the future, run:"
echo "  source venv/bin/activate"
echo ""
echo "Created by Joshua Terranova"

