document.addEventListener('DOMContentLoaded',()=>{
  const form=document.getElementById('portableWifiForm');
  if(!form)return;

  const name=form.querySelector('[name="name"]');
  const pickup=form.querySelector('[name="pickupDate"]');
  const ret=form.querySelector('[name="returnDate"]');
  const devices=form.querySelector('[name="devices"]');
  const whatsapp=form.querySelector('[name="whatsapp"]');
  const email=form.querySelector('[name="email"]');
  const pickupLocation=form.querySelector('[name="pickup"]');
  const returnLocation=form.querySelector('[name="return"]');
  const estimate=document.getElementById('wifiEstimate');
  const daily=8.90;

  const pad=n=>String(n).padStart(2,'0');
  const now=new Date();
  const todayIso=`${now.getFullYear()}-${pad(now.getMonth()+1)}-${pad(now.getDate())}`;

  // -------------------------------------------------
  // WhatsApp number: permanent + prefix, digits only
  // -------------------------------------------------
  if(whatsapp){
    whatsapp.value='+';

    const placeCaretAfterPlus=()=>{
      const pos=Math.max(1,whatsapp.value.length);
      whatsapp.setSelectionRange(pos,pos);
    };

    whatsapp.addEventListener('focus',()=>{
      if(!whatsapp.value.startsWith('+')){
        whatsapp.value='+'+whatsapp.value.replace(/\\D/g,'');
      }
      requestAnimationFrame(placeCaretAfterPlus);
    });

    whatsapp.addEventListener('keydown',event=>{
      const start=whatsapp.selectionStart ?? 0;
      const end=whatsapp.selectionEnd ?? 0;

      if(['Tab','ArrowLeft','ArrowRight','End'].includes(event.key))return;

      if(event.key==='Home'){
        event.preventDefault();
        whatsapp.setSelectionRange(1,1);
        return;
      }

      if(event.key==='Backspace'){
        if(start<=1){
          event.preventDefault();
          whatsapp.setSelectionRange(1,1);
        }
        return;
      }

      if(event.key==='Delete'){
        if(start===0 || (start===1 && end>1)){
          event.preventDefault();
          whatsapp.setSelectionRange(1,1);
        }
        return;
      }

      if(event.ctrlKey||event.metaKey)return;

      if(!/^[0-9]$/.test(event.key)){
        event.preventDefault();
        return;
      }

      if(start===0){
        event.preventDefault();
        whatsapp.setSelectionRange(1,1);
      }
    });

    whatsapp.addEventListener('input',()=>{
      const digits=whatsapp.value.replace(/\\D/g,'');
      whatsapp.value='+'+digits;
      whatsapp.setCustomValidity('');
    });

    whatsapp.addEventListener('paste',()=>{
      setTimeout(()=>{
        const digits=whatsapp.value.replace(/\\D/g,'');
        whatsapp.value='+'+digits;
        whatsapp.setCustomValidity('');
      },0);
    });
  }

  // -------------------------------------------------
  // DD.MM.YYYY mask
  // The value is rebuilt from digits so the browser
  // cannot turn 2026 into 0020/0002 while tabbing.
  // -------------------------------------------------
  const sanitizeDateDigits=digits=>{
    let raw=String(digits||'').replace(/\\D/g,'').slice(0,8);

    // Day: DD
    if(raw.length>=1 && Number(raw[0])>3)raw=raw.slice(0,0);
    if(raw.length>=2){
      const day=Number(raw.slice(0,2));
      if(day<1 || day>31)raw=raw.slice(0,1);
    }

    // Month: MM
    if(raw.length>=3 && Number(raw[2])>1)raw=raw.slice(0,2);
    if(raw.length>=4){
      const month=Number(raw.slice(2,4));
      if(month<1 || month>12)raw=raw.slice(0,3);
    }

    // Year: YYYY — exactly four digits, no browser date coercion.
    return raw;
  };

  const formatDateDigits=digits=>{
    const raw=sanitizeDateDigits(digits);
    if(raw.length<=2)return raw;
    if(raw.length<=4)return raw.slice(0,2)+'.'+raw.slice(2);
    return raw.slice(0,2)+'.'+raw.slice(2,4)+'.'+raw.slice(4);
  };

  const syncDateInput=input=>{
    if(!input)return;
    const digits=input.value.replace(/\\D/g,'');
    const formatted=formatDateDigits(digits);
    input.value=formatted;
    requestAnimationFrame(()=>{
      input.setSelectionRange(input.value.length,input.value.length);
    });
  };

  [pickup,ret].forEach(input=>{
    if(!input)return;

    input.addEventListener('keydown',event=>{
      if(event.ctrlKey||event.metaKey)return;
      if(['Tab','Shift','ArrowLeft','ArrowRight','Home','End','Backspace','Delete'].includes(event.key))return;
      if(!/^[0-9]$/.test(event.key))event.preventDefault();
    });

    input.addEventListener('input',()=>{
      syncDateInput(input);
      input.setCustomValidity('');
      updateEstimate();
    });

    input.addEventListener('paste',()=>{
      setTimeout(()=>{
        syncDateInput(input);
        input.setCustomValidity('');
        updateEstimate();
      },0);
    });
  });

  const parseDate=input=>{
    const value=input?.value.trim()||'';
    const match=value.match(/^(\\d{2})\\.(\\d{2})\\.(\\d{4})$/);
    if(!match)return null;

    const day=Number(match[1]);
    const month=Number(match[2]);
    const year=Number(match[3]);

    const date=new Date(year,month-1,day);
    if(
      date.getFullYear()!==year ||
      date.getMonth()!==month-1 ||
      date.getDate()!==day
    )return null;

    return {
      day,
      month,
      year,
      iso:`${year}-${pad(month)}-${pad(day)}`,
      date
    };
  };

  function setError(field,message,focus=true){
    field.setCustomValidity(message);
    if(focus){
      field.focus();
      field.reportValidity();
    }
    return false;
  }

  function clearErrors(){
    form.querySelectorAll('input,select,textarea').forEach(field=>{
      field.setCustomValidity('');
    });
  }

  function validateForm(){
    clearErrors();

    if(!name.value.trim()){
      return setError(name,'Please enter your full name.');
    }

    const phoneDigits=whatsapp.value.replace(/\\D/g,'');
    if(phoneDigits.length<7){
      return setError(whatsapp,'Please enter your WhatsApp number.');
    }

    const emailValue=email.value.trim();
    if(!emailValue){
      return setError(email,'Please enter your email address.');
    }
    if(!emailValue.includes('@')){
      return setError(email,'Please add an @ to your email address.');
    }
    if(!/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(emailValue)){
      return setError(email,'Please enter a valid email address.');
    }

    if(!pickup.value){
      return setError(pickup,'Please select a pickup date.');
    }

    const pickupDate=parseDate(pickup);
    if(!pickupDate){
      return setError(pickup,'Please enter a valid date in DD.MM.YYYY format.');
    }

    if(pickupDate.iso<todayIso){
      return setError(pickup,'Please select today or a future pickup date.');
    }

    if(!ret.value){
      return setError(ret,'Please select a return date.');
    }

    const returnDate=parseDate(ret);
    if(!returnDate){
      return setError(ret,'Please enter a valid date in DD.MM.YYYY format.');
    }

    if(returnDate.iso<todayIso){
      return setError(ret,'Please select today or a future return date.');
    }

    if(returnDate.iso<pickupDate.iso){
      return setError(ret,'Please select a return date on or after the pickup date.');
    }

    if(!pickupLocation.value){
      return setError(pickupLocation,'Please select a pickup location.');
    }

    if(!returnLocation.value){
      return setError(returnLocation,'Please select a return location.');
    }

    return true;
  }

  // Clear any custom message as soon as the customer corrects a field.
  form.querySelectorAll('input,select,textarea').forEach(field=>{
    field.addEventListener('input',()=>field.setCustomValidity(''));
    field.addEventListener('change',()=>field.setCustomValidity(''));
  });

  function days(){
    const a=parseDate(pickup);
    const b=parseDate(ret);
    if(!a||!b)return 1;
    return Math.max(1,Math.ceil((b.date-a.date)/86400000));
  }

  function updateEstimate(){
    const total=days()*Number(devices?.value||1)*daily;
    estimate.textContent='€'+total.toFixed(2)+' estimated';
  }

  form.addEventListener('submit',event=>{
    event.preventDefault();

    if(!validateForm())return;

    const data=new FormData(form);
    const pickupDate=parseDate(pickup);
    const returnDate=parseDate(ret);
    const d=days();
    const total=(d*Number(data.get('devices')||1)*daily).toFixed(2);

    // WhatsApp supports *bold* text and real line breaks.
    const message=[
      'PORTABLE WI-FI REQUEST — Concierge Service Türkiye',
      '',
      '*Guest:* '+data.get('name'),
      '*WhatsApp:* '+data.get('whatsapp'),
      '*Email:* '+data.get('email'),
      '*Devices:* '+data.get('devices'),
      '*Pickup date:* '+pickupDate.iso,
      '*Return date:* '+returnDate.iso,
      '*Pickup:* '+data.get('pickup'),
      '*Return:* '+data.get('return'),
      '*Hotel / address:* '+(data.get('address')||'N/A'),
      '*Flight / notes:* '+(data.get('notes')||'N/A'),
      '',
      '*Estimated Wi-Fi service:* €'+total,
      '',
      'Please arrange the reservation and send the secure 3D payment link.'
    ].join('\\n');

    window.open(
      'https://wa.me/905344888624?text='+encodeURIComponent(message),
      '_blank',
      'noopener'
    );
  });

  updateEstimate();
});
