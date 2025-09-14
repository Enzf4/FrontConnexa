import React from "react";

const Avatar = ({ avatarId, size = "medium", className = "", style = {} }) => {
  // Mapeamento dos avatares pré-definidos
  const avatars = {
    "avatar-1": { emoji: "👨‍💻", color: "#3498db" },
    "avatar-2": { emoji: "👩‍🔬", color: "#e74c3c" },
    "avatar-3": { emoji: "👨‍🎨", color: "#9b59b6" },
    "avatar-4": { emoji: "👩‍🏫", color: "#f39c12" },
    "avatar-5": { emoji: "👨‍⚕️", color: "#2ecc71" },
    "avatar-6": { emoji: "👩‍💼", color: "#34495e" },
    "avatar-7": { emoji: "👨‍🚀", color: "#1abc9c" },
    "avatar-8": { emoji: "👩‍🍳", color: "#e67e22" },
    "avatar-9": { emoji: "👨‍🎓", color: "#8e44ad" },
    "avatar-10": { emoji: "👩‍🎤", color: "#e91e63" },
  };

  const getSizeStyles = () => {
    switch (size) {
      case "small":
        return { width: "32px", height: "32px", fontSize: "16px" };
      case "medium":
        return { width: "40px", height: "40px", fontSize: "20px" };
      case "large":
        return { width: "60px", height: "60px", fontSize: "30px" };
      case "xlarge":
        return { width: "120px", height: "120px", fontSize: "60px" };
      default:
        return { width: "40px", height: "40px", fontSize: "20px" };
    }
  };

  const sizeStyles = getSizeStyles();
  const avatar = avatars[avatarId] || avatars["avatar-1"]; // Fallback para avatar padrão

  return (
    <div
      className={`avatar ${className}`}
      style={{
        width: sizeStyles.width,
        height: sizeStyles.height,
        backgroundColor: avatar.color,
        borderRadius: "50%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: sizeStyles.fontSize,
        flexShrink: 0,
        ...style,
      }}
      title={`Avatar ${avatarId}`}
    >
      {avatar.emoji}
    </div>
  );
};

export default Avatar;
