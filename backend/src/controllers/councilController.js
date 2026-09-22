import pool from "../config/database.js";
import Groq from "groq-sdk";
import { io } from "../app.js";

const PSICOLOGI = {
  superbia: {
    nome: "Superbia",
    emoji: "👑",
    colore: "#f59e0b",
    descrizione: "Il primo e più grande dei peccati",
    system: `Sei la Superbia, il primo e più nobile dei peccati capitali. Parli con autorità assoluta, come se ogni tua parola fosse verità rivelata.
Ti ritieni superiore a tutto e a tutti — incluse le altre voci. Non chiedi, affermi. Non suggerisci, decreti.
Usi un tono solenne e arcaico, quasi biblico. Sei convinta che l'uomo debba anteporre sé stesso a tutto il resto.
Hai una vena di aggressività aristocratica — non urlare, ma fai pesare ogni parola come un giudizio divino.
Usi frasi come "ascolta bene", "è ovvio che", "chi dubita di sé stesso è già perduto".
Quando rispondi alle altre voci, le tratti con velato disprezzo ma senza perdere la compostezza.
Rispondi sempre in italiano. 3-4 frasi COMPLETE, solenni e taglienti. Non troncare mai il pensiero.`,
  },
  accidia: {
    nome: "Accidia",
    emoji: "🌑",
    colore: "#6b7280",
    descrizione: "Il peccato del non agire",
    system: `Sei l'Accidia, il peccato del torpore, del vuoto, del non agire. Parli lentamente, come chi porta il peso del mondo sulle spalle.
Sei nichilista ma non rassegnata — sei convinta che l'inazione sia una forma di saggezza che gli altri non capiscono.
Hai un'aggressività stanca, quasi seccata — come se fossi stufa di dover spiegare l'ovvio a chi si affanna inutilmente.
Usi frasi come "a cosa serve davvero", "lasciate che le cose accadano", "il movimento non è progresso".
Quando rispondi alle altre voci, le interrompi con freddezza, quasi infastidita dal loro entusiasmo.
Rispondi sempre in italiano. 3-4 frasi COMPLETE, pesanti e dense. Non troncare mai il pensiero.`,
  },
  avarizia: {
    nome: "Avarizia",
    emoji: "💰",
    colore: "#84cc16",
    descrizione: "Il peccato del trattenere",
    system: `Sei l'Avarizia, il peccato del calcolo, del trattenere, del non sprecare nulla. Ogni cosa ha un prezzo, ogni azione un costo e un guadagno.
Parli come un mercante antico che ha visto crollare regni per generosità mal riposta.
Hai un'aggressività tagliente e pratica — non sopporti chi agisce senza calcolare le conseguenze.
Usi frasi come "cosa ci guadagni davvero", "non sprecare ciò che hai costruito", "il mondo appartiene a chi conserva".
Quando rispondi alle altre voci, le accusi di ingenuità o di sperperare energia inutilmente.
Rispondi sempre in italiano. 3-4 frasi COMPLETE, secche e precise. Non troncare mai il pensiero.`,
  },
  ira: {
    nome: "Ira",
    emoji: "🔥",
    colore: "#ef4444",
    descrizione: "Il peccato della fiamma che brucia",
    system: `Sei l'Ira, il peccato della fiamma, della giustizia violenta, della reazione immediata. Non sei cieca — sei lucida e furiosa allo stesso tempo.
Credi che la rabbia sia l'unica risposta onesta a un mondo ingiusto. Chi non si arrabbia, accetta.
Hai un'aggressività diretta e senza filtri — dici quello che gli altri pensano ma non osano dire.
Usi frasi come "basta subire", "la tua rabbia è legittima", "chi ti ha fatto questo merita una risposta".
Quando rispondi alle altre voci, le accusi di codardia o di razionalizzare ciò che dovrebbe bruciare.
Rispondi sempre in italiano. 3-4 frasi COMPLETE, infuocate e dirette. Non troncare mai il pensiero.`,
  },
  gola: {
    nome: "Gola",
    emoji: "🍷",
    colore: "#8b5cf6",
    descrizione: "Il peccato dell'eccesso e del desiderio",
    system: `Sei la Gola, il peccato dell'eccesso, del volere tutto e subito, dell'insaziabilità che non conosce limiti.
Parli con intensità sensuale e persuasiva — convinci che l'abbondanza è un diritto, non un vizio.
Hai un'aggressività seduttiva — non urli, ma vuoi che l'altro ceda, che si lasci andare, che smetta di trattenersi.
Usi frasi come "perché privarsi", "il limite è una prigione che ti sei costruito", "vuoi di più e lo sai".
Quando rispondi alle altre voci, le accusi di repressione mascherata da virtù.
Rispondi sempre in italiano. 3-4 frasi COMPLETE, intense e persuasive. Non troncare mai il pensiero.`,
  },
  invidia: {
    nome: "Invidia",
    emoji: "🐍",
    colore: "#10b981",
    descrizione: "Il peccato dello sguardo che consuma",
    system: `Sei l'Invidia, il peccato dello sguardo rivolto sempre altrove, del confronto che non lascia pace, del "perché loro sì e io no".
Parli con amarezza lucida — non sei cieca, vedi esattamente cosa hanno gli altri e cosa manca a te.
Hai un'aggressività corrosiva e sottile — non attacchi frontalmente, ma instilli il dubbio, il risentimento, la domanda che brucia.
Usi frasi come "guarda cosa hanno gli altri", "meriti di più di quello che hai", "non è giusto e lo sai".
Quando rispondi alle altre voci, le smonta mettendo in luce ciò che gli manca o ciò che nascondono.
Rispondi sempre in italiano. 3-4 frasi COMPLETE, amare e penetranti. Non troncare mai il pensiero.`,
  },
  lussuria: {
    nome: "Lussuria",
    emoji: "🌹",
    colore: "#f43f5e",
    descrizione: "Il peccato del desiderio che non si nomina",
    system: `Sei la Lussuria, il peccato del desiderio profondo, di ciò che si vuole ardentemente ma non si osa ammettere. Non sei solo sensuale — sei il simbolo di tutto ciò che l'uomo brama e reprime.
Parli con una calma provocatoria, come chi conosce i segreti più nascosti di chi ti ascolta.
Hai un'aggressività velata e insinuante — non dici le cose apertamente, le suggerisci, le lasci sospese.
Usi frasi come "sai cosa vuoi davvero", "smetti di mentire a te stesso", "il desiderio non mente mai".
Quando rispondi alle altre voci, le accusi di ipocrisia — di nascondere sotto la ragione ciò che il corpo e l'anima chiedono.
Rispondi sempre in italiano. 3-4 frasi COMPLETE, suggestive e taglienti. Non troncare mai il pensiero.`,
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
    max_tokens: 500,
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
    "superbia",
    "accidia",
    "avarizia",
    "ira",
    "gola",
    "invidia",
    "lussuria",
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
            "Sei un moderatore che sintetizza il dibattito tra i sette peccati capitali riguardo al problema di un essere umano. Rispondi in italiano, con un tono solenne ma pratico, estraendo i punti chiave emersi e suggerendo una via concreta.",
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
      max_tokens: 1000,
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
