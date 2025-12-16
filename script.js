document.addEventListener("DOMContentLoaded", () => {

  /* HERO SLIDER */
  let currentSlide = 0;
  const slides = document.querySelectorAll(".slide");

  setInterval(() => {
    slides.forEach((s, i) => s.classList.toggle("active", i === currentSlide));
    currentSlide = (currentSlide + 1) % slides.length;
  }, 5000);

  /* HAMBURGER MENU */
  const hamburger = document.getElementById("hamburger");
  const navMenu = document.getElementById("navMenu");

  if (hamburger && navMenu) {
    hamburger.addEventListener("click", () => {
      navMenu.classList.toggle("active");
    });
  }

  /* FORM */
  const form = document.getElementById("reservation-form");
  const statusText = document.getElementById("form-status");
  const sendBtn = form.querySelector("button");

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    sendBtn.classList.add("sending");
    sendBtn.disabled = true;
    statusText.textContent = "Sending your request...";

    grecaptcha.ready(() => {
      grecaptcha.execute(
        "6LeHUiwsAAAAAERRFl50ORDSAKg3x3OPROSNo9iW",
        { action: "submit" }
      ).then((token) => {

        const data = new URLSearchParams({
          name: form.name.value,
          email: form.email.value,
          phone: form.phone.value,
          message: form.message.value,
          referrer: document.referrer || "Website",
          token
        });

        fetch("https://script.google.com/macros/s/AKfycbxvOeMaThb3zFJVCZuGdQbJk-dAFH7W06vkoYPCfyfal_GUxF1dvXinEWMZoP8OtKpKcg/exec", {
          method: "POST",
          body: data
        })
        .then(r => r.text())
        .then(res => {
          if (res.trim() === "success") {
            statusText.textContent = "Your request has been sent successfully.";
            form.reset();
          } else {
            statusText.textContent = "Security verification failed.";
          }
        })
        .catch(() => {
          statusText.textContent = "Connection error. Please try again.";
        })
        .finally(() => {
          sendBtn.classList.remove("sending");
          sendBtn.disabled = false;
        });

      });
    });
  });
});
