document.addEventListener("DOMContentLoaded", () => {

  const form = document.getElementById("contactForm");
  if (!form) return;

  const alertBox = document.getElementById("formInlineAlert");
  const nameField = document.getElementById("name");
  const emailField = document.getElementById("email");
  const phoneField = document.getElementById("phone");
  const subjectHidden = document.getElementById("subject");
  const messageField = document.getElementById("message");
  const contactMethodFields = Array.from(form.querySelectorAll('input[name="contactMethod"]'));
  const submitButton = form.querySelector('button[type="submit"]');
  const subjectSelect = document.getElementById("subject");
  if (!subjectSelect) return;

  function showInlineAlert(text, success = false) {
    alertBox.textContent = text;
    alertBox.style.visibility = "visible";
    alertBox.style.opacity = "1";
    alertBox.style.borderColor = "rgba(212,175,55,.35)";
    alertBox.classList.toggle("is-error", !success);
    setTimeout(() => { alertBox.style.opacity = "0"; alertBox.style.visibility = "hidden"; }, 3500);
  }


  // StayinWiFi-style phone: permanent + prefix, digits only.
  phoneField.value = phoneField.value.startsWith("+") ? phoneField.value : "+";
  const placeCaretAfterPlus = () => phoneField.setSelectionRange(Math.max(1, phoneField.value.length), Math.max(1, phoneField.value.length));
  phoneField.addEventListener("focus", () => {
    if (!phoneField.value.startsWith("+")) phoneField.value = "+" + phoneField.value.replace(/\D/g, "");
    requestAnimationFrame(placeCaretAfterPlus);
  });
  phoneField.addEventListener("keydown", event => {
    const start = phoneField.selectionStart ?? 0, end = phoneField.selectionEnd ?? 0;
    if (["Tab", "ArrowLeft", "ArrowRight", "End"].includes(event.key)) return;
    if (event.key === "Home") { event.preventDefault(); phoneField.setSelectionRange(1, 1); return; }
    if (event.key === "Backspace") { if (start <= 1) { event.preventDefault(); phoneField.setSelectionRange(1, 1); } return; }
    if (event.key === "Delete") { if (start === 0 || (start === 1 && end > 1)) { event.preventDefault(); phoneField.setSelectionRange(1, 1); } return; }
    if (event.ctrlKey || event.metaKey) return;
    if (!/^[0-9]$/.test(event.key)) { event.preventDefault(); return; }
    if (start === 0) { event.preventDefault(); phoneField.setSelectionRange(1, 1); }
  });
  phoneField.addEventListener("input", () => { phoneField.value = "+" + phoneField.value.replace(/\D/g, ""); });
  phoneField.addEventListener("paste", () => setTimeout(() => { phoneField.value = "+" + phoneField.value.replace(/\D/g, ""); }, 0));

  // Service pages can pass a detailed subject through ?subject=...
  const presetSubject = new URLSearchParams(window.location.search).get("subject");
  if (presetSubject && presetSubject.trim()) {
    const value = presetSubject.trim();
    const matchingOption = Array.from(subjectSelect.options).find(option => option.value === value || option.textContent.trim() === value);
    if (matchingOption) subjectSelect.value = matchingOption.value;
    else {
      subjectSelect.add(new Option(value, value, true, true));
      subjectSelect.value = value;
    }
  }

  form.addEventListener("submit", e => {
    e.preventDefault();
    if (!contactMethodFields.some(field => field.checked)) return showInlineAlert("Please select your preferred contact method.");
    if (!nameField.value.trim()) return showInlineAlert("Please enter your full name.");
    if (!emailField.value.trim()) return showInlineAlert("Please enter your email address.");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailField.value.trim())) return showInlineAlert("Please enter a valid email address.");
    if (phoneField.value.replace(/\D/g, "").length < 7) return showInlineAlert("Please enter a valid phone number, including country code.");
    if (!subjectSelect.value.trim()) return showInlineAlert("Please select a subject.");


    const method = new FormData(form).get("contactMethod");
    const fullPhone = phoneField.value.trim();
    const requestMessage = [
      "CONCIERGE SERVICE TÜRKİYE — CONTACT REQUEST", "",
      "Name: " + nameField.value.trim(),
      "Email: " + emailField.value.trim(),
      "Phone: " + fullPhone,
      "Subject: " + subjectHidden.value.trim(),
      "Preferred contact method: " + method, "",
      "Request details:", messageField.value.trim()
    ].join("\n");
    const originalButtonText = submitButton.textContent.trim();
    submitButton.disabled = true;
    submitButton.textContent = method === "Email" ? "Sending Request..." : "Opening WhatsApp...";

    if (method === "WhatsApp") {
      const whatsappUrl = "https://wa.me/905344888624?text=" + encodeURIComponent(requestMessage);
      const whatsappWindow = window.open(whatsappUrl, "_blank");
      submitButton.disabled = false;
      submitButton.textContent = originalButtonText;
      if (!whatsappWindow) return showInlineAlert("WhatsApp could not be opened. Please allow pop-ups or contact us directly.");
      showInlineAlert("Your request is ready in WhatsApp. Please press Send there to complete your request.", true);
      return;
    }

    const emailPayload = {
      _subject: "Concierge Contact Request — " + nameField.value.trim(),
      _template: "table",
      _captcha: "false",
      "Contact Method": "Email",
      "Guest Name": nameField.value.trim(),
      "Guest Email": emailField.value.trim(),
      "Phone Number": fullPhone,
      "Subject": subjectHidden.value.trim(),
      "Request Details": messageField.value.trim(),
      "Source": "contact-page"
    };
    fetch("https://formsubmit.co/ajax/conciergeserviceturkiye@gmail.com", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Accept": "application/json" },
      body: JSON.stringify(emailPayload)
    })
      .then(async response => {
        const result = await response.json().catch(() => ({}));
        if (!response.ok || result.success === false) throw new Error(result.message || "The email service could not accept the request.");
        showInlineAlert("Your request has been submitted successfully. We will contact you after reviewing it.", true);
        form.reset();
        subjectSelect.value = "";
        phoneField.value = "+";
      })
      .catch(error => {
        console.error("Contact form email request failed:", error);
        showInlineAlert("We could not send your request just now. Please try again or contact us directly.");
      })
      .finally(() => {
        submitButton.disabled = false;
        submitButton.textContent = originalButtonText;
      });
  });
});