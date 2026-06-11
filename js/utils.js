const API_BASE_URL = '/api';

function showMessage(message) {
    const messageModal = document.getElementById('messageModal');
    const messageContent = document.getElementById('messageContent');
    if (!messageModal || !messageContent) return;
    
    messageContent.textContent = message;
    messageModal.classList.remove('hidden');
}

function closeMessageModal() {
    const messageModal = document.getElementById('messageModal');
    if (messageModal) {
        messageModal.classList.add('hidden');
    }
}

function initSiteTitle() {
    const siteTitle = document.getElementById('siteTitle');
    if (!siteTitle) return;
    
    const savedName = localStorage.getItem('siteName') || 'Leo的百宝箱';
    siteTitle.textContent = savedName;
}

function initSettingsModal(pageType = 'main') {
    const settingsBtn = document.getElementById('settingsBtn');
    const settingsModal = document.getElementById('settingsModal');
    const closeModal = document.getElementById('closeModal');
    const saveSettings = document.getElementById('saveSettings');
    
    if (!settingsBtn || !settingsModal) return;
    
    settingsBtn.addEventListener('click', () => {
        settingsModal.classList.remove('hidden');
    });
    
    closeModal.addEventListener('click', () => {
        settingsModal.classList.add('hidden');
    });
    
    settingsModal.addEventListener('click', (e) => {
        if (e.target === settingsModal) {
            settingsModal.classList.add('hidden');
        }
    });
    
    saveSettings.addEventListener('click', () => {
        alert('设置已保存！');
        settingsModal.classList.add('hidden');
    });
}

function createModal(modalId, title, content, buttons) {
    const modal = document.createElement('div');
    modal.id = modalId;
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
    
    const modalContent = document.createElement('div');
    modalContent.className = 'bg-white rounded-lg shadow-xl p-6 w-full max-w-md mx-4';
    
    const header = document.createElement('div');
    header.className = 'flex justify-between items-center mb-4';
    
    const titleEl = document.createElement('h3');
    titleEl.className = 'text-lg font-semibold text-dark';
    titleEl.textContent = title;
    
    const closeBtn = document.createElement('button');
    closeBtn.className = 'text-gray-500 hover:text-gray-700';
    closeBtn.innerHTML = '<i class="fa fa-times text-xl"></i>';
    closeBtn.addEventListener('click', () => {
        modal.remove();
    });
    
    header.appendChild(titleEl);
    header.appendChild(closeBtn);
    
    const contentEl = document.createElement('div');
    contentEl.innerHTML = content;
    
    const footer = document.createElement('div');
    footer.className = 'flex justify-end gap-2 mt-4';
    
    buttons.forEach(btn => {
        const button = document.createElement('button');
        button.className = btn.class || 'px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300';
        button.textContent = btn.text;
        button.addEventListener('click', btn.onClick);
        footer.appendChild(button);
    });
    
    modalContent.appendChild(header);
    modalContent.appendChild(contentEl);
    modalContent.appendChild(footer);
    modal.appendChild(modalContent);
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
        }
    });
    
    document.body.appendChild(modal);
    return modal;
}

function formatCurrency(value) {
    return '¥' + parseFloat(value || 0).toFixed(2);
}

function formatDate(dateStr) {
    try {
        return new Date(dateStr).toLocaleDateString('zh-CN');
    } catch {
        return dateStr;
    }
}

function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
}

async function fetchAPI(endpoint, options = {}) {
    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            },
            ...options
        });
        return await response.json();
    } catch (error) {
        console.error('API请求失败:', error);
        return { success: false, message: '网络错误' };
    }
}

document.addEventListener('DOMContentLoaded', () => {
    initSiteTitle();
    
    const messageModal = document.getElementById('messageModal');
    if (messageModal) {
        const closeBtn = messageModal.querySelector('button');
        if (closeBtn) {
            closeBtn.addEventListener('click', closeMessageModal);
        }
    }
});