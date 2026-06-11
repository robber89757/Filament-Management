const defaultMaterials = ['PLA', 'PETG', 'ABS', 'TPU', 'ASA'];
const defaultBrands = ['Matte', 'Basic', 'Silk', 'Pro', 'Plus'];
const defaultPlatforms = ['taobao', 'douyin', 'pinduoduo', 'jd'];

function initPageSettings() {
    const settingsBtn = document.getElementById('settingsBtn');
    const settingsModal = document.getElementById('settingsModal');
    const closeModal = document.getElementById('closeModal');
    const saveSettings = document.getElementById('saveSettings');
    const siteNameInput = document.getElementById('siteNameInput');
    const siteTitle = document.getElementById('siteTitle');
    
    const addPlatformBtn = document.getElementById('addPlatformType');
    const newPlatformInput = document.getElementById('newPlatformType');
    const platformTypesList = document.getElementById('platformTypesList');
    
    const savedName = localStorage.getItem('siteName') || 'Leo的百宝箱';
    if (siteTitle) {
        siteTitle.textContent = savedName;
    }
    if (siteNameInput) {
        siteNameInput.value = savedName;
    }
    
    let platforms = JSON.parse(localStorage.getItem('platforms')) || defaultPlatforms;
    
    const platformMap = {
        'taobao': '淘宝',
        'jd': '京东',
        'pinduoduo': '拼多多',
        'douyin': '抖店'
    };
    
    function renderPlatforms() {
        if (!platformTypesList) return;
        platformTypesList.innerHTML = platforms.map((platform, index) => {
            const displayName = platformMap[platform] || platform;
            return `
                <span class="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">
                    ${displayName}
                    <button onclick="removePlat(${index})" class="hover:text-red-500">
                        <i class="fa fa-times"></i>
                    </button>
                </span>
            `;
        }).join('');
    }
    
    window.removePlat = function(index) {
        platforms.splice(index, 1);
        localStorage.setItem('platforms', JSON.stringify(platforms));
        renderPlatforms();
        updatePlatSelects();
    };
    
    if (addPlatformBtn && newPlatformInput) {
        addPlatformBtn.addEventListener('click', () => {
            const newPlatform = newPlatformInput.value.trim();
            if (newPlatform && !platforms.includes(newPlatform)) {
                platforms.push(newPlatform);
                localStorage.setItem('platforms', JSON.stringify(platforms));
                newPlatformInput.value = '';
                renderPlatforms();
                updatePlatSelects();
            }
        });
        
        newPlatformInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                addPlatformBtn.click();
            }
        });
    }
    
    function updatePlatSelects() {
        const platformSelect = document.getElementById('platformSelect');
        const filterSelect = document.getElementById('salesFilterPlatform');
        
        if (!platformSelect) return;
        
        while (platformSelect.options.length > 0) {
            platformSelect.remove(0);
        }
        
        platforms.forEach(platform => {
            const displayName = platformMap[platform] || platform;
            const option = document.createElement('option');
            option.value = platform;
            option.textContent = displayName;
            platformSelect.appendChild(option);
        });
        
        if (filterSelect) {
            while (filterSelect.options.length > 1) {
                filterSelect.remove(1);
            }
            
            platforms.forEach(platform => {
                const displayName = platformMap[platform] || platform;
                const option = document.createElement('option');
                option.value = platform;
                option.textContent = displayName;
                filterSelect.appendChild(option);
            });
        }
    }
    
    renderPlatforms();
    
    if (settingsBtn && settingsModal) {
        settingsBtn.addEventListener('click', () => {
            settingsModal.classList.remove('hidden');
        });
    }
    
    if (closeModal && settingsModal) {
        closeModal.addEventListener('click', () => {
            settingsModal.classList.add('hidden');
        });
    }
    
    if (settingsModal) {
        settingsModal.addEventListener('click', (e) => {
            if (e.target === settingsModal) {
                settingsModal.classList.add('hidden');
            }
        });
    }
    
    if (saveSettings && settingsModal) {
        saveSettings.addEventListener('click', () => {
            if (siteNameInput) {
                const newName = siteNameInput.value.trim() || 'Leo的百宝箱';
                localStorage.setItem('siteName', newName);
                if (siteTitle) {
                    siteTitle.textContent = newName;
                }
            }
            alert('设置已保存！');
            settingsModal.classList.add('hidden');
        });
    }
}

function updateSiteName() {
    const siteTitle = document.getElementById('siteTitle');
    const savedName = localStorage.getItem('siteName') || 'Leo的百宝箱';
    if (siteTitle) {
        siteTitle.textContent = savedName;
    }
}