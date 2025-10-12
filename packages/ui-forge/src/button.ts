export interface ButtonProps {
  label: string;
  onClick: string;
  variant?: 'primary' | 'secondary' | 'success' | 'danger';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  icon?: string;
}

export class Button {
  render(props: ButtonProps): string {
    const { label, onClick, variant = 'primary', size = 'medium', disabled = false, icon } = props;
    
    return `
      <button 
        class="btn btn-${variant} btn-${size}" 
        onclick="${onClick}"
        ${disabled ? 'disabled' : ''}
      >
        ${icon ? `<span class="btn-icon">${icon}</span>` : ''}
        <span class="btn-label">${label}</span>
      </button>
    `;
  }

  getStyles(): string {
    return `
      .btn {
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-weight: 500;
        transition: all 0.2s;
        display: inline-flex;
        align-items: center;
        gap: 8px;
      }
      
      .btn:hover:not(:disabled) {
        transform: translateY(-1px);
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
      }
      
      .btn:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }
      
      .btn-small {
        padding: 4px 12px;
        font-size: 12px;
      }
      
      .btn-medium {
        padding: 8px 16px;
        font-size: 14px;
      }
      
      .btn-large {
        padding: 12px 24px;
        font-size: 16px;
      }
      
      .btn-primary {
        background: #0066cc;
        color: white;
      }
      
      .btn-secondary {
        background: #6c757d;
        color: white;
      }
      
      .btn-success {
        background: #28a745;
        color: white;
      }
      
      .btn-danger {
        background: #dc3545;
        color: white;
      }
    `;
  }
}

