document.addEventListener("DOMContentLoaded", () => {

  /* MOBILE NAV */
  const hamburger = document.getElementById("hamburger");
  const navMenu = document.getElementById("navMenu");
  if(hamburger && navMenu) hamburger.addEventListener("click", () => navMenu.classList.toggle("active"));

  /* CONTACT FORM */
  const form = document.getElementById("reservation-form");
  if(form){
    const statusText = document.getElementById("form-status");
    const sendBtn = form.querySelector(".send-btn");
    const phoneInput = document.querySelector("#phone");

    // intl-tel-input init
    const iti = window.intlTelInput(phoneInput,{
      preferredCountries:["tr","gb","de","fr","us"],
      separateDialCode:true,
      utilsScript:"https://cdn.jsdelivr.net/npm/intl-tel-input@18/build/js/utils.js",
      dropdownContainer: document.body // form yerine body
    });

    function isValidEmail(email){ return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email); }

    // CHAR COUNT
    const textarea = form.querySelector("textarea[name='message']");
    const counter = form.querySelector(".char-count");
    textarea.addEventListener("input", ()=>{ counter.textContent = `${textarea.value.length} / 2000`; });

    // FORM SUBMIT
    form.addEventListener("submit", e=>{
      e.preventDefault();

      // VALIDATION
      if(!form.name.value.trim()){ alert("Full Name cannot be empty"); form.name.focus(); return; }
      if(!isValidEmail(form.email.value)){ alert("Please enter a valid Email"); form.email.focus(); return; }
      if(!iti.isValidNumber()){ alert("Please select your country code and enter a valid phone number"); phoneInput.focus(); return; }
      if(!textarea.value.trim()){ alert("Please describe your request"); textarea.focus(); return; }

      // SEND
      sendBtn.disabled=true;
      sendBtn.classList.add("sending");
      sendBtn.textContent="Sending...";
      statusText.textContent="Sending your request...";

      const data=new URLSearchParams({
        name: form.name.value,
        email: form.email.value,
        phone: iti.getNumber(),
        message: textarea.value,
        referrer: document.referrer || "Website"
      });

      fetch("https://script.google.com/macros/s/AKfycbxvOeMaThb3zFJVCZuGdQbJk-dAFH7W06vkoYPCfyfal_GUxF1dvXinEWMZoP8OtKpKcg/exec",
        {method:"POST", body:data})
      .then(()=>{
        alert("Your request has been sent successfully.");
        form.reset();
        counter.textContent="0 / 2000";
        statusText.textContent="";
      })
      .catch(()=>{
        alert("Connection error. Please try again.");
        statusText.textContent="";
      })
      .finally(()=>{
        sendBtn.disabled=false;
        sendBtn.classList.remove("sending");
        sendBtn.textContent="Send";
      });
    });
  }

});
