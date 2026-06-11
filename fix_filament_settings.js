const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'filament.html');
let content = fs.readFileSync(filePath, 'utf8');

const initSettingsFunction = `
        function initSettings() {
            const settingsBtn = document.getElementById('settingsBtn');
            const settingsModal = document.getElementById('settingsModal');
            const closeModal = document.getElementById('closeModal');
            
            const addMaterialBtn = document.getElementById('addMaterialType');
            const newMaterialInput = document.getElementById('newMaterialType');
            const materialTypesList = document.getElementById('materialTypesList');
            
            const addBrandBtn = document.getElementById('addBrandType');
            const newBrandInput = document.getElementById('newBrandType');
            const brandTypesList = document.getElementById('brandTypesList');
            
            let materials = JSON.parse(localStorage.getItem('materials')) || defaultMaterials;
            let brands = JSON.parse(localStorage.getItem('brands')) || defaultBrands;
            
            function renderMaterials() {
                if (!materialTypesList) return;
                materialTypesList.innerHTML = materials.map((mat, index) => \`
                    <span class="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                        \${mat}
                        <button onclick="removeMaterial(\${index})" class="hover:text-red-500">
                            <i class="fa fa-times"></i>
                        </button>
                    </span>
                \`).join('');
            }
            
            function renderBrands() {
                if (!brandTypesList) return;
                brandTypesList.innerHTML = brands.map((brand, index) => \`
                    <span class="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                        \${brand}
                        <button onclick="removeBrand(\${index})" class="hover:text-red-500">
                            <i class="fa fa-times"></i>
                        </button>
                    </span>
                \`).join('');
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
`;

content = content.replace(
    "const defaultBrands = ['Matte', 'Basic', 'Silk', 'Pro', 'Plus'];",
    "const defaultBrands = ['Matte', 'Basic', 'Silk', 'Pro', 'Plus'];" + initSettingsFunction
);

fs.writeFileSync(filePath, content, 'utf8');
console.log('Fixed filament.html - added initSettings function');
process.exit(0);