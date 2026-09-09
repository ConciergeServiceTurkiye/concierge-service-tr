document.addEventListener('DOMContentLoaded', function(){
  const form=document.getElementById('meetGreetForm'); if(!form)return;
  const serviceRadios=[...document.querySelectorAll('input[name="serviceType"]')];
  const serviceCards=[...document.querySelectorAll('.mg-service-option')];
  const onwardRadios=[...document.querySelectorAll('input[name="onwardService"]')];
  const onwardCards=[...document.querySelectorAll('.mg-continue-option')];
  const adults=document.getElementById('adults'), children=document.getElementById('children'), babies=document.getElementById('babies');
  const passengerNames=document.getElementById('passengerNames');
  const alertBox=document.getElementById('formInlineAlert');

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
  onwardRadios.forEach(r=>r.addEventListener('change',()=>updateCards(onwardRadios,onwardCards)));

  function totalPassengers(){return Number(adults.value||0)+Number(children.value||0)+Number(babies.value||0)}
  function renderPassengerNames(){
    const total=totalPassengers(), old=[...passengerNames.querySelectorAll('input')].map(x=>x.value);
    passengerNames.innerHTML='';
    for(let i=0;i<total;i++){
      const wrap=document.createElement('div');wrap.className='mg-passenger-field';
      const badge=document.createElement('span');badge.textContent=String(i+1).padStart(2,'0');
      const input=document.createElement('input');input.type='text';input.name='passenger'+(i+1);input.placeholder='Passenger '+(i+1)+' Full Name';input.autocomplete='name';input.required=true;if(old[i])input.value=old[i];
      wrap.append(badge,input);passengerNames.appendChild(wrap);
    }
  }
  [adults,children,babies].forEach(el=>el.addEventListener('change',renderPassengerNames)); renderPassengerNames();

  if(window.flatpickr){
    ['arrivalDate','departureDate','transferArrivalDate','transferDepartureDate'].forEach(id=>{
      const input=document.getElementById(id),button=document.getElementById(id+'Button'); if(!input)return;
      const picker=flatpickr(input,{dateFormat:'d/m/Y',minDate:'today',disableMobile:true,allowInput:false});
      if(button)button.addEventListener('click',()=>picker.open());
    });
  }

  if(window.intlTelInput){
    const phone=document.getElementById('phone');
    window.mgPhoneIti=intlTelInput(phone,{initialCountry:'us',separateDialCode:true,preferredCountries:['us','gb','tr','id'],utilsScript:'https://cdn.jsdelivr.net/npm/intl-tel-input@19.5.4/build/js/utils.js'});
    phone.addEventListener('input',()=>phone.value=phone.value.replace(/\D/g,''));
  }

  const message=document.getElementById('message'), count=document.getElementById('charCount');
  message.addEventListener('input',()=>count.textContent=message.value.length+' / 2000');

  function showAlert(text,type){alertBox.innerHTML='<div class="form-alert '+(type||'error')+'">'+text+'</div>';alertBox.scrollIntoView({behavior:'smooth',block:'center'});}
  form.addEventListener('submit',function(e){
    e.preventDefault();
    if(!form.checkValidity()){form.reportValidity();showAlert('Please complete the required fields before sending your request.','error');return;}
    if(window.mgPhoneIti&&!window.mgPhoneIti.isValidNumber()){showAlert('Please enter a valid phone number.','error');document.getElementById('phone').focus();return;}
    const data=new FormData(form);
    if(window.mgPhoneIti)data.set('phone',window.mgPhoneIti.getNumber());
    data.set('service','Meet & Greet');
    data.set('specialRequirements',[...document.querySelectorAll('input[name="specialRequirements"]:checked')].map(x=>x.value).join(', '));
    data.set('passengerCount',String(totalPassengers()));
    /* Backend endpoint will be connected once the Meet & Greet Google Sheet structure is finalized. */
    const summary={serviceType:data.get('serviceType'),passengerCount:data.get('passengerCount'),onwardService:data.get('onwardService')};
    console.info('Meet & Greet request ready',summary);
    form.innerHTML='<div class="mg-form-success"><div class="mg-form-eyebrow">REQUEST READY</div><h2>Your request has been prepared.</h2><p>The form structure and validation are in place. The final submission connection will be added after the Meet &amp; Greet request sheet is set up.</p><a href="../meet-and-greet.html">← Back to Meet &amp; Greet</a></div>';
  });
  syncFlightBlocks();
});
