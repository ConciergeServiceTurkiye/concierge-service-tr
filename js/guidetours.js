document.addEventListener("DOMContentLoaded", () => {

  /* =========================
     FILTER BUTTONS
  ========================= */
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

  /* =========================
     TOUR DATA
  ========================= */
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
    },
    bosphorus: {
      title: "Bosphorus Shore Experience",
      img: "assets/bosphorus.jpg",
      desc: "Ortaköy, Bebek, Arnavutköy shoreline with photo stops and Bosphorus views.",
      highlights: [
        "Scenic coastal route",
        "Photo stops",
        "Local neighborhoods",
        "Private chauffeur"
      ]
    },
    streetfood: {
      title: "Street Food Discovery",
      img: "assets/streetfood.jpg",
      desc: "Discover Istanbul’s iconic street flavors in Eminönü, Karaköy or Kadıköy.",
      highlights: [
        "Local tastes",
        "Hidden spots",
        "Authentic experience"
      ]
    },
    cuisine: {
      title: "Turkish Cuisine Experience",
      img: "assets/cuisine.jpg",
      desc: "A refined gastronomy-focused experience at selected Turkish restaurants.",
      highlights: [
        "Meze culture",
        "Traditional dishes",
        "Desserts & stories"
      ]
    },
    asian: {
      title: "Asian Side Tour",
      img: "assets/asian.jpg",
      desc: "Kadıköy, Moda, Çamlıca Hill and Üsküdar waterfront exploration.",
      highlights: [
        "Local neighborhoods",
        "Scenic views",
        "Half-day tour"
      ]
    },
    custom: {
      title: "Tailor-Made City Tour",
      img: "assets/custom.jpg",
      desc: "Fully customized private city tour designed around guest preferences.",
      highlights: [
        "100% personalized",
        "Flexible timing",
        "Luxury planning"
      ]
    }
  };

  /* =========================
     MODAL ELEMENTS
  ========================= */
  const modal = document.getElementById("tourDetailModal");
  const titleEl = document.getElementById("tourDetailTitle");
  const descEl = document.getElementById("tourDetailDesc");
  const imgEl = document.getElementById("tourDetailImg");
  const listEl = document.getElementById("tourDetailList");

  /* =========================
     OPEN MODAL FROM CARD
  ========================= */
  document.querySelectorAll(".tour-card").forEach(card => {
    card.addEventListener("click", () => {
      const key = card.dataset.tour;
      const data = tourData[key];
      if (!data) return;

      titleEl.innerText = data.title;
      descEl.innerText = data.desc;
      imgEl.src = data.img;

      listEl.innerHTML = "";
      if (data.highlights) {
        data.highlights.forEach(h => {
          const li = document.createElement("li");
          li.textContent = h;
          listEl.appendChild(li);
        });
      }

      modal.style.display = "flex";
      document.body.style.overflow = "hidden";
    });
  });

  /* =========================
     BUTTON CLICK = NO MODAL
  ========================= */
  document.querySelectorAll(".tour-btn").forEach(btn => {
    btn.addEventListener("click", e => {
      e.stopPropagation();
      // burada request / form logic olabilir
    });
  });

  /* =========================
     CLOSE MODAL
  ========================= */
  function closeModal() {
    modal.style.display = "none";
    document.body.style.overflow = "";
  }

  document.querySelector(".close-tour-detail").onclick = closeModal;
  document.querySelector(".tour-detail-overlay").onclick = closeModal;

});
