/**
 * Real-time collaboration for Code Lab
 * Original implementation by Joshua Terranova
 */

export interface CollaboratorCursor {
  userId: string;
  userName: string;
  position: { line: number; character: number };
  color: string;
}

export interface CollaborationSession {
  id: string;
  participants: string[];
  createdAt: Date;
  active: boolean;
}

export class CollaborationManager {
  private sessions: Map<string, CollaborationSession> = new Map();
  private cursors: Map<string, CollaboratorCursor> = new Map();
  private changeListeners: Array<(change: any) => void> = [];

  createSession(userId: string): CollaborationSession {
    const session: CollaborationSession = {
      id: this.generateSessionId(),
      participants: [userId],
      createdAt: new Date(),
      active: true,
    };
    
    this.sessions.set(session.id, session);
    return session;
  }

  joinSession(sessionId: string, userId: string): boolean {
    const session = this.sessions.get(sessionId);
    if (session && session.active) {
      session.participants.push(userId);
      return true;
    }
    return false;
  }

  updateCursor(userId: string, cursor: CollaboratorCursor): void {
    this.cursors.set(userId, cursor);
    this.notifyChange({ type: 'cursor', userId, cursor });
  }

  getCursors(): CollaboratorCursor[] {
    return Array.from(this.cursors.values());
  }

  onChange(listener: (change: any) => void): () => void {
    this.changeListeners.push(listener);
    return () => {
      const index = this.changeListeners.indexOf(listener);
      if (index > -1) {
        this.changeListeners.splice(index, 1);
      }
    };
  }

  private notifyChange(change: any): void {
    this.changeListeners.forEach(listener => listener(change));
  }

  private generateSessionId(): string {
    return Math.random().toString(36).substring(2, 15);
  }
}
