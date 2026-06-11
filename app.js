const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');
const { initDB, readDB, writeDB, generateId, calculateStatus } = require('./data/db_manager');

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

initDB();

app.get('/api/spools', (req, res) => {
  try {
    const db = readDB();
    res.status(200).json({
      success: true,
      count: db.spools.length,
      data: db.spools
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '服务器错误',
      error: error.message
    });
  }
});

app.get('/api/spools/:id', (req, res) => {
  try {
    const db = readDB();
    const spool = db.spools.find(s => s._id === req.params.id);
    if (!spool) {
      return res.status(404).json({
        success: false,
        message: '未找到该耗材'
      });
    }
    res.status(200).json({
      success: true,
      data: spool
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '服务器错误',
      error: error.message
    });
  }
});

app.post('/api/spools', (req, res) => {
  try {
    const { material, diameter, color, colorCode, brand, initialWeight, remainingWeight, price, spoolWeight, supplierId } = req.body;
    
    if (!material || !diameter || !color || !brand || !initialWeight) {
      return res.status(400).json({
        success: false,
        message: '请填写所有必填字段'
      });
    }
    
    const newSpool = {
      _id: generateId(),
      material: material.toUpperCase(),
      diameter,
      color,
      colorCode: colorCode || '#3b82f6',
      brand,
      initialWeight: parseFloat(initialWeight),
      remainingWeight: parseFloat(remainingWeight) || parseFloat(initialWeight),
      price: parseFloat(price) || 0,
      spoolWeight: parseFloat(spoolWeight) || 140,
      supplierId: supplierId || null,
      storageDate: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    const db = readDB();
    db.spools.push(newSpool);
    writeDB(db);
    
    res.status(201).json({
      success: true,
      message: '耗材新增成功',
      data: newSpool
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '服务器错误',
      error: error.message
    });
  }
});

app.put('/api/spools/:id', (req, res) => {
  try {
    const db = readDB();
    const index = db.spools.findIndex(s => s._id === req.params.id);
    if (index === -1) {
      return res.status(404).json({
        success: false,
        message: '未找到该耗材'
      });
    }
    
    const { material, diameter, color, colorCode, brand, initialWeight, remainingWeight, price, spoolWeight, supplierId } = req.body;
    
    db.spools[index] = {
      ...db.spools[index],
      material: material ? material.toUpperCase() : db.spools[index].material,
      diameter: diameter || db.spools[index].diameter,
      color: color || db.spools[index].color,
      colorCode: colorCode || db.spools[index].colorCode,
      brand: brand || db.spools[index].brand,
      initialWeight: initialWeight ? parseFloat(initialWeight) : db.spools[index].initialWeight,
      remainingWeight: remainingWeight ? parseFloat(remainingWeight) : db.spools[index].remainingWeight,
      price: price ? parseFloat(price) : db.spools[index].price,
      spoolWeight: spoolWeight ? parseFloat(spoolWeight) : db.spools[index].spoolWeight,
      supplierId: supplierId !== undefined && supplierId !== '' ? supplierId : db.spools[index].supplierId,
      updatedAt: new Date().toISOString()
    };
    
    writeDB(db);
    
    res.status(200).json({
      success: true,
      message: '耗材更新成功',
      data: db.spools[index]
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '服务器错误',
      error: error.message
    });
  }
});

app.delete('/api/spools/:id', (req, res) => {
  try {
    const db = readDB();
    const index = db.spools.findIndex(s => s._id === req.params.id);
    if (index === -1) {
      return res.status(404).json({
        success: false,
        message: '未找到该耗材'
      });
    }
    
    db.spools.splice(index, 1);
    writeDB(db);
    
    res.status(200).json({
      success: true,
      message: '耗材删除成功'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '服务器错误',
      error: error.message
    });
  }
});

app.get('/api/suppliers', (req, res) => {
  try {
    const db = readDB();
    res.status(200).json({
      success: true,
      count: db.suppliers.length,
      data: db.suppliers
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '服务器错误',
      error: error.message
    });
  }
});

app.post('/api/suppliers', (req, res) => {
  try {
    const { name, contact, phone, email, address, notes } = req.body;
    
    if (!name) {
      return res.status(400).json({
        success: false,
        message: '请填写供应商名称'
      });
    }
    
    const newSupplier = {
      _id: generateId(),
      name,
      contact: contact || '',
      phone: phone || '',
      email: email || '',
      address: address || '',
      notes: notes || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    const db = readDB();
    db.suppliers.push(newSupplier);
    writeDB(db);
    
    res.status(201).json({
      success: true,
      message: '供应商新增成功',
      data: newSupplier
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '服务器错误',
      error: error.message
    });
  }
});

app.put('/api/suppliers/:id', (req, res) => {
  try {
    const db = readDB();
    const index = db.suppliers.findIndex(s => s._id === req.params.id);
    if (index === -1) {
      return res.status(404).json({
        success: false,
        message: '未找到该供应商'
      });
    }
    
    const { name, contact, phone, email, address, notes } = req.body;
    
    db.suppliers[index] = {
      ...db.suppliers[index],
      name: name || db.suppliers[index].name,
      contact: contact !== undefined ? contact : db.suppliers[index].contact,
      phone: phone !== undefined ? phone : db.suppliers[index].phone,
      email: email !== undefined ? email : db.suppliers[index].email,
      address: address !== undefined ? address : db.suppliers[index].address,
      notes: notes !== undefined ? notes : db.suppliers[index].notes,
      updatedAt: new Date().toISOString()
    };
    
    writeDB(db);
    
    res.status(200).json({
      success: true,
      message: '供应商更新成功',
      data: db.suppliers[index]
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '服务器错误',
      error: error.message
    });
  }
});

app.delete('/api/suppliers/:id', (req, res) => {
  try {
    const db = readDB();
    const index = db.suppliers.findIndex(s => s._id === req.params.id);
    if (index === -1) {
      return res.status(404).json({
        success: false,
        message: '未找到该供应商'
      });
    }
    
    db.suppliers.splice(index, 1);
    
    db.spools.forEach(spool => {
      if (spool.supplierId === req.params.id) {
        spool.supplierId = null;
      }
    });
    
    writeDB(db);
    
    res.status(200).json({
      success: true,
      message: '供应商删除成功'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '服务器错误',
      error: error.message
    });
  }
});

app.get('/api/expense-records', (req, res) => {
  try {
    const db = readDB();
    res.status(200).json({
      success: true,
      count: db.expenseRecords.length,
      data: db.expenseRecords
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '服务器错误',
      error: error.message
    });
  }
});

app.post('/api/expense-records', (req, res) => {
  try {
    const { type, amount, description, date, supplierId, spoolId } = req.body;
    
    if (!type || !amount) {
      return res.status(400).json({
        success: false,
        message: '请填写费用类型和金额'
      });
    }
    
    const newRecord = {
      _id: generateId(),
      type,
      amount: parseFloat(amount),
      description: description || '',
      date: date ? new Date(date).toISOString() : new Date().toISOString(),
      supplierId: supplierId || null,
      spoolId: spoolId || null,
      createdAt: new Date().toISOString()
    };
    
    const db = readDB();
    db.expenseRecords.push(newRecord);
    writeDB(db);
    
    res.status(201).json({
      success: true,
      message: '费用记录新增成功',
      data: newRecord
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '服务器错误',
      error: error.message
    });
  }
});

app.put('/api/expense-records/:id', (req, res) => {
  try {
    const { type, amount, description, date, supplierId, spoolId } = req.body;
    
    if (!type || !amount) {
      return res.status(400).json({
        success: false,
        message: '请填写费用类型和金额'
      });
    }
    
    const db = readDB();
    const index = db.expenseRecords.findIndex(r => r._id === req.params.id);
    if (index === -1) {
      return res.status(404).json({
        success: false,
        message: '未找到该费用记录'
      });
    }
    
    db.expenseRecords[index] = {
      ...db.expenseRecords[index],
      type,
      amount: parseFloat(amount),
      description: description || '',
      date: date ? new Date(date).toISOString() : db.expenseRecords[index].date,
      supplierId: supplierId || null,
      spoolId: spoolId || null
    };
    
    writeDB(db);
    
    res.status(200).json({
      success: true,
      message: '费用记录更新成功',
      data: db.expenseRecords[index]
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '服务器错误',
      error: error.message
    });
  }
});

app.delete('/api/expense-records/:id', (req, res) => {
  try {
    const db = readDB();
    const index = db.expenseRecords.findIndex(r => r._id === req.params.id);
    if (index === -1) {
      return res.status(404).json({
        success: false,
        message: '未找到该费用记录'
      });
    }
    
    db.expenseRecords.splice(index, 1);
    writeDB(db);
    
    res.status(200).json({
      success: true,
      message: '费用记录删除成功'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '服务器错误',
      error: error.message
    });
  }
});

app.get('/api/expense-settings', (req, res) => {
  try {
    const expenseSettingsPath = path.join(__dirname, 'data', 'expenseSettings.db');
    const settings = JSON.parse(fs.readFileSync(expenseSettingsPath, 'utf8'));
    res.status(200).json({
      success: true,
      data: settings
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '服务器错误',
      error: error.message
    });
  }
});

app.put('/api/expense-settings', (req, res) => {
  try {
    const { expenseTypes, expenseChannels, platformColors, expenseTypeColors } = req.body;
    const expenseSettingsPath = path.join(__dirname, 'data', 'expenseSettings.db');

    console.log('PUT /api/expense-settings 收到请求:', { expenseTypes: !!expenseTypes, expenseChannels: !!expenseChannels, platformColors: !!platformColors, expenseTypeColors: !!expenseTypeColors });

    let currentSettings = { expenseTypes: [], expenseChannels: [], platformColors: {}, expenseTypeColors: {} };
    try {
      currentSettings = JSON.parse(fs.readFileSync(expenseSettingsPath, 'utf8'));
      console.log('读取当前设置:', { hasPlatformColors: !!currentSettings.platformColors, hasExpenseTypeColors: !!currentSettings.expenseTypeColors });
    } catch (e) {
      console.log('读取设置文件失败，使用默认值');
    }

    const newSettings = {
      expenseTypes: expenseTypes !== undefined ? expenseTypes : currentSettings.expenseTypes,
      expenseChannels: expenseChannels !== undefined ? expenseChannels : currentSettings.expenseChannels,
      platformColors: platformColors !== undefined ? platformColors : currentSettings.platformColors,
      expenseTypeColors: expenseTypeColors !== undefined ? expenseTypeColors : currentSettings.expenseTypeColors
    };

    console.log('新设置:', { hasPlatformColors: !!newSettings.platformColors, hasExpenseTypeColors: !!newSettings.expenseTypeColors });

    fs.writeFileSync(expenseSettingsPath, JSON.stringify(newSettings, null, 2));
    console.log('设置已保存到文件');

    res.status(200).json({
      success: true,
      message: '费用设置更新成功',
      data: newSettings
    });
  } catch (error) {
    console.error('保存设置失败:', error);
    res.status(500).json({
      success: false,
      message: '服务器错误',
      error: error.message
    });
  }
});

app.get('/api/price-formulas', (req, res) => {
  try {
    const db = readDB();
    res.status(200).json({
      success: true,
      data: db.priceFormulas
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '服务器错误',
      error: error.message
    });
  }
});

app.put('/api/price-formulas', (req, res) => {
  try {
    const { materialCosts, baseFee, hourlyRate, electricityRate, markup } = req.body;
    
    const db = readDB();
    db.priceFormulas = {
      materialCosts: materialCosts || db.priceFormulas.materialCosts,
      baseFee: baseFee !== undefined ? parseFloat(baseFee) : db.priceFormulas.baseFee,
      hourlyRate: hourlyRate !== undefined ? parseFloat(hourlyRate) : db.priceFormulas.hourlyRate,
      electricityRate: electricityRate !== undefined ? parseFloat(electricityRate) : db.priceFormulas.electricityRate,
      markup: markup !== undefined ? parseFloat(markup) : db.priceFormulas.markup
    };
    
    writeDB(db);
    
    res.status(200).json({
      success: true,
      message: '价格公式更新成功',
      data: db.priceFormulas
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '服务器错误',
      error: error.message
    });
  }
});

app.get('/api/usage-records', (req, res) => {
  try {
    const db = readDB();
    res.status(200).json({
      success: true,
      count: db.usageRecords.length,
      data: db.usageRecords
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '服务器错误',
      error: error.message
    });
  }
});

app.post('/api/usage-records', (req, res) => {
  try {
    const { spoolId, amount, projectName, date } = req.body;
    
    if (!spoolId || !amount || !projectName) {
      return res.status(400).json({
        success: false,
        message: '请填写所有必填字段'
      });
    }
    
    const db = readDB();
    const spoolIndex = db.spools.findIndex(s => s._id === spoolId);
    if (spoolIndex === -1) {
      return res.status(404).json({
        success: false,
        message: '未找到该耗材'
      });
    }
    
    const newRecord = {
      _id: generateId(),
      spoolId,
      amount: parseFloat(amount),
      projectName,
      date: date ? new Date(date).toISOString() : new Date().toISOString(),
      createdAt: new Date().toISOString()
    };
    
    db.spools[spoolIndex].remainingWeight -= parseFloat(amount);
    db.spools[spoolIndex].updatedAt = new Date().toISOString();
    
    db.usageRecords.push(newRecord);
    writeDB(db);
    
    res.status(201).json({
      success: true,
      message: '使用记录添加成功',
      data: newRecord
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '服务器错误',
      error: error.message
    });
  }
});

app.delete('/api/usage-records/:id', (req, res) => {
  try {
    const db = readDB();
    const index = db.usageRecords.findIndex(r => r._id === req.params.id);
    if (index === -1) {
      return res.status(404).json({
        success: false,
        message: '未找到该使用记录'
      });
    }
    
    const record = db.usageRecords[index];
    const spoolIndex = db.spools.findIndex(s => s._id === record.spoolId);
    if (spoolIndex !== -1) {
      db.spools[spoolIndex].remainingWeight += record.amount;
      db.spools[spoolIndex].updatedAt = new Date().toISOString();
    }
    
    db.usageRecords.splice(index, 1);
    writeDB(db);
    
    res.status(200).json({
      success: true,
      message: '使用记录删除成功'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '服务器错误',
      error: error.message
    });
  }
});

app.get('/api/sales-records', (req, res) => {
  try {
    const db = readDB();
    res.status(200).json({
      success: true,
      count: db.salesRecords.length,
      data: db.salesRecords
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '服务器错误',
      error: error.message
    });
  }
});

app.post('/api/sales-records', (req, res) => {
  try {
    const { platform, amount, productName, materialCost, shippingCost, date, materialType, materialWeight, printTime } = req.body;
    
    if (!platform || !amount || !productName) {
      return res.status(400).json({
        success: false,
        message: '请填写平台、金额和产品名称'
      });
    }
    
    const profit = parseFloat(amount) - (parseFloat(materialCost) || 0) - (parseFloat(shippingCost) || 0);
    
    const newRecord = {
      _id: generateId(),
      platform,
      amount: parseFloat(amount),
      productName,
      materialCost: parseFloat(materialCost) || 0,
      shippingCost: parseFloat(shippingCost) || 0,
      profit,
      date: date ? new Date(date).toISOString() : new Date().toISOString(),
      createdAt: new Date().toISOString(),
      materialType,
      materialWeight: parseFloat(materialWeight) || null,
      printTime: parseFloat(printTime) || null
    };
    
    const db = readDB();
    db.salesRecords.push(newRecord);
    writeDB(db);
    
    res.status(201).json({
      success: true,
      message: '销售记录添加成功',
      data: newRecord
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '服务器错误',
      error: error.message
    });
  }
});

app.put('/api/sales-records/:id', (req, res) => {
  try {
    const { platform, amount, productName, materialCost, shippingCost, date, materialType, materialWeight, printTime } = req.body;
    
    if (!platform || !amount || !productName) {
      return res.status(400).json({
        success: false,
        message: '缺少必填字段'
      });
    }
    
    const db = readDB();
    const index = db.salesRecords.findIndex(r => r._id === req.params.id);
    if (index === -1) {
      return res.status(404).json({
        success: false,
        message: '销售记录不存在'
      });
    }
    
    const profit = parseFloat(amount) - (parseFloat(materialCost) || 0) - (parseFloat(shippingCost) || 0);
    
    db.salesRecords[index] = {
      ...db.salesRecords[index],
      platform,
      amount: parseFloat(amount),
      productName,
      materialCost: parseFloat(materialCost) || 0,
      shippingCost: parseFloat(shippingCost) || 0,
      profit,
      date: date ? new Date(date).toISOString() : db.salesRecords[index].date,
      materialType,
      materialWeight: parseFloat(materialWeight) || null,
      printTime: parseFloat(printTime) || null
    };
    
    writeDB(db);
    
    res.status(200).json({
      success: true,
      message: '销售记录更新成功',
      data: db.salesRecords[index]
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '服务器错误',
      error: error.message
    });
  }
});

app.delete('/api/sales-records/:id', (req, res) => {
  try {
    const db = readDB();
    const index = db.salesRecords.findIndex(r => r._id === req.params.id);
    if (index === -1) {
      return res.status(404).json({
        success: false,
        message: '未找到该销售记录'
      });
    }
    
    db.salesRecords.splice(index, 1);
    writeDB(db);
    
    res.status(200).json({
      success: true,
      message: '销售记录删除成功'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '服务器错误',
      error: error.message
    });
  }
});

app.get('/api/statistics', (req, res) => {
  try {
    const db = readDB();
    
    const totalSpools = db.spools.length;
    const totalExpense = db.expenseRecords.reduce((sum, record) => sum + record.amount, 0);
    const totalSuppliers = db.suppliers.length;
    const totalUsage = db.usageRecords.reduce((sum, record) => sum + record.amount, 0);
    const totalSales = db.salesRecords.reduce((sum, record) => sum + record.amount, 0);
    const totalProfit = db.salesRecords.reduce((sum, record) => sum + record.profit, 0);
    
    const expenseByType = {};
    db.expenseRecords.forEach(record => {
      if (!expenseByType[record.type]) {
        expenseByType[record.type] = 0;
      }
      expenseByType[record.type] += record.amount;
    });
    
    const expenseByMonth = {};
    db.expenseRecords.forEach(record => {
      const month = new Date(record.date).toISOString().substring(0, 7);
      if (!expenseByMonth[month]) {
        expenseByMonth[month] = 0;
      }
      expenseByMonth[month] += record.amount;
    });
    
    res.status(200).json({
      success: true,
      data: {
        totalSpools,
        totalExpense,
        totalSuppliers,
        totalUsage,
        totalSales,
        totalProfit,
        expenseByType,
        expenseByMonth
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '服务器错误',
      error: error.message
    });
  }
});

app.get('/api/platforms', (req, res) => {
  try {
    const db = readDB();
    const platforms = db.platforms || ['taobao', 'douyin', 'pinduoduo', 'jd'];
    res.status(200).json({
      success: true,
      data: platforms
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '服务器错误',
      error: error.message
    });
  }
});

app.post('/api/platforms', (req, res) => {
  try {
    const { name } = req.body;
    
    if (!name || name.trim() === '') {
      return res.status(400).json({
        success: false,
        message: '请输入平台名称'
      });
    }
    
    const normalizedName = name.trim();
    
    if (normalizedName.startsWith('_') || normalizedName.endsWith('_')) {
      return res.status(400).json({
        success: false,
        message: '平台名称不能以下划线开头或结尾'
      });
    }
    
    const db = readDB();
    if (!db.platforms) {
      db.platforms = ['taobao', 'douyin', 'pinduoduo', 'jd'];
    }
    
    if (db.platforms.includes(normalizedName)) {
      return res.status(400).json({
        success: false,
        message: '平台已存在'
      });
    }
    
    db.platforms.push(normalizedName);
    writeDB(db);
    
    res.status(201).json({
      success: true,
      message: '平台添加成功',
      data: db.platforms
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '服务器错误',
      error: error.message
    });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`服务器已启动，运行在端口：${PORT}`);
});
