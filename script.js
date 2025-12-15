document.addEventListener("DOMContentLoaded", () => {

let currentSlide = 0;
const slides = document.querySelectorAll(".slide");

setInterval(() => {
    slides.forEach((s,i)=>s.classList.toggle("active", i===currentSlide));
    currentSlide = (currentSlide + 1) % slides.length;
}, 5000);

const form = document.getElementById("reservation-form");
const statusText = document.getElementById("form-status");
const sendBtn = form.querySelector("button");

form.addEventListener("submit", e => {
    e.preventDefault();

    statusText.textContent = "İsteğiniz gönderiliyor...";
    sendBtn.disabled = true;
    sendBtn.style.opacity = "0.6";

    grecaptcha.execute("6LdvRiwsAAAAAJVIJLJht4KJzHDhyFBclezDs5_J", {action:"submit"})
    .then(token => {

        const data = new URLSearchParams({
            name: form.name.value,
            email: form.email.value,
            phone: form.phone.value,
            message: form.message.value,
            referrer: document.referrer || "Direct",
            token
        });

        return fetch("https://script.google.com/macros/s/AKfycbxvOeMaThb3zFJVCZuGdQbJk-dAFH7W06vkoYPCfyfal_GUxF1dvXinEWMZoP8OtKpKcg/exec", {
            method: "POST",
            body: data
        });
    })
    .then(r => r.text())
    .then(res => {
        if(res.trim()==="success"){
            statusText.textContent="İsteğiniz başarıyla gönderildi.";
            form.reset();
        } else {
            statusText.textContent="Güvenlik doğrulaması başarısız.";
        }
        sendBtn.disabled=false;
        sendBtn.style.opacity="1";
    })
    .catch(()=>{
        statusText.textContent="Bağlantı hatası.";
        sendBtn.disabled=false;
        sendBtn.style.opacity="1";
    });
});
});
