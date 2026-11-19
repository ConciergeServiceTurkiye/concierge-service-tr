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

  // Restore the submit button when returning from WhatsApp via browser history.
  window.addEventListener("pageshow", () => {
    unlockSubmit();
  });

  /* ==============================
     PHONE (INTL TEL INPUT)
  ============================== */
  let iti;

  function initPhoneInput() {
    iti = intlTelInput(phone, {
      initialCountry: "us",
      separateDialCode: true,
      allowDropdown: true,
      autoPlaceholder: "polite",
      utilsScript: "https://cdn.jsdelivr.net/npm/intl-tel-input@19.5.4/build/js/utils.js"
    });
  }

  initPhoneInput();

  phone.addEventListener("keydown", e => {
    if (
      e.ctrlKey ||
      e.metaKey ||
      ["Backspace", "Delete", "ArrowLeft", "ArrowRight", "Tab"].includes(e.key)
    ) return;
    if (!/^[0-9]$/.test(e.key)) e.preventDefault();
  });
/* ==============================
   DATE PICKER – FINAL FINAL
============================== */
const dateInput = document.getElementById("date");

let lastInteractionWasKeyboard = false;

const datePicker = flatpickr(dateInput, {
  minDate: "today",
  dateFormat: "Y-m-d",
  disableMobile: true,
  clickOpens: false, // mouse click tamamen bizim kontrolümüzde
});

// Klavye ile geliniyor mu takip et
document.addEventListener("keydown", (e) => {
  if (e.key === "Tab") {
    lastInteractionWasKeyboard = true;
  }
});

document.addEventListener("mousedown", () => {
  lastInteractionWasKeyboard = false;
});

// Focus → sadece klavye ile gelindiyse aç
dateInput.addEventListener("focus", () => {
  if (lastInteractionWasKeyboard && !datePicker.isOpen) {
    datePicker.open();
  }
});

// Mouse click → toggle
dateInput.addEventListener("click", (e) => {
  e.stopPropagation();

  if (datePicker.isOpen) {
    datePicker.close();
  } else {
    datePicker.open();
  }
});

// Input & takvim dışı click → kapat
document.addEventListener("click", (e) => {
  const fp = datePicker.calendarContainer;
  if (
    datePicker.isOpen &&
    !dateInput.contains(e.target) &&
    !fp.contains(e.target)
  ) {
    datePicker.close();
  }
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
        time.value = li.textContent;
        timeIndex = -1;
        timeSelect.classList.add("has-value");
        timeSelect.classList.remove("open");
      });

      timeOptions.appendChild(li);
      minutes += 15;
    }
  }
  buildTimeOptions();

  timeTrigger.addEventListener("focus", () => {
    timeIndex = -1;
    timeSelect.classList.add("open");
  });

  // ==============================
// TIME DROPDOWN
// ==============================
timeTrigger.addEventListener("mousedown", e => {
  e.preventDefault();
  timeSelect.classList.toggle("open"); // toggle yap
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

  if (["Tab", "Shift+Tab", "Escape"].includes(e.key)) {
    timeSelect.classList.remove("open"); // kapanış
    timeIndex = -1;
  }
});

// Body click: açık dropdown kapansın
document.addEventListener("click", e => {
  if (!timeSelect.contains(e.target)) timeSelect.classList.remove("open");
});


  /* ==============================
     GUESTS DROPDOWN
  ============================== */
  let guestsIndex = -1;

  guestsTrigger.addEventListener("focus", () => {
    guestsIndex = -1;
    guestsSelect.classList.add("open");
  });

  // ==============================
// GUESTS DROPDOWN
// ==============================
guestsTrigger.addEventListener("mousedown", e => {
  e.preventDefault();
  guestsSelect.classList.toggle("open"); // toggle yap
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

  if (["Tab", "Shift+Tab", "Escape"].includes(e.key)) {
    guestsSelect.classList.remove("open"); // kapanış
    guestsIndex = -1;
  }
});

