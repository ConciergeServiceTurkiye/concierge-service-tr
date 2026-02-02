document.addEventListener("DOMContentLoaded", () => {

 /* ============================== HELPERS – FIELD ERRORS ============================== */

function showFieldError(el, message) {
  const wrapper = el.closest(".field-wrapper");
  if (!wrapper) return;

  let error = wrapper.querySelector(".field-error");

  if (!error) {
    error = document.createElement("div");
    error.className = "field-error";
    wrapper.prepend(error); // input/select üstüne error ekler
  }

  error.textContent = message;
  wrapper.classList.add("has-error");
}

function hideFieldError(el) {
  const wrapper = el.closest(".field-wrapper");
  if (!wrapper) return;

  wrapper.querySelector(".field-error")?.remove();
  wrapper.classList.remove("has-error");
}

function scrollToFirstError() {
  const firstError = document.querySelector(".field-wrapper.has-error");
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

 /* ===================== PARTICIPANTS STATE ===================== */

const participants = [];
const MAX_VISIBLE_PARTICIPANTS = 4;

const nameInput = document.getElementById("participantNameInput");
const natInput = document.getElementById("participantNationalityInput");
const natTrigger = document.querySelector(".nationality-trigger");
const yearInput = document.getElementById("participantBirthYearInput");

const addBtn = document.getElementById("addParticipantBtn");
const listContainer = document.getElementById("participantsList");
const showAllBtn = document.getElementById("showAllParticipants");


 (function populateBirthYears() {
  const currentYear = new Date().getFullYear();
  for (let y = currentYear - 5; y >= 1900; y--) {
    const opt = document.createElement("option");
    opt.value = y;
    opt.textContent = y;
    yearInput.appendChild(opt);
  }
})();

 addBtn.addEventListener("click", () => {
  const name = nameInput.value.trim();
  const nationality = natTrigger.textContent;
  const nationalityCode = natInput.value;
  const year = yearInput.value;

  if (!name || !nationalityCode || !year) {
    alert("Please fill full name, nationality and birth year");
    return;
  }

  participants.push({
    name,
    nationality,
    year
  });

  nameInput.value = "";
  natInput.value = "";
  natTrigger.textContent = "Select nationality";
  yearInput.value = "";

  renderParticipants();
});


 function renderParticipants() {
  listContainer.innerHTML = "";

  participants.slice(0, MAX_VISIBLE_PARTICIPANTS).forEach((p, index) => {
    listContainer.appendChild(createParticipantItem(p, index));
  });

  showAllBtn.style.display =
    participants.length > MAX_VISIBLE_PARTICIPANTS
      ? "block"
      : "none";
}


 function createParticipantItem(p, index) {
  const div = document.createElement("div");
  div.className = "participant-item";

  div.innerHTML = `
    <span>${index + 1}- ${p.name} ${p.nationality} ${p.year}</span>
    <div class="participant-actions">
      <button class="edit">✏️</button>
      <button class="delete">❌</button>
    </div>
  `;

  div.querySelector(".delete").addEventListener("click", () => {
    participants.splice(index, 1);
    renderParticipants();
    if (participantsModal.classList.contains("active")) {
  renderModalParticipants();
}
  });

  return div;
}


const participantsModal = document.getElementById("participantsModal");
const participantsModalList = document.getElementById("modalParticipantsList");
const participantsModalClose =
  participantsModal.querySelector(".modal-close");

if (participantsModalClose) {
  participantsModalClose.addEventListener("click", () => {
    participantsModal.classList.remove("active");
  });
}


showAllBtn.addEventListener("click", () => {
  participantsModal.classList.add("active");
  renderModalParticipants();
});


 participantsModalClose.addEventListener("click", () => {
  participantsModal.classList.remove("active");
});



 function renderModalParticipants() {
  participantsModalList.innerHTML = "";


  participants.forEach((p, index) => {
    participantsModalList.appendChild(createParticipantItem(p, index));
  });
}
 

  /* ============================== LIVE ERROR CLEARING ============================== */

function bindLiveValidation(form) {
  const fields = form.querySelectorAll("input, select, textarea");

  fields.forEach(field => {
    // Yazmaya başladığında hata temizle
    field.addEventListener("input", () => {
      hideFieldError(field);
    });

    // Select / date gibi alanlar için change desteği
    field.addEventListener("change", () => {
      if (field.value && field.value.trim()) {
        hideFieldError(field);
      }
    });
  });
}


  const EMAIL_REGEX =
  /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  
  /* ============================== TOUR NAME & EXPERIENCE ============================== */

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
<span class="experience-link" data-experience="courtyards">Hidden courtyards</span> & local insights
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


/* ============================== EXPERIENCE MODAL DATA ============================== */
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

/* ============================== MODAL ENGINE ============================== */
const modal = document.getElementById("experienceModal");
const modalImg = document.getElementById("experienceImg");
const modalTitle = document.getElementById("experienceTitle");
const modalDesc = document.getElementById("experienceDesc");

  let scrollY = 0;

function openExperience(key) {
  const data = EXPERIENCE_DATA[key];
  if (!data) return;

  scrollY = window.scrollY;

  modalImg.src = data.img;
  modalTitle.textContent = data.title;
  modalDesc.textContent = data.desc;

  document.body.style.top = `-${scrollY}px`;
  document.body.classList.add("modal-open");

  modal.classList.add("active");
}

function closeExperience() {
  modal.classList.remove("active");
  document.body.classList.remove("modal-open");
  document.body.style.top = "";

  window.scrollTo(0, scrollY);
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

  
 /* ========================= PHONE INPUT ========================= */
 const phoneInput = document.getElementById("phone");
let iti = null;

if (phoneInput) {

  iti = intlTelInput(phoneInput, {
    initialCountry: "us",
    separateDialCode: true,
    nationalMode: false,
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

/* ========================= LANGUAGE ========================= */
document.querySelectorAll(".custom-select").forEach(select => {
  const trigger = select.querySelector(".select-trigger");
  const hidden = select.querySelector("input[type=hidden]");
  const optionsList = select.querySelector(".select-options");
  const options = Array.from(optionsList.querySelectorAll("li"));

  let currentIndex = -1;

  // alfabetik sırala
  options.sort((a, b) =>
    a.textContent.trim().localeCompare(b.textContent.trim())
  );
  optionsList.innerHTML = "";
  options.forEach(opt => optionsList.appendChild(opt));

  function open() {
    select.classList.add("open");
  }

  function close() {
    select.classList.remove("open");
    currentIndex = -1;
    options.forEach(o => o.classList.remove("active"));
  }

  // focus ile aç
  // focus ile aç (SADECE keyboard için)
trigger.addEventListener("focus", e => {
  if (e.relatedTarget && e.relatedTarget.tagName === "LI") return;
});

  // mouse click (blink fix)
  trigger.addEventListener("click", e => {
    e.preventDefault();
    e.stopPropagation();
    select.classList.contains("open") ? close() : open();
  });

  // keyboard navigation
  trigger.addEventListener("keydown", e => {
    if (!select.classList.contains("open") && ["ArrowDown", "ArrowUp", "Enter", " "].includes(e.key)) {
      e.preventDefault();
      open();
      currentIndex = 0;
    }

    if (!select.classList.contains("open")) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      currentIndex = (currentIndex + 1) % options.length;
    }

    if (e.key === "ArrowUp") {
      e.preventDefault();
      currentIndex = (currentIndex - 1 + options.length) % options.length;
    }

    if (e.key === "Enter") {
      e.preventDefault();
      const opt = options[currentIndex];
      if (!opt) return;

      trigger.textContent = opt.textContent;
      hidden.value = opt.textContent;
      select.classList.add("has-value");
      close();
      trigger.focus();
      return;
    }

    if (e.key === "Escape") {
      e.preventDefault();
      close();
      trigger.focus();
      return;
    }

    options.forEach(o => o.classList.remove("active"));
    if (currentIndex >= 0) {
      options[currentIndex].classList.add("active");
      options[currentIndex].scrollIntoView({ block: "nearest" });
    }
  });

  // option click
  options.forEach(option => {
    option.addEventListener("click", e => {
      e.stopPropagation();
      trigger.textContent = option.textContent;
      hidden.value = option.textContent;
      select.classList.add("has-value");
      close();
      trigger.focus();
    });
  });

  // dışarı tık
  document.addEventListener("click", e => {
  if (
    !select.contains(e.target) &&
    !e.target.closest(".select-options")
  ) {
    close();
  }
});

  // tab ile çıkınca kapat
  select.addEventListener("focusout", () => {
    setTimeout(() => {
      if (!select.contains(document.activeElement)) close();
    }, 10);
  });
});
  
  /* ============================== FIELD REFERENCES ============================== */

  const fullName = document.querySelector('[name="name"]');
  const email = document.querySelector('[name="email"]');
  const date = document.getElementById("date");
  const hotel = document.querySelector('[name="hotel_name"]');

  
  /* ========================= MOBILITY ========================= */
  const mobilityToggle = document.getElementById("mobilityToggle");
  const mobilityGroup = document.getElementById("mobilityGroup");

  if (mobilityToggle && mobilityGroup) {
    mobilityToggle.addEventListener("change", () => {
      mobilityGroup.classList.toggle("active", mobilityToggle.checked);
    });
  }

 const form = document.getElementById("guideTourForm");

  if (form) {
  bindLiveValidation(form);
}

if (form) {
form.addEventListener("submit", async function (e) {
  e.preventDefault();

  form.querySelectorAll(".has-error").forEach(el => {
  el.classList.remove("has-error");
  el.querySelector(".field-error")?.remove();
});

  let isValid = true;
  let firstErrorField = null;

  hideInlineAlert();

  /* REQUIRED */
  const requiredFields = form.querySelectorAll(
  "input[required]:not(#phone):not([name='email']), textarea[required], select[required]"
);
  requiredFields.forEach(field => {
    if (!field.value.trim()) {
      showFieldError(field, "This field is required");
      if (!firstErrorField) firstErrorField = field;
      isValid = false;
    }
  });

 /* EMAIL */
const emailField = form.querySelector('[name="email"]');
if (emailField) {
  const emailValue = emailField.value.trim();

  if (!emailValue) {
    showFieldError(emailField, "This field is required");
    if (!firstErrorField) firstErrorField = emailField;
    isValid = false;
  } else if (!EMAIL_REGEX.test(emailValue)) {
    showFieldError(emailField, "Please enter a valid email address");
    if (!firstErrorField) firstErrorField = emailField;
    isValid = false;
  }
}

  /* PHONE */
if (phoneInput) {
  if (!iti || !iti.getNumber()) {
    showFieldError(phoneInput, "This field is required");
    if (!firstErrorField) firstErrorField = phoneInput;
    isValid = false;
  } else if (!iti.isValidNumber()) {
    showFieldError(phoneInput, "Please enter a valid phone number");
    if (!firstErrorField) firstErrorField = phoneInput;
    isValid = false;
  }
}
 
  /* MOBILITY */
  const mobilityTextarea = document.querySelector(
    'textarea[name="mobility_details"]'
  );
  if (mobilityToggle?.checked && !mobilityTextarea.value.trim()) {
    showFieldError(
      mobilityTextarea,
      "Please describe mobility assistance needs"
    );
    if (!firstErrorField) firstErrorField = mobilityTextarea;
    isValid = false;
  }
 /* ================= TRANSPORTATION REQUIRED ================= */

const transportationChecked = Array.from(
  document.querySelectorAll('input[name="transportation"]')
).some(cb => cb.checked);

if (!transportationChecked) {
  const transportWrapper =
  document.querySelector("#transportationGroup .field-wrapper");
 const fakeInput = transportWrapper.querySelector("input");

 showFieldError(
  fakeInput,
  "Please select a transportation option"
);

  isValid = false;
}


  /* FINAL DECISION */
  if (!isValid) {
    showInlineAlert("Please review the highlighted fields below.");
    if (firstErrorField) {
      firstErrorField.scrollIntoView({ behavior: "smooth", block: "center" });
    }
    return;
  }

  /* PAYLOAD (BEN KOYDUM) */
  const payload = {
    tour_name: tourName,
    full_name: document.querySelector('[name="name"]')?.value || "",
    email: document.querySelector('[name="email"]')?.value || "",
    phone: iti ? iti.getNumber() : "",
    tour_date: document.querySelector('[name="date"]')?.value || "",
    language: document.querySelector('[name="language"]')?.value || "",
    hotel: document.querySelector('[name="hotel_name"]')?.value || "",
    notes: document.querySelector('[name="notes"]')?.value || ""
  };

 payload.participants = participants;


  
  /* FETCH — SENİN URL */
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
  };
});
  }
 /* ================= TRANSPORTATION – SINGLE SELECTION ================= */

const transportCheckboxes = document.querySelectorAll(
  'input[name="transportation"]'
);

transportCheckboxes.forEach(cb => {
  cb.addEventListener("change", () => {
    if (cb.checked) {
      transportCheckboxes.forEach(other => {
        if (other !== cb) other.checked = false;
      });
    }
  });
});
});
  
