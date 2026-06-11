const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'filament.html');
let content = fs.readFileSync(filePath, 'utf8');

const settingsButton = `
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
                    <label class="block text-sm font-medium text-gray-700 mb-2">网站名称</label>
                    <input type="text" id="siteNameInput" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" placeholder="请输入网站名称">
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
                
                <div class="flex justify-end">
                    <button id="saveSettings" class="px-4 py-2 bg-primary text-white rounded-lg hover:bg-opacity-90 transition-colors">
                        保存设置
                    </button>
                </div>
            </div>
        </div>
`;

const scriptTag = '<script src="settings.js"></script>';

content = content.replace('    <div id="addFilamentModal"', settingsButton + '\n    <div id="addFilamentModal"');

content = content.replace('<script>', scriptTag + '\n    <script>');

content = content.replace('updateSiteName();\n            loadSettings();', 'initPageSettings();\n            loadSettings();');

fs.writeFileSync(filePath, content, 'utf8');
console.log('filament.html updated successfully');
process.exit(0);