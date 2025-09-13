import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useGroups } from '../contexts/GroupsContext';

const CreateGroup = () => {
  const [formData, setFormData] = useState({
    nome: '',
    materia: '',
    objetivo: '',
    local: 'presencial',
    limite_participantes: 10
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const { createGroup } = useGroups();
  const navigate = useNavigate();

  const materias = [
    'Cálculo I', 'Cálculo II', 'Cálculo III',
    'Física I', 'Física II', 'Física III',
    'Química', 'Biologia', 'Matemática',
    'Programação', 'Estrutura de Dados',
    'Banco de Dados', 'Redes de Computadores',
    'Engenharia de Software', 'Sistemas Operacionais',
    'Outro'
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Limpar erro do campo quando usuário começar a digitar
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.nome.trim()) {
      newErrors.nome = 'Nome do grupo é obrigatório';
    } else if (formData.nome.trim().length < 3) {
      newErrors.nome = 'Nome deve ter pelo menos 3 caracteres';
    } else if (formData.nome.trim().length > 100) {
      newErrors.nome = 'Nome deve ter no máximo 100 caracteres';
    }

    if (!formData.materia) {
      newErrors.materia = 'Matéria é obrigatória';
    }

    if (!formData.objetivo.trim()) {
      newErrors.objetivo = 'Objetivo é obrigatório';
    } else if (formData.objetivo.trim().length < 10) {
      newErrors.objetivo = 'Objetivo deve ter pelo menos 10 caracteres';
    } else if (formData.objetivo.trim().length > 500) {
      newErrors.objetivo = 'Objetivo deve ter no máximo 500 caracteres';
    }

    if (!formData.local) {
      newErrors.local = 'Local é obrigatório';
    }

    if (!formData.limite_participantes) {
      newErrors.limite_participantes = 'Limite de participantes é obrigatório';
    } else if (formData.limite_participantes < 2) {
      newErrors.limite_participantes = 'Limite deve ser pelo menos 2 participantes';
    } else if (formData.limite_participantes > 50) {
      newErrors.limite_participantes = 'Limite deve ser no máximo 50 participantes';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    
    const groupData = {
      nome: formData.nome.trim(),
      materia: formData.materia,
      objetivo: formData.objetivo.trim(),
      local: formData.local,
      limite_participantes: parseInt(formData.limite_participantes)
    };

    const result = await createGroup(groupData);
    
    if (result.success) {
      navigate(`/groups/${result.group.id}`);
    }
    
    setLoading(false);
  };

  return (
    <Container>
      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          <Card className="shadow">
            <Card.Header className="text-center">
              <h2 className="h4 mb-0">
                <i className="fas fa-plus-circle me-2"></i>
                Criar Novo Grupo
              </h2>
              <p className="text-muted mb-0">Preencha as informações do seu grupo de estudo</p>
            </Card.Header>
            <Card.Body className="p-4">
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Nome do Grupo *</Form.Label>
                  <Form.Control
                    type="text"
                    name="nome"
                    value={formData.nome}
                    onChange={handleChange}
                    placeholder="Ex: Grupo de Estudo - Cálculo I"
                    isInvalid={!!errors.nome}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.nome}
                  </Form.Control.Feedback>
                  <Form.Text className="text-muted">
                    3-100 caracteres
                  </Form.Text>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Matéria *</Form.Label>
                  <Form.Select
                    name="materia"
                    value={formData.materia}
                    onChange={handleChange}
                    isInvalid={!!errors.materia}
                  >
                    <option value="">Selecione a matéria</option>
                    {materias.map(materia => (
                      <option key={materia} value={materia}>{materia}</option>
                    ))}
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
                    {errors.materia}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Objetivo do Grupo *</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={4}
                    name="objetivo"
                    value={formData.objetivo}
                    onChange={handleChange}
                    placeholder="Descreva o objetivo do grupo, tópicos a serem estudados, cronograma, etc."
                    isInvalid={!!errors.objetivo}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.objetivo}
                  </Form.Control.Feedback>
                  <Form.Text className="text-muted">
                    {formData.objetivo.length}/500 caracteres
                  </Form.Text>
                </Form.Group>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Local *</Form.Label>
                      <Form.Select
                        name="local"
                        value={formData.local}
                        onChange={handleChange}
                        isInvalid={!!errors.local}
                      >
                        <option value="presencial">Presencial</option>
                        <option value="online">Online</option>
                      </Form.Select>
                      <Form.Control.Feedback type="invalid">
                        {errors.local}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Limite de Participantes *</Form.Label>
                      <Form.Control
                        type="number"
                        name="limite_participantes"
                        value={formData.limite_participantes}
                        onChange={handleChange}
                        min="2"
                        max="50"
                        isInvalid={!!errors.limite_participantes}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.limite_participantes}
                      </Form.Control.Feedback>
                      <Form.Text className="text-muted">
                        2-50 participantes
                      </Form.Text>
                    </Form.Group>
                  </Col>
                </Row>

                <Alert variant="info" className="mb-4">
                  <i className="fas fa-info-circle me-2"></i>
                  <strong>Dica:</strong> Seja específico no objetivo do grupo para atrair pessoas com os mesmos interesses de estudo.
                </Alert>

                <div className="d-grid gap-2">
                  <Button 
                    type="submit" 
                    variant="primary" 
                    size="lg"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Criando Grupo...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-plus me-2"></i>
                        Criar Grupo
                      </>
                    )}
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline-secondary" 
                    onClick={() => navigate('/groups')}
                  >
                    Cancelar
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default CreateGroup;
