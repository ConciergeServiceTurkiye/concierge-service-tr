document.addEventListener("DOMContentLoaded", () => {

  const form = document.getElementById("reservationForm");
  const alertBox = document.getElementById("formInlineAlert");

  const name = document.getElementById("name");
  const email = document.getElementById("email");
  const phone = document.getElementById("phone");
  const date = document.getElementById("date");
  const time = document.getElementById("time");
  const guests = document.getElementById("guests");

  const submitBtn = form.querySelector("button[type='submit']");

  date.min = new Date().toISOString().split("T")[0];

  const allergyToggle = document.getElementById("allergyToggle");
  const allergyField = document.getElementById("allergyField");

  const childrenToggle = document.getElementById("childrenToggle");
  const childrenAges = document.getElementById("childrenAges");
  const ageToggles = document.querySelectorAll(".age-toggle");

  /* PETS */
  const petsToggle = document.getElementById("petsToggle");
  const petsField = document.getElementById("petsField");
  const petsError = document.getElementById("petsError");

  /* INLINE ALERT */
  function showInlineAlert(text) {
    alertBox.textContent = text;
    alertBox.style.visibility = "visible";
    alertBox.style.opacity = "1";

    const formTop = form.getBoundingClientRect().top + window.pageYOffset;

    window.scrollTo({
      top: formTop - 140,
      behavior: "smooth"
    });

    setTimeout(() => {
      alertBox.style.opacity = "0";
      alertBox.style.visibility = "hidden";
    }, 3500);
  }

  function unlockSubmit() {
    submitBtn.disabled = false;
    submitBtn.textContent = "Submit Reservation";
  }

  /* PHONE INPUT */
  const iti = intlTelInput(phone, {
    initialCountry: "us",
    separateDialCode: true
  });

  phone.addEventListener("keydown", e => {
    if (
      e.ctrlKey ||
      e.metaKey ||
      ["Backspace", "Delete", "ArrowLeft", "ArrowRight", "Tab"].includes(e.key)
    ) return;
    if (!/^[0-9]$/.test(e.key)) e.preventDefault();
  });

  /* DATE PICKER */
  flatpickr("#date", {
    minDate: "today",
    locale: navigator.language,
    dateFormat: "Y-m-d",
    disableMobile: true
  });

  /* TIME OPTIONS */
  function buildTimes() {
    time.innerHTML = `<option value="" disabled selected>Select time</option>`;
    let minutes = 18 * 60;
    const end = 22 * 60;

    while (minutes <= end) {
      const h = String(Math.floor(minutes / 60)).padStart(2, "0");
      const m = String(minutes % 60).padStart(2, "0");

      const opt = document.createElement("option");
      opt.value = `${h}:${m}`;
      opt.textContent = `${h}:${m}`;
      time.appendChild(opt);

      minutes += 15;
    }
  }
  buildTimes();

  /* SELECT COLOR */
  time.addEventListener("change", () => {
    time.style.color = time.value ? "#d4af37" : "rgba(255,255,255,0.65)";
  });

  guests.addEventListener("change", () => {
    guests.style.color = guests.value ? "#d4af37" : "rgba(255,255,255,0.65)";
  });

  /* ALLERGY */
  allergyToggle.addEventListener("change", () => {
    allergyField.style.display = allergyToggle.checked ? "block" : "none";
  });

  /* CHILDREN */
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

  /* PETS TOGGLE */
  petsToggle.addEventListener("change", () => {
    if (petsToggle.checked) {
      petsField.style.display = "block";
    } else {
      petsField.style.display = "none";
      petsField.value = "";
      petsError.style.display = "none";
    }
  });

  /* SUBMIT */
  form.addEventListener("submit", e => {
    e.preventDefault();

    submitBtn.disabled = true;
    submitBtn.textContent = "Sending...";

    if (!name.value.trim()) return showInlineAlert("Please enter your full name."), unlockSubmit();
    if (!email.value.trim()) return showInlineAlert("Please enter your email address."), unlockSubmit();
    if (!iti.isValidNumber()) return showInlineAlert("Please enter a valid phone number."), unlockSubmit();
    if (!date.value) return showInlineAlert("Please select a date."), unlockSubmit();
    if (!time.value) return showInlineAlert("Please select a time."), unlockSubmit();
    if (!guests.value) return showInlineAlert("Please select number of guests."), unlockSubmit();

    if (allergyToggle.checked && !allergyField.value.trim()) {
      showInlineAlert("Please specify your allergy details.");
      unlockSubmit();
      return;
    }

    if (childrenToggle.checked) {
      let valid = false;
      for (let toggle of ageToggles) {
        if (toggle.checked) {
          valid = true;
          const input = document.getElementById(toggle.dataset.target);
          if (!input.value.trim()) {
            showInlineAlert("Please enter number of children for selected age group.");
            unlockSubmit();
            return;
          }
        }
      }
      if (!valid) {
        showInlineAlert("Please select at least one age group for children.");
        unlockSubmit();
        return;
      }
    }

    /* PETS VALIDATION */
    if (petsToggle.checked && !petsField.value.trim()) {
      petsError.style.display = "block";
      petsField.focus();
      unlockSubmit();
      return;
    }

    petsError.style.display = "none";

    const data = new FormData(form);
    data.set("phone", iti.getNumber());

    fetch("https://script.google.com/macros/s/AKfycbw9P03YjqbWBLy_YiGiJOUIL19uk89RmsSqWOt1CN3FV6WVqPg6IQFwjuj9RbBiYND7ZA/exec", {
      method: "POST",
      body: data
    })
    .then(res => res.json())
    .then(() => {
      showInlineAlert("Reservation received. Our concierge team will contact you shortly.");
      form.reset();
      unlockSubmit();
      childrenAges.style.display = "none";
      allergyField.style.display = "none";
      petsField.style.display = "none";
      buildTimes();
    })
    .catch(() => {
      showInlineAlert("Connection error. Please try again later.");
      unlockSubmit();
    });
  });
});
