document.addEventListener("DOMContentLoaded", () => {

  const form = document.getElementById("contactForm");
  if (!form) return;

  const alertBox = document.getElementById("formInlineAlert");
  const nameField = document.getElementById("name");
  const emailField = document.getElementById("email");
  const phoneField = document.getElementById("phone");
  const subjectHidden = document.getElementById("subject");
  const messageField = document.getElementById("message");
  const charCount = document.getElementById("charCount");

  const customSelect = document.getElementById("customSubject");
  const trigger = customSelect.querySelector(".select-trigger");
  const options = Array.from(customSelect.querySelectorAll(".select-options li"));

  /* ======================
     INLINE ALERT
  ====================== */
  function showInlineAlert(text, success = false) {
    alertBox.textContent = text;
    alertBox.style.visibility = "visible";
    alertBox.style.opacity = "1";
    alertBox.style.borderColor = success ? "#d4af37" : "#c9a24d";

    setTimeout(() => {
      alertBox.style.opacity = "0";
      alertBox.style.visibility = "hidden";
    }, 3500);
  }

  /* ======================
     CHARACTER COUNTER
  ====================== */
  charCount.textContent = "0 / 2000";
  messageField.addEventListener("input", () => {
    charCount.textContent = `${messageField.value.length} / 2000`;
  });

  /* ======================
     PHONE INPUT – intl-tel-input
  ====================== */
 const iti = intlTelInput(phoneField, {
    initialCountry: "us",
    separateDialCode: true,
    dropdownContainer: document.querySelector(".contact-form-wrapper"), // BURASI EKLENDİ
    utilsScript: "https://cdn.jsdelivr.net/npm/intl-tel-input@19.5.4/build/js/utils.js"
});

  phoneField.addEventListener("keydown", e => {
    if (
      e.ctrlKey ||
      e.metaKey ||
      ["Backspace", "Delete", "ArrowLeft", "ArrowRight", "Tab"].includes(e.key)
    ) return;
    if (!/^[0-9]$/.test(e.key)) e.preventDefault();
  });

  /* ======================
     CUSTOM SELECT LOGIC
  ====================== */
  let currentIndex = -1;

  function openDropdown() { customSelect.classList.add("open"); }
  function closeDropdown() { customSelect.classList.remove("open"); currentIndex = -1; clearActive(); }

  function move(direction) {
    if (!customSelect.classList.contains("open")) {
      openDropdown();
      currentIndex = direction === 1 ? 0 : options.length - 1;
    } else {
      currentIndex += direction;
      if (currentIndex < 0) currentIndex = options.length - 1;
      if (currentIndex >= options.length) currentIndex = 0;
    }
    setActive();
  }

  function setActive() {
    clearActive();
    const opt = options[currentIndex];
    opt.classList.add("active");
    opt.scrollIntoView({ block: "nearest" });
  }

  function clearActive() { options.forEach(o => o.classList.remove("active")); }

  function select(index) {
    const opt = options[index];
    trigger.textContent = opt.textContent;
    subjectHidden.value = opt.dataset.value;
    closeDropdown();
  }

  trigger.addEventListener("click", () => {
    customSelect.classList.contains("open") ? closeDropdown() : openDropdown();
  });

  trigger.addEventListener("keydown", e => {
    if (["ArrowDown", "ArrowUp", "Enter", " ", "Escape"].includes(e.key)) e.preventDefault();
    if (e.key === "ArrowDown") move(1);
    if (e.key === "ArrowUp") move(-1);
    if (e.key === "Enter" || e.key === " ") {
      if (customSelect.classList.contains("open") && currentIndex >= 0) select(currentIndex);
      else openDropdown();
    }
    if (e.key === "Escape") closeDropdown();
  });

  options.forEach((opt, index) => {
    opt.addEventListener("click", () => {
      select(index);
      messageField.focus();
    });
  });

  document.addEventListener("click", e => {
    if (!customSelect.contains(e.target)) closeDropdown();
  });

  /* ======================
     FORM SUBMIT
  ====================== */
  form.addEventListener("submit", e => {
    e.preventDefault();

    // Zorunlu alan kontrolleri
    if (!nameField.value.trim()) return showInlineAlert("Please enter your full name.");
    if (!emailField.value.trim()) return showInlineAlert("Please enter your email address.");
    if (!emailField.checkValidity()) return showInlineAlert("Please enter a valid email address.");
    if (!subjectHidden.value.trim()) return showInlineAlert("Please select a subject.");
    if (!messageField.value.trim()) return showInlineAlert("Please enter your request details.");
    if (!iti.isValidNumber()) return showInlineAlert("Please enter a valid phone number.");

    const formData = new FormData(form);
    formData.set("phone", iti.getNumber());

    fetch(form.action, { method: "POST", body: formData })
      .then(r => r.text())
      .then(t => {
        if (t.trim() === "success") {
          showInlineAlert("Your private concierge request has been received.", true);
          form.reset();
          charCount.textContent = "0 / 2000";
          trigger.textContent = "Select a subject";
        } else {
          showInlineAlert("Something went wrong. Please try again.");
        }
      })
      .catch(() => showInlineAlert("Connection error. Please try again later."));
  });

});


