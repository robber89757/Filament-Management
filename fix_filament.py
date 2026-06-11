import re

with open('filament.html', 'r', encoding='utf-8') as f:
    content = f.read()

settings_button = '''
        <button id="settingsBtn" class="fixed bottom-4 right-4 w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white shadow-md hover:bg-opacity-90 transition-colors z-40">
            <i class="fa fa-gear"></i>
        </button>
        
        <div id="settingsModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 hidden">
            <div class="bg-white rounded-lg shadow-xl p-6 w-full max-w-md mx-4">
                <div class="flex justify-between items-center mb-4">
                    <h3 class="text-lg font-semibold text-dark">设置</h3>
                    <button id="closeModal" class="text-gray-500 hover:text-gray-700">
                        <i class="fa fa-times text-xl"></i>
                    </button>
                </div>
                
                <div class="mb-4">
                    <label class="block text-sm font-medium text-gray-700 mb-2">耗材类型管理</label>
                    <div id="materialTypesList" class="flex flex-wrap gap-2 mb-2"></div>
                    <div class="flex gap-2">
                        <input type="text" id="newMaterialType" class="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" placeholder="输入新耗材类型">
                        <button id="addMaterialType" class="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors">
                            <i class="fa fa-plus"></i>
                        </button>
                    </div>
                </div>
                
                <div class="mb-4">
                    <label class="block text-sm font-medium text-gray-700 mb-2">产品系列管理</label>
                    <div id="brandTypesList" class="flex flex-wrap gap-2 mb-2"></div>
                    <div class="flex gap-2">
                        <input type="text" id="newBrandType" class="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" placeholder="输入新产品系列">
                        <button id="addBrandType" class="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors">
                            <i class="fa fa-plus"></i>
                        </button>
                    </div>
                </div>
            </div>
        </div>
'''

content = content.replace(
    '        </main>\n    </div>',
    '        </main>\n' + settings_button + '\n    </div>'
)

init_settings = '''
        function initSettings() {
            const settingsBtn = document.getElementById('settingsBtn');
            const settingsModal = document.getElementById('settingsModal');
            const closeModal = document.getElementById('closeModal');
            const siteTitle = document.getElementById('siteTitle');
            
            const addMaterialBtn = document.getElementById('addMaterialType');
            const newMaterialInput = document.getElementById('newMaterialType');
            const materialTypesList = document.getElementById('materialTypesList');
            
            const addBrandBtn = document.getElementById('addBrandType');
            const newBrandInput = document.getElementById('newBrandType');
            const brandTypesList = document.getElementById('brandTypesList');
            
            const savedName = localStorage.getItem('siteName') || 'Leo的百宝箱';
            if (siteTitle) {
                siteTitle.textContent = savedName;
            }
            
            let materials = JSON.parse(localStorage.getItem('materials')) || ['PLA', 'PETG', 'ABS', 'TPU', 'ASA'];
            let brands = JSON.parse(localStorage.getItem('brands')) || ['Matte', 'Basic', 'Silk', 'Pro', 'Plus'];
            
            function renderMaterials() {
                if (!materialTypesList) return;
                materialTypesList.innerHTML = materials.map((mat, index) => `
                    <span class="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                        ${mat}
                        <button onclick="removeMaterial(${index})" class="hover:text-red-500">
                            <i class="fa fa-times"></i>
                        </button>
                    </span>
                `).join('');
            }
            
            function renderBrands() {
                if (!brandTypesList) return;
                brandTypesList.innerHTML = brands.map((brand, index) => `
                    <span class="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                        ${brand}
                        <button onclick="removeBrand(${index})" class="hover:text-red-500">
                            <i class="fa fa-times"></i>
                        </button>
                    </span>
                `).join('');
            }
            
            window.removeMaterial = function(index) {
                materials.splice(index, 1);
                localStorage.setItem('materials', JSON.stringify(materials));
                renderMaterials();
            };
            
            window.removeBrand = function(index) {
                brands.splice(index, 1);
                localStorage.setItem('brands', JSON.stringify(brands));
                renderBrands();
            };
            
            if (addMaterialBtn) {
                addMaterialBtn.addEventListener('click', () => {
                    const newMaterial = newMaterialInput.value.trim().toUpperCase();
                    if (newMaterial && !materials.includes(newMaterial)) {
                        materials.push(newMaterial);
                        localStorage.setItem('materials', JSON.stringify(materials));
                        newMaterialInput.value = '';
                        renderMaterials();
                    }
                });
            }
            
            if (newMaterialInput) {
                newMaterialInput.addEventListener('keypress', (e) => {
                    if (e.key === 'Enter' && addMaterialBtn) {
                        addMaterialBtn.click();
                    }
                });
            }
            
            if (addBrandBtn) {
                addBrandBtn.addEventListener('click', () => {
                    const newBrand = newBrandInput.value.trim();
                    if (newBrand && !brands.includes(newBrand)) {
                        brands.push(newBrand);
                        localStorage.setItem('brands', JSON.stringify(brands));
                        newBrandInput.value = '';
                        renderBrands();
                    }
                });
            }
            
            if (newBrandInput) {
                newBrandInput.addEventListener('keypress', (e) => {
                    if (e.key === 'Enter' && addBrandBtn) {
                        addBrandBtn.click();
                    }
                });
            }
            
            renderMaterials();
            renderBrands();
            
            if (settingsBtn) {
                settingsBtn.addEventListener('click', () => {
                    settingsModal.classList.remove('hidden');
                });
            }
            
            if (closeModal) {
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
        }
'''

default_brands = '''const defaultBrands = ['Matte', 'Basic', 'Silk', 'Pro', 'Plus'];'''
default_materials = '''const defaultMaterials = ['PLA', 'PETG', 'ABS', 'TPU', 'ASA'];'''

content = content.replace(
    default_materials,
    default_materials + '\n        ' + default_brands + '\n        ' + init_settings
)

content = content.replace(
    'updateSiteName();\n            loadSettings();',
    'initSettings();\n            loadSettings();'
)

with open('filament.html', 'w', encoding='utf-8') as f:
    f.write(content)

print('filament.html updated successfully with settings button')
