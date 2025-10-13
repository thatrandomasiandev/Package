# Google Colab Installation Guide

**How to use Code Lab packages in Google Colab**

Created by Joshua Terranova

---

## 🚀 Quick Setup for Google Colab

### Step 1: Clone the Repository

```python
# Run this in a Colab cell
!git clone https://github.com/thatrandomasiandev/Package.git
```

### Step 2: Install Packages

```python
# Install the packages you need
!pip install -e /content/Package/packages/visual-flow
!pip install -e /content/Package/packages/python-lens
!pip install -e /content/Package/packages/data-pulse
!pip install -e /content/Package/packages/runtime-spark
# ... install any packages you want
```

**Or install all at once:**
```python
!pip install -q -e /content/Package/packages/syntax-forge \
  -e /content/Package/packages/python-lens \
  -e /content/Package/packages/visual-flow \
  -e /content/Package/packages/runtime-spark \
  -e /content/Package/packages/data-pulse \
  -e /content/Package/packages/performance-lens \
  -e /content/Package/packages/graph-dynamics \
  -e /content/Package/packages/diagram-weaver \
  -e /content/Package/packages/java-lens \
  -e /content/Package/packages/spec-runner \
  -e /content/Package/packages/step-tracer \
  -e /content/Package/packages/color-forge \
  -e /content/Package/packages/ui-forge \
  -e /content/Package/packages/notebook-bridge \
  -e /content/Package/packages/version-chronicle
```

### Step 3: Use the Packages

```python
# Now you can import normally!
from visual_flow import FlowchartGenerator, FlowNodeType

flow = FlowchartGenerator()
flow.add_node("start", FlowNodeType.START, "Begin")
flow.add_node("process", FlowNodeType.PROCESS, "Process Data")
flow.add_node("end", FlowNodeType.END, "End")
flow.add_edge("start", "process")
flow.add_edge("process", "end")

print(flow.to_mermaid())
```

---

## 📝 Complete Colab Example

Copy this entire cell:

```python
# ========================================
# Code Lab Packages Setup for Google Colab
# ========================================

# 1. Clone repository
print("📥 Cloning repository...")
!git clone https://github.com/thatrandomasiandev/Package.git

# 2. Install all packages
print("📦 Installing packages...")
!pip install -q -e /content/Package/packages/syntax-forge \
  -e /content/Package/packages/python-lens \
  -e /content/Package/packages/visual-flow \
  -e /content/Package/packages/runtime-spark \
  -e /content/Package/packages/data-pulse \
  -e /content/Package/packages/performance-lens \
  -e /content/Package/packages/graph-dynamics \
  -e /content/Package/packages/diagram-weaver \
  -e /content/Package/packages/java-lens \
  -e /content/Package/packages/spec-runner \
  -e /content/Package/packages/step-tracer \
  -e /content/Package/packages/color-forge \
  -e /content/Package/packages/ui-forge \
  -e /content/Package/packages/notebook-bridge \
  -e /content/Package/packages/version-chronicle

print("✅ Setup complete! You can now use the packages.")

# 3. Test imports
print("\n🧪 Testing imports...")
try:
    from visual_flow import FlowchartGenerator
    print("✅ visual_flow")
except Exception as e:
    print(f"❌ visual_flow: {e}")

try:
    from python_lens import PythonAnalyzer
    print("✅ python_lens")
except Exception as e:
    print(f"❌ python_lens: {e}")

try:
    from data_pulse import DataVisualizer
    print("✅ data_pulse")
except Exception as e:
    print(f"❌ data_pulse: {e}")

print("\n🎉 Ready to use!")
```

---

## 💡 Usage Examples for Colab

### Example 1: Generate Flowchart
```python
from visual_flow import FlowchartGenerator, FlowNodeType

flow = FlowchartGenerator()
flow.add_node("start", FlowNodeType.START, "Start")
flow.add_node("input", FlowNodeType.INPUT_OUTPUT, "Get Input")
flow.add_node("decision", FlowNodeType.DECISION, "Valid?")
flow.add_node("process", FlowNodeType.PROCESS, "Process")
flow.add_node("output", FlowNodeType.INPUT_OUTPUT, "Show Output")
flow.add_node("end", FlowNodeType.END, "End")

flow.add_edge("start", "input")
flow.add_edge("input", "decision")
flow.add_edge("decision", "process", "yes")
flow.add_edge("decision", "end", "no")
flow.add_edge("process", "output")
flow.add_edge("output", "end")

# Display in Colab
mermaid_code = flow.to_mermaid()
print(mermaid_code)

# Or visualize with HTML
html = flow.to_html()
from IPython.display import HTML
display(HTML(html))
```

