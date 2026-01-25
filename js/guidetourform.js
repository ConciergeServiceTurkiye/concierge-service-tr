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

const tourName = params.get("tour")
  ? decodeURIComponent(params.get("tour").replace(/\+/g, " "))
  : "Private Guide Tour";

// hidden input (varsa)
const tourNameInput = document.getElementById("tourName");
if (tourNameInput) tourNameInput.value = tourName;

// form title
const titleEl = document.querySelector(".guide-form-title");
if (titleEl) titleEl.textContent = tourName;


  const TOUR_EXPERIENCES = {
    "Old City Private Tour": `
<strong>What you'll experience</strong>
<span class="experience-link" data-experience="byzantine">Byzantine</span> &
<span class="experience-link" data-experience="ottoman">Ottoman</span> heritage with a licensed private guide •
<span class="experience-link" data-experience="hagiaphia">Hagia Sophia</span>,
<span class="experience-link" data-experience="bluemosque">Blue Mosque</span>,
<span class="experience-link" data-experience="topkapi">Topkapı Palace</span>,
<span class="experience-link" data-experience="basilica">Basilica Cistern</span>,
<span class="experience-link" data-experience="hippodrome">Hippodrome</span> &
<span class="experience-link" data-experience="grandbazaar">Grand Bazaar</span> storytelling •
<span class="experience-link" data-experience="courtyards">Hidden courtyards</span> &
<span class="experience-link" data-experience="localinsights">local insights</span>
`,
    "Bosphorus Shore Experience": `
      <strong>What you'll experience</strong><br>
      • Scenic Bosphorus coastline narration<br>
      • Palaces, waterfront mansions & local life
    `,
    "Street Food Discovery": `
      <strong>What you'll experience</strong><br>
      • Authentic local flavors beyond tourist routes<br>
      • Street food & traditional restaurants
    `
  };

  document.getElementById("tourExperience").innerHTML =
    TOUR_EXPERIENCES[tourName] || "";


/* ==============================
   EXPERIENCE MODAL DATA
============================== */
const EXPERIENCE_DATA = {
  byzantine: {
    title: "Byzantine Heritage",
    img: "assets/byzantine.jpg",
    desc:
      "Discover the layers of Constantinople’s imperial past, from ancient forums to monumental churches that shaped world history."
  },
  ottoman: {
    title: "Ottoman Legacy",
    img: "assets/ottoman.jpg",
    desc:
      "Walk through centuries of Ottoman grandeur, architecture and courtly life that defined Istanbul as a global capital."
  },
  hagiaphia: {
    title: "Hagia Sophia",
    img: "assets/hagiasophia.jpg",
    desc:
      "A timeless masterpiece bridging civilizations, faiths and empires under one magnificent dome."
  },
  bluemosque: {
    title: "Blue Mosque",
    img: "assets/bluemosque.jpg",
    desc:
      "An architectural harmony of faith and elegance, still alive with daily prayer and tradition."
  },
  topkapi: {
    title: "Topkapı Palace",
    img: "assets/topkapi.jpg",
    desc:
      "Enter the world of sultans, imperial treasures and palace life overlooking the Bosphorus."
  },
  basilica: {
    title: "Basilica Cistern",
    img: "assets/basilicacistern.jpg",
    desc:
      "An underground marvel of columns, silence and water, hidden beneath the Old City."
  },
  hippodrome: {
    title: "Hippodrome",
    img: "assets/hippodrome.jpg",
    desc:
      "Once the heart of Byzantine public life, where chariot races and ceremonies shaped the city."
  },
  grandbazaar: {
    title: "Grand Bazaar & Artisan Workshops",
    img: "assets/grandbazaar.jpg",
    desc:
      "Explore one of the world’s oldest covered markets with access to curated artisan workshops, including traditional carpet and kilim exhibitions guided by trusted local expertise."
  },
courtyards: {
  title: "Hidden Courtyards",
  img: "assets/courtyards.jpg",
  desc:
    "Step beyond the main routes into secluded courtyards, madrasas and passageways that reveal the city’s quieter, authentic soul."
}
};

/* ==============================
   MODAL ENGINE
============================== */
const modal = document.getElementById("experienceModal");
const modalImg = document.getElementById("experienceImg");
const modalTitle = document.getElementById("experienceTitle");
const modalDesc = document.getElementById("experienceDesc");

function openExperience(key) {
  const data = EXPERIENCE_DATA[key];
  if (!data) return;

  modalImg.src = data.img;
  modalTitle.textContent = data.title;
  modalDesc.textContent = data.desc;

  modal.classList.add("active");
}

function closeExperience() {
  modal.classList.remove("active");
}

document.addEventListener("click", e => {
  if (e.target.classList.contains("experience-link")) {
    openExperience(e.target.dataset.experience);
  }

  if (
    e.target.classList.contains("experience-overlay") ||
    e.target.classList.contains("experience-close")
  ) {
    closeExperience();
  }
});

document.addEventListener("keydown", e => {
  if (e.key === "Escape") closeExperience();
});

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

 /* ========================= PHONE INPUT ========================= */
  const phoneInput = document.getElementById("phone");
  let iti = null;

  if (phoneInput) {
    iti = intlTelInput(phoneInput, {
      initialCountry: "us",
      separateDialCode: true,
      utilsScript:
        "https://cdn.jsdelivr.net/npm/intl-tel-input@19.5.4/build/js/utils.js"
    });
  }

