// SLIDER FUNCTION
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


// FORM → GOOGLE SHEETS
document.getElementById("reservation-form").addEventListener("submit", async function (e) {
    e.preventDefault();

    const form = e.target;
    const data = {
        name: form.name.value,
        email: form.email.value,
        phone: form.phone.value,
        message: form.message.value
    };

    await fetch(
        "https://script.google.com/macros/s/AKfycbyha3zzABJWwFy45f4VWkUPj3Ao9NIK3_snPrptS3seVONoyhi5IZ5aLAzdyTcSjYEhxQ/exec",
        {
            method: "POST",
            mode: "no-cors",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        }
    );

    alert("Your request has been sent! Thank you.");
    form.reset();
});

const form = document.getElementById("reservation-form");
const statusText = document.getElementById("form-status");

form.addEventListener("submit", function (e) {
    e.preventDefault(); // sayfa zıplamasını engeller

    statusText.textContent = "Sending your request...";

    const formData = new FormData(form);

    fetch("https://script.google.com/macros/s/AKfycbyha3zzABJWwFy45f4VWkUPj3Ao9NIK3_snPrptS3seVONoyhi5IZ5aLAzdyTcSjYEhxQ/exec", {
        method: "POST",
        body: formData
    })
    .then(response => response.text())
    .then(data => {
        statusText.textContent = "Your request has been sent successfully. We will contact you shortly.";
        form.reset();
    })
    .catch(error => {
        statusText.textContent = "Something went wrong. Please try again.";
    });
});
