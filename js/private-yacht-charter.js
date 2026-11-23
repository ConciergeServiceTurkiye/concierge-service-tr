(() => {
  const lightbox = document.getElementById('yachtLightbox');
  if (lightbox) {
    const stageImage = lightbox.querySelector('.yacht-lightbox-image');
    const stageVideo = lightbox.querySelector('.yacht-lightbox-video');
    const caption = lightbox.querySelector('.yacht-lightbox-caption');
    const count = lightbox.querySelector('.yacht-lightbox-count');
    const items = Array.from(document.querySelectorAll('.yacht-gallery-items img, .yacht-gallery-items video'));
    let current = 0;
    let lastTrigger = null;
    const showItem = (index) => {
      current = (index + items.length) % items.length;
      const item = items[current];
      stageVideo.pause();
      stageVideo.removeAttribute('src');
      stageVideo.querySelectorAll('source').forEach((source) => source.remove());
      stageImage.classList.remove('is-active');
      stageVideo.classList.remove('is-active');
      if (item.tagName === 'VIDEO') {
        const source = item.querySelector('source');
        if (source) stageVideo.appendChild(source.cloneNode(true));
        stageVideo.load();
        stageVideo.poster = item.getAttribute('poster') || '';
        stageVideo.classList.add('is-active');
      } else {
        stageImage.src = item.src;
        stageImage.alt = item.alt;
        stageImage.classList.add('is-active');
      }
      caption.textContent = item.tagName === 'VIDEO' ? 'Luxury 2 — Video' : item.alt;
      count.textContent = (current + 1) + ' / ' + items.length;
    };
    const openGallery = (index, trigger) => {
      lastTrigger = trigger;
      showItem(index);
      lightbox.hidden = false;
      document.body.style.overflow = 'hidden';
      lightbox.querySelector('.yacht-lightbox-close').focus();
    };
    const closeGallery = () => {
      stageVideo.pause();
      lightbox.hidden = true;
      document.body.style.overflow = '';
      if (lastTrigger) lastTrigger.focus();
    };
    document.querySelectorAll('[data-yacht-gallery] [data-gallery-open]').forEach((button) => {
      button.addEventListener('click', () => openGallery(Number(button.dataset.galleryOpen), button));
    });
    lightbox.querySelector('.yacht-lightbox-close').addEventListener('click', closeGallery);
    lightbox.querySelector('.yacht-lightbox-prev').addEventListener('click', () => showItem(current - 1));
    lightbox.querySelector('.yacht-lightbox-next').addEventListener('click', () => showItem(current + 1));
    lightbox.addEventListener('click', (event) => { if (event.target === lightbox) closeGallery(); });
    document.addEventListener('keydown', (event) => {
      if (lightbox.hidden) return;
      if (event.key === 'Escape') closeGallery();
      if (event.key === 'ArrowLeft') showItem(current - 1);
      if (event.key === 'ArrowRight') showItem(current + 1);
    });
  }

  const form = document.getElementById('yachtEnquiryForm');
  if (!form) return;

  const dateInput = document.getElementById('yachtDate');
  const guestsInput = document.getElementById('yachtGuests');
  const yachtSelect = document.getElementById('yachtChoice');
  const error = document.getElementById('yachtFormError');
  const today = new Date();
  const localToday = new Date(today.getTime() - today.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
  dateInput.min = localToday;

  document.querySelectorAll('[data-yacht-choice]').forEach((link) => {
    link.addEventListener('click', () => {
      const choice = link.getAttribute('data-yacht-choice');
      if (choice && yachtSelect) yachtSelect.value = choice;
    });
  });

  guestsInput.addEventListener('input', () => {
    const guests = Number(guestsInput.value);
    if (guests > 30) guestsInput.setCustomValidity('For more than 30 guests, please contact our concierge team for a tailored arrangement.');
    else if (guests < 1 && guestsInput.value) guestsInput.setCustomValidity('Please enter at least one guest.');
    else guestsInput.setCustomValidity('');
  });

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    error.hidden = true;
    if (!form.reportValidity()) return;

    const data = new FormData(form);
    const extras = data.getAll('extras');
    const guests = Number(data.get('guests'));
    if (guests > 30) {
      error.textContent = 'For groups larger than 30, please contact our concierge team directly so we can discuss a tailored arrangement.';
      error.hidden = false;
      return;
    }

    const lines = [
      'Hello Concierge Service Türkiye, I would like to enquire about a private yacht charter in Istanbul.',
      '',
      'Name: ' + data.get('name'),
      'Preferred date: ' + data.get('date'),
      'Start time: ' + data.get('time'),
      'Guests: ' + data.get('guests'),
      'Duration: ' + data.get('duration'),
      'Preferred yacht: ' + data.get('yacht'),
      'Pickup point: ' + data.get('pickup'),
      'Extras: ' + (extras.length ? extras.join(', ') : 'Not selected'),
      'Occasion / special requests: ' + (data.get('occasion') || 'None provided'),
      '',
      'Please confirm availability, final price and booking terms. I understand this is an enquiry and not a confirmed booking.'
    ];
    const url = 'https://wa.me/905344888624?text=' + encodeURIComponent(lines.join('\n'));
    const popup = window.open(url, '_blank');
    if (popup) popup.opener = null;
    else window.location.href = url;
  });
})();