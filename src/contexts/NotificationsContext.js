import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useAuth } from './AuthContext';
import { shouldMakeRequests } from '../utils/authGuard';
import api from '../services/api';

const NotificationsContext = createContext();

export const useNotifications = () => {
  const context = useContext(NotificationsContext);
  if (!context) {
    throw new Error('useNotifications deve ser usado dentro de um NotificationsProvider');
  }
  return context;
};

export const NotificationsProvider = ({ children }) => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const getNotifications = async (filters = {}) => {
    // Não fazer requisições se usuário não estiver autenticado
    if (!shouldMakeRequests()) {
      return { success: false, error: 'Usuário não autenticado' };
    }

    try {
      setLoading(true);
      const params = new URLSearchParams();
      
      if (filters.lida !== undefined) params.append('lida', filters.lida);
      if (filters.pagina) params.append('pagina', filters.pagina);
      if (filters.limite) params.append('limite', filters.limite);

      const response = await api.get(`/notificacoes?${params}`);
      setNotifications(response.data.notificacoes);
      setUnreadCount(response.data.estatisticas?.totalNaoLidas || 0);
      return { success: true, pagination: response.data.paginacao };
    } catch (error) {
      const message = error.response?.data?.message || 'Erro ao carregar notificações';
      toast.error(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      await api.put(`/notificacoes/${notificationId}/lida`);
      
      setNotifications(prev => 
        prev.map(notif => 
          notif.id === notificationId 
            ? { ...notif, lida: true }
            : notif
        )
      );
      
      setUnreadCount(prev => Math.max(0, prev - 1));
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Erro ao marcar notificação';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  const markAllAsRead = async () => {
    try {
      await api.put('/notificacoes/marcar-todas-lidas');
      
      setNotifications(prev => 
        prev.map(notif => ({ ...notif, lida: true }))
      );
      
      setUnreadCount(0);
      toast.success('Todas as notificações foram marcadas como lidas!');
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Erro ao marcar notificações';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  const deleteNotification = async (notificationId) => {
    try {
      await api.delete(`/notificacoes/${notificationId}`);
      
      const deletedNotif = notifications.find(n => n.id === notificationId);
      setNotifications(prev => prev.filter(n => n.id !== notificationId));
      
      if (deletedNotif && !deletedNotif.lida) {
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
      
      toast.success('Notificação deletada!');
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Erro ao deletar notificação';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  const clearAllNotifications = async () => {
    try {
      await api.delete('/notificacoes/limpar-todas');
      
      setNotifications([]);
      setUnreadCount(0);
      toast.success('Todas as notificações foram removidas!');
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Erro ao limpar notificações';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  const getStatistics = async () => {
    try {
      const response = await api.get('/notificacoes/estatisticas');
      return { success: true, stats: response.data.estatisticas };
    } catch (error) {
      const message = error.response?.data?.message || 'Erro ao carregar estatísticas';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  // Carregar notificações automaticamente apenas se usuário estiver logado
  useEffect(() => {
    if (user) {
      getNotifications();
    } else {
      // Limpar notificações se usuário não estiver logado
      setNotifications([]);
      setUnreadCount(0);
    }
  }, [user]);

  const value = {
    notifications,
    unreadCount,
    loading,
    getNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAllNotifications,
    getStatistics
  };

  return (
    <NotificationsContext.Provider value={value}>
      {children}
    </NotificationsContext.Provider>
  );
};
