document.addEventListener('DOMContentLoaded',function(){
  var form=document.getElementById('serviceForm');
  if(!form)return;

  var service=document.getElementById('service'),vehicle=document.getElementById('vehicle'),passengers=document.getElementById('passengers'),startDate=document.getElementById('startDate'),endDate=document.getElementById('endDate'),startTime=document.getElementById('startTime'),endTime=document.getElementById('endTime'),phone=document.getElementById('phone'),destinations=document.getElementById('destinations'),addBtn=document.getElementById('addDestination'),message=document.getElementById('message'),count=document.getElementById('charCount'),flight=document.getElementById('flightNumber'),flightNote=document.getElementById('flightNote'),alertBox=document.getElementById('formInlineAlert'),passengerDetails=document.getElementById('passengerDetails'),passengerDetailsGroup=document.getElementById('passengerDetailsGroup');

  function showInlineAlert(text,success){
    if(!alertBox){alert(text);return}
    alertBox.textContent=text;alertBox.style.visibility='visible';alertBox.style.opacity='1';alertBox.style.borderColor=success?'#d4af37':'#c9a24d';clearTimeout(alertBox._timer);
    if(!success)requestAnimationFrame(function(){alertBox.scrollIntoView({behavior:'smooth',block:'center'})});
    alertBox._timer=setTimeout(function(){alertBox.style.opacity='0';alertBox.style.visibility='hidden'},3500)
  }

  function closeAllSelects(except){document.querySelectorAll('.luxury-select').forEach(function(w){if(w!==except){w.classList.remove('is-open');var menu=w.querySelector('.luxury-select-menu');if(menu)menu.hidden=true}})}

  function customSelect(sel){
    if(!sel)return null;
    var w=document.createElement('div'),b=document.createElement('button'),m=document.createElement('div');
    w.className='luxury-select';b.type='button';b.className='luxury-select-trigger';m.className='luxury-select-menu';m.hidden=true;w.append(b,m);sel.parentNode.insertBefore(w,sel);sel.classList.add('luxury-native-select');
    function draw(){b.textContent=sel.options[sel.selectedIndex]?sel.options[sel.selectedIndex].textContent:'';b.classList.toggle('has-selection',!!sel.value)}
    function build(){m.innerHTML='';Array.from(sel.options).forEach(function(o){var x=document.createElement('button');x.type='button';x.className='luxury-select-option';x.textContent=o.textContent;x.onclick=function(e){e.stopPropagation();sel.value=o.value;sel.dispatchEvent(new Event('change',{bubbles:true}));m.hidden=true;w.classList.remove('is-open');draw()};m.appendChild(x)})}
    b.onclick=function(e){e.stopPropagation();if(w.classList.contains('is-open')){m.hidden=true;w.classList.remove('is-open');return}closeAllSelects(w);m.hidden=false;w.classList.add('is-open')};
    sel.addEventListener('change',draw);build();draw();return{rebuild:build,refresh:draw,trigger:b}
  }

  var serviceUI=customSelect(service),vehicleUI=customSelect(vehicle),passengerUI=customSelect(passengers);
  var caps={'Mercedes-Maybach S-Class':3,'Mercedes-Benz S-Class':3,'Mercedes-Benz V-Class VIP':7,'Mercedes-Benz EQS Electric':3,'Mercedes-Benz E-Class':3,'Mercedes-Benz Vito V-Class VIP':7,'Mercedes-Benz Vito V-Class Minivan':8,'Mercedes-Benz Sprinter VIP':16};
  function renderPassengerDetails(){
    if(!passengerDetails)return;
    var existing={};
    passengerDetails.querySelectorAll('input[name^="passengerName_"]').forEach(function(input){existing[input.name]=input.value});
    var total=Number(passengers.value)||0;
    passengerDetails.innerHTML='';
    if(passengerDetailsGroup)passengerDetailsGroup.hidden=!total;
    for(var i=1;i<=total;i++){
      var group=document.createElement('div');
      group.className='passenger-detail-row';
      var label=document.createElement('label');
      label.setAttribute('for','passengerName_'+i);
      label.textContent='Passenger '+i+' Full Name';
      var input=document.createElement('input');
      input.type='text';input.id='passengerName_'+i;input.name='passengerName_'+i;input.placeholder='Full Name';input.autocomplete='name';input.required=true;
      input.value=existing['passengerName_'+i]||'';
      input.addEventListener('input',function(){clearFieldError(this)});
      group.append(label,input);passengerDetails.appendChild(group)
    }
  }
  function passengersForVehicle(){var o=vehicle.options[vehicle.selectedIndex],max=o&&o.dataset.capacity?+o.dataset.capacity:(caps[o?o.textContent:'']||0);var placeholder=max?'Select Number of Passenger (1-'+max+')':'Select number of passengers';passengers.innerHTML='<option value="">'+placeholder+'</option>';for(var i=1;i<=max;i++)passengers.add(new Option(String(i),String(i)));passengerUI.rebuild();passengerUI.refresh();renderPassengerDetails()}
  vehicle.addEventListener('change',passengersForVehicle);passengers.addEventListener('change',renderPassengerDetails);passengersForVehicle();
  document.addEventListener('click',function(){closeAllSelects()});

  function timeSelect(input){
    var wrap=document.createElement('div'),grid=document.createElement('div');wrap.className='time-picker-inline';grid.className='time-picker-grid';wrap.appendChild(grid);
    var hs=document.createElement('select'),ms=document.createElement('select');hs.className='time-part-select';ms.className='time-part-select';for(var h=0;h<24;h++)hs.add(new Option(String(h).padStart(2,'0'),String(h).padStart(2,'0')));for(var q=0;q<60;q++)ms.add(new Option(String(q).padStart(2,'0'),String(q).padStart(2,'0')));
    var hb=document.createElement('div'),mb=document.createElement('div'),hl=document.createElement('label'),ml=document.createElement('label');hb.className=mb.className='time-picker-part';hl.textContent='Hour';ml.textContent='Minute';hb.append(hl,hs);mb.append(ml,ms);grid.append(hb,mb);input.parentNode.insertBefore(wrap,input);input.style.display='none';input.required=true;
    var hu=customSelect(hs),mu=customSelect(ms);
    function sync(){input.value=hs.value+':'+ms.value;hu.refresh();mu.refresh();hu.trigger.classList.toggle('time-zero',hs.value==='00');mu.trigger.classList.toggle('time-zero',ms.value==='00');clearFieldError(hu.trigger);clearFieldError(mu.trigger);clearFieldError(input)}
    hs.onchange=ms.onchange=sync;sync();input._timeTriggers=[hu.trigger,mu.trigger]
  }
  timeSelect(startTime);timeSelect(endTime);

  var fpStart=flatpickr(startDate,{dateFormat:'d/m/Y',minDate:'today',disableMobile:true,allowInput:false,clickOpens:false}),fpEnd=flatpickr(endDate,{dateFormat:'d/m/Y',minDate:'today',disableMobile:true,allowInput:false,clickOpens:false});
  function toggleCalendar(picker,e){e.preventDefault();e.stopPropagation();if(picker.isOpen)picker.close();else picker.open()}
  var startCalendarButton=document.getElementById('startDateCalendarButton'),endCalendarButton=document.getElementById('endDateCalendarButton');
  startDate.addEventListener('click',function(e){toggleCalendar(fpStart,e)});
  endDate.addEventListener('click',function(e){toggleCalendar(fpEnd,e)});
  if(startCalendarButton)startCalendarButton.addEventListener('click',function(e){toggleCalendar(fpStart,e)});
  if(endCalendarButton)endCalendarButton.addEventListener('click',function(e){toggleCalendar(fpEnd,e)});

  var rows=[];
  function bindDestinationInput(input){input.addEventListener('input',function(){clearFieldError(input)})}
  function renumber(){rows.forEach(function(r,i){r.querySelector('.stop-no').textContent=i+1;r.querySelector('label').textContent=i?'Destination':'Pickup';r.querySelector('input').name='destination_'+(i+1);r.querySelector('input').placeholder='Airport / Hotel / Address';if(i===0){var x=r.querySelector('.remove-stop');if(x)x.remove()}})}
  function addDestination(){var i=rows.length+1,r=document.createElement('div');r.className='destination-row';r.innerHTML='<div class="stop-no">'+i+'</div><div class="form-group"><label>'+(i===1?'Pickup':'Destination')+'</label><input type="text" name="destination_'+i+'" placeholder="Airport / Hotel / Address" required></div>'+(i>1?'<button type="button" class="remove-stop">×</button>':'');destinations.appendChild(r);rows.push(r);bindDestinationInput(r.querySelector('input'));if(i>1)r.querySelector('.remove-stop').onclick=function(){r.remove();rows=rows.filter(function(x){return x!==r});renumber()};renumber()}
  addDestination();addBtn.onclick=addDestination;

  var iti=intlTelInput(phone,{initialCountry:'us',separateDialCode:true,allowDropdown:true,autoPlaceholder:'aggressive'});phone.setAttribute('autocomplete','tel');phone.setAttribute('placeholder','501 234 56 78');
  phone.addEventListener('countrychange',function(){var p=phone.getAttribute('placeholder');if(!p||p==='Phone Number')phone.setAttribute('placeholder','501 234 56 78');clearFieldError(phone.closest('.iti')||phone)});
  phone.addEventListener('keydown',function(e){if(e.ctrlKey||e.metaKey||['Backspace','Delete','ArrowLeft','ArrowRight','Tab'].includes(e.key))return;if(!/^[0-9]$/.test(e.key))e.preventDefault()});phone.addEventListener('input',function(){this.value=this.value.replace(/\D/g,'');clearFieldError(phone.closest('.iti')||phone)});phone.addEventListener('paste',function(e){e.preventDefault();var t=(e.clipboardData||window.clipboardData).getData('text').replace(/\D/g,'');try{document.execCommand('insertText',false,t)}catch(_){phone.value+=t}clearFieldError(phone.closest('.iti')||phone)});

  message.addEventListener('input',function(){count.textContent=this.value.length+' / 2000'});
  function airport(){var v=(rows[0]&&rows[0].querySelector('input').value||'').toLowerCase(),a=/airport|havaliman|istanbul airport|sabiha|\bist\b|\bsaw\b/.test(v);flight.required=a;flight.placeholder=a?'Required for airport pickup':'Optional';flightNote.classList.toggle('show',a);if(!a)clearFieldError(flight)}rows[0].querySelector('input').addEventListener('input',airport);airport();
  function clearFieldError(field){if(field)field.classList.remove('field-error')}
  function markFieldError(field){if(field)field.classList.add('field-error')}
  function validEmail(v){return/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim())}
  function validDate(v){var m=v.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);if(!m)return false;var d=new Date(+m[3],+m[2]-1,+m[1]);return d.getFullYear()===+m[3]&&d.getMonth()===+m[2]-1&&d.getDate()===+m[1]}
  function clearTimeErrors(input){if(input&&input._timeTriggers)input._timeTriggers.forEach(clearFieldError);clearFieldError(input)}
  function showValidation(fields){fields.forEach(markFieldError);showInlineAlert('Please complete the highlighted fields so we can submit your request.',false)}
  service.addEventListener('change',function(){clearFieldError(serviceUI.trigger)});vehicle.addEventListener('change',function(){clearFieldError(vehicleUI.trigger)});passengers.addEventListener('change',function(){clearFieldError(passengerUI.trigger)});
  [startDate,endDate].forEach(function(f){f.addEventListener('input',function(){clearFieldError(f)});f.addEventListener('change',function(){clearFieldError(f)})});
  [document.getElementById('name'),document.getElementById('email'),flight].forEach(function(f){if(f)f.addEventListener('input',function(){clearFieldError(f)})});
  form.addEventListener('submit',function(e){var errors=[];if(!service.value)errors.push(serviceUI.trigger);if(!vehicle.value)errors.push(vehicleUI.trigger);if(!passengers.value)errors.push(passengerUI.trigger);if(passengerDetails){passengerDetails.querySelectorAll('input[name^="passengerName_"]').forEach(function(input){if(!input.value.trim())errors.push(input)})}if(!validDate(startDate.value.trim()))errors.push(startDate);if(!validDate(endDate.value.trim()))errors.push(endDate);if(!startTime.value.trim())errors.push(startTime._timeTriggers?startTime._timeTriggers[0]:startTime);if(!endTime.value.trim())errors.push(endTime._timeTriggers?endTime._timeTriggers[0]:endTime);rows.forEach(function(r){var input=r.querySelector('input');if(!input.value.trim())errors.push(input)});var name=document.getElementById('name'),email=document.getElementById('email');if(!name.value.trim())errors.push(name);if(!validEmail(email.value))errors.push(email);if(!phone.value.trim()||!iti.isValidNumber())errors.push(phone.closest('.iti')||phone);if(flight.required&&!flight.value.trim())errors.push(flight);if(startDate.value&&endDate.value&&validDate(startDate.value)&&validDate(endDate.value)){var s=startDate.value.split('/'),ed=endDate.value.split('/'),sdObj=new Date(+s[2],+s[1]-1,+s[0]),edObj=new Date(+ed[2],+ed[1]-1,+ed[0]);if(edObj<sdObj)errors.push(endDate);else if(edObj.getTime()===sdObj.getTime()&&endTime.value&&startTime.value&&endTime.value<=startTime.value)errors.push(endTime._timeTriggers?endTime._timeTriggers[0]:endTime)}if(errors.length){e.preventDefault();e.stopImmediatePropagation();showValidation(errors)}},true);
});