# Installation Guide

**Simple installation for all Code Lab packages**

Created by Joshua Terranova

---

## Installation

### Step 1: Clone the Repository

```bash
git clone https://github.com/thatrandomasiandev/Package.git
cd Package
```

### Step 2: Install Packages

Install any package you need:

```bash
pip install -e packages/syntax-forge
pip install -e packages/python-lens
pip install -e packages/visual-flow
pip install -e packages/runtime-spark
pip install -e packages/data-pulse
pip install -e packages/performance-lens
pip install -e packages/graph-dynamics
pip install -e packages/diagram-weaver
pip install -e packages/java-lens
pip install -e packages/spec-runner
pip install -e packages/step-tracer
pip install -e packages/color-forge
pip install -e packages/ui-forge
pip install -e packages/notebook-bridge
pip install -e packages/version-chronicle
```

### Install All Packages

One command to install everything:

```bash
pip install -e packages/syntax-forge -e packages/python-lens -e packages/visual-flow \
  -e packages/runtime-spark -e packages/data-pulse -e packages/performance-lens \
  -e packages/graph-dynamics -e packages/diagram-weaver -e packages/java-lens \
  -e packages/spec-runner -e packages/step-tracer -e packages/color-forge \
  -e packages/ui-forge -e packages/notebook-bridge -e packages/version-chronicle
```

---

## Usage

After installation, import and use:

```python
from syntax_forge import BaseParser
from python_lens import PythonAnalyzer
from visual_flow import FlowchartGenerator
from runtime_spark import SecureExecutor
from data_pulse import DataVisualizer
from performance_lens import Profiler
from graph_dynamics import NetworkVisualizer
from diagram_weaver import DiagramGenerator
from java_lens import JavaAnalyzer
from spec_runner import TestRunner
from step_tracer import StepTracer
from color_forge import ThemeGenerator
from ui_forge import UIComponentGenerator
from notebook_bridge import JupyterConverter
from version_chronicle import GitIntegration
```

---

## Test Installation

Run the test script:

```bash
python3 test_all_packages.py
```

You should see ✅ for all packages.

---

## Available Packages

| Package | Description | Import |
|---------|-------------|--------|
| **syntax-forge** | Python AST parser | `from syntax_forge import BaseParser` |
| **python-lens** | Python code analyzer | `from python_lens import PythonAnalyzer` |
| **visual-flow** | Flowchart generation | `from visual_flow import FlowchartGenerator` |
| **runtime-spark** | Secure code execution | `from runtime_spark import SecureExecutor` |
| **data-pulse** | Data visualization | `from data_pulse import DataVisualizer` |
| **performance-lens** | Performance profiling | `from performance_lens import Profiler` |
| **graph-dynamics** | Network visualization | `from graph_dynamics import NetworkVisualizer` |
| **diagram-weaver** | Diagram generation | `from diagram_weaver import DiagramGenerator` |
| **java-lens** | Java code analyzer | `from java_lens import JavaAnalyzer` |
| **spec-runner** | Test framework | `from spec_runner import TestRunner` |
| **step-tracer** | Debugger integration | `from step_tracer import StepTracer` |
| **color-forge** | Theme generation | `from color_forge import ThemeGenerator` |
| **ui-forge** | UI components | `from ui_forge import UIComponentGenerator` |
| **notebook-bridge** | Jupyter integration | `from notebook_bridge import JupyterConverter` |
| **version-chronicle** | Git integration | `from version_chronicle import GitIntegration` |

---

## Requirements

- Python 3.8+
- pip

Dependencies are automatically installed when you install each package.

---

**Created by Joshua Terranova**  
**All code is original work**  
**MIT License**

