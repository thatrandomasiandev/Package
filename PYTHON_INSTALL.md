# Python Installation Guide

**All packages created by Joshua Terranova**

## Installing Code Lab Packages with pip

All Code Lab packages are now available as Python packages and can be installed using `pip`.

### Installation Methods

#### 1. Install from Local Directory

```bash
# Install Syntax Forge (Core Parser)
cd packages/syntax-forge
pip install -e .

# Install Runtime Spark (Execution Engine)
cd ../runtime-spark
pip install -e .

# Install Visual Flow (Visualizers)
cd ../visual-flow
pip install -e .

# And so on for other packages...
```

#### 2. Install All Packages at Once

```bash
# From the root directory
pip install -e packages/syntax-forge
pip install -e packages/runtime-spark
pip install -e packages/visual-flow
pip install -e packages/python-lens
pip install -e packages/java-lens
pip install -e packages/rust-lens
pip install -e packages/diagram-weaver
pip install -e packages/graph-dynamics
pip install -e packages/data-pulse
pip install -e packages/spec-runner
pip install -e packages/performance-lens
pip install -e packages/step-tracer
pip install -e packages/color-forge
pip install -e packages/ui-forge
pip install -e packages/notebook-bridge
pip install -e packages/version-chronicle
pip install -e packages/code-mentor
pip install -e packages/snippet-vault
pip install -e packages/output-forge
pip install -e packages/live-sync
```

#### 3. Install with Development Dependencies

```bash
pip install -e "packages/syntax-forge[dev]"
```

### Package Overview

| Package Name | pip install | Description |
|--------------|-------------|-------------|
| syntax-forge | `pip install syntax-forge` | Core parser interfaces and AST utilities |
| runtime-spark | `pip install runtime-spark` | Code execution runtime |
| visual-flow | `pip install visual-flow` | Flow chart and structure visualizations |
| python-lens | `pip install python-lens` | Python code analysis |
| java-lens | `pip install java-lens` | Java code analysis |
| rust-lens | `pip install rust-lens` | Rust code analysis |
| diagram-weaver | `pip install diagram-weaver` | Diagram generation |
| graph-dynamics | `pip install graph-dynamics` | Interactive graph visualizations |
| data-pulse | `pip install data-pulse` | Data visualization and charting |
| spec-runner | `pip install spec-runner` | Test execution framework |
| performance-lens | `pip install performance-lens` | Performance profiling |
| step-tracer | `pip install step-tracer` | Debugging utilities |
| color-forge | `pip install color-forge` | Theme system |
| ui-forge | `pip install ui-forge` | UI components |
| notebook-bridge | `pip install notebook-bridge` | Jupyter integration |
| version-chronicle | `pip install version-chronicle` | Git integration |
| code-mentor | `pip install code-mentor` | AI assistant |
| snippet-vault | `pip install snippet-vault` | Code snippets |
| output-forge | `pip install output-forge` | Export utilities |
| live-sync | `pip install live-sync` | Collaboration tools |

### Usage Example

```python
from syntax_forge import BaseParser, parser_registry
from runtime_spark import Executor
from visual_flow import FlowChartGenerator

# Register a parser
from python_lens import PythonParser
parser = PythonParser()
parser_registry.register('python', parser)

# Parse some code
code = '''
def hello(name):
    print(f"Hello, {name}!")
'''

result = parser.parse(code)
print(f"Found {result.metadata['functions']} functions")

# Generate visualization
visualizer = FlowChartGenerator()
chart = visualizer.generate(result.ast)
```

### Requirements

- Python 3.8 or higher
- pip 21.0 or higher

### Development Setup

```bash
# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install all packages in editable mode
for pkg in packages/*; do
    if [ -f "$pkg/setup.py" ]; then
        pip install -e "$pkg[dev]"
    fi
done

# Run tests
pytest packages/
```

### Building Distribution Packages

```bash
# Install build tools
pip install build twine

# Build a package
cd packages/syntax-forge
python -m build

# This creates:
# - dist/syntax_forge-1.0.0-py3-none-any.whl
# - dist/syntax-forge-1.0.0.tar.gz
```

### Publishing to PyPI (Optional)

```bash
# Test on TestPyPI first
twine upload --repository testpypi dist/*

# Then publish to PyPI
twine upload dist/*
```

## Project Structure

Each Python package follows this structure:

```
package-name/
├── setup.py              # Package configuration
├── __init__.py           # Package initialization
├── module1.py            # Python modules
├── module2.py
├── README.md             # Documentation
└── tests/                # Unit tests
    └── test_module1.py
```

## License

MIT - All code is original work by Joshua Terranova

Copyright (c) 2024 Joshua Terranova

