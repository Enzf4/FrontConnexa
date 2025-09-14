import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  Badge,
  Spinner,
  Alert,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import { useGroups } from "../contexts/GroupsContext";

const Groups = () => {
  const { groups, loading, searchGroups } = useGroups();
  const [filters, setFilters] = useState({
    materia: "",
    local: "",
    texto: "",
  });
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    handleSearch();
  }, []);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSearch = async (e) => {
    if (e) e.preventDefault();

    setSearching(true);
    await searchGroups(filters);
    setSearching(false);
  };

  const clearFilters = () => {
    setFilters({
      materia: "",
      local: "",
      texto: "",
    });
    handleSearch();
  };

  const getGroupStatus = (group) => {
    if (group.participantes_atual >= group.limite_participantes) {
      return { text: "Lotado", variant: "danger" };
    } else if (group.participantes_atual >= group.limite_participantes * 0.8) {
      return { text: "Quase lotado", variant: "warning" };
    } else {
      return { text: "Disponível", variant: "success" };
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const materias = [
    "Cálculo I",
    "Cálculo II",
    "Cálculo III",
    "Física I",
    "Física II",
    "Física III",
    "Química",
    "Biologia",
    "Matemática",
    "Programação",
    "Estrutura de Dados",
    "Banco de Dados",
    "Redes de Computadores",
    "Engenharia de Software",
    "Sistemas Operacionais",
    "Outro",
  ];

  return (
    <Container fluid>
      <Row className="mb-4">
        <Col>
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h1 className="h3 mb-1">Grupos de Estudo</h1>
              <p className="text-muted">
                Encontre grupos de estudo ou crie o seu próprio
              </p>
            </div>
            <Button as={Link} to="/groups/create" variant="primary">
              <i className="fas fa-plus me-2"></i>
              Criar Grupo
            </Button>
          </div>
        </Col>
      </Row>

      {/* Filtros de Busca */}
      <Card className="mb-4">
        <Card.Body>
          <Form onSubmit={handleSearch}>
            <Row>
              <Col md={4} className="mb-3">
                <Form.Label>Matéria</Form.Label>
                <Form.Select
                  name="materia"
                  value={filters.materia}
                  onChange={handleFilterChange}
                >
                  <option value="">Todas as matérias</option>
                  {materias.map((materia) => (
                    <option key={materia} value={materia}>
                      {materia}
                    </option>
                  ))}
                </Form.Select>
              </Col>
              <Col md={4} className="mb-3">
                <Form.Label>Local</Form.Label>
                <Form.Select
                  name="local"
                  value={filters.local}
                  onChange={handleFilterChange}
                >
                  <option value="">Todos os locais</option>
                  <option value="online">Online</option>
                  <option value="presencial">Presencial</option>
                </Form.Select>
              </Col>
              <Col md={4} className="mb-3">
                <Form.Label>Buscar por texto</Form.Label>
                <Form.Control
                  type="text"
                  name="texto"
                  value={filters.texto}
                  onChange={handleFilterChange}
                  placeholder="Nome ou objetivo do grupo..."
                />
              </Col>
            </Row>
            <Row>
              <Col className="text-end">
                <Button
                  type="button"
                  variant="outline-secondary"
                  onClick={clearFilters}
                  className="me-2"
                >
                  Limpar Filtros
                </Button>
                <Button type="submit" variant="primary" disabled={searching}>
                  {searching ? (
                    <>
                      <Spinner size="sm" className="me-2" />
                      Buscando...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-search me-2"></i>
                      Buscar
                    </>
                  )}
                </Button>
              </Col>
            </Row>
          </Form>
        </Card.Body>
      </Card>

      {/* Lista de Grupos */}
      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Carregando grupos...</span>
          </Spinner>
        </div>
      ) : groups.length === 0 ? (
        <Card>
          <Card.Body className="text-center py-5">
            <i className="fas fa-search fa-3x text-muted mb-3"></i>
            <h5 className="text-muted">Nenhum grupo encontrado</h5>
            <p className="text-muted">
              Tente ajustar os filtros de busca ou criar um novo grupo.
            </p>
            <Button as={Link} to="/groups/create" variant="primary">
              <i className="fas fa-plus me-2"></i>
              Criar Primeiro Grupo
            </Button>
          </Card.Body>
        </Card>
      ) : (
        <Row>
          {groups.map((group) => {
            const status = getGroupStatus(group);
            return (
              <Col lg={6} xl={4} className="mb-4" key={group.id}>
                <Card className="h-100">
                  <Card.Body>
                    <div className="d-flex justify-content-between align-items-start mb-3">
                      <h5 className="card-title mb-0">
                        <Link
                          to={`/groups/${group.id}`}
                          className="text-decoration-none"
                        >
                          {group.nome}
                        </Link>
                      </h5>
                      <Badge bg={status.variant}>{status.text}</Badge>
                    </div>

                    <p className="text-muted mb-2">
                      <i className="fas fa-book me-1"></i>
                      {group.materia}
                    </p>

                    <p className="card-text mb-3">
                      {group.objetivo.length > 100
                        ? `${group.objetivo.substring(0, 100)}...`
                        : group.objetivo}
                    </p>

                    <div className="mb-3">
                      <small className="text-muted">
                        <i
                          className={`fas fa-${
                            group.local === "online"
                              ? "video"
                              : "map-marker-alt"
                          } me-1`}
                        ></i>
                        {group.local === "online" ? "Online" : "Presencial"}
                      </small>
                      <br />
                      <small className="text-muted">
                        <i className="fas fa-users me-1"></i>
                        {group.participantes_atual}/{group.limite_participantes}{" "}
                        participantes
                      </small>
                      <br />
                      <small className="text-muted">
                        <i className="fas fa-user me-1"></i>
                        Criado por {group.criador_nome}
                      </small>
                    </div>

                    <div className="d-flex justify-content-between align-items-center">
                      <small className="text-muted">
                        {formatDate(group.created_at)}
                      </small>
                      <Button
                        as={Link}
                        to={`/groups/${group.id}`}
                        variant="outline-primary"
                        size="sm"
                      >
                        Ver Detalhes
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            );
          })}
        </Row>
      )}
    </Container>
  );
};

export default Groups;
