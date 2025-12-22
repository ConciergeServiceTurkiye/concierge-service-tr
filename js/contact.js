document.addEventListener("DOMContentLoaded", () => {

  /* ======================
     ELEMENTS
  ====================== */
  const form = document.getElementById("contactForm");
  const alertBox = document.getElementById("formInlineAlert");

  const nameField = document.getElementById("name");
  const emailField = document.getElementById("email");
  const phoneField = document.getElementById("phone");
  const subjectHidden = document.getElementById("subject");
  const messageField = document.getElementById("message");
  const charCount = document.getElementById("charCount");

  const customSelect = document.getElementById("customSubject");
  const trigger = customSelect.querySelector(".select-trigger");
  const options = customSelect.querySelectorAll(".select-options li");

  if (!form) return;

  /* ======================
     INLINE ALERT
     (NO LAYOUT SHIFT)
  ====================== */
  function showInlineAlert(text, success = false) {
    alertBox.textContent = text;
    alertBox.style.visibility = "visible";
    alertBox.style.opacity = "1";
    alertBox.style.borderColor = success ? "#d4af37" : "#c9a24d";

    setTimeout(() => {
      alertBox.style.opacity = "0";
      alertBox.style.visibility = "hidden";
    }, 3500);
  }

  /* ======================
     CHARACTER COUNTER (2000)
  ====================== */
  messageField.setAttribute("maxlength", "2000");
  charCount.textContent = "0 / 2000";

  messageField.addEventListener("input", () => {
    charCount.textContent = `${messageField.value.length} / 2000`;
  });

  /* ======================
     PHONE INPUT (NUMERIC)
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
  trigger.addEventListener("keydown", e => {
  if (e.key === "Enter" || e.key === " ") {
    e.preventDefault();
    customSelect.classList.toggle("open");
  }

  if (e.key === "Escape") {
    customSelect.classList.remove("open");
  }
});


  /* ======================
     CUSTOM SUBJECT DROPDOWN
  ====================== */
  trigger.addEventListener("click", () => {
    customSelect.classList.toggle("open");
  });

  options.forEach(option => {
    option.addEventListener("click", () => {
      trigger.textContent = option.textContent;
      subjectHidden.value = option.dataset.value;
      customSelect.classList.remove("open");
      messageField.focus();
    });
  });

  document.addEventListener("click", e => {
    if (!customSelect.contains(e.target)) {
      customSelect.classList.remove("open");
    }
  });

  /* ======================
     FORM SUBMIT
  ====================== */
  form.addEventListener("submit", e => {
    e.preventDefault();

    const name = nameField.value.trim();
    const email = emailField.value.trim();
    const phone = phoneField.value.trim();
    const subject = subjectHidden.value.trim();
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

    const formData = new FormData(form);

    fetch(form.action, {
      method: "POST",
      body: formData
    })
    .then(res => res.text())
    .then(response => {
      if (response.trim() === "success") {
        showInlineAlert(
          "Your private concierge request has been received.",
          true
        );
        form.reset();
        charCount.textContent = "0 / 2000";
        trigger.textContent = "Select a subject";
      } else {
        showInlineAlert("Something went wrong. Please try again.");
      }
    })
    .catch(() => {
      showInlineAlert("Connection error. Please try again later.");
    });
  });

});


