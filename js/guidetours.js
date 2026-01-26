document.addEventListener("DOMContentLoaded", () => {

  const isFormPage = document.body.classList.contains("tour-form-page");
  const transportGroup = document.getElementById("transportationGroup");

  let tourName = "Private Guide Tour";

  if (isFormPage) {
    const params = new URLSearchParams(window.location.search);
    const urlTour = params.get("tour");

    if (urlTour) {
      tourName = decodeURIComponent(urlTour.replace(/\+/g, " "));
    }
  }

  const tourNameInput = document.getElementById("tourName");
  const tourFormTitle = document.querySelector(".guide-form-title");
  const tourExperienceBox = document.getElementById("tourExperience");

  if (tourNameInput) tourNameInput.value = tourName;
  if (tourFormTitle) tourFormTitle.textContent = tourName;


  const TOUR_EXPERIENCES = {
    "Old City Private Tour": `
      <strong>What you'll experience</strong><br>
      • Byzantine & Ottoman heritage with a licensed private guide<br>
      • Hagia Sophia, Blue Mosque & Grand Bazaar storytelling<br>
      • Hidden courtyards & local insights<br>
      • Walking or vehicle-assisted options
    `,

    "Istanbul Highlights Tour": `<strong>What you'll experience</strong><br>`,
    
    "Bosphorus Shore Experience": `
      <strong>What you'll experience</strong><br>
      • Scenic Bosphorus coastline narration<br>
      • Palaces, waterfront mansions & local life<br>
      • Relaxed, non-rushed private experience
    `,
    "Street Food Discovery": `
      <strong>What you'll experience</strong><br>
      • Authentic local flavors beyond tourist routes<br>
      • Street food & traditional restaurants<br>
      • Cultural stories behind Turkish cuisine
    `,
    "Turkish Cuisine Experience": `<strong>What you'll experience</strong><br>`,

    "Asian Side Tour": `<strong>What you'll experience</strong><br>`,
  };

  if (tourExperienceBox) {
    tourExperienceBox.innerHTML = TOUR_EXPERIENCES[tourName] || "";
  }

/* MODAL DATA */
const TOUR_DETAILS = {
  oldcity: {
    title: "Old City Private Tour",
    img: "assets/oldcityprivatetour.jpg",
    desc: "Explore the historic heart of Istanbul with a licensed private guide.",
    highlights: [
      "Hagia Sophia & Blue Mosque",
      "Topkapi Palace & Basilica Cistern",
      "Flexible walking or chauffeured option"
    ]
  },
  highlights: {
    title: "Istanbul Highlights Tour",
    img: "assets/istanbulhighlights.jpg",
    desc: "A full-day panoramic experience covering the city's icons.",
    highlights: [
      "Old City landmarks",
      "Bosphorus coastline",
      "Panoramic viewpoints"
    ]
  },
  bosphorus: {
    title: "Bosphorus Shore Experience",
    img: "assets/bosphorus.jpg",
    desc: "Relaxed coastal drive along the Bosphorus with photo stops.",
    highlights: [
      "Ortakoy & Bebek",
      "Waterfront mansions",
      "Scenic viewpoints"
    ]
  },
  streetfood: {
    title: "Street Food Discovery",
    img: "assets/streetfood.jpg",
    desc: "Taste Istanbul like a local with a culinary expert.",
    highlights: [
      "Authentic street flavors",
      "Local neighborhoods",
      "Cultural food stories"
    ]
  },
  cuisine: {
    title: "Turkish Cuisine Experience",
    img: "assets/turkishcuisine.jpg",
    desc: "A refined journey through Turkish gastronomy.",
    highlights: [
      "Traditional meze culture",
      "Handpicked restaurants",
      "Local wine & rakı pairings"
    ]
  },
  asian: {
    title: "Asian Side Tour",
    img: "assets/asianside.jpg",
    desc: "Discover Istanbul’s Asian side with a local perspective.",
    highlights: [
      "Kadikoy & Moda",
      "Camlica Hill",
      "Uskudar waterfront"
    ]
  }
};


/*MODAL OPEN/CLOSE LOGIC*/
const modal = document.getElementById("tourDetailModal");
const modalImg = document.getElementById("tourDetailImg");
const modalTitle = document.getElementById("tourDetailTitle");
const modalDesc = document.getElementById("tourDetailDesc");
const modalList = document.getElementById("tourDetailList");
const modalClose = document.querySelector(".close-tour-detail");

/*KART TIKLANINCA MODAL AÇ*/
document.querySelectorAll(".tour-card").forEach(card => {
  card.addEventListener("click", e => {
    e.preventDefault();

    const key = card.dataset.tour;
    const data = TOUR_DETAILS[key];
    if (!data) return;

    modalImg.src = data.img;
    modalTitle.textContent = data.title;
    modalDesc.textContent = data.desc;

    modalList.innerHTML = "";
    data.highlights.forEach(item => {
      const li = document.createElement("li");
      li.textContent = item;
      modalList.appendChild(li);
    });

      // 👉 Modal içindeki Request butonunu ayarla
const modalRequestBtn = document.getElementById("requestTourBtn");
modalRequestBtn.href = `guidetourform.html?tour=${encodeURIComponent(data.title)}`;

    modal.style.display = "flex";
    document.body.style.overflow = "hidden";
  });
});

document.querySelectorAll(".tour-btn").forEach(btn => {
  btn.addEventListener("click", e => {
    e.stopPropagation(); // 👈 kart click’ini öldür
  });
});

/*MODAL KAPATMA*/
modalClose.addEventListener("click", () => {
  modal.style.display = "none";
  document.body.style.overflow = "";
});

modal.addEventListener("click", e => {
  if (e.target.classList.contains("tour-detail-overlay")) {
    modal.style.display = "none";
    document.body.style.overflow = "";
  }
});
 
/* =========================
   TOUR FILTERS
========================= */
const filterButtons = document.querySelectorAll(".filter-btn");
const tourCards = document.querySelectorAll(".tour-card");
const tourGrid = document.getElementById("tourGrid");

function updateGridAlignment() {
  if (!tourGrid) return;

  const visibleCards = [...tourCards].filter(
    card => card.style.display !== "none"
  );

  tourGrid.classList.remove("center-1", "center-2");

  if (visibleCards.length === 1) {
    tourGrid.classList.add("center-1");
  } else if (visibleCards.length === 2) {
    tourGrid.classList.add("center-2");
  }
}

filterButtons.forEach(btn => {
  btn.addEventListener("click", () => {

    // active class
    filterButtons.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");

    const filter = btn.dataset.filter;

    tourCards.forEach(card => {
      if (filter === "all") {
        card.style.display = "";
      } else {
        card.style.display = card.classList.contains(filter)
          ? ""
          : "none";
      }
    });

    // 👇 KRİTİK SATIR (cerrahi nokta)
    updateGridAlignment();
  });
});
});





