import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, Spinner } from 'react-bootstrap';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [formData, setFormData] = useState({
    nome: '',
    curso: '',
    periodo: '',
    interesses: ''
  });
  const [profileImage, setProfileImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');

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

  useEffect(() => {
    if (user) {
      setFormData({
        nome: user.nome || '',
        curso: user.curso || '',
        periodo: user.periodo || '',
        interesses: user.interesses || ''
      });
      setPreviewImage(user.foto_perfil);
    }
  }, [user]);

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

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validar tipo de arquivo
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        setErrors(prev => ({
          ...prev,
          foto_perfil: 'Tipo de arquivo inválido. Use JPG, PNG, GIF ou WEBP.'
        }));
        return;
      }

      // Validar tamanho (5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({
          ...prev,
          foto_perfil: 'Arquivo muito grande. Máximo 5MB.'
        }));
        return;
      }

      setProfileImage(file);
      setPreviewImage(URL.createObjectURL(file));
      setErrors(prev => ({
        ...prev,
        foto_perfil: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.nome.trim()) {
      newErrors.nome = 'Nome é obrigatório';
    } else if (formData.nome.trim().length < 2) {
      newErrors.nome = 'Nome deve ter pelo menos 2 caracteres';
    } else if (formData.nome.trim().length > 100) {
      newErrors.nome = 'Nome deve ter no máximo 100 caracteres';
    }

    if (!formData.curso) {
      newErrors.curso = 'Curso é obrigatório';
    }

    if (!formData.periodo) {
      newErrors.periodo = 'Período é obrigatório';
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
    setSuccess('');

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('nome', formData.nome.trim());
      formDataToSend.append('curso', formData.curso);
      formDataToSend.append('periodo', formData.periodo);
      formDataToSend.append('interesses', formData.interesses.trim());
      
      if (profileImage) {
        formDataToSend.append('foto_perfil', profileImage);
      }

      const response = await api.put('/usuarios/perfil', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      updateUser(response.data.usuario);
      setSuccess('Perfil atualizado com sucesso!');
      setProfileImage(null);
      
    } catch (error) {
      const message = error.response?.data?.message || 'Erro ao atualizar perfil';
      setErrors({ submit: message });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    const senha = prompt('Digite sua senha para confirmar a exclusão da conta:');
    if (!senha) return;

    if (!confirm('Tem certeza que deseja deletar sua conta? Esta ação não pode ser desfeita.')) {
      return;
    }

    try {
      await api.delete('/usuarios/conta', { data: { senha } });
      localStorage.removeItem('token');
      window.location.href = '/login';
    } catch (error) {
      const message = error.response?.data?.message || 'Erro ao deletar conta';
      alert(message);
    }
  };

  return (
    <Container>
      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          <Card className="shadow">
            <Card.Header className="text-center">
              <h2 className="h4 mb-0">
                <i className="fas fa-user me-2"></i>
                Meu Perfil
              </h2>
              <p className="text-muted mb-0">Gerencie suas informações pessoais</p>
            </Card.Header>
            <Card.Body className="p-4">
              {success && (
                <Alert variant="success" dismissible onClose={() => setSuccess('')}>
                  <i className="fas fa-check-circle me-2"></i>
                  {success}
                </Alert>
              )}

              {errors.submit && (
                <Alert variant="danger" dismissible onClose={() => setErrors({})}>
                  <i className="fas fa-exclamation-triangle me-2"></i>
                  {errors.submit}
                </Alert>
              )}

              <Form onSubmit={handleSubmit}>
                {/* Foto de Perfil */}
                <div className="text-center mb-4">
                  <div className="position-relative d-inline-block">
                    <img 
                      src={previewImage || '/default-avatar.png'} 
                      alt="Foto de perfil" 
                      className="rounded-circle"
                      style={{ width: '120px', height: '120px', objectFit: 'cover' }}
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/120x120/6c757d/ffffff?text=' + (user?.nome?.charAt(0) || 'U').toUpperCase();
                      }}
                    />
                    <label 
                      htmlFor="foto_perfil" 
                      className="btn btn-sm btn-primary position-absolute bottom-0 end-0 rounded-circle"
                      style={{ width: '32px', height: '32px' }}
                    >
                      <i className="fas fa-camera"></i>
                    </label>
                    <input
                      type="file"
                      id="foto_perfil"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="d-none"
                    />
                  </div>
                  {errors.foto_perfil && (
                    <div className="error-message">{errors.foto_perfil}</div>
                  )}
                  <p className="text-muted small mt-2">
                    Clique no ícone da câmera para alterar sua foto
                  </p>
                </div>

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
                      <Form.Label>Email</Form.Label>
                      <Form.Control
                        type="email"
                        value={user?.email || ''}
                        disabled
                        className="bg-light"
                      />
                      <Form.Text className="text-muted">
                        Email não pode ser alterado
                      </Form.Text>
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

                <Form.Group className="mb-4">
                  <Form.Label>Interesses</Form.Label>
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
                        Salvando...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-save me-2"></i>
                        Salvar Alterações
                      </>
                    )}
                  </Button>
                </div>
              </Form>

              <hr className="my-4" />

              {/* Área de Perigo */}
              <div className="text-center">
                <h6 className="text-danger mb-3">
                  <i className="fas fa-exclamation-triangle me-2"></i>
                  Área de Perigo
                </h6>
                <Button 
                  variant="outline-danger" 
                  onClick={handleDeleteAccount}
                  size="sm"
                >
                  <i className="fas fa-trash me-2"></i>
                  Deletar Conta
                </Button>
                <p className="text-muted small mt-2">
                  Esta ação não pode ser desfeita
                </p>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Profile;
