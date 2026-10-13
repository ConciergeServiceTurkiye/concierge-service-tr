document.addEventListener("DOMContentLoaded",()=>{
  const form=document.getElementById("serviceForm");
  if(!form)return;
  const $=id=>document.getElementById(id);
  const alertBox=$("formInlineAlert"),submit=form.querySelector('[type="submit"]'),status=$("transferSubmitStatus");
  const email=$("email"),phone=$("phone"),message=$("message"),passengerCount=$("passengerCount"),passengerFields=$("passengerFields"),vehiclePlan=$("vehiclePlan");
  const seatGroup=$("seatRequestGroup"),seatRequest=$("seatRequest"),travelDate=$("travelDate"),returnDate=$("returnDate"),flightNumber=$("flightNumber"),returnFlightNumber=$("returnFlightNumber");
  const pickup=$("pickup"),dropoff=$("dropoff"),pickupTime=$("pickupTime"),returnTime=$("returnTime");
  const returnDateGroup=$("returnDateGroup"),returnTimeLocationRow=$("returnTimeLocationRow"),returnLocationRow=$("returnLocationRow"),returnTransferPanel=$("returnTransferPanel");
  const contactOptions=Array.from(form.querySelectorAll('input[name="contactMethod"]')),tripOptions=Array.from(form.querySelectorAll('input[name="tripType"]'));
  
  

  phone.value=phone.value.startsWith("+")?phone.value:"+";
  phone.addEventListener("focus",()=>{if(!phone.value.startsWith("+"))phone.value="+"+phone.value.replace(/\D/g,"");requestAnimationFrame(()=>phone.setSelectionRange(phone.value.length,phone.value.length))});
  phone.addEventListener("keydown",e=>{const s=phone.selectionStart||0;if(["Tab","ArrowLeft","ArrowRight","End"].includes(e.key))return;if(e.key==="Home"){e.preventDefault();phone.setSelectionRange(1,1);return}if(e.key==="Backspace"&&s<=1){e.preventDefault();phone.setSelectionRange(1,1);return}if(e.key==="Delete"&&s===0){e.preventDefault();phone.setSelectionRange(1,1);return}if(e.ctrlKey||e.metaKey||["Backspace","Delete"].includes(e.key))return;if(!/^\d$/.test(e.key))e.preventDefault()});
  phone.addEventListener("input",()=>{phone.value="+"+phone.value.replace(/\D/g,"")});
  phone.addEventListener("paste",()=>setTimeout(()=>phone.value="+"+phone.value.replace(/\D/g,""),0));
  const params=new URLSearchParams(location.search),vehicle=params.get("vehicle"),capacity=params.get("capacity");
  const vehicleBox=$("selectedVehicleBox"),vehicleName=$("selectedVehicleName"),vehicleCapacity=$("selectedVehicleCapacity"),selectedVehicle=$("selectedVehicle"),selectedCapacity=$("selectedCapacity");
  if(vehicle){vehicleName.textContent=vehicle;vehicleCapacity.textContent=capacity||"";vehicleBox.hidden=false;selectedVehicle.value=vehicle;selectedCapacity.value=capacity||"";vehicleName.href='../airport-transfer.html?viewVehicle='+encodeURIComponent(vehicle)}
  const normalized=(vehicle||"").toLowerCase(),isSedan=/e[- ]?class|s[- ]?class/.test(normalized),m=(capacity||"").match(/(\d+)\s*[-–]\s*(\d+)|(\d+)/);let vehicleMin=m?Number(m[1]||m[3]):1,vehicleMax=m?Number(m[2]||m[3]):13;if(isSedan){vehicleMin=1;vehicleMax=3}
  passengerCount.innerHTML="";
  const ph=document.createElement("option");ph.value="";ph.textContent="Please select number of passengers";ph.disabled=true;ph.selected=true;passengerCount.appendChild(ph);
  for(let i=vehicleMin;i<=vehicleMax;i++){const o=document.createElement("option");o.value=i;o.textContent=String(i);passengerCount.appendChild(o)}
  passengerCount.value="1";
  seatRequest.value="0";
  if(isSedan){seatGroup.hidden=true;seatGroup.style.setProperty("display","none","important");seatRequest.value="0"}else{seatGroup.hidden=false;seatGroup.style.removeProperty("display")}
  function syncSelectColor(el){el.classList.toggle("has-selection",el.value!==""&&!(el===seatRequest&&el.value==="0"))}
  function makeLuxurySelect(select){
    // Keep the native select interaction, matching the Contact subject dropdown.
    const refresh=()=>syncSelectColor(select);
    select.addEventListener("change",refresh);
    refresh();
    return{refresh,trigger:null,list:null};
  }
  const passengerLuxury=makeLuxurySelect(passengerCount),seatLuxury=makeLuxurySelect(seatRequest),passengerNameCache={};
  function rememberPassengerNames(){passengerFields.querySelectorAll(".passenger-row input").forEach(input=>{const n=input.dataset.passengerNumber;if(n)passengerNameCache[n]=input.value})}
  function renderPassengers(){
    rememberPassengerNames();passengerFields.querySelectorAll(".passenger-row").forEach(el=>el.remove());const n=Number(passengerCount.value||0);
    if(!n){vehiclePlan.value="";return}
    for(let i=1;i<=n;i++){const row=document.createElement("div");row.className="passenger-row";row.innerHTML='<input id="passenger-'+i+'" name="passenger_'+i+'" data-passenger-number="'+i+'" type="text" aria-label="Full name of passenger - '+i+'" placeholder="Full name of passenger - '+i+'" minlength="2" maxlength="100" required>';const input=row.querySelector("input");input.value=passengerNameCache[i]||"";input.addEventListener("input",()=>clearFieldError(input));passengerFields.appendChild(row)}
    vehiclePlan.value=n>vehicleMax?'Multiple vehicles required for '+n+' passengers':vehicle?'1 x '+vehicle:"";
  }
  function clearFieldError(field){if(field)field.classList.remove("field-error")}
  function markFieldError(field){if(field)field.classList.add("field-error")}
  function alertMsg(text,success=false){alertBox.textContent=text;alertBox.classList.toggle("is-success",success);alertBox.style.visibility="visible";alertBox.style.opacity="1"}
  function showValidation(text,fields=[]){fields.forEach(markFieldError);alertMsg(text);const target=fields.find(Boolean)||alertBox;requestAnimationFrame(()=>target.scrollIntoView({behavior:"smooth",block:"center"}))}
  passengerCount.addEventListener("change",()=>{syncSelectColor(passengerCount);passengerLuxury.refresh();renderPassengers()});
  seatRequest.addEventListener("change",()=>{syncSelectColor(seatRequest);seatLuxury.refresh()});
  syncSelectColor(passengerCount);syncSelectColor(seatRequest);renderPassengers();
  document.addEventListener("click",()=>document.querySelectorAll(".luxury-select-menu:not([hidden])").forEach(x=>x.hidden=true));
  function parseDate(value){const v=String(value||"").trim();let year,month,day;let match=v.match(/^(\d{4})-(\d{2})-(\d{2})$/);if(match){year=+match[1];month=+match[2];day=+match[3]}else{match=v.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);if(!match)return null;day=+match[1];month=+match[2];year=+match[3]}const date=new Date(year,month-1,day);if(date.getFullYear()!==year||date.getMonth()!==month-1||date.getDate()!==day)return null;return{date,iso:year+"-"+String(month).padStart(2,"0")+"-"+String(day).padStart(2,"0")}}
  const todayIso=new Date(Date.now()-new Date().getTimezoneOffset()*60000).toISOString().slice(0,10);travelDate.min=todayIso;returnDate.min=todayIso;[travelDate,returnDate].forEach(field=>{const wrap=field.closest(".date-native-wrap");const sync=()=>wrap?.classList.toggle("has-value",!!field.value);field.addEventListener("focus",()=>wrap?.classList.add("is-focused"));field.addEventListener("blur",()=>wrap?.classList.remove("is-focused"));field.addEventListener("click",()=>{if(typeof field.showPicker==="function"){try{field.showPicker()}catch{}}});field.addEventListener("keydown",event=>{if(["Enter"," "].includes(event.key)&&typeof field.showPicker==="function"){event.preventDefault();try{field.showPicker()}catch{}}});field.addEventListener("change",sync);field.addEventListener("input",sync);sync()});travelDate.addEventListener("change",()=>{returnDate.min=travelDate.value||todayIso;if(returnDate.value&&travelDate.value&&returnDate.value<travelDate.value)returnDate.value="";});
  const tripType=()=>form.querySelector('input[name="tripType"]:checked')?.value||"One-way";
  const isRoundTrip=()=>tripType()==="Round-trip";
  function isAirport(value){return /airport|\bIST\b|\bSAW\b|sabiha\s*g[oö]k[cç]en|istanbul\s*airport/i.test(value||"")}
  function syncFlightRequirements(){
    const outboundAirport=isAirport(pickup.value)||isAirport(dropoff.value);
    flightNumber.required=outboundAirport;$("flightNumberGroup").classList.toggle("is-optional",!outboundAirport);
    const returnPickup=$("returnPickup"),returnDropoff=$("returnDropoff");
    const returnAirport=isAirport(returnPickup?.value)||isAirport(returnDropoff?.value);
    returnFlightNumber.required=isRoundTrip()&&returnAirport;
    returnFlightNumber.closest(".form-group").classList.toggle("is-optional",!returnFlightNumber.required);
  }
  function syncTripType(){
    const round=isRoundTrip();
    returnDateGroup.hidden=!round;returnTimeLocationRow.hidden=!round;returnLocationRow.hidden=!round;if(returnTransferPanel)returnTransferPanel.hidden=!round;
    returnDate.required=round;returnTime.required=round;$("returnPickup").required=round;$("returnDropoff").required=round;
    if(round){
      if(!$("returnPickup").value.trim()&&dropoff.value.trim())$("returnPickup").value=dropoff.value;
      if(!$("returnDropoff").value.trim()&&pickup.value.trim())$("returnDropoff").value=pickup.value;
    }
    syncFlightRequirements();
  }
  tripOptions.forEach(input=>input.addEventListener("change",syncTripType));
  [pickup,dropoff,$("returnPickup"),$("returnDropoff")].forEach(input=>input.addEventListener("input",()=>{clearFieldError(input);syncFlightRequirements()}));
  flightNumber.addEventListener("input",()=>clearFieldError(flightNumber));returnFlightNumber.addEventListener("input",()=>clearFieldError(returnFlightNumber));
  [email,phone,message,pickupTime,returnTime].forEach(field=>{field.addEventListener("input",()=>clearFieldError(field));field.addEventListener("change",()=>clearFieldError(field))});
  syncTripType();
  function validEmail(v){return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim())}
  function validate(){
    form.querySelectorAll("input,select,textarea").forEach(field=>field.setCustomValidity(""));
    const fail=(field,message)=>{field.setCustomValidity(message);field.reportValidity();return false};
    // Follow the visual row order, left to right, from the top of the form down.
    if(!contactOptions.some(x=>x.checked))return fail(contactOptions[0],"Please select your preferred contact method.");
    if(!parseDate(travelDate.value))return fail(travelDate,"Please enter a valid pickup date.");
    if(isRoundTrip()){
      const out=parseDate(travelDate.value),ret=parseDate(returnDate.value);
      if(!ret)return fail(returnDate,"Please enter a valid return date.");
      if(out&&ret.date<out.date)return fail(returnDate,"Return date must be on or after the pickup date.");
    }
    if(!pickupTime.value)return fail(pickupTime,"Please select a pickup time.");
    if(isRoundTrip()&&!returnTime.value)return fail(returnTime,"Please select a return pickup time.");
    if(!pickup.value.trim())return fail(pickup,"Please enter a pickup location.");
    if(isRoundTrip()&&!$("returnPickup").value.trim())return fail($("returnPickup"),"Please enter a return pickup location.");
    if(!dropoff.value.trim())return fail(dropoff,"Please enter a drop-off location.");
    if(isRoundTrip()&&!$("returnDropoff").value.trim())return fail($("returnDropoff"),"Please enter a return drop-off location.");
    syncFlightRequirements();
    if(flightNumber.required&&!flightNumber.value.trim())return fail(flightNumber,"Please enter your flight number.");
    if(isRoundTrip()&&returnFlightNumber.required&&!returnFlightNumber.value.trim())return fail(returnFlightNumber,"Please enter your return flight number.");
    if(!passengerCount.value)return fail(passengerCount,"Please select the number of passengers.");
    const passengerName=Array.from(passengerFields.querySelectorAll("input[required]")).find(input=>input.value.trim().length<2);
    if(passengerName)return fail(passengerName,"Please enter the passenger's full name.");
    if(!email.value.trim())return fail(email,"Please enter your email address.");
    if(!validEmail(email.value))return fail(email,"Please enter a valid email address.");
    if(phone.value.replace(/\\D/g,"").length<7)return fail(phone,"Please enter a valid phone number, including country code.");
    return true;
  }
  form.querySelectorAll("input,select,textarea").forEach(field=>{
    field.addEventListener("input",()=>field.setCustomValidity(""));
    field.addEventListener("change",()=>field.setCustomValidity(""));
  });  form.addEventListener("submit",async event=>{
    event.preventDefault();rememberPassengerNames();if(!validate())return;
    const method=form.querySelector('input[name="contactMethod"]:checked').value;
    const round=isRoundTrip(),data=new FormData(form);data.set("phone",phone.value);
    data.set("Selected Vehicle",selectedVehicle.value||"Not specified");data.set("Vehicle Capacity",selectedCapacity.value||"Not specified");
    const names=Array.from(passengerFields.querySelectorAll("input[data-passenger-number]")).map(x=>"Passenger "+x.dataset.passengerNumber+": "+x.value.trim());
    const fields=[
      "AIRPORT TRANSFER REQUEST — Concierge Service Türkiye","",
      "Preferred contact method: "+method,"Trip type: "+tripType(),
      "Selected vehicle: "+(selectedVehicle.value||"Not specified"),"Vehicle capacity: "+(selectedCapacity.value||"Not specified"),
      "Number of passengers: "+data.get("passengerCount"),"Passenger names: "+names.join("; "),
      "Pickup date: "+(parseDate(travelDate.value)?.iso||travelDate.value),"Pickup time: "+data.get("pickupTime"),
      "Pickup location: "+data.get("pickup"),"Drop-off location: "+data.get("dropoff"),
      "Flight number: "+(flightNumber.value.trim()||"Not applicable"),
      ...(round?["","RETURN JOURNEY","Return date: "+(parseDate(returnDate.value)?.iso||returnDate.value),"Return pickup time: "+data.get("returnTime"),"Return pickup location: "+data.get("returnPickup"),"Return drop-off location: "+data.get("returnDropoff"),"Return flight number: "+(returnFlightNumber.value.trim()||"Not applicable")]:[]),
      "Infant / child seat: "+(isSedan?"Not applicable":seatRequest.options[seatRequest.selectedIndex]?.textContent||"Not specified"),
      "Guest email: "+email.value.trim(),"Guest phone: "+phone.value,
      "Additional requests: "+(message.value.trim()||"None"),""
    ];
    const requestMessage=fields.join("\n");
    status.textContent="";status.classList.remove("is-success","is-error");
    if(method==="WhatsApp"){
      const opened=window.open("https://wa.me/905344888624?text="+encodeURIComponent(requestMessage),"_blank");
      if(!opened){status.textContent="WhatsApp could not be opened. Please allow pop-ups and try again. Your details are still here.";status.classList.add("is-error");return}
      status.textContent="Your request is ready in WhatsApp. Please press Send there to complete your request.";status.classList.add("is-success");return;
    }
    const originalText=submit.textContent;submit.disabled=true;submit.textContent="Sending Request…";status.textContent="Sending your request by email…";
    const payload={_subject:"Airport Transfer Request — "+(selectedVehicle.value||"Private Transfer"),_template:"table",_captcha:"false","Contact Method":"Email","Trip Type":tripType(),"Selected Vehicle":selectedVehicle.value||"Not specified","Vehicle Capacity":selectedCapacity.value||"Not specified","Number of Passengers":String(data.get("passengerCount")||""),"Passenger Names":names.join("\n"),"Pickup Date":parseDate(travelDate.value)?.iso||travelDate.value,"Pickup Time":String(data.get("pickupTime")||""),"Pickup Location":String(data.get("pickup")||""),"Drop-off Location":String(data.get("dropoff")||""),"Flight Number":flightNumber.value.trim()||"Not applicable","Return Date":round?(parseDate(returnDate.value)?.iso||returnDate.value):"Not applicable","Return Pickup Time":round?String(data.get("returnTime")||""):"Not applicable","Return Pickup Location":round?String(data.get("returnPickup")||""):"Not applicable","Return Drop-off Location":round?String(data.get("returnDropoff")||""):"Not applicable","Return Flight Number":round?(returnFlightNumber.value.trim()||"Not applicable"):"Not applicable","Infant / Child Seat":isSedan?"Not applicable":seatRequest.options[seatRequest.selectedIndex]?.textContent||"Not specified","Guest Name(s)":names.join("\n"),"Guest Email":email.value.trim(),"Guest Phone":phone.value,"Additional Requests":message.value.trim()||"None","Referrer":"Airport Transfer page"};
    try{
      const response=await fetch("https://formsubmit.co/ajax/conciergeserviceturkiye@gmail.com",{method:"POST",headers:{"Content-Type":"application/json",Accept:"application/json"},body:JSON.stringify(payload)});
      const result=await response.json().catch(()=>({}));
      if(!response.ok||result.success===false)throw new Error(result.message||"The email service could not accept the request.");
      status.textContent="Your transfer request has been submitted successfully. We will contact you after reviewing the details.";status.classList.add("is-success");
      form.reset();selectedVehicle.value=vehicle||"";selectedCapacity.value=capacity||"";vehiclePlan.value="";phone.value="+";Object.keys(passengerNameCache).forEach(k=>delete passengerNameCache[k]);passengerCount.value="";seatRequest.value="0";syncSelectColor(passengerCount);syncSelectColor(seatRequest);passengerLuxury.refresh();seatLuxury.refresh();if(isSedan){seatGroup.hidden=true;seatGroup.style.setProperty("display","none","important")}else{seatGroup.hidden=false;seatGroup.style.removeProperty("display")}renderPassengers();syncTripType();syncFlightRequirements();
    }catch(error){console.error("Airport transfer request failed:",error);status.textContent="We could not send your request by email just now. Your details are still here; please try again or contact us directly.";status.classList.add("is-error")}
    finally{submit.disabled=false;submit.textContent=originalText}
  });
});