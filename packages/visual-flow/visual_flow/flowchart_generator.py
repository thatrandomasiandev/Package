"""
Production Flowchart Generation
Original implementation by Joshua Terranova
"""

from typing import List, Dict, Optional, Any, Literal
from dataclasses import dataclass
from enum import Enum


class FlowNodeType(Enum):
    """Types of flowchart nodes"""
    START = "start"
    END = "end"
    PROCESS = "process"
    DECISION = "decision"
    INPUT_OUTPUT = "io"
    SUBPROCESS = "subprocess"
    LOOP = "loop"
    FUNCTION_CALL = "function_call"


@dataclass
class FlowNode:
    """A node in a flowchart"""
    id: str
    type: FlowNodeType
    label: str
    properties: Optional[Dict[str, Any]] = None


@dataclass
class FlowEdge:
    """An edge in a flowchart"""
    source: str
    target: str
    label: Optional[str] = None


class FlowchartGenerator:
    """
    Production flowchart generator with multiple output formats
    """
    
    def __init__(self):
        self.nodes: List[FlowNode] = []
        self.edges: List[FlowEdge] = []
    
    def add_node(self, id: str, type: FlowNodeType, label: str, properties: Optional[Dict[str, Any]] = None):
        """Add a node to the flowchart"""
        self.nodes.append(FlowNode(id=id, type=type, label=label, properties=properties))
    
    def add_edge(self, source: str, target: str, label: Optional[str] = None):
        """Add an edge to the flowchart"""
        self.edges.append(FlowEdge(source=source, target=target, label=label))
    
    def clear(self):
        """Clear all nodes and edges"""
        self.nodes = []
        self.edges = []
    
    def to_mermaid(self) -> str:
        """
        Generate Mermaid.js flowchart syntax
        
        Returns:
            Mermaid flowchart string
        """
        lines = ["flowchart TD"]
        
        # Add nodes
        for node in self.nodes:
            node_def = f"    {node.id}"
            
            if node.type == FlowNodeType.START:
                node_def += f"([{node.label}])"
            elif node.type == FlowNodeType.END:
                node_def += f"([{node.label}])"
            elif node.type == FlowNodeType.DECISION:
                node_def += f"{{{{{node.label}}}}}"
            elif node.type == FlowNodeType.INPUT_OUTPUT:
                node_def += f"[/{node.label}/]"
            elif node.type == FlowNodeType.SUBPROCESS:
                node_def += f"[[{node.label}]]"
            elif node.type == FlowNodeType.LOOP:
                node_def += f"{{{{{node.label}}}}}"
            else:  # PROCESS or FUNCTION_CALL
                node_def += f"[{node.label}]"
            
            lines.append(node_def)
        
        # Add edges
        for edge in self.edges:
            if edge.label:
                edge_def = f"    {edge.source} -->|{edge.label}| {edge.target}"
            else:
                edge_def = f"    {edge.source} --> {edge.target}"
            lines.append(edge_def)
        
        return "\n".join(lines)
    
    def to_graphviz(self) -> str:
        """
        Generate Graphviz DOT syntax
        
        Returns:
            DOT format string
        """
        lines = ["digraph Flowchart {"]
        lines.append("    rankdir=TD;")
        lines.append("    node [fontname=\"Arial\"];")
        
        # Add nodes
        for node in self.nodes:
            shape = "box"
            if node.type in [FlowNodeType.START, FlowNodeType.END]:
                shape = "oval"
            elif node.type == FlowNodeType.DECISION:
                shape = "diamond"
            elif node.type == FlowNodeType.INPUT_OUTPUT:
                shape = "parallelogram"
            elif node.type == FlowNodeType.SUBPROCESS:
                shape = "doubleoctagon"
            
            label = node.label.replace('"', '\\"')
            lines.append(f'    {node.id} [label="{label}", shape={shape}];')
        
        # Add edges
        for edge in self.edges:
            if edge.label:
                label = edge.label.replace('"', '\\"')
                lines.append(f'    {edge.source} -> {edge.target} [label="{label}"];')
            else:
                lines.append(f'    {edge.source} -> {edge.target};')
        
        lines.append("}")
        return "\n".join(lines)
    
    def to_plantuml(self) -> str:
        """
        Generate PlantUML activity diagram syntax
        
        Returns:
            PlantUML string
        """
        lines = ["@startuml"]
        lines.append("start")
        
        # Track visited nodes to avoid duplicates
        visited = set()
        
        def traverse(node_id: str, indent: int = 0):
            """Recursively traverse the flowchart"""
            if node_id in visited:
                return
            visited.add(node_id)
            
            node = next((n for n in self.nodes if n.id == node_id), None)
            if not node:
                return
            
            prefix = "  " * indent
            
            if node.type == FlowNodeType.DECISION:
                lines.append(f"{prefix}if ({node.label}) then (yes)")
                # Find yes/no branches
                yes_edges = [e for e in self.edges if e.source == node_id and e.label and 'yes' in e.label.lower()]
                no_edges = [e for e in self.edges if e.source == node_id and e.label and 'no' in e.label.lower()]
                
                for edge in yes_edges:
                    traverse(edge.target, indent + 1)
                
                lines.append(f"{prefix}else (no)")
                for edge in no_edges:
                    traverse(edge.target, indent + 1)
                
                lines.append(f"{prefix}endif")
            elif node.type == FlowNodeType.LOOP:
                lines.append(f"{prefix}while ({node.label})")
                # Find loop body edges
                for edge in self.edges:
                    if edge.source == node_id:
                        traverse(edge.target, indent + 1)
                lines.append(f"{prefix}endwhile")
            else:
                lines.append(f"{prefix}:{node.label};")
                # Follow edges
                for edge in self.edges:
                    if edge.source == node_id:
                        traverse(edge.target, indent)
        
        # Start from START nodes
        start_nodes = [n for n in self.nodes if n.type == FlowNodeType.START]
        if start_nodes:
            for edge in self.edges:
                if edge.source == start_nodes[0].id:
                    traverse(edge.target)
        else:
            # No explicit start node, start from first node
            if self.nodes:
                traverse(self.nodes[0].id)
        
        lines.append("stop")
        lines.append("@enduml")
        return "\n".join(lines)
    
    def to_json(self) -> str:
        """
        Generate JSON representation
        
        Returns:
            JSON string
        """
        import json
        
        data = {
            "nodes": [
                {
                    "id": node.id,
                    "type": node.type.value,
                    "label": node.label,
                    "properties": node.properties or {}
                }
                for node in self.nodes
            ],
            "edges": [
                {
                    "source": edge.source,
                    "target": edge.target,
                    "label": edge.label
                }
                for edge in self.edges
            ]
        }
        
        return json.dumps(data, indent=2)
    
    def from_ast(self, ast_nodes: List[Dict[str, Any]]):
        """
        Generate flowchart from AST nodes
        
        Args:
            ast_nodes: List of AST node dictionaries
        """
        self.clear()
        
        # Add start node
        self.add_node("start", FlowNodeType.START, "Start")
        
        last_node_id = "start"
        node_counter = 0
        
        for ast_node in ast_nodes:
            node_type = ast_node.get('type', '')
            
            if node_type == 'FunctionDeclaration':
                node_id = f"func_{node_counter}"
                node_counter += 1
                self.add_node(node_id, FlowNodeType.FUNCTION_CALL, f"Function: {ast_node.get('name', 'unknown')}")
                self.add_edge(last_node_id, node_id)
                last_node_id = node_id
            
            elif node_type == 'IfStatement':
                node_id = f"if_{node_counter}"
                node_counter += 1
                self.add_node(node_id, FlowNodeType.DECISION, "Condition")
                self.add_edge(last_node_id, node_id)
                
                # True branch
                then_id = f"then_{node_counter}"
                node_counter += 1
                self.add_node(then_id, FlowNodeType.PROCESS, "True branch")
                self.add_edge(node_id, then_id, "yes")
                
                # False branch
                else_id = f"else_{node_counter}"
                node_counter += 1
                self.add_node(else_id, FlowNodeType.PROCESS, "False branch")
                self.add_edge(node_id, else_id, "no")
                
                last_node_id = then_id  # Continue from true branch
            
            elif node_type in ['ForLoop', 'WhileLoop']:
                node_id = f"loop_{node_counter}"
                node_counter += 1
                self.add_node(node_id, FlowNodeType.LOOP, f"{node_type}")
                self.add_edge(last_node_id, node_id)
                
                body_id = f"body_{node_counter}"
                node_counter += 1
                self.add_node(body_id, FlowNodeType.PROCESS, "Loop body")
                self.add_edge(node_id, body_id)
                self.add_edge(body_id, node_id, "repeat")
                
                last_node_id = node_id
            
            else:
                # Generic process node
                node_id = f"process_{node_counter}"
                node_counter += 1
                label = ast_node.get('name', node_type)
                self.add_node(node_id, FlowNodeType.PROCESS, label)
                self.add_edge(last_node_id, node_id)
                last_node_id = node_id
        
        # Add end node
        self.add_node("end", FlowNodeType.END, "End")
        self.add_edge(last_node_id, "end")
    
    def to_html(self, format: Literal['mermaid', 'graphviz'] = 'mermaid') -> str:
        """
        Generate HTML with embedded flowchart
        
        Args:
            format: Output format ('mermaid' or 'graphviz')
        
        Returns:
            HTML string
        """
        if format == 'mermaid':
            diagram_code = self.to_mermaid()
            html = f"""<!DOCTYPE html>
<html>
<head>
    <script src="https://cdn.jsdelivr.net/npm/mermaid/dist/mermaid.min.js"></script>
    <script>mermaid.initialize({{ startOnLoad: true }});</script>
</head>
<body>
    <div class="mermaid">
{diagram_code}
    </div>
</body>
</html>"""
        else:
            dot_code = self.to_graphviz()
            # For Graphviz, we need viz.js or similar
            html = f"""<!DOCTYPE html>
<html>
<head>
    <script src="https://unpkg.com/@viz-js/viz/lib/viz-standalone.js"></script>
</head>
<body>
    <div id="graph"></div>
    <script>
        Viz.instance().then(function(viz) {{
            var svg = viz.renderSVGElement(`{dot_code}`);
            document.getElementById("graph").appendChild(svg);
        }});
    </script>
</body>
</html>"""
        
        return html

