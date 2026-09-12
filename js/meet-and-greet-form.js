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

  customSelect(adults);customSelect(children);customSelect(babies);
  customSelect(document.getElementById('checkedBags'));customSelect(document.getElementById('carryOnBags'));
  document.addEventListener('click',()=>closeAllSelects());

  function totalPassengers(){return Number(adults.value||0)+Number(children.value||0)+Number(babies.value||0)}
  function renderPassengerNames(){
    const old=[...passengerNames.querySelectorAll('input')].map(x=>x.value);
    passengerNames.innerHTML='';
    const groups=[
      {title:'Adults 12+',count:Number(adults.value||0)},
      {title:'Children 7–12',count:Number(children.value||0)},
      {title:'Babies 0–6',count:Number(babies.value||0)}
    ];
    let globalIndex=0;
    groups.forEach(group=>{
      const column=document.createElement('div');column.className='mg-passenger-column';
      const heading=document.createElement('div');heading.className='mg-passenger-column-title';heading.textContent=group.title;column.appendChild(heading);
      for(let i=1;i<=group.count;i++){
        const wrap=document.createElement('div');wrap.className='mg-passenger-field';
        const badge=document.createElement('span');badge.textContent=String(i).padStart(2,'0');
        const input=document.createElement('input');globalIndex++;input.type='text';input.name='passenger'+globalIndex;input.placeholder='Passenger '+i+' Full Name';input.autocomplete='name';input.required=true;if(old[globalIndex-1])input.value=old[globalIndex-1];
        wrap.append(badge,input);column.appendChild(wrap);
      }
      passengerNames.appendChild(column);
    });
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
