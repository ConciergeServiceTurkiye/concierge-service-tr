document.addEventListener("DOMContentLoaded", () => {
  const infoButtons = document.querySelectorAll(".info-btn");

  infoButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      const messageDiv = btn.nextElementSibling;
      const infoText = btn.dataset.info;
      messageDiv.innerText = infoText;
      messageDiv.style.display = messageDiv.style.display === "block" ? "none" : "block";
    });
  });
});
