const BASE_URL = "http://localhost:5000/api";

const getHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

//autenticazione
export const registerUser = async (username, email, password) => {
  const res = await fetch(`${BASE_URL}/auth/register`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify({ username, email, password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Errore registrazione");
  return data;
};

export const loginUser = async (email, password) => {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Errore login");
  return data;
};

// COUNCIL
export const startSession = async (problema) => {
  const res = await fetch(`${BASE_URL}/council/start`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify({ problema }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Errore avvio sessione");
  return data;
};

export const getSession = async (id) => {
  const res = await fetch(`${BASE_URL}/council/${id}`, {
    headers: getHeaders(),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Errore fetch sessione");
  return data;
};

export const getHistory = async () => {
  const res = await fetch(`${BASE_URL}/council/history`, {
    headers: getHeaders(),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Errore fetch storico");
  return data;
};

export const deleteSession = async (id) => {
  const res = await fetch(`${BASE_URL}/council/${id}`, {
    method: "DELETE",
    headers: getHeaders(),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Errore eliminazione sessione");
  return data;
};
