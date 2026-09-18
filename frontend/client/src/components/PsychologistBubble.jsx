import React from "react";
import { motion } from "framer-motion";

const PsychologistBubble = ({ psicologo, isThinking }) => {
  const { nome, emoji, colore, descrizione } = psicologo;
  return (
    <>
      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
        style={{
          background: `${colore}10`,
          border: `1px solid ${colore}40`,
          borderRadius: "16px",
          padding: "16px",
          marginBottom: "16px",
          position: "relative",
        }}
      >
        {/* Header psicologo */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            marginBottom: "10px",
          }}
        >
          <motion.div
            animate={isThinking ? { rotate: [0, -10, 10, -10, 0] } : {}}
            transition={{ duration: 0.5, repeat: isThinking ? Infinity : 0 }}
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              background: `${colore}20`,
              border: `2px solid ${colore}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "1.2rem",
              flexShrink: 0,
            }}
          >
            {emoji}
          </motion.div>
          <div>
            <p
              style={{
                color: colore,
                fontWeight: "600",
                fontSize: "0.95rem",
                margin: 0,
              }}
            >
              {nome}
            </p>
            <p style={{ color: "#6b7280", fontSize: "0.75rem", margin: 0 }}>
              {descrizione}
            </p>
          </div>

          {isThinking && (
            <motion.div
              style={{
                marginLeft: "auto",
                display: "flex",
                gap: "4px",
                alignItems: "center",
              }}
            >
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  animate={{ y: [0, -6, 0] }}
                  transition={{
                    duration: 0.6,
                    repeat: Infinity,
                    delay: i * 0.15,
                  }}
                  style={{
                    width: "6px",
                    height: "6px",
                    borderRadius: "50%",
                    background: colore,
                  }}
                />
              ))}
            </motion.div>
          )}
        </div>
      </motion.div>
    </>
  );
};

export default PsychologistBubble;
