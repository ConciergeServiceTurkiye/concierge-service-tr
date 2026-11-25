const ALLOWED_ORIGINS = new Set([
  "https://www.conciergeservice.com.tr",
  "https://conciergeservice.com.tr"
]);
const TEAM_EMAIL = "info@conciergeservice.com.tr";
const SENDER = "Concierge Service Türkiye <reservations@send.conciergeservice.com.tr>";

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" }
  });
}
function clean(value, max = 3000) { return String(value ?? "").trim().slice(0, max); }
function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, c => ({
    "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"
  })[c]);
}
function isAllowedOrigin(origin) {
  if (!origin) return false;
  if (ALLOWED_ORIGINS.has(origin)) return true;
  try {
    const host = new URL(origin).hostname;
    return host.endsWith(".concierge-service-tr.pages.dev");
  } catch { return false; }
}
function rowsFrom(input) {
  const source = input.fields && typeof input.fields === "object" ? input.fields : {};
  return Object.entries(source).slice(0, 80).map(([label, value]) => ({
    label: clean(label, 120),
    value: clean(Array.isArray(value) ? value.map(item => item && typeof item === "object" ? JSON.stringify(item) : item).join(", ") : value && typeof value === "object" ? JSON.stringify(value) : value, 3000) || "—"
  })).filter(row => row.label);
}
function emailHtml(title, intro, rows, footer) {
  const table = rows.map(row => `<tr>
    <td style="padding:10px 12px;border-bottom:1px solid #e8e8e8;color:#666;font-size:13px;width:36%;vertical-align:top">${escapeHtml(row.label)}</td>
    <td style="padding:10px 12px;border-bottom:1px solid #e8e8e8;color:#222;font-size:14px;white-space:pre-wrap">${escapeHtml(row.value)}</td>
  </tr>`).join("");
  return `<div style="margin:0;padding:32px 12px;background:#f6f5f2;font-family:Arial,Helvetica,sans-serif;color:#222">
    <div style="max-width:640px;margin:0 auto;background:#fff;border:1px solid #e9e6df">
      <div style="padding:26px 28px;background:#171717;color:#fff">
        <div style="font-size:12px;letter-spacing:2px;color:#c8ad78">CONCIERGE SERVICE TÜRKİYE</div>
        <h1 style="margin:12px 0 0;font-size:22px;font-weight:500">${escapeHtml(title)}</h1>
      </div>
      <div style="padding:26px 28px"><p style="margin:0 0 20px;line-height:1.65;font-size:14px">${intro}</p>
        <table role="presentation" style="width:100%;border-collapse:collapse">${table}</table>
        <p style="margin:24px 0 0;color:#777;font-size:12px;line-height:1.6">${footer || "Concierge Service Türkiye"} · <a href="https://www.conciergeservice.com.tr" style="color:#8b7144">www.conciergeservice.com.tr</a></p>
      </div>
    </div></div>`;
}
async function sendEmail(apiKey, payload, key) {
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { "Authorization": `Bearer ${apiKey}`, "Content-Type": "application/json", "Idempotency-Key": key },
    body: JSON.stringify(payload)
  });
  const result = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(`Resend HTTP ${response.status}: ${clean(result.message || "Email provider rejected the request.", 500)}`);
  return result;
}
export async function onRequestPost({ request, env }) {
  if (!isAllowedOrigin(request.headers.get("Origin"))) return json({ success:false, message:"Request origin could not be verified." }, 403);
  if (!env.RESEND_API_KEY) return json({ success:false, message:"Email service is not configured. Please contact us directly." }, 503);
  if (!(request.headers.get("Content-Type") || "").toLowerCase().includes("application/json")) return json({ success:false, message:"Invalid request format." }, 415);

  let input;
  try {
    const raw = await request.text();
    if (raw.length > 24000) return json({ success:false, message:"The request details are too long." }, 413);
    input = JSON.parse(raw);
  } catch { return json({ success:false, message:"Invalid request data." }, 400); }

  const formType = clean(input.formType, 100) || "Website enquiry";
  const subject = clean(input.subject, 180) || `New ${formType}`;
  const customerName = clean(input.customer?.name, 160);
  const customerEmail = clean(input.customer?.email, 254).toLowerCase();
  const preferredMethod = clean(input.preferredMethod, 30);
  if (!customerName || !customerEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerEmail)) {
    return json({ success:false, message:"Please provide a valid name and email address." }, 400);
  }
  if (!["WhatsApp", "Email"].includes(preferredMethod)) {
    return json({ success:false, message:"Please select your preferred contact method." }, 400);
  }

  const rows = [
    { label:"Request type", value:formType },
    { label:"Customer name", value:customerName },
    { label:"Customer email", value:customerEmail },
    { label:"Preferred contact method", value:preferredMethod },
    ...rowsFrom(input)
  ];
  const requestId = clean(request.headers.get("Idempotency-Key") || crypto.randomUUID(), 200).replace(/[^a-zA-Z0-9._:-]/g, "") || crypto.randomUUID();
  const teamText = [subject, "", ...rows.map(row => `${row.label}: ${row.value}`)].join("\n");
  const customerText = [
    `Dear ${customerName},`, "",
    "Thank you for contacting Concierge Service Türkiye. We have received your request and our team will review the details.",
    "We will contact you using your preferred contact method.",
    "", "Please note that submitting a request does not constitute a confirmed booking. Any availability, price and applicable terms will be confirmed separately.",
    "", "Kind regards,", "Concierge Service Türkiye"
  ].join("\n");

  try {
    const [teamResult, customerResult] = await Promise.allSettled([
      sendEmail(env.RESEND_API_KEY, {
        from:SENDER, to:[TEAM_EMAIL], reply_to:customerEmail, subject,
        text:teamText,
        html:emailHtml(subject, "A new request has been submitted through the website.", rows)
      }, `${requestId}-team`),
      sendEmail(env.RESEND_API_KEY, {
        from:SENDER, to:[customerEmail], subject:`We have received your request – Concierge Service Türkiye`,
        text:customerText,
        html:emailHtml("Your request has been received", `Dear ${escapeHtml(customerName)},<br><br>Thank you for contacting Concierge Service Türkiye. We have received the details and our team will review them. We will contact you using your preferred contact method.<br><br><strong>Please note:</strong> this acknowledgement is not a booking confirmation.`, [])
      }, `${requestId}-customer`)
    ]);
    if (teamResult.status === "rejected") throw teamResult.reason;
    if (customerResult.status === "rejected") {
      console.error("Customer acknowledgement email failed:", customerResult.reason?.message || "Unknown error");
    }
    return json({ success:true, acknowledgementSent: customerResult.status === "fulfilled" });
  } catch (error) {
    console.error("Resend request email failed:", error.message);
    return json({ success:false, message:"We could not submit your request just now. Your details are still in the form; please try again." }, 502);
  }
}
export async function onRequest(context) {
  if (context.request.method !== "POST") return json({ success:false, message:"Method not allowed." }, 405);
  return onRequestPost(context);
}
