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

  // Give WhatsApp and Email separate, predictable Tab stops.
  const whatsappMethod = form.querySelector('input[name="preferred_method"][value="WhatsApp"]');
  const emailMethod = form.querySelector('input[name="preferred_method"][value="Email"]');
  const notesField = document.getElementById("notesField");

  // Radios remain usable with arrow keys, while Tab is handled explicitly.
  whatsappMethod.tabIndex = -1;
  emailMethod.tabIndex = -1;

  notesField.addEventListener("keydown", event => {
    if (event.key === "Tab" && !event.shiftKey) {
      event.preventDefault();
      whatsappMethod.focus();
    }
  });

  whatsappMethod.addEventListener("keydown", event => {
    if (event.key === "Tab" && !event.shiftKey) {
      event.preventDefault();
      emailMethod.focus();
    } else if (event.key === "Tab" && event.shiftKey) {
      event.preventDefault();
      notesField.focus();
    }
  });

  emailMethod.addEventListener("keydown", event => {
    if (event.key === "Tab" && event.shiftKey) {
      event.preventDefault();
      whatsappMethod.focus();
    }
  });

  submitBtn.addEventListener("keydown", event => {
    if (event.key === "Tab" && event.shiftKey) {
      event.preventDefault();
      emailMethod.focus();
    }
  });

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

    const alertTop = alertBox.getBoundingClientRect().top + window.pageYOffset;
    window.scrollTo({ top: Math.max(0, alertTop - 160), behavior: "smooth" });

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

    try {
      if (!name.value.trim()) throw new Error("Please enter your full name.");
      if (!email.value.trim() || !email.checkValidity()) throw new Error("Please enter a valid email.");
      if (!iti.isValidNumber()) throw new Error("Please enter a valid phone number.");
      if (!date.value) throw new Error("Please select a date.");
      if (!time.value) throw new Error("Please select a time.");
      if (!guests.value) throw new Error("Please select number of guests.");

      const preferredMethod = form.querySelector('input[name="preferred_method"]:checked');
      if (!preferredMethod) throw new Error("Please select your preferred contact method.");

      const data = new FormData(form);
      data.set("phone", iti.getNumber());
      data.set("restaurant", restaurantName);
      data.set("_subject", `New ${restaurantName} Reservation Request`);

      const fields = Object.fromEntries(data.entries());
      delete fields.name;
      delete fields.email;
      delete fields.preferred_method;
      delete fields._subject;
      delete fields._template;
      const payload = {
        formType: "Restaurant reservation",
        subject: `New ${restaurantName} Reservation Request`,
        customer: { name: data.get("name"), email: data.get("email") },
        preferredMethod: preferredMethod.value,
        fields
      };
      const whatsappLines = [
        "🍽️ *RESTAURANT RESERVATION REQUEST*",
        "",
        `📍 *Restaurant:* ${data.get("restaurant")}`,
        "",
        "👤 *GUEST DETAILS*",
        `Name: ${data.get("name")}`,
        `Email: ${data.get("email")}`,
        `Phone: ${data.get("phone")}`,
        "",
        "📅 *RESERVATION DETAILS*",
        `Date: ${data.get("date")}`,
        `Time: ${data.get("time")}`,
        `Guests: ${data.get("guests")}`,
        `Pets: ${data.get("pets") || "No"}`,
        `Allergies: ${data.get("allergy") || "None"}`,
        `Special requests: ${data.get("notes") || "None"}`,
        "",
        `📲 *Preferred contact method:* ${preferredMethod.value}`,
        "",
        "_This request has already been submitted through the Concierge Service Türkiye website._"
      ];
      const whatsappMessage = whatsappLines.join("\\n");

      const requestId = crypto.randomUUID();

      // Keep the form locked while the server submits both emails.
      const slowResponseNotice = window.setTimeout(() => {
        submitBtn.textContent = "Still processing...";
        showInlineAlert("Your request is still being processed. Please do not submit it again.");
      }, 4000);

      let response;
      let result;
      try {
        response = await fetch("/api/request", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Idempotency-Key": requestId
          },
          body: JSON.stringify(payload)
        });
        result = await response.json();
      } finally {
        window.clearTimeout(slowResponseNotice);
      }

      if (!response.ok || result.success !== true) {
        throw new Error(result.message || `Reservation service returned HTTP ${response.status}.`);
      }

      if (preferredMethod.value === "WhatsApp") {
        const whatsappUrl = "https://wa.me/905344888624?text=" + encodeURIComponent(whatsappMessage);
        window.open(whatsappUrl, "_blank");
        showInlineAlert("Your request has been sent to our concierge team. WhatsApp is ready if you would also like to message us.", true);
      } else {
        showInlineAlert("Your request has been sent to our concierge team. We will contact you shortly.", true);
      }
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
      console.error("Reservation form submission failed:", error);
      const message = error.message || "The email service could not confirm the request. Your details are still in the form.";
      showInlineAlert(message);
      unlockSubmit();
    }
  });
});















