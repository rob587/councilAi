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

  return <div>SessionHistory</div>;
};

export default SessionHistory;
