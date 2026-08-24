/* ========================= HTML INCLUDE (NAVBAR & FOOTER) ========================= */
function includeHTML(targetId, file, callback) {
  const scrollY = window.scrollY;
  const isNestedForm = window.location.pathname.includes("/forms/");
  const resolvedFile = isNestedForm ? `../${file}` : file;
  fetch(resolvedFile).then(res => { if (!res.ok) throw new Error(resolvedFile + " yüklenemedi"); return res.text(); }).then(html => {
    const el = document.getElementById(targetId); if (!el) return;
    if (isNestedForm) html = html.replaceAll('src="assets/', 'src="../assets/').replaceAll('href="assets/', 'href="../assets/').replaceAll('href="index.html', 'href="../index.html').replaceAll('href="airport-transfer.html', 'href="../airport-transfer.html').replaceAll('href="guidetours.html', 'href="../guidetours.html').replaceAll('href="restaurants.html', 'href="../restaurants.html').replaceAll('href="vip-assistance.html', 'href="../vip-assistance.html').replaceAll('href="event-organization.html', 'href="../event-organization.html').replaceAll('href="yacht-bosphorus.html', 'href="../yacht-bosphorus.html').replaceAll('href="private-dining.html', 'href="../private-dining.html').replaceAll('href="luxury-shopping.html', 'href="../luxury-shopping.html').replaceAll('href="exclusive-events.html', 'href="../exclusive-events.html').replaceAll('href="contact.html', 'href="../contact.html');
    el.innerHTML = html; setTimeout(() => window.scrollTo(0, scrollY), 0); if (typeof callback === "function") callback();
  }).catch(err => console.error("IncludeHTML Hatası:", err));
}
function initNavbar() {
  const hamburger = document.getElementById("hamburger"), navMenu = document.getElementById("navMenu"); if (!hamburger || !navMenu) return; if (hamburger.dataset.init === "true") return; hamburger.dataset.init = "true";
  hamburger.addEventListener("click", () => navMenu.classList.toggle("active"));
  document.querySelectorAll(".dropdown > a").forEach(link => link.addEventListener("click", e => { if (window.innerWidth <= 992) { const parent = link.parentElement; if (parent.querySelector(".dropdown-menu")) { e.preventDefault(); parent.classList.toggle("open"); document.querySelectorAll(".dropdown").forEach(d => { if (d !== parent) d.classList.remove("open"); }); } } }));
  document.querySelectorAll(".nav-menu a").forEach(a => a.addEventListener("click", () => { if (window.innerWidth <= 992) { const parentLi = a.parentElement; if (parentLi.classList.contains("dropdown")) return; navMenu.classList.remove("active"); document.querySelectorAll(".dropdown").forEach(d => d.classList.remove("open")); } }));
  window.addEventListener("resize", () => { if (window.innerWidth > 992) { navMenu.classList.remove("active"); document.querySelectorAll(".dropdown").forEach(d => d.classList.remove("open")); } });
}
function initModals() {
  const privacyLink = document.getElementById("privacyLink"), termsLink = document.getElementById("termsLink"), privacyModal = document.getElementById("privacyModal"), termsModal = document.getElementById("termsModal");
  document.querySelectorAll(".close-modal").forEach(btn => btn.addEventListener("click", () => { const modal = btn.closest(".modal"); if (modal) modal.style.display = "none"; }));
  if (privacyLink && privacyModal) privacyLink.addEventListener("click", e => { e.preventDefault(); privacyModal.style.display = "flex"; });
  if (termsLink && termsModal) termsLink.addEventListener("click", e => { e.preventDefault(); termsModal.style.display = "flex"; });
  document.querySelectorAll(".modal").forEach(modal => modal.addEventListener("click", e => { if (e.target === modal) modal.style.display = "none"; }));
}
document.addEventListener("DOMContentLoaded", () => {
  includeHTML("navbarInclude", "navbar.html", initNavbar); includeHTML("footerInclude", "footer.html", initModals);
  if (window.location.pathname.includes("/forms/airport-transfer.html")) { const script = document.createElement("script"); script.src = "../js/form-vehicle-gallery.js"; document.body.appendChild(script); }
});