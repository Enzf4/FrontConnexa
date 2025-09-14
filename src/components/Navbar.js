import React, { useState } from "react";
import { Navbar as BSNavbar, Nav, NavDropdown, Badge } from "react-bootstrap";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useNotifications } from "../contexts/NotificationsContext";
import Avatar from "./Avatar";

const Navbar = () => {
  const { user, logout } = useAuth();
  const { unreadCount } = useNotifications();
  const navigate = useNavigate();
  const location = useLocation();
  const [showNotifications, setShowNotifications] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  if (!user) {
    return null;
  }

  return (
    <BSNavbar
      bg="dark"
      variant="dark"
      expand="lg"
      className="navbar-modern shadow-sm"
    >
      <div className="container-fluid px-3">
        {/* Brand */}
        <BSNavbar.Brand
          as={Link}
          to="/dashboard"
          className="navbar-brand-modern d-flex align-items-center"
        >
          <i className="fas fa-graduation-cap me-2 fs-4"></i>
          <span className="fw-bold">Connexa</span>
        </BSNavbar.Brand>

        {/* Toggle para mobile */}
        <BSNavbar.Toggle aria-controls="basic-navbar-nav" />

        <BSNavbar.Collapse id="basic-navbar-nav">
          {/* Links principais */}
          <Nav className="me-auto">
            <Nav.Link
              as={Link}
              to="/dashboard"
              className={`nav-link-modern d-flex align-items-center px-3 py-2 mx-1 rounded ${
                isActive("/dashboard") ? "active" : ""
              }`}
            >
              <i className="fas fa-home me-2"></i>
              Dashboard
            </Nav.Link>

            <Nav.Link
              as={Link}
              to="/groups"
              className={`nav-link-modern d-flex align-items-center px-3 py-2 mx-1 rounded ${
                isActive("/groups") ? "active" : ""
              }`}
            >
              <i className="fas fa-users me-2"></i>
              Grupos
            </Nav.Link>
          </Nav>

          {/* Links do usuário */}
          <Nav className="d-flex align-items-center">
            {/* Notificações */}
            <Nav.Link
              as={Link}
              to="/notifications"
              className="nav-link-modern position-relative d-flex align-items-center px-3 py-2 mx-1 rounded"
            >
              <i className="fas fa-bell me-1"></i>
              <span className="d-none d-lg-inline">Notificações</span>
              {unreadCount > 0 && (
                <Badge
                  bg="danger"
                  className="position-absolute notification-badge"
                  style={{
                    top: "8px",
                    right: "8px",
                    fontSize: "0.7rem",
                    minWidth: "18px",
                    height: "18px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {unreadCount > 99 ? "99+" : unreadCount}
                </Badge>
              )}
            </Nav.Link>

            {/* Dropdown do usuário */}
            <NavDropdown
              title={
                <span className="d-flex align-items-center text-white">
                  <Avatar
                    avatarId={user.avatar || "avatar-1"}
                    size="small"
                    className="me-2"
                  />
                  <span className="user-name d-none d-md-inline">
                    {user.nome}
                  </span>
                </span>
              }
              id="user-nav-dropdown"
              className="user-dropdown-menu ms-2"
              align="end"
            >
              <NavDropdown.Item
                as={Link}
                to="/profile"
                className="d-flex align-items-center py-2"
              >
                <i className="fas fa-user me-2 text-muted"></i>
                Meu Perfil
              </NavDropdown.Item>

              <NavDropdown.Divider />

              <NavDropdown.Item
                onClick={handleLogout}
                className="d-flex align-items-center py-2 text-danger"
              >
                <i className="fas fa-sign-out-alt me-2"></i>
                Sair
              </NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </BSNavbar.Collapse>
      </div>

      <style jsx>{`
        .navbar-modern {
          min-height: 60px;
        }

        .navbar-brand-modern {
          font-size: 1.5rem;
          text-decoration: none !important;
        }

        .nav-link-modern {
          color: rgba(255, 255, 255, 0.85) !important;
          text-decoration: none !important;
          transition: all 0.3s ease;
          font-weight: 500;
        }

        .nav-link-modern:hover {
          color: #fff !important;
          background-color: rgba(255, 255, 255, 0.1) !important;
          transform: translateY(-1px);
        }

        .nav-link-modern.active {
          color: #fff !important;
          background-color: rgba(255, 255, 255, 0.15) !important;
          font-weight: 600;
        }

        .notification-badge {
          box-shadow: 0 0 0 2px #212529;
        }

        .user-dropdown-menu .dropdown-toggle {
          border: none !important;
          background: none !important;
          padding: 0.5rem 1rem !important;
        }

        .user-dropdown-menu .dropdown-toggle:after {
          margin-left: 0.5rem;
        }

        .user-dropdown-menu .dropdown-menu {
          border: none;
          box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
          border-radius: 0.5rem;
          margin-top: 0.5rem;
          min-width: 200px;
          z-index: 9999 !important;
        }

        .user-dropdown-menu .dropdown-item {
          padding: 0.75rem 1.5rem;
          transition: all 0.2s ease;
        }

        .user-dropdown-menu .dropdown-item:hover {
          background-color: #f8f9fa;
          transform: translateX(2px);
        }

        .user-name {
          max-width: 120px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        /* Responsividade */
        @media (max-width: 991.98px) {
          .navbar-collapse {
            margin-top: 1rem;
            padding-top: 1rem;
            border-top: 1px solid rgba(255, 255, 255, 0.1);
          }

          .nav-link-modern {
            margin: 0.25rem 0;
          }

          .user-dropdown-menu {
            margin-top: 1rem;
          }
        }

        @media (max-width: 576px) {
          .container-fluid {
            padding-left: 1rem !important;
            padding-right: 1rem !important;
          }
        }
      `}</style>
    </BSNavbar>
  );
};

export default Navbar;
