document.addEventListener("DOMContentLoaded", () => {

  const buttons = document.querySelectorAll(".filter-btn");
  const cards = document.querySelectorAll(".tour-card");

  buttons.forEach(btn => {
    btn.addEventListener("click", () => {
      buttons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");

      const filter = btn.dataset.filter;

      cards.forEach(card => {
        card.style.display =
          filter === "all" || card.classList.contains(filter)
            ? "flex"
            : "none";
      });
    });
  });
const tourData = {
  oldcity: {
      title: "Old City Private Tour",
      img: "assets/oldcityprivatetour.jpg",
      desc: "Explore Sultanahmet with a private licensed guide including Hagia Sophia, Blue Mosque, Topkapi Palace and Basilica Cistern.",
      highlights: [
        "Hagia Sophia & Blue Mosque",
        "Topkapi Palace",
        "Basilica Cistern",
        "Private chauffeur or walking option"
      ]
    }
  };
  bosphorus: {
    title: "Bosphorus Shore Experience",
    body: "Ortaköy, Bebek, Arnavutköy boyunca sahil hattı, fotoğraf molaları ve Boğaz manzaralı duraklar."
  },
  streetfood: {
    title: "Street Food Discovery",
    body: "Eminönü, Karaköy veya Kadıköy’de İstanbul’un sokak lezzetlerini keşfettiğiniz local deneyim."
  },
  cuisine: {
    title: "Turkish Cuisine Experience",
    body: "Geleneksel Türk mutfağını temsil eden seçilmiş restoranlarda meze kültürü, ana yemekler ve tatlılarla gastronomi odaklı deneyim."
  },
  asian: {
    title: "Asian Side Tour",
    body: "Kadıköy, Moda, Çamlıca Tepesi ve Üsküdar sahil hattını kapsayan, İstanbul’un daha local yüzünü gösteren yarım günlük tur."
  },
  custom: {
    title: "Tailor-Made City Tour",
    body: "Misafirin ilgi alanı, zamanı ve beklentilerine göre sıfırdan planlanan, tamamen kişiye özel şehir turu."
  }
};


 const modal = document.getElementById("tourDetailModal");
  const titleEl = document.getElementById("tourDetailTitle");
  const descEl = document.getElementById("tourDetailDesc");
  const imgEl = document.getElementById("tourDetailImg");
  const listEl = document.getElementById("tourDetailList");

document.querySelectorAll(".tour-title").forEach(title => {
    title.addEventListener("click", () => {
      const key = title.dataset.tour;
      const data = tourData[key];
      if (!data) return;

      titleEl.innerText = data.title;
      descEl.innerText = data.desc;
      imgEl.src = data.img;

      listEl.innerHTML = "";
      data.highlights.forEach(h => {
        const li = document.createElement("li");
        li.textContent = h;
        listEl.appendChild(li);
      });

      modal.style.display = "flex";
      document.body.style.overflow = "hidden";
    });
  });

  document.querySelector(".close-tour-detail").onclick = closeModal;
  document.querySelector(".tour-detail-overlay").onclick = closeModal;

  function closeModal() {
    modal.style.display = "none";
    document.body.style.overflow = "";
  }

});


