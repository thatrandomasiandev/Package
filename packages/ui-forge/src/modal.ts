export interface ModalProps {
  id: string;
  title: string;
  content: string;
  actions?: Array<{ label: string; onClick: string; variant?: string }>;
}

export class Modal {
  render(props: ModalProps): string {
    const { id, title, content, actions = [] } = props;
    
    return `
      <div class="modal-overlay" id="modal-${id}" onclick="if(event.target === this) closeModal('${id}')">
        <div class="modal-dialog">
          <div class="modal-header">
            <h2>${title}</h2>
            <button class="modal-close" onclick="closeModal('${id}')">&times;</button>
          </div>
          <div class="modal-body">
            ${content}
          </div>
          ${actions.length > 0 ? `
            <div class="modal-footer">
              ${actions.map(action => `
                <button 
                  class="btn btn-${action.variant || 'primary'}"
                  onclick="${action.onClick}"
                >
                  ${action.label}
                </button>
              `).join('')}
            </div>
          ` : ''}
        </div>
      </div>
      
      <script>
        function openModal(id) {
          document.getElementById('modal-' + id).style.display = 'flex';
        }
        
        function closeModal(id) {
          document.getElementById('modal-' + id).style.display = 'none';
        }
      </script>
    `;
  }

  getStyles(): string {
    return `
      .modal-overlay {
        display: none;
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.5);
        justify-content: center;
        align-items: center;
        z-index: 9999;
      }
      
      .modal-dialog {
        background: white;
        border-radius: 8px;
        width: 90%;
        max-width: 600px;
        max-height: 90vh;
        display: flex;
        flex-direction: column;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
      }
      
      .modal-header {
        padding: 20px;
        border-bottom: 1px solid #dee2e6;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      
      .modal-header h2 {
        margin: 0;
        font-size: 20px;
      }
      
      .modal-close {
        background: none;
        border: none;
        font-size: 28px;
        cursor: pointer;
        color: #6c757d;
      }
      
      .modal-close:hover {
        color: #000;
      }
      
      .modal-body {
        padding: 20px;
        overflow-y: auto;
      }
      
      .modal-footer {
        padding: 16px 20px;
        border-top: 1px solid #dee2e6;
        display: flex;
        justify-content: flex-end;
        gap: 8px;
      }
    `;
  }
}

