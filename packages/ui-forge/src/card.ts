export interface CardProps {
  title?: string;
  content: string;
  footer?: string;
  elevated?: boolean;
}

export class Card {
  render(props: CardProps): string {
    const { title, content, footer, elevated = false } = props;
    
    return `
      <div class="card ${elevated ? 'card-elevated' : ''}">
        ${title ? `<div class="card-header"><h3>${title}</h3></div>` : ''}
        <div class="card-body">${content}</div>
        ${footer ? `<div class="card-footer">${footer}</div>` : ''}
      </div>
    `;
  }

  getStyles(): string {
    return `
      .card {
        background: white;
        border-radius: 8px;
        border: 1px solid #dee2e6;
        overflow: hidden;
      }
      
      .card-elevated {
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        border: none;
      }
      
      .card-header {
        padding: 16px;
        border-bottom: 1px solid #dee2e6;
      }
      
      .card-header h3 {
        margin: 0;
        font-size: 18px;
        font-weight: 600;
      }
      
      .card-body {
        padding: 16px;
      }
      
      .card-footer {
        padding: 12px 16px;
        background: #f8f9fa;
        border-top: 1px solid #dee2e6;
      }
    `;
  }
}

