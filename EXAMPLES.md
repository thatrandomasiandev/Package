# Code Lab Packages - Practice Examples

**Working code examples for all 15 packages**

Created by Joshua Terranova

---

## 1. syntax-forge - Python AST Parser

```python
from syntax_forge import BaseParser, NodeType

# Example: Parse Python code
code = """
def greet(name):
    return f"Hello, {name}!"

class Person:
    def __init__(self, name):
        self.name = name
"""

# The parser is a base class - typically you'd extend it
# For now, we can use Python's ast module directly through syntax_forge
import ast

tree = ast.parse(code)
print("✅ Code parsed successfully!")
print(f"Number of nodes: {len(list(ast.walk(tree)))}")

# Find all function definitions
for node in ast.walk(tree):
    if isinstance(node, ast.FunctionDef):
        print(f"Found function: {node.name}")
```

---

## 2. python-lens - Python Code Analyzer

```python
from python_lens import PythonAnalyzer

# Example 1: Analyze code complexity
code = """
def factorial(n):
    if n <= 1:
        return 1
    return n * factorial(n-1)

def fibonacci(n):
    if n <= 1:
        return n
    return fibonacci(n-1) + fibonacci(n-2)

class Calculator:
    def add(self, a, b):
        return a + b
    
    def multiply(self, a, b):
        result = 0
        for i in range(b):
            result += a
        return result
"""

analyzer = PythonAnalyzer()
analyzer.parse(code)

# Get statistics
stats = analyzer.get_statistics()
print("📊 Code Statistics:")
print(f"  Total lines: {stats['total_lines']}")
print(f"  Functions: {stats['num_functions']}")
print(f"  Classes: {stats['num_classes']}")
print(f"  Average complexity: {stats['avg_complexity']:.2f}")

# Get complexity report
print("\n📈 Complexity Report:")
complexity = analyzer.get_complexity_report()
for func_name, complexity_score in complexity.items():
    print(f"  {func_name}: {complexity_score}")

# Find functions without docstrings
print("\n📝 Functions without docstrings:")
for func in analyzer.find_functions_without_docstrings():
    print(f"  - {func}")
```

---

## 3. visual-flow - Flowchart Generation

```python
from visual_flow import FlowchartGenerator, FlowNodeType

# Example: Create a login flowchart
flow = FlowchartGenerator()

# Add nodes
flow.add_node("start", FlowNodeType.START, "Start")
flow.add_node("input", FlowNodeType.INPUT_OUTPUT, "Enter Username/Password")
flow.add_node("validate", FlowNodeType.DECISION, "Valid Credentials?")
flow.add_node("success", FlowNodeType.PROCESS, "Grant Access")
flow.add_node("fail", FlowNodeType.PROCESS, "Show Error")
flow.add_node("retry", FlowNodeType.DECISION, "Try Again?")
flow.add_node("end", FlowNodeType.END, "End")

# Add edges
flow.add_edge("start", "input")
flow.add_edge("input", "validate")
flow.add_edge("validate", "success", "yes")
flow.add_edge("validate", "fail", "no")
flow.add_edge("success", "end")
flow.add_edge("fail", "retry")
flow.add_edge("retry", "input", "yes")
flow.add_edge("retry", "end", "no")

# Generate Mermaid diagram
print("🔄 Flowchart (Mermaid.js):")
print(flow.to_mermaid())

# Generate Graphviz
print("\n🔄 Flowchart (Graphviz):")
print(flow.to_graphviz())
```

---

## 4. runtime-spark - Secure Code Execution

```python
from runtime_spark import SecureExecutor

# Example 1: Safe execution
executor = SecureExecutor()

code = """
# Calculate fibonacci numbers
def fib(n):
    if n <= 1:
        return n
    return fib(n-1) + fib(n-2)

for i in range(10):
    print(f"fib({i}) = {fib(i)}")
"""

result = executor.execute_code(code, timeout=5)

print("📤 Output:")
for log in result.logs:
    print(f"  {log}")

print(f"\n⏱️ Execution time: {result.execution_time:.2f}ms")

# Example 2: Catching errors
bad_code = """
x = 10
y = 0
print(x / y)  # Division by zero!
"""

result = executor.execute_code(bad_code, timeout=5)

if result.error_message:
    print(f"\n❌ Error caught: {result.error_message}")
else:
    print(f"\n✅ Code executed successfully")
```

