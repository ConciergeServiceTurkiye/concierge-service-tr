document.addEventListener("DOMContentLoaded", () => {

  /* =========================
     SLIDER
  ========================= */
  let currentSlide = 0;
  const slides = document.querySelectorAll(".slide");

  setInterval(() => {
    slides.forEach((s, i) =>
      s.classList.toggle("active", i === currentSlide)
    );
    currentSlide = (currentSlide + 1) % slides.length;
  }, 5000);

  /* =========================
     FORM + reCAPTCHA ENTERPRISE
  ========================= */
  const form = document.getElementById("reservation-form");
  const statusText = document.getElementById("form-status");
  const sendBtn = form.querySelector("button");

  form.addEventListener("submit", e => {
    e.preventDefault();

    statusText.textContent = "Sending your request...";
    sendBtn.disabled = true;
    sendBtn.classList.add("loading");

    grecaptcha.enterprise.ready(async () => {
      try {
        const token = await grecaptcha.enterprise.execute(
          "6LdvRiwsAAAAAJVIJLJht4KJzHDhyFBclezDs5_J",
          { action: "submit" }
        );

        const data = new URLSearchParams({
          name: form.name.value,
          email: form.email.value,
          phone: form.phone.value,
          message: form.message.value,
          referrer: document.referrer || "Direct",
          token: token
        });

        const res = await fetch(
          "https://script.google.com/macros/s/AKfycbxvOeMaThb3zFJVCZuGdQbJk-dAFH7W06vkoYPCfyfal_GUxF1dvXinEWMZoP8OtKpKcg/exec",
          {
            method: "POST",
            body: data
          }
        );

        const text = await res.text();

        if (text.trim() === "success") {
          statusText.textContent =
            "Your request has been sent successfully. We will contact you shortly.";
          form.reset();
        } else {
          statusText.textContent =
            "Security verification failed. Please try again.";
        }

      } catch (err) {
        statusText.textContent =
          "Connection error. Please try again later.";
      }

      sendBtn.disabled = false;
      sendBtn.classList.remove("loading");
    });
  });

});
