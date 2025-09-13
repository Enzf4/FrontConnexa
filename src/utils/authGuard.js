// Utilitário para verificar se o usuário está autenticado
export const isAuthenticated = () => {
  const token = localStorage.getItem('token');
  const user = localStorage.getItem('user');
  return !!(token && user);
};

// Utilitário para obter o usuário atual
export const getCurrentUser = () => {
  try {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  } catch (error) {
    return null;
  }
};

// Utilitário para limpar dados de autenticação
export const clearAuth = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

// Utilitário para verificar se deve fazer requisições
export const shouldMakeRequests = () => {
  return isAuthenticated() && getCurrentUser();
};
