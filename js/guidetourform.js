document.addEventListener("DOMContentLoaded", () => {

  /* ==============================
     HELPERS – FIELD ERRORS
  ============================== */
  function showFieldError(el, message) {
    const wrapper = el.closest(".field-wrapper") || el.parentElement;
    let error = wrapper.querySelector(".field-error");

    if (!error) {
      error = document.createElement("div");
      error.className = "field-error";
      wrapper.prepend(error);
    }

    error.textContent = message;
    wrapper.classList.add("has-error");
  }

  function hideFieldError(el) {
    const wrapper = el.closest(".field-wrapper") || el.parentElement;
    const error = wrapper.querySelector(".field-error");
    if (error) error.remove();
    wrapper.classList.remove("has-error");
  }

  function showInlineAlert(message) {
    const alert = document.getElementById("formInlineAlert");
    alert.textContent = message;
    alert.style.opacity = "1";
    alert.style.visibility = "visible";
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function hideInlineAlert() {
    const alert = document.getElementById("formInlineAlert");
    alert.style.opacity = "0";
    alert.style.visibility = "hidden";
  }

  /* ==============================
     TOUR NAME & EXPERIENCE
  ============================== */
  const params = new URLSearchParams(window.location.search);
  const tourName = params.get("tour") || "Private Guide Tour";

  document.getElementById("tourName").value = tourName;
  document.getElementById("tourFormTitle").textContent = tourName;

  const TOUR_EXPERIENCES = {
    "Old City Private Tour": `
      <strong>What you'll experience</strong><br>
      • Byzantine & Ottoman heritage with a licensed private guide<br>
      • Hagia Sophia, Blue Mosque & Grand Bazaar storytelling<br>
      • Hidden courtyards & local insights
    `,
    "Bosphorus Experience": `
      <strong>What you'll experience</strong><br>
      • Scenic Bosphorus coastline narration<br>
      • Palaces, waterfront mansions & local life
    `,
    "Istanbul Food Tour": `
      <strong>What you'll experience</strong><br>
      • Authentic local flavors beyond tourist routes<br>
      • Street food & traditional restaurants
    `
  };

  document.getElementById("tourExperience").innerHTML =
    TOUR_EXPERIENCES[tourName] || "";

  /* ==============================
     PHONE
  ============================== */
  const phoneInput = document.getElementById("phone");
  const iti = intlTelInput(phoneInput, {
    initialCountry: "us",
    separateDialCode: true,
    utilsScript:
      "https://cdn.jsdelivr.net/npm/intl-tel-input@19.5.4/build/js/utils.js"
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
     FIELD LEVEL VALIDATION
  ============================== */
  const fullName = document.querySelector('[name="name"]');
  const email = document.querySelector('[name="email"]');
  const date = document.getElementById("date");
  const language = document.getElementById("language");
  const hotel = document.querySelector('[name="hotel_name"]');
  const mobilityToggle = document.getElementById("mobilityToggle");
  const mobilityText = document.querySelector('[name="mobility_notes"]');

  fullName.addEventListener("blur", () => {
    fullName.value.trim()
      ? hideFieldError(fullName)
      : showFieldError(fullName, "Please enter your full name");
  });

  email.addEventListener("blur", () => {
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)
      ? hideFieldError(email)
      : showFieldError(email, "Please enter a valid email address.");
  });

  phoneInput.addEventListener("blur", () => {
    iti.isValidNumber()
      ? hideFieldError(phoneInput)
      : showFieldError(phoneInput, "Please enter a valid phone number.");
  });

  date.addEventListener("blur", () => {
    date.value
      ? hideFieldError(date)
      : showFieldError(date, "Please select your preferred tour date.");
  });

  language.addEventListener("change", () => {
    language.value
      ? hideFieldError(language)
      : showFieldError(language, "Please select your preferred guide language.");
  });

  hotel.addEventListener("blur", () => {
    hotel.value.trim()
      ? hideFieldError(hotel)
      : showFieldError(
          hotel,
          "Please enter your hotel name for pick-up coordination."
        );
  });

  mobilityText.addEventListener("blur", () => {
    if (mobilityToggle.checked && !mobilityText.value.trim()) {
      showFieldError(
        mobilityText,
        "Please describe the mobility assistance needed."
      );
    } else {
      hideFieldError(mobilityText);
    }
  });

  /* ==============================
     PARTICIPANTS
  ============================== */
  const participantsContainer = document.getElementById("participantsContainer");
  const addBtn = document.querySelector(".add-participant-btn");

  function validateParticipantRow(row, isPrimary) {
    const name = row.querySelector(".participant-name");
    const nat = row.querySelector(".participant-nationality");
    const year = row.querySelector(".participant-birthyear");

    if (isPrimary) {
      if (!nat.value || !year.value) {
        showFieldError(
          row,
          "Please select nationality and birth year for the primary participant."
        );
        return false;
      }
    } else {
      const anyFilled =
        name.value.trim() || nat.value || year.value;

      if (anyFilled && (!name.value.trim() || !nat.value || !year.value)) {
        showFieldError(
          row,
          "Please complete all participant details, or remove unused participant rows using the × button."
        );
        return false;
      }
    }

    hideFieldError(row);
    return true;
  }

  addBtn.addEventListener("click", () => {
    // existing HTML row assumed
  });

  /* ==============================
     SUBMIT
  ============================== */
  document
    .getElementById("guideTourForm")
    .addEventListener("submit", function (e) {
      e.preventDefault();
      hideInlineAlert();

      if (!fullName.value.trim())
        return showInlineAlert("Please enter your full name");

      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value))
        return showInlineAlert("Please enter a valid email address.");

      if (!iti.isValidNumber())
        return showInlineAlert("Please enter a valid phone number.");

      if (!date.value)
        return showInlineAlert("Please select your preferred tour date.");

      if (!language.value)
        return showInlineAlert(
          "Please select your preferred guide language."
        );

      if (
        !document.querySelector(
          'input[name="transportation"]:checked'
        )
      )
        return showInlineAlert(
          "Please choose your preferred transportation option."
        );

      if (!hotel.value.trim())
        return showInlineAlert(
          "Please enter your hotel name for pick-up coordination."
        );

      const rows = document.querySelectorAll(".participant-row");
      for (let i = 0; i < rows.length; i++) {
        if (!validateParticipantRow(rows[i], i === 0))
          return showInlineAlert(
            i === 0
              ? "Please select nationality and birth year for the primary participant."
              : "Please complete all participant details, or remove unused participant rows using the × button."
          );
      }

      if (mobilityToggle.checked && !mobilityText.value.trim())
        return showInlineAlert(
          "Please describe the mobility assistance needed."
        );

      this.submit();
    });
});
