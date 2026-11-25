document.addEventListener('DOMContentLoaded', function(){
  const form=document.getElementById('meetGreetForm'); if(!form)return;
  const serviceRadios=[...document.querySelectorAll('input[name="serviceType"]')];
  const serviceCards=[...document.querySelectorAll('.mg-service-option')];
  const onwardRadios=[...document.querySelectorAll('input[name="onwardService"]')];
  const onwardCards=[...document.querySelectorAll('[aria-label="Continue your journey"] .mg-continue-option')];
  const contactCards=[...document.querySelectorAll('.mg-contact-option')];
  const contactRadios=[...form.querySelectorAll('input[name="preferredMethod"]')];
  const adults=document.getElementById('adults'), children=document.getElementById('children'), babies=document.getElementById('babies');
  const passengerNames=document.getElementById('passengerNames');
  const alertBox=document.getElementById('formInlineAlert');
  const onwardActions=document.getElementById('onwardActions'), onwardAirport=document.getElementById('onwardAirport'), onwardChauffeur=document.getElementById('onwardChauffeur');

  function updateCards(radios,cards){radios.forEach((r,i)=>cards[i]&&cards[i].classList.toggle('active',r.checked));}
  function setRequired(id,on){const el=document.getElementById(id);if(el)el.required=on;}
  function syncFlightBlocks(){
    const type=document.querySelector('input[name="serviceType"]:checked').value;
    document.getElementById('arrivalFields').classList.toggle('hidden',type!=='Arrival');
    document.getElementById('departureFields').classList.toggle('hidden',type!=='Departure');
    document.getElementById('transferFields').classList.toggle('hidden',type!=='Transfer');
    ['arrivalDate','arrivalFlight','departureDate','departureFlight','transferArrivalDate','transferArrivalFlight','transferDepartureDate','transferDepartureFlight'].forEach(id=>setRequired(id,false));
    if(type==='Arrival'){setRequired('arrivalDate',true);setRequired('arrivalFlight',true)}
    if(type==='Departure'){setRequired('departureDate',true);setRequired('departureFlight',true)}
    if(type==='Transfer'){['transferArrivalDate','transferArrivalFlight','transferDepartureDate','transferDepartureFlight'].forEach(id=>setRequired(id,true))}
  }
  serviceRadios.forEach(r=>r.addEventListener('change',()=>{updateCards(serviceRadios,serviceCards);syncFlightBlocks()}));

  function closeAllSelects(except){document.querySelectorAll('.luxury-select').forEach(w=>{if(w!==except){w.classList.remove('is-open');const menu=w.querySelector('.luxury-select-menu');if(menu)menu.hidden=true}})}
  function customSelect(sel){
    if(!sel)return null;
    const w=document.createElement('div'),b=document.createElement('button'),m=document.createElement('div');
    w.className='luxury-select';b.type='button';b.className='luxury-select-trigger';m.className='luxury-select-menu';m.hidden=true;w.append(b,m);sel.parentNode.insertBefore(w,sel);sel.classList.add('luxury-native-select');
    function draw(){b.textContent=sel.options[sel.selectedIndex]?sel.options[sel.selectedIndex].textContent:'';b.classList.toggle('has-selection',!!sel.value)}
    function build(){m.innerHTML='';Array.from(sel.options).forEach(o=>{const x=document.createElement('button');x.type='button';x.className='luxury-select-option';x.textContent=o.textContent;x.onclick=e=>{e.stopPropagation();sel.value=o.value;sel.dispatchEvent(new Event('change',{bubbles:true}));m.hidden=true;w.classList.remove('is-open');draw()};m.appendChild(x)})}
    b.onclick=e=>{e.stopPropagation();if(w.classList.contains('is-open')){m.hidden=true;w.classList.remove('is-open');return}closeAllSelects(w);m.hidden=false;w.classList.add('is-open')};
    sel.addEventListener('change',draw);build();draw();return{rebuild:build,refresh:draw,trigger:b}
  }
  customSelect(adults);customSelect(children);customSelect(babies);customSelect(document.getElementById('checkedBags'));customSelect(document.getElementById('carryOnBags'));
  document.addEventListener('click',()=>closeAllSelects());

  function totalPassengers(){return Number(adults.value||0)+Number(children.value||0)+Number(babies.value||0)}
  function renderPassengerNames(){
    const old=[...passengerNames.querySelectorAll('input')].map(x=>x.value); passengerNames.innerHTML='';
    const groups=[{title:'Adults 12+',count:Number(adults.value||0)},{title:'Children 7–12',count:Number(children.value||0)},{title:'Babies 0–6',count:Number(babies.value||0)}];
    let globalIndex=0;
    groups.forEach(group=>{const column=document.createElement('div');column.className='mg-passenger-column';const heading=document.createElement('div');heading.className='mg-passenger-column-title';heading.textContent=group.title;column.appendChild(heading);for(let i=1;i<=group.count;i++){const wrap=document.createElement('div');wrap.className='mg-passenger-field';const badge=document.createElement('span');badge.textContent=String(i).padStart(2,'0');const input=document.createElement('input');globalIndex++;input.type='text';input.name='passenger'+globalIndex;input.placeholder='Passenger '+i+' Full Name';input.autocomplete='name';input.required=true;if(old[globalIndex-1])input.value=old[globalIndex-1];input.addEventListener('input',syncFullNameFromFirstPassenger);wrap.append(badge,input);column.appendChild(wrap)}passengerNames.appendChild(column)});
  }
  const fullNameInput=document.getElementById('fullName');
  function syncFullNameFromFirstPassenger(){const first=passengerNames.querySelector('input');if(first&&first.value.trim())fullNameInput.value=first.value.trim();}
  [adults,children,babies].forEach(el=>el.addEventListener('change',()=>{renderPassengerNames();syncFullNameFromFirstPassenger()})); renderPassengerNames();

  if(window.flatpickr){['arrivalDate','departureDate','transferArrivalDate','transferDepartureDate'].forEach(id=>{const input=document.getElementById(id),button=document.getElementById(id+'Button');if(!input)return;const picker=flatpickr(input,{dateFormat:'d/m/Y',minDate:'today',disableMobile:true,allowInput:false});if(button)button.addEventListener('click',()=>picker.open())})}
  const phone=document.getElementById('phone');
  phone.value='+';
  phone.addEventListener('keydown',e=>{
    const start=phone.selectionStart??0,end=phone.selectionEnd??0;
    if(['Tab','ArrowLeft','ArrowRight','End'].includes(e.key))return;
    if(e.key==='Home'){e.preventDefault();phone.setSelectionRange(1,1);return}
    if(e.key==='Backspace'&&start<=1){e.preventDefault();phone.setSelectionRange(1,1);return}
    if(e.key==='Delete'&&(start===0||(start===1&&end>1))){e.preventDefault();phone.setSelectionRange(1,1);return}
    if(e.ctrlKey||e.metaKey||['Backspace','Delete'].includes(e.key))return;
    if(!/^\d$/.test(e.key)){e.preventDefault();return}
    if(start===0){e.preventDefault();phone.setSelectionRange(1,1)}
  });
  phone.addEventListener('input',()=>{phone.value='+'+phone.value.replace(/\D/g,'')});
  phone.addEventListener('paste',()=>setTimeout(()=>phone.value='+'+phone.value.replace(/\D/g,''),0));
  const message=document.getElementById('message'),count=document.getElementById('charCount');message.addEventListener('input',()=>count.textContent=message.value.length+' / 2000');

  function showAlert(text,type){alertBox.innerHTML='<div class="form-alert '+(type||'error')+'">'+text+'</div>';alertBox.scrollIntoView({behavior:'smooth',block:'center'})}

  function collectHandoff(){
    const type=document.querySelector('input[name="serviceType"]:checked').value;
    const names=[...passengerNames.querySelectorAll('input')].map(x=>x.value.trim()).filter(Boolean);
    const special=[...document.querySelectorAll('input[name="specialRequirements"]:checked')].map(x=>x.value);
    const data={serviceType:type,airport:document.getElementById('airport').value,adults:adults.value,children:children.value,babies:babies.value,passengerNames:names,fullName:document.getElementById('fullName').value.trim()||(names[0]||''),email:document.getElementById('email').value.trim(),phone:phone.value,preferredMethod:form.querySelector('input[name="preferredMethod"]:checked')?.value||'',checkedBags:document.getElementById('checkedBags').value,carryOnBags:document.getElementById('carryOnBags').value,specialRequirements:special.join(', '),specialDetails:document.getElementById('specialDetails').value.trim(),requestDetails:message.value.trim(),createdAt:Date.now()};
    if(type==='Arrival'){data.travelDate=document.getElementById('arrivalDate').value;data.travelTime=document.getElementById('arrivalTime').value;data.flightNumber=document.getElementById('arrivalFlight').value.trim();data.pickup='Istanbul Airport (IST)';data.dropoff=''}
    if(type==='Departure'){data.travelDate=document.getElementById('departureDate').value;data.travelTime=document.getElementById('departureTime').value;data.flightNumber=document.getElementById('departureFlight').value.trim();data.pickup='';data.dropoff='Istanbul Airport (IST)'}
    if(type==='Transfer'){data.travelDate=document.getElementById('transferArrivalDate').value;data.travelTime=document.getElementById('transferArrivalTime').value;data.flightNumber=document.getElementById('transferArrivalFlight').value.trim();data.transferDepartureDate=document.getElementById('transferDepartureDate').value;data.transferDepartureTime=document.getElementById('transferDepartureTime').value;data.transferDepartureFlight=document.getElementById('transferDepartureFlight').value.trim();data.pickup='Istanbul Airport (IST)';data.dropoff=''}
    return data;
  }
  function openHandoff(kind){
    const payload=collectHandoff();
    const token='mg_'+Date.now()+'_'+Math.random().toString(36).slice(2);
    try{localStorage.setItem(token,JSON.stringify(payload));}catch(e){showAlert('We could not prepare the next service. Please try again.','error');return}
    const target=kind==='airport'?'../airport-transfer.html':'../forms/chauffeur-service.html';
    const url=target+'?from=meet-and-greet&prefill='+encodeURIComponent(token);
    window.open(url,'_blank','noopener');
  }
  contactRadios.forEach(r=>r.addEventListener('change',()=>updateCards(contactRadios,contactCards)));
  function syncOnwardActions(){
    const value=document.querySelector('input[name="onwardService"]:checked').value;
    updateCards(onwardRadios,onwardCards);
    onwardActions.hidden=value==='No - Own Transportation';
    onwardAirport.hidden=value!=='Airport Transfer';
    onwardChauffeur.hidden=value!=='Private Chauffeur';
  }
  onwardRadios.forEach(r=>r.addEventListener('change',syncOnwardActions));
  document.getElementById('arrangeAirportTransfer')?.addEventListener('click',()=>openHandoff('airport'));
  document.getElementById('arrangePrivateChauffeur')?.addEventListener('click',()=>openHandoff('chauffeur'));
  syncOnwardActions();

  form.addEventListener('submit',async function(e){
    e.preventDefault();
    if(!form.checkValidity()){form.reportValidity();showAlert('Please complete the required fields before sending your request.','error');return}
    if(phone.value.replace(/\D/g,'').length<7){showAlert('Please enter a valid phone number, including country code.','error');phone.focus();return}
    const data=collectHandoff();
    if(!data.preferredMethod){showAlert('Please select your preferred contact method.','error');return}
    const {fullName,email,preferredMethod,...fields}=data;
    const submit=form.querySelector('button[type="submit"]');
    const originalText=submit.textContent;submit.disabled=true;submit.textContent='Sending Request...';
    try{
      const response=await fetch('../api/request',{method:'POST',headers:{'Content-Type':'application/json','Idempotency-Key':crypto.randomUUID()},body:JSON.stringify({formType:'Meet & Greet request',subject:'New Meet & Greet Request — '+fullName,customer:{name:fullName,email},preferredMethod,fields})});
      const result=await response.json().catch(()=>({}));
      if(!response.ok||result.success!==true)throw new Error(result.message||'The request could not be submitted.');
      if(preferredMethod==='WhatsApp'){
        const message=Object.entries(data).map(([key,value])=>key+': '+(Array.isArray(value)?value.join(', '):value)).join('\n');
        window.open('https://wa.me/905344888624?text='+encodeURIComponent('MEET & GREET REQUEST\n\n'+message),'_blank');
      }
      showAlert('Your Meet & Greet request has been sent to our concierge team. We will contact you using your preferred method.','success');
      form.innerHTML='<div class="mg-form-success"><div class="mg-form-eyebrow">REQUEST RECEIVED</div><h2>Thank you. Your request has been received.</h2><p>Our concierge team will review the details and contact you using your preferred method.</p><a href="../meet-and-greet.html">← Back to Meet &amp; Greet</a></div>';
    }catch(error){console.error('Meet & Greet request failed:',error);showAlert(error.message||'We could not submit your request. Your details are still in the form.','error');submit.disabled=false;submit.textContent=originalText}
  });
  syncFlightBlocks();
});