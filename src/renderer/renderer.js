const { ipcRenderer } = require('electron');

class ClipboardManager {
    constructor() {
        this.clipboardHistory = [];
        this.filteredHistory = [];
        this.selectedIndex = -1;
        this.searchTerm = '';
        
        this.initializeElements();
        this.bindEvents();
        this.loadClipboardHistory();
    }

    initializeElements() {
        this.clipboardList = document.getElementById('clipboard-list');
        this.emptyState = document.getElementById('empty-state');
        this.searchInput = document.getElementById('search-input');
        this.clearAllBtn = document.getElementById('clear-all');
        this.clearAllTextBtn = document.getElementById('clear-all-text');
    }

    bindEvents() {
        // Search functionality
        this.searchInput.addEventListener('input', (e) => {
            this.searchTerm = e.target.value.toLowerCase();
            this.filterAndRender();
        });

        // Clear all button
        this.clearAllBtn.addEventListener('click', () => {
            this.clearAllHistory();
        });

        // Clear all text button
        this.clearAllTextBtn.addEventListener('click', () => {
            this.clearAllHistory();
        });

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            this.handleKeyboardNavigation(e);
        });

        // Listen for clipboard updates from main process
        ipcRenderer.on('clipboard-updated', (event, history) => {
            this.clipboardHistory = history;
            this.filterAndRender();
        });
    }

    async loadClipboardHistory() {
        try {
            this.clipboardHistory = await ipcRenderer.invoke('get-clipboard-history');
            this.filterAndRender();
        } catch (error) {
            console.error('Failed to load clipboard history:', error);
        }
    }

    filterAndRender() {
        if (this.searchTerm) {
            this.filteredHistory = this.clipboardHistory.filter(item => 
                item.content.toLowerCase().includes(this.searchTerm)
            );
        } else {
            this.filteredHistory = [...this.clipboardHistory];
        }
        
        this.render();
    }

    render() {
        if (this.filteredHistory.length === 0) {
            this.showEmptyState();
        } else {
            this.hideEmptyState();
            this.renderClipboardItems();
        }
    }

    showEmptyState() {
        this.emptyState.style.display = 'flex';
        this.clipboardList.innerHTML = '';
    }

    hideEmptyState() {
        this.emptyState.style.display = 'none';
    }

    renderClipboardItems() {
        this.clipboardList.innerHTML = '';
        
        this.filteredHistory.forEach((item, index) => {
            const itemElement = this.createClipboardItemElement(item, index);
            this.clipboardList.appendChild(itemElement);
        });
    }

    createClipboardItemElement(item, index) {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'clipboard-item';
        itemDiv.dataset.index = index;
        itemDiv.dataset.id = item.id;

        const timeAgo = this.getTimeAgo(item.timestamp);
        
        itemDiv.innerHTML = `
            <div class="clipboard-content">
                <div class="clipboard-text">${this.escapeHtml(item.preview)}</div>
                <div class="clipboard-meta">
                    <span class="clipboard-time">${timeAgo}</span>
                    <span class="clipboard-type">${item.type}</span>
                </div>
            </div>
            <div class="clipboard-actions">
                <button class="btn-action delete-btn" title="Delete item" data-item-id="${item.id}">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/>
                    </svg>
                </button>
            </div>
        `;

        // Click to paste
        itemDiv.addEventListener('click', () => {
            this.pasteItem(item.id);
        });

        // Double click to copy to clipboard without pasting
        itemDiv.addEventListener('dblclick', (e) => {
            e.preventDefault();
            this.copyToClipboard(item.content);
        });

        // Add event listener for delete button
        const deleteBtn = itemDiv.querySelector('.delete-btn');
        deleteBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.deleteItem(item.id);
        });

        return itemDiv;
    }

    async pasteItem(itemId) {
        try {
            // Notify that we're pasting from the manager
            ipcRenderer.send('paste-from-manager');
            await ipcRenderer.invoke('paste-item', itemId);
            // Don't move the item to top - just paste it
        } catch (error) {
            console.error('Failed to paste item:', error);
        }
    }

    async deleteItem(itemId) {
        try {
            this.clipboardHistory = await ipcRenderer.invoke('delete-item', itemId);
            this.filterAndRender();
        } catch (error) {
            console.error('Failed to delete item:', error);
        }
    }

    async clearAllHistory() {
        if (confirm('Are you sure you want to clear all clipboard history?')) {
            try {
                // Clear from main process
                await ipcRenderer.invoke('clear-history');
                
                // Clear local state
                this.clipboardHistory = [];
                this.filteredHistory = [];
                this.searchTerm = '';
                this.searchInput.value = '';
                
                // Update UI
                this.render();
                
                // Show success message
                this.showToast('All clipboard history cleared');
                
                // Hide window after a short delay
                setTimeout(() => {
                    ipcRenderer.send('hide-window');
                }, 1000);
            } catch (error) {
                console.error('Failed to clear history:', error);
                this.showToast('Failed to clear history');
            }
        }
    }

    copyToClipboard(text) {
        navigator.clipboard.writeText(text).then(() => {
            this.showToast('Copied to clipboard');
        }).catch(err => {
            console.error('Failed to copy to clipboard:', err);
        });
    }

    handleKeyboardNavigation(e) {
        const items = this.clipboardList.querySelectorAll('.clipboard-item');
        
        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                this.selectedIndex = Math.min(this.selectedIndex + 1, items.length - 1);
                this.updateSelection(items);
                break;
                
            case 'ArrowUp':
                e.preventDefault();
                this.selectedIndex = Math.max(this.selectedIndex - 1, -1);
                this.updateSelection(items);
                break;
                
            case 'Enter':
                e.preventDefault();
                if (this.selectedIndex >= 0 && items[this.selectedIndex]) {
                    const itemId = parseInt(items[this.selectedIndex].dataset.id);
                    this.pasteItem(itemId);
                }
                break;
                
            case 'Escape':
                e.preventDefault();
                this.selectedIndex = -1;
                this.updateSelection(items);
                break;
                
            case 'Delete':
                e.preventDefault();
                if (this.selectedIndex >= 0 && items[this.selectedIndex]) {
                    const itemId = parseInt(items[this.selectedIndex].dataset.id);
                    this.deleteItem(itemId);
                }
                break;
        }
    }

    updateSelection(items) {
        items.forEach((item, index) => {
            if (index === this.selectedIndex) {
                item.classList.add('selected');
                item.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            } else {
                item.classList.remove('selected');
            }
        });
    }

    getTimeAgo(timestamp) {
        const now = Date.now();
        const diff = now - timestamp;
        
        const seconds = Math.floor(diff / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);
        
        if (days > 0) {
            return `${days} day${days > 1 ? 's' : ''} ago`;
        } else if (hours > 0) {
            return `${hours} hour${hours > 1 ? 's' : ''} ago`;
        } else if (minutes > 0) {
            return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
        } else {
            return 'Just now';
        }
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    showToast(message) {
        // Create toast element
        const toast = document.createElement('div');
        toast.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: rgba(0, 0, 0, 0.8);
            color: white;
            padding: 12px 20px;
            border-radius: 6px;
            font-size: 14px;
            z-index: 1000;
            animation: slideIn 0.3s ease;
        `;
        toast.textContent = message;
        
        // Add animation styles
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
        `;
        document.head.appendChild(style);
        
        document.body.appendChild(toast);
        
        // Remove after 3 seconds
        setTimeout(() => {
            toast.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => {
                document.body.removeChild(toast);
            }, 300);
        }, 3000);
    }
}

// Initialize the clipboard manager
const clipboardManager = new ClipboardManager();
window.clipboardManager = clipboardManager; // Make it globally accessible for onclick handlers 