document.addEventListener("DOMContentLoaded", () => {

  /* ======================
     MOBILE NAV
  ====================== */
  const hamburger = document.getElementById("hamburger");
  const navMenu = document.getElementById("navMenu");
  if (hamburger && navMenu) {
    hamburger.addEventListener("click", () =>
      navMenu.classList.toggle("active")
    );
  }

  /* ======================
     HERO SLIDER
  ====================== */
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

  /* ======================
     POPUP ALERT
  ====================== */
  const popupAlert = document.getElementById("popupAlert");
  let popupTimer = null;

  function showPopup(message, autoClose = true) {
    if (!popupAlert) return;

    popupAlert.textContent = message;
    popupAlert.classList.add("show");

    if (popupTimer) clearTimeout(popupTimer);

    if (autoClose) {
      popupTimer = setTimeout(() => {
        popupAlert.classList.remove("show");
      }, 3000);
    }
  }

  /* ======================
     CONTACT FORM
  ====================== */
  const form = document.getElementById("reservation-form");
  if (!form) return;

  const sendBtn = form.querySelector(".send-btn");
  const phoneInput = document.getElementById("phone");
  const textarea = form.querySelector("textarea[name='message']");
  const counter = form.querySelector(".char-count");

  /* ======================
     SUBJECT SELECT
  ====================== */
  const subjectWrapper = document.querySelector(".subject-wrapper");
  const subjectSelect = document.getElementById("subjectSelect");
  const subjectOptions = document.getElementById("subjectOptions");
  const selectedSubject = document.getElementById("selectedSubject");
  const subjectInput = document.getElementById("subjectInput");

  subjectSelect.addEventListener("click", () => {
    subjectWrapper.classList.toggle("open");
  });

  subjectOptions.querySelectorAll("li").forEach(option => {
    option.addEventListener("click", () => {
      const value = option.dataset.value;
      selectedSubject.textContent = value;
      subjectInput.value = value;
      subjectWrapper.classList.remove("open");
    });
  });

  document.addEventListener("click", e => {
    if (!subjectWrapper.contains(e.target)) {
      subjectWrapper.classList.remove("open");
    }
  });

  /* ======================
     PHONE INPUT
  ====================== */
  phoneInput.addEventListener("input", function () {
    this.value = this.value.replace(/[^0-9+]/g, "");
  });

  /* ======================
     CHAR COUNT
  ====================== */
  textarea.addEventListener("input", () => {
    counter.textContent = `${textarea.value.length} / 2000`;
  });

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  /* ======================
     SUBMIT
  ====================== */
  form.addEventListener("submit", e => {
    e.preventDefault();

    if (!form.name.value.trim()) {
      showPopup("Full Name cannot be empty");
      return;
    }

    if (!isValidEmail(form.email.value)) {
      showPopup("Please enter a valid Email");
      return;
    }

    if (!phoneInput.value.trim()) {
      showPopup("Please enter a valid phone number");
      return;
    }

    if (!subjectInput.value) {
      showPopup("Please select a subject before sending your request");
      return;
    }

    if (!textarea.value.trim()) {
      showPopup("Please describe your request");
      return;
    }

    sendBtn.disabled = true;
    showPopup("Sending your request...", false);

    const data = new URLSearchParams({
      name: form.name.value,
      email: form.email.value,
      phone: phoneInput.value,
      subject: subjectInput.value,
      message: textarea.value,
      referrer: document.referrer || "Website"
    });

    fetch(
      "https://script.google.com/macros/s/AKfycbxvOeMaThb3zFJVCZuGdQbJk-dAFH7W06vkoYPCfyfal_GUxF1dvXinEWMZoP8OtKpKcg/exec",
      { method: "POST", body: data }
    )
      .then(() => {
        showPopup("Your request has been sent successfully.");
        form.reset();
        counter.textContent = "0 / 2000";

        /* SUBJECT RESET */
        subjectInput.value = "";
        selectedSubject.textContent = "Select subject";
      })
      .catch(() => {
        showPopup("Connection error. Please try again.");
      })
      .finally(() => {
        sendBtn.disabled = false;
      });
  });

  /* ======================
     PRIVACY & TERMS
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
