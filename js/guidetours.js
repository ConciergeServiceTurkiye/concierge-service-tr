document.addEventListener("DOMContentLoaded", () => {

  /* =========================
     TOUR NAME FROM URL
  ========================= */
  const params = new URLSearchParams(window.location.search);
let tourName = "Private Guide Tour";

if (isFormPage) {
  const params = new URLSearchParams(window.location.search);
  const urlTour = params.get("tour");

  if (urlTour) {
    tourName = decodeURIComponent(urlTour.replace(/\+/g, " "));
  }
}

  const isFormPage = document.body.classList.contains("tour-form-page");


  const tourNameInput = document.getElementById("tourName");
  const tourFormTitle = document.getElementById("tourFormTitle");
  const tourExperienceBox = document.getElementById("tourExperience");

  if (tourNameInput) tourNameInput.value = tourName;
  if (tourFormTitle) tourFormTitle.textContent = tourName;

  const TOUR_EXPERIENCES = {
    "Old City Private Tour": `
      <strong>What you'll experience</strong><br>
      • Byzantine & Ottoman heritage with a licensed private guide<br>
      • Hagia Sophia, Blue Mosque & Grand Bazaar storytelling<br>
      • Hidden courtyards & local insights<br>
      • Walking or vehicle-assisted options
    `,

    "Istanbul Highlights Tour": '..1111.',
    
    "Bosphorus Shore Experience": `
      <strong>What you'll experience</strong><br>
      • Scenic Bosphorus coastline narration<br>
      • Palaces, waterfront mansions & local life<br>
      • Relaxed, non-rushed private experience
    `,
    "Street Food Discovery": `
      <strong>What you'll experience</strong><br>
      • Authentic local flavors beyond tourist routes<br>
      • Street food & traditional restaurants<br>
      • Cultural stories behind Turkish cuisine
    `,
    "Turkish Cuisine Experience": `..222.`,

    "Asian Side Tour": '...333'
  };

  if (tourExperienceBox) {
    tourExperienceBox.innerHTML = TOUR_EXPERIENCES[tourName] || "";
  }

  /* =========================
     TRANSPORTATION VISIBILITY
  ========================= */
  const TRANSPORT_TOURS = [
  "Old City Private Tour",
  "Istanbul Highlights Tour",
  "Bosphorus Shore Experience"
];

if (transportGroup && !TRANSPORT_TOURS.includes(tourName)) {
  transportGroup.style.display = "none";
}


  /* =========================
     PHONE INPUT
  ========================= */
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

  /* =========================
     DATE PICKER
  ========================= */
  const dateInput = document.getElementById("date");
  if (dateInput) {
    const datePicker = flatpickr(dateInput, {
      minDate: "today",
      dateFormat: "Y-m-d",
      disableMobile: true
    });
  }

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

  /* =========================
     FORM SUBMIT
  ========================= */
  const form = document.getElementById("guideTourForm");

  if (form) {
    form.addEventListener("submit", e => {
      e.preventDefault();

      const participants = [];
      document.querySelectorAll(".participant-row").forEach(row => {
        participants.push({
          name: row.querySelector(".participant-name")?.value.trim() || "",
          nationality: row.querySelector(".participant-nationality")?.value || "",
          birthYear: row.querySelector(".participant-birthyear")?.value || ""
        });
      });

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
        mobility: mobilityToggle?.checked ? "Yes" : "No",
        notes: document.querySelector('[name="notes"]')?.value || "",
        participants: participants
      };

      fetch("https://script.google.com/macros/s/AKfycbxf2ogLE7U3uoib55DI3BHERQSxFM1zU1rEmydfI_rQFGPDVszVFvpbgj5XIML9aulf/exec", {
        method: "POST",
        body: JSON.stringify(payload)
      })
        .then(res => res.json())
        .then(res => {
          if (res.status === "success") {
            form.style.display = "none";
            document.getElementById("successScreen").style.display = "block";
            document.querySelector(".reservation-id").textContent =
              `Reservation ID: ${res.reservation_id}`;
          }
        });
    });
  }
  /* =========================
   TOUR FILTERS
========================= */
const filterButtons = document.querySelectorAll(".filter-btn");
const tourCards = document.querySelectorAll(".tour-card");

filterButtons.forEach(btn => {
  btn.addEventListener("click", () => {

    // active class
    filterButtons.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");

    const filter = btn.dataset.filter;

    tourCards.forEach(card => {
  if (filter === "all") {
    card.style.display = "";
  } else {
    card.style.display = card.classList.contains(filter)
      ? ""
      : "none";
  }
});
  });
});


});







