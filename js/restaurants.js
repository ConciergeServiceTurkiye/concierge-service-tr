document.addEventListener("DOMContentLoaded", () => {

  const alertBox = document.getElementById("formInlineAlert");
  const form = document.getElementById("restaurantForm");

  const name = document.getElementById("name");
  const email = document.getElementById("email");
  const phone = document.getElementById("phone");
  const date = document.getElementById("date");
  const time = document.getElementById("time");
  const guests = document.getElementById("guests");
  const notes = document.getElementById("notes");

  const allergyToggle = document.getElementById("allergyToggle");
  const allergyField = document.getElementById("allergyField");

  function showAlert(msg) {
    alertBox.textContent = msg;
    alertBox.style.opacity = "1";
    alertBox.style.visibility = "visible";
    setTimeout(() => {
      alertBox.style.opacity = "0";
      alertBox.style.visibility = "hidden";
    }, 3500);
  }

  /* PHONE */
  const iti = intlTelInput(phone, {
    initialCountry: "us",
    separateDialCode: true
  });

  phone.addEventListener("keydown", e => {
    if (e.ctrlKey || e.metaKey || ["Backspace","Delete","ArrowLeft","ArrowRight","Tab"].includes(e.key)) return;
    if (!/^[0-9]$/.test(e.key)) e.preventDefault();
  });

  /* TIME OPTIONS (18:00–22:30 / 15 min) */
  function buildTimes(start, end) {
    const times = [];
    let current = start * 60;
    const endMin = end * 60 + 30;
    while (current <= endMin) {
      const h = String(Math.floor(current / 60)).padStart(2, "0");
      const m = String(current % 60).padStart(2, "0");
      times.push(`${h}:${m}`);
      current += 15;
    }
    return times;
  }

  buildTimes(18, 22).forEach(t => {
    const opt = document.createElement("option");
    opt.value = t;
    opt.textContent = t;
    time.appendChild(opt);
  });

  /* ALLERGY TOGGLE */
  allergyToggle.addEventListener("change", () => {
    allergyField.style.display = allergyToggle.checked ? "block" : "none";
  });

  /* SUBMIT */
  form.addEventListener("submit", e => {
    e.preventDefault();

    if (!name.value.trim()) return showAlert("Please enter your full name.");
    if (!email.value.trim()) return showAlert("Please enter your email.");
    if (!iti.isValidNumber()) return showAlert("Please enter a valid phone number.");
    if (!date.value) return showAlert("Please select a date.");
    if (!time.value) return showAlert("Please select a time.");
    if (!guests.value) return showAlert("Please select number of guests.");

    showAlert("Reservation request sent successfully.");
    form.reset();
    allergyField.style.display = "none";
  });

});