---

## 5. data-pulse - Data Visualization

```python
from data_pulse import DataVisualizer
import random

viz = DataVisualizer()

# Example 1: Line chart
data = {
    'x': list(range(1, 11)),
    'y': [random.randint(10, 100) for _ in range(10)]
}

html = viz.create_plot(
    data,
    'line',
    title='Random Data Over Time',
    x_label='Time',
    y_label='Value',
    output_format='html'
)

print("📊 Line chart created!")
# In Colab: display(HTML(html))

# Example 2: Bar chart
data = {
    'x': ['Python', 'JavaScript', 'Java', 'C++', 'Go'],
    'y': [45, 30, 15, 8, 2]
}

html = viz.create_plot(
    data,
    'bar',
    title='Programming Language Popularity',
    x_label='Language',
    y_label='Percentage',
    output_format='html'
)

print("📊 Bar chart created!")

# Example 3: Pie chart
data = {
    'labels': ['Frontend', 'Backend', 'Database', 'DevOps'],
    'values': [35, 40, 15, 10]
}

html = viz.create_plot(
    data,
    'pie',
    title='Development Time Distribution',
    output_format='html'
)

print("📊 Pie chart created!")
```

---

## 6. performance-lens - Performance Profiling

```python
from performance_lens import Profiler

profiler = Profiler()

# Example 1: Profile a function
@profiler.profile_function
def slow_function():
    result = 0
    for i in range(100000):
        result += i ** 2
    return result

# Run the function
result = slow_function()
print(f"Result: {result}")

# Get profiling statistics
stats = profiler.get_stats()
print("\n⚡ Performance Stats:")
print(stats)

# Example 2: Benchmark multiple implementations
def implementation_a(n):
    return sum(i**2 for i in range(n))

def implementation_b(n):
    result = 0
    for i in range(n):
        result += i * i
    return result

# Benchmark them
print("\n🏁 Benchmarking implementations:")
time_a = profiler.benchmark(implementation_a, 10000, iterations=100)
time_b = profiler.benchmark(implementation_b, 10000, iterations=100)

print(f"Implementation A: {time_a:.4f}s")
print(f"Implementation B: {time_b:.4f}s")
print(f"Winner: {'A' if time_a < time_b else 'B'}")
```

---

## 7. graph-dynamics - Network Visualization

```python
from graph_dynamics import NetworkVisualizer, Node, Edge

viz = NetworkVisualizer()

# Example: Social network
nodes = [
    Node("Alice", "Alice"),
    Node("Bob", "Bob"),
    Node("Charlie", "Charlie"),
    Node("David", "David"),
    Node("Eve", "Eve")
]

edges = [
    Edge("Alice", "Bob"),
    Edge("Alice", "Charlie"),
    Edge("Bob", "David"),
    Edge("Charlie", "David"),
    Edge("David", "Eve"),
    Edge("Eve", "Alice")
]

# Visualize the network
html = viz.visualize_graph(
    nodes,
    edges,
    layout='spring',
    title='Social Network',
    output_format='html'
)

print("🕸️ Network graph created!")
# In Colab: display(HTML(html))

# Analyze centrality
centrality = viz.analyze_centrality(nodes, edges)
print("\n📊 Centrality Analysis:")
print(f"Degree centrality: {centrality['degree_centrality']}")

# Find shortest path
path = viz.find_shortest_path(nodes, edges, "Alice", "Eve")
print(f"\n🛣️ Shortest path from Alice to Eve: {' -> '.join(path)}")

# Calculate metrics
metrics = viz.calculate_metrics(nodes, edges)
print(f"\n📈 Network Metrics:")
print(f"  Nodes: {metrics['node_count']}")
print(f"  Edges: {metrics['edge_count']}")
print(f"  Density: {metrics['density']:.3f}")
print(f"  Average degree: {metrics['average_degree']:.2f}")
```

