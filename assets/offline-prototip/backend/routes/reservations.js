import express from "express";
import { create, list } from "../controllers/reservationController.js";
import { sendMail } from "../services/mail.js";
import { sendWhatsApp } from "../services/whatsapp.js";

const router = express.Router();


router.post("/", create);
router.get("/", list);
router.post("/", async (req, res) => {
  const data = req.body;

  await sendMail(data);
  await sendWhatsApp(data);

  res.json({ status: "ok" });
});

export default router;
