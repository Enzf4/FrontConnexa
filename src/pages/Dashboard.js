import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Badge, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useGroups } from '../contexts/GroupsContext';
import { useNotifications } from '../contexts/NotificationsContext';

const Dashboard = () => {
  const { user } = useAuth();
  const { myGroups = [], getMyGroups, loading: groupsLoading } = useGroups();
  const { notifications = [], unreadCount = 0 } = useNotifications();

  useEffect(() => {
    if (user) {
      getMyGroups();
    }
  }, [user]);

  const recentGroups = myGroups?.slice(0, 3) || [];
  const recentNotifications = notifications?.slice(0, 5) || [];

  const getGroupStatus = (group) => {
    if (group.participantes_atual >= group.limite_participantes) {
      return { text: 'Lotado', variant: 'danger' };
    } else if (group.participantes_atual >= group.limite_participantes * 0.8) {
      return { text: 'Quase lotado', variant: 'warning' };
    } else {
      return { text: 'Disponível', variant: 'success' };
    }
  };

  const getNotificationIcon = (tipo) => {
    switch (tipo) {
      case 'nova_mensagem':
        return 'fas fa-comment';
      case 'novo_membro':
        return 'fas fa-user-plus';
      case 'alteracao_grupo':
        return 'fas fa-edit';
      default:
        return 'fas fa-bell';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  if (groupsLoading) {
    return (
      <div className="loading">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Carregando...</span>
        </Spinner>
      </div>
    );
  }

  return (
    <Container fluid>
      <Row className="mb-4">
        <Col>
          <h1 className="h3 mb-1">Olá, {user?.nome?.split(' ')[0]}! 👋</h1>
          <p className="text-muted">Bem-vindo ao Connexa. Aqui está um resumo da sua atividade.</p>
        </Col>
      </Row>

      {/* Cards de Estatísticas */}
      <Row className="mb-4">
        <Col md={3} className="mb-3">
          <Card className="text-center h-100">
            <Card.Body>
              <i className="fas fa-users fa-2x text-primary mb-2"></i>
              <h4 className="mb-1">{myGroups?.length || 0}</h4>
              <p className="text-muted mb-0">Meus Grupos</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3} className="mb-3">
          <Card className="text-center h-100">
            <Card.Body>
              <i className="fas fa-bell fa-2x text-warning mb-2"></i>
              <h4 className="mb-1">{unreadCount}</h4>
              <p className="text-muted mb-0">Notificações</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3} className="mb-3">
          <Card className="text-center h-100">
            <Card.Body>
              <i className="fas fa-graduation-cap fa-2x text-success mb-2"></i>
              <h4 className="mb-1">{user?.curso}</h4>
              <p className="text-muted mb-0">Seu Curso</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3} className="mb-3">
          <Card className="text-center h-100">
            <Card.Body>
              <i className="fas fa-calendar fa-2x text-info mb-2"></i>
              <h4 className="mb-1">{user?.periodo}</h4>
              <p className="text-muted mb-0">Período</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row>
        {/* Meus Grupos Recentes */}
        <Col lg={8} className="mb-4">
          <Card className="h-100">
            <Card.Header className="d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Meus Grupos</h5>
              <div>
                <Button as={Link} to="/groups" variant="outline-primary" size="sm" className="me-2">
                  Ver Todos
                </Button>
                <Button as={Link} to="/groups/create" variant="primary" size="sm">
                  <i className="fas fa-plus me-1"></i>
                  Criar Grupo
                </Button>
              </div>
            </Card.Header>
            <Card.Body>
              {recentGroups.length === 0 ? (
                <div className="text-center py-4">
                  <i className="fas fa-users fa-3x text-muted mb-3"></i>
                  <h6 className="text-muted">Você ainda não participa de nenhum grupo</h6>
                  <p className="text-muted">Que tal criar ou buscar um grupo de estudo?</p>
                  <Button as={Link} to="/groups" variant="primary">
                    Buscar Grupos
                  </Button>
                </div>
              ) : (
                <div className="list-group list-group-flush">
                  {recentGroups.map(group => {
                    const status = getGroupStatus(group);
                    return (
                      <div key={group.id} className="list-group-item px-0">
                        <div className="d-flex justify-content-between align-items-start">
                          <div className="flex-grow-1">
                            <h6 className="mb-1">
                              <Link 
                                to={`/groups/${group.id}`} 
                                className="text-decoration-none"
                              >
                                {group.nome}
                              </Link>
                            </h6>
                            <p className="text-muted mb-1">{group.materia}</p>
                            <small className="text-muted">
                              <i className="fas fa-map-marker-alt me-1"></i>
                              {group.local === 'online' ? 'Online' : 'Presencial'} • 
                              <i className="fas fa-users me-1 ms-2"></i>
                              {group.participantes_atual}/{group.limite_participantes} participantes
                            </small>
                          </div>
                          <div className="text-end">
                            <Badge bg={status.variant} className="mb-1">
                              {status.text}
                            </Badge>
                            <br />
                            <small className="text-muted">
                              {formatDate(group.created_at)}
                            </small>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>

        {/* Notificações Recentes */}
        <Col lg={4} className="mb-4">
          <Card className="h-100">
            <Card.Header className="d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Notificações Recentes</h5>
              <Button as={Link} to="/notifications" variant="outline-primary" size="sm">
                Ver Todas
              </Button>
            </Card.Header>
            <Card.Body>
              {recentNotifications.length === 0 ? (
                <div className="text-center py-4">
                  <i className="fas fa-bell-slash fa-2x text-muted mb-2"></i>
                  <p className="text-muted mb-0">Nenhuma notificação</p>
                </div>
              ) : (
                <div className="list-group list-group-flush">
                  {recentNotifications.map(notification => (
                    <div 
                      key={notification.id} 
                      className={`list-group-item px-0 ${!notification.lida ? 'notification-item unread' : ''}`}
                    >
                      <div className="d-flex align-items-start">
                        <i className={`${getNotificationIcon(notification.tipo)} me-2 mt-1`}></i>
                        <div className="flex-grow-1">
                          <h6 className="mb-1 small">{notification.titulo}</h6>
                          <p className="text-muted mb-1 small">{notification.conteudo}</p>
                          <small className="text-muted">
                            {formatDate(notification.created_at)}
                          </small>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Ações Rápidas */}
      <Row>
        <Col>
          <Card>
            <Card.Header>
              <h5 className="mb-0">Ações Rápidas</h5>
            </Card.Header>
            <Card.Body>
              <Row>
                <Col md={3} className="mb-3">
                  <Button 
                    as={Link} 
                    to="/groups" 
                    variant="outline-primary" 
                    className="w-100 h-100 d-flex flex-column align-items-center justify-content-center py-3"
                  >
                    <i className="fas fa-search fa-2x mb-2"></i>
                    <span>Buscar Grupos</span>
                  </Button>
                </Col>
                <Col md={3} className="mb-3">
                  <Button 
                    as={Link} 
                    to="/groups/create" 
                    variant="outline-success" 
                    className="w-100 h-100 d-flex flex-column align-items-center justify-content-center py-3"
                  >
                    <i className="fas fa-plus fa-2x mb-2"></i>
                    <span>Criar Grupo</span>
                  </Button>
                </Col>
                <Col md={3} className="mb-3">
                  <Button 
                    as={Link} 
                    to="/profile" 
                    variant="outline-info" 
                    className="w-100 h-100 d-flex flex-column align-items-center justify-content-center py-3"
                  >
                    <i className="fas fa-user fa-2x mb-2"></i>
                    <span>Meu Perfil</span>
                  </Button>
                </Col>
                <Col md={3} className="mb-3">
                  <Button 
                    as={Link} 
                    to="/notifications" 
                    variant="outline-warning" 
                    className="w-100 h-100 d-flex flex-column align-items-center justify-content-center py-3"
                  >
                    <i className="fas fa-bell fa-2x mb-2"></i>
                    <span>Notificações</span>
                    {unreadCount > 0 && (
                      <Badge bg="danger" className="position-absolute top-0 end-0">
                        {unreadCount}
                      </Badge>
                    )}
                  </Button>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Dashboard;
