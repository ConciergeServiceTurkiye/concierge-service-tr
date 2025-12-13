// =======================
// SLIDER
// =======================
let currentSlide = 0;
const slides = document.querySelectorAll(".slide");

function showSlide(index) {
    slides.forEach((slide, i) => {
        slide.classList.remove("active");
        if (i === index) slide.classList.add("active");
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
    e.preventDefault(); // sayfanın yukarı zıplamasını engeller

    statusText.textContent = "Sending your request...";

    const data = {
        name: form.name.value,
        email: form.email.value,
        phone: form.phone.value,
        message: form.message.value
    };

    try {
        const response = await fetch(
            "https://script.google.com/macros/s/AKfycbyApakKHjdAuS4vNikAkmwbMGjeO-9M9hCY6cjUN2u9wMa0ZML2v_DLHpjLmsVhtsUi6g/exec",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data)
            }
        );

        const result = await response.json();

        if (result.status === "success") {
            statusText.textContent =
                "Your request has been sent successfully. We will contact you shortly.";
            form.reset();
        } else {
            statusText.textContent =
                "Something went wrong. Please try again.";
        }

    } catch (error) {
        statusText.textContent =
            "Connection error. Please try again later.";
    }
});
