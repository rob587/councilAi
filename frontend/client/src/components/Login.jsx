import { useState } from "react";
import { loginUser } from "../services/apiService";
import { useAuth } from "../context/AuthContext";

const Login = ({ onSwitch }) => {
  const { login } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await loginUser(form.email, form.password);
      login(data.user, data.token);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      <div
        style={{
          minHeight: "100vh",
          background:
            "linear-gradient(135deg, #0d0d1a 0%, #111827 50%, #0d0d1a 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "24px",
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 150, damping: 20 }}
          style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(139,92,246,0.25)",
            backdropFilter: "blur(20px)",
            borderRadius: "24px",
            padding: "40px",
            width: "100%",
            maxWidth: "420px",
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
            <h1
              style={{
                background: "linear-gradient(135deg, #a78bfa, #7c3aed)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                fontWeight: "700",
                fontSize: "1.8rem",
                margin: "0 0 8px",
              }}
            >
              CouncilAI
            </h1>
            <p style={{ color: "#6b7280", fontSize: "0.9rem", margin: 0 }}>
              Accedi al tuo account
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
                marginBottom: "20px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              {error}
              <button
                onClick={() => setError(null)}
                style={{
                  background: "none",
                  border: "none",
                  color: "#ef4444",
                  cursor: "pointer",
                }}
              >
                ✕
              </button>
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            style={{ display: "flex", flexDirection: "column", gap: "16px" }}
          >
            <div>
              <label
                style={{
                  display: "block",
                  color: "#9ca3af",
                  fontSize: "0.85rem",
                  marginBottom: "8px",
                }}
              >
                Email
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="la@tua.email"
                required
                style={{
                  width: "100%",
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(139,92,246,0.25)",
                  borderRadius: "12px",
                  padding: "12px 16px",
                  color: "#f3f4f6",
                  fontSize: "0.95rem",
                  outline: "none",
                  boxSizing: "border-box",
                  transition: "border-color 0.2s",
                }}
                onFocus={(e) => (e.target.style.borderColor = "#7c3aed")}
                onBlur={(e) =>
                  (e.target.style.borderColor = "rgba(139,92,246,0.25)")
                }
              />
            </div>

            <div>
              <label
                style={{
                  display: "block",
                  color: "#9ca3af",
                  fontSize: "0.85rem",
                  marginBottom: "8px",
                }}
              >
                Password
              </label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="••••••••"
                required
                style={{
                  width: "100%",
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(139,92,246,0.25)",
                  borderRadius: "12px",
                  padding: "12px 16px",
                  color: "#f3f4f6",
                  fontSize: "0.95rem",
                  outline: "none",
                  boxSizing: "border-box",
                  transition: "border-color 0.2s",
                }}
                onFocus={(e) => (e.target.style.borderColor = "#7c3aed")}
                onBlur={(e) =>
                  (e.target.style.borderColor = "rgba(139,92,246,0.25)")
                }
              />
            </div>

            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              style={{
                background: loading
                  ? "rgba(124,58,237,0.4)"
                  : "linear-gradient(135deg, #7c3aed, #6d28d9)",
                border: "none",
                borderRadius: "12px",
                padding: "14px",
                color: "white",
                fontWeight: "600",
                fontSize: "1rem",
                cursor: loading ? "not-allowed" : "pointer",
                marginTop: "8px",
              }}
            >
              {loading ? "Accesso in corso..." : "Accedi"}
            </motion.button>
          </form>

          <p
            style={{
              textAlign: "center",
              color: "#6b7280",
              fontSize: "0.875rem",
              marginTop: "24px",
            }}
          >
            Non hai un account?{" "}
            <span
              onClick={onSwitch}
              style={{ color: "#a78bfa", cursor: "pointer", fontWeight: "600" }}
            >
              Registrati
            </span>
          </p>
        </motion.div>
      </div>
    </>
  );
};

export default Login;
