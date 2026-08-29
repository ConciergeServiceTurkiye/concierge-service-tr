document.addEventListener('DOMContentLoaded',()=>{
  const modal=document.getElementById('vehicleModal');
  if(!modal)return;
  const image=modal.querySelector('#vehicleModalImage'),title=modal.querySelector('#vehicleModalTitle'),capacity=modal.querySelector('#vehicleModalCapacity'),select=modal.querySelector('#vehicleModalSelect'),counter=modal.querySelector('#vehicleGalleryCounter'),fallback=modal.querySelector('#vehicleGalleryFallback'),prev=modal.querySelector('.vehicle-gallery-prev'),next=modal.querySelector('.vehicle-gallery-next');
  let images=[],index=0;

  // Let the browser restore the exact scroll position when Back returns to this history entry.
  if('scrollRestoration' in history)history.scrollRestoration='auto';

  const saveScroll=()=>{
    // Keep the current position as metadata only. The browser itself restores the visual position.
    history.replaceState(Object.assign({},history.state||{},{airportTransferScrollY:window.scrollY}),'',window.location.href);
  };

  const close=()=>{modal.hidden=true;document.body.style.overflow=''};
  const render=()=>{if(!images.length){image.style.backgroundImage='none';fallback.hidden=false;counter.textContent='';prev.hidden=true;next.hidden=true;return}fallback.hidden=true;image.style.backgroundImage=`url('${images[index]}')`;counter.textContent=`${index+1} / ${images.length}`;prev.hidden=images.length<2;next.hidden=images.length<2};
  const move=step=>{if(images.length<2)return;index=(index+step+images.length)%images.length;render()};
  const openVehicle=card=>{if(!card)return;const v=card.dataset.vehicle,c=card.dataset.capacity;images=(card.dataset.images||'').split('|').map(x=>x.trim()).filter(Boolean);index=0;title.textContent=v;capacity.textContent=c;select.href=`forms/airport-transfer.html?vehicle=${encodeURIComponent(v)}&capacity=${encodeURIComponent(c)}`;render();modal.hidden=false;document.body.style.overflow='hidden'};

  document.querySelectorAll('.vehicle-view').forEach(btn=>btn.addEventListener('click',()=>openVehicle(btn.closest('.vehicle-card'))));
  document.querySelectorAll('.vehicle-select').forEach(link=>link.addEventListener('click',saveScroll));
  select.addEventListener('click',saveScroll);
  prev.addEventListener('click',()=>move(-1));
  next.addEventListener('click',()=>move(1));
  modal.querySelector('.vehicle-modal-close').addEventListener('click',close);
  modal.querySelector('.vehicle-modal-backdrop').addEventListener('click',close);

  document.addEventListener('keydown',e=>{if(modal.hidden)return;if(e.key==='Escape')close();if(e.key==='ArrowLeft')move(-1);if(e.key==='ArrowRight')move(1)});

  const viewVehicle=new URLSearchParams(window.location.search).get('viewVehicle');
  if(viewVehicle){
    const card=Array.from(document.querySelectorAll('.vehicle-card')).find(item=>item.dataset.vehicle===viewVehicle);
    if(card){
      history.replaceState(history.state||{},'',window.location.pathname);
      requestAnimationFrame(()=>openVehicle(card));
    }
  }
});