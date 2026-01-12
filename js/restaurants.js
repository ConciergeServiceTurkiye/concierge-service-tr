document.addEventListener("DOMContentLoaded", () => {
document.querySelectorAll(".textarea-group textarea").forEach(textarea => {
  const charCount = textarea.parentElement.querySelector(".char-count");
  const max = charCount.dataset.max;
  if (!textarea || !charCount || !max) return;
  const updateCount = () => {
    charCount.textContent = `${textarea.value.length} / ${max}`;
  };
  textarea.addEventListener("input", updateCount);
  updateCount();
});

  const form = document.getElementById("reservationForm");
  const alertBox = document.getElementById("formInlineAlert");

  const name = document.getElementById("name");
  const email = document.getElementById("email");
  const phone = document.getElementById("phone");
  const date = document.getElementById("date");
  const time = document.getElementById("time");
  const guests = document.getElementById("guests");
  const submitBtn = form.querySelector("button[type='submit']");
  const childrenToggle = document.getElementById("childrenToggle");
  const childrenAges = document.getElementById("childrenAges");
  const ageToggles = document.querySelectorAll(".age-toggle");
  const petsToggle = document.getElementById("petsToggle");
  const petsGroup = document.getElementById("petsGroup");
  const allergyToggle = document.getElementById("allergyToggle");
  const allergyGroup = document.getElementById("allergyGroup");

  /* INLINE ALERT */
  function showInlineAlert(text) {
    alertBox.textContent = text;
    alertBox.style.visibility = "visible";
    alertBox.style.opacity = "1";

    const formTop = form.getBoundingClientRect().top + window.pageYOffset;
    window.scrollTo({top: formTop - 140, behavior: "smooth"});

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

  /* ==============================
   INTL TEL INPUT – KEYBOARD UX
============================== */

let countryIndex = -1;

phone.addEventListener("keydown", e => {
  const dropdown = document.querySelector(".iti__country-list");
  const search = dropdown?.querySelector(".iti__search-input");
  const countries = dropdown?.querySelectorAll(".iti__country");
  if (!dropdown || !countries.length) return;

  // TAB → ülke listesine geç
  if (e.key === "Tab" && dropdown.classList.contains("iti__country-list--visible")) {
    e.preventDefault();
    countryIndex = 0;
    setActiveCountry(countries);
  }

  // ALT + TAB → search input
  if (e.altKey && e.key === "Tab") {
    e.preventDefault();
    search.focus();
    clearActiveCountries(countries);
  }

  // OK TUŞLARI
  if (["ArrowDown", "ArrowUp"].includes(e.key)) {
    e.preventDefault();
    if (e.key === "ArrowDown" && countryIndex < countries.length - 1) {countryIndex++;}
    if (e.key === "ArrowUp" && countryIndex > 0) {countryIndex--;}
    setActiveCountry(countries);
  }

  // ENTER → ülke seç
  if (e.key === "Enter" && countryIndex >= 0) {
    e.preventDefault();
    countries[countryIndex].click();
    phone.focus();
  }
});

function setActiveCountry(countries) {
  clearActiveCountries(countries);
  countries[countryIndex].classList.add("active");
  countries[countryIndex].scrollIntoView({ block: "nearest" });
}

function clearActiveCountries(countries) {
  countries.forEach(c => c.classList.remove("active"));
}

  /* DATE PICKER */
  flatpickr("#date", {
    minDate: "today",
    locale: "en",
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

const petsTextarea = petsGroup.querySelector("textarea");
const allergyTextarea = allergyGroup.querySelector("textarea");

// başlangıç
petsGroup.style.display = "none";
allergyGroup.style.display = "none";

petsToggle.addEventListener("change", () => {
  if (petsToggle.checked) {
    petsGroup.style.setProperty("display", "flex", "important");
  } else {
    petsGroup.style.display = "none";
    petsTextarea.value = "";
  }
});

allergyToggle.addEventListener("change", () => {
  if (allergyToggle.checked) {
    allergyGroup.style.setProperty("display", "flex", "important");
  } else {
    allergyGroup.style.display = "none";
    allergyTextarea.value = "";
  }
});

  /* SUBMIT */
  form.addEventListener("submit", e => {
    e.preventDefault();
    
    submitBtn.disabled = true;
    submitBtn.textContent = "Sending...";

    if (!name.value.trim()) return showInlineAlert("Please enter your full name."), unlockSubmit();
    if (!email.value.trim()) return showInlineAlert("Please enter your email address."), unlockSubmit();
    if (!email.checkValidity()) return showInlineAlert("Please enter a valid email address."), unlockSubmit();
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
          if (petsToggle.checked && !petsTextarea.value.trim()) {
  showInlineAlert("Please describe your pet.");
  unlockSubmit();
  return;
}

if (allergyToggle.checked && !allergyTextarea.value.trim()) {
  showInlineAlert("Please specify your allergy.");
  unlockSubmit();
  return;
}

      }
    }

    const data = new FormData(form);
    data.set("phone", iti.getNumber());

    fetch("https://script.google.com/macros/s/AKfycbw9P03YjqbWBLy_YiGiJOUIL19uk89RmsSqWOt1CN3FV6WVqPg6IQFwjuj9RbBiYND7ZA/exec", {
  method: "POST",
  body: data,
  mode: "no-cors"
})
.then(() => {
  showInlineAlert("Reservation received. Our concierge team will contact you shortly.");
  form.reset();

  document.querySelectorAll(".char-count").forEach(c => {
    const max = c.dataset.max;
    c.textContent = `0 / ${max}`;
  });

  unlockSubmit();
  childrenAges.style.display = "none";
  childrenToggle.checked = false;
  buildTimes();
})
.catch(() => {
  showInlineAlert("Connection error. Please try again later.");
  unlockSubmit();
});
});
  const dateInput = document.getElementById("date");
  const timeSelectWrapper = document.querySelector("#time").closest(".custom-select");
  const timeTrigger = timeSelectWrapper.querySelector(".select-trigger");

  dateInput.addEventListener("keydown", (e) => {
    if (e.key === "Tab" && !e.shiftKey) {
      setTimeout(() => {
        timeSelectWrapper.classList.add("open");
      }, 10);
    }
  });

  timeTrigger.addEventListener("blur", () => {
    timeSelectWrapper.classList.remove("open");
  });
});

