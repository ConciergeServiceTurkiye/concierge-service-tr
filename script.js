// ================= SLIDER =================
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


// ================= FORM → GOOGLE SHEETS =================
const form = document.getElementById("reservation-form");

form.addEventListener("submit", function (e) {
    e.preventDefault(); // sayfa yukarı zıplamaz

    let statusText = document.getElementById("form-status");
    if (!statusText) {
        statusText = document.createElement("div");
        statusText.id = "form-status";
        statusText.style.marginBottom = "15px";
        statusText.style.color = "#d4af37";
        statusText.style.fontWeight = "bold";
        statusText.style.textAlign = "center";
        form.prepend(statusText);
    }

    statusText.textContent = "Sending your request...";

    const data = {
        name: form.name.value,
        email: form.email.value,
        phone: form.phone.value,
        message: form.message.value
    };

    fetch(
        "https://script.google.com/macros/s/AKfycbw9k8086EBS-dcKj1ob5jdrfwUD_rsznvJTnvJvfxrIU7Omu-gsB4TRcg7yYSKdkI3GOA/exec",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        }
    )
    .then(res => res.json())
    .then(response => {
        if (response.status === "success") {
            statusText.textContent =
                "Your request has been sent successfully. We will contact you shortly.";
            form.reset();
        } else {
            statusText.textContent =
                "Something went wrong. Please try again.";
        }
    })
    .catch(() => {
        statusText.textContent =
            "Connection error. Please try again later.";
    });
});
