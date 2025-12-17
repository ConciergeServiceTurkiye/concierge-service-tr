document.addEventListener("DOMContentLoaded", () => {

  const form = document.getElementById("reservation-form");
  if (!form) return;

  const statusText = document.getElementById("form-status");
  const sendBtn = form.querySelector(".send-btn");

  /* PHONE INPUT */
  const phoneInput = document.querySelector("#phone");
  const iti = window.intlTelInput(phoneInput, {
    preferredCountries: ["tr", "gb", "de", "fr", "us"],
    utilsScript: "https://cdn.jsdelivr.net/npm/intl-tel-input@18/build/js/utils.js"
  });

  /* TOOLTIP FUNCTIONS */
  function showTooltip(el) {
    const wrapper = el.closest(".input-wrapper");
    if (!wrapper) return;

    hideTooltip(el);

    if (!el.checkValidity()) {
      const tip = document.createElement("div");
      tip.className = "input-tooltip visible";
      tip.textContent = el.dataset.error || "This field is required.";
      wrapper.appendChild(tip);
      el.classList.add("error");
    }
  }

  function hideTooltip(el) {
    const wrapper = el.closest(".input-wrapper");
    if (!wrapper) return;

    const tip = wrapper.querySelector(".input-tooltip");
    if (tip) tip.remove();
    el.classList.remove("error");
  }

  /* BLUR & INPUT EVENTS */
  [...form.elements].forEach(el => {
    if (!el.required) return;

    el.addEventListener("blur", () => showTooltip(el));
    el.addEventListener("input", () => hideTooltip(el));
  });

  /* CHARACTER COUNTER */
  const textarea = form.querySelector("textarea[name='message']");
  const counter = form.querySelector(".char-count");

  textarea.addEventListener("input", () => {
    counter.textContent = `${textarea.value.length} / 2000`;
  });

  /* SUBMIT */
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    let valid = true;

    [...form.elements].forEach(el => {
      if (el.required && !el.checkValidity()) {
        showTooltip(el);
        valid = false;
      }
    });

    if (!iti.isValidNumber()) {
      showTooltip(phoneInput);
      valid = false;
    }

    if (!valid) return;

    sendBtn.disabled = true;
    sendBtn.classList.add("sending");
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
      statusText.textContent = "Your request has been sent successfully.";
      form.reset();
      counter.textContent = "0 / 2000";
    })
    .catch(() => {
      statusText.textContent = "Connection error. Please try again.";
    })
    .finally(() => {
      sendBtn.disabled = false;
      sendBtn.classList.remove("sending");
    });
  });

});
