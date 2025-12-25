import express from "express";
import cors from "cors";
import reservationRoutes from "./routes/reservations.js";

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/reservations", reservationRoutes);

app.get("/", (req, res) => {
  res.send("Concierge API running ✅");
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
