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

    fetch("https://script.google.com/macros/s/AKfycbxvOeMaThb3zFJVCZuGdQbJk-dAFH7W06vkoYPCfyfal_GUxF1dvXinEWMZoP8OtKpKcg/exec", {
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
/* HAMBURGER */
const hamburger = document.getElementById("hamburger");
const navMenu = document.getElementById("navMenu");

hamburger.addEventListener("click", () => {
    navMenu.classList.toggle("active");
});

/* NAVBAR SCROLL */
window.addEventListener("scroll", () => {
    document.querySelector(".navbar")
        .classList.toggle("scrolled", window.scrollY > 50);
});

/* SERVICE POPUP */
const popup = document.getElementById("servicePopup");
const title = document.getElementById("popupTitle");
const text = document.getElementById("popupText");

const serviceData = {
    airport: ["Airport Transfer", "Luxury private airport transportation."],
    tours: ["City Tours", "Guided tours of Istanbul’s landmarks."],
    restaurants: ["Restaurant Reservations", "Exclusive restaurant bookings."],
    vip: ["VIP Assistance", "Personalized VIP concierge support."],
    events: ["Event Organization", "Private & corporate event planning."]
};

document.querySelectorAll("[data-service]").forEach(item => {
    item.addEventListener("click", e => {
        e.preventDefault();
        const service = item.dataset.service;
        title.innerText = serviceData[service][0];
        text.innerText = serviceData[service][1];
        popup.classList.add("active");
    });
});

document.querySelector(".close-popup").onclick = () =>
    popup.classList.remove("active");
/* HAMBURGER */
const hamburger = document.getElementById("hamburger");
const navMenu = document.getElementById("navMenu");

hamburger.onclick = () => {
    navMenu.classList.toggle("active");
};

/* NAV SCROLL */
window.addEventListener("scroll", () => {
    document.querySelector(".navbar")
        .classList.toggle("scrolled", window.scrollY > 50);
});

/* SERVICES POPUP */
const popup = document.getElementById("servicePopup");
const title = document.getElementById("popupTitle");
const text = document.getElementById("popupText");

const serviceData = {
    airport: ["Airport Transfer", "Luxury airport transfer with professional drivers."],
    tours: ["City Tours", "Private guided tours in Istanbul."],
    restaurants: ["Restaurant Reservations", "Exclusive reservations at top restaurants."],
    vip: ["VIP Assistance", "Fast-track, shopping & personal concierge services."],
    events: ["Event Organization", "Private & corporate event planning."]
};

document.querySelectorAll("[data-service]").forEach(item => {
    item.onclick = e => {
        e.preventDefault();
        const s = item.dataset.service;
        title.innerText = serviceData[s][0];
        text.innerText = serviceData[s][1];
        popup.classList.add("active");
    };
});

document.querySelector(".close-popup").onclick = () => {
    popup.classList.remove("active");
};

/* reCAPTCHA v3 */
grecaptcha.ready(function () {
    grecaptcha.execute('YOUR_SITE_KEY', { action: 'submit' });
});
