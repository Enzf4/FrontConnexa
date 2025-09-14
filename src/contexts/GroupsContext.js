import React, { createContext, useContext, useState, useCallback } from "react";
import { toast } from "react-toastify";
import api from "../services/api";

const GroupsContext = createContext();

export const useGroups = () => {
  const context = useContext(GroupsContext);
  if (!context) {
    throw new Error("useGroups deve ser usado dentro de um GroupsProvider");
  }
  return context;
};

export const GroupsProvider = ({ children }) => {
  const [groups, setGroups] = useState([]);
  const [myGroups, setMyGroups] = useState([]);
  const [currentGroup, setCurrentGroup] = useState(null);
  const [loading, setLoading] = useState(false);

  const createGroup = useCallback(async (groupData) => {
    try {
      setLoading(true);
      const response = await api.post("/grupos", groupData);
      const newGroup = response.data.grupo;

      setMyGroups((prev) => [newGroup, ...(Array.isArray(prev) ? prev : [])]);
      toast.success("Grupo criado com sucesso!");
      return { success: true, group: newGroup };
    } catch (error) {
      const message = error.response?.data?.message || "Erro ao criar grupo";
      toast.error(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  }, []);

  const searchGroups = useCallback(async (filters = {}) => {
    try {
      setLoading(true);
      const params = new URLSearchParams();

      if (filters.materia) params.append("materia", filters.materia);
      if (filters.local) params.append("local", filters.local);
      if (filters.texto) params.append("texto", filters.texto);
      if (filters.pagina) params.append("pagina", filters.pagina);
      if (filters.limite) params.append("limite", filters.limite);

      const response = await api.get(`/grupos/buscar?${params}`);
      // Ensure we always set an array
      const grupos = Array.isArray(response.data.grupos)
        ? response.data.grupos
        : [];
      setGroups(grupos);
      return { success: true, pagination: response.data.paginacao };
    } catch (error) {
      const message = error.response?.data?.message || "Erro ao buscar grupos";
      toast.error(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  }, []);

  const getMyGroups = useCallback(async () => {
    try {
      const response = await api.get("/usuarios/grupos");
      // Ensure we always set an array
      const grupos = Array.isArray(response.data.grupos)
        ? response.data.grupos
        : [];
      setMyGroups(grupos);
      return { success: true };
    } catch (error) {
      const message =
        error.response?.data?.message || "Erro ao carregar seus grupos";
      toast.error(message);
      // Set empty array on error to prevent undefined state
      setMyGroups([]);
      return { success: false, error: message };
    }
  }, []);

  const getGroupDetails = useCallback(async (groupId) => {
    try {
      setLoading(true);
      const response = await api.get(`/grupos/${groupId}`);
      setCurrentGroup(response.data);
      return { success: true, group: response.data };
    } catch (error) {
      const message = error.response?.data?.message || "Erro ao carregar grupo";
      toast.error(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  }, []);

  const joinGroup = useCallback(
    async (groupId) => {
      try {
        await api.post(`/grupos/${groupId}/entrar`);
        toast.success("Você entrou no grupo com sucesso!");

        // Atualizar lista de grupos
        await searchGroups();
        await getMyGroups();

        return { success: true };
      } catch (error) {
        const message =
          error.response?.data?.message || "Erro ao entrar no grupo";
        toast.error(message);
        return { success: false, error: message };
      }
    },
    [searchGroups, getMyGroups]
  );

  const leaveGroup = useCallback(
    async (groupId) => {
      try {
        await api.delete(`/grupos/${groupId}/sair`);
        toast.success("Você saiu do grupo com sucesso!");

        // Atualizar listas
        setMyGroups((prev) =>
          Array.isArray(prev) ? prev.filter((g) => g.id !== groupId) : []
        );
        await searchGroups();

        return { success: true };
      } catch (error) {
        const message =
          error.response?.data?.message || "Erro ao sair do grupo";
        toast.error(message);
        return { success: false, error: message };
      }
    },
    [searchGroups]
  );

  const deleteGroup = useCallback(async (groupId) => {
    try {
      await api.delete(`/grupos/${groupId}`);
      toast.success("Grupo deletado com sucesso!");

      setMyGroups((prev) =>
        Array.isArray(prev) ? prev.filter((g) => g.id !== groupId) : []
      );
      setGroups((prev) =>
        Array.isArray(prev) ? prev.filter((g) => g.id !== groupId) : []
      );

      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || "Erro ao deletar grupo";
      toast.error(message);
      return { success: false, error: message };
    }
  }, []);

  const setCurrentGroupCallback = useCallback((group) => {
    setCurrentGroup(group);
  }, []);

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
    setCurrentGroup: setCurrentGroupCallback,
  };

  return (
    <GroupsContext.Provider value={value}>{children}</GroupsContext.Provider>
  );
};
