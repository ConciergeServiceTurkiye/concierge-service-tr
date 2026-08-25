document.addEventListener('DOMContentLoaded',()=>{
  const form=document.getElementById('bathReservationForm');
  if(!form)return;
  const ENDPOINT='https://script.google.com/macros/s/AKfycbxvOeMaThb3zFJVCZuGdQbJk-dAFH7W06vkoYPCfyfal_GUxF1dvXinEWMZoP8OtKpKcg/exec';
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
    const payload=new FormData();
    payload.set('reservationType','Turkish Bath');
    payload.set('name',name.value.trim());payload.set('fullName',name.value.trim());payload.set('email',email.value.trim());payload.set('phone',iti?iti.getNumber():phone.value.trim());
    payload.set('subject','Turkish Bath Reservation');payload.set('experience',experience.value);payload.set('travelDate',date.value);payload.set('preferredTime',time.value);payload.set('femaleGuests',String(f));payload.set('maleGuests',String(m));payload.set('requestDetails',details.value.trim());payload.set('partner','Hürrem Sultan Hamamı');payload.set('status','New');payload.set('availability','Pending');payload.set('referrer','turkish-bath-form');
    payload.set('message',`Experience: ${experience.value}\nPreferred Date: ${date.value}\nPreferred Time: ${time.value}\nFemale Guests: ${f}\nMale Guests: ${m}\nPartner: Hürrem Sultan Hamamı\nRequest Details: ${details.value.trim()}`);
    const submit=form.querySelector('button[type="submit"]');if(submit){submit.disabled=true;submit.dataset.originalText=submit.textContent;submit.textContent='Sending Request...';}
    try{const response=await fetch(ENDPOINT,{method:'POST',body:payload});const text=(await response.text()).trim();if(text==='success'){show('Your Turkish bath reservation request has been received.',true);form.reset();if(iti){iti.setCountry('us');phone.value='';}document.getElementById('bathCharCount').textContent='0 / 2000';experience.dispatchEvent(new Event('change',{bubbles:true}));}else show('Something went wrong. Please try again.');}
    catch(err){console.error('Turkish Bath Apps Script error:',err);show('Connection error. Please try again later.');}
    finally{if(submit){submit.disabled=false;submit.textContent=submit.dataset.originalText||'Submit Reservation Request';}}
  },true);
});