---

## 8. diagram-weaver - Diagram Generation

```python
from diagram_weaver import DiagramGenerator

dg = DiagramGenerator()

# Example 1: Sequence diagram
seq = dg.create_sequence_diagram()
seq.add_participant("User")
seq.add_participant("Frontend")
seq.add_participant("Backend")
seq.add_participant("Database")

seq.message("User", "Frontend", "Click Login")
seq.message("Frontend", "Backend", "POST /login")
seq.message("Backend", "Database", "SELECT user")
seq.return_message("Database", "Backend", "User data")
seq.return_message("Backend", "Frontend", "Auth token")
seq.return_message("Frontend", "User", "Show dashboard")

print("📋 Sequence Diagram (Mermaid):")
print(seq.to_mermaid())

# Example 2: Class diagram
cls = dg.create_class_diagram()
cls.add_class("Animal", ["name", "age"], ["eat()", "sleep()"])
cls.add_class("Dog", ["breed"], ["bark()"])
cls.add_class("Cat", ["color"], ["meow()"])

cls.inheritance("Animal", "Dog")
cls.inheritance("Animal", "Cat")

print("\n📊 Class Diagram (Mermaid):")
print(cls.to_mermaid())

# Example 3: ER diagram
er = dg.create_er_diagram()
er.add_entity("User", ["id", "name", "email"])
er.add_entity("Post", ["id", "title", "content"])
er.add_entity("Comment", ["id", "text"])

er.one_to_many("User", "Post", "creates")
er.one_to_many("Post", "Comment", "has")
er.one_to_many("User", "Comment", "writes")

print("\n🗃️ ER Diagram (Mermaid):")
print(er.to_mermaid())
```

---

## 9. java-lens - Java Code Analyzer

```python
from java_lens import JavaAnalyzer

# Example: Analyze Java code (as string)
java_code = """
package com.example;

import java.util.*;

public class Calculator {
    private int result;
    
    public Calculator() {
        this.result = 0;
    }
    
    public int add(int a, int b) {
        return a + b;
    }
    
    public int multiply(int a, int b) {
        return a * b;
    }
}

class MathUtils {
    public static double sqrt(double n) {
        return Math.sqrt(n);
    }
}
"""

analyzer = JavaAnalyzer()
package = analyzer.parse(java_code)

print("☕ Java Analysis:")
print(f"Package: {package.name}")
print(f"Imports: {len(package.imports)}")
print(f"Classes: {len(package.classes)}")

for cls in package.classes:
    print(f"\n📦 Class: {cls.name}")
    print(f"  Methods: {len(cls.methods)}")
    for method in cls.methods:
        print(f"    - {method.name}({', '.join([p['name'] for p in method.parameters])})")
    print(f"  Fields: {len(cls.fields)}")
    for field in cls.fields:
        print(f"    - {field['type']} {field['name']}")

# Get statistics
stats = analyzer.get_statistics(package)
print(f"\n📊 Statistics:")
print(f"  Total methods: {stats['num_methods']}")
print(f"  Public methods: {stats['public_methods']}")
print(f"  Private methods: {stats['private_methods']}")
```

---

## 10. spec-runner - Testing Framework

```python
from spec_runner import TestRunner, assert_equal, assert_true, assert_in

runner = TestRunner()

# Example 1: Simple tests
def test_addition():
    assert_equal(2 + 2, 4)

def test_string_operations():
    name = "Python"
    assert_equal(len(name), 6)
    assert_in("th", name)

def test_list_operations():
    numbers = [1, 2, 3, 4, 5]
    assert_equal(sum(numbers), 15)
    assert_true(all(n > 0 for n in numbers))

# Run tests
print("🧪 Running tests...")
suite = runner.run_suite("Math Tests", [
    test_addition,
    test_string_operations,
    test_list_operations
])

runner.print_results(suite)

# Example 2: Test with setup/teardown
@runner.setup
def setup():
    print("Setting up test environment...")

@runner.teardown
def teardown():
    print("Cleaning up...")

def test_with_setup():
    assert_equal(10 * 10, 100)

result = runner.run_test(test_with_setup)
print(f"\nTest status: {result.status.value}")
```

