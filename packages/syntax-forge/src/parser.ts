import { ASTNode, ParseResult, ParserConfig, Program } from './types';

/**
 * Abstract Parser Interface
 * All language-specific parsers should implement this interface
 */
export abstract class BaseParser {
  protected config: ParserConfig;

  constructor(config: ParserConfig = {}) {
    this.config = {
      sourceType: 'module',
      locations: true,
      ranges: true,
      ...config,
    };
  }

  /**
   * Parse source code into an AST
   */
  abstract parse(code: string, filename?: string): ParseResult;

  /**
   * Get supported file extensions
   */
  abstract getSupportedExtensions(): string[];

  /**
   * Get language identifier
   */
  abstract getLanguageId(): string;

  /**
   * Validate if the parser can handle this code
   */
  canParse(filename: string): boolean {
    const ext = filename.split('.').pop()?.toLowerCase();
    return ext ? this.getSupportedExtensions().includes(ext) : false;
  }

  /**
   * Update parser configuration
   */
  updateConfig(config: Partial<ParserConfig>): void {
    this.config = { ...this.config, ...config };
  }

  /**
   * Get current configuration
   */
  getConfig(): ParserConfig {
    return { ...this.config };
  }
}

/**
 * Parser Registry for managing multiple language parsers
 */
export class ParserRegistry {
  private parsers: Map<string, BaseParser> = new Map();

  /**
   * Register a parser for a specific language
   */
  register(languageId: string, parser: BaseParser): void {
    this.parsers.set(languageId.toLowerCase(), parser);
  }

  /**
   * Unregister a parser
   */
  unregister(languageId: string): boolean {
    return this.parsers.delete(languageId.toLowerCase());
  }

  /**
   * Get parser for a specific language
   */
  getParser(languageId: string): BaseParser | undefined {
    return this.parsers.get(languageId.toLowerCase());
  }

  /**
   * Get parser by filename extension
   */
  getParserByFilename(filename: string): BaseParser | undefined {
    for (const parser of this.parsers.values()) {
      if (parser.canParse(filename)) {
        return parser;
      }
    }
    return undefined;
  }

  /**
   * Get all registered languages
   */
  getRegisteredLanguages(): string[] {
    return Array.from(this.parsers.keys());
  }

  /**
   * Parse code using the appropriate parser
   */
  parse(code: string, languageId: string, filename?: string): ParseResult {
    const parser = this.getParser(languageId);
    if (!parser) {
      throw new Error(`No parser registered for language: ${languageId}`);
    }
    return parser.parse(code, filename);
  }
}

// Global parser registry instance
export const parserRegistry = new ParserRegistry();

