const ALLOWED_ORIGINS = new Set([
  "https://www.conciergeservice.com.tr",
  "https://conciergeservice.com.tr",
  "https://concierge-service-tr.pages.dev"
]);

const TEAM_EMAIL = "info@conciergeservice.com.tr";
const SENDER = "Concierge Service Türkiye <reservations@send.conciergeservice.com.tr>";

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store"
    }
  });
}

function clean(value, maxLength = 2000) {
  return String(value ?? "").trim().slice(0, maxLength);
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, character => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  })[character]);
}

function reservationRows(data) {
  const fields = [
    ["Restaurant", data.restaurant],
    ["Full name", data.name],
    ["Email", data.email],
    ["Phone / WhatsApp", data.phone],
    ["Date", data.date],
    ["Time", data.time],
    ["Guests", data.guests],
    ["Children (0–3)", data.age_0_3 || "N/A"],
    ["Children (4–13)", data.age_4_13 || "N/A"],
    ["Children (14–17)", data.age_14_17 || "N/A"],
    ["Pets", data.pets || "None"],
    ["Allergies", data.allergy || "None"],
    ["Notes", data.notes || "None"],
    ["Preferred method", data.preferred_method]
  ];

  return fields.map(([label, value]) => ({
    label,
    value: clean(value, label === "Notes" ? 2000 : 1000) || "—"
  }));
}

function buildHtml(title, intro, rows) {
  const tableRows = rows.map(({ label, value }) => `
    <tr>
      <td style="padding:10px 12px;border-bottom:1px solid #e8e8e8;color:#666;font-size:13px;width:36%;vertical-align:top">${escapeHtml(label)}</td>
      <td style="padding:10px 12px;border-bottom:1px solid #e8e8e8;color:#222;font-size:14px;white-space:pre-wrap">${escapeHtml(value)}</td>
    </tr>`).join("");

  return `
    <div style="margin:0;padding:32px 12px;background:#f6f5f2;font-family:Arial,Helvetica,sans-serif;color:#222">
      <div style="max-width:640px;margin:0 auto;background:#fff;border:1px solid #e9e6df">
        <div style="padding:26px 28px;background:#171717;color:#fff">
          <div style="font-size:12px;letter-spacing:2px;color:#c8ad78">CONCIERGE SERVICE TÜRKİYE</div>
          <h1 style="margin:12px 0 0;font-size:22px;font-weight:500">${escapeHtml(title)}</h1>
        </div>
        <div style="padding:26px 28px">
          <p style="margin:0 0 20px;line-height:1.65;font-size:14px">${intro}</p>
          <table role="presentation" style="width:100%;border-collapse:collapse">${tableRows}</table>
          <p style="margin:24px 0 0;color:#777;font-size:12px;line-height:1.6">Concierge Service Türkiye · <a href="https://www.conciergeservice.com.tr" style="color:#8b7144">www.conciergeservice.com.tr</a></p>
        </div>
      </div>
    </div>`;
}

async function sendEmail(apiKey, payload, idempotencyKey) {
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "Idempotency-Key": idempotencyKey
    },
    body: JSON.stringify(payload)
  });

  const result = await response.json().catch(() => ({}));
  if (!response.ok) {
    const detail = typeof result.message === "string" ? result.message : "Email provider rejected the request.";
    throw new Error(`Resend HTTP ${response.status}: ${detail}`);
  }
  return result;
}

export async function onRequestPost({ request, env }) {
  const origin = request.headers.get("Origin");
  if (!origin || !ALLOWED_ORIGINS.has(origin)) {
    return json({ success: false, message: "Request origin could not be verified." }, 403);
  }

  if (!env.RESEND_API_KEY) {
    return json({ success: false, message: "Email service is not configured. Please contact us on WhatsApp." }, 503);
  }

  const contentType = request.headers.get("Content-Type") || "";
  if (!contentType.toLowerCase().includes("application/json")) {
    return json({ success: false, message: "Invalid request format." }, 415);
  }

  let input;
  try {
    const raw = await request.text();
    if (raw.length > 16000) {
      return json({ success: false, message: "The reservation details are too long." }, 413);
    }
    input = JSON.parse(raw);
  } catch {
    return json({ success: false, message: "Invalid reservation data." }, 400);
  }

  const data = {
    restaurant: clean(input.restaurant, 160),
    name: clean(input.name, 160),
    email: clean(input.email, 254).toLowerCase(),
    phone: clean(input.phone, 40),
    date: clean(input.date, 40),
    time: clean(input.time, 40),
    guests: clean(input.guests, 80),
    age_0_3: clean(input.age_0_3, 20),
    age_4_13: clean(input.age_4_13, 20),
    age_14_17: clean(input.age_14_17, 20),
    pets: clean(input.pets, 500),
    allergy: clean(input.allergy, 1000),
    notes: clean(input.notes, 2000),
    preferred_method: clean(input.preferred_method, 30)
  };

  if (!data.name || !data.email || !data.phone || !data.date || !data.time || !data.guests) {
    return json({ success: false, message: "Please complete all required reservation fields." }, 400);
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    return json({ success: false, message: "Please enter a valid email address." }, 400);
  }
  if (data.preferred_method !== "Email") {
    return json({ success: false, message: "Please select Email as your preferred contact method." }, 400);
  }

  const rows = reservationRows(data);
  const requestKey = request.headers.get("Idempotency-Key") || crypto.randomUUID();
  const safeKey = requestKey.replace(/[^a-zA-Z0-9._:-]/g, "").slice(0, 200) || crypto.randomUUID();

  const teamText = [
    "NEW RESTAURANT RESERVATION REQUEST",
    "",
    ...rows.map(({ label, value }) => `${label}: ${value}`)
  ].join("\n");

  const customerText = [
    `Dear ${data.name},`,
    "",
    "Thank you for your reservation request. We have received your details and our team will review your request. We will contact you shortly to confirm availability.",
    "",
    "Here are the details we received:",
    "",
    ...rows.map(({ label, value }) => `${label}: ${value}`),
    "",
    "Please note that this email acknowledges receipt of your request; it is not a confirmed restaurant reservation.",
    "",
    "Kind regards,",
    "Concierge Service Türkiye"
  ].join("\n");

  const teamEmail = {
    from: SENDER,
    to: [TEAM_EMAIL],
    reply_to: data.email,
    subject: `New ${data.restaurant || "Restaurant"} Reservation Request`,
    text: teamText,
    html: buildHtml("New reservation request", "A new restaurant reservation request has been submitted through the website.", rows)
  };

  const customerIntro = `Dear ${escapeHtml(data.name)},<br><br>Thank you for your reservation request. We have received your details and our team will review your request. We will contact you shortly to confirm availability.`;
  const customerEmail = {
    from: SENDER,
    to: [data.email],
    subject: `We have received your reservation request – ${data.restaurant || "Concierge Service Türkiye"}`,
    text: customerText,
    html: buildHtml("Your request has been received", customerIntro, rows)
  };

  try {
    await Promise.all([
      sendEmail(env.RESEND_API_KEY, teamEmail, `${safeKey}-team`),
      sendEmail(env.RESEND_API_KEY, customerEmail, `${safeKey}-customer`)
    ]);
    return json({ success: true });
  } catch (error) {
    console.error("Resend reservation email failed:", error.message);
    return json({
      success: false,
      message: "We could not complete the email submission. Your details are still in the form; please try again or contact us on WhatsApp."
    }, 502);
  }
}

export async function onRequest(context) {
  if (context.request.method !== "POST") {
    return json({ success: false, message: "Method not allowed." }, 405);
  }
  return onRequestPost(context);
}