/* ========================= DATE PICKER ========================= */
  const dateInput = document.getElementById("date");
  if (dateInput) {
    const datePicker = flatpickr(dateInput, {
      minDate: "today",
      dateFormat: "Y-m-d",
      disableMobile: true
    });
  }


  /* ==============================
     FIELD REFERENCES
  ============================== */

  const fullName = document.querySelector('[name="name"]');
  const email = document.querySelector('[name="email"]');
  const date = document.getElementById("date");
  const language = document.getElementById("language");
  const hotel = document.querySelector('[name="hotel_name"]');

  /* =========================
     PARTICIPANTS
  ========================= */
  const fullNameInput = document.querySelector('input[name="name"]');
  const participantsContainer = document.getElementById("participantsContainer");
  const addParticipantBtn = document.querySelector(".add-participant-btn");

  function populateBirthYears(selectEl) {
    const currentYear = new Date().getFullYear();
    for (let y = currentYear - 5; y >= 1900; y--) {
      const opt = document.createElement("option");
      opt.value = y;
      opt.textContent = y;
      selectEl.appendChild(opt);
    }
  }

  document.querySelectorAll(".participant-birthyear").forEach(populateBirthYears);

  const primaryParticipantName =
    document.querySelector(".participant-row.primary .participant-name");

  if (fullNameInput && primaryParticipantName) {
    fullNameInput.addEventListener("input", () => {
      primaryParticipantName.value = fullNameInput.value;
    });
  }

  function createParticipantRow() {
    const row = document.createElement("div");
    row.className = "participant-row";

    row.innerHTML = `
      <div class="participant-field">
        <input type="text" class="participant-name" placeholder="Full name" required>
      </div>
      <div class="participant-field">
        <select class="participant-nationality" required>
          <option value="" disabled selected>Nationality</option>
          <option value="TR">Turkey</option>
          <option value="US">United States</option>
          <option value="UK">United Kingdom</option>
          <option value="DE">Germany</option>
          <option value="FR">France</option>
        </select>
      </div>
      <div class="participant-field">
        <select class="participant-birthyear" required>
          <option value="" disabled selected>Birth Year</option>
        </select>
      </div>
      <button type="button" class="remove-participant">×</button>
    `;

    populateBirthYears(row.querySelector(".participant-birthyear"));

    row.querySelector(".remove-participant")
      .addEventListener("click", () => row.remove());

    return row;
  }

  if (addParticipantBtn && participantsContainer) {
    addParticipantBtn.addEventListener("click", () => {
      participantsContainer.appendChild(createParticipantRow());
    });
  }


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

  /* =========================
     MOBILITY
  ========================= */
  const mobilityToggle = document.getElementById("mobilityToggle");
  const mobilityGroup = document.getElementById("mobilityGroup");

  if (mobilityToggle && mobilityGroup) {
    mobilityToggle.addEventListener("change", () => {
      mobilityGroup.classList.toggle("active", mobilityToggle.checked);
    });
  }

 const form = document.getElementById("guideTourForm");

if (form) {
  form.addEventListener("submit", async function (e) {
    e.preventDefault();

    /* =========================
       BASIC VALIDATION
    ========================= */
    const requiredFields = form.querySelectorAll("[required]");
    let isValid = true;

    requiredFields.forEach(field => {
      if (!field.value.trim()) {
        field.classList.add("error");
        isValid = false;
      } else {
        field.classList.remove("error");
      }
    });

    if (!isValid) {
      alert("Please fill in all required fields.");
      return;
    }

    /* =========================
       PARTICIPANTS
    ========================= */
    const participants = [];
    document.querySelectorAll(".participant-row").forEach(row => {
      participants.push({
        name: row.querySelector(".participant-name")?.value.trim() || "",
        nationality: row.querySelector(".participant-nationality")?.value || "",
        birthYear: row.querySelector(".participant-birthyear")?.value || ""
      });
    });

    /* =========================
       PAYLOAD
    ========================= */
    const payload = {
      tour_name: tourName,
      full_name: document.querySelector('[name="name"]')?.value || "",
      email: document.querySelector('[name="email"]')?.value || "",
      phone: iti ? iti.getNumber() : "",
      tour_date: document.querySelector('[name="date"]')?.value || "",
      language: document.getElementById("language")?.value || "",
      transportation:
        document.querySelector('input[name="transportation"]:checked')?.value || "",
      hotel:
        (document.querySelector('[name="hotel_name"]')?.value || "") +
        (document.querySelector('[name="room_number"]')?.value
          ? " / Room: " + document.querySelector('[name="room_number"]').value
          : ""),
      notes: document.querySelector('[name="notes"]')?.value || "",
      participants
    };

    /* =========================
       SUBMIT
    ========================= */
    try {
      const res = await fetch(
        "https://script.google.com/macros/s/AKfycbxf2ogLE7U3uoib55DI3BHERQSxFM1zU1rEmydfI_rQFGPDVszVFvpbgj5XIML9aulf/exec",
        {
          method: "POST",
          body: JSON.stringify(payload)
        }
      );

      const data = await res.json();

      if (data.status === "success") {
        form.style.display = "none";
        document.getElementById("successScreen").style.display = "block";
        document.querySelector(".reservation-id").textContent =
          `Reservation ID: ${data.reservation_id}`;
      } else {
        alert("Something went wrong. Please try again.");
      }
    } catch (err) {
      console.error(err);
      alert("Connection error. Please try again.");
    }
  });
}

});
