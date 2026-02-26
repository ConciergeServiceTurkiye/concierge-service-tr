document.addEventListener("DOMContentLoaded", () => {

 /* ============================== HELPERS – FIELD ERRORS ============================== */

function showFieldError(el, message) {
  const wrapper = el.closest(".field-wrapper");
  if (!wrapper) {
  el.classList.add("has-error");
  return;
}

  let error = wrapper.querySelector(".field-error");

  if (!error) {
    error = document.createElement("div");
    error.className = "field-error";
    wrapper.appendChild(error); // input/select altına error ekler
  }

  error.textContent = message;
  wrapper.classList.remove("has-error");
void wrapper.offsetWidth; // reflow hack
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
  alert.style.display = "block"; // Kutuyu görünür yapar ve boşluğu açar
  scrollToFirstError();
}

function hideInlineAlert() {
  const alert = document.getElementById("formInlineAlert");
  alert.style.display = "none"; // Kutuyu ve boşluğu tamamen gizler
}

/* ===================== PARTICIPANTS STATE (NEW SYSTEM) ===================== */

const participants = [];
let editMode = false;
let editingId = null;
let originalData = null;

const nameInput = document.getElementById("participantNameInput");
const natInput = document.getElementById("participantNationalityInput");
const natTrigger = document.querySelector(".nationality-trigger");
const yearInput = document.getElementById("participantBirthYearInput");
const participantsSection = document.getElementById("participantsSection");
const listContainer = document.getElementById("participantsList");
const addBtn = document.getElementById("addParticipantBtn");

let confirmBtn = null;
let cancelBtn = null;

const addParticipantBtn = document.getElementById("addParticipantBtn");

addParticipantBtn.addEventListener("click", function(e) {
  e.preventDefault();
  addParticipant();
});

 
/* ADD */
function addParticipant() {

  if (!nameInput.value.trim()) return;

  participants.push({
    id: crypto.randomUUID(),
    name: nameInput.value.trim(),
    nationality: natTrigger.querySelector(".current")?.textContent.trim() || "",
    year: yearInput.value
  });

  renderParticipants();
  resetParticipantInputs();
}
 
 function resetParticipantInputs() {
  nameInput.value = "";
  natInput.value = "";
  yearInput.value = "";

  const natTriggerEl = document.querySelector(".nationality-trigger");
  natTriggerEl.innerHTML = `<span class="current">Select nationality</span>`;
  natTriggerEl.closest(".nationality-select")?.classList.remove("has-value");

  const yearTrigger = document.querySelector(".birthyear-trigger");
  yearTrigger.textContent = "Birth year";
  yearTrigger.classList.remove("has-value");
}

/* RENDER */
function renderParticipants() {
  listContainer.innerHTML = "";

  if (participants.length === 0) {
    participantsSection.style.display = "none";
    return;
  }

  participantsSection.style.display = "block";

  participants.forEach(p => {
    const chip = document.createElement("div");
    chip.className = "participant-chip";

    const link = document.createElement("span");
    link.className = "participant-link";
    link.textContent = p.name;
    link.title = "Edit participant";

    const remove = document.createElement("span");
    remove.className = "participant-remove";
    remove.textContent = "×";
    remove.title = "Remove participant";

    /* REMOVE */
    remove.addEventListener("click", () => {

  if (editMode) return;
  if (participants.length <= 1) return;

  const index = participants.findIndex(x => x.id === p.id);
  if (index === -1) return;

  participants.splice(index, 1);

  renderParticipants();
});

    /* EDIT */
    link.addEventListener("click", () => {
      if (editMode) return;

      editMode = true;
      editingId = p.id;
      originalData = { ...p };

      nameInput.value = p.name;
      natTrigger.innerHTML = `<span class="current">${p.nationality}</span>`;
      natInput.value = p.nationality;
      yearInput.value = p.year;

      document.querySelector(".birthyear-trigger").textContent = p.year;

      addBtn.style.display = "none";

      createEditControls();
      disableParticipantsUI();
      checkForChanges();
    });

    chip.appendChild(link);
    chip.appendChild(remove);
    listContainer.appendChild(chip);
  });
}

/* DISABLE LIST */
function disableParticipantsUI() {
  listContainer.classList.add("participants-disabled");
}

function enableParticipantsUI() {
  listContainer.classList.remove("participants-disabled");
}

/* EDIT CONTROLS */
function createEditControls() {
  const container = document.querySelector(".participant-input-row");

  const controls = document.createElement("div");
  controls.className = "edit-controls";

  confirmBtn = document.createElement("button");
  confirmBtn.className = "confirm-btn";
  confirmBtn.innerHTML = "✓";
  confirmBtn.title = "Confirm";
  confirmBtn.disabled = true;

  cancelBtn = document.createElement("button");
  cancelBtn.className = "cancel-btn";
  cancelBtn.innerHTML = "×";
  cancelBtn.title = "Cancel";

  controls.appendChild(confirmBtn);
  controls.appendChild(cancelBtn);

  container.appendChild(controls);

  confirmBtn.addEventListener("click", confirmEdit);
  cancelBtn.addEventListener("click", cancelEdit);
}

/* CHECK CHANGES */
function checkForChanges() {

  // 🔒 Edit modda değilsek hiçbir şey yapma
  if (!editMode || !originalData || !confirmBtn) return;

  const current = {
    name: nameInput.value.trim(),
    nationality: natTrigger.querySelector(".current")?.textContent.trim() || "",
    year: yearInput.value
  };

  const changed =
    current.name !== originalData.name ||
    current.nationality !== originalData.nationality ||
    current.year !== originalData.year;

  confirmBtn.disabled = !changed;
}

// Name
nameInput.addEventListener("input", checkForChanges);

// Year
yearInput.addEventListener("input", checkForChanges);
yearInput.addEventListener("change", checkForChanges);


natTrigger.addEventListener("click", () => {
  setTimeout(checkForChanges, 50);
});


/* CONFIRM */
function confirmEdit() {
  const index = participants.findIndex(x => x.id === editingId);
  if (index === -1) return;

  participants[index] = {
    id: editingId,
    name: nameInput.value.trim(),
    nationality: natTrigger.textContent.trim(),
    year: yearInput.value
  };

  exitEditMode();
  renderParticipants();
  resetParticipantInputs();
}

/* CANCEL */
function cancelEdit() {
  exitEditMode();
  resetParticipantInputs();
}

/* EXIT */
function exitEditMode() {
  editMode = false;
  editingId = null;
  originalData = null;

  document.querySelector(".edit-controls")?.remove();
  addBtn.style.display = "block";
  enableParticipantsUI();
}

/* ADD CLICK */
addBtn.addEventListener("click", addParticipant);

 
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

/* ============================== NATIONALITY DROPDOWN ============================== */

const COUNTRY_LIST = window.intlTelInputGlobals.getCountryData();

function initNationalityDropdown(container) {
  const trigger = container.querySelector(".nationality-trigger");
  const dropdown = container.querySelector(".nationality-dropdown");
  const searchInput = container.querySelector(".nationality-search");
  const hiddenInput = container.querySelector("#participantNationalityInput");

  if (!trigger || !dropdown || !hiddenInput) return;

  let activeIndex = -1;

  /* 🔒 search TAB zincirinden çık */
  if (searchInput) searchInput.setAttribute("tabindex", "-1");

  dropdown.innerHTML = "";

  /* ---------- OPTIONS ---------- */

  COUNTRY_LIST.forEach(c => {
    const option = document.createElement("div");
    option.className = "nationality-option";
    option.dataset.value = c.iso2.toUpperCase();
    option.dataset.label = c.name;

    option.innerHTML = `
      <img src="https://flagcdn.com/w20/${c.iso2}.png" alt="">
      <span>${c.name}</span>
    `;

    option.addEventListener("mousedown", e => {
  e.preventDefault();
  e.stopPropagation();
  selectOption(option);
});

    dropdown.appendChild(option);
  });

  function visibleOptions() {
    return Array.from(dropdown.querySelectorAll(".nationality-option"))
      .filter(o => o.style.display !== "none");
  }

  function clearActive() {
    dropdown.querySelectorAll(".active")
      .forEach(o => o.classList.remove("active"));
  }

  function setActive(index) {
    const opts = visibleOptions();
    if (!opts.length) return;

    clearActive();
    activeIndex = index;
    opts[activeIndex].classList.add("active");
    opts[activeIndex].scrollIntoView({ block: "nearest" });
  }

  function open() {
    container.classList.add("open");
    activeIndex = -1;
    clearActive();
  }

  function close() {
    container.classList.remove("open");
    activeIndex = -1;
    clearActive();
    if (searchInput) searchInput.value = "";
    filter("");
  }

  function selectOption(option) {
  trigger.innerHTML = `<span class="current">${option.dataset.label}</span>`;
  hiddenInput.value = option.dataset.value;
  container.classList.add("has-value");
  close();
  trigger.focus();
     hideFieldError(trigger);

  // 🔥 EDIT MODE için değişim kontrolü
  if (editMode) {
    checkForChanges();
  }
}

  /* ---------- SEARCH ---------- */

  function filter(term) {
    dropdown.querySelectorAll(".nationality-option").forEach(opt => {
      opt.style.display = opt.dataset.label
        .toLowerCase()
        .includes(term.toLowerCase())
        ? "flex"
        : "none";
    });
  }

  if (searchInput) {
    searchInput.addEventListener("input", e => {
      filter(e.target.value);
      activeIndex = -1;
      clearActive();
    });
  }

  /* ---------- EVENTS ---------- */

  /* MOUSE – SADECE AÇ */
  trigger.addEventListener("click", e => {
    e.stopPropagation();
    open();
  });

  /* TAB ile gelince AÇ */
  trigger.addEventListener("focus", open);

  trigger.addEventListener("keydown", e => {
    const opts = visibleOptions();

    /* TAB / SHIFT+TAB → KAPAT */
    if (e.key === "Tab") {
      close();
      return;
    }

    /* ESC */
    if (e.key === "Escape") {
      e.preventDefault();
      close();
      return;
    }

    /* HARF → SEARCH */
    if (/^[a-zA-Z]$/.test(e.key) && searchInput) {
      e.preventDefault();
      open();
      searchInput.value += e.key;
      filter(searchInput.value);
      return;
    }

    if (!container.classList.contains("open")) open();

    /* OK TUŞLARI */
    if (["ArrowDown", "ArrowUp"].includes(e.key)) {
      e.preventDefault();
      if (!opts.length) return;

      activeIndex =
        e.key === "ArrowDown"
          ? (activeIndex + 1) % opts.length
          : (activeIndex - 1 + opts.length) % opts.length;

      setActive(activeIndex);
    }

    /* ENTER */
    /* ENTER */
if (e.key === "Enter" && activeIndex >= 0) {
  e.preventDefault();
  e.stopPropagation();
  selectOption(opts[activeIndex]);
  return; // 🔥 FORM TARAFINA ASLA GEÇMESİN
}
  });
}

/* FORM DIŞI TIK → KAPAT */
document.addEventListener("click", e => {
  // başka handler'lar zaten yönettiyse dokunma
  if (e.defaultPrevented) return;

  document.querySelectorAll(".nationality-select.open")
    .forEach(el => {
      if (!el.contains(e.target)) el.classList.remove("open");
    });
});


/* INIT */
document.querySelectorAll(".nationality-select")
  .forEach(initNationalityDropdown);

/* Placeholder */
document.querySelectorAll(".nationality-trigger").forEach(trigger => {
  if (!trigger.querySelector(".current")) {
    trigger.innerHTML = `<span class="current">Select nationality</span>`;
  }
});

/* ============================== BIRTH YEAR DROPDOWN ============================== */
function initBirthYearDropdown(container) {
  const trigger = container.querySelector(".birthyear-trigger");
  const dropdown = container.querySelector(".birthyear-dropdown");
  const hiddenInput = container.querySelector("#participantBirthYearInput");

  let options = [];
  let activeIndex = -1;
  let typedYear = "";
  let openedByMouse = false; // 👈 KRİTİK

  const currentYear = new Date().getFullYear();
  const minYear = currentYear - 100;

  dropdown.innerHTML = "";

  for (let y = currentYear; y >= minYear; y--) {
    const div = document.createElement("div");
    div.className = "birthyear-option";
    div.textContent = y;

    div.addEventListener("mousedown", e => {
      e.preventDefault();
      e.stopPropagation();
      selectOption(y);
    });

    dropdown.appendChild(div);
  }

  options = Array.from(dropdown.children);

  function open() {
    if (container.classList.contains("open")) return;
    container.classList.add("open");
    activeIndex = -1;
    clearActive();
  }

  function close() {
    container.classList.remove("open");
    activeIndex = -1;
    clearActive();
  }

  function clearActive() {
    options.forEach(o => o.classList.remove("active"));
  }

  function setActive(index) {
    clearActive();
    activeIndex = index;
    options[activeIndex].classList.add("active");
    options[activeIndex].scrollIntoView({ block: "nearest" });
  }

  function selectOption(value) {
  trigger.textContent = value;
  trigger.classList.add("has-value");
  hiddenInput.value = value;
  close();
     hideFieldError(trigger);

  setTimeout(() => trigger.focus(), 0);

  // 🔥 EDIT MODE değişim kontrolü
  if (editMode) {
    checkForChanges();
  }
}

  /* ================= KEYBOARD FOCUS (TAB) ================= */
  trigger.addEventListener("focus", e => {
    if (openedByMouse) {
      openedByMouse = false;
      return;
    }
    open();
  });

  /* ================= MOUSE ================= */
  trigger.addEventListener("mousedown", e => {
    e.preventDefault();
    openedByMouse = true;

    container.classList.contains("open") ? close() : open();
    trigger.focus();
  });

  /* ================= KEYBOARD ================= */
  trigger.addEventListener("keydown", e => {

    if (e.key === "Tab") {
      close();
      return;
    }

    if (/^\d$/.test(e.key)) {
      e.preventDefault();
      typedYear += e.key;

      if (typedYear.length === 4) {
        const index = options.findIndex(o => o.textContent === typedYear);
        if (index !== -1) selectOption(typedYear);
        typedYear = "";
      }

      clearTimeout(trigger._yearTimeout);
      trigger._yearTimeout = setTimeout(() => typedYear = "", 1000);
      return;
    }

    if (!container.classList.contains("open")) open();

    if (["ArrowDown", "ArrowUp"].includes(e.key)) {
      e.preventDefault();

      if (activeIndex === -1) {
        setActive(0);
        return;
      }

      setActive(
        e.key === "ArrowDown"
          ? (activeIndex + 1) % options.length
          : (activeIndex - 1 + options.length) % options.length
      );
    }

    if (e.key === "Enter" && activeIndex >= 0) {
  e.preventDefault();
  e.stopPropagation();
  e.stopImmediatePropagation(); // 🔒 ekstra sigorta
  selectOption(options[activeIndex].textContent);
  return;
}

    if (e.key === "Escape") {
      e.preventDefault();
      close();
    }
  });

  /* ================= OUTSIDE CLICK ================= */
  document.addEventListener("mousedown", e => {
    if (!container.contains(e.target)) close();
  });
}

document.querySelectorAll(".birthyear-select")
  .forEach(initBirthYearDropdown);

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
 // 🔥 Sadece rakam girişine izin ver
if (phoneInput) {
  phoneInput.addEventListener("input", function () {
    this.value = this.value.replace(/[^0-9]/g, "");
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

  function open() {
    select.classList.add("open");
    trigger.focus(); // Beyaz border'ın tetiklenmesi için odağı zorla
  }

  function close() {
    select.classList.remove("open");
    options.forEach(o => o.classList.remove("active"));
  }

  trigger.addEventListener("click", e => {
    e.preventDefault();
    e.stopPropagation();
    select.classList.contains("open") ? close() : open();
  });

 // KLAVYE İLE GELİNDİĞİNDE (TAB) OTOMATİK AÇILSIN
  trigger.addEventListener("focus", () => {
    open();
  });

  // OPSİYONEL: Tab ile çıkıldığında otomatik kapansın
  select.addEventListener("focusout", (e) => {
    // Eğer yeni odaklanan yer bu select kutusunun dışındaysa kapat
    if (!select.contains(e.relatedTarget)) {
      close();
    }
  });

  // SEÇİM YAPMA (MOUSE)
  options.forEach(option => {
    option.addEventListener("mousedown", e => {
      e.preventDefault();
      e.stopPropagation();
      
      trigger.textContent = option.textContent;
      hidden.value = option.textContent;
      
      select.classList.add("has-value");
      select.classList.remove("open"); // Kapatırken 'open' class'ını kaldırıyoruz
      trigger.focus();

      if (typeof hideFieldError === "function") {
        hideFieldError(trigger);
      }
    });
  });

  // Dışarı tıklandığında kapat
  document.addEventListener("mousedown", e => {
    if (!select.contains(e.target)) close();
  });

  // KLAVYE KONTROLLERİ (ESC, ENTER, SPACE, OK TUŞLARI)
  trigger.addEventListener("keydown", e => {
    const isOpen = select.classList.contains("open");
    
    // 1. ESC - Listeyi kapat ve sayfa zıplamasını engelle
    if (e.key === "Escape") {
      e.preventDefault();
      close();
      return;
    }

    // 2. ENTER veya SPACE - Kapalıysa aç, açıksa seç
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault(); // Sayfanın aşağı kaymasını (Space için) engeller
      if (!isOpen) {
        open();
      } else {
        const activeOption = options.find(o => o.classList.contains("active"));
        if (activeOption) {
          selectValue(activeOption);
        }
      }
      return;
    }

    // 3. AŞAĞI/YUKARI OK TUŞLARI - Listede gezinme
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault(); // Sayfanın scroll olmasını engeller
      if (!isOpen) open();

      const activeIndex = options.findIndex(o => o.classList.contains("active"));
      let nextIndex;

      if (e.key === "ArrowDown") {
        nextIndex = (activeIndex + 1) % options.length;
      } else {
        nextIndex = (activeIndex - 1 + options.length) % options.length;
      }

      options.forEach(o => o.classList.remove("active"));
      options[nextIndex].classList.add("active");
      
      // Liste çok uzunsa aktif elemanı görünür yap (Scroll takibi)
      options[nextIndex].scrollIntoView({ block: "nearest" });
    }
  });

  // Seçim işlemini merkezileştirelim (Kod tekrarını önlemek için)
  function selectValue(option) {
    trigger.textContent = option.textContent;
    hidden.value = option.textContent;
    select.classList.add("has-value");
    close();
    trigger.focus();
    if (typeof hideFieldError === "function") hideFieldError(trigger);
  }

  // Mouse seçimini de bu merkezi fonksiyona bağlayalım
  options.forEach(option => {
    option.addEventListener("mousedown", e => {
      e.preventDefault();
      e.stopPropagation();
      selectValue(option);
    });
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

 /* ============================== FORM SUBMISSION ============================== */
const form = document.getElementById("guideTourForm");

if (form) {
  bindLiveValidation(form);

  // Form gönderildiğinde çalışacak ASYNC fonksiyon
  form.addEventListener("submit", async function (e) {
    e.preventDefault();

    let isValid = true;
    let firstErrorField = null;
    const hasParticipants = participants.length > 0;

    hideInlineAlert();

    // 1. KATILIMCI VALIDASYONU (Eğer liste boşsa giriş alanlarını kontrol et)
    if (!hasParticipants) {
      if (!nameInput.value.trim()) {
        showFieldError(nameInput, "This field is required");
        if (!firstErrorField) firstErrorField = nameInput;
        isValid = false;
      }
      if (!natInput.value.trim()) {
        showFieldError(natTrigger, "This field is required");
        if (!firstErrorField) firstErrorField = natTrigger;
        isValid = false;
      }
      if (!yearInput.value.trim()) {
        const yearTrigger = document.querySelector(".birthyear-trigger");
        showFieldError(yearTrigger, "This field is required");
        if (!firstErrorField) firstErrorField = yearTrigger;
        isValid = false;
      }
    }

    // 2. GENEL ZORUNLU ALANLAR
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

    // 3. EMAIL VALIDASYONU
    const emailField = form.querySelector('[name="email"]');
    if (emailField) {
      const emailValue = emailField.value.trim();
      if (!emailValue) {
        showFieldError(emailField, "This field is required");
        isValid = false;
      } else if (!EMAIL_REGEX.test(emailValue)) {
        showFieldError(emailField, "Please enter a valid email address");
        isValid = false;
      }
    }

    // 4. TELEFON VALIDASYONU
    if (phoneInput) {
      if (!iti || !iti.getNumber()) {
        showFieldError(phoneInput, "This field is required");
        isValid = false;
      } else if (!iti.isValidNumber()) {
        showFieldError(phoneInput, "Please enter a valid phone number");
        isValid = false;
      }
    }

    // 5. ULAŞIM (TRANSPORTATION) SEÇİMİ
    const transportationChecked = Array.from(
      document.querySelectorAll('input[name="transportation"]')
    ).some(cb => cb.checked);

    if (!transportationChecked) {
      const transportWrapper = document.querySelector("#transportationGroup .field-wrapper");
      const fakeInput = transportWrapper.querySelector("input");
      showFieldError(fakeInput, "Please select a transportation option");
      isValid = false;
    }

    // HATA VARSA DURDUR VE İLK HATAYA GİT
    if (!isValid) {
      showInlineAlert("Please review the highlighted fields below.");
      if (firstErrorField) {
        firstErrorField.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      return;
    }

    // PAYLOAD HAZIRLIĞI
    const payload = {
      tour_name: tourName,
      full_name: document.querySelector('[name="name"]')?.value || "",
      email: document.querySelector('[name="email"]')?.value || "",
      phone: iti ? iti.getNumber() : "",
      tour_date: document.querySelector('[name="date"]')?.value || "",
      language: document.querySelector('[name="language"]')?.value || "",
      hotel: document.querySelector('[name="hotel_name"]')?.value || "",
      notes: document.querySelector('[name="notes"]')?.value || "",
      participants: participants
    };

    // VERİ GÖNDERME (FETCH)
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
        document.querySelector(".reservation-id").textContent = `Reservation ID: ${data.reservation_id}`;
      } else {
        alert("Something went wrong. Please try again.");
      }
    } catch (err) {
      console.error(err);
      alert("Connection error. Please try again.");
    }
  });
}

/* ================= TRANSPORTATION – SINGLE SELECTION ================= */
const transportCheckboxes = document.querySelectorAll('input[name="transportation"]');
transportCheckboxes.forEach(cb => {
  cb.addEventListener("change", () => {
    if (cb.checked) {
      transportCheckboxes.forEach(other => {
        if (other !== cb) other.checked = false;
      });
    }
  });
});

}); // DOMContentLoaded Kapanışı
