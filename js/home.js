document.addEventListener("DOMContentLoaded", () => {

  /* =====================================
     HERO SLIDER
  ===================================== */

  const slider = document.getElementById("heroSlider");
  if (slider) {

    const images = [
      "assets/slider-1.jpg",
      "assets/slider-2.jpg",
      "assets/slider-3.jpg",
      "assets/slider-4.jpg",
      "assets/slider-5.jpg",
      "assets/slider-6.jpg",
      "assets/slider-7.jpg",
      "assets/slider-8.jpg",
      "assets/slider-9.jpg"
    ];

    let currentIndex = 0;

   function changeSlide() {
  const nextImage = images[currentIndex];

  // Yeni görseli preload et
  const img = new Image();
  img.src = nextImage;

  img.onload = () => {
    // Fade out
    slider.style.opacity = 0;

    setTimeout(() => {
      // Görseli değiştir
      slider.style.backgroundImage = `url('${nextImage}')`;

      // Fade in
      slider.style.opacity = 1;

      // Index artır
      currentIndex = (currentIndex + 1) % images.length;

    }, 900); // ← yumuşaklık burada
  };
}

    let currentIndex = 0;

const layer = slider.querySelector(".slide-layer");

// İlk görsel
slider.style.backgroundImage = `url('${images[0]}')`;
currentIndex = 1;

function changeSlide() {
  const nextImage = images[currentIndex];

  layer.style.backgroundImage = `url('${nextImage}')`;
  layer.style.opacity = 1;

  setTimeout(() => {
    slider.style.backgroundImage = `url('${nextImage}')`;
    layer.style.opacity = 0;
    currentIndex = (currentIndex + 1) % images.length;
  }, 1200);
}

setInterval(changeSlide, 5000);

  }

  /* =====================================
     SERVICE POPUP
  ===================================== */

  const serviceData = {
    airport: {
      title: "Airport Transfer",
      text: "Luxury airport transfers with VIP assistance, professional chauffeurs and premium vehicles."
    },
    tours: {
      title: "Private City Tours",
      text: "Discover Istanbul and Türkiye with private guides, custom itineraries and exclusive access."
    },
    restaurants: {
      title: "Restaurant Reservations",
      text: "Priority reservations at Michelin-starred and exclusive fine dining restaurants."
    },
    vip: {
      title: "VIP Assistance",
      text: "Fast-track services, meet & greet, protocol assistance and personal concierge support."
    },
    events: {
      title: "Event Organization",
      text: "Private events, celebrations, corporate gatherings and tailor-made experiences."
    }
  };

  const popup = document.getElementById("servicePopup");
  const popupTitle = document.getElementById("popupTitle");
  const popupText = document.getElementById("popupText");
  const closePopup = document.querySelector(".close-popup");

  document.querySelectorAll("[data-service]").forEach(item => {
  item.addEventListener("click", e => {

    const key = item.getAttribute("data-service");

    // 🍽 Restaurant → popup YOK, link çalışsın
    if (key === "restaurants") return;

    e.preventDefault();

    if (!serviceData[key]) return;

    popupTitle.textContent = serviceData[key].title;
    popupText.textContent = serviceData[key].text;
    popup.classList.add("active");
  });
});


  if (closePopup) {
    closePopup.addEventListener("click", () => {
      popup.classList.remove("active");
    });
  }

  if (popup) {
    popup.addEventListener("click", e => {
      if (e.target === popup) {
        popup.classList.remove("active");
      }
    });
  }


});



