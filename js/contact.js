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

  // Match StayinWiFi's native validation tooltip.
  form.querySelectorAll("input,select,textarea").forEach(field => {
    field.addEventListener("input", () => field.setCustomValidity(""));
    field.addEventListener("change", () => field.setCustomValidity(""));
  });
  function validateWithNativeTooltip() {
    form.querySelectorAll("input,select,textarea").forEach(field => field.setCustomValidity(""));
    const fail = (field, message) => { field.setCustomValidity(message); field.reportValidity(); return false; };
    if (!contactMethodFields.some(field => field.checked)) return fail(contactMethodFields[0], "Please select your preferred contact method.");
    if (!nameField.value.trim()) return fail(nameField, "Please enter your full name.");
    if (!emailField.value.trim()) return fail(emailField, "Please enter your email address.");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailField.value.trim())) return fail(emailField, "Please enter a valid email address.");
    if (phoneField.value.replace(/\D/g, "").length < 7) return fail(phoneField, "Please enter a valid phone number, including country code.");
    if (!subjectSelect.value.trim()) return fail(subjectSelect, "Please select a subject.");
    return true;
  }
  form.addEventListener("submit", async e => {
    e.preventDefault();
    if (!validateWithNativeTooltip()) return;

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
    submitButton.textContent = "Sending Request...";

    const payload = {
      formType: "Contact enquiry",
      subject: "Concierge Contact Request — " + nameField.value.trim(),
      customer: { name: nameField.value.trim(), email: emailField.value.trim() },
      preferredMethod: method,
      fields: {
        "Phone / WhatsApp": fullPhone,
        "Subject": subjectHidden.value.trim(),
        "Request details": messageField.value.trim(),
        "Source": "Contact page"
      }
    };

    try {
      const response = await fetch("/api/request", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Idempotency-Key": crypto.randomUUID() },
        body: JSON.stringify(payload)
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok || result.success !== true) throw new Error(result.message || "The request could not be submitted.");

      if (method === "WhatsApp") {
        window.open("https://wa.me/905344888624?text=" + encodeURIComponent(requestMessage), "_blank");
        showInlineAlert("Your request has been sent to our concierge team. WhatsApp is ready if you would also like to message us.", true);
      } else {
        showInlineAlert("Your request has been sent to our concierge team. We will contact you shortly.", true);
      }
      form.reset();
      subjectSelect.value = "";
      phoneField.value = "+";
    } catch (error) {
      console.error("Contact form submission failed:", error);
      showInlineAlert(error.message || "We could not send your request just now. Your details are still in the form.");
    } finally {
      submitButton.disabled = false;
      submitButton.textContent = originalButtonText;
    }
  });
});