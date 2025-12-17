document.addEventListener("DOMContentLoaded", () => {

  /* MOBILE NAV */
  const hamburger = document.getElementById("hamburger");
  const navMenu = document.getElementById("navMenu");

  if (hamburger && navMenu) {
    hamburger.addEventListener("click", () => {
      navMenu.classList.toggle("active");
    });
  }

  /* HERO SLIDER */
  const slider = document.getElementById("heroSlider");

  if (slider) {
    const totalSlides = 9;
    let currentSlide = 0;
    const slides = [];

    for (let i = 1; i <= totalSlides; i++) {
      const slide = document.createElement("div");
      slide.className = "slide";
      slide.style.backgroundImage = `url('assets/slider-${i}.png')`;
      slider.appendChild(slide);
      slides.push(slide);
    }

    slides[0].classList.add("active");

    setInterval(() => {
      slides[currentSlide].classList.remove("active");
      currentSlide = (currentSlide + 1) % slides.length;
      slides[currentSlide].classList.add("active");
    }, 5000);
  }

  /* PRIVACY & TERMS MODALS */
  const privacyLink = document.getElementById("privacyLink");
  const termsLink = document.getElementById("termsLink");
  const privacyModal = document.getElementById("privacyModal");
  const termsModal = document.getElementById("termsModal");
  const closeButtons = document.querySelectorAll(".close-modal");

  if (privacyLink && privacyModal) {
    privacyLink.addEventListener("click", e => {
      e.preventDefault();
      privacyModal.style.display = "flex";
    });
  }

  if (termsLink && termsModal) {
    termsLink.addEventListener("click", e => {
      e.preventDefault();
      termsModal.style.display = "flex";
    });
  }

  closeButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      if (privacyModal) privacyModal.style.display = "none";
      if (termsModal) termsModal.style.display = "none";
    });
  });

  document.addEventListener("keydown", e => {
    if (e.key === "Escape") {
      if (privacyModal) privacyModal.style.display = "none";
      if (termsModal) termsModal.style.display = "none";
    }
  });

});
