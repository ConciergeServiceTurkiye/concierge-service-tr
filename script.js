document.addEventListener("DOMContentLoaded", () => {

    /* =========================
       HERO SLIDER
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
       CONTACT FORM + reCAPTCHA
    ========================= */
    const form = document.getElementById("reservation-form");
    const statusText = document.getElementById("form-status");
    const sendBtn = form.querySelector("button");

    form.addEventListener("submit", e => {
        e.preventDefault(); // page jump ENGELLER

        statusText.textContent = "Sending your request...";
        sendBtn.classList.add("loading");
        sendBtn.textContent = "Sending...";
        sendBtn.disabled = true;

        grecaptcha.execute(
            "6LdvRiwsAAAAAJVIJLJht4KJzHDhyFBclezDs5_J",
            { action: "submit" }
        ).then(token => {

            const data = new URLSearchParams({
                name: form.name.value,
                email: form.email.value,
                phone: form.phone.value,
                message: form.message.value,
                referrer: document.referrer || "Direct",
                token
            });

            return fetch(
                "https://script.google.com/macros/s/AKfycbxvOeMaThb3zFJVCZuGdQbJk-dAFH7W06vkoYPCfyfal_GUxF1dvXinEWMZoP8OtKpKcg/exec",
                {
                    method: "POST",
                    body: data
                }
            );
        })
        .then(r => r.text())
        .then(res => {

            if (res.trim() === "success") {
                statusText.textContent =
                    "Your request has been sent successfully. We will contact you shortly.";
                form.reset();
            } else {
                statusText.textContent =
                    "Security verification failed. Please try again.";
            }

            sendBtn.classList.remove("loading");
            sendBtn.textContent = "Send";
            sendBtn.disabled = false;
        })
        .catch(() => {
            statusText.textContent =
                "Connection error. Please try again later.";

            sendBtn.classList.remove("loading");
            sendBtn.textContent = "Send";
            sendBtn.disabled = false;
        });
    });


    /* =========================
       SERVICES POPUP
    ========================= */
    const popup = document.getElementById("servicePopup");
    const popupTitle = document.getElementById("popupTitle");
    const popupText = document.getElementById("popupText");
    const closePopup = document.querySelector(".close-popup");

    const serviceData = {
        airport: {
            title: "Airport Transfer",
            text: "Luxury private airport transfers with professional drivers."
        },
        tours: {
            title: "City Tours",
            text: "Private guided tours of Istanbul’s iconic landmarks."
        },
        restaurants: {
            title: "Restaurant Reservations",
            text: "Exclusive reservations at Istanbul’s finest restaurants."
        },
        vip: {
            title: "VIP Assistance",
            text: "Fast-track services, shopping support and personal assistance."
        },
        events: {
            title: "Event Organization",
            text: "Private events, business meetings and special arrangements."
        }
    };

    document.querySelectorAll("[data-service], .service-card").forEach(item => {
        item.addEventListener("click", e => {
            const key =
                item.dataset.service || item.id;

            if (!serviceData[key]) return;

            e.preventDefault();
            popupTitle.textContent = serviceData[key].title;
            popupText.textContent = serviceData[key].text;
            popup.classList.add("active");
        });
    });

    closePopup.addEventListener("click", () => {
        popup.classList.remove("active");
    });

    popup.addEventListener("click", e => {
        if (e.target === popup) {
            popup.classList.remove("active");
        }
    });


    /* =========================
       NAVBAR SCROLL EFFECT
    ========================= */
    const navbar = document.querySelector(".navbar");

    window.addEventListener("scroll", () => {
        navbar.classList.toggle("scrolled", window.scrollY > 50);
    });


    /* =========================
       MOBILE HAMBURGER MENU
    ========================= */
    const hamburger = document.getElementById("hamburger");
    const navMenu = document.getElementById("navMenu");

    if (hamburger) {
        hamburger.addEventListener("click", () => {
            navMenu.classList.toggle("active");
        });
    }

});
