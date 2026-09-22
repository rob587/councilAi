import { motion, AnimatePresence } from "framer-motion";

const PSICOLOGI_CONFIG = {
  oggettivo: {
    nome: "L'Oggettivo",
    emoji: "🎯",
    colore: "#38bdf8",
    descrizione: "Analisi dei fatti puri",
  },
  soggettivo: {
    nome: "Il Soggettivo",
    emoji: "💭",
    colore: "#a78bfa",
    descrizione: "La percezione personale e il vissuto",
  },
  egoista: {
    nome: "L'Egoista",
    emoji: "😈",
    colore: "#f87171",
    descrizione: "Il tuo interesse personale",
  },
  altruista: {
    nome: "L'Altruista",
    emoji: "❤️",
    colore: "#34d399",
    descrizione: "L'impatto sugli altri e l'empatia",
  },
  critico: {
    nome: "Il Critico",
    emoji: "⚖️",
    colore: "#fbbf24",
    descrizione: "Mette in discussione e trova contraddizioni",
  },
};

const MessageBubble = ({ messaggio, index }) => {
  const config = PSICOLOGI_CONFIG[messaggio.psicologo] || {
    nome: messaggio.nome,
    emoji: messaggio.emoji,
    colore: messaggio.colore,
    descrizione: messaggio.descrizione,
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -30, scale: 0.95 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      transition={{
        type: "spring",
        stiffness: 150,
        damping: 20,
        delay: index * 0.05,
      }}
      style={{ marginBottom: "20px" }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          marginBottom: "8px",
        }}
      >
        <div
          style={{
            width: "36px",
            height: "36px",
            borderRadius: "50%",
            background: `${config.colore}20`,
            border: `2px solid ${config.colore}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "1rem",
            flexShrink: 0,
          }}
        >
          {config.emoji}
        </div>
        <div>
          <p
            style={{
              color: config.colore,
              fontWeight: "600",
              fontSize: "0.9rem",
              margin: 0,
            }}
          >
            {config.nome}
          </p>
          <p style={{ color: "#4b5563", fontSize: "0.72rem", margin: 0 }}>
            {config.descrizione}
          </p>
        </div>
        {messaggio.turno !== undefined && (
          <span
            style={{
              marginLeft: "auto",
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.1)",
              color: "#4b5563",
              fontSize: "0.7rem",
              padding: "2px 8px",
              borderRadius: "20px",
            }}
          >
            Turno {messaggio.turno + 1}
          </span>
        )}
      </div>

      {/* Contenuto */}
      <div
        style={{
          background: `${config.colore}08`,
          border: `1px solid ${config.colore}25`,
          borderRadius: "0 16px 16px 16px",
          padding: "14px 16px",
          marginLeft: "46px",
        }}
      >
        <p
          style={{
            color: "#d1d5db",
            fontSize: "0.9rem",
            lineHeight: "1.7",
            margin: 0,
          }}
        >
          {messaggio.contenuto}
        </p>
      </div>
    </motion.div>
  );
};

const ThinkingIndicator = ({ psicologo }) => {
  if (!psicologo) return null;
  const config = PSICOLOGI_CONFIG[psicologo.psicologo] || psicologo;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      style={{ marginBottom: "20px" }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          marginBottom: "8px",
        }}
      >
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 1, repeat: Infinity }}
          style={{
            width: "36px",
            height: "36px",
            borderRadius: "50%",
            background: `${config.colore}20`,
            border: `2px solid ${config.colore}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "1rem",
            flexShrink: 0,
          }}
        >
          {config.emoji}
        </motion.div>
        <p
          style={{
            color: config.colore,
            fontWeight: "600",
            fontSize: "0.9rem",
            margin: 0,
          }}
        >
          {config.nome}
        </p>
      </div>
      <div
        style={{
          background: `${config.colore}08`,
          border: `1px solid ${config.colore}25`,
          borderRadius: "0 16px 16px 16px",
          padding: "14px 16px",
          marginLeft: "46px",
          display: "flex",
          gap: "6px",
          alignItems: "center",
        }}
      >
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
            style={{
              width: "8px",
              height: "8px",
              borderRadius: "50%",
              background: config.colore,
            }}
          />
        ))}
        <span
          style={{ color: "#6b7280", fontSize: "0.8rem", marginLeft: "4px" }}
        >
          sta elaborando...
        </span>
      </div>
    </motion.div>
  );
};

const SintesiCard = ({ sintesi }) => (
  <motion.div
    initial={{ opacity: 0, y: 20, scale: 0.95 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    transition={{ type: "spring", stiffness: 150, damping: 20 }}
    style={{
      background:
        "linear-gradient(135deg, rgba(99,102,241,0.1), rgba(139,92,246,0.1))",
      border: "1px solid rgba(139,92,246,0.4)",
      borderRadius: "16px",
      padding: "20px",
      marginTop: "24px",
    }}
  >
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "10px",
        marginBottom: "12px",
      }}
    >
      <span style={{ fontSize: "1.5rem" }}>🤝</span>
      <p
        style={{
          color: "#a78bfa",
          fontWeight: "700",
          fontSize: "1rem",
          margin: 0,
        }}
      >
        Sintesi del Consiglio
      </p>
    </div>
    <p
      style={{
        color: "#d1d5db",
        fontSize: "0.9rem",
        lineHeight: "1.8",
        margin: 0,
      }}
    >
      {sintesi}
    </p>
  </motion.div>
);

const MessageStream = ({
  messaggi,
  thinkingPsicologo,
  sintesi,
  sintesiLoading,
  isDebating,
}) => {
  return (
    <div>
      <AnimatePresence>
        {messaggi.map((msg, index) => (
          <MessageBubble
            key={`${msg.psicologo}-${msg.turno}-${index}`}
            messaggio={msg}
            index={index}
          />
        ))}
      </AnimatePresence>

      <AnimatePresence>
        {thinkingPsicologo && (
          <ThinkingIndicator key="thinking" psicologo={thinkingPsicologo} />
        )}
      </AnimatePresence>

      {sintesiLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{
            background: "rgba(139,92,246,0.05)",
            border: "1px solid rgba(139,92,246,0.2)",
            borderRadius: "16px",
            padding: "20px",
            marginTop: "24px",
            display: "flex",
            alignItems: "center",
            gap: "12px",
          }}
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
            style={{
              width: "24px",
              height: "24px",
              border: "2px solid rgba(139,92,246,0.3)",
              borderTop: "2px solid #a78bfa",
              borderRadius: "50%",
            }}
          />
          <p style={{ color: "#a78bfa", fontSize: "0.9rem", margin: 0 }}>
            Il consiglio sta elaborando la sintesi finale...
          </p>
        </motion.div>
      )}

      {sintesi && <SintesiCard sintesi={sintesi} />}
    </div>
  );
};

export default MessageStream;
