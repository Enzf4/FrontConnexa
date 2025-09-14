import api from "./api";

export const userService = {
  // Obter perfil
  async getProfile() {
    try {
      const response = await api.get("/usuarios/perfil");
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || "Erro ao obter perfil",
      };
    }
  },

  // Atualizar perfil
  async updateProfile(dados) {
    try {
      const response = await api.put("/usuarios/perfil", dados);
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || "Erro ao atualizar perfil",
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
        error: error.response?.data?.message || "Erro ao obter grupos",
      };
    }
  },

  // Obter lista de avatares disponíveis
  async getAvailableAvatars() {
    try {
      const response = await api.get("/usuarios/avatares");
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || "Erro ao obter avatares",
      };
    }
  },

  // Deletar conta
  async deleteAccount(senha) {
    try {
      const response = await api.delete("/usuarios/conta", {
        data: { senha },
      });
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || "Erro ao deletar conta",
      };
    }
  },
};
