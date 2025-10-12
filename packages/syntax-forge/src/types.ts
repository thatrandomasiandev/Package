/**
 * Core AST Node Types
 */

export enum NodeType {
  Program = 'Program',
  FunctionDeclaration = 'FunctionDeclaration',
  ClassDeclaration = 'ClassDeclaration',
  MethodDeclaration = 'MethodDeclaration',
  VariableDeclaration = 'VariableDeclaration',
  IfStatement = 'IfStatement',
  WhileLoop = 'WhileLoop',
  ForLoop = 'ForLoop',
  ReturnStatement = 'ReturnStatement',
  ExpressionStatement = 'ExpressionStatement',
  BlockStatement = 'BlockStatement',
  CallExpression = 'CallExpression',
  Identifier = 'Identifier',
  Literal = 'Literal',
  BinaryExpression = 'BinaryExpression',
  AssignmentExpression = 'AssignmentExpression',
  ImportDeclaration = 'ImportDeclaration',
  ExportDeclaration = 'ExportDeclaration',
  TryStatement = 'TryStatement',
  CatchClause = 'CatchClause',
  ThrowStatement = 'ThrowStatement',
  SwitchStatement = 'SwitchStatement',
  Comment = 'Comment',
}

export interface SourceLocation {
  line: number;
  column: number;
}

export interface SourceRange {
  start: SourceLocation;
  end: SourceLocation;
}

export interface BaseNode {
  type: NodeType;
  loc?: SourceRange;
  range?: [number, number];
  raw?: string;
}

export interface Program extends BaseNode {
  type: NodeType.Program;
  body: ASTNode[];
  sourceType?: 'script' | 'module';
}

export interface FunctionDeclaration extends BaseNode {
  type: NodeType.FunctionDeclaration;
  name: string;
  params: Parameter[];
  body: BlockStatement;
  async?: boolean;
  generator?: boolean;
  returnType?: string;
}

export interface ClassDeclaration extends BaseNode {
  type: NodeType.ClassDeclaration;
  name: string;
  superClass?: string;
  body: MethodDeclaration[];
  implements?: string[];
}

export interface MethodDeclaration extends BaseNode {
  type: NodeType.MethodDeclaration;
  name: string;
  params: Parameter[];
  body: BlockStatement;
  static?: boolean;
  async?: boolean;
  visibility?: 'public' | 'private' | 'protected';
}

export interface VariableDeclaration extends BaseNode {
  type: NodeType.VariableDeclaration;
  name: string;
  kind: 'var' | 'let' | 'const';
  init?: ASTNode;
  typeAnnotation?: string;
}

export interface IfStatement extends BaseNode {
  type: NodeType.IfStatement;
  test: ASTNode;
  consequent: ASTNode;
  alternate?: ASTNode;
}

export interface WhileLoop extends BaseNode {
  type: NodeType.WhileLoop;
  test: ASTNode;
  body: ASTNode;
}

export interface ForLoop extends BaseNode {
  type: NodeType.ForLoop;
  init?: ASTNode;
  test?: ASTNode;
  update?: ASTNode;
  body: ASTNode;
}

export interface BlockStatement extends BaseNode {
  type: NodeType.BlockStatement;
  body: ASTNode[];
}

export interface ReturnStatement extends BaseNode {
  type: NodeType.ReturnStatement;
  argument?: ASTNode;
}

export interface CallExpression extends BaseNode {
  type: NodeType.CallExpression;
  callee: ASTNode;
  arguments: ASTNode[];
}

export interface Parameter {
  name: string;
  type?: string;
  defaultValue?: any;
  optional?: boolean;
}

export interface Comment extends BaseNode {
  type: NodeType.Comment;
  value: string;
  kind: 'line' | 'block';
}

export type ASTNode =
  | Program
  | FunctionDeclaration
  | ClassDeclaration
  | MethodDeclaration
  | VariableDeclaration
  | IfStatement
  | WhileLoop
  | ForLoop
  | BlockStatement
  | ReturnStatement
  | CallExpression
  | BaseNode;

/**
 * Parser Configuration
 */
export interface ParserConfig {
  sourceType?: 'script' | 'module';
  ecmaVersion?: number;
  allowReturnOutsideFunction?: boolean;
  allowImportExportEverywhere?: boolean;
  locations?: boolean;
  ranges?: boolean;
  preserveParens?: boolean;
}

/**
 * Parse Result
 */
export interface ParseResult {
  ast: Program;
  errors: ParseError[];
  warnings: ParseWarning[];
  metadata: ParseMetadata;
}

export interface ParseError {
  message: string;
  location?: SourceRange;
  severity: 'error';
}

export interface ParseWarning {
  message: string;
  location?: SourceRange;
  severity: 'warning';
}

export interface ParseMetadata {
  language: string;
  parseTime: number;
  nodeCount: number;
  lineCount: number;
}

