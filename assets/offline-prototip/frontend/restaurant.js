document.addEventListener("DOMContentLoaded", () => {

  /* ===============================
     UTIL
  =============================== */
  function generateReservationId() {
    const d = new Date();
    return `RSV-${d.getFullYear()}${String(d.getMonth()+1).padStart(2,"0")}${String(d.getDate()).padStart(2,"0")}-${Math.floor(1000+Math.random()*9000)}`;
  }

  function getHistory() {
    return JSON.parse(localStorage.getItem("reservationHistory")) || [];
  }

  function saveHistory(item) {
    const history = getHistory();
    history.unshift(item);
    localStorage.setItem("reservationHistory", JSON.stringify(history));
  }

  /* ===============================
     ELEMENTS
  =============================== */
  const cards = Array.from(document.querySelectorAll(".restaurant-card"));
  const list = document.getElementById("restaurantList");

  const filterLocation = document.getElementById("filterLocation");
  const filterCuisine = document.getElementById("filterCuisine");
  const sortBy = document.getElementById("sortBy");
  const noResult = document.getElementById("noResult");

  /* ===============================
     FILTER & SORT
  =============================== */
  function applyFilters() {
    let filtered = [...cards];

    if (filterLocation.value) {
      filtered = filtered.filter(c => c.dataset.location === filterLocation.value);
    }

    if (filterCuisine.value) {
      filtered = filtered.filter(c => c.dataset.cuisine === filterCuisine.value);
    }

    if (sortBy.value === "rating") {
      filtered.sort((a,b) => parseFloat(b.dataset.rating||0) - parseFloat(a.dataset.rating||0));
    }

    if (sortBy.value === "name") {
      filtered.sort((a,b) => a.dataset.name.localeCompare(b.dataset.name));
    }

    list.innerHTML = "";

    if (!filtered.length) {
      noResult.style.display = "block";
      return;
    }

    noResult.style.display = "none";
    filtered.forEach(c => list.appendChild(c));
  }

  filterLocation.addEventListener("change", applyFilters);
  filterCuisine.addEventListener("change", applyFilters);
  sortBy.addEventListener("change", applyFilters);

  /* ===============================
     RESERVATION MODAL
  =============================== */
  const modal = document.getElementById("reservationModal");
  const modalName = document.getElementById("modalRestaurantName");
  const closeBtn = modal.querySelector(".close-btn");
  const form = document.getElementById("reservationForm");
  const message = document.getElementById("resMessage");

  const dateInput = document.getElementById("resDate");
  dateInput.min = new Date().toISOString().split("T")[0];

  const timeSelect = document.getElementById("resTime");
  for (let h=0; h<24; h++) {
    const opt = document.createElement("option");
    opt.value = `${String(h).padStart(2,"0")}:00 - ${String((h+1)%24).padStart(2,"0")}:00`;
    opt.textContent = opt.value;
    timeSelect.appendChild(opt);
  }

  const hasAllergy = document.getElementById("hasAllergy");
  const allergyBox = document.getElementById("allergyBox");

  hasAllergy.addEventListener("change", () => {
    allergyBox.style.display = hasAllergy.checked ? "block" : "none";
  });

  let selectedRestaurant = "";

  list.addEventListener("click", e => {
    const btn = e.target.closest(".reserve-btn");
    if (!btn) return;

    const card = btn.closest(".restaurant-card");
    selectedRestaurant = card.dataset.name;
    modalName.textContent = selectedRestaurant;
    modal.style.display = "flex";
  });

  function closeModal() {
    modal.style.display = "none";
    form.reset();
    message.style.display = "none";
    allergyBox.style.display = "none";
  }

  closeBtn.addEventListener("click", closeModal);
  window.addEventListener("click", e => {
    if (e.target === modal) closeModal();
  });

  form.addEventListener("submit", e => {
    e.preventDefault();

    const reservationId = generateReservationId();

    const data = {
      id: reservationId,
      restaurant: selectedRestaurant,
      date: dateInput.value,
      time: timeSelect.value,
      guests: document.getElementById("resGuests").value,
      allergy: hasAllergy.checked
        ? document.getElementById("allergyText").value
        : "Yok",
      note: document.getElementById("resNote").value,
      status: "pending",
      createdAt: new Date().toISOString()
    };

    saveHistory(data);

    message.innerHTML = `
      <strong>Rezervasyon Talebiniz Alındı</strong><br><br>
      <strong>ID:</strong> ${reservationId}<br>
      ${selectedRestaurant}<br>
      ${data.date} • ${data.time}<br><br>
      <span class="status-badge status-pending">⏳ Beklemede</span><br><br>
      Bu bir onay değildir.
    `;
    message.style.display = "block";

    form.reset();
    allergyBox.style.display = "none";
  });

  /* ===============================
     MICHELIN STARS
  =============================== */
  document.querySelectorAll(".meta-icon.michelin").forEach(icon => {
    const stars = parseInt(icon.dataset.stars || "0", 10);
    if (!stars) {
      icon.style.display = "none";
      return;
    }
    icon.textContent = "⭐".repeat(stars);
    icon.title = `${stars} Michelin Yıldızı`;
  });

  /* ===============================
     MOCK REVIEWS
  =============================== */
  const reviewData = {
    "Fatih Tutak": { google: 4.7, trip: 4.5 },
    "Neolokal": { google: 4.6, trip: 4.4 },
    "Serica Restaurant": { google: 4.2, trip: 4.3 },
    "Mürver Restaurant": { google: 4.3, trip: 4.4 }
  };

  document.querySelectorAll(".restaurant-card").forEach(card => {
    const box = card.querySelector(".review-score");
    const data = reviewData[card.dataset.name];
    if (!box || !data) return;

    box.innerHTML = `
      <span>Google: ${data.google}</span>
      <span>Tripadvisor: ${data.trip}</span>
    `;
  });

  /* ===============================
     MAP MODAL
  =============================== */
  const mapModal = document.getElementById("mapModal");
  const mapFrame = document.getElementById("mapFrame");
  const mapTitle = document.getElementById("mapTitle");
  const openInMaps = document.getElementById("openInMaps");
  const closeMap = document.getElementById("closeMap");

  document.querySelectorAll(".map-link").forEach(link => {
    link.addEventListener("click", e => {
      e.preventDefault();
      mapFrame.src = link.dataset.map;
      mapTitle.textContent = link.dataset.title;
      openInMaps.href = link.dataset.map.replace("&output=embed", "");
      mapModal.style.display = "flex";
    });
  });

  closeMap.addEventListener("click", () => {
    mapModal.style.display = "none";
    mapFrame.src = "";
  });

  window.addEventListener("click", e => {
    if (e.target === mapModal) {
      mapModal.style.display = "none";
      mapFrame.src = "";
    }
  });

});
