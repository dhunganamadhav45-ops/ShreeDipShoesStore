/**
 * SoleStock — Authentication Module
 */
const Auth = {
  SESSION_KEY: 'ss_session',

  login(username, password) {
    const users = DB.getAll('users');
    const encoded = btoa(password);
    const user = users.find(u => u.username === username && u.password === encoded && u.active);
    if (!user) return { ok: false, msg: 'Invalid username or password.' };
    const session = { userId: user.id, name: user.name, role: user.role, username: user.username, loginAt: Date.now() };
    sessionStorage.setItem(this.SESSION_KEY, JSON.stringify(session));
    return { ok: true, user };
  },

  logout() {
    sessionStorage.removeItem(this.SESSION_KEY);
    window.location.href = 'index.html';
  },

  getSession() {
    try { return JSON.parse(sessionStorage.getItem(this.SESSION_KEY)); }
    catch(e) { return null; }
  },

  isLoggedIn() { return !!this.getSession(); },

  guard() {
    if (!this.isLoggedIn()) { window.location.href = 'index.html'; return false; }
    return true;
  },

  requireRole(allowedRoles) {
    if (!this.guard()) return false;
    const session = this.getSession();
    const list = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];
    if (!session || !list.includes(session.role)) {
      sessionStorage.setItem('ss_access_denied', '1');
      window.location.href = 'dashboard.html';
      return false;
    }
    return true;
  },

  isAdmin()   { const s = this.getSession(); return s && s.role === 'admin'; },
  isManager() { const s = this.getSession(); return s && ['admin','manager'].includes(s.role); },
  isStaff()   { const s = this.getSession(); return s && s.role === 'staff'; },

  canEditShoe()       { return this.isAdmin() || this.isManager(); },
  canEditStock()      { return this.isAdmin() || this.isManager(); },
  canManageUsers()    { return this.isAdmin() || this.isManager(); },
  canAccessSuppliers(){ return this.isAdmin() || this.isManager(); },
  canAccessReports()  { return this.isAdmin() || this.isManager(); },
  canAccessSettings() { return this.isAdmin(); },
};
