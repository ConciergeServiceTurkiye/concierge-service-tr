/* =========================
   HTML INCLUDE (NAVBAR & FOOTER)
========================= */
function includeHTML(targetId, file, callback) {
  fetch(file)
    .then(res => res.text())
    .then(html => {
      const el = document.getElementById(targetId);
      if (!el) return;
      el.innerHTML = html;
      if (typeof callback === "function") callback();
    });
}

/* =========================
   NAVBAR INIT (HAMBURGER + DROPDOWNS)
========================= */
function initNavbar() {
  const hamburger = document.getElementById("hamburger");
  const navMenu = document.getElementById("navMenu");

  if (!hamburger || !navMenu) return;

  // Hamburger
  hamburger.addEventListener("click", () => {
    navMenu.classList.toggle("active");
  });

  // Dropdowns (mobile)
  document.querySelectorAll(".dropdown > a").forEach(link => {
    link.addEventListener("click", e => {
      if (window.innerWidth <= 992) {
        e.preventDefault();
        const parent = link.parentElement;
        parent.classList.toggle("open");

        document.querySelectorAll(".dropdown").forEach(d => {
          if (d !== parent) d.classList.remove("open");
        });
      }
    });
  });

  // Link tıklanınca menüyü kapat
  document.querySelectorAll(".nav-menu a").forEach(a => {
    a.addEventListener("click", () => {
      if (window.innerWidth <= 992) {
        navMenu.classList.remove("active");
        document
          .querySelectorAll(".dropdown")
          .forEach(d => d.classList.remove("open"));
      }
    });
  });
}

/* =========================
   MODALS (PRIVACY / TERMS)
========================= */
function initModals() {
  const privacyLink = document.getElementById("privacyLink");
  const termsLink = document.getElementById("termsLink");
  const privacyModal = document.getElementById("privacyModal");
  const termsModal = document.getElementById("termsModal");

  document.querySelectorAll(".close-modal").forEach(btn => {
    btn.addEventListener("click", () => {
      btn.closest(".modal").style.display = "none";
    });
  });

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

  window.addEventListener("click", e => {
    if (e.target.classList.contains("modal")) {
      e.target.style.display = "none";
    }
  });
}

/* =========================
   PAGE LOAD
========================= */
document.addEventListener("DOMContentLoaded", () => {
  includeHTML("navbarInclude", "navbar.html", initNavbar);
  includeHTML("footerInclude", "footer.html", initModals);
});
