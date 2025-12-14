// =======================
// SLIDER
// =======================
let currentSlide = 0;
const slides = document.querySelectorAll(".slide");

function showSlide(index) {
    slides.forEach((slide, i) => {
        slide.classList.toggle("active", i === index);
    });
}

setInterval(() => {
    currentSlide = (currentSlide + 1) % slides.length;
    showSlide(currentSlide);
}, 5000);


// =======================
// FORM → GOOGLE SHEETS (SAFE MODE)
// =======================
const form = document.getElementById("reservation-form");
const statusText = document.getElementById("form-status");

form.addEventListener("submit", function (e) {
    e.preventDefault();

    statusText.textContent = "Sending your request...";

    const data = new URLSearchParams({
        name: form.name.value,
        email: form.email.value,
        phone: form.phone.value,
        message: form.message.value,
        referrer: document.referrer || "Direct"
    });

    fetch("https://script.google.com/macros/s/AKfycbyApakKHjdAuS4vNikAkmwbMGjeO-9M9hCY6cjUN2u9wMa0ZML2v_DLHpjLmsVhtsUi6g/exec", {
        method: "POST",
        body: data
    })
    .then(() => {
        statusText.textContent =
            "Your request has been sent successfully. We will contact you shortly.";
        form.reset();
    })
    .catch(() => {
        statusText.textContent =
            "Connection error. Please try again later.";
    });
});
