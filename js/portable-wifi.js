document.addEventListener('DOMContentLoaded',()=>{
  const form=document.getElementById('portableWifiForm');
  if(!form)return;

  const pickup=form.querySelector('[name="pickupDate"]');
  const ret=form.querySelector('[name="returnDate"]');
  const devices=form.querySelector('[name="devices"]');
  const whatsapp=form.querySelector('[name="whatsapp"]');
  const email=form.querySelector('[name="email"]');
  const estimate=document.getElementById('wifiEstimate');
  const daily=8.90;

  const today=new Date();
  const iso=d=>{
    const x=new Date(d.getTime()-d.getTimezoneOffset()*60000);
    return x.toISOString().slice(0,10);
  };

  if(pickup)pickup.min=iso(today);
  if(ret)ret.min=iso(today);

  // Keep the WhatsApp number numeric and always start it with +.
  const normalizePhone=value=>{
    const digits=String(value||'').replace(/\\D/g,'');
    return '+'+digits;
  };

  if(whatsapp){
    whatsapp.value='+';

    whatsapp.addEventListener('focus',()=>{
      if(!whatsapp.value)whatsapp.value='+';
      if(whatsapp.value.charAt(0)!=='+')whatsapp.value='+'+whatsapp.value.replace(/\\D/g,'');
      requestAnimationFrame(()=>{
        whatsapp.setSelectionRange(whatsapp.value.length,whatsapp.value.length);
      });
    });

    whatsapp.addEventListener('input',()=>{
      const normalized=normalizePhone(whatsapp.value);
      if(whatsapp.value!==normalized)whatsapp.value=normalized;
      whatsapp.setCustomValidity('');
    });

    whatsapp.addEventListener('keydown',event=>{
      if(['Backspace','Delete','ArrowLeft','ArrowRight','Home','End','Tab'].includes(event.key))return;
      if(event.ctrlKey||event.metaKey)return;
      if(!/^[0-9]$/.test(event.key) && event.key!=='+')event.preventDefault();
      if(event.key==='+' && (whatsapp.selectionStart!==0 || whatsapp.value.includes('+')))event.preventDefault();
    });

    whatsapp.addEventListener('blur',()=>{
      if(!whatsapp.value)whatsapp.value='+';
    });
  }

  function validateDates(showMessage=false){
    if(!pickup||!ret)return true;

    ret.setCustomValidity('');

    if(ret.value && pickup.value && ret.value<pickup.value){
      ret.setCustomValidity('Please select a return date on or after the pickup date.');
      if(showMessage)ret.reportValidity();
      return false;
    }

    return true;
  }

  pickup?.addEventListener('change',()=>{
    if(pickup.value && ret)ret.min=pickup.value;
    validateDates();
    updateEstimate();
  });

  ret?.addEventListener('change',()=>{
    validateDates(true);
    updateEstimate();
  });

  devices?.addEventListener('change',updateEstimate);

  // Replace browser-localized validation messages with consistent English.
  form.querySelectorAll('input, select, textarea').forEach(field=>{
    field.addEventListener('invalid',()=>{
      if(field===whatsapp){
        const digits=field.value.replace(/\\D/g,'');
        if(!digits){
          field.setCustomValidity('Please enter your WhatsApp number.');
        }else if(digits.length<7){
          field.setCustomValidity('Please enter a valid WhatsApp number.');
        }else{
          field.setCustomValidity('');
        }
        return;
      }

      if(field===email){
        const value=field.value.trim();
        if(!value){
          field.setCustomValidity('Please enter your email address.');
        }else if(!value.includes('@')){
          field.setCustomValidity('Please add an @ to your email address.');
        }else{
          field.setCustomValidity('Please enter a valid email address.');
        }
        return;
      }

      if(field===pickup){
        if(!field.value){
          field.setCustomValidity('Please select a pickup date.');
        }else if(field.validity.rangeUnderflow){
          field.setCustomValidity('Please select today or a future pickup date.');
        }else{
          field.setCustomValidity('Please enter a valid pickup date.');
        }
        return;
      }

      if(field===ret){
        if(!field.value){
          field.setCustomValidity('Please select a return date.');
        }else if(field.validity.rangeUnderflow){
          field.setCustomValidity('Please select today or a future return date.');
        }else if(!validateDates()){
          // validateDates() supplies the cross-field English message.
        }else{
          field.setCustomValidity('Please enter a valid return date.');
        }
        return;
      }

      if(field.validity.valueMissing){
        const messages={
          name:'Please enter your full name.',
          pickup:'Please select a pickup location.',
          return:'Please select a return location.'
        };
        field.setCustomValidity(messages[field.name]||'Please complete this field.');
      }else{
        field.setCustomValidity('Please enter a valid value.');
      }
    },true);

    field.addEventListener('input',()=>{
      if(field!==ret)field.setCustomValidity('');
    });

    field.addEventListener('change',()=>{
      if(field!==ret)field.setCustomValidity('');
    });
  });

  function days(){
    if(!pickup?.value||!ret?.value)return 1;
    const a=new Date(pickup.value+'T12:00:00');
    const b=new Date(ret.value+'T12:00:00');
    const d=Math.ceil((b-a)/86400000);
    return Math.max(1,d);
  }

  function updateEstimate(){
    const total=days()*Number(devices?.value||1)*daily;
    estimate.textContent='€'+total.toFixed(2)+' estimated';
  }

  form.addEventListener('submit',e=>{
    e.preventDefault();

    validateDates();

    if(!form.checkValidity()){
      form.reportValidity();
      return;
    }

    const data=new FormData(form);
    const d=days();
    const total=(d*Number(data.get('devices')||1)*daily).toFixed(2);

    const message=[
      'PORTABLE WI-FI REQUEST — Concierge Service Türkiye',
      '',
      'Guest: '+data.get('name'),
      'WhatsApp: '+data.get('whatsapp'),
      'Email: '+data.get('email'),
      'Devices: '+data.get('devices'),
      'Pickup date: '+data.get('pickupDate'),
      'Return date: '+data.get('returnDate'),
      'Pickup: '+data.get('pickup'),
      'Return: '+data.get('return'),
      'Hotel / address: '+(data.get('address')||'N/A'),
      'Flight / notes: '+(data.get('notes')||'N/A'),
      '',
      'Estimated Wi-Fi service: €'+total,
      '',
      'Please arrange the reservation and send the secure 3D payment link.'
    ].join('\\n');

    window.open('https://wa.me/905344888624?text='+encodeURIComponent(message),'_blank','noopener');
  });

  updateEstimate();
});