document.addEventListener("click", e => {
  if (!guestsSelect.contains(e.target)) guestsSelect.classList.remove("open");
});

  guestsOptions.forEach(li => {
    li.addEventListener("click", () => {
      guestsTrigger.textContent = li.textContent;
      guests.value = li.textContent;
      guestsIndex = -1;
      guestsSelect.classList.add("has-value");
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
      if (cb.checked) {
        input.style.display = "inline-block";
        setTimeout(() => input.focus(), 0);
      } else {
        input.style.display = "none";
        input.value = "";
      }
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
    if (petsToggle.checked) {
      petsGroup.style.display = "flex";
      setTimeout(() => petsTextarea.focus(), 0);
    } else {
      petsGroup.style.display = "none";
      petsTextarea.value = "";
    }
  });

  allergyToggle.addEventListener("change", () => {
    if (allergyToggle.checked) {
      allergyGroup.style.display = "flex";
      setTimeout(() => allergyTextarea.focus(), 0);
    } else {
      allergyGroup.style.display = "none";
      allergyTextarea.value = "";
    }
  });

  /* ==============================
     SUBMIT
  ============================== */
  form.addEventListener("submit", async e => {
    e.preventDefault();
    submitBtn.disabled = true;
    submitBtn.textContent = "Sending...";

    if (!name.value.trim()) return showInlineAlert("Please enter your full name."), unlockSubmit();
    if (!email.value.trim() || !email.checkValidity()) return showInlineAlert("Please enter a valid email."), unlockSubmit();
    if (!iti.isValidNumber()) return showInlineAlert("Please enter a valid phone number."), unlockSubmit();
    if (!date.value) return showInlineAlert("Please select a date."), unlockSubmit();
    if (!time.value) return showInlineAlert("Please select a time."), unlockSubmit();
    if (!guests.value) return showInlineAlert("Please select number of guests."), unlockSubmit();

    const preferredMethod = form.querySelector('input[name="preferred_method"]:checked');
    if (!preferredMethod) return showInlineAlert("Please select your preferred contact method."), unlockSubmit();

    const data = new FormData(form);
    data.set("phone", iti.getNumber());
    data.set("restaurant", restaurantName);
    data.set("_subject", `New ${restaurantName} Reservation Request`);

    if (preferredMethod.value === "WhatsApp") {
      const lines = [
        "NEW RESTAURANT RESERVATION REQUEST",
        `Restaurant: ${data.get("restaurant")}`,
        `Name: ${data.get("name")}`,
        `Email: ${data.get("email")}`,
        `Phone / WhatsApp: ${data.get("phone")}`,
        `Date: ${data.get("date")}`,
        `Time: ${data.get("time")}`,
        `Guests: ${data.get("guests")}`,
        `Children (0–3): ${data.get("age_0_3") || "N/A"}`,
        `Children (4–13): ${data.get("age_4_13") || "N/A"}`,
        `Children (14–17): ${data.get("age_14_17") || "N/A"}`,
        `Pets: ${data.get("pets") || "None"}`,
        `Allergies: ${data.get("allergy") || "None"}`,
        `Notes: ${data.get("notes") || "None"}`,
        "Preferred Method: WhatsApp"
      ];
      submitBtn.textContent = "Opening WhatsApp...";
      window.location.href = "https://wa.me/905344888624?text=" + encodeURIComponent(lines.join("\n"));
      return;
    }

    const payload = Object.fromEntries(data.entries());
    try {
      const response = await fetch("https://formsubmit.co/ajax/conciergeserviceturkiye@gmail.com", {
        method: "POST",
        headers: {"Content-Type": "application/json", "Accept": "application/json"},
        body: JSON.stringify(payload)
      });
      const result = await response.json();
      if (!response.ok || !(result.success === "true" || result.success === true)) {
        throw new Error(result.message || "Email service could not accept the request.");
      }
      showInlineAlert("Your reservation request has been emailed to our concierge team. We will contact you shortly.");
      form.reset();
      iti.destroy();
      phone.value = "";
      initPhoneInput();
      datePicker.clear();
      date.placeholder = "Select date";
      time.value = "";
      timeTrigger.textContent = "Select time";
      timeSelect.classList.remove("has-value");
      guests.value = "";
      guestsTrigger.textContent = "Select Guests(adult)";
      guestsSelect.classList.remove("has-value");
      childrenToggle.checked = false;
      childrenAges.style.display = "none";
      ageToggles.forEach(cb => {
        cb.checked = false;
        const input = document.getElementById(cb.dataset.target);
        input.style.display = "none";
        input.value = "";
      });
      petsToggle.checked = false;
      petsGroup.style.display = "none";
      petsTextarea.value = "";
      allergyToggle.checked = false;
      allergyGroup.style.display = "none";
      allergyTextarea.value = "";
      document.querySelectorAll(".textarea-group textarea").forEach(textarea => {
        const charCount = textarea.parentElement.querySelector(".char-count");
        if (charCount) charCount.textContent = `0 / ${charCount.dataset.max}`;
      });
      unlockSubmit();
    } catch (error) {
      console.error("Reservation email submission failed:", error);
      showInlineAlert("We could not send your request. Please try again or contact us on WhatsApp.");
      unlockSubmit();
    }
  });
});















