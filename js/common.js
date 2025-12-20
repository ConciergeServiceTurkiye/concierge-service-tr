document.addEventListener("DOMContentLoaded", () => {

  /* ======================
     MOBILE NAV
  ====================== */
  const hamburger = document.getElementById("hamburger");
  const navMenu = document.getElementById("navMenu");

  if (hamburger && navMenu) {
    hamburger.addEventListener("click", () => {
      navMenu.classList.toggle("active");
    });
  }

  /* ======================
     DROPDOWN (MOBILE)
  ====================== */
  document.querySelectorAll(".dropdown > a").forEach(link => {
    link.addEventListener("click", e => {
      if (window.innerWidth <= 992) {
        e.preventDefault();
        link.nextElementSibling.classList.toggle("active");
      }
    });
  });

  /* ======================
     PRIVACY & TERMS MODALS
  ====================== */
  const privacyLink = document.getElementById("privacyLink");
  const termsLink = document.getElementById("termsLink");
  const privacyModal = document.getElementById("privacyModal");
  const termsModal = document.getElementById("termsModal");
  const closeButtons = document.querySelectorAll(".close-modal");

  if (privacyLink && privacyModal) {
    privacyLink.addEventListener("click", e => {
      e.preventDefault();
      privacyModal.classList.add("active");
    });
  }

  if (termsLink && termsModal) {
    termsLink.addEventListener("click", e => {
      e.preventDefault();
      termsModal.classList.add("active");
    });
  }

  closeButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      privacyModal?.classList.remove("active");
      termsModal?.classList.remove("active");
    });
  });

  window.addEventListener("click", e => {
    if (e.target === privacyModal) privacyModal.classList.remove("active");
    if (e.target === termsModal) termsModal.classList.remove("active");
  });

  document.addEventListener("keydown", e => {
    if (e.key === "Escape") {
      privacyModal?.classList.remove("active");
      termsModal?.classList.remove("active");
    }
  });

});