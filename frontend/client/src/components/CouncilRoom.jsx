import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { io } from "socket.io-client";
import { startSession } from "../services/apiService";
import MessageStream from "./MessageStream";

const PSICOLOGI_CONFIG = {
  cognitivo: {
    nome: "Dr. Cognitive",

    colore: "#38bdf8",
    descrizione: "Cognitivo-Comportamentale",
  },
  junghiano: {
    nome: "Dr. Jung",

    colore: "#a78bfa",
    descrizione: "Junghiano",
  },
  umanista: {
    nome: "Dr. Rogers",

    colore: "#34d399",
    descrizione: "Umanistico",
  },
  comportamentista: {
    nome: "Dr. Skinner",

    colore: "#fbbf24",
    descrizione: "Comportamentale",
  },
  mindfulness: {
    nome: "Dr. Kabat",

    colore: "#fb923c",
    descrizione: "Mindfulness",
  },
};

const CouncilRoom = ({ onSessionStart }) => {
  const [problema, setProblema] = useState("");
  const [sessione, setSessione] = useState(null);
  const [messaggi, setMessaggi] = useState([]);
  const [thinkingPsicologo, setThinkingPsicologo] = useState(null);
  const [sintesi, setSintesi] = useState(null);
  const [sintesiLoading, setSintesiLoading] = useState(false);
  const [isDebating, setIsDebating] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [phase, setPhase] = useState("input"); // input | debating | complete
  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    socketRef.current = io("http://localhost:5000");
    return () => socketRef.current?.disconnect();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messaggi, thinkingPsicologo, sintesi]);

  const setupSocketListeners = (sessioneId) => {
    const socket = socketRef.current;
    socket.emit("join_session", sessioneId);

    socket.on("psicologo_thinking", (data) => {
      setThinkingPsicologo(data);
    });

    socket.on("nuovo_messaggio", (msg) => {
      setThinkingPsicologo(null);
      setMessaggi((prev) => [...prev, msg]);
    });

    socket.on("sintesi_loading", () => {
      setSintesiLoading(true);
      setThinkingPsicologo(null);
    });

    socket.on("debate_complete", ({ sintesi }) => {
      setSintesiLoading(false);
      setSintesi(sintesi);
      setIsDebating(false);
      setPhase("complete");
    });

    socket.on("debate_error", ({ error }) => {
      setError(error);
      setIsDebating(false);
      setSintesiLoading(false);
    });
  };

  const handleStart = async (e) => {
    e.preventDefault();
    if (problema.trim().length < 10) return;
    setLoading(true);
    setError(null);

    try {
      const data = await startSession(problema);
      setSessione(data.sessione);
      setPhase("debating");
      setIsDebating(true);
      onSessionStart?.(data.sessione.id);
      setupSocketListeners(data.sessione.id);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    socketRef.current?.off("psicologo_thinking");
    socketRef.current?.off("nuovo_messaggio");
    socketRef.current?.off("sintesi_loading");
    socketRef.current?.off("debate_complete");
    socketRef.current?.off("debate_error");
    setProblema("");
    setSessione(null);
    setMessaggi([]);
    setThinkingPsicologo(null);
    setSintesi(null);
    setSintesiLoading(false);
    setIsDebating(false);
    setPhase("input");
    setError(null);
  };

  return (
    <div>
      <AnimatePresence mode="wait">
        {phase === "input" && (
          <motion.div
            key="input"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            {/* Form input */}
            <div
              style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(139,92,246,0.2)",
                backdropFilter: "blur(20px)",
                borderRadius: "24px",
                padding: "40px",
                maxWidth: "700px",
                margin: "0 auto",
              }}
            >
              <div style={{ textAlign: "center", marginBottom: "32px" }}>
                <motion.div
                  animate={{ rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 4, repeat: Infinity }}
                  style={{ fontSize: "3rem", marginBottom: "12px" }}
                >
                  🧬
                </motion.div>
                <h2
                  style={{
                    color: "#f3f4f6",
                    fontSize: "1.5rem",
                    fontWeight: "700",
                    margin: "0 0 8px",
                  }}
                >
                  Il Consiglio ti ascolta
                </h2>
                <p style={{ color: "#6b7280", fontSize: "0.9rem", margin: 0 }}>
                  5 psicologi con approcci diversi analizzeranno il tuo problema
                  in tempo reale
                </p>
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  gap: "12px",
                  marginBottom: "32px",
                  flexWrap: "wrap",
                }}
              >
                {Object.values(PSICOLOGI_CONFIG).map((p, i) => (
                  <motion.div
                    key={p.nome}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: "6px",
                    }}
                  >
                    <div
                      style={{
                        width: "48px",
                        height: "48px",
                        borderRadius: "50%",
                        background: `${p.colore}15`,
                        border: `2px solid ${p.colore}50`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "1.4rem",
                      }}
                    >
                      {p.emoji}
                    </div>
                    <span
                      style={{
                        color: "#4b5563",
                        fontSize: "0.65rem",
                        textAlign: "center",
                        maxWidth: "60px",
                      }}
                    >
                      {p.descrizione}
                    </span>
                  </motion.div>
                ))}
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
                    marginBottom: "20px",
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  {error}
                  <button onClick={() => setError(null)}>✕</button>
                </div>
              )}

              <form onSubmit={handleStart}>
                <div style={{ marginBottom: "16px" }}>
                  <label
                    style={{
                      color: "#9ca3af",
                      fontSize: "0.85rem",
                      display: "block",
                      marginBottom: "8px",
                    }}
                  >
                    Cosa ti pesa? Cosa vorresti capire meglio?
                  </label>
                  <textarea
                    value={problema}
                    onChange={(e) => setProblema(e.target.value)}
                    placeholder="Descrivi liberamente il tuo problema, pensiero o situazione... il consiglio ti aiuterà ad analizzarlo da prospettive diverse."
                    rows={5}
                    style={{
                      width: "100%",
                      background: "rgba(255,255,255,0.05)",
                      border: "1px solid rgba(139,92,246,0.3)",
                      borderRadius: "16px",
                      padding: "16px",
                      color: "#f3f4f6",
                      fontSize: "0.95rem",
                      lineHeight: "1.7",
                      resize: "vertical",
                      outline: "none",
                      boxSizing: "border-box",
                      fontFamily: "inherit",
                    }}
                  />
                  <p
                    style={{
                      color: "#4b5563",
                      fontSize: "0.75rem",
                      marginTop: "6px",
                    }}
                  >
                    {problema.length} caratteri{" "}
                    {problema.length < 10 &&
                      problema.length > 0 &&
                      "— scrivi almeno 10 caratteri"}
                  </p>
                </div>

                <motion.button
                  type="submit"
                  disabled={loading || problema.trim().length < 10}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  style={{
                    width: "100%",
                    background:
                      loading || problema.trim().length < 10
                        ? "rgba(139,92,246,0.3)"
                        : "linear-gradient(135deg, #7c3aed, #6d28d9)",
                    border: "none",
                    borderRadius: "16px",
                    padding: "16px",
                    color: "white",
                    fontWeight: "600",
                    fontSize: "1rem",
                    cursor:
                      loading || problema.trim().length < 10
                        ? "not-allowed"
                        : "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px",
                  }}
                >
                  {loading ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{
                          duration: 1,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                        style={{
                          width: "18px",
                          height: "18px",
                          border: "2px solid rgba(255,255,255,0.3)",
                          borderTop: "2px solid white",
                          borderRadius: "50%",
                        }}
                      />
                      Convoco il Consiglio...
                    </>
                  ) : (
                    <>🧬 Convoca il Consiglio</>
                  )}
                </motion.button>
              </form>
            </div>
          </motion.div>
        )}

        {(phase === "debating" || phase === "complete") && (
          <motion.div
            key="debate"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div
              style={{
                background: "rgba(255,255,255,0.02)",
                border: "1px solid rgba(139,92,246,0.2)",
                borderRadius: "16px",
                padding: "20px 24px",
                marginBottom: "20px",
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "space-between",
                gap: "16px",
              }}
            >
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    marginBottom: "8px",
                  }}
                >
                  {isDebating && (
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 1, repeat: Infinity }}
                      style={{
                        width: "8px",
                        height: "8px",
                        borderRadius: "50%",
                        background: "#34d399",
                      }}
                    />
                  )}
                  <span
                    style={{
                      color: isDebating ? "#34d399" : "#6b7280",
                      fontSize: "0.8rem",
                      fontWeight: "600",
                    }}
                  >
                    {isDebating ? "Dibattito in corso" : "Sessione completata"}
                  </span>
                </div>
                <p
                  style={{
                    color: "#9ca3af",
                    fontSize: "0.9rem",
                    margin: 0,
                    fontStyle: "italic",
                  }}
                >
                  "{sessione?.problema}"
                </p>
              </div>
              {phase === "complete" && (
                <button
                  onClick={handleReset}
                  style={{
                    background: "linear-gradient(135deg, #7c3aed, #6d28d9)",
                    border: "none",
                    borderRadius: "12px",
                    padding: "10px 20px",
                    color: "white",
                    fontWeight: "600",
                    fontSize: "0.85rem",
                    cursor: "pointer",
                    flexShrink: 0,
                  }}
                >
                  + Nuova Sessione
                </button>
              )}
            </div>

            <div
              style={{
                background: "rgba(255,255,255,0.02)",
                border: "1px solid rgba(139,92,246,0.15)",
                borderRadius: "16px",
                padding: "24px",
              }}
            >
              <MessageStream
                messaggi={messaggi}
                thinkingPsicologo={thinkingPsicologo}
                sintesi={sintesi}
                sintesiLoading={sintesiLoading}
                isDebating={isDebating}
              />
              <div ref={messagesEndRef} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CouncilRoom;
