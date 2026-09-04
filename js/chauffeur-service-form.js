document.addEventListener('DOMContentLoaded',function(){
  var form=document.getElementById('serviceForm');
  if(!form)return;

  var service=document.getElementById('service'),vehicle=document.getElementById('vehicle'),passengers=document.getElementById('passengers'),startDate=document.getElementById('startDate'),endDate=document.getElementById('endDate'),startTime=document.getElementById('startTime'),endTime=document.getElementById('endTime'),phone=document.getElementById('phone'),destinations=document.getElementById('destinations'),addBtn=document.getElementById('addDestination'),message=document.getElementById('message'),count=document.getElementById('charCount'),flight=document.getElementById('flightNumber'),flightNote=document.getElementById('flightNote'),alertBox=document.getElementById('formInlineAlert');

  function showInlineAlert(text,success){if(!alertBox){alert(text);return}alertBox.textContent=text;alertBox.style.visibility='visible';alertBox.style.opacity='1';alertBox.style.borderColor=success?'#d4af37':'#c9a24d';clearTimeout(alertBox._timer);if(!success)requestAnimationFrame(function(){alertBox.scrollIntoView({behavior:'smooth',block:'center'})});alertBox._timer=setTimeout(function(){alertBox.style.opacity='0';alertBox.style.visibility='hidden'},3500)}

  function customSelect(sel){
    if(!sel)return null;
    var w=document.createElement('div'),b=document.createElement('button'),m=document.createElement('div');
    w.className='luxury-select';b.type='button';b.className='luxury-select-trigger';m.className='luxury-select-menu';m.hidden=true;
    w.append(b,m);sel.parentNode.insertBefore(w,sel);sel.classList.add('luxury-native-select');
    function draw(){b.textContent=sel.options[sel.selectedIndex]?sel.options[sel.selectedIndex].textContent:'';b.classList.toggle('has-selection',!!sel.value)}
    function build(){m.innerHTML='';Array.from(sel.options).forEach(function(o){var x=document.createElement('button');x.type='button';x.className='luxury-select-option';x.textContent=o.textContent;x.onclick=function(e){e.stopPropagation();sel.value=o.value;sel.dispatchEvent(new Event('change',{bubbles:true}));m.hidden=true;w.classList.remove('is-open');draw()};m.appendChild(x)})}
    b.onclick=function(e){e.stopPropagation();document.querySelectorAll('.luxury-select-menu').forEach(function(x){x.hidden=true});document.querySelectorAll('.luxury-select').forEach(function(x){x.classList.remove('is-open')});m.hidden=false;w.classList.add('is-open')};
    sel.addEventListener('change',draw);build();draw();return{rebuild:build,refresh:draw,trigger:b}
  }

  var serviceUI=customSelect(service),vehicleUI=customSelect(vehicle),passengerUI=customSelect(passengers);
  var caps={'Mercedes-Maybach S-Class':3,'Mercedes-Benz S-Class':3,'Mercedes-Benz V-Class VIP':7,'Mercedes-Benz EQS Electric':3,'Mercedes-Benz E-Class':3,'Mercedes-Benz Vito V-Class VIP':7,'Mercedes-Benz Vito V-Class Minivan':8,'Mercedes-Benz Sprinter VIP':16};
  function passengersForVehicle(){var o=vehicle.options[vehicle.selectedIndex],max=o&&o.dataset.capacity?+o.dataset.capacity:(caps[o?o.textContent:'']||0);passengers.innerHTML='<option value="">Select number of passengers</option>';for(var i=1;i<=max;i++)passengers.add(new Option(String(i),String(i)));passengerUI.rebuild();passengerUI.refresh()}
  vehicle.addEventListener('change',passengersForVehicle);passengersForVehicle();
  document.addEventListener('click',function(){document.querySelectorAll('.luxury-select-menu').forEach(function(m){m.hidden=true});document.querySelectorAll('.luxury-select').forEach(function(w){w.classList.remove('is-open')})});

  function timeSelect(input){
    var wrap=document.createElement('div'),grid=document.createElement('div');wrap.className='time-picker-inline';grid.className='time-picker-grid';wrap.appendChild(grid);
    var hs=document.createElement('select'),ms=document.createElement('select');hs.className='time-part-select';ms.className='time-part-select';for(var h=0;h<24;h++)hs.add(new Option(String(h).padStart(2,'0'),String(h).padStart(2,'0')));for(var q=0;q<60;q++)ms.add(new Option(String(q).padStart(2,'0'),String(q).padStart(2,'0')));
    var hb=document.createElement('div'),mb=document.createElement('div'),hl=document.createElement('label'),ml=document.createElement('label');hb.className=mb.className='time-picker-part';hl.textContent='Hour';ml.textContent='Minute';hb.append(hl,hs);mb.append(ml,ms);grid.append(hb,mb);input.parentNode.insertBefore(wrap,input);input.style.display='none';input.required=true;
    var hu=customSelect(hs),mu=customSelect(ms);
    function sync(){input.value=hs.value+':'+ms.value;hu.refresh();mu.refresh();hu.trigger.classList.toggle('time-zero',hs.value==='00');mu.trigger.classList.toggle('time-zero',ms.value==='00');clearFieldError(hu.trigger);clearFieldError(mu.trigger);clearFieldError(input)}
    hs.onchange=ms.onchange=sync;sync();
    input._timeTriggers=[hu.trigger,mu.trigger];
  }
  timeSelect(startTime);timeSelect(endTime);

  var fpStart=flatpickr(startDate,{dateFormat:'d/m/Y',minDate:'today',disableMobile:true}),fpEnd=flatpickr(endDate,{dateFormat:'d/m/Y',minDate:'today',disableMobile:true});
  document.getElementById('startDateCalendarButton').onclick=function(){fpStart.open()};document.getElementById('endDateCalendarButton').onclick=function(){fpEnd.open()};

  var rows=[];
  function bindDestinationInput(input){input.addEventListener('input',function(){clearFieldError(input)})}
  function renumber(){rows.forEach(function(r,i){r.querySelector('.stop-no').textContent=i+1;r.querySelector('label').textContent=i?'Destination':'Pickup';r.querySelector('input').name='destination_'+(i+1);if(i===0){var x=r.querySelector('.remove-stop');if(x)x.remove()}})}
  function addDestination(){var i=rows.length+1,r=document.createElement('div');r.className='destination-row';r.innerHTML='<div class="stop-no">'+i+'</div><div class="form-group"><label>'+(i===1?'Pickup':'Destination')+'</label><input type="text" name="destination_'+i+'" placeholder="'+(i===1?'Airport / Hotel / Address':'Add a destination')+'" required></div>'+(i>1?'<button type="button" class="remove-stop">×</button>':'');destinations.appendChild(r);rows.push(r);bindDestinationInput(r.querySelector('input'));if(i>1)r.querySelector('.remove-stop').onclick=function(){r.remove();rows=rows.filter(function(x){return x!==r});renumber()};renumber()}
  addDestination();addBtn.onclick=addDestination;

  var iti=intlTelInput(phone,{initialCountry:'us',separateDialCode:true,allowDropdown:true,autoPlaceholder:'aggressive'});phone.setAttribute('autocomplete','tel');phone.setAttribute('placeholder','501 234 56 78');
  phone.addEventListener('countrychange',function(){var p=phone.getAttribute('placeholder');if(!p||p==='Phone Number')phone.setAttribute('placeholder','501 234 56 78');clearFieldError(phone.closest('.iti')||phone)});phone.addEventListener('keydown',function(e){if(e.ctrlKey||e.metaKey||['Backspace','Delete','ArrowLeft','ArrowRight','Tab'].includes(e.key))return;if(!/^[0-9]$/.test(e.key))e.preventDefault()});phone.addEventListener('input',function(){this.value=this.value.replace(/\D/g,'');clearFieldError(phone.closest('.iti')||phone)});phone.addEventListener('paste',function(e){e.preventDefault();var t=(e.clipboardData||window.clipboardData).getData('text').replace(/\D/g,'');try{document.execCommand('insertText',false,t)}catch(_){phone.value+=t}clearFieldError(phone.closest('.iti')||phone)});

  message.addEventListener('input',function(){count.textContent=this.value.length+' / 2000'});

  function airport(){var v=(rows[0]&&rows[0].querySelector('input').value||'').toLowerCase(),a=/airport|havaliman|istanbul airport|sabiha|\bist\b|\bsaw\b/.test(v);flight.required=a;flight.placeholder=a?'Required for airport pickup':'Optional';flightNote.classList.toggle('show',a);if(!a)clearFieldError(flight)}rows[0].querySelector('input').addEventListener('input',airport);airport();

  function clearFieldError(field){if(field)field.classList.remove('field-error')}
  function markFieldError(field){if(field)field.classList.add('field-error')}
  function validEmail(v){return/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim())}
  function validDate(v){var m=v.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);if(!m)return false;var d=new Date(+m[3],+m[2]-1,+m[1]);return d.getFullYear()===+m[3]&&d.getMonth()===+m[2]-1&&d.getDate()===+m[1]}
  function clearTimeErrors(input){if(input&&input._timeTriggers)input._timeTriggers.forEach(clearFieldError);clearFieldError(input)}
  function clearAllRelevantError(field){clearFieldError(field);if(field===startTime||field===endTime)clearTimeErrors(field)}
  function showValidation(fields){fields.forEach(markFieldError);showInlineAlert('Please complete the highlighted fields so we can submit your request.',false)}

  service.addEventListener('change',function(){clearFieldError(serviceUI.trigger)});
  vehicle.addEventListener('change',function(){clearFieldError(vehicleUI.trigger)});
  passengers.addEventListener('change',function(){clearFieldError(passengerUI.trigger)});
  [startDate,endDate].forEach(function(f){f.addEventListener('input',function(){clearFieldError(f)});f.addEventListener('change',function(){clearFieldError(f)})});
  [document.getElementById('name'),document.getElementById('email'),flight].forEach(function(f){if(f)f.addEventListener('input',function(){clearFieldError(f)})});

  form.addEventListener('submit',function(e){
    var errors=[];
    if(!service.value)errors.push(serviceUI.trigger);
    if(!vehicle.value)errors.push(vehicleUI.trigger);
    if(!passengers.value)errors.push(passengerUI.trigger);
    if(!validDate(startDate.value.trim()))errors.push(startDate);
    if(!validDate(endDate.value.trim()))errors.push(endDate);
    if(!startTime.value.trim())errors.push(startTime._timeTriggers?startTime._timeTriggers[0]:startTime);
    if(!endTime.value.trim())errors.push(endTime._timeTriggers?endTime._timeTriggers[0]:endTime);
    rows.forEach(function(r){var input=r.querySelector('input');if(!input.value.trim())errors.push(input)});
    var name=document.getElementById('name'),email=document.getElementById('email');
    if(!name.value.trim())errors.push(name);
    if(!validEmail(email.value))errors.push(email);
    if(!phone.value.trim()||!iti.isValidNumber())errors.push(phone.closest('.iti')||phone);
    if(flight.required&&!flight.value.trim())errors.push(flight);
    if(startDate.value&&endDate.value&&validDate(startDate.value)&&validDate(endDate.value)){var s=startDate.value.split('/'),ed=endDate.value.split('/'),sdObj=new Date(+s[2],+s[1]-1,+s[0]),edObj=new Date(+ed[2],+ed[1]-1,+ed[0]);if(edObj<sdObj){errors.push(endDate)}else if(edObj.getTime()===sdObj.getTime()&&endTime.value&&startTime.value&&endTime.value<=startTime.value){errors.push(endTime._timeTriggers?endTime._timeTriggers[0]:endTime)}}
    if(errors.length){e.preventDefault();e.stopImmediatePropagation();showValidation(errors)},true
  });

  function valueOf(id){var el=document.getElementById(id);return el?el.value.trim():''}
  function firstMissingDestination(){for(var i=0;i<rows.length;i++){var input=rows[i].querySelector('input');if(!input.value.trim())return i+1}return 0}
  function validDatesAndTimes(){if(!startDate.value.trim()||!endDate.value.trim()||!startTime.value.trim()||!endTime.value.trim())return'Please select your start and end date and time.';var s=startDate.value.split('/'),e=endDate.value.split('/');if(s.length!==3||e.length!==3)return'Please enter valid dates.';var sd=new Date(+s[2],+s[1]-1,+s[0]),ed=new Date(+e[2],+e[1]-1,+e[0]);if(isNaN(sd.getTime())||isNaN(ed.getTime()))return'Please enter valid dates.';if(ed<sd)return'End Date cannot be before Start Date.';if(ed.getTime()===sd.getTime()&&endTime.value<=startTime.value)return'End Time must be later than Start Time on the same day.';return''}

  form.addEventListener('submit',function(e){e.preventDefault();var missing=firstMissingDestination();if(!service.value)return showInlineAlert('Please select a chauffeur service.');if(!vehicle.value)return showInlineAlert('Please select a preferred vehicle.');if(!passengers.value)return showInlineAlert('Please select the number of passengers.');var dateError=validDatesAndTimes();if(dateError)return showInlineAlert(dateError);if(missing)return showInlineAlert(missing===1?'Please enter your pickup location.':'Please enter Destination '+missing+'.');if(!valueOf('name'))return showInlineAlert('Please enter your full name.');if(!valueOf('email'))return showInlineAlert('Please enter your email address.');if(!document.getElementById('email').checkValidity())return showInlineAlert('Please enter a valid email address.');if(!phone.value.trim())return showInlineAlert('Please enter your phone number.');if(!iti.isValidNumber())return showInlineAlert('Please enter a valid phone number.');if(flight.required&&!flight.value.trim())return showInlineAlert('Please enter your flight number for airport pickup.');showInlineAlert('Please review your request details. All required fields are complete.',true)});
});