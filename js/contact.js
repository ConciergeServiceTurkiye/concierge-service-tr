document.addEventListener("DOMContentLoaded", () => {

  /* ======================
     INLINE FORM ALERT
     (NO LAYOUT SHIFT)
  ====================== */

  const alertBox = document.getElementById("formInlineAlert");

  function showInlineAlert(message) {
    if (!alertBox) return;

    alertBox.textContent = message;
    alertBox.style.opacity = "1";
    alertBox.style.visibility = "visible";

    setTimeout(() => {
      alertBox.style.opacity = "0";
      alertBox.style.visibility = "hidden";
    }, 3500);
  }

  /* ======================
     FORM ELEMENTS
  ====================== */

  const form = document.getElementById("contactForm");
  const nameField = document.getElementById("name");
  const emailField = document.getElementById("email");
  const phoneField = document.getElementById("phone");
  const subjectField = document.getElementById("subject");
  const messageField = document.getElementById("message");
  const charCount = document.getElementById("charCount");

  if (!form) return;

  /* ======================
     CHARACTER COUNTER (2000)
  ====================== */

  messageField.setAttribute("maxlength", "2000");

  charCount.textContent = "0 / 2000";

  messageField.addEventListener("input", () => {
    charCount.textContent = `${messageField.value.length} / 2000`;
  });

  /* ======================
     PHONE INPUT
     NUMERIC ONLY (+ CTRL+A)
  ====================== */

  phoneField.addEventListener("keydown", e => {
    if (
      e.ctrlKey ||
      e.metaKey ||
      ["Backspace", "Delete", "ArrowLeft", "ArrowRight", "Tab"].includes(e.key)
    ) {
      return;
    }

    if (!/^[0-9]$/.test(e.key)) {
      e.preventDefault();
    }
  });

  /* ======================
     FORM VALIDATION
  ====================== */

  /* ===============================
   FORM SUBMIT → GOOGLE APPS SCRIPT
================================ */

form.addEventListener("submit", function (e) {
  e.preventDefault();

  const formData = new FormData(form);

  fetch(form.action, {
    method: "POST",
    body: formData,
  })
  .then(res => res.text())
  .then(response => {
    if (response === "success") {
      showInlineAlert("Your private concierge request has been received.", true);
      form.reset();
      charCount.textContent = "0 / 2000";
      document.querySelector(".select-trigger").textContent = "Select a subject";
    } else {
      showInlineAlert("Something went wrong. Please try again.");
    }
  })
  .catch(() => {
    showInlineAlert("Connection error. Please try again later.");
  });
});


    const name = nameField.value.trim();
    const email = emailField.value.trim();
    const phone = phoneField.value.trim();
    const subject = subjectField.value;
    const message = messageField.value.trim();

    if (!name) {
      showInlineAlert("Please enter your full name.");
      return;
    }

    if (!email) {
      showInlineAlert("Please enter your email address.");
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      showInlineAlert("Please enter a valid email address.");
      return;
    }

    if (!phone) {
      showInlineAlert("Please enter your phone number.");
      return;
    }

    if (!subject) {
      showInlineAlert("Please select a subject.");
      return;
    }

    if (!message) {
      showInlineAlert("Please enter your request details.");
      return;
    }

    /* ======================
       SUCCESS
    ====================== */

    showInlineAlert("Your private concierge request has been received.");

    form.reset();
    charCount.textContent = "0 / 2000";
  });

});
/* ===============================
   CUSTOM SUBJECT DROPDOWN
================================ */

const customSelect = document.getElementById("customSubject");
const trigger = customSelect.querySelector(".select-trigger");
const options = customSelect.querySelectorAll(".select-options li");
const hiddenSubject = document.getElementById("subject");

trigger.addEventListener("click", () => {
  customSelect.classList.toggle("open");
});

options.forEach(option => {
  option.addEventListener("click", () => {
    trigger.textContent = option.textContent;
    hiddenSubject.value = option.dataset.value;
    customSelect.classList.remove("open");
  });
});

/* CLICK OUTSIDE CLOSE */
document.addEventListener("click", e => {
  if (!customSelect.contains(e.target)) {
    customSelect.classList.remove("open");
  }
});
/* ===============================
   CUSTOM SUBJECT DROPDOWN
================================ */

const subjectTrigger = document.querySelector(".select-trigger");
const subjectOptions = document.querySelectorAll(".select-options li");
const subjectHiddenInput = document.getElementById("subject");

subjectOptions.forEach(option => {
  option.addEventListener("click", () => {
    subjectTrigger.textContent = option.textContent;
    subjectHiddenInput.value = option.dataset.value;
  });
});