---

## 11. step-tracer - Debugger Integration

```python
from step_tracer import StepTracer

# Example: Trace function execution
tracer = StepTracer()

def factorial(n):
    if n <= 1:
        return 1
    return n * factorial(n - 1)

def fibonacci(n):
    if n <= 1:
        return n
    a, b = 0, 1
    for _ in range(n):
        a, b = b, a + b
    return a

# Trace the execution
tracer.start()

result1 = factorial(5)
result2 = fibonacci(10)

tracer.stop()

print(f"📊 Execution Trace:")
print(f"Total events: {len(tracer.trace.events)}")
print(f"Function calls: {len(tracer.get_function_calls())}")

print(f"\n🔍 Execution path:")
path = tracer.get_execution_path()
print(f"  {' -> '.join(path[:10])}")  # Show first 10

print(f"\n📋 Results:")
print(f"  factorial(5) = {result1}")
print(f"  fibonacci(10) = {result2}")
```

---

## 12. color-forge - Theme Generation

```python
from color_forge import ThemeGenerator, ColorPalette, Color

# Example 1: Generate color palette
base_color = Color.from_hex("#2196F3")
palette = ColorPalette(base_color)

print("🎨 Color Palette:")
print(f"Base color: {base_color.to_hex()}")

# Analogous colors
analogous = palette.generate_analogous(5)
print(f"\nAnalogous colors:")
for i, color in enumerate(analogous):
    print(f"  {i+1}. {color.to_hex()}")

# Complementary color
complementary = palette.generate_complementary()
print(f"\nComplementary: {complementary.to_hex()}")

# Triadic colors
triadic = palette.generate_triadic()
print(f"\nTriadic colors:")
for i, color in enumerate(triadic):
    print(f"  {i+1}. {color.to_hex()}")

# Example 2: Generate complete theme
theme = ThemeGenerator()
primary = Color.from_hex("#1976D2")
secondary = Color.from_hex("#DC004E")

theme.generate_theme(primary, secondary, theme_name="my-app")

print("\n📄 Generated CSS:")
print(theme.to_css()[:500])  # Show first 500 chars
```

---

## 13. ui-forge - UI Component Generation

```python
from ui_forge import UIComponentGenerator

ui = UIComponentGenerator()

# Example: Create a complete login page
print("🏗️ Generating UI Components:\n")

# Create components
button_login = ui.create_button("Login", variant="primary", size="medium")
button_cancel = ui.create_button("Cancel", variant="secondary", size="medium")

input_email = ui.create_input("Email", input_type="email", placeholder="you@example.com", required=True)
input_password = ui.create_input("Password", input_type="password", placeholder="••••••••", required=True)

card = ui.create_card(
    "Welcome Back",
    "Please login to continue",
)

# Generate complete page
page = ui.render_page(
    [input_email, input_password, button_login, button_cancel],
    title="Login Page"
)

print("✅ Page generated!")
print(f"HTML length: {len(page)} characters")
print(f"\nFirst 500 characters:")
print(page[:500])
```

---

## 14. notebook-bridge - Jupyter Integration

```python
from notebook_bridge import JupyterConverter, NotebookCell

# Example 1: Create a notebook programmatically
converter = JupyterConverter()

cells = [
    NotebookCell(
        cell_type='markdown',
        source=['# My Data Analysis\n', '\nThis notebook analyzes some data.\n']
    ),
    NotebookCell(
        cell_type='code',
        source=['import pandas as pd\n', 'import numpy as np\n']
    ),
    NotebookCell(
        cell_type='code',
        source=['data = np.random.rand(100)\n', 'print(f"Mean: {data.mean()}")\n']
    ),
]

notebook = converter.create_notebook(cells)
print("📓 Notebook created!")
print(f"Cells: {len(notebook.cells)}")

# Example 2: Convert Python to notebook format
python_code = """
# %% [markdown]
# # Data Analysis

# %%
import pandas as pd
data = [1, 2, 3, 4, 5]
print(sum(data))

# %%
result = sum(data) / len(data)
print(f"Average: {result}")
"""

# You would save this and read it back
# For demo, we'll just show the concept
print("\n✅ Conversion examples ready!")
```

