let reservations = JSON.parse(localStorage.getItem("reservations")) || [];

document.addEventListener("DOMContentLoaded", () => {

  /* ===============================
     MOCK RESERVATION DATA (OFFLINE)
  =============================== */
  let reservations = [
    {
      id: "RSV-1001",
      restaurant: "Fatih Tutak",
      name: "Ahmet Yılmaz",
      date: "2025-01-20",
      time: "19:00 - 20:00",
      guests: 2,
      note: "Alerji: fındık",
      status: "pending"
    },
    {
      id: "RSV-1002",
      restaurant: "Neolokal",
      name: "Elif Demir",
      date: "2025-01-22",
      time: "20:00 - 21:00",
      guests: 4,
      note: "-",
      status: "approved"
    },
    {
      id: "RSV-1003",
      restaurant: "Mürver",
      name: "John Smith",
      date: "2025-01-25",
      time: "18:00 - 19:00",
      guests: 2,
      note: "Window seat",
      status: "pending"
    }
  ];

  const listEl = document.querySelector(".reservation-list");
  const statusFilter = document.getElementById("statusFilter");
  const restaurantFilter = document.getElementById("restaurantFilter");

  /* ===============================
     RENDER
  =============================== */
  function renderReservations() {
    listEl.innerHTML = "";

    let filtered = reservations.filter(r => {
      let statusOk = statusFilter.value === "all" || r.status === statusFilter.value;
      let restaurantOk = restaurantFilter.value === "all" || r.restaurant === restaurantFilter.value;
      return statusOk && restaurantOk;
    });

    if (filtered.length === 0) {
      listEl.innerHTML = "<p style='opacity:.6'>Rezervasyon bulunamadı</p>";
      return;
    }

    filtered.forEach(res => {
      const card = document.createElement("div");
      card.className = "reservation-card";

      card.innerHTML = `
        <div class="reservation-top">
          <span class="reservation-id">${res.id}</span>
          <span class="status-badge ${res.status}">${res.status}</span>
        </div>

        <div class="reservation-body">
          <p><strong>Restaurant:</strong> ${res.restaurant}</p>
          <p><strong>İsim:</strong> ${res.name}</p>
          <p><strong>Tarih:</strong> ${res.date}</p>
          <p><strong>Saat:</strong> ${res.time}</p>
          <p><strong>Kişi:</strong> ${res.guests}</p>
          <p><strong>Not:</strong> ${res.note}</p>
        </div>

        <div class="reservation-actions">
  <button class="approve-btn" ${res.status !== "pending" ? "disabled" : ""}>
    Onayla
  </button>
  <button class="cancel-btn" ${res.status !== "pending" ? "disabled" : ""}>
    İptal
  </button>
</div>
      `;

      /* ACTIONS */
      card.querySelector(".approve-btn").onclick = () => updateStatus(res.id, "approved");
      card.querySelector(".cancel-btn").onclick = () => updateStatus(res.id, "cancelled");

      listEl.appendChild(card);
    });
  }

  /* ===============================
     UPDATE STATUS
  =============================== */
  function updateStatus(id, newStatus) {
  const text =
    newStatus === "approved"
      ? "Rezervasyon onaylansın mı?"
      : "Rezervasyon iptal edilsin mi?";

  if (!confirm(text)) return;

  reservations = reservations.map(r =>
    r.id === id ? { ...r, status: newStatus } : r
  );

  renderReservations();

  showToast(
    newStatus === "approved"
      ? "Rezervasyon onaylandı"
      : "Rezervasyon iptal edildi",
    newStatus === "approved" ? "success" : "cancel"
  );
}

localStorage.setItem("reservations", JSON.stringify(reservations));


  /* ===============================
     FILTER EVENTS
  =============================== */
  statusFilter.addEventListener("change", renderReservations);
  restaurantFilter.addEventListener("change", renderReservations);

  /* ===============================
     INIT
  =============================== */
  renderReservations();

});
function showToast(text, type = "success") {
  const toast = document.getElementById("toast");
  toast.textContent = text;
  toast.className = `toast show ${type}`;

  setTimeout(() => {
    toast.className = "toast";
  }, 2500);
}
