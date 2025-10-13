# Installation Guide

**All packages created by Joshua Terranova**

## ✅ **All Packages Installed and Working!**

All 15 production packages have been successfully installed on your system.

---

## Quick Test

Run the test script to verify:
```bash
python3 test_all_packages.py
```

---

## Available Packages

All packages use underscores for imports (e.g., `syntax_forge`, `python_lens`):

### 1. **syntax_forge** - Python AST Parser
```python
from syntax_forge import BaseParser, ParserRegistry, NodeType
```

### 2. **python_lens** - Python Code Analyzer
```python
from python_lens import PythonAnalyzer

analyzer = PythonAnalyzer()
analyzer.parse_file("mycode.py")
stats = analyzer.get_statistics()
```

### 3. **visual_flow** - Flowchart Generation
```python
from visual_flow import FlowchartGenerator, FlowNodeType

flow = FlowchartGenerator()
flow.add_node("start", FlowNodeType.START, "Begin")
print(flow.to_mermaid())
```

### 4. **runtime_spark** - Secure Code Execution
```python
from runtime_spark import SecureExecutor

executor = SecureExecutor()
result = executor.execute_code("print('Hello World')")
```

### 5. **data_pulse** - Data Visualization
```python
from data_pulse import DataVisualizer

viz = DataVisualizer()
# Use matplotlib or plotly for charts
```

### 6. **performance_lens** - Performance Profiling
```python
from performance_lens import Profiler

profiler = Profiler()

@profiler.profile_function
def my_function():
    return sum(range(1000))
```

### 7. **graph_dynamics** - Network Visualization
```python
from graph_dynamics import NetworkVisualizer, Node, Edge

viz = NetworkVisualizer()
nodes = [Node("A", "Node A"), Node("B", "Node B")]
edges = [Edge("A", "B")]
html = viz.visualize_graph(nodes, edges)
```

### 8. **diagram_weaver** - Diagram Generation
```python
from diagram_weaver import DiagramGenerator

dg = DiagramGenerator()
seq = dg.create_sequence_diagram()
seq.add_participant("User")
seq.message("User", "System", "request")
print(seq.to_mermaid())
```

### 9. **java_lens** - Java Code Analyzer
```python
from java_lens import JavaAnalyzer

analyzer = JavaAnalyzer()
package = analyzer.parse_file("MyClass.java")
```

### 10. **spec_runner** - Test Framework
```python
from spec_runner import TestRunner, assert_equal

runner = TestRunner()

def test_example():
    assert_equal(2 + 2, 4)

result = runner.run_test(test_example)
```

### 11. **step_tracer** - Debugger Integration
```python
from step_tracer import StepTracer

tracer = StepTracer()
tracer.start()
# your code here
tracer.stop()
tracer.print_trace()
```

### 12. **color_forge** - Theme Generation
```python
from color_forge import ThemeGenerator, Color

theme = ThemeGenerator()
primary = Color.from_hex("#2196F3")
theme.generate_theme(primary)
print(theme.to_css())
```

### 13. **ui_forge** - UI Components
```python
from ui_forge import UIComponentGenerator

ui = UIComponentGenerator()
button = ui.create_button("Click Me", variant="primary")
card = ui.create_card("Title", "Content")
```

### 14. **notebook_bridge** - Jupyter Integration
```python
from notebook_bridge import JupyterConverter

converter = JupyterConverter()
notebook = converter.read_notebook("example.ipynb")
python_code = converter.to_python("example.ipynb")
```

### 15. **version_chronicle** - Git Integration
```python
from version_chronicle import GitIntegration

git = GitIntegration()
commits = git.get_commit_history(max_count=10)
status = git.get_status()
```

---

## Installation Commands

If you need to reinstall any package:

```bash
# Single package
pip3 install -e packages/syntax-forge

# All packages
pip3 install -e packages/syntax-forge \
  -e packages/python-lens \
  -e packages/visual-flow \
  -e packages/runtime-spark \
  -e packages/data-pulse \
  -e packages/performance-lens \
  -e packages/graph-dynamics \
  -e packages/diagram-weaver \
  -e packages/java-lens \
  -e packages/spec-runner \
  -e packages/step-tracer \
  -e packages/color-forge \
  -e packages/ui-forge \
  -e packages/notebook-bridge \
  -e packages/version-chronicle
```

---

## Dependencies

The following external dependencies are automatically installed:

- **plotly** (6.3.1) - for data_pulse and graph_dynamics
- **javalang** (0.13.0) - for java_lens
- **nbformat** (5.10.4) - for notebook_bridge
- **GitPython** (3.1.0) - for version_chronicle
- **Jinja2** (3.0+) - for ui_forge
- **networkx** (2.6+) - for graph_dynamics
- **matplotlib** (3.5.0+) - for data_pulse
- **psutil** (5.8.0+) - for performance_lens

---

## Package Structure

Each package follows this structure:
```
project-name/          # Project directory (with hyphens)
  ├── module_name/     # Python module (with underscores)
  │   ├── __init__.py
  │   └── implementation.py
  ├── setup.py
  └── README.md
```

**Important:** Always use underscores when importing:
- ✅ `from syntax_forge import ...`
- ❌ `from syntax-forge import ...` (won't work)

---

## Troubleshooting

### Import Error
If you get `ModuleNotFoundError`:
1. Make sure you're using underscores: `syntax_forge` not `syntax-forge`
2. Reinstall the package: `pip3 install --force-reinstall -e packages/[package-name]`

### Missing Dependencies
If you get missing dependency errors:
```bash
# Install dependencies for specific package
pip3 install plotly  # for data_pulse, graph_dynamics
pip3 install javalang  # for java_lens
pip3 install nbformat  # for notebook_bridge
pip3 install GitPython  # for version_chronicle
```

---

## Testing

Run the comprehensive test:
```bash
python3 test_all_packages.py
```

This will verify all 15 packages are correctly installed and importable.

---

**Created by Joshua Terranova**  
**All code is original work**  
**MIT License**
