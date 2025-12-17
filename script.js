document.addEventListener("DOMContentLoaded", () => {

  /* HERO SLIDER */
  let currentSlide = 0;
  const slides = document.querySelectorAll(".slide");

  if (slides.length) {
    setInterval(() => {
      slides.forEach((s, i) => s.classList.toggle("active", i === currentSlide));
      currentSlide = (currentSlide + 1) % slides.length;
    }, 5000);
  }

  /* HAMBURGER MENU */
  const hamburger = document.getElementById("hamburger");
  const navMenu = document.getElementById("navMenu");

  if (hamburger && navMenu) {
    hamburger.addEventListener("click", () => {
      navMenu.classList.toggle("active");
    });
  }

  /* FORM */
  const form = document.getElementById("reservation-form");
  if (!form) return;

  const statusText = document.getElementById("form-status");
  const sendBtn = form.querySelector("button");

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    let valid = true;

    /* ÖNCE ESKİ HATALARI TEMİZLE */
    form.querySelectorAll(".form-error").forEach(el => el.remove());
    form.querySelectorAll(".error").forEach(el => el.classList.remove("error"));

    /* ALAN KONTROLLERİ */
    [...form.elements].forEach(el => {
      if (el.required && !el.checkValidity()) {
        valid = false;
        el.classList.add("error");

        const error = document.createElement("div");
        error.className = "form-error";
        error.textContent = el.dataset.error || "This field is required.";

        el.insertAdjacentElement("afterend", error);
      }
    });

    if (!valid) return;

    /* GÖNDERME */
    sendBtn.classList.add("sending");
    sendBtn.disabled = true;
    statusText.textContent = "Sending your request...";

    const data = new URLSearchParams({
      name: form.name.value,
      email: form.email.value,
      phone: form.phone.value,
      message: form.message.value,
      referrer: document.referrer || "Website"
    });

    fetch("https://script.google.com/macros/s/AKfycbxvOeMaThb3zFJVCZuGdQbJk-dAFH7W06vkoYPCfyfal_GUxF1dvXinEWMZoP8OtKpKcg/exec", {
      method: "POST",
      body: data
    })
    .then(r => r.text())
    .then(res => {
      statusText.textContent = "Your request has been sent successfully.";
      form.reset();
    })
    .catch(() => {
      statusText.textContent = "Connection error. Please try again.";
    })
    .finally(() => {
      sendBtn.classList.remove("sending");
      sendBtn.disabled = false;
    });
  });

  /* PRIVACY & TERMS MODAL */
  const privacyLink = document.getElementById("privacyLink");
  const termsLink = document.getElementById("termsLink");

  const privacyModal = document.getElementById("privacyModal");
  const termsModal = document.getElementById("termsModal");

  const closeButtons = document.querySelectorAll(".close-modal");

  if (privacyLink && privacyModal) {
    privacyLink.addEventListener("click", (e) => {
      e.preventDefault();
      privacyModal.style.display = "flex";
    });
  }

  if (termsLink && termsModal) {
    termsLink.addEventListener("click", (e) => {
      e.preventDefault();
      termsModal.style.display = "flex";
    });
  }

  closeButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      if (privacyModal) privacyModal.style.display = "none";
      if (termsModal) termsModal.style.display = "none";
    });
  });

  /* ESC İLE MODAL KAPAT */
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      if (privacyModal) privacyModal.style.display = "none";
      if (termsModal) termsModal.style.display = "none";
    }
  });

});
