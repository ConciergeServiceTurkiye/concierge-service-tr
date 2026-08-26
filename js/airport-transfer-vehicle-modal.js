document.addEventListener('DOMContentLoaded',()=>{
  const trigger=document.getElementById('selectedVehicleName');
  if(!trigger)return;
  const vehicle=trigger.textContent.trim();
  const galleries={
    'Mercedes-Maybach S-Class':['assets/vehicles/maybach-s-class-1.jpg','assets/vehicles/maybach-s-class-2.jpg','assets/vehicles/maybach-s-class-3.jpg'],
    'Mercedes-Benz S-Class':['assets/vehicles/s-class-1.jpg','assets/vehicles/s-class-2.jpg','assets/vehicles/s-class-3.jpg'],
    'Mercedes-Benz V-Class VIP':['assets/vehicles/v-class-vip-1.jpg','assets/vehicles/v-class-vip-2.jpg','assets/vehicles/v-class-vip-3.jpg'],
    'Mercedes-Benz EQS Electric':['assets/vehicles/eqs-electric-1.jpg','assets/vehicles/eqs-electric-2.jpg','assets/vehicles/eqs-electric-3.jpg'],
    'Mercedes-Benz E-Class':['assets/vehicles/e-class-1.jpg','assets/vehicles/e-class-2.jpg','assets/vehicles/e-class-3.jpg'],
    'Mercedes-Benz Vito V-Class VIP':['assets/vehicles/vito-v-class-vip-1.jpg','assets/vehicles/vito-v-class-vip-2.jpg','assets/vehicles/vito-v-class-vip-3.jpg'],
    'Mercedes-Benz Vito V-Class Minivan':['assets/vehicles/vito-v-class-minivan-1.jpg','assets/vehicles/vito-v-class-minivan-2.jpg','assets/vehicles/vito-v-class-minivan-3.jpg'],
    'Mercedes-Benz Sprinter VIP':['assets/vehicles/sprinter-vip-1.jpg','assets/vehicles/sprinter-vip-2.jpg','assets/vehicles/sprinter-vip-3.jpg']
  };
  const images=galleries[vehicle]||[];
  const style=document.createElement('style');
  style.textContent=`#formVehicleModal{position:fixed;inset:0;z-index:99999;display:none;align-items:center;justify-content:center;padding:22px}#formVehicleModal.is-open{display:flex}#formVehicleModal .fvm-backdrop{position:absolute;inset:0;background:rgba(0,0,0,.86);backdrop-filter:blur(6px)}#formVehicleModal .fvm-dialog{position:relative;z-index:1;width:min(900px,96vw);background:#0b0b0b;border:1px solid #d4af37;border-radius:16px;overflow:hidden;box-shadow:0 30px 90px rgba(0,0,0,.7)}#formVehicleModal .fvm-gallery{height:min(58vh,520px);position:relative;background:#151515}#formVehicleModal .fvm-image{width:100%;height:100%;background:center/cover no-repeat}#formVehicleModal .fvm-arrow{position:absolute;top:50%;transform:translateY(-50%);z-index:2;width:46px;height:46px;border:0;border-radius:50%;background:rgba(0,0,0,.55);color:#fff;font-size:38px;line-height:1;cursor:pointer}#formVehicleModal .fvm-arrow:hover{color:#d4af37}#formVehicleModal .fvm-prev{left:16px}#formVehicleModal .fvm-next{right:16px}#formVehicleModal .fvm-counter{position:absolute;bottom:14px;left:50%;transform:translateX(-50%);background:rgba(0,0,0,.58);color:rgba(255,255,255,.8);padding:5px 10px;border-radius:14px;font-size:11px}#formVehicleModal .fvm-close{position:absolute;right:12px;top:10px;z-index:3;width:42px;height:42px;border:0;border-radius:50%;background:rgba(0,0,0,.7);color:#fff;font-size:30px;cursor:pointer}#formVehicleModal .fvm-close:hover{color:#d4af37}#formVehicleModal .fvm-info{padding:22px 26px}#formVehicleModal .fvm-kicker{color:#fff;font-size:10px;letter-spacing:2px;text-transform:uppercase;margin-bottom:7px}#formVehicleModal h2{margin:0;color:#d4af37;font-size:26px;font-weight:500}#formVehicleModal p{margin:7px 0 0;color:rgba(255,255,255,.72);font-size:13px}@media(max-width:650px){#formVehicleModal .fvm-gallery{height:300px}#formVehicleModal .fvm-info{padding:18px}#formVehicleModal h2{font-size:22px}}`;
  document.head.appendChild(style);
  const modal=document.createElement('div');modal.id='formVehicleModal';modal.innerHTML=`<div class="fvm-backdrop"></div><div class="fvm-dialog" role="dialog" aria-modal="true" aria-labelledby="fvmTitle"><button class="fvm-close" type="button" aria-label="Close">×</button><div class="fvm-gallery"><button class="fvm-arrow fvm-prev" type="button" aria-label="Previous photo">‹</button><div class="fvm-image"></div><button class="fvm-arrow fvm-next" type="button" aria-label="Next photo">›</button><div class="fvm-counter"></div></div><div class="fvm-info"><div class="fvm-kicker">Selected Vehicle</div><h2 id="fvmTitle"></h2><p class="fvm-capacity"></p></div></div>`;
  document.body.appendChild(modal);
  const image=modal.querySelector('.fvm-image'),counter=modal.querySelector('.fvm-counter'),capacity=document.getElementById('selectedVehicleCapacity');let index=0;
  const render=()=>{if(!images.length){image.style.backgroundImage='none';counter.textContent='';return}image.style.backgroundImage=`url('${images[index]}')`;counter.textContent=`${index+1} / ${images.length}`};
  const close=()=>{modal.classList.remove('is-open');document.body.style.overflow=''};
  const open=()=>{modal.querySelector('#fvmTitle').textContent=vehicle;modal.querySelector('.fvm-capacity').textContent=capacity?.textContent||'';index=0;render();modal.classList.add('is-open');document.body.style.overflow='hidden'};
  const move=step=>{if(images.length<2)return;index=(index+step+images.length)%images.length;render()};
  trigger.href='#';trigger.addEventListener('click',e=>{e.preventDefault();open()});
  modal.querySelector('.fvm-close').addEventListener('click',close);modal.querySelector('.fvm-backdrop').addEventListener('click',close);modal.querySelector('.fvm-prev').addEventListener('click',()=>move(-1));modal.querySelector('.fvm-next').addEventListener('click',()=>move(1));document.addEventListener('keydown',e=>{if(!modal.classList.contains('is-open'))return;if(e.key==='Escape')close();if(e.key==='ArrowLeft')move(-1);if(e.key==='ArrowRight')move(1)});
});
