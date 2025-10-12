export interface Tab {
  id: string;
  label: string;
  content: string;
}

export interface TabsProps {
  tabs: Tab[];
  defaultTab?: string;
}

export class Tabs {
  render(props: TabsProps): string {
    const { tabs, defaultTab } = props;
    const activeTab = defaultTab || tabs[0]?.id;
    
    return `
      <div class="tabs-container">
        <div class="tabs-header">
          ${tabs.map(tab => `
            <button 
              class="tab-button ${tab.id === activeTab ? 'active' : ''}" 
              data-tab="${tab.id}"
              onclick="switchTab('${tab.id}')"
            >
              ${tab.label}
            </button>
          `).join('')}
        </div>
        <div class="tabs-content">
          ${tabs.map(tab => `
            <div class="tab-panel ${tab.id === activeTab ? 'active' : ''}" data-panel="${tab.id}">
              ${tab.content}
            </div>
          `).join('')}
        </div>
      </div>
      
      <script>
        function switchTab(tabId) {
          document.querySelectorAll('.tab-button').forEach(btn => {
            btn.classList.remove('active');
          });
          document.querySelectorAll('.tab-panel').forEach(panel => {
            panel.classList.remove('active');
          });
          
          document.querySelector(\`[data-tab="\${tabId}"]\`).classList.add('active');
          document.querySelector(\`[data-panel="\${tabId}"]\`).classList.add('active');
        }
      </script>
    `;
  }

  getStyles(): string {
    return `
      .tabs-container {
        border: 1px solid #dee2e6;
        border-radius: 8px;
        overflow: hidden;
      }
      
      .tabs-header {
        display: flex;
        background: #f8f9fa;
        border-bottom: 1px solid #dee2e6;
      }
      
      .tab-button {
        padding: 12px 24px;
        background: none;
        border: none;
        border-bottom: 2px solid transparent;
        cursor: pointer;
        font-weight: 500;
        transition: all 0.2s;
      }
      
      .tab-button:hover {
        background: rgba(0, 0, 0, 0.05);
      }
      
      .tab-button.active {
        border-bottom-color: #0066cc;
        color: #0066cc;
      }
      
      .tabs-content {
        padding: 16px;
      }
      
      .tab-panel {
        display: none;
      }
      
      .tab-panel.active {
        display: block;
      }
    `;
  }
}

