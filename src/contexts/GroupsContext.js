import React, { createContext, useContext, useState } from 'react';
import { toast } from 'react-toastify';
import api from '../services/api';

const GroupsContext = createContext();

export const useGroups = () => {
  const context = useContext(GroupsContext);
  if (!context) {
    throw new Error('useGroups deve ser usado dentro de um GroupsProvider');
  }
  return context;
};

export const GroupsProvider = ({ children }) => {
  const [groups, setGroups] = useState([]);
  const [myGroups, setMyGroups] = useState([]);
  const [currentGroup, setCurrentGroup] = useState(null);
  const [loading, setLoading] = useState(false);

  const createGroup = async (groupData) => {
    try {
      setLoading(true);
      const response = await api.post('/grupos', groupData);
      const newGroup = response.data.grupo;
      
      setMyGroups(prev => [newGroup, ...prev]);
      toast.success('Grupo criado com sucesso!');
      return { success: true, group: newGroup };
    } catch (error) {
      const message = error.response?.data?.message || 'Erro ao criar grupo';
      toast.error(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  const searchGroups = async (filters = {}) => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      
      if (filters.materia) params.append('materia', filters.materia);
      if (filters.local) params.append('local', filters.local);
      if (filters.texto) params.append('texto', filters.texto);
      if (filters.pagina) params.append('pagina', filters.pagina);
      if (filters.limite) params.append('limite', filters.limite);

      const response = await api.get(`/grupos/buscar?${params}`);
      setGroups(response.data.grupos);
      return { success: true, pagination: response.data.paginacao };
    } catch (error) {
      const message = error.response?.data?.message || 'Erro ao buscar grupos';
      toast.error(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  const getGroupDetails = async (groupId) => {
    try {
      setLoading(true);
      const response = await api.get(`/grupos/${groupId}`);
      setCurrentGroup(response.data);
      return { success: true, group: response.data };
    } catch (error) {
      const message = error.response?.data?.message || 'Erro ao carregar grupo';
      toast.error(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  const joinGroup = async (groupId) => {
    try {
      await api.post(`/grupos/${groupId}/entrar`);
      toast.success('Você entrou no grupo com sucesso!');
      
      // Atualizar lista de grupos
      await searchGroups();
      await getMyGroups();
      
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Erro ao entrar no grupo';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  const leaveGroup = async (groupId) => {
    try {
      await api.delete(`/grupos/${groupId}/sair`);
      toast.success('Você saiu do grupo com sucesso!');
      
      // Atualizar listas
      setMyGroups(prev => prev.filter(g => g.id !== groupId));
      await searchGroups();
      
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Erro ao sair do grupo';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  const getMyGroups = async () => {
    try {
      const response = await api.get('/usuarios/grupos');
      setMyGroups(response.data.grupos);
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Erro ao carregar seus grupos';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  const deleteGroup = async (groupId) => {
    try {
      await api.delete(`/grupos/${groupId}`);
      toast.success('Grupo deletado com sucesso!');
      
      setMyGroups(prev => prev.filter(g => g.id !== groupId));
      setGroups(prev => prev.filter(g => g.id !== groupId));
      
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Erro ao deletar grupo';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  const value = {
    groups,
    myGroups,
    currentGroup,
    loading,
    createGroup,
    searchGroups,
    getGroupDetails,
    joinGroup,
    leaveGroup,
    getMyGroups,
    deleteGroup,
    setCurrentGroup
  };

  return (
    <GroupsContext.Provider value={value}>
      {children}
    </GroupsContext.Provider>
  );
};
