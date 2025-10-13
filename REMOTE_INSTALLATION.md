# Remote Installation Guide (GitHub)

**Install packages directly from GitHub - works on Google Colab, Kaggle, any Python environment!**

Created by Joshua Terranova

---

## 🌐 Install from GitHub (Recommended for Remote Users)

### For Google Colab / Kaggle / Any Remote Environment

Install any package directly from GitHub using these commands:

```python
# In a Colab/Jupyter cell or terminal
!pip install git+https://github.com/thatrandomasiandev/Package.git#subdirectory=packages/syntax-forge
!pip install git+https://github.com/thatrandomasiandev/Package.git#subdirectory=packages/python-lens
!pip install git+https://github.com/thatrandomasiandev/Package.git#subdirectory=packages/visual-flow
!pip install git+https://github.com/thatrandomasiandev/Package.git#subdirectory=packages/runtime-spark
!pip install git+https://github.com/thatrandomasiandev/Package.git#subdirectory=packages/data-pulse
!pip install git+https://github.com/thatrandomasiandev/Package.git#subdirectory=packages/performance-lens
!pip install git+https://github.com/thatrandomasiandev/Package.git#subdirectory=packages/graph-dynamics
!pip install git+https://github.com/thatrandomasiandev/Package.git#subdirectory=packages/diagram-weaver
!pip install git+https://github.com/thatrandomasiandev/Package.git#subdirectory=packages/java-lens
!pip install git+https://github.com/thatrandomasiandev/Package.git#subdirectory=packages/spec-runner
!pip install git+https://github.com/thatrandomasiandev/Package.git#subdirectory=packages/step-tracer
!pip install git+https://github.com/thatrandomasiandev/Package.git#subdirectory=packages/color-forge
!pip install git+https://github.com/thatrandomasiandev/Package.git#subdirectory=packages/ui-forge
!pip install git+https://github.com/thatrandomasiandev/Package.git#subdirectory=packages/notebook-bridge
!pip install git+https://github.com/thatrandomasiandev/Package.git#subdirectory=packages/version-chronicle
```

---

## 📦 Quick Install (All Packages)

### Google Colab One-Liner

Copy and paste this into a Colab cell:

```python
# Install all 15 packages at once
packages = [
    'syntax-forge', 'python-lens', 'visual-flow', 'runtime-spark', 
    'data-pulse', 'performance-lens', 'graph-dynamics', 'diagram-weaver',
    'java-lens', 'spec-runner', 'step-tracer', 'color-forge',
    'ui-forge', 'notebook-bridge', 'version-chronicle'
]

base_url = "git+https://github.com/thatrandomasiandev/Package.git#subdirectory=packages/"

for package in packages:
    !pip install -q {base_url + package}
    
print("✅ All packages installed!")
```

---

## 💻 Usage Examples

After installation, use the packages exactly as documented:

### Example 1: Analyze Python Code
```python
from python_lens import PythonAnalyzer

code = """
def factorial(n):
    if n <= 1:
        return 1
    return n * factorial(n-1)
"""

analyzer = PythonAnalyzer()
analyzer.parse(code)
stats = analyzer.get_statistics()
print(f"Functions: {stats['num_functions']}")
print(f"Complexity: {stats['avg_complexity']}")
```

### Example 2: Generate Flowchart
```python
from visual_flow import FlowchartGenerator, FlowNodeType

flow = FlowchartGenerator()
flow.add_node("start", FlowNodeType.START, "Start")
flow.add_node("process", FlowNodeType.PROCESS, "Process Data")
flow.add_node("end", FlowNodeType.END, "End")
flow.add_edge("start", "process")
flow.add_edge("process", "end")

print(flow.to_mermaid())
```

### Example 3: Execute Code Safely
```python
from runtime_spark import SecureExecutor

executor = SecureExecutor()
result = executor.execute_code("""
x = 10
y = 20
print(f"Sum: {x + y}")
""", timeout=5)

print(f"Output: {result.output}")
print(f"Logs: {result.logs}")
```

### Example 4: Create Data Visualizations
```python
from data_pulse import DataVisualizer

viz = DataVisualizer()
data = {
    'x': [1, 2, 3, 4, 5],
    'y': [2, 4, 6, 8, 10]
}

# Create a line plot
html = viz.create_plot(data, 'line', title='My Data', output_format='html')
# Display in Colab
from IPython.display import HTML
display(HTML(html))
```

### Example 5: Network Graph
```python
from graph_dynamics import NetworkVisualizer, Node, Edge

viz = NetworkVisualizer()

nodes = [
    Node("A", "Node A"),
    Node("B", "Node B"),
    Node("C", "Node C")
]

edges = [
    Edge("A", "B"),
    Edge("B", "C"),
    Edge("C", "A")
]

html = viz.visualize_graph(nodes, edges, layout='circular', output_format='html')

# Display in Colab
from IPython.display import HTML
display(HTML(html))
```

---

## 🧪 Test Installation

After installing, test that everything works:

