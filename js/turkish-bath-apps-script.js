document.addEventListener('DOMContentLoaded',()=>{
  const form=document.getElementById('bathReservationForm');
  if(!form)return;
  const alertBox=document.getElementById('bathFormAlert');
  const experience=document.getElementById('experience'),date=document.getElementById('travelDate'),time=document.getElementById('preferredTime');
  const female=document.getElementById('femaleGuests'),male=document.getElementById('maleGuests'),name=document.getElementById('fullName'),email=document.getElementById('email'),phone=document.getElementById('phone'),details=document.getElementById('requestDetails');
  const iti=window.intlTelInputGlobals?.getInstance(phone);
  const show=(text,success=false)=>{alertBox.textContent=text;alertBox.style.display='block';alertBox.dataset.state=success?'success':'error';alertBox.scrollIntoView({behavior:'smooth',block:'nearest'});};
  form.addEventListener('submit',async e=>{
    e.preventDefault();e.stopImmediatePropagation();alertBox.style.display='none';
    if(!experience.value)return show('Please select your hammam experience.');
    if(!date.value)return show('Please select your preferred date.');
    if(!time.value)return show('Please select your preferred time.');
    const f=Number(female.value||0),m=Number(male.value||0);
    if(f+m<1)return show('Please enter the number of guests.');
    if(!name.value.trim())return show('Please enter your full name.');
    if(!email.value.trim()||!email.checkValidity())return show('Please enter a valid email address.');
    if(iti&&!iti.isValidNumber())return show('Please enter a valid phone number.');
    const preferredMethod=form.querySelector('input[name="preferredMethod"]:checked')?.value;
    if(!preferredMethod)return show('Please select your preferred contact method.');
    const payload=new FormData();
    payload.set('reservationType','Turkish Bath');
    payload.set('name',name.value.trim());payload.set('fullName',name.value.trim());payload.set('email',email.value.trim());payload.set('phone',iti?iti.getNumber():phone.value.trim());
    payload.set('subject','Turkish Bath Reservation');payload.set('experience',experience.value);payload.set('travelDate',date.value);payload.set('preferredTime',time.value);payload.set('femaleGuests',String(f));payload.set('maleGuests',String(m));payload.set('requestDetails',details.value.trim());payload.set('partner','Hürrem Sultan Hamamı');payload.set('status','New');payload.set('availability','Pending');payload.set('referrer','turkish-bath-form');
    payload.set('message', [
  'TURKISH BATH REQUEST — HÜRREM SULTAN HAMAMI', '',
  'GUEST DETAILS', 'Name: '+name.value.trim(), 'Email: '+email.value.trim(), 'Phone: '+(iti?iti.getNumber():phone.value.trim()), 'Preferred contact method: '+preferredMethod, '',
  'EXPERIENCE DETAILS', 'Experience: '+experience.value, 'Preferred date: '+date.value, 'Preferred time: '+time.value, 'Female guests: '+f, 'Male guests: '+m, 'Additional requests: '+(details.value.trim()||'None'), '',
  'This is a reservation request, not a confirmed booking. Please confirm availability and final details.'
].join('\\n'));
    payload.set('preferredMethod',preferredMethod);
    const submit=form.querySelector('button[type="submit"]');if(submit){submit.disabled=true;submit.dataset.originalText=submit.textContent;submit.textContent='Sending Request...';}
    const fields={};
    for(const [key,value] of payload.entries())if(!['name','fullName','email'].includes(key))fields[key]=value;
    try{
      const response=await fetch('/api/request',{method:'POST',headers:{'Content-Type':'application/json','Idempotency-Key':crypto.randomUUID()},body:JSON.stringify({formType:'Turkish bath reservation',subject:'New '+payload.get('partner')+' Reservation Request',customer:{name:name.value.trim(),email:email.value.trim()},preferredMethod,fields})});
      const result=await response.json().catch(()=>({}));
      if(!response.ok||result.success!==true)throw new Error(result.message||'The request could not be submitted.');
      if(preferredMethod==='WhatsApp')window.open('https://wa.me/905344888624?text='+encodeURIComponent(payload.get('message')),'_blank');
      show('Your Turkish bath request has been sent to our concierge team.',true);
      form.reset();if(iti){iti.setCountry('us');phone.value='';}document.getElementById('bathCharCount').textContent='0 / 2000';experience.dispatchEvent(new Event('change',{bubbles:true}));
    }
    catch(err){console.error('Turkish bath request error:',err);show(err.message||'Connection error. Please try again later.');}
    finally{if(submit){submit.disabled=false;submit.textContent=submit.dataset.originalText||'Submit Reservation Request';}}
  },true);
});