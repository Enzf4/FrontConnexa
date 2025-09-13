import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Badge, Spinner, Alert, Dropdown } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useNotifications } from '../contexts/NotificationsContext';

const Notifications = () => {
  const { 
    notifications, 
    unreadCount, 
    loading, 
    getNotifications, 
    markAsRead, 
    markAllAsRead, 
    deleteNotification, 
    clearAllNotifications 
  } = useNotifications();
  
  const [filter, setFilter] = useState('all');
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    loadNotifications();
  }, [filter]);

  const loadNotifications = async () => {
    const filters = {};
    if (filter === 'unread') {
      filters.lida = false;
    }
    await getNotifications(filters);
  };

  const handleMarkAsRead = async (notificationId) => {
    setActionLoading(true);
    await markAsRead(notificationId);
    setActionLoading(false);
  };

  const handleMarkAllAsRead = async () => {
    setActionLoading(true);
    await markAllAsRead();
    setActionLoading(false);
  };

  const handleDeleteNotification = async (notificationId) => {
    setActionLoading(true);
    await deleteNotification(notificationId);
    setActionLoading(false);
  };

  const handleClearAll = async () => {
    if (!confirm('Tem certeza que deseja deletar todas as notificações?')) {
      return;
    }
    setActionLoading(true);
    await clearAllNotifications();
    setActionLoading(false);
  };

  const getNotificationIcon = (tipo) => {
    switch (tipo) {
      case 'nova_mensagem':
        return 'fas fa-comment text-primary';
      case 'novo_membro':
        return 'fas fa-user-plus text-success';
      case 'alteracao_grupo':
        return 'fas fa-edit text-warning';
      default:
        return 'fas fa-bell text-info';
    }
  };

  const getNotificationColor = (tipo) => {
    switch (tipo) {
      case 'nova_mensagem':
        return 'primary';
      case 'novo_membro':
        return 'success';
      case 'alteracao_grupo':
        return 'warning';
      default:
        return 'info';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = (now - date) / (1000 * 60);
    
    if (diffInMinutes < 1) {
      return 'Agora mesmo';
    } else if (diffInMinutes < 60) {
      return `${Math.floor(diffInMinutes)} min atrás`;
    } else if (diffInMinutes < 1440) {
      return `${Math.floor(diffInMinutes / 60)}h atrás`;
    } else {
      return date.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
  };

  const filteredNotifications = notifications.filter(notification => {
    if (filter === 'all') return true;
    if (filter === 'unread') return !notification.lida;
    return notification.tipo === filter;
  });

  if (loading) {
    return (
      <div className="loading">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Carregando notificações...</span>
        </Spinner>
      </div>
    );
  }

  return (
    <Container fluid>
      <Row className="mb-4">
        <Col>
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h1 className="h3 mb-1">
                <i className="fas fa-bell me-2"></i>
                Notificações
              </h1>
              <p className="text-muted mb-0">
                {unreadCount > 0 ? `${unreadCount} notificação(ões) não lida(s)` : 'Todas as notificações foram lidas'}
              </p>
            </div>
            <div className="d-flex gap-2">
              <Dropdown>
                <Dropdown.Toggle variant="outline-secondary" size="sm">
                  <i className="fas fa-filter me-1"></i>
                  Filtrar
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item 
                    active={filter === 'all'} 
                    onClick={() => setFilter('all')}
                  >
                    Todas
                  </Dropdown.Item>
                  <Dropdown.Item 
                    active={filter === 'unread'} 
                    onClick={() => setFilter('unread')}
                  >
                    Não lidas
                  </Dropdown.Item>
                  <Dropdown.Divider />
                  <Dropdown.Item 
                    active={filter === 'nova_mensagem'} 
                    onClick={() => setFilter('nova_mensagem')}
                  >
                    <i className="fas fa-comment me-2"></i>
                    Mensagens
                  </Dropdown.Item>
                  <Dropdown.Item 
                    active={filter === 'novo_membro'} 
                    onClick={() => setFilter('novo_membro')}
                  >
                    <i className="fas fa-user-plus me-2"></i>
                    Novos Membros
                  </Dropdown.Item>
                  <Dropdown.Item 
                    active={filter === 'alteracao_grupo'} 
                    onClick={() => setFilter('alteracao_grupo')}
                  >
                    <i className="fas fa-edit me-2"></i>
                    Alterações
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
              
              {notifications.length > 0 && (
                <Dropdown>
                  <Dropdown.Toggle variant="outline-primary" size="sm">
                    <i className="fas fa-cog me-1"></i>
                    Ações
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Dropdown.Item 
                      onClick={handleMarkAllAsRead}
                      disabled={actionLoading || unreadCount === 0}
                    >
                      {actionLoading ? (
                        <Spinner size="sm" className="me-2" />
                      ) : (
                        <i className="fas fa-check me-2"></i>
                      )}
                      Marcar todas como lidas
                    </Dropdown.Item>
                    <Dropdown.Divider />
                    <Dropdown.Item 
                      onClick={handleClearAll}
                      disabled={actionLoading}
                      className="text-danger"
                    >
                      {actionLoading ? (
                        <Spinner size="sm" className="me-2" />
                      ) : (
                        <i className="fas fa-trash me-2"></i>
                      )}
                      Deletar todas
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              )}
            </div>
          </div>
        </Col>
      </Row>

      {filteredNotifications.length === 0 ? (
        <Card>
          <Card.Body className="text-center py-5">
            <i className="fas fa-bell-slash fa-3x text-muted mb-3"></i>
            <h5 className="text-muted">
              {filter === 'all' ? 'Nenhuma notificação' : 'Nenhuma notificação encontrada'}
            </h5>
            <p className="text-muted">
              {filter === 'all' 
                ? 'Você não tem notificações ainda.' 
                : 'Tente ajustar os filtros de busca.'
              }
            </p>
            {filter !== 'all' && (
              <Button variant="outline-primary" onClick={() => setFilter('all')}>
                Ver Todas as Notificações
              </Button>
            )}
          </Card.Body>
        </Card>
      ) : (
        <Row>
          {filteredNotifications.map(notification => (
            <Col key={notification.id} className="mb-3">
              <Card className={`${!notification.lida ? 'border-start border-danger border-3' : ''}`}>
                <Card.Body>
                  <div className="d-flex align-items-start">
                    <div className="me-3">
                      <i className={`${getNotificationIcon(notification.tipo)} fa-lg`}></i>
                    </div>
                    <div className="flex-grow-1">
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <h6 className="mb-1">
                          {notification.titulo}
                          {!notification.lida && (
                            <Badge bg="danger" className="ms-2">Nova</Badge>
                          )}
                        </h6>
                        <div className="d-flex gap-1">
                          <small className="text-muted">
                            {formatDate(notification.created_at)}
                          </small>
                        </div>
                      </div>
                      
                      <p className="text-muted mb-2">{notification.conteudo}</p>
                      
                      {notification.grupo_nome && (
                        <div className="mb-2">
                          <Badge bg={getNotificationColor(notification.tipo)}>
                            <i className="fas fa-users me-1"></i>
                            {notification.grupo_nome}
                          </Badge>
                        </div>
                      )}
                      
                      <div className="d-flex gap-2">
                        {!notification.lida && (
                          <Button 
                            variant="outline-success" 
                            size="sm"
                            onClick={() => handleMarkAsRead(notification.id)}
                            disabled={actionLoading}
                          >
                            <i className="fas fa-check me-1"></i>
                            Marcar como lida
                          </Button>
                        )}
                        
                        {notification.grupo_id && (
                          <Button 
                            as={Link} 
                            to={`/groups/${notification.grupo_id}`} 
                            variant="outline-primary" 
                            size="sm"
                          >
                            <i className="fas fa-eye me-1"></i>
                            Ver Grupo
                          </Button>
                        )}
                        
                        <Button 
                          variant="outline-danger" 
                          size="sm"
                          onClick={() => handleDeleteNotification(notification.id)}
                          disabled={actionLoading}
                        >
                          <i className="fas fa-trash me-1"></i>
                          Deletar
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}

      {/* Estatísticas */}
      {notifications.length > 0 && (
        <Card className="mt-4">
          <Card.Header>
            <h5 className="mb-0">Estatísticas</h5>
          </Card.Header>
          <Card.Body>
            <Row>
              <Col md={3} className="text-center">
                <h4 className="text-primary">{notifications.length}</h4>
                <p className="text-muted mb-0">Total</p>
              </Col>
              <Col md={3} className="text-center">
                <h4 className="text-danger">{unreadCount}</h4>
                <p className="text-muted mb-0">Não lidas</p>
              </Col>
              <Col md={3} className="text-center">
                <h4 className="text-success">{notifications.filter(n => n.lida).length}</h4>
                <p className="text-muted mb-0">Lidas</p>
              </Col>
              <Col md={3} className="text-center">
                <h4 className="text-info">
                  {notifications.filter(n => n.tipo === 'nova_mensagem').length}
                </h4>
                <p className="text-muted mb-0">Mensagens</p>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      )}
    </Container>
  );
};

export default Notifications;
