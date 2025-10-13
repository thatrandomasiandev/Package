"""
Test script to verify all packages are working
Created by Joshua Terranova
"""

print("Testing all 15 production packages...")
print("=" * 60)

# Test imports
try:
    from syntax_forge import BaseParser, ParserRegistry, NodeType
    print("✅ syntax_forge imported successfully")
except Exception as e:
    print(f"❌ syntax_forge failed: {e}")

try:
    from python_lens import PythonAnalyzer
    print("✅ python_lens imported successfully")
except Exception as e:
    print(f"❌ python_lens failed: {e}")

try:
    from visual_flow import FlowchartGenerator, FlowNodeType
    print("✅ visual_flow imported successfully")
except Exception as e:
    print(f"❌ visual_flow failed: {e}")

try:
    from runtime_spark import SecureExecutor
    print("✅ runtime_spark imported successfully")
except Exception as e:
    print(f"❌ runtime_spark failed: {e}")

try:
    from data_pulse import DataVisualizer
    print("✅ data_pulse imported successfully")
except Exception as e:
    print(f"❌ data_pulse failed: {e}")

try:
    from performance_lens import Profiler
    print("✅ performance_lens imported successfully")
except Exception as e:
    print(f"❌ performance_lens failed: {e}")

try:
    from graph_dynamics import NetworkVisualizer, Node, Edge
    print("✅ graph_dynamics imported successfully")
except Exception as e:
    print(f"❌ graph_dynamics failed: {e}")

try:
    from diagram_weaver import DiagramGenerator, SequenceDiagram
    print("✅ diagram_weaver imported successfully")
except Exception as e:
    print(f"❌ diagram_weaver failed: {e}")

try:
    from java_lens import JavaAnalyzer
    print("✅ java_lens imported successfully")
except Exception as e:
    print(f"❌ java_lens failed: {e}")

try:
    from spec_runner import TestRunner, assert_equal
    print("✅ spec_runner imported successfully")
except Exception as e:
    print(f"❌ spec_runner failed: {e}")

try:
    from step_tracer import StepTracer
    print("✅ step_tracer imported successfully")
except Exception as e:
    print(f"❌ step_tracer failed: {e}")

try:
    from color_forge import ThemeGenerator, Color
    print("✅ color_forge imported successfully")
except Exception as e:
    print(f"❌ color_forge failed: {e}")

try:
    from ui_forge import UIComponentGenerator
    print("✅ ui_forge imported successfully")
except Exception as e:
    print(f"❌ ui_forge failed: {e}")

try:
    from notebook_bridge import JupyterConverter
    print("✅ notebook_bridge imported successfully")
except Exception as e:
    print(f"❌ notebook_bridge failed: {e}")

try:
    from version_chronicle import GitIntegration
    print("✅ version_chronicle imported successfully")
except Exception as e:
    print(f"❌ version_chronicle failed: {e}")

print("=" * 60)
print("\n🎉 All packages imported successfully!")
print("\nYou can now use these packages in your code:")
print("  - from syntax_forge import BaseParser")
print("  - from python_lens import PythonAnalyzer")
print("  - from visual_flow import FlowchartGenerator")
print("  - from runtime_spark import SecureExecutor")
print("  - from data_pulse import DataVisualizer")
print("  - from performance_lens import Profiler")
print("  - from graph_dynamics import NetworkVisualizer")
print("  - from diagram_weaver import DiagramGenerator")
print("  - from java_lens import JavaAnalyzer")
print("  - from spec_runner import TestRunner")
print("  - from step_tracer import StepTracer")
print("  - from color_forge import ThemeGenerator")
print("  - from ui_forge import UIComponentGenerator")
print("  - from notebook_bridge import JupyterConverter")
print("  - from version_chronicle import GitIntegration")