```python
# Test all imports
print("Testing imports...")

try:
    from syntax_forge import BaseParser
    print("✅ syntax_forge")
except Exception as e:
    print(f"❌ syntax_forge: {e}")

try:
    from python_lens import PythonAnalyzer
    print("✅ python_lens")
except Exception as e:
    print(f"❌ python_lens: {e}")

try:
    from visual_flow import FlowchartGenerator
    print("✅ visual_flow")
except Exception as e:
    print(f"❌ visual_flow: {e}")

try:
    from runtime_spark import SecureExecutor
    print("✅ runtime_spark")
except Exception as e:
    print(f"❌ runtime_spark: {e}")

try:
    from data_pulse import DataVisualizer
    print("✅ data_pulse")
except Exception as e:
    print(f"❌ data_pulse: {e}")

try:
    from performance_lens import Profiler
    print("✅ performance_lens")
except Exception as e:
    print(f"❌ performance_lens: {e}")

try:
    from graph_dynamics import NetworkVisualizer
    print("✅ graph_dynamics")
except Exception as e:
    print(f"❌ graph_dynamics: {e}")

try:
    from diagram_weaver import DiagramGenerator
    print("✅ diagram_weaver")
except Exception as e:
    print(f"❌ diagram_weaver: {e}")

try:
    from java_lens import JavaAnalyzer
    print("✅ java_lens")
except Exception as e:
    print(f"❌ java_lens: {e}")

try:
    from spec_runner import TestRunner
    print("✅ spec_runner")
except Exception as e:
    print(f"❌ spec_runner: {e}")

try:
    from step_tracer import StepTracer
    print("✅ step_tracer")
except Exception as e:
    print(f"❌ step_tracer: {e}")

try:
    from color_forge import ThemeGenerator
    print("✅ color_forge")
except Exception as e:
    print(f"❌ color_forge: {e}")

try:
    from ui_forge import UIComponentGenerator
    print("✅ ui_forge")
except Exception as e:
    print(f"❌ ui_forge: {e}")

try:
    from notebook_bridge import JupyterConverter
    print("✅ notebook_bridge")
except Exception as e:
    print(f"❌ notebook_bridge: {e}")

try:
    from version_chronicle import GitIntegration
    print("✅ version_chronicle")
except Exception as e:
    print(f"❌ version_chronicle: {e}")

print("\n🎉 Installation test complete!")
```

---

## 📋 Individual Package URLs

If you only need specific packages:

| Package | GitHub Install URL |
|---------|-------------------|
| **syntax-forge** | `git+https://github.com/thatrandomasiandev/Package.git#subdirectory=packages/syntax-forge` |
| **python-lens** | `git+https://github.com/thatrandomasiandev/Package.git#subdirectory=packages/python-lens` |
| **visual-flow** | `git+https://github.com/thatrandomasiandev/Package.git#subdirectory=packages/visual-flow` |
| **runtime-spark** | `git+https://github.com/thatrandomasiandev/Package.git#subdirectory=packages/runtime-spark` |
| **data-pulse** | `git+https://github.com/thatrandomasiandev/Package.git#subdirectory=packages/data-pulse` |
| **performance-lens** | `git+https://github.com/thatrandomasiandev/Package.git#subdirectory=packages/performance-lens` |
| **graph-dynamics** | `git+https://github.com/thatrandomasiandev/Package.git#subdirectory=packages/graph-dynamics` |
| **diagram-weaver** | `git+https://github.com/thatrandomasiandev/Package.git#subdirectory=packages/diagram-weaver` |
| **java-lens** | `git+https://github.com/thatrandomasiandev/Package.git#subdirectory=packages/java-lens` |
| **spec-runner** | `git+https://github.com/thatrandomasiandev/Package.git#subdirectory=packages/spec-runner` |
| **step-tracer** | `git+https://github.com/thatrandomasiandev/Package.git#subdirectory=packages/step-tracer` |
| **color-forge** | `git+https://github.com/thatrandomasiandev/Package.git#subdirectory=packages/color-forge` |
| **ui-forge** | `git+https://github.com/thatrandomasiandev/Package.git#subdirectory=packages/ui-forge` |
| **notebook-bridge** | `git+https://github.com/thatrandomasiandev/Package.git#subdirectory=packages/notebook-bridge` |
| **version-chronicle** | `git+https://github.com/thatrandomasiandev/Package.git#subdirectory=packages/version-chronicle` |

---

## 🔄 Updating Packages

To update to the latest version:

```python
# Reinstall from GitHub to get latest changes
!pip install --upgrade --force-reinstall git+https://github.com/thatrandomasiandev/Package.git#subdirectory=packages/python-lens
```

---

## 🐛 Troubleshooting

### "No module named 'package_name'"
Make sure you're using underscores for imports:
- ✅ `from syntax_forge import ...`
- ❌ `from syntax-forge import ...`

### "Installation failed"
Try installing dependencies first:
```python
!pip install matplotlib plotly networkx javalang nbformat GitPython Jinja2
```

### "Permission denied"
On Colab/Kaggle, you don't need sudo. Just use `!pip install`

---

## 📖 Full Documentation

- **PACKAGE_REFERENCE.md** - Complete API reference
- **INSTALLATION.md** - Local installation guide
- **PRODUCTION_SUMMARY.md** - Project overview

---

**Repository:** https://github.com/thatrandomasiandev/Package  
**Created by Joshua Terranova**  
**All code is original work**  
**MIT License**

