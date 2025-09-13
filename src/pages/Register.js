import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Register = () => {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    curso: '',
    periodo: '',
    senha: '',
    confirmarSenha: '',
    interesses: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const cursos = [
    'Ciência da Computação',
    'Engenharia de Software',
    'Sistemas de Informação',
    'Engenharia Civil',
    'Engenharia Mecânica',
    'Engenharia Elétrica',
    'Administração',
    'Direito',
    'Medicina',
    'Psicologia',
    'Outro'
  ];

  const periodos = ['1º', '2º', '3º', '4º', '5º', '6º', '7º', '8º', '9º', '10º'];

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
      newErrors.nome = 'Nome é obrigatório';
    } else if (formData.nome.trim().length < 2) {
      newErrors.nome = 'Nome deve ter pelo menos 2 caracteres';
    }

    if (!formData.email) {
      newErrors.email = 'Email é obrigatório';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    } else if (!formData.email.includes('@univali.br') && !formData.email.includes('@edu.univali.br')) {
      newErrors.email = 'Email deve ser institucional (@univali.br ou @edu.univali.br)';
    }

    if (!formData.curso) {
      newErrors.curso = 'Curso é obrigatório';
    }

    if (!formData.periodo) {
      newErrors.periodo = 'Período é obrigatório';
    }

    if (!formData.senha) {
      newErrors.senha = 'Senha é obrigatória';
    } else if (formData.senha.length < 8) {
      newErrors.senha = 'Senha deve ter pelo menos 8 caracteres';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.senha)) {
      newErrors.senha = 'Senha deve conter pelo menos: 1 letra minúscula, 1 maiúscula e 1 número';
    }

    if (!formData.confirmarSenha) {
      newErrors.confirmarSenha = 'Confirmação de senha é obrigatória';
    } else if (formData.senha !== formData.confirmarSenha) {
      newErrors.confirmarSenha = 'Senhas não coincidem';
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
    
    const userData = {
      nome: formData.nome.trim(),
      email: formData.email,
      curso: formData.curso,
      periodo: formData.periodo,
      senha: formData.senha,
      interesses: formData.interesses.trim()
    };

    const result = await register(userData);
    
    if (result.success) {
      navigate('/dashboard');
    }
    
    setLoading(false);
  };

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          <Card className="shadow">
            <Card.Body className="p-4">
              <div className="text-center mb-4">
                <i className="fas fa-graduation-cap fa-3x text-primary mb-3"></i>
                <h2 className="h4">Connexa</h2>
                <p className="text-muted">Crie sua conta e comece a estudar em grupo</p>
              </div>

              <Form onSubmit={handleSubmit}>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Nome Completo *</Form.Label>
                      <Form.Control
                        type="text"
                        name="nome"
                        value={formData.nome}
                        onChange={handleChange}
                        placeholder="Seu nome completo"
                        isInvalid={!!errors.nome}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.nome}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Email Institucional *</Form.Label>
                      <Form.Control
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="seu.email@univali.br"
                        isInvalid={!!errors.email}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.email}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Curso *</Form.Label>
                      <Form.Select
                        name="curso"
                        value={formData.curso}
                        onChange={handleChange}
                        isInvalid={!!errors.curso}
                      >
                        <option value="">Selecione seu curso</option>
                        {cursos.map(curso => (
                          <option key={curso} value={curso}>{curso}</option>
                        ))}
                      </Form.Select>
                      <Form.Control.Feedback type="invalid">
                        {errors.curso}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Período *</Form.Label>
                      <Form.Select
                        name="periodo"
                        value={formData.periodo}
                        onChange={handleChange}
                        isInvalid={!!errors.periodo}
                      >
                        <option value="">Selecione seu período</option>
                        {periodos.map(periodo => (
                          <option key={periodo} value={periodo}>{periodo} período</option>
                        ))}
                      </Form.Select>
                      <Form.Control.Feedback type="invalid">
                        {errors.periodo}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Senha *</Form.Label>
                      <Form.Control
                        type="password"
                        name="senha"
                        value={formData.senha}
                        onChange={handleChange}
                        placeholder="Mínimo 8 caracteres"
                        isInvalid={!!errors.senha}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.senha}
                      </Form.Control.Feedback>
                      <Form.Text className="text-muted">
                        Deve conter: 1 letra minúscula, 1 maiúscula e 1 número
                      </Form.Text>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Confirmar Senha *</Form.Label>
                      <Form.Control
                        type="password"
                        name="confirmarSenha"
                        value={formData.confirmarSenha}
                        onChange={handleChange}
                        placeholder="Confirme sua senha"
                        isInvalid={!!errors.confirmarSenha}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.confirmarSenha}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group className="mb-4">
                  <Form.Label>Interesses (opcional)</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="interesses"
                    value={formData.interesses}
                    onChange={handleChange}
                    placeholder="Ex: Programação, Matemática, Física, Literatura..."
                  />
                  <Form.Text className="text-muted">
                    Descreva suas áreas de interesse para encontrar grupos relacionados
                  </Form.Text>
                </Form.Group>

                <div className="d-grid mb-3">
                  <Button 
                    type="submit" 
                    variant="primary" 
                    size="lg"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Criando conta...
                      </>
                    ) : (
                      'Criar Conta'
                    )}
                  </Button>
                </div>
              </Form>

              <hr className="my-4" />

              <div className="text-center">
                <p className="mb-0">
                  Já tem uma conta?{' '}
                  <Link to="/login" className="text-decoration-none">
                    Faça login aqui
                  </Link>
                </p>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Register;
