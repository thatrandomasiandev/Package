export interface TooltipProps {
  content: string;
  text: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
}

export class Tooltip {
  render(props: TooltipProps): string {
    const { content, text, position = 'top' } = props;
    
    return `
      <span class="tooltip-wrapper" data-tooltip="${text}" data-position="${position}">
        ${content}
      </span>
    `;
  }

  getStyles(): string {
    return `
      .tooltip-wrapper {
        position: relative;
        cursor: help;
      }
      
      .tooltip-wrapper::after {
        content: attr(data-tooltip);
        position: absolute;
        background: #333;
        color: white;
        padding: 8px 12px;
        border-radius: 4px;
        font-size: 12px;
        white-space: nowrap;
        opacity: 0;
        pointer-events: none;
        transition: opacity 0.2s;
        z-index: 1000;
      }
      
      .tooltip-wrapper:hover::after {
        opacity: 1;
      }
      
      .tooltip-wrapper[data-position="top"]::after {
        bottom: 100%;
        left: 50%;
        transform: translateX(-50%) translateY(-4px);
      }
      
      .tooltip-wrapper[data-position="bottom"]::after {
        top: 100%;
        left: 50%;
        transform: translateX(-50%) translateY(4px);
      }
      
      .tooltip-wrapper[data-position="left"]::after {
        right: 100%;
        top: 50%;
        transform: translateY(-50%) translateX(-4px);
      }
      
      .tooltip-wrapper[data-position="right"]::after {
        left: 100%;
        top: 50%;
        transform: translateY(-50%) translateX(4px);
      }
    `;
  }
}

