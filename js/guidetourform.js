document.addEventListener("DOMContentLoaded", () => {

  /* URL → TOUR NAME */
  const params = new URLSearchParams(window.location.search);
  document.getElementById("tourName").value = params.get("tour") || "Private Guide Tour";

  /* PHONE */
  const phone = document.getElementById("phone");
  const iti = intlTelInput(phone, {
    initialCountry: "us",
    separateDialCode: true,
    utilsScript: "https://cdn.jsdelivr.net/npm/intl-tel-input@19.5.4/build/js/utils.js"
  });

  /* DATE */
  flatpickr("#date", {
    minDate: "today",
    dateFormat: "Y-m-d"
  });

  /* CUSTOM SELECTS */
  document.querySelectorAll(".custom-select").forEach(select => {
    const trigger = select.querySelector(".select-trigger");
    const options = select.querySelectorAll("li");
    const hidden = select.nextElementSibling;

    trigger.addEventListener("click", () => {
      select.classList.toggle("open");
    });

    options.forEach(li => {
      li.addEventListener("click", () => {
        trigger.textContent = li.textContent;
        hidden.value = li.textContent;
        select.classList.remove("open");
      });
    });
  });

  /* TEXTAREA COUNTS */
  document.querySelectorAll(".textarea-group textarea").forEach(textarea => {
    const counter = textarea.parentElement.querySelector(".char-count");
    textarea.addEventListener("input", () => {
      counter.textContent = `${textarea.value.length} / ${counter.dataset.max}`;
    });
  });

  /* MOBILITY */
  const mobilityToggle = document.getElementById("mobilityToggle");
  const mobilityGroup = document.getElementById("mobilityGroup");

  mobilityToggle.addEventListener("change", () => {
    mobilityGroup.classList.toggle("active", mobilityToggle.checked);
  });

});
