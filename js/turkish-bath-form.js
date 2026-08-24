document.addEventListener('DOMContentLoaded',()=>{
  const form=document.getElementById('bathReservationForm'); if(!form)return;
  const alertBox=document.getElementById('bathFormAlert');
  const params=new URLSearchParams(location.search);
  const experience=document.getElementById('experience');
  const date=document.getElementById('travelDate');
  const time=document.getElementById('preferredTime');
  const count=document.getElementById('passengerCount');
  const gender=document.getElementById('genderPreference');
  const female=document.getElementById('femaleGuests');
  const male=document.getElementById('maleGuests');
  const name=document.getElementById('fullName');
  const email=document.getElementById('email');
  const phone=document.getElementById('phone');
  const details=document.getElementById('requestDetails');
  const counter=document.getElementById('bathCharCount');

  function alertUser(text){alertBox.textContent=text;alertBox.style.display='block';alertBox.scrollIntoView({behavior:'smooth',block:'nearest'});}
  details.addEventListener('input',()=>counter.textContent=`${details.value.length} / 2000`);

  const iti=intlTelInput(phone,{initialCountry:'us',separateDialCode:true});
  phone.addEventListener('keydown',e=>{if(e.ctrlKey||e.metaKey||['Backspace','Delete','ArrowLeft','ArrowRight','Tab'].includes(e.key))return;if(!/^[0-9]$/.test(e.key))e.preventDefault();});
  phone.addEventListener('input',()=>phone.value=phone.value.replace(/\D/g,''));

  flatpickr(date,{dateFormat:'Y-m-d',altInput:true,altFormat:'F j, Y',minDate:'today',disableMobile:true});

  const preset=params.get('experience');
  if(preset){const wanted=preset.toLowerCase();[...experience.options].some(o=>{if(o.text.toLowerCase()===wanted){experience.value=o.value;return true}return false})}

  function validate(){
    if(!experience.value)return 'Please select your hammam experience.';
    if(!date.value)return 'Please select your preferred date.';
    if(!time.value)return 'Please select your preferred time.';
    if(!count.value)return 'Please select the number of guests.';
    if(!gender.value)return 'Please select the guest arrangement.';
    const f=Number(female.value||0),m=Number(male.value||0),c=count.value==='17+'?17:Number(count.value);
    if(f+m>0&&f+m!==c&&count.value!=='17+')return 'Please make sure the female and male guest counts match the total number of guests.';
    if(!name.value.trim())return 'Please enter your full name.';
    if(!email.value.trim())return 'Please enter your email address.';
    if(!email.checkValidity())return 'Please enter a valid email address.';
    if(!iti.isValidNumber())return 'Please enter a valid phone number.';
    return '';
  }

  form.addEventListener('submit',e=>{e.preventDefault();alertBox.style.display='none';const error=validate();if(error)return alertUser(error);
    alertUser('Your reservation request is ready. The booking connection will be added next.');
  });
});