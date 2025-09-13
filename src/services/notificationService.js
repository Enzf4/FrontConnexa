import api from './api';

export const notificationService = {
  // Obter notificações
  async getNotifications(filtros = {}) {
    try {
      const params = new URLSearchParams();
      Object.keys(filtros).forEach(key => {
        if (filtros[key] !== undefined) {
          params.append(key, filtros[key]);
        }
      });
      
      const response = await api.get(`/notificacoes?${params}`);
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Erro ao obter notificações' 
      };
    }
  },

  // Marcar como lida
  async markAsRead(id) {
    try {
      const response = await api.put(`/notificacoes/${id}/lida`);
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Erro ao marcar notificação' 
      };
    }
  },

  // Marcar todas como lidas
  async markAllAsRead() {
    try {
      const response = await api.put('/notificacoes/marcar-todas-lidas');
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Erro ao marcar notificações' 
      };
    }
  },

  // Deletar notificação
  async deleteNotification(id) {
    try {
      const response = await api.delete(`/notificacoes/${id}`);
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Erro ao deletar notificação' 
      };
    }
  },

  // Deletar todas as notificações
  async clearAllNotifications() {
    try {
      const response = await api.delete('/notificacoes/limpar-todas');
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Erro ao limpar notificações' 
      };
    }
  },

  // Obter estatísticas
  async getStatistics() {
    try {
      const response = await api.get('/notificacoes/estatisticas');
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Erro ao obter estatísticas' 
      };
    }
  },

  // Obter notificações por tipo
  async getNotificationsByType(tipo, filtros = {}) {
    try {
      const params = new URLSearchParams();
      Object.keys(filtros).forEach(key => {
        if (filtros[key] !== undefined) {
          params.append(key, filtros[key]);
        }
      });
      
      const response = await api.get(`/notificacoes/por-tipo/${tipo}?${params}`);
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Erro ao obter notificações por tipo' 
      };
    }
  }
};
