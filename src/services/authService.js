import api from './api';

export const authService = {
  // Login
  async login(email, senha) {
    try {
      const response = await api.post('/auth/login', { email, senha });
      const { token, usuario } = response.data;
      
      // Salvar no localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(usuario));
      
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Erro ao fazer login' 
      };
    }
  },

  // Cadastro
  async cadastrar(dadosUsuario) {
    try {
      const response = await api.post('/usuarios/cadastro', dadosUsuario);
      const { token, usuario } = response.data;
      
      // Salvar no localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(usuario));
      
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Erro ao cadastrar' 
      };
    }
  },

  // Logout
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  },

  // Verificar se está logado
  isLoggedIn() {
    return !!localStorage.getItem('token');
  },

  // Obter usuário atual
  getCurrentUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  // Verificar token
  async verifyToken() {
    try {
      const response = await api.get('/auth/verify-token');
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: 'Token inválido' };
    }
  },

  // Reset de senha
  async resetPassword(email) {
    try {
      const response = await api.post('/auth/reset-password', { email });
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Erro ao enviar email de recuperação' 
      };
    }
  },

  // Confirmar reset de senha
  async confirmResetPassword(token, novaSenha) {
    try {
      const response = await api.post('/auth/confirm-reset-password', { 
        token, 
        nova_senha: novaSenha 
      });
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Erro ao alterar senha' 
      };
    }
  }
};
