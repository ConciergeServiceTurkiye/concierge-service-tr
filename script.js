document.addEventListener("DOMContentLoaded", () => {

  /* ======================
     POPUP ALERT
  ====================== */
  const popupAlert = document.getElementById("popupAlert");
  function showPopup(message){
    if(!popupAlert) return;
    popupAlert.textContent = message;
    popupAlert.classList.add("show");
    setTimeout(()=> popupAlert.classList.remove("show"), 3000);
  }

  /* ======================
     CONTACT FORM
  ====================== */
  const form = document.getElementById("reservation-form");
  if(!form) return;

  const sendBtn = form.querySelector(".send-btn");
  const phoneInput = document.getElementById("phone");
  const textarea = form.querySelector("textarea[name='message']");
  const counter = form.querySelector(".char-count");

  /* ======================
     PHONE MASK (ALL COUNTRIES)
  ====================== */

  const BASE_MASK = "+(___) ___________";

  function setCaret(pos){
    requestAnimationFrame(()=> phoneInput.setSelectionRange(pos, pos));
  }

  function resetMask(){
    phoneInput.value = BASE_MASK;
    setCaret(3);
  }

  resetMask();

  function digitsOnly(val){
    return val.replace(/\D/g, "");
  }

  function dialCodeToIso(dialCode){
    const countries = window.intlTelInputGlobals.getCountryData();
    const match = countries.find(c => c.dialCode === dialCode);
    return match ? match.iso2 : null;
  }

  function buildMaskFromCountry(iso2, dialCode){
    if(!window.intlTelInputUtils || !iso2) return BASE_MASK;

    try {
      const example = window.intlTelInputUtils.getExampleNumber(
        iso2,
        true,
        window.intlTelInputUtils.numberFormat.NATIONAL
      );

      const digits = example.replace(/\D/g, "");
      const blanks = digits.replace(/\d/g, "_");

      return `+(${dialCode}) ${blanks}`;
    } catch {
      return `+(${dialCode}) ___________`;
    }
  }

  phoneInput.addEventListener("focus", ()=>{
    if(!phoneInput.value) resetMask();
  });

  phoneInput.addEventListener("keydown", e=>{
    if(e.key === "Backspace"){
      e.preventDefault();
    }
  });

  phoneInput.addEventListener("input", ()=>{
    let digits = digitsOnly(phoneInput.value);

    if(digits.length < 1){
      resetMask();
      return;
    }

    // read country code (1–3 digits)
    let dialCode = "";
    for(let i=1;i<=3;i++){
      const code = digits.slice(0,i);
      if(dialCodeToIso(code)){
        dialCode = code;
        break;
      }
    }

    if(!dialCode){
      resetMask();
      return;
    }

    const iso2 = dialCodeToIso(dialCode);
    const mask = buildMaskFromCountry(iso2, dialCode);
    phoneInput.value = mask;
    setCaret(mask.indexOf("_"));
  });

  /* ======================
     CHAR COUNT
  ====================== */
  textarea.addEventListener("input", ()=>{
    counter.textContent = `${textarea.value.length} / 2000`;
  });

  function isValidEmail(email){
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  /* ======================
     FORM SUBMIT
  ====================== */
  form.addEventListener("submit", e=>{
    e.preventDefault();

    if(!form.name.value.trim()){
      showPopup("Full Name cannot be empty");
      return;
    }

    if(!isValidEmail(form.email.value)){
      showPopup("Please enter a valid Email");
      return;
    }

    if(phoneInput.value.includes("_")){
      showPopup("Please enter a valid phone number");
      return;
    }

    if(!textarea.value.trim()){
      showPopup("Please describe your request");
      return;
    }

    sendBtn.disabled = true;
    showPopup("Sending your request...");

    const data = new URLSearchParams({
      name: form.name.value,
      email: form.email.value,
      phone: phoneInput.value,
      message: textarea.value,
      referrer: document.referrer || "Website"
    });

    fetch("https://script.google.com/macros/s/AKfycbxvOeMaThb3zFJVCZuGdQbJk-dAFH7W06vkoYPCfyfal_GUxF1dvXinEWMZoP8OtKpKcg/exec",
      { method:"POST", body:data }
    )
    .then(()=>{
      showPopup("Your request has been sent successfully.");
      form.reset();
      counter.textContent = "0 / 2000";
      resetMask();
    })
    .catch(()=>{
      showPopup("Connection error. Please try again.");
    })
    .finally(()=>{
      sendBtn.disabled = false;
    });
  });

});
