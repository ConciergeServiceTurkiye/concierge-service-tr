(() => {
  const modal = document.getElementById('yachtGalleryModal');
  if (modal) {
    const stage = modal.querySelector('.lokanta-vehicle-gallery');
    const imageFrame = modal.querySelector('#yachtGalleryModalImage');
    const counter = modal.querySelector('#yachtGalleryCounter');
    const prev = modal.querySelector('.lokanta-vehicle-gallery-prev');
    const next = modal.querySelector('.lokanta-vehicle-gallery-next');
    const gallery = document.querySelector('.yacht-lokanta-gallery');
    const photoButtons = gallery ? Array.from(gallery.querySelectorAll('.lokanta-gallery-photo')) : [];
    const items = photoButtons.map(button => {
      const img = button.querySelector('img');
      return {type:'image',src:img.getAttribute('src'),alt:img.alt};
    });
    items.push({type:'video',src:'assets/yachts/luxury-2/luxury-2-video.mp4',alt:'Luxury 2 yacht video'});
    let index = 0;
    let lastTrigger = null;
    let media = null;
    const stopMedia = () => {
      if (media && media.tagName === 'VIDEO') {
        media.pause();
        media.removeAttribute('src');
        media.load();
      }
      if (media) media.remove();
      media = null;
    };
    const render = () => {
      stopMedia();
      const item = items[index];
      if (!item) return;
      if (item.type === 'image') {
        media = document.createElement('img');
        media.src = item.src;
        media.alt = item.alt || 'Luxury 2 yacht photograph';
        media.className = 'yacht-gallery-modal-photo';
      } else {
        media = document.createElement('video');
        media.src = item.src;
        media.controls = true;
        media.autoplay = true;
        media.playsInline = true;
        media.className = 'yacht-gallery-modal-video';
      }
      stage.insertBefore(media, counter);
      imageFrame.style.display = 'none';
      counter.textContent = `${index + 1} / ${items.length}`;
      prev.hidden = false;
      next.hidden = false;
    };
    const move = step => {
      index = (index + step + items.length) % items.length;
      render();
    };
    const openAt = (itemIndex, trigger) => {
      lastTrigger = trigger;
      index = itemIndex;
      render();
      modal.hidden = false;
      document.body.style.overflow = 'hidden';
      modal.querySelector('.lokanta-vehicle-modal-close').focus();
    };
    const close = () => {
      stopMedia();
      modal.hidden = true;
      document.body.style.overflow = '';
      if (lastTrigger) lastTrigger.focus();
    };
    if (gallery) {
      gallery.addEventListener('click', event => {
        const button = event.target.closest('.lokanta-gallery-photo');
        if (!button) return;
        openAt(photoButtons.indexOf(button), button);
      });
    }
    prev.addEventListener('click', () => move(-1));
    next.addEventListener('click', () => move(1));
    modal.querySelector('.lokanta-vehicle-modal-close').addEventListener('click', close);
    modal.querySelector('.lokanta-vehicle-modal-backdrop').addEventListener('click', close);
    document.addEventListener('keydown', event => {
      if (modal.hidden) return;
      if (event.key === 'Escape') close();
      if (event.key === 'ArrowLeft') move(-1);
      if (event.key === 'ArrowRight') move(1);
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