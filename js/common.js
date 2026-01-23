/* ========================= HTML INCLUDE (NAVBAR & FOOTER) ========================= */
function includeHTML(targetId, file, callback) {
  const scrollY = window.scrollY;

  fetch(file)
    .then(res => {
      if (!res.ok) {
        throw new Error(file + " yüklenemedi");
      }
      return res.text();
    })
    .then(html => {
      const el = document.getElementById(targetId);
      if (!el) return;

      el.innerHTML = html;

      // Scroll pozisyonunu güvenli şekilde geri al
      setTimeout(() => {
        window.scrollTo(0, scrollY);
      }, 0);

      if (typeof callback === "function") callback();
    })
    .catch(err => {
      console.error("IncludeHTML Hatası:", err);
    });
}

/* ========================= NAVBAR INIT (HAMBURGER + DROPDOWNS) ========================= */
function initNavbar() {
  const hamburger = document.getElementById("hamburger");
  const navMenu = document.getElementById("navMenu");

  if (!hamburger || !navMenu) return;

  // Aynı event'lerin tekrar eklenmesini önle
  if (hamburger.dataset.init === "true") return;
  hamburger.dataset.init = "true";

  // Hamburger toggle
  hamburger.addEventListener("click", () => {
    navMenu.classList.toggle("active");
  });

  // Dropdown parent click (mobile)
  document.querySelectorAll(".dropdown > a").forEach(link => {
    link.addEventListener("click", e => {
      if (window.innerWidth <= 992) {
        const parent = link.parentElement;

        if (parent.querySelector(".dropdown-menu")) {
          e.preventDefault();

          parent.classList.toggle("open");

          document.querySelectorAll(".dropdown").forEach(d => {
            if (d !== parent) d.classList.remove("open");
          });
        }
      }
    });
  });

  // Normal link tıklanınca menüyü kapat
  document.querySelectorAll(".nav-menu a").forEach(a => {
    a.addEventListener("click", () => {
      if (window.innerWidth <= 992) {
        const parentLi = a.parentElement;

        if (parentLi.classList.contains("dropdown")) return;

        navMenu.classList.remove("active");
        document
          .querySelectorAll(".dropdown")
          .forEach(d => d.classList.remove("open"));
      }
    });
  });

  // Ekran büyüyünce mobil menüyü sıfırla
  window.addEventListener("resize", () => {
    if (window.innerWidth > 992) {
      navMenu.classList.remove("active");
      document
        .querySelectorAll(".dropdown")
        .forEach(d => d.classList.remove("open"));
    }
  });
}

/* ========================= MODALS (PRIVACY / TERMS + GENEL) ========================= */
function initModals() {
  const privacyLink = document.getElementById("privacyLink");
  const termsLink = document.getElementById("termsLink");
  const privacyModal = document.getElementById("privacyModal");
  const termsModal = document.getElementById("termsModal");

  // Kapatma butonları
  document.querySelectorAll(".close-modal").forEach(btn => {
    btn.addEventListener("click", () => {
      const modal = btn.closest(".modal");
      if (modal) modal.style.display = "none";
    });
  });

  // Privacy modal
  if (privacyLink && privacyModal) {
    privacyLink.addEventListener("click", e => {
      e.preventDefault();
      privacyModal.style.display = "flex";
    });
  }

  // Terms modal
  if (termsLink && termsModal) {
    termsLink.addEventListener("click", e => {
      e.preventDefault();
      termsModal.style.display = "flex";
    });
  }

  /* Modal arka planına tıklayınca kapat (GÜVENLİ YÖNTEM)*/
  document.querySelectorAll(".modal").forEach(modal => {
    modal.addEventListener("click", e => {
      if (e.target === modal) {
        modal.style.display = "none";
      }
    });
  });
}

/* ========================= PAGE LOAD ========================= */
document.addEventListener("DOMContentLoaded", () => {
  includeHTML("navbarInclude", "navbar.html", initNavbar);
  includeHTML("footerInclude", "footer.html", initModals);
});
