    document.addEventListener("DOMContentLoaded", () => {
    
      /* URL → TOUR NAME */
      const params = new URLSearchParams(window.location.search);
      document.getElementById("tourName").value =
        params.get("tour") || "Private Guide Tour";

      const tourName = params.get("tour") || "Private Guide Tour";
      const fullNameInput = document.querySelector('input[name="name"]');
      const participantsContainer = document.getElementById('participantsContainer');
      const addParticipantBtn = document.querySelector('.add-participant-btn');
    
      const TOUR_EXPERIENCES = {
      "Old City Private Tour": `
        <strong>What you'll experience</strong>
        • Byzantine & Ottoman heritage with a licensed private guide<br>
        • Hagia Sophia, Blue Mosque & Grand Bazaar storytelling<br>
        • Hidden courtyards & local insights<br>
        • Walking or vehicle-assisted options
      `,
    
      "Bosphorus Experience": `
        <strong>What you'll experience</strong>
        • Scenic Bosphorus coastline narration<br>
        • Palaces, waterfront mansions & local life<br>
        • Relaxed, non-rushed private experience
      `,
    
      "Istanbul Food Tour": `
        <strong>What you'll experience</strong>
        • Authentic local flavors beyond tourist routes<br>
        • Street food & traditional restaurants<br>
        • Cultural stories behind Turkish cuisine
      `
    };
  
    document.getElementById("tourFormTitle").textContent = tourName;
    document.getElementById("tourName").value = tourName;
    
    document.getElementById("tourExperience").innerHTML =
      TOUR_EXPERIENCES[tourName] || "";
    
      const transportGroup = document.getElementById("transportationGroup");
            if (tourName === "Old City Private Tour"){}
    
            else {
      // Food tour vs
      transportGroup.style.display = "none";
    }
    
    
      /* PHONE */
      const iti = intlTelInput(phone, {
  initialCountry: "us",
  separateDialCode: true,
  utilsScript:
    "https://cdn.jsdelivr.net/npm/intl-tel-input@19.5.4/build/js/utils.js"
});
    
      /* DATE PICKER */
      const dateInput = document.getElementById("date");
      let lastInteractionWasKeyboard = false;
    
      const datePicker = flatpickr(dateInput, {
        minDate: "today",
        dateFormat: "Y-m-d",
        disableMobile: true,
        clickOpens: false
      });
    
      document.addEventListener("keydown", e => {
        if (e.key === "Tab") lastInteractionWasKeyboard = true;
      });
    
      document.addEventListener("mousedown", () => {
        lastInteractionWasKeyboard = false;
      });
    
      dateInput.addEventListener("focus", () => {
        if (lastInteractionWasKeyboard && !datePicker.isOpen) {
          datePicker.open();
        }
      });
    
      dateInput.addEventListener("click", e => {
        e.stopPropagation();
        datePicker.isOpen ? datePicker.close() : datePicker.open();
      });
    
      document.addEventListener("click", e => {
        if (
          datePicker.isOpen &&
          !dateInput.contains(e.target) &&
          !datePicker.calendarContainer.contains(e.target)
        ) {
          datePicker.close();
        }
      });
    
      /* BIRTH YEARS */
      function populateBirthYears(selectEl) {
        const currentYear = new Date().getFullYear();
        for (let y = currentYear - 5; y >= 1900; y--) {
          const opt = document.createElement("option");
          opt.value = y;
          opt.textContent = y;
          selectEl.appendChild(opt);
        }
      }
    
      populateBirthYears(
        document.querySelector(".participant-birthyear")
      );
    
      /* PRIMARY PARTICIPANT NAME SYNC */
      const primaryParticipantName =
        document.querySelector(".participant-row.primary .participant-name");
    
      fullNameInput.addEventListener("input", () => {
        primaryParticipantName.value = fullNameInput.value;
      });
    
      /* ADD / REMOVE PARTICIPANT */
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
    
        populateBirthYears(
          row.querySelector(".participant-birthyear")
        );
    
        row.querySelector(".remove-participant")
          .addEventListener("click", () => row.remove());
    
        return row;
      }
    
      addParticipantBtn.addEventListener("click", () => {
        participantsContainer.appendChild(createParticipantRow());
      });
    
      /* TEXTAREA COUNTS */
      document.querySelectorAll(".textarea-group textarea").forEach(textarea => {
        const counter = textarea.parentElement.querySelector(".char-count");
        textarea.addEventListener("input", () => {
          counter.textContent =
            `${textarea.value.length} / ${counter.dataset.max}`;
        });
      });
    
      /* MOBILITY */
      const mobilityToggle = document.getElementById("mobilityToggle");
      const mobilityGroup = document.getElementById("mobilityGroup");
    
      mobilityToggle.addEventListener("change", () => {
        mobilityGroup.classList.toggle("active", mobilityToggle.checked);
      });
    
    document.getElementById("guideTourForm").addEventListener("submit", function (e) {
      e.preventDefault();
    
      const participants = [];
      document.querySelectorAll(".participant-row").forEach(row => {
        participants.push({
          name: row.querySelector(".participant-name").value.trim(),
          nationality: row.querySelector(".participant-nationality").value,
          birthYear: row.querySelector(".participant-birthyear").value
        });
      });
    
      const payload = {
        tour_name: document.getElementById("tourName").value,
        full_name: document.querySelector('[name="name"]').value,
        email: document.querySelector('[name="email"]').value,
        phone: iti.getNumber(),
        tour_date: document.querySelector('[name="date"]').value,
        language: document.getElementById("language").value,
        transportation: document.querySelector('input[name="transportation"]:checked')?.value || "",
        hotel: document.querySelector('[name="hotel_name"]').value +
               (document.querySelector('[name="room_number"]').value
                 ? " / Room: " + document.querySelector('[name="room_number"]').value
                 : ""),
        mobility: document.getElementById("mobilityToggle").checked ? "Yes" : "No",
        notes: document.querySelector('[name="notes"]').value,
        participants: participants
      };
    
      fetch("https://script.google.com/macros/s/AKfycbxf2ogLE7U3uoib55DI3BHERQSxFM1zU1rEmydfI_rQFGPDVszVFvpbgj5XIML9aulf/exec", {
        method: "POST",
        body: JSON.stringify(payload)
      })
      .then(res => res.json())
      .then(res => {
        if (res.status === "success") {
          document.getElementById("guideTourForm").style.display = "none";
          document.getElementById("successScreen").style.display = "block";
          document.querySelector(".reservation-id").textContent =
            `Reservation ID: ${res.reservation_id}`;
        }
      });
    });
    });
