document.addEventListener("DOMContentLoaded", () => {

  /* MOBILE NAV */
  const hamburger = document.getElementById("hamburger");
  const navMenu = document.getElementById("navMenu");
  if (hamburger && navMenu) {
    hamburger.addEventListener("click", () => navMenu.classList.toggle("active"));
  }

  /* HERO SLIDER */
  const slider = document.getElementById("heroSlider");
  if (slider) {
    const totalSlides = 9;
    let currentSlide = 0;
    const slides = [];
    for (let i = 1; i <= totalSlides; i++) {
      const slide = document.createElement("div");
      slide.className = "slide";
      slide.style.backgroundImage = `url('assets/slider-${i}.jpg')`;
      slider.appendChild(slide);
      slides.push(slide);
    }
    slides[0].classList.add("active");
    setInterval(() => {
      slides[currentSlide].classList.remove("active");
      currentSlide = (currentSlide + 1) % slides.length;
      slides[currentSlide].classList.add("active");
    }, 5000);
  }

  /* CONTACT FORM */
  const form = document.getElementById("reservation-form");
  if (form) {
    const statusText = document.getElementById("form-status");
    const sendBtn = form.querySelector(".send-btn");
    const phoneInput = document.querySelector("#phone");

    const iti = window.intlTelInput(phoneInput, {
      preferredCountries: ["tr", "gb", "de", "fr", "us"],
      separateDialCode: true,
      utilsScript: "https://cdn.jsdelivr.net/npm/intl-tel-input@18/build/js/utils.js"
    });

    function showTooltip(el) {
      const wrapper = el.closest(".input-wrapper");
      if (!wrapper) return;
      hideTooltip(el);
      const tooltip = document.createElement("div");
      tooltip.className = "input-tooltip visible";
      tooltip.textContent = el.dataset.error || "This field is required.";
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

    function isValidEmail(email) {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    [...form.elements].forEach(el => {
      if (!el.required) return;
      el.addEventListener("blur", () => {
        if (el.type === "email") { if (!isValidEmail(el.value)) showTooltip(el); }
        else if (el.type === "tel") { if (!iti.isValidNumber()) showTooltip(el); }
        else { if (!el.value.trim()) showTooltip(el); }
      });
      el.addEventListener("input", () => hideTooltip(el));
    });

    const textarea = form.querySelector("textarea[name='message']");
    const counter = form.querySelector(".char-count");
    textarea.addEventListener("input", () => {
      counter.textContent = `${textarea.value.length} / 2000`;
    });

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      let valid = true;
      if (!form.name.value.trim()) { showTooltip(form.name); valid = false; }
      if (!isValidEmail(form.email.value)) { showTooltip(form.email); valid = false; }
      if (!iti.isValidNumber()) { showTooltip(phoneInput); valid = false; }
      if (!textarea.value.trim()) { showTooltip(textarea); valid = false; }
      if (!valid) return;

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

      fetch("https://script.google.com/macros/s/AKfycbxvOeMaThb3zFJVCZuGdQbJk-dAFH7W06vkoYPCfyfal_GUxF1dvXinEWMZoP8OtKpKcg/exec", { method: "POST", body: data })
        .then(() => { statusText.textContent = "Your request has been sent successfully."; form.reset(); counter.textContent = "0 / 2000"; })
        .catch(() => { statusText.textContent = "Connection error. Please try again."; })
        .finally(() => { sendBtn.disabled = false; sendBtn.classList.remove("sending"); sendBtn.textContent = "Send"; });
    });
  }

  /* PRIVACY & TERMS MODALS */
  const privacyLink = document.getElementById("privacyLink");
  const termsLink = document.getElementById("termsLink");
  const privacyModal = document.getElementById("privacyModal");
  const termsModal = document.getElementById("termsModal");
  const closeButtons = document.querySelectorAll(".close-modal");

  if (privacyLink && privacyModal) { privacyLink.addEventListener("click", e => { e.preventDefault(); privacyModal.style.display = "flex"; }); }
  if (termsLink && termsModal) { termsLink.addEventListener("click", e => { e.preventDefault(); termsModal.style.display = "flex"; }); }
  closeButtons.forEach(btn => { btn.addEventListener("click", () => { if (privacyModal) privacyModal.style.display = "none"; if (termsModal) termsModal.style.display = "none"; }); });
  document.addEventListener("keydown", e => { if (e.key === "Escape") { if (privacyModal) privacyModal.style.display = "none"; if (termsModal) termsModal.style.display = "none"; } });

});
