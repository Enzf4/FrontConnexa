// Exemplos de uso dos hooks e serviços da aplicação Connexa

import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useGroups } from '../hooks/useGroups';
import { useNotifications } from '../hooks/useNotifications';
import { authService } from '../services/authService';
import { groupService } from '../services/groupService';
import { messageService } from '../services/messageService';
import { notificationService } from '../services/notificationService';

// Exemplo 1: Uso do hook useAuth
const AuthExample = () => {
  const { user, loading, login, logout, isLoggedIn } = useAuth();
  const [formData, setFormData] = useState({ email: '', senha: '' });

  const handleLogin = async (e) => {
    e.preventDefault();
    const { success, error } = await login(formData.email, formData.senha);
    if (!success) {
      console.error('Erro no login:', error);
    }
  };

  if (loading) return <div>Carregando...</div>;

  return (
    <div>
      {isLoggedIn ? (
        <div>
          <h2>Bem-vindo, {user.nome}!</h2>
          <button onClick={logout}>Sair</button>
        </div>
      ) : (
        <form onSubmit={handleLogin}>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            placeholder="Email institucional"
          />
          <input
            type="password"
            value={formData.senha}
            onChange={(e) => setFormData({...formData, senha: e.target.value})}
            placeholder="Senha"
          />
          <button type="submit">Entrar</button>
        </form>
      )}
    </div>
  );
};

// Exemplo 2: Uso do hook useGroups
const GroupsExample = () => {
  const { groups, myGroups, loading, searchGroups, createGroup, joinGroup } = useGroups();
  const [filters, setFilters] = useState({ materia: '', local: '' });

  const handleSearch = () => {
    searchGroups(filters);
  };

  const handleCreateGroup = async () => {
    const groupData = {
      nome: 'Grupo de Estudo - Exemplo',
      materia: 'Cálculo I',
      objetivo: 'Estudar para a prova de Cálculo I',
      local: 'presencial',
      limite_participantes: 10
    };

    const { success, error } = await createGroup(groupData);
    if (!success) {
      console.error('Erro ao criar grupo:', error);
    }
  };

  const handleJoinGroup = async (groupId) => {
    const { success, error } = await joinGroup(groupId);
    if (!success) {
      console.error('Erro ao entrar no grupo:', error);
    }
  };

  if (loading) return <div>Carregando grupos...</div>;

  return (
    <div>
      <h2>Grupos de Estudo</h2>
      
      {/* Filtros */}
      <div>
        <input
          type="text"
          placeholder="Matéria"
          value={filters.materia}
          onChange={(e) => setFilters({...filters, materia: e.target.value})}
        />
        <select
          value={filters.local}
          onChange={(e) => setFilters({...filters, local: e.target.value})}
        >
          <option value="">Todos os locais</option>
          <option value="online">Online</option>
          <option value="presencial">Presencial</option>
        </select>
        <button onClick={handleSearch}>Buscar</button>
      </div>

      {/* Botão criar grupo */}
      <button onClick={handleCreateGroup}>Criar Grupo</button>

      {/* Lista de grupos */}
      <div>
        <h3>Grupos Encontrados ({groups.length})</h3>
        {groups.map(group => (
          <div key={group.id} style={{ border: '1px solid #ccc', margin: '10px', padding: '10px' }}>
            <h4>{group.nome}</h4>
            <p><strong>Matéria:</strong> {group.materia}</p>
            <p><strong>Objetivo:</strong> {group.objetivo}</p>
            <p><strong>Local:</strong> {group.local}</p>
            <p><strong>Participantes:</strong> {group.participantes_atual}/{group.limite_participantes}</p>
            <button onClick={() => handleJoinGroup(group.id)}>
              Entrar no Grupo
            </button>
          </div>
        ))}
      </div>

      {/* Meus grupos */}
      <div>
        <h3>Meus Grupos ({myGroups.length})</h3>
        {myGroups.map(group => (
          <div key={group.id} style={{ border: '1px solid #green', margin: '10px', padding: '10px' }}>
            <h4>{group.nome}</h4>
            <p><strong>Matéria:</strong> {group.materia}</p>
            <p><strong>Papel:</strong> {group.papel}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

// Exemplo 3: Uso do hook useNotifications
const NotificationsExample = () => {
  const { notifications, unreadCount, loading, markAsRead, markAllAsRead } = useNotifications();

  const handleMarkAsRead = async (id) => {
    const { success, error } = await markAsRead(id);
    if (!success) {
      console.error('Erro ao marcar como lida:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    const { success, error } = await markAllAsRead();
    if (!success) {
      console.error('Erro ao marcar todas como lidas:', error);
    }
  };

  if (loading) return <div>Carregando notificações...</div>;

  return (
    <div>
      <h2>Notificações ({unreadCount} não lidas)</h2>
      
      <button onClick={handleMarkAllAsRead}>
        Marcar Todas como Lidas
      </button>

      <div>
        {notifications.map(notification => (
          <div 
            key={notification.id} 
            style={{ 
              border: '1px solid #ccc', 
              margin: '10px', 
              padding: '10px',
              backgroundColor: notification.lida ? '#f9f9f9' : '#fff3cd'
            }}
          >
            <h4>{notification.titulo}</h4>
            <p>{notification.conteudo}</p>
            <p><strong>Tipo:</strong> {notification.tipo}</p>
            <p><strong>Data:</strong> {new Date(notification.created_at).toLocaleString()}</p>
            {!notification.lida && (
              <button onClick={() => handleMarkAsRead(notification.id)}>
                Marcar como Lida
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

// Exemplo 4: Uso direto dos serviços
const ServiceExample = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadMessages = async (groupId) => {
    setLoading(true);
    const { success, data, error } = await messageService.getMessages(groupId);
    
    if (success) {
      setMessages(data.mensagens);
    } else {
      console.error('Erro ao carregar mensagens:', error);
    }
    setLoading(false);
  };

  const sendMessage = async (groupId, conteudo) => {
    const { success, data, error } = await messageService.sendMessage(groupId, conteudo);
    
    if (success) {
      setMessages(prev => [...prev, data.mensagem]);
    } else {
      console.error('Erro ao enviar mensagem:', error);
    }
  };

  return (
    <div>
      <h2>Exemplo de Uso dos Serviços</h2>
      <button onClick={() => loadMessages(1)} disabled={loading}>
        {loading ? 'Carregando...' : 'Carregar Mensagens'}
      </button>
      
      <div>
        <h3>Mensagens ({messages.length})</h3>
        {messages.map(message => (
          <div key={message.id} style={{ border: '1px solid #ddd', margin: '5px', padding: '5px' }}>
            <strong>{message.usuario_nome}:</strong> {message.conteudo}
            <br />
            <small>{new Date(message.created_at).toLocaleString()}</small>
          </div>
        ))}
      </div>
    </div>
  );
};

// Exemplo 5: Componente completo integrado
const CompleteExample = () => {
  const { user, isLoggedIn } = useAuth();
  const { groups, loading: groupsLoading } = useGroups();
  const { notifications, unreadCount } = useNotifications();

  if (!isLoggedIn) {
    return <AuthExample />;
  }

  return (
    <div>
      <h1>Dashboard - {user.nome}</h1>
      
      <div style={{ display: 'flex', gap: '20px' }}>
        <div style={{ flex: 1 }}>
          <GroupsExample />
        </div>
        
        <div style={{ flex: 1 }}>
          <NotificationsExample />
        </div>
      </div>
      
      <div style={{ marginTop: '20px' }}>
        <ServiceExample />
      </div>
    </div>
  );
};

export default CompleteExample;
