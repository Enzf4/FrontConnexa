import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { authService } from '../services/authService';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      if (authService.isLoggedIn()) {
        const currentUser = authService.getCurrentUser();
        setUser(currentUser);
        
        // Verificar se token ainda é válido apenas se houver token
        try {
          const { success } = await authService.verifyToken();
          if (!success) {
            authService.logout();
            setUser(null);
          }
        } catch (error) {
          // Se houver erro na verificação, fazer logout
          authService.logout();
          setUser(null);
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email, senha) => {
    const { success, data, error } = await authService.login(email, senha);
    if (success) {
      setUser(data.usuario);
      toast.success('Login realizado com sucesso!');
    } else {
      toast.error(error);
    }
    return { success, error };
  };

  const register = async (userData) => {
    const { success, data, error } = await authService.cadastrar(userData);
    if (success) {
      setUser(data.usuario);
      toast.success('Cadastro realizado com sucesso!');
    } else {
      toast.error(error);
    }
    return { success, error };
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    toast.info('Logout realizado com sucesso!');
  };

  const updateUser = (userData) => {
    setUser(prev => ({ ...prev, ...userData }));
  };

  const resetPassword = async (email) => {
    const { success, error } = await authService.resetPassword(email);
    if (success) {
      toast.success('Email de recuperação enviado!');
    } else {
      toast.error(error);
    }
    return { success, error };
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    updateUser,
    resetPassword
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
