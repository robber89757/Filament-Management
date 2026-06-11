const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, 'spool.db');
const SUPPLIERS_DB_PATH = path.join(__dirname, 'suppliers.db');
const EXPENSE_DB_PATH = path.join(__dirname, 'expenseRecords.db');
const USAGE_DB_PATH = path.join(__dirname, 'usageRecords.db');
const SALES_DB_PATH = path.join(__dirname, 'salesRecords.db');
const EXPENSE_SETTINGS_DB_PATH = path.join(__dirname, 'expenseSettings.db');

const initDB = () => {
    if (!fs.existsSync(DB_PATH)) {
        const initialData = {
            spools: [],
            priceFormulas: {
                materialCosts: {
                    PLA: 0.05,
                    PETG: 0.06,
                    ABS: 0.055,
                    TPU: 0.08,
                    ASA: 0.075
                },
                baseFee: 5,
                hourlyRate: 10,
                electricityRate: 1.5,
                markup: 1.5
            }
        };
        fs.writeFileSync(DB_PATH, JSON.stringify(initialData, null, 2));
        console.log('耗材数据库初始化完成');
    }
    
    if (!fs.existsSync(SUPPLIERS_DB_PATH)) {
        const initialSuppliers = {
            suppliers: []
        };
        fs.writeFileSync(SUPPLIERS_DB_PATH, JSON.stringify(initialSuppliers, null, 2));
        console.log('供应商数据库初始化完成');
    }
    
    if (!fs.existsSync(EXPENSE_DB_PATH)) {
        const initialExpenses = {
            expenseRecords: []
        };
        fs.writeFileSync(EXPENSE_DB_PATH, JSON.stringify(initialExpenses, null, 2));
        console.log('费用记录数据库初始化完成');
    }
    
    if (!fs.existsSync(USAGE_DB_PATH)) {
        const initialUsage = {
            usageRecords: []
        };
        fs.writeFileSync(USAGE_DB_PATH, JSON.stringify(initialUsage, null, 2));
        console.log('使用记录数据库初始化完成');
    }
    
    if (!fs.existsSync(SALES_DB_PATH)) {
        const initialSales = {
            salesRecords: []
        };
        fs.writeFileSync(SALES_DB_PATH, JSON.stringify(initialSales, null, 2));
        console.log('销售记录数据库初始化完成');
    }
    
    if (!fs.existsSync(EXPENSE_SETTINGS_DB_PATH)) {
        const initialExpenseSettings = {
            expenseTypes: [
                { id: 'filament', label: '耗材购买' },
                { id: 'equipment', label: '设备配件' },
                { id: 'electricity', label: '电费' },
                { id: 'maintenance', label: '维护保养' },
                { id: 'other', label: '其他' }
            ],
            expenseChannels: [
                { id: 'taobao', label: '淘宝' },
                { id: 'jd', label: '京东' },
                { id: 'pinduoduo', label: '拼多多' },
                { id: 'offline', label: '线下' }
            ]
        };
        fs.writeFileSync(EXPENSE_SETTINGS_DB_PATH, JSON.stringify(initialExpenseSettings, null, 2));
        console.log('费用设置数据库初始化完成');
    }
};

const readDB = () => {
    try {
        const data = fs.readFileSync(DB_PATH, 'utf8');
        const spoolData = JSON.parse(data);
        
        const supplierData = fs.readFileSync(SUPPLIERS_DB_PATH, 'utf8');
        const suppliers = JSON.parse(supplierData);
        
        const expenseData = fs.readFileSync(EXPENSE_DB_PATH, 'utf8');
        const expenses = JSON.parse(expenseData);
        
        const usageData = fs.readFileSync(USAGE_DB_PATH, 'utf8');
        const usage = JSON.parse(usageData);
        
        const salesData = fs.readFileSync(SALES_DB_PATH, 'utf8');
        const sales = JSON.parse(salesData);
        
        return {
            ...spoolData,
            suppliers: suppliers.suppliers || [],
            expenseRecords: expenses.expenseRecords || [],
            usageRecords: usage.usageRecords || [],
            salesRecords: sales.salesRecords || []
        };
    } catch (error) {
        console.error('读取数据库失败:', error);
        return { spools: [], suppliers: [], expenseRecords: [], usageRecords: [], salesRecords: [], priceFormulas: {} };
    }
};

const writeDB = (data) => {
    try {
        const { suppliers, expenseRecords, usageRecords, salesRecords, ...spoolData } = data;
        
        fs.writeFileSync(DB_PATH, JSON.stringify(spoolData, null, 2));
        fs.writeFileSync(SUPPLIERS_DB_PATH, JSON.stringify({ suppliers: suppliers || [] }, null, 2));
        fs.writeFileSync(EXPENSE_DB_PATH, JSON.stringify({ expenseRecords: expenseRecords || [] }, null, 2));
        fs.writeFileSync(USAGE_DB_PATH, JSON.stringify({ usageRecords: usageRecords || [] }, null, 2));
        fs.writeFileSync(SALES_DB_PATH, JSON.stringify({ salesRecords: salesRecords || [] }, null, 2));
        
        return true;
    } catch (error) {
        console.error('写入数据库失败:', error);
        return false;
    }
};

const generateId = () => {
    return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
};

const calculateStatus = (remainingWeight, initialWeight) => {
    if (!initialWeight) return 'available';
    const remainingRatio = remainingWeight / initialWeight;
    if (remainingRatio <= 0) return 'exhausted';
    if (remainingRatio < 0.2) return 'low';
    return 'available';
};

module.exports = {
    initDB,
    readDB,
    writeDB,
    generateId,
    calculateStatus
};
