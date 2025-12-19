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
     PHONE MASK CORE
  ====================== */
  const BASE_MASK = "+(___) ___________";

  function setCaret(pos){
    requestAnimationFrame(() => {
      phoneInput.setSelectionRange(pos, pos);
    });
  }

  function resetMask(){
    phoneInput.value = BASE_MASK;
    setCaret(phoneInput.value.indexOf("_"));
  }

  function firstUnderscore(){
    return phoneInput.value.indexOf("_");
  }

  function lastNumberIndexBefore(pos){
    for(let i = pos - 1; i >= 0; i--){
      if(/\d/.test(phoneInput.value[i])) return i;
    }
    return -1;
  }

  function firstNumberIndexAfter(pos){
    for(let i = pos; i < phoneInput.value.length; i++){
      if(/\d/.test(phoneInput.value[i])) return i;
    }
    return -1;
  }

  resetMask();

  /* ======================
     KEYDOWN HANDLER
  ====================== */
  phoneInput.addEventListener("keydown", e => {

    const caret = phoneInput.selectionStart;

    /* TAB → numara alanına atla */
    if(e.key === "Tab"){
      e.preventDefault();
      const pos = firstUnderscore();
      if(pos !== -1) setCaret(pos);
      return;
    }

    /* BACKSPACE */
    if(e.key === "Backspace"){
      e.preventDefault();
      const idx = lastNumberIndexBefore(caret);
      if(idx !== -1){
        phoneInput.value =
          phoneInput.value.slice(0, idx) + "_" + phoneInput.value.slice(idx + 1);
        setCaret(idx);
      }
      return;
    }

    /* DELETE */
    if(e.key === "Delete"){
      e.preventDefault();
      const idx = firstNumberIndexAfter(caret);
      if(idx !== -1){
        phoneInput.value =
          phoneInput.value.slice(0, idx) + "_" + phoneInput.value.slice(idx + 1);
        setCaret(idx);
      }
      return;
    }

    /* SADECE RAKAM */
    if(!/^\d$/.test(e.key)){
      e.preventDefault();
      return;
    }

    e.preventDefault();

    const idx = firstUnderscore();
    if(idx === -1) return;

    phoneInput.value =
      phoneInput.value.slice(0, idx) + e.key + phoneInput.value.slice(idx + 1);

    setCaret(idx + 1);
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
