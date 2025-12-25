import twilio from "twilio";

const client = twilio(
  process.env.TWILIO_SID,
  process.env.TWILIO_TOKEN
);

export async function sendWhatsApp(data) {
  await client.messages.create({
    from: "whatsapp:+14155238886",
    to: "whatsapp:+905XXXXXXXXX",
    body: `
🍽️ Yeni Rezervasyon

${data.restaurant}
📅 ${data.date}
⏰ ${data.time}
👤 ${data.guests} kişi

ID: ${data.reservationId}
`
  });
}
