document.addEventListener("DOMContentLoaded", () => {
  const planForm = document.getElementById("planForm");
  const planActivity = document.getElementById("planActivity");
  const planTime = document.getElementById("planTime");
  const timeGroup = document.getElementById("timeGroup");
  const planMessage = document.getElementById("planMessage");
  const planDate = document.getElementById("planDate");

  // Minimum tarih bugünden
  const today = new Date().toISOString().split("T")[0];
  planDate.setAttribute("min", today);

  const timeOptions = {
    restaurant: ["08:00 Breakfast", "12:30 Lunch", "19:30 Dinner"],
    privateTour: ["09:00", "11:00", "14:00", "16:00"],
    yacht: ["10:00", "13:00", "15:00", "18:00"],
    other: ["08:00", "10:00", "12:00", "14:00", "16:00", "18:00"]
  };

  planActivity.addEventListener("change", () => {
    const selected = planActivity.value;
    planTime.innerHTML = "";
    if (selected && timeOptions[selected]) {
      timeOptions[selected].forEach(t => {
        const option = document.createElement("option");
        option.value = t;
        option.textContent = t;
        planTime.appendChild(option);
      });
      timeGroup.style.display = "block";
    } else {
      timeGroup.style.display = "none";
    }
  });

  planForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const date = planDate.value;
    const activity = planActivity.value;
    const time = planTime.value;
    const extra = document.getElementById("planExtra").value;

    if (!date || !activity || (timeGroup.style.display === "block" && !time)) {
      alert("Lütfen tüm gerekli alanları doldurun!");
      return;
    }

    planMessage.textContent = `Planınız alınmıştır:
Tarih: ${date}
Aktivite: ${activity}
Saat: ${time || "-"}
Ek Bilgi: ${extra || "-"}
    
Bu bir konfirmasyon değildir. Planınız gözden geçiriliyor ve rezervasyonlarınız yapıldığında kısa süre içinde konfirme edilecektir.`;
    planMessage.style.display = "block";

    planForm.reset();
    timeGroup.style.display = "none";
  });
});
