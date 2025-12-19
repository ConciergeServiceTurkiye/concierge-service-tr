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
     PHONE MASK ENGINE
  ====================== */

  const BASE_MASK = "+(___) ___________";

  function setCaret(pos){
    requestAnimationFrame(()=> phoneInput.setSelectionRange(pos, pos));
  }

  function resetMask(){
    phoneInput.value = BASE_MASK;
    setCaret(3);
  }

  function digitsOnly(val){
    return val.replace(/\D/g, "");
  }

  function getFirstUnderscore(){
    return phoneInput.value.indexOf("_");
  }

  function dialCodeToIso(dialCode){
    const list = window.intlTelInputGlobals.getCountryData();
    const found = list.find(c => c.dialCode === dialCode);
    return found ? found.iso2 : null;
  }

  function buildMask(iso2, dialCode){
    try {
      const example = window.intlTelInputUtils.getExampleNumber(
        iso2,
        true,
        window.intlTelInputUtils.numberFormat.NATIONAL
      );
      const blanks = example.replace(/\D/g, "_");
      return `+(${dialCode}) ${blanks}`;
    } catch {
      return `+(${dialCode}) ___________`;
    }
  }

  resetMask();

  /* ======================
     KEYDOWN CONTROL
  ====================== */
  phoneInput.addEventListener("keydown", e => {

    // TAB → numara alanına atla
    if(e.key === "Tab"){
      e.preventDefault();
      const pos = getFirstUnderscore();
      if(pos !== -1) setCaret(pos);
      return;
    }

    // sadece rakamlar
    if(!/^\d$/.test(e.key)){
      e.preventDefault();
      return;
    }

    e.preventDefault();

    let value = phoneInput.value;
    const index = getFirstUnderscore();
    if(index === -1) return;

    phoneInput.value =
      value.slice(0, index) + e.key + value.slice(index + 1);

    setCaret(index + 1);
  });

  /* ======================
     INPUT (COUNTRY DETECT)
  ====================== */
  phoneInput.addEventListener("input", () => {

    const rawDigits = digitsOnly(phoneInput.value);
    if(rawDigits.length < 1){
      resetMask();
      return;
    }

    let dialCode = "";
    for(let i=1;i<=3;i++){
      const code = rawDigits.slice(0,i);
      if(dialCodeToIso(code)){
        dialCode = code;
        break;
      }
    }

    if(!dialCode) return;

    const iso2 = dialCodeToIso(dialCode);
    const newMask = buildMask(iso2, dialCode);
    phoneInput.value = newMask;
    setCaret(newMask.indexOf("_"));
  });

  /* ======================
     PASTE CONTROL
  ====================== */
  phoneInput.addEventListener("paste", e => {
    e.preventDefault();
    const pasted = digitsOnly(e.clipboardData.getData("text"));
    if(!pasted) return;

    let value = phoneInput.value;
    let idx = getFirstUnderscore();

    for(const d of pasted){
      if(idx === -1) break;
      value = value.slice(0, idx) + d + value.slice(idx + 1);
      idx = value.indexOf("_");
    }

    phoneInput.value = value;
    if(idx !== -1) setCaret(idx);
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
     SUBMIT
  ====================== */
  form.addEventListener("submit", e=>{
    e.preventDefault();

    if(!form.name.value.trim()){
      showPopup("Full Name cannot be empty"); return;
    }
    if(!isValidEmail(form.email.value)){
      showPopup("Please enter a valid Email"); return;
    }
    if(phoneInput.value.includes("_")){
      showPopup("Please enter a valid phone number"); return;
    }
    if(!textarea.value.trim()){
      showPopup("Please describe your request"); return;
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
