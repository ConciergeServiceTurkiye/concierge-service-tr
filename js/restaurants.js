document.addEventListener("DOMContentLoaded", () => {

  /* ==============================
     CHAR COUNT
  ============================== */
  document.querySelectorAll(".textarea-group textarea").forEach(textarea => {
    const charCount = textarea.parentElement.querySelector(".char-count");
    if (!charCount) return;
    const max = charCount.dataset.max;

    const update = () => {
      charCount.textContent = `${textarea.value.length} / ${max}`;
    };

    textarea.addEventListener("input", update);
    update();
  });

  /* ==============================
     FORM ELEMENTS
  ============================== */
  const form = document.getElementById("reservationForm");
  const alertBox = document.getElementById("formInlineAlert");

  const name = document.getElementById("name");
  const email = document.getElementById("email");
  const phone = document.getElementById("phone");
  const date = document.getElementById("date");
  const time = document.getElementById("time");
  const guests = document.getElementById("guests");

  const submitBtn = form.querySelector("button[type='submit']");

  const timeSelect = document.getElementById("timeSelect");
  const timeTrigger = timeSelect.querySelector(".select-trigger");
  const timeOptions = timeSelect.querySelector(".select-options");

  const guestsSelect = document.getElementById("guestsSelect");
  const guestsTrigger = guestsSelect.querySelector(".select-trigger");
  const guestsOptions = guestsSelect.querySelectorAll(".select-options li");

  const childrenToggle = document.getElementById("childrenToggle");
  const childrenAges = document.getElementById("childrenAges");
  const ageToggles = document.querySelectorAll(".age-toggle");

  const petsToggle = document.getElementById("petsToggle");
  const petsGroup = document.getElementById("petsGroup");
  const petsTextarea = document.getElementById("petsField");

  const allergyToggle = document.getElementById("allergyToggle");
  const allergyGroup = document.getElementById("allergyGroup");
  const allergyTextarea = document.getElementById("allergyField");

  /* ==============================
     INLINE ALERT
  ============================== */
  function showInlineAlert(text) {
    alertBox.textContent = text;
    alertBox.style.visibility = "visible";
    alertBox.style.opacity = "1";

    const top = form.getBoundingClientRect().top + window.pageYOffset;
    window.scrollTo({ top: top - 140, behavior: "smooth" });

    setTimeout(() => {
      alertBox.style.opacity = "0";
      alertBox.style.visibility = "hidden";
    }, 3500);
  }

  function unlockSubmit() {
    submitBtn.disabled = false;
    submitBtn.textContent = "Submit Reservation";
  }

  /* ==============================
     PHONE (INTL TEL INPUT)
  ============================== */
  const iti = intlTelInput(phone, {
    initialCountry: "us",
    separateDialCode: true,
    allowDropdown: true,
    autoPlaceholder: "polite",
    utilsScript: "https://cdn.jsdelivr.net/npm/intl-tel-input@19.5.4/build/js/utils.js"
  });

  phone.addEventListener("keydown", e => {
    if (
      e.ctrlKey ||
      e.metaKey ||
      ["Backspace", "Delete", "ArrowLeft", "ArrowRight", "Tab"].includes(e.key)
    ) return;
    if (!/^[0-9]$/.test(e.key)) e.preventDefault();
  });

  /* ==============================
     DATE PICKER
  ============================== */
  flatpickr("#date", {
    minDate: "today",
    dateFormat: "Y-m-d",
    disableMobile: true
  });

  /* ==============================
     TIME DROPDOWN
  ============================== */
  let timeIndex = -1;

  function buildTimeOptions() {
    let minutes = 18 * 60;
    const end = 22 * 60;
    timeOptions.innerHTML = "";

    while (minutes <= end) {
      const h = String(Math.floor(minutes / 60)).padStart(2, "0");
      const m = String(minutes % 60).padStart(2, "0");
      const li = document.createElement("li");
      li.textContent = `${h}:${m}`;

      li.addEventListener("click", () => {
        timeTrigger.textContent = li.textContent;
        timeTrigger.style.color = "#d4af37";
        time.value = li.textContent;
        timeSelect.classList.remove("open");
      });

      timeOptions.appendChild(li);
      minutes += 15;
    }
  }
  buildTimeOptions();

  timeTrigger.addEventListener("focus", () => timeSelect.classList.add("open"));
  timeTrigger.addEventListener("mousedown", e => {
    e.preventDefault();
    timeSelect.classList.add("open");
  });

  timeTrigger.addEventListener("keydown", e => {
    const items = timeOptions.querySelectorAll("li");
    if (!items.length) return;

    if (["ArrowDown", "ArrowUp"].includes(e.key)) {
      e.preventDefault();
      timeIndex += e.key === "ArrowDown" ? 1 : -1;
      timeIndex = Math.max(0, Math.min(items.length - 1, timeIndex));

      items.forEach(i => i.classList.remove("active"));
      items[timeIndex].classList.add("active");
      items[timeIndex].scrollIntoView({ block: "nearest" });
    }

    if (e.key === "Enter" && timeIndex >= 0) {
      e.preventDefault();
      items[timeIndex].click();
    }
  });

  /* ==============================
     GUESTS DROPDOWN
  ============================== */
  let guestsIndex = -1;

  guestsTrigger.addEventListener("focus", () => guestsSelect.classList.add("open"));
  guestsTrigger.addEventListener("mousedown", e => {
    e.preventDefault();
    guestsSelect.classList.add("open");
  });

  guestsTrigger.addEventListener("keydown", e => {
    if (["ArrowDown", "ArrowUp"].includes(e.key)) {
      e.preventDefault();
      guestsIndex += e.key === "ArrowDown" ? 1 : -1;
      guestsIndex = Math.max(0, Math.min(guestsOptions.length - 1, guestsIndex));

      guestsOptions.forEach(li => li.classList.remove("active"));
      guestsOptions[guestsIndex].classList.add("active");
      guestsOptions[guestsIndex].scrollIntoView({ block: "nearest" });
    }

    if (e.key === "Enter" && guestsIndex >= 0) {
      e.preventDefault();
      guestsOptions[guestsIndex].click();
    }
  });

  guestsOptions.forEach(li => {
    li.addEventListener("click", () => {
      guestsTrigger.textContent = li.textContent;
      guestsTrigger.style.color = "#d4af37";
      guests.value = li.textContent;
      guestsSelect.classList.remove("open");
    });
  });

  document.addEventListener("click", e => {
    if (!timeSelect.contains(e.target)) timeSelect.classList.remove("open");
    if (!guestsSelect.contains(e.target)) guestsSelect.classList.remove("open");
  });

  /* ==============================
     CHILDREN
  ============================== */
  childrenAges.style.display = "none";

  childrenToggle.addEventListener("change", () => {
    childrenAges.style.display = childrenToggle.checked ? "flex" : "none";
    if (!childrenToggle.checked) {
      ageToggles.forEach(cb => {
        cb.checked = false;
        const input = document.getElementById(cb.dataset.target);
        input.style.display = "none";
        input.value = "";
      });
    }
  });

  ageToggles.forEach(cb => {
    const input = document.getElementById(cb.dataset.target);
    cb.addEventListener("change", () => {
      input.style.display = cb.checked ? "inline-block" : "none";
      if (!cb.checked) input.value = "";
    });
  });

  document.querySelectorAll(".child-input").forEach(input => {
    input.addEventListener("input", () => {
      input.value = input.value.replace(/\D/g, "").slice(0, 4);
    });
  });

  /* ==============================
     PETS & ALLERGY
  ============================== */
  petsGroup.style.display = "none";
  allergyGroup.style.display = "none";

  petsToggle.addEventListener("change", () => {
    petsGroup.style.display = petsToggle.checked ? "flex" : "none";
    if (!petsToggle.checked) petsTextarea.value = "";
  });

  allergyToggle.addEventListener("change", () => {
    allergyGroup.style.display = allergyToggle.checked ? "flex" : "none";
    if (!allergyToggle.checked) allergyTextarea.value = "";
  });

  /* ==============================
     SUBMIT
  ============================== */
  form.addEventListener("submit", e => {
    e.preventDefault();

    submitBtn.disabled = true;
    submitBtn.textContent = "Sending...";

    if (!name.value.trim()) return showInlineAlert("Please enter your full name."), unlockSubmit();
    if (!email.value.trim() || !email.checkValidity()) return showInlineAlert("Please enter a valid email."), unlockSubmit();
    if (!iti.isValidNumber()) return showInlineAlert("Please enter a valid phone number."), unlockSubmit();
    if (!date.value) return showInlineAlert("Please select a date."), unlockSubmit();
    if (!time.value) return showInlineAlert("Please select a time."), unlockSubmit();
    if (!guests.value) return showInlineAlert("Please select number of guests."), unlockSubmit();

    if (childrenToggle.checked) {
      let valid = false;
      for (let toggle of ageToggles) {
        if (toggle.checked) {
          valid = true;
          const input = document.getElementById(toggle.dataset.target);
          if (!input.value.trim()) {
            showInlineAlert("Please enter number of children.");
            unlockSubmit();
            return;
          }
        }
      }
      if (!valid) return showInlineAlert("Please select age group for children."), unlockSubmit();
    }

    if (petsToggle.checked && !petsTextarea.value.trim())
      return showInlineAlert("Please describe your pet."), unlockSubmit();

    if (allergyToggle.checked && !allergyTextarea.value.trim())
      return showInlineAlert("Please specify your allergy."), unlockSubmit();

    const data = new FormData(form);
    data.set("phone", iti.getNumber());

    fetch("https://script.google.com/macros/s/AKfycbw9P03YjqbWBLy_YiGiJOUIL19uk89RmsSqWOt1CN3FV6WVqPg6IQFwjuj9RbBiYND7ZA/exec", {
      method: "POST",
      body: data,
      mode: "no-cors"
    }).then(() => {
      showInlineAlert("Reservation received. Our concierge team will contact you shortly.");
      form.reset();
      unlockSubmit();
    }).catch(() => {
      showInlineAlert("Connection error. Please try again.");
      unlockSubmit();
    });
  });

});
