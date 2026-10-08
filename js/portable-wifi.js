document.addEventListener('DOMContentLoaded',()=>{
  const form=document.getElementById('portableWifiForm');
  if(!form)return;
  const pickup=form.querySelector('[name="pickupDate"]');
  const ret=form.querySelector('[name="returnDate"]');
  const devices=form.querySelector('[name="devices"]');
  const estimate=document.getElementById('wifiEstimate');
  const daily=8.90;
  const today=new Date();
  const iso=d=>{const x=new Date(d.getTime()-d.getTimezoneOffset()*60000);return x.toISOString().slice(0,10)};
  if(pickup)pickup.min=iso(today);
  if(ret)ret.min=iso(today);
  pickup?.addEventListener('change',()=>{if(ret&&pickup.value)ret.min=pickup.value;updateEstimate()});
  ret?.addEventListener('change',updateEstimate);
  devices?.addEventListener('change',updateEstimate);
  function days(){
    if(!pickup?.value||!ret?.value)return 1;
    const a=new Date(pickup.value+'T12:00:00'),b=new Date(ret.value+'T12:00:00');
    const d=Math.ceil((b-a)/86400000);
    return Math.max(1,d);
  }
  function updateEstimate(){
    const total=days()*Number(devices?.value||1)*daily;
    estimate.textContent='€'+total.toFixed(2)+' estimated';
  }
  form.addEventListener('submit',e=>{
    e.preventDefault();
    if(ret.value && pickup.value && ret.value<pickup.value){alert('Please select a return date on or after the pickup date.');return;}
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
    ].join('\n');
    window.open('https://wa.me/905344888624?text='+encodeURIComponent(message),'_blank','noopener');
  });
  updateEstimate();
});
