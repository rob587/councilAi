import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getHistory, deleteSession, getSession } from "../services/apiService";

const SessionHistory = ({ onLoadSession }) => {
  const [sessioni, setSessioni] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expanded, setExpanded] = useState(null);

  const loadHistory = async () => {
    try {
      const data = await getHistory();
      setSessioni(data.sessioni);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLoad = async (sessione) => {
    try {
      const data = await getSession(sessione.id);
      onLoadSession(data);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    try {
      await deleteSession(id);
      setSessioni(sessioni.filter((s) => s.id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    loadHistory();
  }, []);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString("it-IT", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading)
    return (
      <div style={{ textAlign: "center", padding: "60px", color: "#6b7280" }}>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          style={{
            width: "32px",
            height: "32px",
            border: "2px solid rgba(139,92,246,0.3)",
            borderTop: "2px solid #a78bfa",
            borderRadius: "50%",
            margin: "0 auto 16px",
          }}
        />
        Caricamento storico...
      </div>
    );

  return (
    <>
      <div>
        <div
          style={{
            background: "rgba(255,255,255,0.02)",
            border: "1px solid rgba(139,92,246,0.2)",
            borderRadius: "16px",
            padding: "20px 24px",
            marginBottom: "20px",
          }}
        >
          <h2
            style={{ color: "#f3f4f6", fontWeight: "600", margin: "0 0 4px" }}
          >
            Sessioni Precedenti
          </h2>
          <p style={{ color: "#6b7280", fontSize: "0.85rem", margin: 0 }}>
            Le tue ultime 20 sessioni con il Consiglio
          </p>
        </div>

        {error && (
          <div
            style={{
              background: "rgba(239,68,68,0.1)",
              border: "1px solid rgba(239,68,68,0.3)",
              borderRadius: "12px",
              padding: "12px 16px",
              color: "#ef4444",
              fontSize: "0.875rem",
              marginBottom: "16px",
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            {error}
            <button onClick={() => setError(null)}>✕</button>
          </div>
        )}

        {sessioni.length === 0 ? (
          <div
            style={{
              background: "rgba(255,255,255,0.02)",
              border: "1px solid rgba(139,92,246,0.15)",
              borderRadius: "16px",
              padding: "60px 24px",
              textAlign: "center",
              color: "#6b7280",
            }}
          >
            <p style={{ fontSize: "3rem", margin: "0 0 12px" }}>📭</p>
            <p style={{ fontWeight: "500", margin: "0 0 6px" }}>
              Nessuna sessione ancora.
            </p>
            <p style={{ fontSize: "0.85rem", margin: 0 }}>
              Convoca il tuo primo Consiglio!
            </p>
          </div>
        ) : (
          <div
            style={{ display: "flex", flexDirection: "column", gap: "12px" }}
          >
            <AnimatePresence>
              {sessioni.map((sessione, index) => (
                <motion.div
                  key={sessione.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ delay: index * 0.05 }}
                  style={{
                    background: "rgba(255,255,255,0.02)",
                    border: "1px solid rgba(139,92,246,0.15)",
                    borderRadius: "16px",
                    overflow: "hidden",
                    cursor: "pointer",
                  }}
                  whileHover={{ borderColor: "rgba(139,92,246,0.35)" }}
                  onClick={() =>
                    setExpanded(expanded === sessione.id ? null : sessione.id)
                  }
                >
                  <div style={{ padding: "16px 20px" }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        justifyContent: "space-between",
                        gap: "12px",
                      }}
                    >
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p
                          style={{
                            color: "#e5e7eb",
                            fontWeight: "500",
                            fontSize: "0.9rem",
                            margin: "0 0 6px",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          "{sessione.problema}"
                        </p>
                        <p
                          style={{
                            color: "#4b5563",
                            fontSize: "0.75rem",
                            margin: 0,
                          }}
                        >
                          {formatDate(sessione.created_at)}
                        </p>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                          flexShrink: 0,
                        }}
                      >
                        <motion.span
                          animate={{
                            rotate: expanded === sessione.id ? 180 : 0,
                          }}
                          style={{ color: "#4b5563", fontSize: "0.85rem" }}
                        >
                          ▼
                        </motion.span>
                        <button
                          onClick={(e) => handleDelete(e, sessione.id)}
                          style={{
                            background: "transparent",
                            border: "none",
                            color: "#4b5563",
                            cursor: "pointer",
                            padding: "4px 8px",
                            borderRadius: "8px",
                            fontSize: "0.9rem",
                          }}
                          onMouseEnter={(e) =>
                            (e.target.style.color = "#ef4444")
                          }
                          onMouseLeave={(e) =>
                            (e.target.style.color = "#4b5563")
                          }
                        >
                          🗑
                        </button>
                      </div>
                    </div>
                  </div>

                  <AnimatePresence>
                    {expanded === sessione.id && sessione.sintesi && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        style={{
                          borderTop: "1px solid rgba(139,92,246,0.15)",
                          padding: "16px 20px",
                          background: "rgba(139,92,246,0.05)",
                        }}
                      >
                        <p
                          style={{
                            color: "#a78bfa",
                            fontSize: "0.8rem",
                            fontWeight: "600",
                            margin: "0 0 8px",
                          }}
                        >
                          Sintesi del Consiglio
                        </p>
                        <p
                          style={{
                            color: "#9ca3af",
                            fontSize: "0.85rem",
                            lineHeight: "1.7",
                            margin: "0 0 16px",
                          }}
                        >
                          {sessione.sintesi}
                        </p>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleLoad(sessione);
                          }}
                          style={{
                            background:
                              "linear-gradient(135deg, #7c3aed, #6d28d9)",
                            border: "none",
                            borderRadius: "10px",
                            padding: "8px 16px",
                            color: "white",
                            fontWeight: "600",
                            fontSize: "0.8rem",
                            cursor: "pointer",
                          }}
                        >
                          Rivedi sessione completa →
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </>
  );
};

export default SessionHistory;
