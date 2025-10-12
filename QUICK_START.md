# Quick Start Guide

**Code Lab - Interactive Code Execution and Visualization**  
**Created by Joshua Terranova**

## Installation

### Option 1: Quick Install (Recommended)

**On macOS/Linux:**
```bash
./install_all.sh
```

**On Windows:**
```cmd
install_all.bat
```

### Option 2: Using pip

```bash
# Install all packages at once
pip install -r requirements.txt

# Or install individually
pip install -e packages/syntax-forge
pip install -e packages/runtime-spark
# ... etc
```

### Option 3: Manual Installation

```bash
cd packages/syntax-forge
pip install -e .
cd ../runtime-spark
pip install -e .
# Continue for each package...
```

## Basic Usage

### 1. Parse Code

```python
from syntax_forge import parser_registry
from python_lens import PythonParser

# Register Python parser
parser = PythonParser()
parser_registry.register('python', parser)

# Parse some code
code = """
def fibonacci(n):
    if n <= 1:
        return n
    return fibonacci(n-1) + fibonacci(n-2)
"""

result = parser.parse(code)
print(f"Parsed {result.metadata['node_count']} nodes")
```

### 2. Execute Code

```python
from runtime_spark import Executor

executor = Executor()
result = executor.execute("""
x = 10
y = 20
print(f"Sum: {x + y}")
""")

print(result.output)  # "Sum: 30"
print(f"Executed in {result.execution_time}ms")
```

### 3. Visualize Code Structure

```python
from visual_flow import FlowChartGenerator
from syntax_forge import parser_registry

# Parse code first
result = parser_registry.parse(code, 'python')

# Generate flow chart
generator = FlowChartGenerator()
html = generator.generate(result.ast)

# Save to file
with open('flowchart.html', 'w') as f:
    f.write(html)
```

### 4. Profile Performance

```python
from performance_lens import Profiler

profiler = Profiler()

@profiler.profile("my_function")
def slow_function():
    total = 0
    for i in range(1000000):
        total += i
    return total

result = slow_function()
stats = profiler.get_stats()
print(f"Execution time: {stats.total_time}ms")
```

### 5. Run Tests

```python
from spec_runner import TestRunner, expect

runner = TestRunner()

@runner.test("addition works")
def test_add():
    expect(1 + 1).to_be(2)

@runner.test("multiplication works")
def test_multiply():
    expect(2 * 3).to_be(6)

results = runner.run()
print(f"Passed: {sum(1 for r in results if r.passed)}/{len(results)}")
```

### 6. Use Themes

```python
from color_forge import ThemeManager, dark_theme, light_theme

manager = ThemeManager()
manager.register(dark_theme)
manager.register(light_theme)

manager.set_active_theme('dark')
theme = manager.get_active_theme()
print(f"Using theme: {theme.name}")
print(f"Background: {theme.colors.background}")
```

### 7. Export Visualizations

```python
from output_forge import Exporter

exporter = Exporter()

# Export as HTML
html_output = exporter.export(content, format='html')

# Export as SVG
svg_output = exporter.export(content, format='svg')

# Export as JSON
json_output = exporter.export(content, format='json')
```

## Package Overview

| Package | Import | Purpose |
|---------|--------|---------|
| syntax-forge | `from syntax_forge import ...` | Core parser interfaces |
| runtime-spark | `from runtime_spark import ...` | Code execution |
| visual-flow | `from visual_flow import ...` | Visualizations |
| python-lens | `from python_lens import ...` | Python analysis |
| java-lens | `from java_lens import ...` | Java analysis |
| rust-lens | `from rust_lens import ...` | Rust analysis |
| diagram-weaver | `from diagram_weaver import ...` | Diagram generation |
| graph-dynamics | `from graph_dynamics import ...` | Interactive graphs |
| data-pulse | `from data_pulse import ...` | Charts |
| spec-runner | `from spec_runner import ...` | Testing |
| performance-lens | `from performance_lens import ...` | Profiling |
| step-tracer | `from step_tracer import ...` | Debugging |
| color-forge | `from color_forge import ...` | Themes |
| ui-forge | `from ui_forge import ...` | UI components |
| notebook-bridge | `from notebook_bridge import ...` | Jupyter |
| version-chronicle | `from version_chronicle import ...` | Git integration |
| code-mentor | `from code_mentor import ...` | AI assistant |
| snippet-vault | `from snippet_vault import ...` | Snippets |
| output-forge | `from output_forge import ...` | Export |
| live-sync | `from live_sync import ...` | Collaboration |

## Requirements

- Python 3.8 or higher
- pip 21.0 or higher

## Getting Help

All packages include detailed documentation in their respective README files.

## License

MIT License - Created by Joshua Terranova

All code is original work with no third-party implementations.

