document.addEventListener("DOMContentLoaded", () => {

  const form = document.getElementById("reservation-form");
  if (!form) return;

  const statusText = document.getElementById("form-status");
  const sendBtn = form.querySelector(".send-btn");

  /* ======================
     PHONE INPUT
  ====================== */
  const phoneInput = document.querySelector("#phone");
  const iti = window.intlTelInput(phoneInput, {
    preferredCountries: ["tr", "gb", "de", "fr", "us"],
    separateDialCode: true,
    utilsScript:
      "https://cdn.jsdelivr.net/npm/intl-tel-input@18/build/js/utils.js"
  });

  /* ======================
     TOOLTIP FUNCTIONS
  ====================== */
  function showTooltip(el) {
    const wrapper = el.closest(".input-wrapper");
    if (!wrapper) return;

    hideTooltip(el);

    const tooltip = document.createElement("div");
    tooltip.className = "input-tooltip visible";
    tooltip.textContent =
      el.dataset.error || "This field is required.";

    wrapper.appendChild(tooltip);
    el.classList.add("error");
  }

  function hideTooltip(el) {
    const wrapper = el.closest(".input-wrapper");
    if (!wrapper) return;

    const tooltip = wrapper.querySelector(".input-tooltip");
    if (tooltip) tooltip.remove();

    el.classList.remove("error");
  }

  /* ======================
     EMAIL VALIDATION
  ====================== */
  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  /* ======================
     BLUR EVENTS (TAB / CLICK OUT)
  ====================== */
  [...form.elements].forEach(el => {
    if (!el.required) return;

    el.addEventListener("blur", () => {
      if (el.type === "email") {
        if (!isValidEmail(el.value)) showTooltip(el);
      } else if (el.type === "tel") {
        if (!iti.isValidNumber()) showTooltip(el);
      } else {
        if (!el.value.trim()) showTooltip(el);
      }
    });

    el.addEventListener("input", () => hideTooltip(el));
  });

  /* ======================
     CHARACTER COUNTER
  ====================== */
  const textarea = form.querySelector("textarea[name='message']");
  const counter = form.querySelector(".char-count");

  textarea.addEventListener("input", () => {
    counter.textContent = `${textarea.value.length} / 2000`;
  });

  /* ======================
     SUBMIT
  ====================== */
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    let valid = true;

    // NAME
    if (!form.name.value.trim()) {
      showTooltip(form.name);
      valid = false;
    }

    // EMAIL
    if (!isValidEmail(form.email.value)) {
      showTooltip(form.email);
      valid = false;
    }

    // PHONE
    if (!iti.isValidNumber()) {
      showTooltip(phoneInput);
      valid = false;
    }

    // MESSAGE
    if (!textarea.value.trim()) {
      showTooltip(textarea);
      valid = false;
    }

    if (!valid) return;

    /* ======================
       SEND STATE
    ====================== */
    sendBtn.disabled = true;
    sendBtn.classList.add("sending");
    sendBtn.textContent = "Sending...";
    statusText.textContent = "Sending your request...";

    const data = new URLSearchParams({
      name: form.name.value,
      email: form.email.value,
      phone: iti.getNumber(),
      message: textarea.value,
      referrer: document.referrer || "Website"
    });

    fetch("https://script.google.com/macros/s/AKfycbxvOeMaThb3zFJVCZuGdQbJk-dAFH7W06vkoYPCfyfal_GUxF1dvXinEWMZoP8OtKpKcg/exec", {
      method: "POST",
      body: data
    })
      .then(() => {
        statusText.textContent =
          "Your request has been sent successfully.";
        form.reset();
        counter.textContent = "0 / 2000";
      })
      .catch(() => {
        statusText.textContent =
          "Connection error. Please try again.";
      })
      .finally(() => {
        sendBtn.disabled = false;
        sendBtn.classList.remove("sending");
        sendBtn.textContent = "Send";
      });
  });

});