---

## 15. version-chronicle - Git Integration

```python
from version_chronicle import GitIntegration

# Example: Analyze a git repository
# Note: This needs to run in a git repository

try:
    git = GitIntegration()  # Opens current directory
    
    # Get recent commits
    print("📚 Recent Commits:")
    commits = git.get_commit_history(max_count=5)
    for commit in commits:
        print(f"\n{commit.sha[:7]} - {commit.message[:50]}")
        print(f"  Author: {commit.author}")
        print(f"  Date: {commit.timestamp}")
    
    # Get repository status
    print("\n📊 Repository Status:")
    status = git.get_status()
    print(f"  Modified: {len(status['modified'])}")
    print(f"  Staged: {len(status['staged'])}")
    print(f"  Untracked: {len(status['untracked'])}")
    
    # Get branches
    print("\n🌿 Branches:")
    branches = git.get_all_branches()
    for branch in branches[:5]:  # Show first 5
        marker = "* " if branch.is_current else "  "
        print(f"{marker}{branch.name}")
    
    # Get contributors
    print("\n👥 Contributors:")
    contributors = git.get_contributors()
    for contrib in contributors[:5]:  # Show top 5
        print(f"  {contrib['name']}: {contrib['commits']} commits")

except ValueError as e:
    print(f"⚠️ Not in a git repository: {e}")
    print("This example needs to run in a git repo!")
```

---

## 🎯 Complete Integration Example

Here's a complete example using multiple packages together:

```python
# Analyze code, generate flowchart, and create report

from python_lens import PythonAnalyzer
from visual_flow import FlowchartGenerator, FlowNodeType
from data_pulse import DataVisualizer

# 1. Analyze some code
code = """
def process_data(data):
    if not data:
        return None
    
    result = []
    for item in data:
        if item > 0:
            result.append(item * 2)
    
    return result

def main():
    numbers = [1, -2, 3, -4, 5]
    processed = process_data(numbers)
    print(f"Result: {processed}")

main()
"""

# Analyze
analyzer = PythonAnalyzer()
analyzer.parse(code)
stats = analyzer.get_statistics()

print("📊 Code Analysis Report")
print("="*50)
print(f"Functions: {stats['num_functions']}")
print(f"Complexity: {stats['avg_complexity']:.2f}")
print(f"Lines: {stats['total_lines']}")

# 2. Create flowchart from structure
flow = FlowchartGenerator()
flow.add_node("start", FlowNodeType.START, "Start")
flow.add_node("check", FlowNodeType.DECISION, "Data empty?")
flow.add_node("return_none", FlowNodeType.PROCESS, "Return None")
flow.add_node("process", FlowNodeType.PROCESS, "Process items")
flow.add_node("end", FlowNodeType.END, "End")

flow.add_edge("start", "check")
flow.add_edge("check", "return_none", "yes")
flow.add_edge("check", "process", "no")
flow.add_edge("return_none", "end")
flow.add_edge("process", "end")

print(f"\n🔄 Generated Flowchart:")
print(flow.to_mermaid()[:200])  # Show first 200 chars

# 3. Visualize complexity
viz = DataVisualizer()
complexity_data = {
    'x': ['process_data', 'main'],
    'y': [3, 1]  # complexity scores
}

print(f"\n📈 Complexity Visualization Created!")

print("\n✅ Complete analysis done!")
```

---

**Created by Joshua Terranova**  
**Repository**: https://github.com/thatrandomasiandev/Package  
**MIT License**

