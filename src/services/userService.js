import api from './api';

export const userService = {
  // Obter perfil
  async getProfile() {
    try {
      const response = await api.get('/usuarios/perfil');
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Erro ao obter perfil' 
      };
    }
  },

  // Atualizar perfil
  async updateProfile(dados, fotoPerfil) {
    try {
      const formData = new FormData();
      
      // Adicionar dados do formulário
      Object.keys(dados).forEach(key => {
        if (dados[key] !== undefined && dados[key] !== null) {
          formData.append(key, dados[key]);
        }
      });
      
      // Adicionar foto se fornecida
      if (fotoPerfil) {
        formData.append('foto_perfil', fotoPerfil);
      }
      
      const response = await api.put('/usuarios/perfil', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Erro ao atualizar perfil' 
      };
    }
  },

  // Obter grupos do usuário
  async getUserGroups() {
    try {
      const response = await api.get('/usuarios/grupos');
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Erro ao obter grupos' 
      };
    }
  },

  // Deletar conta
  async deleteAccount(senha) {
    try {
      const response = await api.delete('/usuarios/conta', { 
        data: { senha } 
      });
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Erro ao deletar conta' 
      };
    }
  }
};
