document.addEventListener("DOMContentLoaded", () => {

  const form = document.getElementById("reservationForm");
  const alertBox = document.getElementById("formInlineAlert");

  const name = document.getElementById("name");
  const email = document.getElementById("email");
  const phone = document.getElementById("phone");
  const date = document.getElementById("date");
  const time = document.getElementById("time");
  const guests = document.getElementById("guests");

  const allergyToggle = document.getElementById("allergyToggle");
  const allergyField = document.getElementById("allergyField");

  const dateInput = document.getElementById("date");

dateInput.addEventListener("focus", () => {
  dateInput.type = "date";
  dateInput.showPicker && dateInput.showPicker();
});

dateInput.addEventListener("blur", () => {
  if (!dateInput.value) {
    dateInput.type = "text";
  }
});

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

  buildTimes();

  /* ALLERGY TOGGLE */
  allergyToggle.addEventListener("change", () => {
    allergyField.style.display = allergyToggle.checked ? "block" : "none";
  });

  /* SUBMIT */
  form.addEventListener("submit", e => {
    e.preventDefault();

    if (!name.value.trim()) return showInlineAlert("Please enter your full name.");
    if (!email.value.trim()) return showInlineAlert("Please enter your email address.");
    if (!iti.isValidNumber()) return showInlineAlert("Please enter a valid phone number.");
    if (!date.value) return showInlineAlert("Please select a date.");
    if (!time.value) return showInlineAlert("Please select a time.");
    if (!guests.value) return showInlineAlert("Please select number of guests.");

    const data = new FormData(form);
    data.set("phone", iti.getNumber());

    fetch("https://script.google.com/macros/s/AKfycbw9P03YjqbWBLy_YiGiJOUIL19uk89RmsSqWOt1CN3FV6WVqPg6IQFwjuj9RbBiYND7ZA/exec", {
      method: "POST",
      body: data
    })
    .then(() => {
      showInlineAlert("Reservation received. Our concierge team will contact you shortly.");
      form.reset();
      allergyField.style.display = "none";
      buildTimes();
    })
    .catch(() => {
      showInlineAlert("Connection error. Please try again later.");
    });
  });

});

