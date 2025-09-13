import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Badge, Spinner, Alert, Modal } from 'react-bootstrap';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useGroups } from '../contexts/GroupsContext';

const GroupDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { currentGroup, getGroupDetails, joinGroup, leaveGroup, deleteGroup, loading } = useGroups();
  
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    if (id) {
      getGroupDetails(id);
    }
  }, [id]);

  const isUserInGroup = () => {
    if (!currentGroup || !user) return false;
    return currentGroup.participantes?.some(p => p.id === user.id);
  };

  const isUserAdmin = () => {
    if (!currentGroup || !user) return false;
    return currentGroup.participantes?.some(p => p.id === user.id && p.papel === 'admin');
  };

  const isGroupFull = () => {
    if (!currentGroup) return false;
    return currentGroup.grupo.participantes_atual >= currentGroup.grupo.limite_participantes;
  };

  const handleJoinGroup = async () => {
    setActionLoading(true);
    const result = await joinGroup(id);
    if (result.success) {
      // Recarregar detalhes do grupo
      await getGroupDetails(id);
    }
    setActionLoading(false);
  };

  const handleLeaveGroup = async () => {
    setActionLoading(true);
    const result = await leaveGroup(id);
    if (result.success) {
      navigate('/groups');
    }
    setActionLoading(false);
    setShowLeaveModal(false);
  };

  const handleDeleteGroup = async () => {
    setActionLoading(true);
    const result = await deleteGroup(id);
    if (result.success) {
      navigate('/groups');
    }
    setActionLoading(false);
    setShowDeleteModal(false);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="loading">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Carregando grupo...</span>
        </Spinner>
      </div>
    );
  }

  if (!currentGroup) {
    return (
      <Container>
        <Alert variant="danger">
          <i className="fas fa-exclamation-triangle me-2"></i>
          Grupo não encontrado ou você não tem permissão para visualizá-lo.
        </Alert>
        <Button variant="primary" onClick={() => navigate('/groups')}>
          Voltar para Grupos
        </Button>
      </Container>
    );
  }

  const { grupo, participantes } = currentGroup;
  const userInGroup = isUserInGroup();
  const userAdmin = isUserAdmin();
  const groupFull = isGroupFull();

  return (
    <Container fluid>
      <Row className="mb-4">
        <Col>
          <div className="d-flex justify-content-between align-items-start">
            <div>
              <h1 className="h3 mb-1">{grupo.nome}</h1>
              <p className="text-muted mb-0">
                <i className="fas fa-book me-1"></i>
                {grupo.materia} • 
                <i className={`fas fa-${grupo.local === 'online' ? 'video' : 'map-marker-alt'} me-1 ms-2`}></i>
                {grupo.local === 'online' ? 'Online' : 'Presencial'}
              </p>
            </div>
            <div>
              <Button 
                variant="outline-secondary" 
                onClick={() => navigate('/groups')}
                className="me-2"
              >
                <i className="fas fa-arrow-left me-1"></i>
                Voltar
              </Button>
              {userInGroup && (
                <Button 
                  as={Link} 
                  to={`/groups/${id}/chat`} 
                  variant="primary"
                >
                  <i className="fas fa-comments me-1"></i>
                  Chat do Grupo
                </Button>
              )}
            </div>
          </div>
        </Col>
      </Row>

      <Row>
        {/* Informações do Grupo */}
        <Col lg={8} className="mb-4">
          <Card className="mb-4">
            <Card.Header>
              <h5 className="mb-0">Sobre o Grupo</h5>
            </Card.Header>
            <Card.Body>
              <p className="card-text">{grupo.objetivo}</p>
              
              <div className="row">
                <div className="col-md-6">
                  <h6>Informações</h6>
                  <ul className="list-unstyled">
                    <li><strong>Matéria:</strong> {grupo.materia}</li>
                    <li><strong>Local:</strong> {grupo.local === 'online' ? 'Online' : 'Presencial'}</li>
                    <li><strong>Participantes:</strong> {grupo.participantes_atual}/{grupo.limite_participantes}</li>
                    <li><strong>Criado em:</strong> {formatDate(grupo.created_at)}</li>
                    <li><strong>Criado por:</strong> {grupo.criador_nome}</li>
                  </ul>
                </div>
                <div className="col-md-6">
                  <h6>Status</h6>
                  <div className="mb-2">
                    <Badge bg={groupFull ? 'danger' : grupo.participantes_atual >= grupo.limite_participantes * 0.8 ? 'warning' : 'success'}>
                      {groupFull ? 'Lotado' : grupo.participantes_atual >= grupo.limite_participantes * 0.8 ? 'Quase lotado' : 'Disponível'}
                    </Badge>
                  </div>
                  <div className="progress mb-2" style={{ height: '8px' }}>
                    <div 
                      className="progress-bar" 
                      role="progressbar" 
                      style={{ 
                        width: `${(grupo.participantes_atual / grupo.limite_participantes) * 100}%` 
                      }}
                    ></div>
                  </div>
                  <small className="text-muted">
                    {grupo.participantes_atual} de {grupo.limite_participantes} vagas preenchidas
                  </small>
                </div>
              </div>
            </Card.Body>
          </Card>

          {/* Ações do Grupo */}
          <Card>
            <Card.Header>
              <h5 className="mb-0">Ações</h5>
            </Card.Header>
            <Card.Body>
              <div className="d-flex gap-2 flex-wrap">
                {!userInGroup ? (
                  <Button 
                    variant="success" 
                    onClick={handleJoinGroup}
                    disabled={actionLoading || groupFull}
                  >
                    {actionLoading ? (
                      <Spinner size="sm" className="me-2" />
                    ) : (
                      <i className="fas fa-user-plus me-2"></i>
                    )}
                    {groupFull ? 'Grupo Lotado' : 'Entrar no Grupo'}
                  </Button>
                ) : (
                  <>
                    <Button 
                      as={Link} 
                      to={`/groups/${id}/chat`} 
                      variant="primary"
                    >
                      <i className="fas fa-comments me-2"></i>
                      Ir para Chat
                    </Button>
                    {!userAdmin && (
                      <Button 
                        variant="outline-danger" 
                        onClick={() => setShowLeaveModal(true)}
                        disabled={actionLoading}
                      >
                        {actionLoading ? (
                          <Spinner size="sm" className="me-2" />
                        ) : (
                          <i className="fas fa-sign-out-alt me-2"></i>
                        )}
                        Sair do Grupo
                      </Button>
                    )}
                    {userAdmin && (
                      <Button 
                        variant="danger" 
                        onClick={() => setShowDeleteModal(true)}
                        disabled={actionLoading}
                      >
                        {actionLoading ? (
                          <Spinner size="sm" className="me-2" />
                        ) : (
                          <i className="fas fa-trash me-2"></i>
                        )}
                        Deletar Grupo
                      </Button>
                    )}
                  </>
                )}
              </div>
            </Card.Body>
          </Card>
        </Col>

        {/* Lista de Participantes */}
        <Col lg={4}>
          <Card>
            <Card.Header>
              <h5 className="mb-0">
                Participantes ({participantes?.length || 0})
              </h5>
            </Card.Header>
            <Card.Body>
              {participantes && participantes.length > 0 ? (
                <div className="list-group list-group-flush">
                  {participantes.map(participant => (
                    <div key={participant.id} className="list-group-item px-0 d-flex align-items-center">
                      <img 
                        src={participant.foto_perfil || '/default-avatar.png'} 
                        alt="Avatar" 
                        className="profile-pic me-3"
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/40x40/6c757d/ffffff?text=' + participant.nome.charAt(0).toUpperCase();
                        }}
                      />
                      <div className="flex-grow-1">
                        <h6 className="mb-1">
                          {participant.nome}
                          {participant.papel === 'admin' && (
                            <Badge bg="primary" className="ms-2">Admin</Badge>
                          )}
                        </h6>
                        <small className="text-muted">
                          {participant.curso} • {participant.periodo}
                        </small>
                        <br />
                        <small className="text-muted">
                          Entrou em {formatDate(participant.data_entrada)}
                        </small>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted text-center">Nenhum participante encontrado</p>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Modal de Confirmação - Sair do Grupo */}
      <Modal show={showLeaveModal} onHide={() => setShowLeaveModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Sair do Grupo</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Tem certeza que deseja sair do grupo <strong>{grupo.nome}</strong>?
          <br />
          <small className="text-muted">Você poderá entrar novamente se houver vagas disponíveis.</small>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowLeaveModal(false)}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={handleLeaveGroup} disabled={actionLoading}>
            {actionLoading ? (
              <Spinner size="sm" className="me-2" />
            ) : null}
            Sair do Grupo
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal de Confirmação - Deletar Grupo */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Deletar Grupo</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Alert variant="danger">
            <i className="fas fa-exclamation-triangle me-2"></i>
            <strong>Atenção!</strong> Esta ação não pode ser desfeita.
          </Alert>
          Tem certeza que deseja deletar o grupo <strong>{grupo.nome}</strong>?
          <br />
          <small className="text-muted">Todos os participantes serão removidos e o grupo será excluído permanentemente.</small>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={handleDeleteGroup} disabled={actionLoading}>
            {actionLoading ? (
              <Spinner size="sm" className="me-2" />
            ) : null}
            Deletar Grupo
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default GroupDetails;
