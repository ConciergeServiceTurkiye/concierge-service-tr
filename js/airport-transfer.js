document.addEventListener("DOMContentLoaded",()=>{
  const form=document.getElementById("serviceForm");
  if(!form)return;
  const $=id=>document.getElementById(id);
  const alertBox=$("formInlineAlert"),submit=form.querySelector('[type="submit"]'),status=$("transferSubmitStatus");
  const email=$("email"),phone=$("phone"),message=$("message"),passengerCount=$("passengerCount"),passengerFields=$("passengerFields"),vehiclePlan=$("vehiclePlan");
  const seatGroup=$("seatRequestGroup"),seatRequest=$("seatRequest"),travelDate=$("travelDate"),returnDate=$("returnDate"),flightNumber=$("flightNumber"),returnFlightNumber=$("returnFlightNumber");
  const pickup=$("pickup"),dropoff=$("dropoff"),pickupTime=$("pickupTime"),returnTime=$("returnTime");
  const returnDateGroup=$("returnDateGroup"),returnTimeLocationRow=$("returnTimeLocationRow"),returnLocationRow=$("returnLocationRow");
  const contactOptions=Array.from(form.querySelectorAll('input[name="contactMethod"]')),tripOptions=Array.from(form.querySelectorAll('input[name="tripType"]'));
  const iti=intlTelInput(phone,{initialCountry:"us",separateDialCode:true,allowDropdown:true,autoPlaceholder:"off",nationalMode:false,showSelectedDialCode:true,utilsScript:"https://cdn.jsdelivr.net/npm/intl-tel-input@19.5.4/build/js/utils.js"});
  const phoneStyle=document.createElement("style");phoneStyle.textContent='.iti{width:100%}.iti input#phone,.iti--separate-dial-code input#phone{padding-left:110px!important;box-sizing:border-box}.iti__selected-dial-code{color:rgba(255,255,255,.88)!important}.iti__selected-flag{padding-left:14px!important;padding-right:14px!important}';document.head.appendChild(phoneStyle);
  const params=new URLSearchParams(location.search),vehicle=params.get("vehicle"),capacity=params.get("capacity");
  const vehicleBox=$("selectedVehicleBox"),vehicleName=$("selectedVehicleName"),vehicleCapacity=$("selectedVehicleCapacity"),selectedVehicle=$("selectedVehicle"),selectedCapacity=$("selectedCapacity");
  if(vehicle){vehicleName.textContent=vehicle;vehicleCapacity.textContent=capacity||"";vehicleBox.hidden=false;selectedVehicle.value=vehicle;selectedCapacity.value=capacity||"";vehicleName.href='../airport-transfer.html?viewVehicle='+encodeURIComponent(vehicle)}
  const normalized=(vehicle||"").toLowerCase(),isSedan=/e[- ]?class|s[- ]?class/.test(normalized),m=(capacity||"").match(/(\d+)\s*[-–]\s*(\d+)|(\d+)/);let vehicleMin=m?Number(m[1]||m[3]):1,vehicleMax=m?Number(m[2]||m[3]):13;if(isSedan){vehicleMin=1;vehicleMax=3}
  passengerCount.innerHTML="";
  const ph=document.createElement("option");ph.value="";ph.textContent="Please select number of passengers";ph.disabled=true;ph.selected=true;passengerCount.appendChild(ph);
  for(let i=vehicleMin;i<=vehicleMax;i++){const o=document.createElement("option");o.value=i;o.textContent=String(i);passengerCount.appendChild(o)}
  if(isSedan){seatGroup.hidden=true;seatGroup.style.setProperty("display","none","important");seatRequest.value="0"}else{seatGroup.hidden=false;seatGroup.style.removeProperty("display")}
  function syncSelectColor(el){el.classList.toggle("has-selection",el.value!==""&&!(el===seatRequest&&el.value==="0"))}
  function makeLuxurySelect(select){
    const wrap=document.createElement("div");wrap.className="luxury-select";
    const trigger=document.createElement("button");trigger.type="button";trigger.className="luxury-select-trigger";trigger.setAttribute("aria-haspopup","listbox");trigger.setAttribute("aria-expanded","false");
    const list=document.createElement("div");list.className="luxury-select-menu";list.hidden=true;
    const refresh=()=>{const opt=select.options[select.selectedIndex];trigger.textContent=opt?opt.textContent:"";trigger.classList.toggle("has-selection",select.value!==""&&!(select===seatRequest&&select.value==="0"));Array.from(list.children).forEach(b=>b.classList.toggle("selected",b.dataset.value===select.value))};
    Array.from(select.options).forEach(opt=>{const item=document.createElement("button");item.type="button";item.className="luxury-select-option";item.textContent=opt.textContent;item.dataset.value=opt.value;item.disabled=opt.disabled;item.addEventListener("click",()=>{select.value=opt.value;select.dispatchEvent(new Event("change",{bubbles:true}));list.hidden=true;trigger.setAttribute("aria-expanded","false");refresh()});list.appendChild(item)});
    trigger.addEventListener("click",e=>{e.stopPropagation();document.querySelectorAll(".luxury-select-menu:not([hidden])").forEach(x=>{if(x!==list)x.hidden=true});list.hidden=!list.hidden;trigger.setAttribute("aria-expanded",String(!list.hidden))});
    wrap.append(trigger,list);select.parentNode.insertBefore(wrap,select);select.classList.add("luxury-native-select");select.setAttribute("tabindex","-1");select.addEventListener("change",refresh);refresh();return{refresh,trigger,list}
  }
  const passengerLuxury=makeLuxurySelect(passengerCount),seatLuxury=makeLuxurySelect(seatRequest),passengerNameCache={};
  function rememberPassengerNames(){passengerFields.querySelectorAll(".passenger-row input").forEach(input=>{const n=input.dataset.passengerNumber;if(n)passengerNameCache[n]=input.value})}
  function renderPassengers(){
    rememberPassengerNames();passengerFields.querySelectorAll(".passenger-row").forEach(el=>el.remove());const n=Number(passengerCount.value||0);
    if(!n){vehiclePlan.value="";return}
    for(let i=1;i<=n;i++){const row=document.createElement("div");row.className="passenger-row";row.innerHTML='<label for="passenger-'+i+'">Passenger '+i+' — Full Name</label><input id="passenger-'+i+'" name="passenger_'+i+'" data-passenger-number="'+i+'" type="text" placeholder="Full name" minlength="2" maxlength="100" required>';const input=row.querySelector("input");input.value=passengerNameCache[i]||"";input.addEventListener("input",()=>clearFieldError(input));passengerFields.appendChild(row)}
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
  function parseDate(value){const match=String(value||"").trim().match(/^(\d{2})\/(\d{2})\/(\d{4})$/);if(!match)return null;const day=+match[1],month=+match[2],year=+match[3],date=new Date(year,month-1,day);if(date.getFullYear()!==year||date.getMonth()!==month-1||date.getDate()!==day)return null;return{date,iso:year+'-'+String(month).padStart(2,'0')+'-'+String(day).padStart(2,'0')}}
  function dateMask(input){input.addEventListener("input",()=>{const digits=input.value.replace(/\D/g,"").slice(0,8);input.value=digits.length>4?digits.slice(0,2)+"/"+digits.slice(2,4)+"/"+digits.slice(4):digits.length>2?digits.slice(0,2)+"/"+digits.slice(2):digits;clearFieldError(input)});input.addEventListener("keydown",e=>{if(e.ctrlKey||e.metaKey||["Backspace","Delete","ArrowLeft","ArrowRight","Tab","Home","End"].includes(e.key))return;if(!/^\d$/.test(e.key))e.preventDefault()})}
  dateMask(travelDate);dateMask(returnDate);
  function installLuxuryMonthMenu(fp){
    const select=fp.calendarContainer?.querySelector(".flatpickr-monthDropdown-months");if(!select||select.dataset.luxuryReady)return;select.dataset.luxuryReady="1";
    const menu=document.createElement("div");menu.className="flatpickr-month-custom-menu";menu.hidden=true;const arrow=document.createElement("span");arrow.className="flatpickr-month-dropdown-arrow";arrow.setAttribute("aria-hidden","true");select.insertAdjacentElement("afterend",arrow);
    const build=()=>{menu.innerHTML="";Array.from(select.options).forEach(opt=>{const b=document.createElement("button");b.type="button";b.className="flatpickr-month-custom-option";b.textContent=opt.textContent;b.dataset.value=opt.value;if(opt.value===select.value)b.classList.add("selected");b.addEventListener("click",e=>{e.stopPropagation();select.value=opt.value;select.dispatchEvent(new Event("change",{bubbles:true}));menu.hidden=true;build()});menu.appendChild(b)})};
    const position=()=>{const a=select.getBoundingClientRect(),b=fp.calendarContainer.getBoundingClientRect();menu.style.left=(a.left-b.left)+"px";menu.style.top=(a.bottom-b.top+3)+"px"};
    select.classList.remove("custom-month-hidden");select.setAttribute("aria-haspopup","listbox");select.setAttribute("aria-expanded","false");fp.calendarContainer.appendChild(menu);
    const toggle=e=>{e.preventDefault();e.stopPropagation();build();position();menu.hidden=!menu.hidden;select.setAttribute("aria-expanded",String(!menu.hidden))};select.addEventListener("mousedown",toggle);arrow.addEventListener("click",toggle);
    document.addEventListener("click",e=>{if(!menu.contains(e.target)&&e.target!==select&&e.target!==arrow){menu.hidden=true;select.setAttribute("aria-expanded","false")}});
    select.addEventListener("change",()=>{build();menu.hidden=true;select.setAttribute("aria-expanded","false")});
  }
  const pickers={};
  if(window.flatpickr){
    [["travelDate","dateCalendarButton"],["returnDate","returnDateCalendarButton"]].forEach(([inputId,buttonId])=>{
      const input=$(inputId),button=$(buttonId);
      pickers[inputId]=flatpickr(input,{dateFormat:"d/m/Y",allowInput:true,disableMobile:true,minDate:"today",locale:{firstDayOfWeek:1},positionElement:input,onReady:[(dates,str,fp)=>installLuxuryMonthMenu(fp)],onOpen:[(dates,str,fp)=>installLuxuryMonthMenu(fp)]});
      button?.addEventListener("click",()=>{clearFieldError(input);pickers[inputId].open()});
    });
  }
  const tripType=()=>form.querySelector('input[name="tripType"]:checked')?.value||"One-way";
  const isRoundTrip=()=>tripType()==="Round-trip";
  function isAirport(value){return /airport|\bIST\b|\bSAW\b|sabiha\s*g[oö]k[cç]en|istanbul\s*airport/i.test(value||"")}
  function syncFlightRequirements(){
    const outboundAirport=isAirport(pickup.value)||isAirport(dropoff.value);
    flightNumber.required=outboundAirport;$("flightNumberGroup").classList.toggle("is-optional",!outboundAirport);
    const returnPickup=$("returnPickup"),returnDropoff=$("returnDropoff");
    const returnAirport=isAirport(returnPickup?.value)||isAirport(returnDropoff?.value);
    returnFlightNumber.required=isRoundTrip()&&returnAirport;
    $("returnTimeLocationRow").querySelector("#returnFlightNumber").closest(".form-group").classList.toggle("is-optional",!returnFlightNumber.required);
  }
  function syncTripType(){
    const round=isRoundTrip();
    returnDateGroup.hidden=!round;returnTimeLocationRow.hidden=!round;returnLocationRow.hidden=!round;
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
    const errors=[];
    if(!contactOptions.some(x=>x.checked))errors.push($("contactMethodGroup"));
    if(!passengerCount.value)errors.push(passengerLuxury.trigger);
    if(!validEmail(email.value))errors.push(email);
    if(!iti.isValidNumber())errors.push(phone);
    if(!parseDate(travelDate.value))errors.push(travelDate);
    if(!pickupTime.value)errors.push(pickupTime);
    if(!pickup.value.trim())errors.push(pickup);
    if(!dropoff.value.trim())errors.push(dropoff);
    syncFlightRequirements();
    if(flightNumber.required&&!flightNumber.value.trim())errors.push(flightNumber);
    if(isRoundTrip()){
      const out=parseDate(travelDate.value),ret=parseDate(returnDate.value);
      if(!ret)errors.push(returnDate);else if(out&&ret.date<out.date)errors.push(returnDate);
      if(!returnTime.value)errors.push(returnTime);
      if(!$("returnPickup").value.trim())errors.push($("returnPickup"));
      if(!$("returnDropoff").value.trim())errors.push($("returnDropoff"));
      if(returnFlightNumber.required&&!returnFlightNumber.value.trim())errors.push(returnFlightNumber);
    }
    passengerFields.querySelectorAll("input[required]").forEach(input=>{if(input.value.trim().length<2)errors.push(input)});
    if(errors.length){showValidation("Please complete the highlighted fields so we can submit your request.",errors);return false}
    return true;
  }
  form.addEventListener("submit",async event=>{
    event.preventDefault();rememberPassengerNames();if(!validate())return;
    const method=form.querySelector('input[name="contactMethod"]:checked').value;
    const round=isRoundTrip(),data=new FormData(form);data.set("phone",iti.getNumber());
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
      "Guest email: "+email.value.trim(),"Guest phone: "+iti.getNumber(),
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
    const payload={_subject:"Airport Transfer Request — "+(selectedVehicle.value||"Private Transfer"),_template:"table",_captcha:"false","Contact Method":"Email","Trip Type":tripType(),"Selected Vehicle":selectedVehicle.value||"Not specified","Vehicle Capacity":selectedCapacity.value||"Not specified","Number of Passengers":String(data.get("passengerCount")||""),"Passenger Names":names.join("\n"),"Pickup Date":parseDate(travelDate.value)?.iso||travelDate.value,"Pickup Time":String(data.get("pickupTime")||""),"Pickup Location":String(data.get("pickup")||""),"Drop-off Location":String(data.get("dropoff")||""),"Flight Number":flightNumber.value.trim()||"Not applicable","Return Date":round?(parseDate(returnDate.value)?.iso||returnDate.value):"Not applicable","Return Pickup Time":round?String(data.get("returnTime")||""):"Not applicable","Return Pickup Location":round?String(data.get("returnPickup")||""):"Not applicable","Return Drop-off Location":round?String(data.get("returnDropoff")||""):"Not applicable","Return Flight Number":round?(returnFlightNumber.value.trim()||"Not applicable"):"Not applicable","Infant / Child Seat":isSedan?"Not applicable":seatRequest.options[seatRequest.selectedIndex]?.textContent||"Not specified","Guest Name(s)":names.join("\n"),"Guest Email":email.value.trim(),"Guest Phone":iti.getNumber(),"Additional Requests":message.value.trim()||"None","Referrer":"Airport Transfer page"};
    try{
      const response=await fetch("https://formsubmit.co/ajax/conciergeserviceturkiye@gmail.com",{method:"POST",headers:{"Content-Type":"application/json",Accept:"application/json"},body:JSON.stringify(payload)});
      const result=await response.json().catch(()=>({}));
      if(!response.ok||result.success===false)throw new Error(result.message||"The email service could not accept the request.");
      status.textContent="Your transfer request has been submitted successfully. We will contact you after reviewing the details.";status.classList.add("is-success");
      form.reset();selectedVehicle.value=vehicle||"";selectedCapacity.value=capacity||"";vehiclePlan.value="";iti.setCountry("us");phone.value="";Object.keys(passengerNameCache).forEach(k=>delete passengerNameCache[k]);passengerCount.value="";seatRequest.value="0";syncSelectColor(passengerCount);syncSelectColor(seatRequest);passengerLuxury.refresh();seatLuxury.refresh();if(isSedan){seatGroup.hidden=true;seatGroup.style.setProperty("display","none","important")}else{seatGroup.hidden=false;seatGroup.style.removeProperty("display")}renderPassengers();syncTripType();syncFlightRequirements();
    }catch(error){console.error("Airport transfer request failed:",error);status.textContent="We could not send your request by email just now. Your details are still here; please try again or contact us directly.";status.classList.add("is-error")}
    finally{submit.disabled=false;submit.textContent=originalText}
  });
});