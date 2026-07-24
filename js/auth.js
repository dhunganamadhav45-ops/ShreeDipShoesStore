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

  requireRole(...roles) {
    const session = this.getSession();
    if (!session || !roles.includes(session.role)) {
      App.toast('Access Denied', 'You do not have permission for this action.', 'danger');
      return false;
    }
    return true;
  },

  isAdmin()   { const s = this.getSession(); return s && s.role === 'admin'; },
  isManager() { const s = this.getSession(); return s && ['admin','manager'].includes(s.role); },
};
