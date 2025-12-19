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
     HERO SLIDER (DOKUNULMADI)
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
  function showPopup(message) {
    if (!popupAlert) return;
    popupAlert.textContent = message;
    popupAlert.classList.add("show");
    setTimeout(() => popupAlert.classList.remove("show"), 3000);
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
  const emailInput = form.querySelector("input[name='email']");

  /* ======================
     PHONE MASK SYSTEM
  ====================== */
  let countryCode = "";
  const numberMask = "___ ___ ____";

  function buildValue() {
    return `+(${countryCode}) ${numberMask}`;
  }

  function setCaret(pos) {
    requestAnimationFrame(() => {
      phoneInput.setSelectionRange(pos, pos);
    });
  }

  function resetPhone() {
    countryCode = "";
    phoneInput.value = "+() ___ ___ ____";
    setCaret(2);
  }

  resetPhone();

  function firstUnderscore() {
    return phoneInput.value.indexOf("_");
  }

  phoneInput.addEventListener("keydown", e => {
    const caret = phoneInput.selectionStart;
    const closingParen = phoneInput.value.indexOf(")");

    /* ======================
       BACKSPACE / DELETE
    ====================== */
    if (e.key === "Backspace" || e.key === "Delete") {
      e.preventDefault();

      let idx = caret;
      if (e.key === "Backspace") idx = caret - 1;

      /* +() ASLA SİLİNEMEZ */
      if (idx <= 2) {
        setCaret(2);
        return;
      }

      /* COUNTRY CODE SİLME */
      if (idx > 1 && idx < closingParen) {
        countryCode = countryCode.slice(0, -1);
        phoneInput.value = buildValue();
        setCaret(2 + countryCode.length);
        return;
      }

      /* PHONE NUMBER SİLME */
      if (idx > closingParen && phoneInput.value[idx] !== " ") {
        phoneInput.value =
          phoneInput.value.slice(0, idx) + "_" + phoneInput.value.slice(idx + 1);
        setCaret(idx);
      }
      return;
    }

    /* ======================
       TAB / SHIFT + TAB
    ====================== */
    if (e.key === "Tab") {
      e.preventDefault();

      if (e.shiftKey) {
        if (caret > closingParen) {
          setCaret(2 + countryCode.length);
          return;
        }
        emailInput.focus();
        return;
      }

      const pos = firstUnderscore();
      if (countryCode.length && pos !== -1) {
        setCaret(pos);
      } else {
        textarea.focus();
      }
      return;
    }

    /* CTRL / ALT / META SERBEST */
    if (e.ctrlKey || e.metaKey || e.altKey) return;

    /* ======================
       HARFLER TAMAMEN YASAK
    ====================== */
    if (/^[a-zA-Z]$/.test(e.key)) {
      e.preventDefault();
      return;
    }

    /* ======================
       SADECE RAKAM
    ====================== */
    if (!/^\d$/.test(e.key)) return;

    e.preventDefault();

    /* COUNTRY CODE (MAX 3) */
    if (caret <= closingParen) {
      if (countryCode.length < 3) {
        countryCode += e.key;
        phoneInput.value = buildValue();
        setCaret(2 + countryCode.length);
      }
      return;
    }

    /* PHONE NUMBER */
    const idx = firstUnderscore();
    if (idx === -1) return;

    phoneInput.value =
      phoneInput.value.slice(0, idx) + e.key + phoneInput.value.slice(idx + 1);
    setCaret(idx + 1);
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

    if (!countryCode || phoneInput.value.includes("_")) {
      showPopup("Please enter a valid phone number");
      return;
    }

    if (!textarea.value.trim()) {
      showPopup("Please describe your request");
      return;
    }

    sendBtn.disabled = true;
    showPopup("Sending your request...");

    const data = new URLSearchParams({
      name: form.name.value,
      email: form.email.value,
      phone: phoneInput.value,
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
        resetPhone();
      })
      .catch(() => {
        showPopup("Connection error. Please try again.");
      })
      .finally(() => {
        sendBtn.disabled = false;
      });
  });

  /* ======================
     PRIVACY & TERMS MODALS
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
