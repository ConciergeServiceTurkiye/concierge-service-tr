document.addEventListener("DOMContentLoaded", () => {

  /* ======================
     POPUP ALERT
  ====================== */
  const popupAlert = document.getElementById("popupAlert");

  function showPopup(message) {
    if (!popupAlert) return;
    popupAlert.textContent = message;
    popupAlert.classList.add("show");

    setTimeout(() => {
      popupAlert.classList.remove("show");
    }, 3000);
  }

  /* ======================
     CHARACTER COUNTER
  ====================== */
  const messageField = document.getElementById("message");
  const charCount = document.getElementById("charCount");

  if (messageField && charCount) {
    messageField.addEventListener("input", () => {
      charCount.textContent = `${messageField.value.length} / 500`;
    });
  }

  /* ======================
     FORM VALIDATION
  ====================== */
  const form = document.getElementById("contactForm");

  if (!form) return;

  form.addEventListener("submit", e => {
    e.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const subject = document.getElementById("subject").value;
    const message = messageField.value.trim();

    if (!name) {
      showPopup("Please enter your full name.");
      return;
    }

    if (!email) {
      showPopup("Please enter your email address.");
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      showPopup("Please enter a valid email address.");
      return;
    }

    if (!phone) {
      showPopup("Please enter your phone number.");
      return;
    }

    if (!subject) {
      showPopup("Please select a subject.");
      return;
    }

    if (!message) {
      showPopup("Please enter your request details.");
      return;
    }

    /* ======================
       SUCCESS
    ====================== */

    showPopup("Your request has been sent successfully.");

    form.reset();
    charCount.textContent = "0 / 500";
  });

});