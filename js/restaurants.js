document.addEventListener("DOMContentLoaded", () => {

  const form = document.getElementById("reservationForm");
  const alertBox = document.getElementById("formInlineAlert");

  const name = document.getElementById("name");
  const email = document.getElementById("email");
  const phone = document.getElementById("phone");
  const date = document.getElementById("date");
  const time = document.getElementById("time");
  const guests = document.getElementById("guests");

  date.min = new Date().toISOString().split("T")[0];

  const allergyToggle = document.getElementById("allergyToggle");
  const allergyField = document.getElementById("allergyField");

  /* INLINE ALERT */
  function showInlineAlert(text) {
    alertBox.textContent = text;
    alertBox.style.visibility = "visible";
    alertBox.style.opacity = "1";

    const formTop =
      form.getBoundingClientRect().top + window.pageYOffset;

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
 const phoneInput = document.querySelector("#phone");

const iti = intlTelInput(phoneInput, {
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
  date.addEventListener("input", () => {
  // YYYY-MM-DD = 10 karakter
  if (date.value.length > 10) {
    date.value = date.value.slice(0, 10);
  }
});

  /* TIME OPTIONS — 18:00–22:00 / 15 min */
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
/* DATE PICKER — FLATPICKR */
flatpickr("#date", {
  minDate: "today",
  locale: navigator.language,
  dateFormat: "Y-m-d",
  disableMobile: true
});

  buildTimes();

  time.style.color = "rgba(255,255,255,0.65)";
  guests.style.color = "rgba(255,255,255,0.65)";


  /* ======================
   SELECT COLOR SWITCH
====================== */
time.addEventListener("change", () => {
  time.style.color = time.value
    ? "#d4af37"
    : "rgba(255,255,255,0.65)";
});

guests.addEventListener("change", () => {
  guests.style.color = guests.value
    ? "#d4af37"
    : "rgba(255,255,255,0.65)";
});


  /* ALLERGY TOGGLE */
  allergyToggle.addEventListener("change", () => {
  allergyField.style.display = allergyToggle.checked ? "block" : "none";
  });

  /* CHILDREN & AGE LOGIC */
const childrenToggle = document.getElementById("childrenToggle");
const childrenAges = document.getElementById("childrenAges");
const ageToggles = document.querySelectorAll(".age-toggle");

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

   /* ONLY NUMBERS – MAX 6 DIGITS */
  document.querySelectorAll(".child-input").forEach(input => {
  input.addEventListener("input", () => {
    input.value = input.value.replace(/\D/g, "").slice(0, 4);
  });
});

const submitBtn = form.querySelector("button[type='submit']");
  
  /* SUBMIT */
  form.addEventListener("submit", e => {
  e.preventDefault();

  submitBtn.disabled = true;
  submitBtn.textContent = "Sending...";

    if (!name.value.trim()) { showInlineAlert("Please enter your full name."); unlockSubmit(); return;}
    if (!email.value.trim()) { showInlineAlert("Please enter your email address."); unlockSubmit(); return;}
    if (!iti.isValidNumber()) { showInlineAlert("Please enter a valid phone number."); unlockSubmit(); return;}
    if (!date.value) { showInlineAlert("Please select a date."); unlockSubmit(); return;}
    if (!time.value) { showInlineAlert("Please select a time."); unlockSubmit(); return;}
    if (!guests.value) { showInlineAlert("Please select number of guests."); unlockSubmit(); return;}

    /* ======================
   ALLERGY VALIDATION
====================== */
if (allergyToggle.checked) {
  const allergyText = document.getElementById("allergyField");
  if (!allergyText.value.trim()) { showInlineAlert("Please specify your allergy details."); unlockSubmit(); return;}
}
/* ======================
   CHILDREN VALIDATION
====================== */
if (childrenToggle && childrenToggle.checked) {
  let atLeastOneAge = false;

  for (let toggle of ageToggles) {
    if (toggle.checked) {
      atLeastOneAge = true;
      const targetId = toggle.dataset.target;
      const input = document.getElementById(targetId);

      if (!input.value.trim()) { showInlineAlert("Please enter number of children for selected age group."); unlockSubmit(); return;}
    }
  }

  if (!atLeastOneAge) { showInlineAlert("Please select at least one age group for children."); unlockSubmit();return;}
}

    showInlineAlert("Sending your reservation...");
    setTimeout(() => {}, 50); // UI flush

const data = new FormData(form);

data.set("phone", iti.getNumber());

data.set("age_0_3", document.getElementById("age03")?.value || "");
data.set("age_4_13", document.getElementById("age413")?.value || "");
data.set("age_14_17", document.getElementById("age1417")?.value || "");
    
    fetch("https://script.google.com/macros/s/AKfycbw9P03YjqbWBLy_YiGiJOUIL19uk89RmsSqWOt1CN3FV6WVqPg6IQFwjuj9RbBiYND7ZA/exec", {
  method: "POST",
  body: data
})
.then(res => res.json())
.then(result => {
  if (result.status === "success") {
    showInlineAlert("Reservation received. Our concierge team will contact you shortly.");
submitBtn.disabled = false;
submitBtn.textContent = "Submit Reservation";
form.reset();
    allergyField.style.display = "none";
    childrenAges.style.display = "none";
    buildTimes();
  } else {
    throw new Error("Server error");
  }
})
.catch(err => {
  console.error(err);
  showInlineAlert("Connection error. Please try again later.");
  submitBtn.disabled = false;
  submitBtn.textContent = "Submit Reservation";
});
  });
});

const itiObserver = new MutationObserver(() => {
  const input = document.querySelector(".iti__search-input");
  if (input) {
    input.style.color = "#d4af37";
    input.style.webkitTextFillColor = "#d4af37";
    input.style.caretColor = "#d4af37";
    input.style.backgroundColor = "#111";
    input.style.opacity = "1";
  }
});

itiObserver.observe(document.body, {
  childList: true,
  subtree: true
});
















