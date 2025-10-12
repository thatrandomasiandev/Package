/**
 * Code snippets management for Code Lab
 * Original implementation by Joshua Terranova
 */

export interface Snippet {
  id: string;
  name: string;
  description: string;
  language: string;
  code: string;
  tags: string[];
}

export class SnippetManager {
  private snippets: Map<string, Snippet> = new Map();

  add(snippet: Snippet): void {
    this.snippets.set(snippet.id, snippet);
  }

  get(id: string): Snippet | undefined {
    return this.snippets.get(id);
  }

  search(query: string): Snippet[] {
    const lowerQuery = query.toLowerCase();
    return Array.from(this.snippets.values()).filter(snippet =>
      snippet.name.toLowerCase().includes(lowerQuery) ||
      snippet.description.toLowerCase().includes(lowerQuery) ||
      snippet.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
    );
  }

  getByLanguage(language: string): Snippet[] {
    return Array.from(this.snippets.values()).filter(
      snippet => snippet.language === language
    );
  }

  delete(id: string): boolean {
    return this.snippets.delete(id);
  }

  getAll(): Snippet[] {
    return Array.from(this.snippets.values());
  }
}
