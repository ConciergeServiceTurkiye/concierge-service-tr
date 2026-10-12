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
  const charCount = document.getElementById("charCount");
  const customSelect = document.getElementById("customSubject");
  if (!customSelect) return;

  const trigger = customSelect.querySelector(".select-trigger");
  const options = Array.from(customSelect.querySelectorAll(".select-options li"));

  function showInlineAlert(text, success = false) {
    alertBox.textContent = text;
    alertBox.style.visibility = "visible";
    alertBox.style.opacity = "1";
    alertBox.style.borderColor = success ? "#d4af37" : "#c9a24d";
    setTimeout(() => { alertBox.style.opacity = "0"; alertBox.style.visibility = "hidden"; }, 3500);
  }

  if (charCount && messageField) {
    charCount.textContent = "0 / 2000";
    messageField.addEventListener("input", () => { charCount.textContent = `${messageField.value.length} / 2000`; });
  }

  const iti = intlTelInput(phoneField, { initialCountry: "us", separateDialCode: true });
  phoneField.addEventListener("focus", () => { setTimeout(() => { iti.setCountry(iti.getSelectedCountryData().iso2); }, 50); });
  phoneField.addEventListener("keydown", e => {
    if (e.ctrlKey || e.metaKey || ["Backspace", "Delete", "ArrowLeft", "ArrowRight", "Tab"].includes(e.key)) return;
    if (!/^[0-9]$/.test(e.key)) e.preventDefault();
  });
  phoneField.addEventListener("input", () => { phoneField.value = phoneField.value.replace(/\D/g, ""); });

  let currentIndex = -1;
  function openDropdown() { customSelect.classList.add("open"); }
  function closeDropdown() { customSelect.classList.remove("open"); currentIndex = -1; options.forEach(o => o.classList.remove("active")); }
  function move(direction) {
    if (!customSelect.classList.contains("open")) { openDropdown(); currentIndex = direction === 1 ? 0 : options.length - 1; }
    else { currentIndex += direction; if (currentIndex < 0) currentIndex = options.length - 1; if (currentIndex >= options.length) currentIndex = 0; }
    setActive();
  }
  function setActive() { options.forEach(o => o.classList.remove("active")); const opt = options[currentIndex]; opt.classList.add("active"); opt.scrollIntoView({ block: "nearest" }); }
  function select(index) {
    const opt = options[index];
    trigger.textContent = opt.textContent;
    subjectHidden.value = opt.dataset.value;
    trigger.classList.add("selected");
    closeDropdown();
  }

  trigger.addEventListener("click", () => { customSelect.classList.contains("open") ? closeDropdown() : openDropdown(); });
  trigger.addEventListener("keydown", e => {
    if (["ArrowDown", "ArrowUp", "Enter", " ", "Escape"].includes(e.key)) e.preventDefault();
    if (e.key === "ArrowDown") move(1);
    if (e.key === "ArrowUp") move(-1);
    if (e.key === "Enter" || e.key === " ") { if (customSelect.classList.contains("open") && currentIndex >= 0) select(currentIndex); else openDropdown(); }
    if (e.key === "Escape") closeDropdown();
  });
  options.forEach((opt, index) => { opt.addEventListener("click", () => { select(index); messageField.focus(); }); });
  document.addEventListener("click", e => { if (!customSelect.contains(e.target)) closeDropdown(); });

  // Service pages can pass a detailed subject through ?subject=...
  const presetSubject = new URLSearchParams(window.location.search).get("subject");
  if (presetSubject && presetSubject.trim()) {
    const value = presetSubject.trim();
    subjectHidden.value = value;
    trigger.textContent = value;
    trigger.classList.add("selected");
  }

  form.addEventListener("submit", e => {
    e.preventDefault();
    if (!nameField.value.trim()) return showInlineAlert("Please enter your full name.");
    if (!emailField.value.trim()) return showInlineAlert("Please enter your email address.");
    if (!emailField.checkValidity()) return showInlineAlert("Please enter a valid email address.");
    if (!phoneField.value.trim() || !iti.isValidNumber()) return showInlineAlert("Please enter a valid phone number, including the country code.");
    if (!subjectHidden.value.trim()) return showInlineAlert("Please select a subject.");
    if (!messageField.value.trim()) return showInlineAlert("Please enter your request details.");
    if (!contactMethodFields.some(field => field.checked)) return showInlineAlert("Please choose your preferred contact method.");

    const method = new FormData(form).get("contactMethod");
    const fullPhone = iti.getNumber();
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
        if (charCount) charCount.textContent = "0 / 2000";
        subjectHidden.value = "";
        trigger.textContent = "Select a subject";
        trigger.classList.remove("selected");
        currentIndex = -1;
        iti.setCountry("us");
        phoneField.value = "";
        closeDropdown();
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