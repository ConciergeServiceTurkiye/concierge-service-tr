document.addEventListener("DOMContentLoaded", () => {

  const buttons = document.querySelectorAll(".filter-btn");
  const cards = document.querySelectorAll(".tour-card");

  buttons.forEach(btn => {
    btn.addEventListener("click", () => {
      buttons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");

      const filter = btn.dataset.filter;

      cards.forEach(card => {
        if (filter === "all" || card.classList.contains(filter)) {
          card.style.display = "flex";
        } else {
          card.style.display = "none";
        }
      });
    });
  });
const tourData = {
  oldcity: {
    title: "Old City Private Tour",
    body: "Sultanahmet bölgesinde Ayasofya, Topkapı Sarayı, Blue Mosque ve Basilica Cistern ziyaretleri. Araçlı veya walking seçenekli, özel planlanmış yarım veya tam gün tur."
  },
  highlights: {
    title: "Istanbul Highlights Tour",
    body: "Old City, Boğaz hattı, panoramik noktalar ve şehrin iki yakasını kapsayan tam günlük özel şehir turu."
  },
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


const modal = document.getElementById("tourModal");
const modalTitle = document.getElementById("modalTitle");
const modalBody = document.getElementById("modalBody");

document.querySelectorAll(".tour-title").forEach(title => {
  title.addEventListener("click", () => {
    const key = title.dataset.tour;
    modalTitle.innerText = tourData[key].title;
    modalBody.innerText = tourData[key].body;
    modal.style.display = "flex";
  });
});

document.querySelector(".close-tour-modal").onclick = () => {
  modal.style.display = "none";
};

modal.addEventListener("click", e => {
  if (e.target === modal) modal.style.display = "none";
});

});

