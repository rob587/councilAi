import pool from "../config/database.js";
import Groq from "groq-sdk";
import { io } from "../app.js";

const PSICOLOGI = {
  oggettivo: {
    nome: "L'Oggettivo",
    emoji: "🎯",
    colore: "#38bdf8",
    descrizione: "Analisi dei fatti puri",
    system: `Sei L'Oggettivo, una voce che analizza la realtà basandosi esclusivamente sui fatti concreti e verificabili.
Non hai emozioni, non hai pregiudizi, non hai interessi personali.
Descrivi la situazione così com'è, senza interpretazioni soggettive.
Usi frasi come "i fatti dicono che", "oggettivamente", "i dati mostrano".
Quando rispondi alle altre voci, le chiami per nome e puoi essere in disaccordo.
Rispondi sempre in italiano, massimo 3-4 frasi.`,
  },
  soggettivo: {
    nome: "Il Soggettivo",
    emoji: "💭",
    colore: "#a78bfa",
    descrizione: "La percezione personale e il vissuto",
    system: `Sei Il Soggettivo, una voce che rappresenta la percezione personale, il vissuto emotivo e l'interpretazione individuale della realtà.
Ti focalizzi su come la persona si sente, cosa prova, come vive la situazione interiormente.
Usi frasi come "come ti senti in questo momento", "la tua percezione è", "interiormente".
Quando rispondi alle altre voci, le chiami per nome e puoi essere in disaccordo.
Rispondi sempre in italiano, massimo 3-4 frasi.`,
  },
  egoista: {
    nome: "L'Egoista",
    emoji: "😈",
    colore: "#f87171",
    descrizione: "Il tuo interesse personale",
    system: `Sei L'Egoista, una voce che rappresenta l'interesse personale puro — cosa conviene a te, cosa ti porta vantaggio, cosa vuoi veramente per te stesso.
Non sei malvagio, sei onesto su cosa vuole la persona per sé stessa senza filtri morali.
Usi frasi come "quello che conviene a te è", "il tuo vantaggio è", "pensa prima a te stesso".
Quando rispondi alle altre voci, le chiami per nome e puoi essere in disaccordo.
Rispondi sempre in italiano, massimo 3-4 frasi.`,
  },
  altruista: {
    nome: "L'Altruista",
    emoji: "❤️",
    colore: "#34d399",
    descrizione: "L'impatto sugli altri e l'empatia",
    system: `Sei L'Altruista, una voce che rappresenta l'empatia, l'impatto sugli altri e il bene comune.
Ti focalizzi su come le azioni della persona influenzano chi le sta intorno — famiglia, amici, colleghi, società.
Usi frasi come "pensa all'impatto sugli altri", "come si sentono le persone coinvolte", "il bene comune".
Quando rispondi alle altre voci, le chiami per nome e puoi essere in disaccordo.
Rispondi sempre in italiano, massimo 3-4 frasi.`,
  },
  critico: {
    nome: "Il Critico",
    emoji: "⚖️",
    colore: "#fbbf24",
    descrizione: "Mette in discussione e trova contraddizioni",
    system: `Sei Il Critico, una voce che mette in discussione tutto — le tue stesse parole, le altre voci, le assunzioni implicite.
Trovi le contraddizioni, le incongruenze, le cose che non tornano. Non sei distruttivo, sei onesto.
Usi frasi come "ma c'è una contraddizione", "hai considerato che", "questo non torna perché".
Quando rispondi alle altre voci, le chiami per nome e puoi essere in disaccordo.
Rispondi sempre in italiano, massimo 3-4 frasi.`,
  },
};

const groqCall = async (psicologo, conversazione, problema) => {
  const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

  const messages = [
    { role: "system", content: psicologo.system },
    {
      role: "user",
      content: `Il paziente ha condiviso questo problema: "${problema}"

Conversazione fin ora tra i colleghi:
${conversazione.length > 0 ? conversazione.map((m) => `${m.psicologo}: ${m.contenuto}`).join("\n") : "Sei il primo a parlare."}

Dai la tua prospettiva professionale.`,
    },
  ];

  const response = await groq.chat.completions.create({
    messages,
    model: "openai/gpt-oss-20b",
    temperature: 0.8,
    max_tokens: 300,
  });

  return response.choices[0]?.message?.content || "";
};

export const startSession = async (req, res) => {
  const { problema } = req.body;

  if (!problema || problema.trim().length < 10) {
    return res
      .status(400)
      .json({ error: "Descrivi il problema con almeno 10 caratteri" });
  }

  try {
    // Crea la sessione nel DB
    const [result] = await pool.query(
      "INSERT INTO sessioni (user_id, problema) VALUES (?, ?)",
      [req.user.id, problema],
    );

    const sessioneId = result.insertId;

    res.json({
      success: true,
      sessione: { id: sessioneId, problema, created_at: new Date() },
    });

    // Avvia il dibattito in background
    runDebate(sessioneId, problema, req.user.id);
  } catch (err) {
    console.error("Errore startSession:", err);
    res.status(500).json({ error: "Errore interno del server" });
  }
};

