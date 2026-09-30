import { createContext, useContext, useState } from 'react';
import { api } from './api.js';

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('cb_user') || 'null'));

  async function login(email, password) {
    const data = await api('/auth/login', { method: 'POST', body: { email, password } });
    localStorage.setItem('cb_token', data.token);
    localStorage.setItem('cb_user', JSON.stringify(data.user));
    setUser(data.user);
    return data.user;
  }

  function logout() {
    localStorage.removeItem('cb_token');
    localStorage.removeItem('cb_user');
    setUser(null);
  }

  return <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>;
}
