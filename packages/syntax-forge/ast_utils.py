"""
AST Utility Functions
Original implementation by Joshua Terranova
"""

from typing import List, Callable, Optional
from .ast_types import ASTNode, NodeType, Program


def walk(node: ASTNode, callback: Callable[[ASTNode, Optional[ASTNode]], None], parent: Optional[ASTNode] = None) -> None:
    """Walk through AST nodes recursively"""
    callback(node, parent)
    
    # Traverse children based on node type
    if hasattr(node, 'body'):
        if isinstance(node.body, list):
            for child in node.body:
                walk(child, callback, node)
        elif node.body:
            walk(node.body, callback, node)


def find_nodes_by_type(ast: ASTNode, node_type: NodeType) -> List[ASTNode]:
    """Find all nodes of a specific type"""
    results = []
    
    def collect(node: ASTNode, parent: Optional[ASTNode]) -> None:
        if node.type == node_type:
            results.append(node)
    
    walk(ast, collect)
    return results


def find_node_at_line(ast: ASTNode, line: int) -> Optional[ASTNode]:
    """Find node at a specific line number"""
    result = None
    
    def check_line(node: ASTNode, parent: Optional[ASTNode]) -> None:
        nonlocal result
        if node.loc and node.loc.start.line <= line <= node.loc.end.line:
            result = node
    
    walk(ast, check_line)
    return result


def count_nodes(ast: ASTNode) -> int:
    """Count total number of nodes in AST"""
    count = 0
    
    def increment(node: ASTNode, parent: Optional[ASTNode]) -> None:
        nonlocal count
        count += 1
    
    walk(ast, increment)
    return count


def extract_metrics(ast: Program) -> dict:
    """Extract code metrics from AST"""
    functions = len(find_nodes_by_type(ast, NodeType.FUNCTION_DECLARATION))
    classes = len(find_nodes_by_type(ast, NodeType.CLASS_DECLARATION))
    variables = len(find_nodes_by_type(ast, NodeType.VARIABLE_DECLARATION))
    conditionals = len(find_nodes_by_type(ast, NodeType.IF_STATEMENT))
    loops = (len(find_nodes_by_type(ast, NodeType.WHILE_LOOP)) + 
             len(find_nodes_by_type(ast, NodeType.FOR_LOOP)))
    
    return {
        "functions": functions,
        "classes": classes,
        "variables": variables,
        "conditionals": conditionals,
        "loops": loops,
        "node_count": count_nodes(ast),
    }

