import { useState } from "react";
import { motion } from "framer-motion";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Login from "./components/Login";
import Register from "./components/Register";
import CouncilRoom from "./components/CouncilRoom";
import SessionHistory from "./components/SessionHistory";
import MessageStream from "./components/MessageStream";

const AppContent = () => {
  const { user, logout, loading } = useAuth();
  const [showRegister, setShowRegister] = useState(false);
  const [activeTab, setActiveTab] = useState("council");
  const [loadedSession, setLoadedSession] = useState(null);

  if (loading)
    return (
      <div
        style={{
          minHeight: "100vh",
          background:
            "linear-gradient(135deg, #0d0d1a 0%, #111827 50%, #0d0d1a 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#6b7280",
        }}
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          style={{
            width: "32px",
            height: "32px",
            border: "2px solid rgba(139,92,246,0.3)",
            borderTop: "2px solid #a78bfa",
            borderRadius: "50%",
          }}
        />
      </div>
    );

  if (!user) {
    return showRegister ? (
      <Register onSwitch={() => setShowRegister(false)} />
    ) : (
      <Login onSwitch={() => setShowRegister(true)} />
    );
  }

  const handleLoadSession = (sessionData) => {
    setLoadedSession(sessionData);
    setActiveTab("session");
  };

  const TABS = [
    { id: "council", label: "🧬 Nuovo Consiglio" },
    { id: "history", label: "📚 Storico" },
    ...(loadedSession ? [{ id: "session", label: "🔍 Sessione" }] : []),
  ];

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(135deg, #0d0d1a 0%, #111827 50%, #0d0d1a 100%)",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <header
        style={{
          background: "rgba(255,255,255,0.02)",
          backdropFilter: "blur(20px)",
          borderBottom: "1px solid rgba(139,92,246,0.2)",
          padding: "16px 24px",
          position: "sticky",
          top: 0,
          zIndex: 50,
        }}
      >
        <div
          style={{
            maxWidth: "800px",
            margin: "0 auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <motion.div
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
              style={{ fontSize: "1.5rem" }}
            >
              🧬
            </motion.div>
            <div>
              <h1
                style={{
                  background: "linear-gradient(135deg, #a78bfa, #7c3aed)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  fontWeight: "700",
                  fontSize: "1.2rem",
                  margin: 0,
                }}
              >
                CouncilAI
              </h1>
              <p style={{ color: "#4b5563", fontSize: "0.72rem", margin: 0 }}>
                Ciao, {user.username}
              </p>
            </div>
          </div>
          <button
            onClick={logout}
            style={{
              background: "transparent",
              border: "1px solid rgba(239,68,68,0.3)",
              borderRadius: "10px",
              padding: "8px 16px",
              color: "#6b7280",
              cursor: "pointer",
              fontSize: "0.85rem",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => {
              e.target.style.color = "#ef4444";
              e.target.style.borderColor = "rgba(239,68,68,0.6)";
            }}
            onMouseLeave={(e) => {
              e.target.style.color = "#6b7280";
              e.target.style.borderColor = "rgba(239,68,68,0.3)";
            }}
          >
            Esci
          </button>
        </div>
      </header>

      <nav
        style={{
          background: "rgba(255,255,255,0.01)",
          borderBottom: "1px solid rgba(139,92,246,0.1)",
          padding: "0 24px",
        }}
      >
        <div
          style={{
            maxWidth: "800px",
            margin: "0 auto",
            display: "flex",
            gap: "4px",
          }}
        >
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                background: "transparent",
                border: "none",
                borderBottom:
                  activeTab === tab.id
                    ? "2px solid #7c3aed"
                    : "2px solid transparent",
                color: activeTab === tab.id ? "#a78bfa" : "#6b7280",
                padding: "12px 16px",
                cursor: "pointer",
                fontSize: "0.875rem",
                fontWeight: activeTab === tab.id ? "600" : "400",
                transition: "all 0.2s",
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </nav>

      <main style={{ flex: 1, padding: "32px 24px" }}>
        <div style={{ maxWidth: "800px", margin: "0 auto" }}>
          {activeTab === "council" && <CouncilRoom onSessionStart={() => {}} />}
          {activeTab === "history" && (
            <SessionHistory onLoadSession={handleLoadSession} />
          )}
          {activeTab === "session" && loadedSession && (
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
                <p
                  style={{
                    color: "#a78bfa",
                    fontWeight: "600",
                    fontSize: "0.85rem",
                    margin: "0 0 6px",
                  }}
                >
                  Problema discusso
                </p>
                <p
                  style={{
                    color: "#9ca3af",
                    fontSize: "0.9rem",
                    fontStyle: "italic",
                    margin: 0,
                  }}
                >
                  "{loadedSession.sessione.problema}"
                </p>
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
                  messaggi={loadedSession.messaggi}
                  thinkingPsicologo={null}
                  sintesi={loadedSession.sessione.sintesi}
                  sintesiLoading={false}
                  isDebating={false}
                />
              </div>
            </div>
          )}
        </div>
      </main>

      <footer
        style={{
          borderTop: "1px solid rgba(139,92,246,0.1)",
          padding: "16px 24px",
          textAlign: "center",
          color: "#374151",
          fontSize: "0.8rem",
        }}
      >
        CouncilAI — Il tuo consiglio di psicologi AI
      </footer>
    </div>
  );
};

const App = () => (
  <AuthProvider>
    <AppContent />
  </AuthProvider>
);

export default App;
