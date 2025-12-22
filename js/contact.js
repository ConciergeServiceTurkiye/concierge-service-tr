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

/* ===============================
   CUSTOM SUBJECT DROPDOWN
   (KEYBOARD + MOUSE)
================================ */

let currentIndex = -1;

trigger.addEventListener("click", () => {
  customSelect.classList.toggle("open");
  setActiveOption();
});

trigger.addEventListener("keydown", e => {
  if (["ArrowDown", "ArrowUp", "Enter", " "].includes(e.key)) {
    e.preventDefault(); // ❗ scroll iptal
  }

  if (e.key === "Enter" || e.key === " ") {
    customSelect.classList.toggle("open");
    setActiveOption();
  }

  if (e.key === "ArrowDown") {
    openIfClosed();
    moveOption(1);
  }

  if (e.key === "ArrowUp") {
    openIfClosed();
    moveOption(-1);
  }

  if (e.key === "Escape") {
    closeDropdown();
  }
});

options.forEach((option, index) => {
  option.addEventListener("click", () => {
    selectOption(index);
    messageField.focus();
  });
});

/* ===============================
   HELPERS
================================ */

function openIfClosed() {
  if (!customSelect.classList.contains("open")) {
    customSelect.classList.add("open");
  }
}

function closeDropdown() {
  customSelect.classList.remove("open");
  currentIndex = -1;
  clearActive();
}

function moveOption(direction) {
  currentIndex += direction;

  if (currentIndex < 0) currentIndex = options.length - 1;
  if (currentIndex >= options.length) currentIndex = 0;

  setActiveOption();
}

function setActiveOption() {
  clearActive();
  if (currentIndex >= 0) {
    options[currentIndex].classList.add("active");
    options[currentIndex].scrollIntoView({
      block: "nearest"
    });
  }
}

function clearActive() {
  options.forEach(opt => opt.classList.remove("active"));
}

function selectOption(index) {
  const option = options[index];
  trigger.textContent = option.textContent;
  subjectHidden.value = option.dataset.value;
  closeDropdown();
}

/* CLICK OUTSIDE */
document.addEventListener("click", e => {
  if (!customSelect.contains(e.target)) {
    closeDropdown();
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



