import dotenv from "dotenv";
dotenv.config();

import { httpServer } from "./src/app.js";

const PORT = process.env.PORT || 5000;

httpServer.listen(PORT, () => {
  console.log(`🚀 Server CouncilAI avviato su http://localhost:${PORT}`);
});
