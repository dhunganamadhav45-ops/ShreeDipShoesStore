/**
 * SoleStock — Global App Utilities
 * Sidebar rendering, header, toasts, formatting
 */
const App = {
  CURRENCY: 'Rs ',

  // ─── Format Helpers ───────────────────────────────────────
  currency(n) { return `${this.CURRENCY}${Number(n||0).toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:2})}`; },
  date(str)   { if (!str) return '—'; try { return new Date(str).toLocaleDateString('en-US',{year:'numeric',month:'short',day:'numeric'}); } catch(e){return str;} },
  dateTime(str){ if (!str) return '—'; try { return new Date(str).toLocaleString('en-US',{year:'numeric',month:'short',day:'numeric',hour:'2-digit',minute:'2-digit'}); } catch(e){return str;} },
  timeAgo(str) {
    const diff = (Date.now() - new Date(str)) / 1000;
    if (diff < 60) return 'just now';
    if (diff < 3600) return `${Math.floor(diff/60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff/3600)}h ago`;
    return `${Math.floor(diff/86400)}d ago`;
  },
  escape(str) { return String(str||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); },
  initials(name){ return (name||'?').split(' ').map(w=>w[0]||'').join('').toUpperCase().slice(0,2); },

  // ─── Toast Notifications ──────────────────────────────────
  toast(title, msg='', type='info', duration=4000) {
    const icons = { success:'bi-check-circle-fill', warning:'bi-exclamation-triangle-fill', danger:'bi-x-circle-fill', info:'bi-info-circle-fill' };
    let container = document.querySelector('.toast-container');
    if (!container) {
      container = document.createElement('div');
      container.className = 'toast-container';
      document.body.appendChild(container);
    }
    const el = document.createElement('div');
    el.className = `toast toast-${type}`;
    el.innerHTML = `
      <i class="bi ${icons[type]||icons.info} toast-icon"></i>
      <div class="toast-body">
        <div class="toast-title">${this.escape(title)}</div>
        ${msg ? `<div class="toast-msg">${this.escape(msg)}</div>` : ''}
      </div>
      <button class="toast-close" onclick="this.parentElement.remove()"><i class="bi bi-x"></i></button>`;
    container.appendChild(el);
    if (duration > 0) setTimeout(() => { el.style.animation='toastOut 0.3s ease forwards'; setTimeout(()=>el.remove(), 300); }, duration);
  },

  // ─── Confirm Dialog ───────────────────────────────────────
  confirm(title, msg, onConfirm) {
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay active';
    overlay.innerHTML = `
      <div class="modal modal-sm confirm-modal">
        <div class="confirm-icon"><i class="bi bi-trash3-fill"></i></div>
        <h3>${this.escape(title)}</h3>
        <p>${this.escape(msg)}</p>
        <div class="modal-footer" style="justify-content:center;margin-top:24px;">
          <button class="btn btn-secondary" id="confirmNo">Cancel</button>
          <button class="btn btn-danger" id="confirmYes"><i class="bi bi-trash3"></i> Delete</button>
        </div>
      </div>`;
    document.body.appendChild(overlay);
    overlay.querySelector('#confirmNo').onclick  = () => overlay.remove();
    overlay.querySelector('#confirmYes').onclick = () => { overlay.remove(); onConfirm(); };
    overlay.addEventListener('click', e => { if (e.target === overlay) overlay.remove(); });
  },

  // ─── Sidebar ─────────────────────────────────────────────
  initSidebar(activePage) {
    if (!Auth.guard()) return;
    const session = Auth.getSession();
    const page = activePage || this._currentPage();
    const isStaff   = session.role === 'staff';
    const isManager = session.role === 'manager';
    const isAdmin   = session.role === 'admin';

    const shoesSub = isStaff 
      ? [{ text:'View Shoes', href:'shoes.html' }]
      : [{ text:'View All Shoes', href:'shoes.html' }];

    const stockSub = isStaff
      ? [{ text:'Stock Overview', href:'stock.html' }]
      : [
          { text:'Stock Overview',  href:'stock.html' },
          { text:'Stock History',   href:'stock.html#history' },
          { text:'Low Stock Alert', href:'stock.html#low' },
        ];

    const nav = [
      { label:'MAIN' },
      { id:'dashboard',  icon:'bi-grid-1x2-fill',   text:'Dashboard', href:'dashboard.html' },
      { label:'INVENTORY' },
      { id:'shoes', icon:'bi-bag-fill', text: isStaff ? 'Shoes (View Only)' : 'Shoes', sub: shoesSub },
      { id:'stock', icon:'bi-boxes', text: isStaff ? 'Stock (View Only)' : 'Stock', sub: stockSub },
      { label:'TRANSACTIONS' },
      { id:'sales', icon:'bi-cart-check-fill', text:'Sales', sub:[
        { text:'New Sale',      href:'sales.html#new' },
        { text:'Sales History', href:'sales.html' },
      ]},
      ...(!isStaff ? [{ id:'purchases', icon:'bi-truck', text:'Purchases', sub:[
        { text:'New Purchase',      href:'purchases.html#new' },
        { text:'Purchase History',  href:'purchases.html' },
      ]}] : []),
      { label:'MANAGEMENT' },
      { id:'customers', icon:'bi-person-vcard-fill', text:'Customer Membership',  href:'customers.html' },
      { id:'daily-report', icon:'bi-journal-text', text:'Daily Report', href:'daily-report.html' },
      ...(!isStaff ? [{ id:'suppliers', icon:'bi-building', text:'Suppliers', href:'suppliers.html' }] : []),
      ...(!isStaff ? [{ id:'reports',   icon:'bi-bar-chart-fill',     text:'Reports',   href:'reports.html' }] : []),
      ...(isAdmin ? [{ id:'users', icon:'bi-people-fill', text:'Users', href:'users.html' }] : []),
      ...(isManager ? [{ id:'users', icon:'bi-people-fill', text:'Users (Staff)', href:'users.html' }] : []),
      ...(isAdmin ? [{ id:'settings', icon:'bi-gear-fill', text:'Settings', href:'settings.html' }] : []),
    ];

    let html = `
      <aside class="sidebar" id="sidebar">
        <div class="sidebar-brand">
          <div class="brand-logo"><i class="bi bi-bag-heart-fill"></i></div>
          <div class="brand-text">
            <span class="brand-name">SoleStock</span>
            <span class="brand-sub">Shoe Manager</span>
          </div>
          <button class="sidebar-toggle" id="sidebarToggle" title="Toggle Sidebar"><i class="bi bi-layout-sidebar-reverse"></i></button>
        </div>
        <nav class="sidebar-nav">`;

    nav.forEach(item => {
      if (item.label) {
        html += `<div class="nav-section-label">${item.label}</div>`;
      } else if (item.sub) {
        const isOpen = item.sub.some(s => s.href && s.href.split('#')[0] === page+'.html') || item.id === page;
        html += `
          <button class="nav-item ${isOpen?'active open':''}" onclick="App._toggleGroup('${item.id}')">
            <i class="bi ${item.icon}"></i>
            <span class="nav-item-text">${item.text}</span>
            <i class="bi bi-chevron-right nav-arrow"></i>
            <span class="nav-tooltip">${item.text}</span>
          </button>
          <div class="nav-sub ${isOpen?'open':''}" id="nav-sub-${item.id}">`;
        item.sub.forEach(s => {
          const href = s.href.split('#')[0];
          const isActive = href === page+'.html';
          html += `<a href="${s.href}" class="nav-sub-item ${isActive?'active':''}">${s.text}</a>`;
        });
        html += `</div>`;
      } else {
        const isActive = item.href === page+'.html';
        html += `
          <a href="${item.href}" class="nav-item ${isActive?'active':''}">
            <i class="bi ${item.icon}"></i>
            <span class="nav-item-text">${item.text}</span>
            <span class="nav-tooltip">${item.text}</span>
          </a>`;
      }
    });

    const stats = DB.getStats();
    const hasAlerts = stats.lowStock + stats.outOfStock;

    html += `
        </nav>
        <div class="sidebar-footer">
          <div class="sidebar-user-avatar">${this.initials(session.name)}</div>
          <div class="sidebar-user-info">
            <span class="sidebar-user-name">${this.escape(session.name)}</span>
            <span class="sidebar-user-role">${session.role}</span>
          </div>
          <button class="sidebar-logout" onclick="Auth.logout()" title="Logout"><i class="bi bi-box-arrow-right"></i></button>
        </div>
      </aside>
      <div class="sidebar-overlay" id="sidebarOverlay" onclick="App.closeMobileSidebar()"></div>`;

    const container = document.getElementById('sidebar-container');
    if (container) container.innerHTML = html;

    // Toggle button
    const btn = document.getElementById('sidebarToggle');
    if (btn) btn.addEventListener('click', () => this.toggleSidebar());

    // Restore collapsed state
    if (localStorage.getItem('ss_sidebar_collapsed') === '1') {
      document.getElementById('sidebar')?.classList.add('collapsed');
      document.querySelector('.main-wrapper')?.classList.add('collapsed');
    }
  },

  _toggleGroup(id) {
    const sub = document.getElementById(`nav-sub-${id}`);
    const btn = sub?.previousElementSibling;
    if (!sub) return;
    const open = sub.classList.toggle('open');
    btn?.classList.toggle('open', open);
  },

  toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const wrapper = document.querySelector('.main-wrapper');
    if (!sidebar) return;
    if (window.innerWidth <= 768) {
      sidebar.classList.toggle('mobile-open');
      document.getElementById('sidebarOverlay')?.classList.toggle('active');
    } else {
      const collapsed = sidebar.classList.toggle('collapsed');
      wrapper?.classList.toggle('collapsed', collapsed);
      const header = document.querySelector('.top-header');
      if (header) header.style.left = collapsed ? 'var(--sidebar-collapsed)' : 'var(--sidebar-width)';
      localStorage.setItem('ss_sidebar_collapsed', collapsed ? '1' : '0');
    }
  },

  closeMobileSidebar() {
    document.getElementById('sidebar')?.classList.remove('mobile-open');
    document.getElementById('sidebarOverlay')?.classList.remove('active');
  },

  // ─── Theme Management (Day / Night Mode) ───────────────────
  getTheme() {
    return localStorage.getItem('ss_theme') || 'dark';
  },

  initTheme() {
    const theme = this.getTheme();
    if (theme === 'light') {
      document.documentElement.setAttribute('data-theme', 'light');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
  },

  toggleTheme() {
    const current = this.getTheme();
    const next = current === 'dark' ? 'light' : 'dark';
    localStorage.setItem('ss_theme', next);
    this.initTheme();

    const icon = document.getElementById('themeIcon');
    if (icon) {
      icon.className = `bi ${next === 'light' ? 'bi-sun-fill' : 'bi-moon-stars-fill'}`;
    }
    this.toast('Theme Changed', `Switched to ${next === 'light' ? 'Day (Light)' : 'Night (Dark)'} mode`, 'info', 2000);
  },

  // ─── Header ──────────────────────────────────────────────
  initHeader(title, subtitle='') {
    const session = Auth.getSession();
    if (!session) return;

    if (sessionStorage.getItem('ss_access_denied')) {
      sessionStorage.removeItem('ss_access_denied');
      setTimeout(() => {
        this.toast('Access Denied', 'You do not have permission to access that restricted page.', 'danger');
      }, 200);
    }

    const stats = DB.getStats();
    const alertCount = stats.lowStock + stats.outOfStock;
    const container = document.getElementById('header-container');
    if (!container) return;
    const currentTheme = this.getTheme();
    container.innerHTML = `
      <header class="top-header">
        <button class="header-btn" id="mobileMenuBtn" style="display:none" onclick="App.toggleSidebar()">
          <i class="bi bi-list"></i>
        </button>
        <div class="header-title">
          <h2>${title}</h2>
          ${subtitle ? `<p>${subtitle}</p>` : ''}
        </div>
        <div class="header-search">
          <i class="bi bi-search"></i>
          <input type="text" placeholder="Quick search..." id="globalSearch" autocomplete="off">
        </div>
        <div class="header-actions">
          <button class="header-btn" onclick="App.toggleTheme()" title="Toggle Day/Night Mode">
            <i class="bi ${currentTheme === 'light' ? 'bi-sun-fill' : 'bi-moon-stars-fill'}" id="themeIcon" style="${currentTheme === 'light' ? 'color:#f59e0b' : ''}"></i>
          </button>
          <button class="header-btn" onclick="App.showNotifications()" title="Notifications">
            <i class="bi bi-bell-fill"></i>
            ${alertCount > 0 ? `<span class="notif-badge">${alertCount}</span>` : ''}
          </button>
          <a href="users.html" class="header-user" title="Profile">
            <div class="user-avatar-sm">${this.initials(session.name)}</div>
            <div class="header-user-info">
              <span class="uname">${this.escape(session.name)}</span>
              <span class="urole">${session.role}</span>
            </div>
          </a>
        </div>
      </header>`;

    // Mobile menu button show/hide
    if (window.innerWidth <= 768) {
      document.getElementById('mobileMenuBtn').style.display = 'flex';
    }

    // Global search
    const gs = document.getElementById('globalSearch');
    if (gs) {
      gs.addEventListener('keydown', e => {
        if (e.key === 'Enter' && gs.value.trim()) {
          window.location.href = `shoes.html?q=${encodeURIComponent(gs.value.trim())}`;
        }
      });
    }
  },

  // ─── Notifications Panel ─────────────────────────────────
  showNotifications() {
    const stats = DB.getStats();
    const low   = stats.lowStockItems || [];
    const out   = stats.outOfStockItems || [];
    const sales = DB.getAll('sales').slice(-3).reverse();

    let html = `<div class="notif-panel-overlay" onclick="this.remove()">
      <div class="notif-panel" onclick="event.stopPropagation()">
        <div class="notif-panel-header">
          <span class="notif-panel-title"><i class="bi bi-bell-fill"></i> Notifications</span>
          <button onclick="this.closest('.notif-panel-overlay').remove()" style="background:none;border:none;color:var(--text-muted);cursor:pointer;font-size:1.1rem;"><i class="bi bi-x-lg"></i></button>
        </div>
        <div class="notif-panel-body">`;

    if (out.length) {
      out.forEach(s => {
        html += `<div class="notif-item notif-danger"><i class="bi bi-exclamation-circle-fill"></i><div><strong>${App.escape(s.name)}</strong> is out of stock</div></div>`;
      });
    }
    if (low.length) {
      low.forEach(s => {
        html += `<div class="notif-item notif-warning"><i class="bi bi-exclamation-triangle-fill"></i><div><strong>${App.escape(s.name)}</strong> — only ${s.quantity} left</div></div>`;
      });
    }
    sales.forEach(s => {
      html += `<div class="notif-item notif-success"><i class="bi bi-bag-check-fill"></i><div>Sale: <strong>${App.escape(s.shoeName)}</strong> × ${s.quantity} — ${App.currency(s.totalAmount)}</div></div>`;
    });

    if (!out.length && !low.length && !sales.length) {
      html += `<div class="empty-state" style="padding:30px"><p>No notifications</p></div>`;
    }

    html += `</div></div></div>`;

    const el = document.createElement('div');
    el.innerHTML = html;
    document.body.appendChild(el.firstChild);
  },

  // ─── Current Page Detection ──────────────────────────────
  _currentPage() {
    const path = window.location.pathname;
    const file = path.split('/').pop().replace('.html','') || 'index';
    return file;
  },

  // ─── Modal Helpers ───────────────────────────────────────
  openModal(id)  { document.getElementById(id)?.classList.add('active'); },
  closeModal(id) {
    const el = document.getElementById(id);
    if (el) { el.classList.remove('active'); el.querySelector('form')?.reset(); }
  },

  // ─── Populate a <select> ─────────────────────────────────
  populateSelect(selectId, items, valueKey, textKey, placeholder='-- Select --') {
    const el = document.getElementById(selectId);
    if (!el) return;
    el.innerHTML = `<option value="">${placeholder}</option>` +
      items.map(i => `<option value="${i[valueKey]}">${App.escape(i[textKey])}</option>`).join('');
  },

  // ─── Image preview ───────────────────────────────────────
  setupImageUpload(inputId, previewId) {
    const input   = document.getElementById(inputId);
    const preview = document.getElementById(previewId);
    if (!input || !preview) return;
    input.addEventListener('change', () => {
      const file = input.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = e => {
        preview.src = e.target.result;
        preview.style.display = 'block';
      };
      reader.readAsDataURL(file);
    });
  },

  // ─── Handle URL hash actions ─────────────────────────────
  handleHash() {
    const hash = window.location.hash.slice(1);
    if (hash === 'new') setTimeout(() => App.openModal('addModal'), 300);
    if (hash === 'history') setTimeout(() => { document.getElementById('historySection')?.scrollIntoView({behavior:'smooth'}); }, 300);
    if (hash === 'low') setTimeout(() => { document.getElementById('lowStockSection')?.scrollIntoView({behavior:'smooth'}); }, 300);
  },
};

