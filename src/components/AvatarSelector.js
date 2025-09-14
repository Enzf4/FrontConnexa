import React from "react";
import { Row, Col } from "react-bootstrap";

const AvatarSelector = ({ selectedAvatar, onAvatarSelect, size = "large" }) => {
  // 10 avatares pré-definidos usando emojis e cores
  // Estes avatares correspondem exatamente aos do backend
  const avatars = [
    { id: "avatar-1", emoji: "👨‍💻", name: "Programador", color: "#3498db" },
    { id: "avatar-2", emoji: "👩‍🔬", name: "Cientista", color: "#e74c3c" },
    { id: "avatar-3", emoji: "👨‍🎨", name: "Artista", color: "#9b59b6" },
    { id: "avatar-4", emoji: "👩‍🏫", name: "Professora", color: "#f39c12" },
    { id: "avatar-5", emoji: "👨‍⚕️", name: "Médico", color: "#2ecc71" },
    { id: "avatar-6", emoji: "👩‍💼", name: "Executiva", color: "#34495e" },
    { id: "avatar-7", emoji: "👨‍🚀", name: "Astronauta", color: "#1abc9c" },
    { id: "avatar-8", emoji: "👩‍🍳", name: "Chef", color: "#e67e22" },
    { id: "avatar-9", emoji: "👨‍🎓", name: "Estudante", color: "#8e44ad" },
    { id: "avatar-10", emoji: "👩‍🎤", name: "Cantora", color: "#e91e63" },
  ];

  const getSizeClass = () => {
    switch (size) {
      case "small":
        return { width: "40px", height: "40px", fontSize: "20px" };
      case "medium":
        return { width: "60px", height: "60px", fontSize: "30px" };
      case "large":
        return { width: "80px", height: "80px", fontSize: "40px" };
      case "xlarge":
        return { width: "120px", height: "120px", fontSize: "60px" };
      default:
        return { width: "80px", height: "80px", fontSize: "40px" };
    }
  };

  const sizeStyles = getSizeClass();

  return (
    <div className="avatar-selector">
      <Row className="g-3">
        {avatars.map((avatar) => (
          <Col xs={6} sm={4} md={3} lg={2} key={avatar.id}>
            <div
              className={`avatar-option ${
                selectedAvatar === avatar.id ? "selected" : ""
              }`}
              onClick={() => onAvatarSelect(avatar.id)}
              style={{
                width: sizeStyles.width,
                height: sizeStyles.height,
                backgroundColor: avatar.color,
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                transition: "all 0.3s ease",
                border:
                  selectedAvatar === avatar.id
                    ? "3px solid #3498db"
                    : "3px solid transparent",
                boxShadow:
                  selectedAvatar === avatar.id
                    ? "0 4px 12px rgba(52, 152, 219, 0.3)"
                    : "0 2px 6px rgba(0, 0, 0, 0.1)",
                fontSize: sizeStyles.fontSize,
                margin: "0 auto",
              }}
              onMouseEnter={(e) => {
                if (selectedAvatar !== avatar.id) {
                  e.target.style.transform = "scale(1.05)";
                  e.target.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.2)";
                }
              }}
              onMouseLeave={(e) => {
                if (selectedAvatar !== avatar.id) {
                  e.target.style.transform = "scale(1)";
                  e.target.style.boxShadow = "0 2px 6px rgba(0, 0, 0, 0.1)";
                }
              }}
              title={avatar.name}
            >
              {avatar.emoji}
            </div>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default AvatarSelector;
