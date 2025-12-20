document.addEventListener("DOMContentLoaded", () => {

  /* =====================================
     HERO SLIDER
  ===================================== */

  const slider = document.getElementById("heroSlider");
  if (slider) {

    const images = [
      "assets/slider-1.png",
      "assets/slider-2.png",
      "assets/slider-3.png",
      "assets/slider-4.png",
      "assets/slider-5.png",
      "assets/slider-6.png",
      "assets/slider-7.png",
      "assets/slider-8.png",
      "assets/slider-9.png"
    ];

    let currentIndex = 0;

    function changeSlide() {
      slider.style.backgroundImage = `url('${images[currentIndex]}')`;
      currentIndex = (currentIndex + 1) % images.length;
    }

    changeSlide(); // first load
    setInterval(changeSlide, 5000); // 5 saniye
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
      e.preventDefault();

      const key = item.getAttribute("data-service");
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