// Notification panel CSS (injected inline)
(function injectNotifCSS() {
  const style = document.createElement('style');
  style.textContent = `
    .notif-panel-overlay { position:fixed;inset:0;z-index:3000; }
    .notif-panel { position:fixed;top:72px;right:20px;width:340px;max-height:480px;background:var(--bg-secondary);border:1px solid var(--border);border-radius:var(--radius-lg);box-shadow:var(--shadow-lg);overflow:hidden;display:flex;flex-direction:column; }
    .notif-panel-header { display:flex;align-items:center;justify-content:space-between;padding:16px 18px;border-bottom:1px solid var(--border); }
    .notif-panel-title  { font-weight:700;font-size:0.9rem;display:flex;align-items:center;gap:8px;color:var(--text-primary); }
    .notif-panel-title i { color:var(--accent-light); }
    .notif-panel-body   { overflow-y:auto;flex:1; }
    .notif-item { display:flex;align-items:flex-start;gap:10px;padding:12px 18px;border-bottom:1px solid var(--border);font-size:0.82rem;color:var(--text-secondary);transition:var(--transition); }
    .notif-item:hover { background:rgba(255,255,255,0.03); }
    .notif-item i { font-size:1rem;flex-shrink:0;margin-top:1px; }
    .notif-danger  i { color:var(--danger); }
    .notif-warning i { color:var(--warning); }
    .notif-success i { color:var(--success); }
    .notif-item strong { color:var(--text-primary); }
  `;
  document.head.appendChild(style);
})();

// Auto-initialize theme on load
App.initTheme();
