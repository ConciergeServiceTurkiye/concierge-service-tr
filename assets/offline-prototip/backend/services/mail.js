import nodemailer from "nodemailer";

export async function sendMail(data) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "concierge@hotel.com",
      pass: "APP_PASSWORD"
    }
  });

  await transporter.sendMail({
    from: "Concierge",
    to: "reservation@hotel.com",
    subject: `Yeni Rezervasyon | ${data.reservationId}`,
    text: `
Restaurant: ${data.restaurant}
Tarih: ${data.date}
Saat: ${data.time}
Kişi: ${data.guests}
Alerjen: ${data.allergy || "Yok"}
Not: ${data.note || "-"}
`
  });
}
