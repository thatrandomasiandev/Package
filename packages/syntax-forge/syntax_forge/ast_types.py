"""
AST Node Types
Original implementation by Joshua Terranova
"""

from enum import Enum
from typing import List, Optional, Dict, Any
from dataclasses import dataclass, field


class NodeType(Enum):
    PROGRAM = "Program"
    FUNCTION_DECLARATION = "FunctionDeclaration"
    CLASS_DECLARATION = "ClassDeclaration"
    METHOD_DECLARATION = "MethodDeclaration"
    VARIABLE_DECLARATION = "VariableDeclaration"
    IF_STATEMENT = "IfStatement"
    WHILE_LOOP = "WhileLoop"
    FOR_LOOP = "ForLoop"
    RETURN_STATEMENT = "ReturnStatement"
    EXPRESSION_STATEMENT = "ExpressionStatement"
    BLOCK_STATEMENT = "BlockStatement"
    CALL_EXPRESSION = "CallExpression"
    IDENTIFIER = "Identifier"
    LITERAL = "Literal"


@dataclass
class SourceLocation:
    line: int
    column: int


@dataclass
class SourceRange:
    start: SourceLocation
    end: SourceLocation


@dataclass
class ASTNode:
    type: NodeType
    loc: Optional[SourceRange] = None
    metadata: Dict[str, Any] = field(default_factory=dict)


@dataclass
class Program(ASTNode):
    type: NodeType = NodeType.PROGRAM
    body: List[ASTNode] = field(default_factory=list)
    source_type: str = "module"


@dataclass
class FunctionDeclaration(ASTNode):
    type: NodeType = NodeType.FUNCTION_DECLARATION
    name: str = ""
    params: List[Dict] = field(default_factory=list)
    body: Optional[ASTNode] = None
    async_: bool = False
    generator: bool = False


@dataclass
class ClassDeclaration(ASTNode):
    type: NodeType = NodeType.CLASS_DECLARATION
    name: str = ""
    super_class: Optional[str] = None
    body: List[ASTNode] = field(default_factory=list)


@dataclass
class VariableDeclaration(ASTNode):
    type: NodeType = NodeType.VARIABLE_DECLARATION
    name: str = ""
    kind: str = "let"  # var, let, const
    init: Optional[ASTNode] = None

