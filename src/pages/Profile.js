import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  Alert,
  Spinner,
} from "react-bootstrap";
import { useAuth } from "../contexts/AuthContext";
import api from "../services/api";
import AvatarSelector from "../components/AvatarSelector";
import Avatar from "../components/Avatar";

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [formData, setFormData] = useState({
    nome: "",
    curso: "",
    periodo: "",
    interesses: "",
    avatar: "avatar-1",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");

  const cursos = [
    "Ciência da Computação",
    "Engenharia de Software",
    "Sistemas de Informação",
    "Engenharia Civil",
    "Engenharia Mecânica",
    "Engenharia Elétrica",
    "Administração",
    "Direito",
    "Medicina",
    "Psicologia",
    "Outro",
  ];

  const periodos = [
    "1º",
    "2º",
    "3º",
    "4º",
    "5º",
    "6º",
    "7º",
    "8º",
    "9º",
    "10º",
  ];

  useEffect(() => {
    if (user) {
      setFormData({
        nome: user.nome || "",
        curso: user.curso || "",
        periodo: user.periodo || "",
        interesses: user.interesses || "",
        avatar: user.avatar || "avatar-1",
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Limpar erro do campo quando usuário começar a digitar
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleAvatarSelect = (avatarId) => {
    setFormData((prev) => ({
      ...prev,
      avatar: avatarId,
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.nome || !formData.nome.trim()) {
      newErrors.nome = "Nome é obrigatório";
    } else if (formData.nome.trim().length < 2) {
      newErrors.nome = "Nome deve ter pelo menos 2 caracteres";
    } else if (formData.nome.trim().length > 100) {
      newErrors.nome = "Nome deve ter no máximo 100 caracteres";
    }

    if (!formData.curso || formData.curso === "") {
      newErrors.curso = "Curso é obrigatório";
    }

    if (!formData.periodo || formData.periodo === "") {
      newErrors.periodo = "Período é obrigatório";
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
    setSuccess("");

    try {
      // Preparar dados para envio - backend atualizado com suporte a avatares
      const dataToSend = {
        nome: formData.nome.trim(),
        curso: formData.curso,
        periodo: formData.periodo,
        interesses: formData.interesses ? formData.interesses.trim() : "",
        avatar: formData.avatar, // ✅ Backend agora suporta avatares!
      };

      // Remover campos vazios que podem causar erro 400
      Object.keys(dataToSend).forEach((key) => {
        if (dataToSend[key] === null || dataToSend[key] === undefined) {
          delete dataToSend[key];
        }
      });

      const response = await api.put("/usuarios/perfil", dataToSend);

      updateUser(response.data.usuario);
      setSuccess("Perfil atualizado com sucesso!");
    } catch (error) {
      const message =
        error.response?.data?.message || "Erro ao atualizar perfil";
      setErrors({ submit: message });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    const senha = prompt(
      "Digite sua senha para confirmar a exclusão da conta:"
    );
    if (!senha) return;

    if (
      !confirm(
        "Tem certeza que deseja deletar sua conta? Esta ação não pode ser desfeita."
      )
    ) {
      return;
    }

    try {
      await api.delete("/usuarios/conta", { data: { senha } });
      localStorage.removeItem("token");
      window.location.href = "/login";
    } catch (error) {
      const message = error.response?.data?.message || "Erro ao deletar conta";
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
              <p className="text-muted mb-0">
                Gerencie suas informações pessoais
              </p>
            </Card.Header>
            <Card.Body className="p-4">
              {success && (
                <Alert
                  variant="success"
                  dismissible
                  onClose={() => setSuccess("")}
                >
                  <i className="fas fa-check-circle me-2"></i>
                  {success}
                </Alert>
              )}

              {errors.submit && (
                <Alert
                  variant="danger"
                  dismissible
                  onClose={() => setErrors({})}
                >
                  <i className="fas fa-exclamation-triangle me-2"></i>
                  {errors.submit}
                </Alert>
              )}

              <Form onSubmit={handleSubmit}>
                {/* Avatar Selection */}
                <div className="text-center mb-4">
                  <h6 className="mb-3">Seu Avatar</h6>
                  <Avatar
                    avatarId={formData.avatar}
                    size="xlarge"
                    className="mb-3 mx-auto"
                  />
                  <p className="text-muted small mb-3">
                    Escolha um avatar que represente você
                    <br />
                    <small className="text-success">
                      <i className="fas fa-check-circle me-1"></i>
                      Sistema de avatares funcionando perfeitamente!
                    </small>
                  </p>

                  <div className="mb-3">
                    <h6 className="mb-3">Escolher Avatar</h6>
                    <AvatarSelector
                      selectedAvatar={formData.avatar}
                      onAvatarSelect={handleAvatarSelect}
                      size="large"
                    />
                  </div>
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
                        value={user?.email || ""}
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
                        {cursos.map((curso) => (
                          <option key={curso} value={curso}>
                            {curso}
                          </option>
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
                        {periodos.map((periodo) => (
                          <option key={periodo} value={periodo}>
                            {periodo} período
                          </option>
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
                    Descreva suas áreas de interesse para encontrar grupos
                    relacionados
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
                        <span
                          className="spinner-border spinner-border-sm me-2"
                          role="status"
                          aria-hidden="true"
                        ></span>
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
