import api from './api';

export const messageService = {
  // Obter mensagens
  async getMessages(groupId, pagina = 1, limite = 50) {
    try {
      const response = await api.get(`/grupos/${groupId}/mensagens`, {
        params: { pagina, limite }
      });
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Erro ao obter mensagens' 
      };
    }
  },

  // Enviar mensagem
  async sendMessage(groupId, conteudo) {
    try {
      const response = await api.post(`/grupos/${groupId}/mensagens`, {
        conteudo
      });
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Erro ao enviar mensagem' 
      };
    }
  },

  // Obter últimas mensagens
  async getLatestMessages(groupId, limite = 10) {
    try {
      const response = await api.get(`/grupos/${groupId}/mensagens/ultimas`, {
        params: { limite }
      });
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Erro ao obter mensagens' 
      };
    }
  },

  // Deletar mensagem
  async deleteMessage(groupId, messageId) {
    try {
      const response = await api.delete(`/grupos/${groupId}/mensagens/${messageId}`);
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Erro ao deletar mensagem' 
      };
    }
  }
};
