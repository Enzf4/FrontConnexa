import api from "./api";

export const groupService = {
  // Buscar grupos
  async searchGroups(filtros = {}) {
    try {
      const params = new URLSearchParams();
      Object.keys(filtros).forEach((key) => {
        if (filtros[key]) {
          params.append(key, filtros[key]);
        }
      });

      const response = await api.get(`/grupos/buscar?${params}`);
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || "Erro ao buscar grupos",
      };
    }
  },

  // Obter grupo por ID
  async getGroup(id) {
    try {
      const response = await api.get(`/grupos/${id}`);
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || "Erro ao obter grupo",
      };
    }
  },

  // Criar grupo
  async createGroup(dadosGrupo) {
    try {
      const response = await api.post("/grupos", dadosGrupo);
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || "Erro ao criar grupo",
      };
    }
  },

  // Entrar em grupo
  async joinGroup(id) {
    try {
      const response = await api.post(`/grupos/${id}/entrar`);
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || "Erro ao entrar no grupo",
      };
    }
  },

  // Sair do grupo
  async leaveGroup(id) {
    try {
      const response = await api.delete(`/grupos/${id}/sair`);
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || "Erro ao sair do grupo",
      };
    }
  },

  // Deletar grupo
  async deleteGroup(id) {
    try {
      const response = await api.delete(`/grupos/${id}`);
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || "Erro ao deletar grupo",
      };
    }
  },

  // Obter grupos do usuário
  async getUserGroups() {
    try {
      const response = await api.get("/usuarios/grupos");
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error:
          error.response?.data?.message || "Erro ao obter grupos do usuário",
      };
    }
  },

  // Obter participantes
  async getParticipants(id) {
    try {
      const response = await api.get(`/grupos/${id}/participantes`);
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || "Erro ao obter participantes",
      };
    }
  },
};
