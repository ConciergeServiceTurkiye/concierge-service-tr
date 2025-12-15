/* =========================
   SLIDER (AYNI KALIYOR)
========================= */
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

/* =========================
   FORM + reCAPTCHA v3
========================= */
const form = document.getElementById("reservation-form");
const statusText = document.getElementById("form-status");
const sendBtn = form.querySelector("button");

form.addEventListener("submit", function (e) {
    e.preventDefault(); // ❗ Zıplamayı kesin engeller

    // UI feedback
    statusText.textContent = "İsteğiniz gönderiliyor...";
    sendBtn.disabled = true;
    sendBtn.style.opacity = "0.6";

    grecaptcha.ready(function () {
        grecaptcha.execute(
            "6LdvRiwsAAAAAJVIJLJht4KJzHDhyFBclezDs5_J",
            { action: "submit" }
        ).then(function (token) {

            const data = new URLSearchParams({
                name: form.name.value,
                email: form.email.value,
                phone: form.phone.value,
                message: form.message.value,
                referrer: document.referrer || "Direct",
                token: token
            });

            fetch(
                "https://script.google.com/macros/s/AKfycbxvOeMaThb3zFJVCZuGdQbJk-dAFH7W06vkoYPCfyfal_GUxF1dvXinEWMZoP8OtKpKcg/exec",
                {
                    method: "POST",
                    body: data
                }
            )
            .then(res => res.text())
            .then(result => {

                if (result.trim() === "success") {
                    statusText.textContent =
                        "İsteğiniz başarıyla gönderildi. En kısa sürede sizinle iletişime geçeceğiz.";
                    form.reset();
                } else {
                    statusText.textContent =
                        "Güvenlik doğrulaması başarısız. Lütfen tekrar deneyin.";
                }

                sendBtn.disabled = false;
                sendBtn.style.opacity = "1";
            })
            .catch(() => {
                statusText.textContent =
                    "Bağlantı hatası. Lütfen daha sonra tekrar deneyin.";
                sendBtn.disabled = false;
                sendBtn.style.opacity = "1";
            });

        });
    });
});
