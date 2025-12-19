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
     CONTACT FORM (SADECE VARSA)
  ====================== */
  const form = document.getElementById("reservation-form");

  if (form) {
    const sendBtn = form.querySelector(".send-btn");
    const phoneInput = document.getElementById("phone");
    const textarea = form.querySelector("textarea[name='message']");
    const counter = form.querySelector(".char-count");

    /* SUBJECT SELECT */
    const subjectWrapper = document.querySelector(".subject-wrapper");
    const subjectSelect = document.getElementById("subjectSelect");
    const subjectOptions = document.getElementById("subjectOptions");
    const selectedSubject = document.getElementById("selectedSubject");
    const subjectInput = document.getElementById("subjectInput");
    const options = Array.from(subjectOptions.querySelectorAll("li"));

    let isOpen = false;
    let activeIndex = -1;

    function openSubject() {
      if (isOpen) return;
      subjectWrapper.classList.add("open");
      subjectSelect.setAttribute("aria-expanded", "true");
      isOpen = true;
    }

    function closeSubject() {
      subjectWrapper.classList.remove("open");
      subjectSelect.setAttribute("aria-expanded", "false");
      isOpen = false;
      activeIndex = -1;
      options.forEach(o => o.classList.remove("active"));
    }

    function selectOption(index) {
      const value = options[index].dataset.value;
      selectedSubject.textContent = value;
      subjectInput.value = value;
      closeSubject();
    }

    subjectSelect.addEventListener("click", e => {
      e.preventDefault();
      e.stopPropagation();
      isOpen ? closeSubject() : openSubject();
    });

    subjectSelect.addEventListener("keydown", e => {
      if (e.key === "ArrowDown" && !isOpen) {
        openSubject();
        activeIndex = 0;
        options[0].classList.add("active");
        e.preventDefault();
        return;
      }

      if (!isOpen) return;

      if (["ArrowDown", "ArrowUp", "Enter", "Escape"].includes(e.key)) {
        e.preventDefault();
      }

      if (e.key === "ArrowDown") {
        activeIndex = (activeIndex + 1) % options.length;
      }

      if (e.key === "ArrowUp") {
        activeIndex = activeIndex <= 0 ? options.length - 1 : activeIndex - 1;
      }

      if (e.key === "Enter" && activeIndex > -1) {
        selectOption(activeIndex);
        subjectSelect.focus();
        return;
      }

      if (e.key === "Escape") {
        closeSubject();
        subjectSelect.blur();
        return;
      }

      options.forEach((o, i) => {
        o.classList.toggle("active", i === activeIndex);
      });
    });

    options.forEach((option, index) => {
      option.addEventListener("click", e => {
        e.stopPropagation();
        selectOption(index);
      });
    });

    document.addEventListener("click", e => {
      if (!subjectWrapper.contains(e.target)) {
        closeSubject();
      }
    });

    phoneInput.addEventListener("input", function () {
      this.value = this.value.replace(/[^0-9+]/g, "");
    });

    textarea.addEventListener("input", () => {
      counter.textContent = `${textarea.value.length} / 2000`;
    });

    function isValidEmail(email) {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    form.addEventListener("submit", e => {
      e.preventDefault();

      if (!form.name.value.trim()) return showPopup("Full Name cannot be empty");
      if (!isValidEmail(form.email.value)) return showPopup("Please enter a valid Email");
      if (!phoneInput.value.trim()) return showPopup("Please enter a valid phone number");
      if (!subjectInput.value) return showPopup("Please select a subject");
      if (!textarea.value.trim()) return showPopup("Please describe your request");

      sendBtn.disabled = true;
      showPopup("Sending your request...", false);

      const data = new URLSearchParams({
        name: form.name.value,
        email: form.email.value,
        phone: phoneInput.value,
        subject: subjectInput.value,
        message: textarea.value
      });

      fetch("https://script.google.com/macros/s/AKfycbxvOeMaThb3zFJVCZuGdQbJk-dAFH7W06vkoYPCfyfal_GUxF1dvXinEWMZoP8OtKpKcg/exec",
        { method: "POST", body: data }
      )
        .then(() => {
          showPopup("Your request has been sent successfully.");
          form.reset();
          counter.textContent = "0 / 2000";
          selectedSubject.textContent = "Select subject";
        })
        .catch(() => showPopup("Connection error. Please try again."))
        .finally(() => sendBtn.disabled = false);
    });
  }

  /* ======================
     PRIVACY & TERMS (HER SAYFADA ÇALIŞIR)
  ====================== */
  const privacyLink = document.getElementById("privacyLink");
  const termsLink = document.getElementById("termsLink");
  const privacyModal = document.getElementById("privacyModal");
  const termsModal = document.getElementById("termsModal");
  const closeButtons = document.querySelectorAll(".close-modal");

  if (privacyLink && privacyModal) {
    privacyLink.addEventListener("click", e => {
      e.preventDefault();
      privacyModal.style.display = "flex";
    });
  }

  if (termsLink && termsModal) {
    termsLink.addEventListener("click", e => {
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

  document.addEventListener("keydown", e => {
    if (e.key === "Escape") {
      if (privacyModal) privacyModal.style.display = "none";
      if (termsModal) termsModal.style.display = "none";
    }
  });

});
