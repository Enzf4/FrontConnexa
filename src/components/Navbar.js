import React, { useState } from 'react';
import { Navbar as BSNavbar, Nav, NavDropdown, Badge } from 'react-bootstrap';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useNotifications } from '../contexts/NotificationsContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { unreadCount } = useNotifications();
  const navigate = useNavigate();
  const location = useLocation();
  const [showNotifications, setShowNotifications] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  if (!user) {
    return null;
  }

  return (
    <BSNavbar bg="light" expand="lg" className="shadow-sm">
      <div className="container-fluid">
        <BSNavbar.Brand as={Link} to="/dashboard" className="fw-bold text-primary">
          <i className="fas fa-graduation-cap me-2"></i>
          Connexa
        </BSNavbar.Brand>

        <BSNavbar.Toggle aria-controls="basic-navbar-nav" />
        <BSNavbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link 
              as={Link} 
              to="/dashboard" 
              className={isActive('/dashboard') ? 'active' : ''}
            >
              <i className="fas fa-home me-1"></i>
              Dashboard
            </Nav.Link>
            <Nav.Link 
              as={Link} 
              to="/groups" 
              className={isActive('/groups') ? 'active' : ''}
            >
              <i className="fas fa-users me-1"></i>
              Grupos
            </Nav.Link>
          </Nav>

          <Nav>
            <Nav.Link 
              as={Link} 
              to="/notifications"
              className="position-relative"
            >
              <i className="fas fa-bell me-1"></i>
              Notificações
              {unreadCount > 0 && (
                <Badge 
                  bg="danger" 
                  className="position-absolute top-0 start-100 translate-middle rounded-pill"
                  style={{ fontSize: '0.7rem' }}
                >
                  {unreadCount}
                </Badge>
              )}
            </Nav.Link>

            <NavDropdown 
              title={
                <div className="d-flex align-items-center">
                  <img 
                    src={user.foto_perfil || '/default-avatar.png'} 
                    alt="Avatar" 
                    className="profile-pic me-2"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/40x40/6c757d/ffffff?text=' + user.nome.charAt(0).toUpperCase();
                    }}
                  />
                  <span>{user.nome}</span>
                </div>
              } 
              id="basic-nav-dropdown"
            >
              <NavDropdown.Item as={Link} to="/profile">
                <i className="fas fa-user me-2"></i>
                Meu Perfil
              </NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item onClick={handleLogout}>
                <i className="fas fa-sign-out-alt me-2"></i>
                Sair
              </NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </BSNavbar.Collapse>
      </div>
    </BSNavbar>
  );
};

export default Navbar;
