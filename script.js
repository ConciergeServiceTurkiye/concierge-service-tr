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
// FORM → GOOGLE SHEETS
// =======================
const form = document.getElementById("reservation-form");
const statusText = document.getElementById("form-status");

form.addEventListener("submit", async function (e) {
    e.preventDefault(); // ❗ SAYFANIN YUKARI ZIPLAMASINI ENGELLER

    statusText.textContent = "Sending your request...";

    const formData = new FormData(form);

    try {
        const response = await fetch(
            "https://script.google.com/macros/s/AKfycbyApakKHjdAuS4vNikAkmwbMGjeO-9M9hCY6cjUN2u9wMa0ZML2v_DLHpjLmsVhtsUi6g/exec",
            {
                method: "POST",
                body: formData
            }
        );

        statusText.textContent =
            "Your request has been sent successfully. We will contact you shortly.";

        form.reset();

    } catch (error) {
        statusText.textContent =
            "Connection error. Please try again later.";
    }
});