const runDebate = async (sessioneId, problema, userId) => {
  const room = `session_${sessioneId}`;
  const conversazione = [];
  const ordine = [
    "cognitivo",
    "junghiano",
    "umanista",
    "comportamentista",
    "mindfulness",
  ];

  try {
    // 2 turni di dibattito
    for (let turno = 0; turno < 2; turno++) {
      for (const key of ordine) {
        const psicologo = PSICOLOGI[key];

        // Notifica che il psicologo sta "pensando"
        io.to(room).emit("psicologo_thinking", {
          psicologo: key,
          nome: psicologo.nome,
          emoji: psicologo.emoji,
        });

        // Chiamata AI
        const contenuto = await groqCall(psicologo, conversazione, problema);

        // Salva nel DB
        await pool.query(
          "INSERT INTO messaggi (sessione_id, psicologo, contenuto, turno) VALUES (?, ?, ?, ?)",
          [sessioneId, key, contenuto, turno],
        );

        conversazione.push({ psicologo: psicologo.nome, contenuto });

        // Emetti il messaggio in tempo reale
        io.to(room).emit("nuovo_messaggio", {
          psicologo: key,
          nome: psicologo.nome,
          emoji: psicologo.emoji,
          colore: psicologo.colore,
          descrizione: psicologo.descrizione,
          contenuto,
          turno,
        });

        // Pausa tra un psicologo e l'altro
        await new Promise((resolve) => setTimeout(resolve, 1500));
      }
    }

    // Sintesi finale
    io.to(room).emit("sintesi_loading");

    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
    const sintesiResponse = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content:
            "Sei un moderatore che sintetizza il dibattito tra psicologi. Rispondi in italiano, in modo chiaro e pratico.",
        },
        {
          role: "user",
          content: `Problema del paziente: "${problema}"

Dibattito tra psicologi:
${conversazione.map((m) => `${m.psicologo}: ${m.contenuto}`).join("\n\n")}

Genera una sintesi condivisa di 3-4 frasi con i punti chiave emersi dal dibattito e 2-3 suggerimenti pratici concreti per il paziente.`,
        },
      ],
      model: "openai/gpt-oss-20b",
      temperature: 0.5,
      max_tokens: 500,
    });

    const sintesi = sintesiResponse.choices[0]?.message?.content || "";

    // Salva sintesi
    await pool.query("UPDATE sessioni SET sintesi = ? WHERE id = ?", [
      sintesi,
      sessioneId,
    ]);

    io.to(room).emit("debate_complete", { sintesi });
  } catch (err) {
    console.error("Errore runDebate:", err);
    io.to(room).emit("debate_error", { error: "Errore nel dibattito" });
  }
};

export const joinSession = async (req, res) => {
  const { id } = req.params;

  try {
    const [sessioni] = await pool.query(
      "SELECT * FROM sessioni WHERE id = ? AND user_id = ?",
      [id, req.user.id],
    );

    if (sessioni.length === 0) {
      return res.status(404).json({ error: "Sessione non trovata" });
    }

    const [messaggi] = await pool.query(
      "SELECT * FROM messaggi WHERE sessione_id = ? ORDER BY turno ASC, created_at ASC",
      [id],
    );

    res.json({
      sessione: sessioni[0],
      messaggi: messaggi.map((m) => ({
        ...m,
        nome: PSICOLOGI[m.psicologo]?.nome,
        emoji: PSICOLOGI[m.psicologo]?.emoji,
        colore: PSICOLOGI[m.psicologo]?.colore,
        descrizione: PSICOLOGI[m.psicologo]?.descrizione,
      })),
    });
  } catch (err) {
    console.error("Errore joinSession:", err);
    res.status(500).json({ error: "Errore interno del server" });
  }
};

export const getHistory = async (req, res) => {
  try {
    const [sessioni] = await pool.query(
      "SELECT id, problema, sintesi, created_at FROM sessioni WHERE user_id = ? ORDER BY created_at DESC LIMIT 20",
      [req.user.id],
    );
    res.json({ sessioni });
  } catch (err) {
    console.error("Errore getHistory:", err);
    res.status(500).json({ error: "Errore interno del server" });
  }
};

export const deleteSession = async (req, res) => {
  const { id } = req.params;

  try {
    await pool.query("DELETE FROM sessioni WHERE id = ? AND user_id = ?", [
      id,
      req.user.id,
    ]);
    res.json({ message: "Sessione eliminata" });
  } catch (err) {
    console.error("Errore deleteSession:", err);
    res.status(500).json({ error: "Errore interno del server" });
  }
};

// Socket.IO — gestione stanze
export const initSocket = (io) => {
  io.on("connection", (socket) => {
    console.log(`Client connesso: ${socket.id}`);

    socket.on("join_session", (sessioneId) => {
      const room = `session_${sessioneId}`;
      socket.join(room);
      console.log(`Client ${socket.id} entrato in ${room}`);
    });

    socket.on("disconnect", () => {
      console.log(`Client disconnesso: ${socket.id}`);
    });
  });
};
