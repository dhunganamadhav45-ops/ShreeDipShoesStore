/**
 * SoleStock — Database Layer (localStorage)
 * All data operations for the shoe shop management system
 */

const DB = {

  // ─── Initialization ──────────────────────────────────────
  init() {
    if (!localStorage.getItem('ss_initialized')) {
      this._seed();
      localStorage.setItem('ss_initialized', '1');
    }
  },

  reset() {
    const keys = ['ss_users','ss_shoes','ss_suppliers','ss_sales','ss_purchases','ss_stockHistory','ss_customers','ss_dailyReports','ss_initialized'];
    keys.forEach(k => localStorage.removeItem(k));
    this.init();
  },

  // ─── Seed Data ───────────────────────────────────────────
  _seed() {
    const now = new Date().toISOString();
    const d = (n) => { const dd = new Date(); dd.setDate(dd.getDate()-n); return dd.toISOString().split('T')[0]; };

    // Users
    this.saveAll('users', [
      { id:'u1', username:'admin',   password: btoa('admin123'),   name:'Admin User',   role:'admin',   email:'admin@solestock.com',   active:true, createdAt: now },
      { id:'u2', username:'manager', password: btoa('manager123'), name:'Store Manager',role:'manager', email:'manager@solestock.com', active:true, createdAt: now },
      { id:'u3', username:'staff1',  password: btoa('staff123'),   name:'John Staff',   role:'staff',   email:'staff@solestock.com',   active:true, createdAt: now },
    ]);

    // Suppliers
    this.saveAll('suppliers', [
      { id:'sp1', name:'David Wilson',  company:'Nike Distributors Ltd',    phone:'+1-555-0101', email:'david@nikedist.com',    address:'123 Sports Ave, New York, NY 10001',   createdAt: now },
      { id:'sp2', name:'Sarah Chen',    company:'Adidas Global Supply Co.', phone:'+1-555-0102', email:'sarah@adidasglobal.com', address:'456 Brand Blvd, Portland, OR 97201',   createdAt: now },
      { id:'sp3', name:'Mike Johnson',  company:'SportWear Wholesale Co.',  phone:'+1-555-0103', email:'mike@sportwear.com',     address:'789 Wholesale St, Chicago, IL 60601',  createdAt: now },
      { id:'sp4', name:'Lisa Park',     company:'Urban Kicks Supply',       phone:'+1-555-0104', email:'lisa@urbankicks.com',    address:'321 Kick Lane, Los Angeles, CA 90001', createdAt: now },
    ]);

    // Customers
    this.saveAll('customers', [
      { id:'c1', name:'James Lee',   phone:'+1-555-8801', email:'james.lee@gmail.com',   address:'742 Evergreen Terr, NY', tier:'Platinum', points:580, totalSpent:58000, createdAt:d(180) },
      { id:'c2', name:'Emma Brown',  phone:'+1-555-8802', email:'emma.brown@yahoo.com',  address:'123 Oak St, CA',         tier:'Gold',     points:320, totalSpent:32000, createdAt:d(120) },
      { id:'c3', name:'Alice Green', phone:'+1-555-8803', email:'alice.g@outlook.com',   address:'456 Pine Ave, IL',       tier:'Silver',   points:180, totalSpent:18000, createdAt:d(90) },
      { id:'c4', name:'Bob Smith',   phone:'+1-555-8804', email:'bob.smith@hotmail.com', address:'89 Maple Dr, TX',        tier:'Bronze',   points:45,  totalSpent:4500,  createdAt:d(45) },
      { id:'c5', name:'Rachel Kim',  phone:'+1-555-8805', email:'rachel.k@gmail.com',    address:'55 Elm St, WA',          tier:'Bronze',   points:85,  totalSpent:8500,  createdAt:d(15) },
    ]);

    // Shoes
    this.saveAll('shoes', [
      { id:'sh1',  name:'Air Max 270',        brand:'Nike',        category:'Casual',  size:'9',   colour:'Black/White',  gender:'Men',    purchasePrice:85,  sellingPrice:150, quantity:25, supplierId:'sp1', barcode:'1001', location:'Aisle 1 - Shelf A', description:'Iconic Max Air heel unit for comfortable everyday cushioning.', dateAdded:d(20), lastUpdated:d(2), image:'' },
      { id:'sh2',  name:'Ultra Boost 22',     brand:'Adidas',      category:'Running', size:'10',  colour:'Grey',         gender:'Unisex', purchasePrice:90,  sellingPrice:180, quantity:18, supplierId:'sp2', barcode:'1002', location:'Aisle 2 - Shelf B', description:'Responsive Boost midsole providing maximum energy return for long runs.', dateAdded:d(18), lastUpdated:d(1), image:'' },
      { id:'sh3',  name:'Air Force 1',        brand:'Nike',        category:'Casual',  size:'9.5', colour:'White',        gender:'Unisex', purchasePrice:65,  sellingPrice:110, quantity:4,  supplierId:'sp1', barcode:'1003', location:'Display Rack 1',   description:'Classic leather design with padded collar and durable outsole.', dateAdded:d(15), lastUpdated:d(0), image:'' },
      { id:'sh4',  name:'Stan Smith',         brand:'Adidas',      category:'Casual',  size:'8',   colour:'White/Green',  gender:'Unisex', purchasePrice:55,  sellingPrice:95,  quantity:0,  supplierId:'sp2', barcode:'1004', location:'Backroom Bay 4',  description:'Minimalist tennis shoe featuring iconic perforated 3-Stripes.', dateAdded:d(14), lastUpdated:d(3), image:'' },
      { id:'sh5',  name:'Chuck Taylor',       brand:'Converse',    category:'Casual',  size:'9',   colour:'Black',        gender:'Unisex', purchasePrice:30,  sellingPrice:65,  quantity:12, supplierId:'sp3', barcode:'1005', location:'Aisle 3 - Shelf C', description:'Timeless high-top canvas sneaker with rubber toe cap.', dateAdded:d(12), lastUpdated:d(1), image:'' },
      { id:'sh6',  name:'Old Skool',          brand:'Vans',        category:'Casual',  size:'10',  colour:'Black/White',  gender:'Unisex', purchasePrice:35,  sellingPrice:70,  quantity:8,  supplierId:'sp3', barcode:'1006', location:'Aisle 3 - Shelf D', description:'Classic side-stripe skate shoe with re-enforced toecaps.', dateAdded:d(11), lastUpdated:d(2), image:'' },
      { id:'sh7',  name:'Air Jordan 1 High',  brand:'Nike',        category:'Sports',  size:'11',  colour:'Red/Black',    gender:'Men',    purchasePrice:100, sellingPrice:200, quantity:3,  supplierId:'sp1', barcode:'1007', location:'Display Case VIP', description:'High-top basketball sneaker built for premium ankle support and traction.', dateAdded:d(10), lastUpdated:d(0), image:'' },
      { id:'sh8',  name:'Superstar',          brand:'Adidas',      category:'Casual',  size:'8.5', colour:'White/Black',  gender:'Women',  purchasePrice:50,  sellingPrice:90,  quantity:15, supplierId:'sp2', barcode:'1008', location:'Aisle 2 - Shelf A', description:'Original shell-toe leather sneaker with signature contrast stripes.', dateAdded:d(9),  lastUpdated:d(1), image:'' },
      { id:'sh9',  name:'Suede Classic',      brand:'Puma',        category:'Casual',  size:'9',   colour:'Black',        gender:'Men',    purchasePrice:40,  sellingPrice:80,  quantity:2,  supplierId:'sp3', barcode:'1009', location:'Aisle 4 - Shelf B', description:'Soft suede upper with comfortable sockliner and rubber outsole.', dateAdded:d(8),  lastUpdated:d(0), image:'' },
      { id:'sh10', name:'574 Core',           brand:'New Balance', category:'Casual',  size:'10',  colour:'Grey/Navy',    gender:'Men',    purchasePrice:60,  sellingPrice:105, quantity:0,  supplierId:'sp3', barcode:'1010', location:'Backroom Bay 2',  description:'Versatile mesh/suede sneaker with ENCAP midsole cushioning.', dateAdded:d(7),  lastUpdated:d(2), image:'' },
      { id:'sh11', name:'RS-X Toys',          brand:'Puma',        category:'Running', size:'9',   colour:'White/Blue',   gender:'Unisex', purchasePrice:55,  sellingPrice:95,  quantity:22, supplierId:'sp4', barcode:'1011', location:'Aisle 4 - Shelf C', description:'Retro-inspired bulky design with lightweight polyurethane midsole.', dateAdded:d(6),  lastUpdated:d(1), image:'' },
      { id:'sh12', name:'Pegasus 40',         brand:'Nike',        category:'Running', size:'10',  colour:'Blue',         gender:'Men',    purchasePrice:80,  sellingPrice:135, quantity:30, supplierId:'sp1', barcode:'1012', location:'Aisle 1 - Shelf C', description:'Workhorse performance runner with dual Zoom Air units.', dateAdded:d(5),  lastUpdated:d(0), image:'' },
      { id:'sh13', name:'Gel-Nimbus 25',      brand:'ASICS',       category:'Running', size:'9.5', colour:'Black/Gold',   gender:'Women',  purchasePrice:95,  sellingPrice:160, quantity:5,  supplierId:'sp4', barcode:'1013', location:'Aisle 5 - Shelf A', description:'Max cushion running shoe featuring PureGEL technology.', dateAdded:d(4),  lastUpdated:d(1), image:'' },
      { id:'sh14', name:'Classic Leather',    brand:'Reebok',      category:'Casual',  size:'8',   colour:'White',        gender:'Unisex', purchasePrice:45,  sellingPrice:85,  quantity:9,  supplierId:'sp4', barcode:'1014', location:'Aisle 5 - Shelf B', description:'Soft garment leather upper for instant comfort and style.', dateAdded:d(3),  lastUpdated:d(0), image:'' },
      { id:'sh15', name:'Slip-On Pro',        brand:'Vans',        category:'Casual',  size:'9',   colour:'Navy',         gender:'Unisex', purchasePrice:28,  sellingPrice:55,  quantity:0,  supplierId:'sp3', barcode:'1015', location:'Backroom Bay 1',  description:'Low profile slip-on canvas shoe with elastic side accents.', dateAdded:d(2),  lastUpdated:d(0), image:'' },
    ]);

    // Sales
    this.saveAll('sales', [
      { id:'sa1', shoeId:'sh1',  shoeName:'Air Max 270',       brand:'Nike',    size:'9',   quantity:2, sellingPrice:150, totalAmount:300, date:d(0), customerName:'James Lee',    staffId:'u1', note:'' },
      { id:'sa2', shoeId:'sh5',  shoeName:'Chuck Taylor',      brand:'Converse',size:'9',   quantity:1, sellingPrice:65,  totalAmount:65,  date:d(0), customerName:'Emma Brown',   staffId:'u1', note:'' },
      { id:'sa3', shoeId:'sh6',  shoeName:'Old Skool',         brand:'Vans',    size:'10',  quantity:1, sellingPrice:70,  totalAmount:70,  date:d(1), customerName:'Bob Smith',    staffId:'u2', note:'' },
      { id:'sa4', shoeId:'sh2',  shoeName:'Ultra Boost 22',    brand:'Adidas',  size:'10',  quantity:1, sellingPrice:180, totalAmount:180, date:d(1), customerName:'',             staffId:'u1', note:'' },
      { id:'sa5', shoeId:'sh8',  shoeName:'Superstar',         brand:'Adidas',  size:'8.5', quantity:2, sellingPrice:90,  totalAmount:180, date:d(2), customerName:'Alice Green',  staffId:'u2', note:'' },
      { id:'sa6', shoeId:'sh11', shoeName:'RS-X Toys',         brand:'Puma',    size:'9',   quantity:1, sellingPrice:95,  totalAmount:95,  date:d(3), customerName:'Tom White',    staffId:'u1', note:'' },
      { id:'sa7', shoeId:'sh12', shoeName:'Pegasus 40',        brand:'Nike',    size:'10',  quantity:1, sellingPrice:135, totalAmount:135, date:d(4), customerName:'Chris Park',   staffId:'u2', note:'' },
      { id:'sa8', shoeId:'sh1',  shoeName:'Air Max 270',       brand:'Nike',    size:'9',   quantity:1, sellingPrice:150, totalAmount:150, date:d(5), customerName:'Rachel Kim',   staffId:'u1', note:'' },
      { id:'sa9', shoeId:'sh7',  shoeName:'Air Jordan 1 High', brand:'Nike',    size:'11',  quantity:1, sellingPrice:200, totalAmount:200, date:d(6), customerName:'David Tan',    staffId:'u1', note:'' },
      { id:'sa10',shoeId:'sh14', shoeName:'Classic Leather',   brand:'Reebok',  size:'8',   quantity:2, sellingPrice:85,  totalAmount:170, date:d(7), customerName:'Sarah Lim',    staffId:'u3', note:'' },
    ]);

    // Purchases
    this.saveAll('purchases', [
      { id:'pu1', supplierId:'sp1', supplierName:'Nike Distributors Ltd',    shoeId:'sh1',  shoeName:'Air Max 270',     brand:'Nike',    quantity:30, costPrice:85,  totalCost:2550, purchaseDate:d(20), note:'' },
      { id:'pu2', supplierId:'sp2', supplierName:'Adidas Global Supply Co.', shoeId:'sh2',  shoeName:'Ultra Boost 22',  brand:'Adidas',  quantity:20, costPrice:90,  totalCost:1800, purchaseDate:d(18), note:'' },
      { id:'pu3', supplierId:'sp3', supplierName:'SportWear Wholesale Co.',  shoeId:'sh5',  shoeName:'Chuck Taylor',    brand:'Converse',quantity:15, costPrice:30,  totalCost:450,  purchaseDate:d(12), note:'' },
      { id:'pu4', supplierId:'sp1', supplierName:'Nike Distributors Ltd',    shoeId:'sh12', shoeName:'Pegasus 40',      brand:'Nike',    quantity:35, costPrice:80,  totalCost:2800, purchaseDate:d(5),  note:'' },
      { id:'pu5', supplierId:'sp4', supplierName:'Urban Kicks Supply',       shoeId:'sh11', shoeName:'RS-X Toys',       brand:'Puma',    quantity:25, costPrice:55,  totalCost:1375, purchaseDate:d(6),  note:'' },
      { id:'pu6', supplierId:'sp2', supplierName:'Adidas Global Supply Co.', shoeId:'sh8',  shoeName:'Superstar',       brand:'Adidas',  quantity:20, costPrice:50,  totalCost:1000, purchaseDate:d(9),  note:'' },
    ]);

    // Stock History
    this.saveAll('stockHistory', [
      { id:'sth1',  shoeId:'sh1',  shoeName:'Air Max 270',    changeType:'purchase', qty:+30, prevQty:0,  newQty:30, reason:'Initial Stock', date:d(20), userId:'u1' },
      { id:'sth2',  shoeId:'sh2',  shoeName:'Ultra Boost 22', changeType:'purchase', qty:+20, prevQty:0,  newQty:20, reason:'Initial Stock', date:d(18), userId:'u1' },
      { id:'sth3',  shoeId:'sh5',  shoeName:'Chuck Taylor',   changeType:'purchase', qty:+15, prevQty:0,  newQty:15, reason:'Initial Stock', date:d(12), userId:'u1' },
      { id:'sth4',  shoeId:'sh12', shoeName:'Pegasus 40',     changeType:'purchase', qty:+35, prevQty:0,  newQty:35, reason:'Initial Stock', date:d(5),  userId:'u1' },
      { id:'sth5',  shoeId:'sh11', shoeName:'RS-X Toys',      changeType:'purchase', qty:+25, prevQty:0,  newQty:25, reason:'Initial Stock', date:d(6),  userId:'u1' },
      { id:'sth6',  shoeId:'sh1',  shoeName:'Air Max 270',    changeType:'sale',     qty:-2,  prevQty:30, newQty:28, reason:'Sale #sa1',     date:d(0),  userId:'u1' },
      { id:'sth7',  shoeId:'sh5',  shoeName:'Chuck Taylor',   changeType:'sale',     qty:-1,  prevQty:13, newQty:12, reason:'Sale #sa2',     date:d(0),  userId:'u1' },
      { id:'sth8',  shoeId:'sh6',  shoeName:'Old Skool',      changeType:'sale',     qty:-1,  prevQty:9,  newQty:8,  reason:'Sale #sa3',     date:d(1),  userId:'u2' },
      { id:'sth9',  shoeId:'sh2',  shoeName:'Ultra Boost 22', changeType:'sale',     qty:-1,  prevQty:19, newQty:18, reason:'Sale #sa4',     date:d(1),  userId:'u1' },
      { id:'sth10', shoeId:'sh8',  shoeName:'Superstar',      changeType:'sale',     qty:-2,  prevQty:17, newQty:15, reason:'Sale #sa5',     date:d(2),  userId:'u2' },
    ]);

    // Daily Reports
    const dt = (n, h='09:30') => { const dd = new Date(); dd.setDate(dd.getDate()-n); return dd.toISOString().split('T')[0] + 'T' + h + ':00'; };
    this.saveAll('dailyReports', [
      {
        id: 'dr1', date: d(0), createdAt: dt(0,'09:15'), updatedAt: dt(0,'09:15'),
        authorId: 'u3', authorName: 'John Staff',
        summary: 'Smooth opening day. Served 5 customers, processed 3 sales, and restocked aisle 1 shelves.',
        stockReceived:  'Received 10 pairs of Air Max 270 from Nike Distributors.',
        stockSold:      '2x Air Max 270, 1x Chuck Taylor sold today.',
        customerNotes:  'Customer Emma Brown enquired about upcoming Nike sale. Added to waitlist.',
        tasksCompleted: 'Cleaned display shelves, updated price tags, reorganised Aisle 1.',
        maintenance:    'Replaced broken display hook on Rack 2.',
        incidents:      ''
      },
      {
        id: 'dr2', date: d(1), createdAt: dt(1,'10:00'), updatedAt: dt(1,'15:30'),
        authorId: 'u2', authorName: 'Store Manager',
        summary: 'Moderate traffic day. Manager on floor for supplier meeting. Reviewed monthly stock figures.',
        stockReceived:  '',
        stockSold:      '1x Old Skool, 1x Ultra Boost 22.',
        customerNotes:  'Customer complained about sizing on Adidas shoes. Offered exchange.',
        tasksCompleted: 'Monthly stock count completed. Updated inventory for 8 lines.',
        maintenance:    'Air conditioning unit serviced — maintenance team on site 2–4pm.',
        incidents:      'Minor argument between two customers over last pair of Old Skools. Resolved peacefully.'
      },
      {
        id: 'dr3', date: d(2), createdAt: dt(2,'09:45'), updatedAt: dt(2,'09:45'),
        authorId: 'u3', authorName: 'John Staff',
        summary: 'Quiet day. Used time for store organisation and cleaning.',
        stockReceived:  '',
        stockSold:      '2x Superstar.',
        customerNotes:  '',
        tasksCompleted: 'Deep cleaned the storage backroom. Reorganised Aisles 4 and 5.',
        maintenance:    'Replaced front window display. New Adidas promotion poster installed.',
        incidents:      ''
      },
    ]);
  },

  // ─── CRUD Operations ─────────────────────────────────────
  getAll(table) {
    try { return JSON.parse(localStorage.getItem(`ss_${table}`)) || []; }
    catch(e) { return []; }
  },

  getById(table, id) {
    return this.getAll(table).find(r => r.id === id) || null;
  },

  saveAll(table, data) {
    localStorage.setItem(`ss_${table}`, JSON.stringify(data));
  },

  add(table, item) {
    const data = this.getAll(table);
    item.id = this._genId(table);
    data.push(item);
    this.saveAll(table, data);
    return item;
  },

  update(table, id, updates) {
    const data = this.getAll(table);
    const idx = data.findIndex(r => r.id === id);
    if (idx === -1) return null;
    data[idx] = { ...data[idx], ...updates };
    this.saveAll(table, data);
    return data[idx];
  },

  delete(table, id) {
    this.saveAll(table, this.getAll(table).filter(r => r.id !== id));
  },

  count(table) { return this.getAll(table).length; },

  _genId(table) {
    const prefix = { users:'u', shoes:'sh', suppliers:'sp', sales:'sa', purchases:'pu', stockHistory:'sth', customers:'c', dailyReports:'dr' }[table] || 'x';
    return `${prefix}${Date.now()}${Math.floor(Math.random()*1000)}`;
  },

  // ─── Business Logic ───────────────────────────────────────
  getStockStatus(qty) {
    if (qty === 0)     return { label:'Out of Stock', cls:'badge-danger',  barCls:'out',     pct:0 };
    if (qty <= 5)      return { label:'Low Stock',    cls:'badge-warning', barCls:'low',     pct:Math.min(qty/5*100, 100) };
    if (qty <= 20)     return { label:'Medium Stock', cls:'badge-info',    barCls:'medium',  pct:Math.min(qty/20*100, 100) };
    return               { label:'In Stock',     cls:'badge-success', barCls:'in-stock', pct:100 };
  },

  getStats() {
    const shoes     = this.getAll('shoes');
    const sales     = this.getAll('sales');
    const today     = new Date().toISOString().split('T')[0];
    const thisMonth = today.slice(0,7);
    const lastMonth = (() => { const d=new Date(); d.setMonth(d.getMonth()-1); return d.toISOString().slice(0,7); })();

    const todaySales  = sales.filter(s => s.date === today);
    const monthSales  = sales.filter(s => s.date.startsWith(thisMonth));
    const lMonthSales = sales.filter(s => s.date.startsWith(lastMonth));

    const shoesMap = Object.fromEntries(shoes.map(s => [s.id, s]));

    const calcProfit = (saleList) => saleList.reduce((sum, s) => {
      const shoe = shoesMap[s.shoeId];
      return sum + ((shoe ? s.sellingPrice - shoe.purchasePrice : 0) * s.quantity);
    }, 0);

    const todayRev  = todaySales.reduce((a,s) => a + s.totalAmount, 0);
    const monthRev  = monthSales.reduce((a,s) => a + s.totalAmount, 0);
    const lMonthRev = lMonthSales.reduce((a,s) => a + s.totalAmount, 0);
    const totalRev  = sales.reduce((a,s) => a + s.totalAmount, 0);

    const brands    = [...new Set(shoes.map(s => s.brand))];
    const totalQty  = shoes.reduce((a,s) => a + s.quantity, 0);
    const lowStock  = shoes.filter(s => s.quantity > 0 && s.quantity <= 5);
    const outStock  = shoes.filter(s => s.quantity === 0);

    return {
      totalShoes:  shoes.length,
      totalBrands: brands.length,
      totalStock:  totalQty,
      lowStock:    lowStock.length,
      outOfStock:  outStock.length,
      todaySalesCount:  todaySales.length,
      todayRevenue:     todayRev,
      monthSalesCount:  monthSales.length,
      monthRevenue:     monthRev,
      lMonthRevenue:    lMonthRev,
      totalRevenue:     totalRev,
      todayProfit:      calcProfit(todaySales),
      monthProfit:      calcProfit(monthSales),
      totalProfit:      calcProfit(sales),
      lowStockItems:    lowStock,
      outOfStockItems:  outStock,
    };
  },

  // Customer Tier Helper
  getCustomerTierInfo(spent) {
    if (spent >= 50000) return { name:'Platinum', badge:'badge-purple', icon:'bi-gem' };
    if (spent >= 25000) return { name:'Gold',     badge:'badge-warning',icon:'bi-award-fill' };
    if (spent >= 10000) return { name:'Silver',   badge:'badge-info',   icon:'bi-shield-fill' };
    return                     { name:'Bronze',   badge:'badge-muted',  icon:'bi-star-fill' };
  },

  // Sales + stock management
  recordSale(saleData) {
    const shoe = this.getById('shoes', saleData.shoeId);
    if (!shoe) return { ok: false, msg: 'Shoe not found.' };
    if (shoe.quantity < saleData.quantity) return { ok: false, msg: `Only ${shoe.quantity} in stock.` };

    const prevQty = shoe.quantity;
    const newQty  = prevQty - saleData.quantity;
    this.update('shoes', shoe.id, { quantity: newQty, lastUpdated: new Date().toISOString().split('T')[0] });

    const discountPercent = parseFloat(saleData.discountPercent) || 0;
    const subtotal = saleData.sellingPrice * saleData.quantity;
    const discountAmount = subtotal * (discountPercent / 100);
    const totalAmount = Math.max(0, subtotal - discountAmount);

    const sale = this.add('sales', {
      ...saleData,
      discountPercent,
      discountAmount,
      totalAmount,
      date: saleData.date || new Date().toISOString().split('T')[0],
    });

    // Update customer membership if customerId provided
    if (saleData.customerId) {
      const cust = this.getById('customers', saleData.customerId);
      if (cust) {
        const newTotalSpent = (cust.totalSpent || 0) + totalAmount;
        const newPoints = (cust.points || 0) + Math.floor(totalAmount / 100);
        const newTier = this.getCustomerTierInfo(newTotalSpent).name;
        this.update('customers', cust.id, {
          totalSpent: newTotalSpent,
          points: newPoints,
          tier: newTier,
        });
      }
    }

    this.add('stockHistory', {
      shoeId: shoe.id, shoeName: shoe.name,
      changeType: 'sale', qty: -saleData.quantity,
      prevQty, newQty,
      reason: `Sale #${sale.id}`,
      date: sale.date,
      userId: saleData.staffId || 'u1',
    });

    return { ok: true, sale };
  },

  recordPurchase(purchData) {
    const shoe = this.getById('shoes', purchData.shoeId);
    if (!shoe) return { ok: false, msg: 'Shoe not found.' };

    const prevQty = shoe.quantity;
    const newQty  = prevQty + purchData.quantity;
    this.update('shoes', shoe.id, { quantity: newQty, lastUpdated: new Date().toISOString().split('T')[0] });

    const pur = this.add('purchases', {
      ...purchData,
      totalCost: purchData.costPrice * purchData.quantity,
      purchaseDate: purchData.purchaseDate || new Date().toISOString().split('T')[0],
    });

    this.add('stockHistory', {
      shoeId: shoe.id, shoeName: shoe.name,
      changeType: 'purchase', qty: +purchData.quantity,
      prevQty, newQty,
      reason: `Purchase #${pur.id}`,
      date: pur.purchaseDate,
      userId: purchData.userId || 'u1',
    });

    return { ok: true, purchase: pur };
  },

  adjustStock(shoeId, qty, reason, userId) {
    const shoe = this.getById('shoes', shoeId);
    if (!shoe) return { ok: false, msg: 'Shoe not found.' };
    const prevQty = shoe.quantity;
    const newQty  = Math.max(0, prevQty + qty);
    this.update('shoes', shoeId, { quantity: newQty, lastUpdated: new Date().toISOString().split('T')[0] });
    this.add('stockHistory', {
      shoeId, shoeName: shoe.name,
      changeType: qty > 0 ? 'add' : 'remove',
      qty, prevQty, newQty, reason,
      date: new Date().toISOString().split('T')[0],
      userId,
    });
    return { ok: true, newQty };
  },

  // ─── Monthly chart data (last 6 months) ──────────────────
  getMonthlySales() {
    const sales = this.getAll('sales');
    const months = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      const key = d.toISOString().slice(0,7);
      const label = d.toLocaleString('default', { month:'short', year:'2-digit' });
      const ms = sales.filter(s => s.date.startsWith(key));
      months.push({ key, label, revenue: ms.reduce((a,s)=>a+s.totalAmount,0), count: ms.length });
    }
    return months;
  },

  // ─── Best sellers ─────────────────────────────────────────
  getBestSellers(limit=5) {
    const sales = this.getAll('sales');
    const map = {};
    sales.forEach(s => {
      if (!map[s.shoeId]) map[s.shoeId] = { shoeId:s.shoeId, name:s.shoeName, brand:s.brand, totalQty:0, totalRevenue:0 };
      map[s.shoeId].totalQty += s.quantity;
      map[s.shoeId].totalRevenue += s.totalAmount;
    });
    return Object.values(map).sort((a,b) => b.totalQty - a.totalQty).slice(0,limit);
  },
};

// Auto-init on load
DB.init();
