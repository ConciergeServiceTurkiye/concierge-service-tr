document.addEventListener("DOMContentLoaded", () => {

  /* ======================
     CONTACT FORM (SADECE VARSA)
  ====================== */
  const form = document.getElementById("reservation-form");

  if (form) {
    const statusText = document.getElementById("form-status");
    const sendBtn = form.querySelector(".send-btn");

    const phoneInput = document.querySelector("#phone");
    const iti = window.intlTelInput(phoneInput, {
      preferredCountries: ["tr", "gb", "de", "fr", "us"],
      utilsScript: "https://cdn.jsdelivr.net/npm/intl-tel-input@18/build/js/utils.js"
    });

    function showTooltip(el) {
      const wrapper = el.closest(".input-wrapper");
      if (!wrapper) return;
      const tip = document.createElement("div");
      tip.className = "input-tooltip visible";
      tip.textContent = el.dataset.error || "This field is required.";
      wrapper.appendChild(tip);
    }

    form.addEventListener("submit", (e) => {
      e.preventDefault();

      sendBtn.disabled = true;
      sendBtn.classList.add("sending");
      statusText.textContent = "Sending your request...";

      const data = new URLSearchParams({
        name: form.name.value,
        email: form.email.value,
        phone: iti.getNumber(),
        message: form.message.value
      });

      fetch("https://script.google.com/macros/s/AKfycbxvOeMaThb3zFJVCZuGdQbJk-dAFH7W06vkoYPCfyfal_GUxF1dvXinEWMZoP8OtKpKcg/exec", {
        method: "POST",
        body: data
      })
      .then(() => {
        statusText.textContent = "Your request has been sent successfully.";
        form.reset();
      })
      .finally(() => {
        sendBtn.disabled = false;
        sendBtn.classList.remove("sending");
      });
    });
  }

  /* ======================
     PRIVACY & TERMS MODALS (GLOBAL)
  ====================== */
  const privacyLink = document.getElementById("privacyLink");
  const termsLink = document.getElementById("termsLink");
  const privacyModal = document.getElementById("privacyModal");
  const termsModal = document.getElementById("termsModal");
  const closeButtons = document.querySelectorAll(".close-modal");

  if (privacyLink) {
    privacyLink.addEventListener("click", e => {
      e.preventDefault();
      privacyModal.style.display = "flex";
    });
  }

  if (termsLink) {
    termsLink.addEventListener("click", e => {
      e.preventDefault();
      termsModal.style.display = "flex";
    });
  }

  closeButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      privacyModal.style.display = "none";
      termsModal.style.display = "none";
    });
  });

  document.addEventListener("keydown", e => {
    if (e.key === "Escape") {
      privacyModal.style.display = "none";
      termsModal.style.display = "none";
    }
  });

});
