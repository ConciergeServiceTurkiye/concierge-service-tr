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

  function scrollToFirstError() {
    const firstError = document.querySelector(".has-error");
    if (firstError) {
      firstError.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }

  function showInlineAlert(message) {
    const alert = document.getElementById("formInlineAlert");
    alert.textContent = message;
    alert.style.opacity = "1";
    alert.style.visibility = "visible";
    scrollToFirstError();
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
     NATIONALITY DROPDOWN
  ============================== */

  const COUNTRY_LIST = window.intlTelInputGlobals.getCountryData();

  function initNationalityDropdown(container) {
    const trigger = container.querySelector(".nationality-trigger");
    const dropdown = container.querySelector(".nationality-dropdown");
    const hiddenInput = container.querySelector(".participant-nationality");

    dropdown.innerHTML = "";

    COUNTRY_LIST.forEach(c => {
      const div = document.createElement("div");
      div.className = "nationality-option";
      div.innerHTML = `
        <img src="https://flagcdn.com/w20/${c.iso2}.png">
        ${c.name}
      `;
      div.addEventListener("click", () => {
        trigger.textContent = c.name;
        hiddenInput.value = c.iso2.toUpperCase();
        container.classList.remove("open");
      });
      dropdown.appendChild(div);
    });

    trigger.addEventListener("click", () => {
      container.classList.toggle("open");
    });
  }

  document
    .querySelectorAll(".nationality-select")
    .forEach(initNationalityDropdown);

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
     FIELD REFERENCES
  ============================== */

  const fullName = document.querySelector('[name="name"]');
  const email = document.querySelector('[name="email"]');
  const date = document.getElementById("date");
  const language = document.getElementById("language");
  const hotel = document.querySelector('[name="hotel_name"]');
  const mobilityToggle = document.getElementById("mobilityToggle");
  const mobilityText = document.querySelector('[name="mobility_notes"]');

  /* ==============================
     PARTICIPANTS + PRICE ENGINE
  ============================== */

  const participantsContainer = document.getElementById("participantsContainer");

  function getParticipantCount() {
    let count = 0;
    document.querySelectorAll(".participant-row").forEach(row => {
      const name = row.querySelector(".participant-name");
      const nat = row.querySelector(".participant-nationality");
      const year = row.querySelector(".participant-birthyear");

      if (name.value.trim() && nat.value && year.value) {
        count++;
      }
    });
    return count || 1;
  }

  function updatePrice() {
    const count = getParticipantCount();
    const basePrice = 300;
    const extra = 100;
    const total = basePrice + (count - 1) * extra;

    const priceEl = document.getElementById("tourPrice");
    if (priceEl) {
      priceEl.textContent = `$${total}`;
    }
  }

  participantsContainer.addEventListener("input", updatePrice);
  participantsContainer.addEventListener("click", e => {
    if (e.target.classList.contains("remove-participant")) {
      e.target.closest(".participant-row").remove();
      updatePrice();
    }
  });

  /* ==============================
     PARTICIPANT VALIDATION
  ============================== */

  function validateParticipantRow(row, isPrimary) {
    const name = row.querySelector(".participant-name");
    const nat = row.querySelector(".participant-nationality");
    const year = row.querySelector(".participant-birthyear");

    if (isPrimary) {
      if (!nat.value || !year.value) {
        showFieldError(
          nat,
          "Please select nationality and birth year for the primary participant."
        );
        return false;
      }
    } else {
      const anyFilled =
        name.value.trim() || nat.value || year.value;

      if (anyFilled && (!name.value.trim() || !nat.value || !year.value)) {
        showFieldError(
          name,
          "Please complete all participant details, or remove unused participant rows using the × button."
        );
        return false;
      }
    }
    return true;
  }

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
        return showInlineAlert("Please select your preferred guide language.");

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
