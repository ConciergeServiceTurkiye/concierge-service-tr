document.addEventListener("DOMContentLoaded", () => {

  /* ======================
     POPUP ALERT
  ====================== */
  const popupAlert = document.getElementById("popupAlert");
  function showPopup(message){
    popupAlert.textContent = message;
    popupAlert.classList.add("show");
    setTimeout(() => popupAlert.classList.remove("show"), 3000);
  }

  const form = document.getElementById("reservation-form");
  if(!form) return;

  const phoneInput = document.getElementById("phone");
  const sendBtn = form.querySelector(".send-btn");
  const textarea = form.querySelector("textarea[name='message']");
  const counter = form.querySelector(".char-count");

  /* ======================
     PHONE MASK SYSTEM
  ====================== */

  let countryCode = "";
  let numberMask = "___ ___ ____";

  function buildValue(){
    return `+(${countryCode}) ${numberMask}`;
  }

  function setCaret(pos){
    requestAnimationFrame(() => {
      phoneInput.setSelectionRange(pos, pos);
    });
  }

  function resetPhone(){
    countryCode = "";
    numberMask = "___ ___ ____";
    phoneInput.value = "+() ___ ___ ____";
    setCaret(2);
  }

  resetPhone();

  function firstNumberUnderscore(){
    return phoneInput.value.indexOf("_");
  }

  phoneInput.addEventListener("keydown", e => {
    const caret = phoneInput.selectionStart;

    /* TAB → numaraya geç */
    if(e.key === "Tab"){
      e.preventDefault();
      const pos = firstNumberUnderscore();
      if(pos !== -1) setCaret(pos);
      return;
    }

    /* SADECE RAKAM */
    if(!/^\d$/.test(e.key)){
      if(["Backspace","Delete"].includes(e.key)){
        e.preventDefault();

        /* NUMARA ALANI */
        const idx = caret - 1;
        if(idx > phoneInput.value.indexOf(")")){
          phoneInput.value =
            phoneInput.value.slice(0, idx) + "_" + phoneInput.value.slice(idx + 1);
          setCaret(idx);
        }

        /* COUNTRY CODE */
        if(idx > 1 && idx < phoneInput.value.indexOf(")")){
          countryCode = countryCode.slice(0, -1);
          phoneInput.value = buildValue();
          setCaret(2 + countryCode.length);
        }
      }
      return;
    }

    e.preventDefault();

    /* COUNTRY CODE YAZIMI */
    if(caret <= phoneInput.value.indexOf(")")){
      if(countryCode.length < 3){
        countryCode += e.key;
        phoneInput.value = buildValue();
        setCaret(2 + countryCode.length);
      }
      return;
    }

    /* PHONE NUMBER YAZIMI */
    const idx = firstNumberUnderscore();
    if(idx === -1) return;

    phoneInput.value =
      phoneInput.value.slice(0, idx) + e.key + phoneInput.value.slice(idx + 1);
    setCaret(idx + 1);
  });

  /* ======================
     CHAR COUNT
  ====================== */
  textarea.addEventListener("input", () => {
    counter.textContent = `${textarea.value.length} / 2000`;
  });

  function isValidEmail(email){
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  /* ======================
     SUBMIT
  ====================== */
  form.addEventListener("submit", e => {
    e.preventDefault();

    if(!form.name.value.trim()){
      showPopup("Full Name cannot be empty"); return;
    }
    if(!isValidEmail(form.email.value)){
      showPopup("Please enter a valid Email"); return;
    }
    if(phoneInput.value.includes("_") || !countryCode){
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
      { method: "POST", body: data }
    )
    .then(() => {
      showPopup("Your request has been sent successfully.");
      form.reset();
      counter.textContent = "0 / 2000";
      resetPhone();
    })
    .catch(() => {
      showPopup("Connection error. Please try again.");
    })
    .finally(() => {
      sendBtn.disabled = false;
    });
  });

});
