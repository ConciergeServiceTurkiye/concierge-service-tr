document.addEventListener("DOMContentLoaded", () => {

  /* MOBILE NAV */
  const hamburger = document.getElementById("hamburger");
  const navMenu = document.getElementById("navMenu");
  if(hamburger && navMenu) hamburger.addEventListener("click", () => navMenu.classList.toggle("active"));

  /* HERO SLIDER */
  const slider = document.getElementById("heroSlider");
  if(slider){
    const totalSlides = 9;
    let currentSlide = 0;
    const slides = [];
    for(let i=1;i<=totalSlides;i++){
      const slide = document.createElement("div");
      slide.className="slide";
      slide.style.backgroundImage=`url('assets/slider-${i}.jpg')`;
      slider.appendChild(slide);
      slides.push(slide);
    }
    slides[0].classList.add("active");
    setInterval(()=>{
      slides[currentSlide].classList.remove("active");
      currentSlide=(currentSlide+1)%slides.length;
      slides[currentSlide].classList.add("active");
    },5000);
  }

  /* ======================
     POPUP ALERT FUNCTION
  ====================== */
  const popupAlert = document.getElementById("popupAlert");
  function showPopup(message){
    if(!popupAlert) return;
    popupAlert.textContent = message;
    popupAlert.classList.add("show");
    setTimeout(()=> popupAlert.classList.remove("show"), 3000);
  }

  /* CONTACT FORM */
  const form = document.getElementById("reservation-form");
  if(form){
    const statusText = document.getElementById("form-status");
    const sendBtn = form.querySelector(".send-btn");
    const phoneInput = document.querySelector("#phone");

    function isValidEmail(email){ return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email); }

    // CHAR COUNT
    const textarea = form.querySelector("textarea[name='message']");
    const counter = form.querySelector(".char-count");
    textarea.addEventListener("input", ()=>{ counter.textContent = `${textarea.value.length} / 2000`; });

    // FORM SUBMIT
    form.addEventListener("submit", e=>{
      e.preventDefault();

      // VALIDATION
      if(!form.name.value.trim()){ showPopup("Full Name cannot be empty"); form.name.focus(); return; }
      if(!isValidEmail(form.email.value)){ showPopup("Please enter a valid Email"); form.email.focus(); return; }
      if(!phoneInput.value.trim()){ showPopup("Please enter your phone number"); phoneInput.focus(); return; }
      if(!textarea.value.trim()){ showPopup("Please describe your request"); textarea.focus(); return; }

      // SEND
      sendBtn.disabled = true;
      sendBtn.classList.add("sending");
      showPopup("Sending your request...");

      const data=new URLSearchParams({
        name: form.name.value,
        email: form.email.value,
        phone: phoneInput.value,
        message: textarea.value,
        referrer: document.referrer || "Website"
      });

      fetch("https://script.google.com/macros/s/AKfycbxvOeMaThb3zFJVCZuGdQbJk-dAFH7W06vkoYPCfyfal_GUxF1dvXinEWMZoP8OtKpKcg/exec",
        {method:"POST", body:data})
      .then(()=>{
        showPopup("Your request has been sent successfully.");
        form.reset();
        counter.textContent="0 / 2000";
        statusText.textContent="";
      })
      .catch(()=>{
        showPopup("Connection error. Please try again.");
        statusText.textContent="";
      })
      .finally(()=>{
        sendBtn.disabled=false;
        sendBtn.classList.remove("sending");
        sendBtn.textContent="Send";
      });
    });
  }

  /* PRIVACY & TERMS MODALS */
  const privacyLink=document.getElementById("privacyLink");
  const termsLink=document.getElementById("termsLink");
  const privacyModal=document.getElementById("privacyModal");
  const termsModal=document.getElementById("termsModal");
  const closeButtons=document.querySelectorAll(".close-modal");

  if(privacyLink && privacyModal) privacyLink.addEventListener("click", e=>{ e.preventDefault(); privacyModal.style.display="flex"; });
  if(termsLink && termsModal) termsLink.addEventListener("click", e=>{ e.preventDefault(); termsModal.style.display="flex"; });
  closeButtons.forEach(btn=>{ btn.addEventListener("click", ()=>{ if(privacyModal) privacyModal.style.display="none"; if(termsModal) termsModal.style.display="none"; }); });
  document.addEventListener("keydown", e=>{ if(e.key==="Escape"){ if(privacyModal) privacyModal.style.display="none"; if(termsModal) termsModal.style.display="none"; } });

});
