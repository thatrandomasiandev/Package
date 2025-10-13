#!/bin/bash
# Quick install script for all Code Lab packages
# Created by Joshua Terranova

echo "Installing Code Lab packages from GitHub..."
echo "============================================"

pip install git+https://github.com/thatrandomasiandev/Package.git#subdirectory=packages/syntax-forge
pip install git+https://github.com/thatrandomasiandev/Package.git#subdirectory=packages/python-lens
pip install git+https://github.com/thatrandomasiandev/Package.git#subdirectory=packages/visual-flow
pip install git+https://github.com/thatrandomasiandev/Package.git#subdirectory=packages/runtime-spark
pip install git+https://github.com/thatrandomasiandev/Package.git#subdirectory=packages/data-pulse
pip install git+https://github.com/thatrandomasiandev/Package.git#subdirectory=packages/performance-lens
pip install git+https://github.com/thatrandomasiandev/Package.git#subdirectory=packages/graph-dynamics
pip install git+https://github.com/thatrandomasiandev/Package.git#subdirectory=packages/diagram-weaver
pip install git+https://github.com/thatrandomasiandev/Package.git#subdirectory=packages/java-lens
pip install git+https://github.com/thatrandomasiandev/Package.git#subdirectory=packages/spec-runner
pip install git+https://github.com/thatrandomasiandev/Package.git#subdirectory=packages/step-tracer
pip install git+https://github.com/thatrandomasiandev/Package.git#subdirectory=packages/color-forge
pip install git+https://github.com/thatrandomasiandev/Package.git#subdirectory=packages/ui-forge
pip install git+https://github.com/thatrandomasiandev/Package.git#subdirectory=packages/notebook-bridge
pip install git+https://github.com/thatrandomasiandev/Package.git#subdirectory=packages/version-chronicle

echo ""
echo "✅ All packages installed successfully!"
echo ""
echo "Test with:"
echo "  python3 -c 'from syntax_forge import BaseParser; print(\"Works!\")'"

