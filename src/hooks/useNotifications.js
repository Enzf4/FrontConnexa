import { useState, useEffect } from 'react';
import { notificationService } from '../services/notificationService';

export const useNotifications = (filtros = {}) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({});

  const getNotifications = async (novosFiltros = {}) => {
    setLoading(true);
    const { success, data, error } = await notificationService.getNotifications({
      ...filtros,
      ...novosFiltros
    });
    
    if (success) {
      setNotifications(data.notificacoes);
      setUnreadCount(data.estatisticas?.totalNaoLidas || 0);
      setPagination(data.paginacao);
    } else {
      console.error('Erro ao obter notificações:', error);
    }
    setLoading(false);
  };

  const markAsRead = async (id) => {
    const { success, data, error } = await notificationService.markAsRead(id);
    
    if (success) {
      setNotifications(prev => 
        prev.map(notif => 
          notif.id === id ? { ...notif, lida: true } : notif
        )
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    }
    
    return { success, data, error };
  };

  const markAllAsRead = async () => {
    const { success, data, error } = await notificationService.markAllAsRead();
    
    if (success) {
      setNotifications(prev => 
        prev.map(notif => ({ ...notif, lida: true }))
      );
      setUnreadCount(0);
    }
    
    return { success, data, error };
  };

  const deleteNotification = async (id) => {
    const { success, data, error } = await notificationService.deleteNotification(id);
    
    if (success) {
      const deletedNotif = notifications.find(n => n.id === id);
      setNotifications(prev => prev.filter(n => n.id !== id));
      
      if (deletedNotif && !deletedNotif.lida) {
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    }
    
    return { success, data, error };
  };

  const clearAllNotifications = async () => {
    const { success, data, error } = await notificationService.clearAllNotifications();
    
    if (success) {
      setNotifications([]);
      setUnreadCount(0);
    }
    
    return { success, data, error };
  };

  const getStatistics = async () => {
    return await notificationService.getStatistics();
  };

  const getNotificationsByType = async (tipo, filtros = {}) => {
    setLoading(true);
    const { success, data, error } = await notificationService.getNotificationsByType(tipo, filtros);
    
    if (success) {
      setNotifications(data.notificacoes);
      setPagination(data.paginacao);
    }
    setLoading(false);
    
    return { success, data, error };
  };

  useEffect(() => {
    getNotifications();
  }, []);

  return {
    notifications,
    unreadCount,
    loading,
    pagination,
    getNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAllNotifications,
    getStatistics,
    getNotificationsByType,
    refresh: () => getNotifications()
  };
};
