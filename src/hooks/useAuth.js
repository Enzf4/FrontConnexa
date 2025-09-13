import { useState, useEffect } from 'react';
import { authService } from '../services/authService';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      if (authService.isLoggedIn()) {
        const currentUser = authService.getCurrentUser();
        setUser(currentUser);
        
        // Verificar se token ainda é válido
        const { success } = await authService.verifyToken();
        if (!success) {
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
    }
    return { success, error };
  };

  const cadastrar = async (dadosUsuario) => {
    const { success, data, error } = await authService.cadastrar(dadosUsuario);
    if (success) {
      setUser(data.usuario);
    }
    return { success, error };
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  const resetPassword = async (email) => {
    return await authService.resetPassword(email);
  };

  const confirmResetPassword = async (token, novaSenha) => {
    return await authService.confirmResetPassword(token, novaSenha);
  };

  const updateUser = (userData) => {
    setUser(prev => ({ ...prev, ...userData }));
  };

  return {
    user,
    loading,
    login,
    cadastrar,
    logout,
    resetPassword,
    confirmResetPassword,
    updateUser,
    isLoggedIn: !!user
  };
};