### Example 2: Analyze Python Code
```python
from python_lens import PythonAnalyzer

code = """
def factorial(n):
    if n <= 1:
        return 1
    return n * factorial(n-1)

def fibonacci(n):
    if n <= 1:
        return n
    return fibonacci(n-1) + fibonacci(n-2)
"""

analyzer = PythonAnalyzer()
analyzer.parse(code)

stats = analyzer.get_statistics()
print(f"📊 Code Statistics:")
print(f"  Functions: {stats['num_functions']}")
print(f"  Average Complexity: {stats['avg_complexity']:.2f}")
print(f"  Max Complexity: {stats['max_complexity']}")

print(f"\n📋 Functions:")
for func in analyzer.get_all_functions():
    print(f"  - {func.name}: complexity = {func.complexity}")
```

### Example 3: Execute Code Safely
```python
from runtime_spark import SecureExecutor

executor = SecureExecutor()

code = """
# This code runs in a sandbox
x = 10
y = 20
result = x + y
print(f"The sum is: {result}")
"""

result = executor.execute_code(code, timeout=5)

print("📤 Output:")
for log in result.logs:
    print(f"  {log}")

print(f"\n⏱️ Execution time: {result.execution_time:.2f}ms")
```

### Example 4: Create Interactive Graph
```python
from graph_dynamics import NetworkVisualizer, Node, Edge

viz = NetworkVisualizer()

# Create a simple network
nodes = [
    Node("A", "Node A"),
    Node("B", "Node B"),
    Node("C", "Node C"),
    Node("D", "Node D")
]

edges = [
    Edge("A", "B"),
    Edge("B", "C"),
    Edge("C", "D"),
    Edge("D", "A"),
    Edge("B", "D")
]

# Generate interactive visualization
html = viz.visualize_graph(
    nodes, 
    edges, 
    layout='circular',
    title='My Network Graph',
    output_format='html'
)

# Display in Colab
from IPython.display import HTML
display(HTML(html))
```

### Example 5: Data Visualization
```python
from data_pulse import DataVisualizer
import random

viz = DataVisualizer()

# Generate sample data
data = {
    'x': list(range(1, 11)),
    'y': [random.randint(1, 100) for _ in range(10)]
}

# Create interactive plot
html = viz.create_plot(
    data,
    'line',
    title='Sample Data',
    x_label='Time',
    y_label='Value',
    output_format='html'
)

# Display in Colab
from IPython.display import HTML
display(HTML(html))
```

---

## ❌ Common Errors & Solutions

### Error: "No module named 'visual_flow'"

**❌ Wrong Way:**
```python
# DON'T do this - won't work!
import sys
sys.path.append('/content/Package/packages')
from visual_flow import FlowchartGenerator
```

**✅ Right Way:**
```python
# DO this - install the packages first!
!pip install -e /content/Package/packages/visual-flow
from visual_flow import FlowchartGenerator
```

### Error: "Package not found"

Make sure you cloned the repository:
```python
!git clone https://github.com/thatrandomasiandev/Package.git
```

### Error: "Already cloned"

If you see "destination path 'Package' already exists", either:
1. Remove it first: `!rm -rf /content/Package`
2. Or just skip cloning and install packages

---

## 🔄 Updating Packages

If packages are updated on GitHub, refresh them in Colab:

```python
# Remove old version
!rm -rf /content/Package

# Clone latest version
!git clone https://github.com/thatrandomasiandev/Package.git

# Reinstall packages
!pip install --force-reinstall -e /content/Package/packages/visual-flow
```

---

## 📋 Quick Reference

### Import Names
Remember to use underscores for imports:

| Package Name (with hyphens) | Import Name (with underscores) |
|----------------------------|-------------------------------|
| syntax-forge | `from syntax_forge import ...` |
| python-lens | `from python_lens import ...` |
| visual-flow | `from visual_flow import ...` |
| runtime-spark | `from runtime_spark import ...` |
| data-pulse | `from data_pulse import ...` |
| performance-lens | `from performance_lens import ...` |
| graph-dynamics | `from graph_dynamics import ...` |
| diagram-weaver | `from diagram_weaver import ...` |
| java-lens | `from java_lens import ...` |
| spec-runner | `from spec_runner import ...` |
| step-tracer | `from step_tracer import ...` |
| color-forge | `from color_forge import ...` |
| ui-forge | `from ui_forge import ...` |
| notebook-bridge | `from notebook_bridge import ...` |
| version-chronicle | `from version_chronicle import ...` |

---

## 🎯 Pro Tips for Colab

1. **Run setup once** - At the beginning of your notebook, run the setup cell once
2. **Save to Drive** - Mount Google Drive to persist across sessions
3. **Use `-q` flag** - Makes pip install quieter: `!pip install -q -e ...`
4. **Check installation** - Run test imports to verify everything works
5. **Clear output** - After setup, clear cell output to keep notebook clean

---

**Created by Joshua Terranova**  
**Repository**: https://github.com/thatrandomasiandev/Package  
**MIT License**

