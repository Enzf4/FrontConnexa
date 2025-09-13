import { useState, useEffect } from 'react';
import { groupService } from '../services/groupService';

export const useGroups = (filtros = {}) => {
  const [groups, setGroups] = useState([]);
  const [myGroups, setMyGroups] = useState([]);
  const [currentGroup, setCurrentGroup] = useState(null);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({});

  const searchGroups = async (novosFiltros = {}) => {
    setLoading(true);
    const { success, data, error } = await groupService.searchGroups({
      ...filtros,
      ...novosFiltros
    });
    
    if (success) {
      setGroups(data.grupos);
      setPagination(data.paginacao);
    } else {
      console.error('Erro ao buscar grupos:', error);
    }
    setLoading(false);
  };

  const getGroupDetails = async (id) => {
    setLoading(true);
    const { success, data, error } = await groupService.getGroup(id);
    
    if (success) {
      setCurrentGroup(data);
    } else {
      console.error('Erro ao obter grupo:', error);
    }
    setLoading(false);
    
    return { success, data, error };
  };

  const createGroup = async (dadosGrupo) => {
    setLoading(true);
    const { success, data, error } = await groupService.createGroup(dadosGrupo);
    
    if (success) {
      setMyGroups(prev => [data.grupo, ...prev]);
    }
    setLoading(false);
    
    return { success, data, error };
  };

  const joinGroup = async (id) => {
    const { success, data, error } = await groupService.joinGroup(id);
    
    if (success) {
      // Atualizar listas
      await searchGroups();
      await getMyGroups();
    }
    
    return { success, data, error };
  };

  const leaveGroup = async (id) => {
    const { success, data, error } = await groupService.leaveGroup(id);
    
    if (success) {
      setMyGroups(prev => prev.filter(g => g.id !== id));
      await searchGroups();
    }
    
    return { success, data, error };
  };

  const deleteGroup = async (id) => {
    const { success, data, error } = await groupService.deleteGroup(id);
    
    if (success) {
      setMyGroups(prev => prev.filter(g => g.id !== id));
      setGroups(prev => prev.filter(g => g.id !== id));
    }
    
    return { success, data, error };
  };

  const getMyGroups = async () => {
    const { success, data, error } = await groupService.getUserGroups();
    
    if (success) {
      setMyGroups(data.grupos);
    } else {
      console.error('Erro ao obter grupos do usuário:', error);
    }
    
    return { success, data, error };
  };

  useEffect(() => {
    searchGroups();
    getMyGroups();
  }, []);

  return {
    groups,
    myGroups,
    currentGroup,
    loading,
    pagination,
    searchGroups,
    getGroupDetails,
    createGroup,
    joinGroup,
    leaveGroup,
    deleteGroup,
    getMyGroups,
    setCurrentGroup,
    refresh: () => {
      searchGroups();
      getMyGroups();
    }
  };
};
