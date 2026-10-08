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

  const pad=n=>String(n).padStart(2,'0');
  const today=new Date();
  const todayIso=`${today.getFullYear()}-${pad(today.getMonth()+1)}-${pad(today.getDate())}`;

  // -------------------------
  // WhatsApp number
  // -------------------------
  const normalizePhone=value=>{
    const digits=String(value||'').replace(/\D/g,'');
    return '+'+digits;
  };

  if(whatsapp){
    whatsapp.value='+';

    const keepCaretAfterPrefix=()=>{
      if(whatsapp.selectionStart===0){
        whatsapp.setSelectionRange(1,1);
      }
    };

    whatsapp.addEventListener('focus',()=>{
      if(!whatsapp.value || whatsapp.value.charAt(0)!=='+'){
        whatsapp.value=normalizePhone(whatsapp.value);
      }
      requestAnimationFrame(()=>{
        whatsapp.setSelectionRange(Math.max(1,whatsapp.value.length),Math.max(1,whatsapp.value.length));
      });
    });

    whatsapp.addEventListener('keydown',event=>{
      const start=whatsapp.selectionStart ?? 0;
      const end=whatsapp.selectionEnd ?? 0;

      if(['Tab','ArrowLeft','ArrowRight','Home','End'].includes(event.key)){
        if(event.key==='Home'){
          event.preventDefault();
          whatsapp.setSelectionRange(1,1);
        }
        return;
      }

      if(event.key==='Backspace'){
        if(start<=1 || (start<2 && end>0)){
          event.preventDefault();
          keepCaretAfterPrefix();
        }
        return;
      }

      if(event.key==='Delete'){
        if(start===0 || (start<1 && end>0)){
          event.preventDefault();
          keepCaretAfterPrefix();
        }
        return;
      }

      if(event.ctrlKey||event.metaKey){
        return;
      }

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
      let normalized=normalizePhone(whatsapp.value);
      if(!normalized.startsWith('+'))normalized='+'+normalized;
      if(whatsapp.value!==normalized)whatsapp.value=normalized;
      if(whatsapp.value.length===0)whatsapp.value='+';
      whatsapp.setCustomValidity('');
    });

    whatsapp.addEventListener('paste',()=>{
      setTimeout(()=>{
        whatsapp.value=normalizePhone(whatsapp.value);
        if(!whatsapp.value)whatsapp.value='+';
      },0);
    });
  }

  // -------------------------
  // DD.MM.YYYY date inputs
  // -------------------------
  const formatDateInput=input=>{
    if(!input)return;
    const digits=input.value.replace(/\D/g,'').slice(0,8);
    let formatted=digits;
    if(digits.length>2)formatted=digits.slice(0,2)+'.'+digits.slice(2);
    if(digits.length>4)formatted=formatted.slice(0,5)+'.'+formatted.slice(4);
    input.value=formatted;
  };

  const parseDate=input=>{
    const value=input?.value.trim()||'';
    const match=value.match(/^(\d{2})\.(\d{2})\.(\d{4})$/);
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

  const displayDateFromIso=iso=>{
    if(!iso)return '';
    const [year,month,day]=iso.split('-').map(Number);
    return `${pad(day)}.${pad(month)}.${year}`;
  };

  [pickup,ret].forEach(input=>{
    if(!input)return;

    input.addEventListener('input',()=>{
      formatDateInput(input);
      input.setCustomValidity('');
      updateEstimate();
    });

    input.addEventListener('blur',()=>{
      formatDateInput(input);
      if(input.value && !parseDate(input)){
        input.setCustomValidity('Please enter a valid date in DD.MM.YYYY format.');
      }else{
        input.setCustomValidity('');
      }
    });
  });

  function validateDates(showMessage=false){
    if(!pickup||!ret)return true;

    pickup.setCustomValidity('');
    ret.setCustomValidity('');

    const pickupDate=parseDate(pickup);
    const returnDate=parseDate(ret);

    if(!pickup.value){
      pickup.setCustomValidity('Please select a pickup date.');
      if(showMessage)pickup.reportValidity();
      return false;
    }

    if(!pickupDate){
      pickup.setCustomValidity('Please enter a valid pickup date in DD.MM.YYYY format.');
      if(showMessage)pickup.reportValidity();
      return false;
    }

    if(pickupDate.iso<todayIso){
      pickup.setCustomValidity('Please select today or a future pickup date.');
      if(showMessage)pickup.reportValidity();
      return false;
    }

    if(!ret.value){
      ret.setCustomValidity('Please select a return date.');
      if(showMessage)ret.reportValidity();
      return false;
    }

    if(!returnDate){
      ret.setCustomValidity('Please enter a valid return date in DD.MM.YYYY format.');
      if(showMessage)ret.reportValidity();
      return false;
    }

    if(returnDate.iso<todayIso){
      ret.setCustomValidity('Please select today or a future return date.');
      if(showMessage)ret.reportValidity();
      return false;
    }

    if(returnDate.iso<pickupDate.iso){
      ret.setCustomValidity('Please select a return date on or after the pickup date.');
      if(showMessage)ret.reportValidity();
      return false;
    }

    return true;
  }

  // -------------------------
  // English validation
  // -------------------------
  form.querySelectorAll('input, select, textarea').forEach(field=>{
    field.addEventListener('invalid',()=>{
      if(field===whatsapp){
        const digits=field.value.replace(/\D/g,'');
        field.setCustomValidity(
          digits.length<7
            ? 'Please enter your WhatsApp number.'
            : ''
        );
        return;
      }

      if(field===email){
        const value=field.value.trim();

        if(!value){
          field.setCustomValidity('Please enter your email address.');
        }else if(!value.includes('@')){
          field.setCustomValidity('Please add an @ to your email address.');
        }else if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)){
          field.setCustomValidity('Please enter a valid email address.');
        }else{
          field.setCustomValidity('');
        }
        return;
      }

      if(field===pickup||field===ret){
        validateDates();
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
      if(field!==pickup&&field!==ret)field.setCustomValidity('');
    });

    field.addEventListener('change',()=>{
      if(field!==pickup&&field!==ret)field.setCustomValidity('');
    });
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

  form.addEventListener('submit',e=>{
    e.preventDefault();

    if(!validateDates(true))return;

    if(!form.checkValidity()){
      form.reportValidity();
      return;
    }

    const data=new FormData(form);
    const pickupDate=parseDate(pickup);
    const returnDate=parseDate(ret);
    const d=days();
    const total=(d*Number(data.get('devices')||1)*daily).toFixed(2);

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
