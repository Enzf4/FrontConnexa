import React, { useState, useEffect, useRef } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  Spinner,
  Alert,
} from "react-bootstrap";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useGroups } from "../contexts/GroupsContext";
import api from "../services/api";
import Avatar from "../components/Avatar";

const GroupChat = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { currentGroup, getGroupDetails } = useGroups();

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(null);

  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);

  useEffect(() => {
    if (id) {
      loadGroupDetails();
    }
  }, [id]);

  useEffect(() => {
    if (currentGroup) {
      loadMessages();
    }
  }, [currentGroup]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadGroupDetails = async () => {
    await getGroupDetails(id);
  };

  const loadMessages = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/grupos/${id}/mensagens`);
      setMessages(response.data.mensagens);
    } catch (error) {
      setError("Erro ao carregar mensagens");
    } finally {
      setLoading(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();

    if (!newMessage.trim() || sending) return;

    setSending(true);
    try {
      const response = await api.post(`/grupos/${id}/mensagens`, {
        conteudo: newMessage.trim(),
      });

      setMessages((prev) => [...prev, response.data.mensagem]);
      setNewMessage("");
    } catch (error) {
      setError("Erro ao enviar mensagem");
    } finally {
      setSending(false);
    }
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
      });
    } else {
      return date.toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      });
    }
  };

  const isUserInGroup = () => {
    if (!currentGroup || !user) return false;
    return currentGroup.participantes?.some((p) => p.id === user.id);
  };

  if (loading) {
    return (
      <div className="loading">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Carregando chat...</span>
        </Spinner>
      </div>
    );
  }

  if (!currentGroup) {
    return (
      <Container>
        <Alert variant="danger">
          <i className="fas fa-exclamation-triangle me-2"></i>
          Grupo não encontrado ou você não tem permissão para acessá-lo.
        </Alert>
        <Button variant="primary" onClick={() => navigate("/groups")}>
          Voltar para Grupos
        </Button>
      </Container>
    );
  }

  if (!isUserInGroup()) {
    return (
      <Container>
        <Alert variant="warning">
          <i className="fas fa-lock me-2"></i>
          Você precisa ser membro do grupo para acessar o chat.
        </Alert>
        <Button as={Link} to={`/groups/${id}`} variant="primary">
          Ver Detalhes do Grupo
        </Button>
      </Container>
    );
  }

  const { grupo } = currentGroup;

  return (
    <Container fluid>
      <Row className="mb-3">
        <Col>
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h1 className="h4 mb-1">
                <i className="fas fa-comments me-2"></i>
                Chat - {grupo.nome}
              </h1>
              <p className="text-muted mb-0">
                <i className="fas fa-book me-1"></i>
                {grupo.materia} •
                <i
                  className={`fas fa-${
                    grupo.local === "online" ? "video" : "map-marker-alt"
                  } me-1 ms-2`}
                ></i>
                {grupo.local === "online" ? "Online" : "Presencial"}
              </p>
            </div>
            <Button as={Link} to={`/groups/${id}`} variant="outline-secondary">
              <i className="fas fa-arrow-left me-1"></i>
              Voltar ao Grupo
            </Button>
          </div>
        </Col>
      </Row>

      <Row>
        <Col>
          <Card className="h-100" style={{ height: "70vh" }}>
            <Card.Header className="d-flex justify-content-between align-items-center">
              <h5 className="mb-0">
                <i className="fas fa-users me-2"></i>
                Conversa do Grupo
              </h5>
              <small className="text-muted">
                {grupo.participantes_atual} participantes
              </small>
            </Card.Header>

            <Card.Body className="p-0 d-flex flex-column">
              {/* Área de Mensagens */}
              <div
                ref={messagesContainerRef}
                className="chat-container flex-grow-1"
                style={{ height: "400px", overflowY: "auto" }}
              >
                {error && (
                  <Alert variant="danger" className="m-3">
                    {error}
                  </Alert>
                )}

                {messages.length === 0 ? (
                  <div className="text-center py-5">
                    <i className="fas fa-comment-slash fa-3x text-muted mb-3"></i>
                    <h6 className="text-muted">Nenhuma mensagem ainda</h6>
                    <p className="text-muted">
                      Seja o primeiro a enviar uma mensagem!
                    </p>
                  </div>
                ) : (
                  <div className="p-3">
                    {messages.map((message) => {
                      const isOwn = message.usuario_id === user.id;
                      return (
                        <div
                          key={message.id}
                          className={`message ${isOwn ? "own" : "other"} mb-3`}
                        >
                          <div className="d-flex align-items-start">
                            <Avatar
                              avatarId={message.usuario_avatar || "avatar-1"}
                              size="small"
                              className="me-2"
                            />
                            <div className="flex-grow-1">
                              <div className="d-flex justify-content-between align-items-start mb-1">
                                <h6 className="mb-0 small">
                                  {message.usuario_nome}
                                  <small className="text-muted ms-2">
                                    {message.usuario_curso} •{" "}
                                    {message.usuario_periodo}
                                  </small>
                                </h6>
                                <small className="text-muted">
                                  {formatTime(message.created_at)}
                                </small>
                              </div>
                              <p className="mb-0">{message.conteudo}</p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                    <div ref={messagesEndRef} />
                  </div>
                )}
              </div>

              {/* Formulário de Envio */}
              <div className="border-top p-3">
                <Form onSubmit={handleSendMessage}>
                  <div className="d-flex gap-2">
                    <Form.Control
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Digite sua mensagem..."
                      disabled={sending}
                      maxLength={1000}
                    />
                    <Button
                      type="submit"
                      variant="primary"
                      disabled={!newMessage.trim() || sending}
                    >
                      {sending ? (
                        <Spinner size="sm" />
                      ) : (
                        <i className="fas fa-paper-plane"></i>
                      )}
                    </Button>
                  </div>
                  <small className="text-muted">
                    {newMessage.length}/1000 caracteres
                  </small>
                </Form>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default GroupChat;
