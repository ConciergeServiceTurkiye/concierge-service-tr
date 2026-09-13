document.addEventListener('DOMContentLoaded',()=>{
  const modal=document.getElementById('vehicleModal');
  if(!modal)return;
  const image=modal.querySelector('#vehicleModalImage'),title=modal.querySelector('#vehicleModalTitle'),capacity=modal.querySelector('#vehicleModalCapacity'),select=modal.querySelector('#vehicleModalSelect'),counter=modal.querySelector('#vehicleGalleryCounter'),fallback=modal.querySelector('#vehicleGalleryFallback'),prev=modal.querySelector('.vehicle-gallery-prev'),next=modal.querySelector('.vehicle-gallery-next');
  let images=[],index=0;
  const handoffPrefill=new URLSearchParams(window.location.search).get('prefill');

  if('scrollRestoration' in history)history.scrollRestoration='auto';
  const saveScroll=()=>{history.replaceState(Object.assign({},history.state||{},{airportTransferScrollY:window.scrollY}),'',window.location.href)};
  const addPrefill=url=>{if(!handoffPrefill)return url;const u=new URL(url,window.location.href);u.searchParams.set('prefill',handoffPrefill);u.searchParams.set('from','meet-and-greet');return u.pathname.replace(/^\//,'')+(u.search?'?'+u.searchParams.toString():'')};
  const close=()=>{modal.hidden=true;document.body.style.overflow=''};
  const render=()=>{if(!images.length){image.style.backgroundImage='none';fallback.hidden=false;counter.textContent='';prev.hidden=true;next.hidden=true;return}fallback.hidden=true;image.style.backgroundImage=`url('${images[index]}')`;counter.textContent=`${index+1} / ${images.length}`;prev.hidden=images.length<2;next.hidden=images.length<2};
  const move=step=>{if(images.length<2)return;index=(index+step+images.length)%images.length;render()};
  const openVehicle=card=>{if(!card)return;const v=card.dataset.vehicle,c=card.dataset.capacity;images=(card.dataset.images||'').split('|').map(x=>x.trim()).filter(Boolean);index=0;title.textContent=v;capacity.textContent=c;select.href=addPrefill(`forms/airport-transfer.html?vehicle=${encodeURIComponent(v)}&capacity=${encodeURIComponent(c)}`);render();modal.hidden=false;document.body.style.overflow='hidden'};

  document.querySelectorAll('.vehicle-view').forEach(btn=>btn.addEventListener('click',()=>openVehicle(btn.closest('.vehicle-card'))));
  document.querySelectorAll('.vehicle-select').forEach(link=>link.addEventListener('click',e=>{saveScroll();if(handoffPrefill){e.preventDefault();window.location.href=addPrefill(link.getAttribute('href'))}}));
  select.addEventListener('click',saveScroll);
  prev.addEventListener('click',()=>move(-1));
  next.addEventListener('click',()=>move(1));
  modal.querySelector('.vehicle-modal-close').addEventListener('click',close);
  modal.querySelector('.vehicle-modal-backdrop').addEventListener('click',close);

  document.addEventListener('keydown',e=>{if(modal.hidden)return;if(e.key==='Escape')close();if(e.key==='ArrowLeft')move(-1);if(e.key==='ArrowRight')move(1)});

  const viewVehicle=new URLSearchParams(window.location.search).get('viewVehicle');
  if(viewVehicle){
    const card=Array.from(document.querySelectorAll('.vehicle-card')).find(item=>item.dataset.vehicle===viewVehicle);
    if(card){history.replaceState(history.state||{},'',window.location.pathname);requestAnimationFrame(()=>openVehicle(card));}
  }
});