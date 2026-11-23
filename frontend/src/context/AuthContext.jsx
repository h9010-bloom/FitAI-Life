import { createContext, useEffect, useMemo, useState } from 'react';

export const AuthContext = createContext(null);

const getStoredAuth = () => {
  if (typeof window === 'undefined') {
    return { user: null, token: null };
  }

  try {
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');

    return {
      user: storedUser ? JSON.parse(storedUser) : null,
      token: storedToken || null,
    };
  } catch {
    return { user: null, token: null };
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(getStoredAuth().user);
  const [token, setToken] = useState(getStoredAuth().token);

  useEffect(() => {
    const syncAuth = () => {
      const stored = getStoredAuth();
      setUser(stored.user);
      setToken(stored.token);
    };

    window.addEventListener('storage', syncAuth);
    window.addEventListener('auth:update', syncAuth);
    return () => {
      window.removeEventListener('storage', syncAuth);
      window.removeEventListener('auth:update', syncAuth);
    };
  }, []);

  const login = (userData, authToken) => {
  setUser(userData);
  setToken(authToken || null);

  if (typeof window !== 'undefined') {
    localStorage.setItem('user', JSON.stringify(userData));

    if (authToken) {
      localStorage.setItem('token', authToken);
    } else {
      localStorage.removeItem('token');
    }

    window.dispatchEvent(new Event('auth:update'));
  }
};

  const register = (userData) => {
    setUser(userData);
    if (typeof window !== 'undefined') {
      localStorage.setItem('user', JSON.stringify(userData));
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);

    if (typeof window !== 'undefined') {
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    }
  };

  const value = useMemo(() => ({ user, token, login, logout, register }), [user, token]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
