(() => {
  const modal = document.getElementById('yachtGalleryModal');
  if (modal) {
    const stage = document.getElementById('yachtGalleryStage');
    const counter = document.getElementById('yachtGalleryCounter');
    const caption = document.getElementById('yachtGalleryCaption');
    const prev = modal.querySelector('.yacht-lightbox-prev');
    const next = modal.querySelector('.yacht-lightbox-next');
    const closeButton = modal.querySelector('.yacht-lightbox-close');
    const galleries = Array.from(document.querySelectorAll('[data-yacht-gallery]'));
    let items = [];
    let index = 0;
    let lastTrigger = null;
    let media = null;
    const clearMedia = () => {
      if (media && media.tagName === 'VIDEO') {
        media.pause();
        media.removeAttribute('src');
        media.load();
      }
      if (media) media.remove();
      media = null;
    };
    const render = () => {
      clearMedia();
      const item = items[index];
      if (!item) return;
      if (item.type === 'image') {
        media = document.createElement('img');
        media.src = item.src;
        media.alt = item.alt || 'Private yacht photograph';
        media.className = 'yacht-lightbox-media';
      } else {
        media = document.createElement('video');
        media.src = item.src;
        media.controls = true;
        media.playsInline = true;
        media.preload = 'metadata';
        media.className = 'yacht-lightbox-media yacht-lightbox-video';
      }
      stage.appendChild(media);
      caption.textContent = item.type === 'video' ? item.caption : item.alt;
      counter.textContent = (index + 1) + ' / ' + items.length;
    };
    const openGallery = (gallery, itemIndex, trigger) => {
      const photos = Array.from(gallery.querySelectorAll('.lokanta-gallery-photo'));
      items = photos.map(button => {
        const img = button.querySelector('img');
        return {type:'image',src:img.getAttribute('src'),alt:img.alt};
      });
      const yachtName = gallery.getAttribute('data-yacht-gallery').replace('luxury-','Luxury ');
      items.push({type:'video',src:gallery.getAttribute('data-yacht-video'),caption:yachtName+' — Video'});
      lastTrigger = trigger;
      index = itemIndex;
      render();
      modal.hidden = false;
      document.body.style.overflow = 'hidden';
      closeButton.focus();
    };
    const close = () => {
      clearMedia();
      modal.hidden = true;
      document.body.style.overflow = '';
      if (lastTrigger) lastTrigger.focus();
    };
    const move = step => {
      if (!items.length) return;
      index = (index + step + items.length) % items.length;
      render();
    };
    galleries.forEach(gallery => gallery.addEventListener('click', event => {
      const button = event.target.closest('.lokanta-gallery-photo');
      if (!button || !gallery.contains(button)) return;
      const itemIndex = Array.from(gallery.querySelectorAll('.lokanta-gallery-photo')).indexOf(button);
      if (itemIndex >= 0) openGallery(gallery,itemIndex,button);
    }));
    prev.addEventListener('click', () => move(-1));
    next.addEventListener('click', () => move(1));
    closeButton.addEventListener('click', close);
    modal.querySelector('.yacht-lightbox-backdrop').addEventListener('click', close);
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

  form.addEventListener('submit', async (event) => {
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

    const preferredMethod = data.get('preferredMethod');
    const customerName = String(data.get('name') || '').trim();
    const customerEmail = String(data.get('email') || '').trim();
    const fields = {
      'Preferred date': data.get('date'),
      'Start time': data.get('time'),
      'Guests': data.get('guests'),
      'Duration': data.get('duration'),
      'Preferred yacht': data.get('yacht'),
      'Pickup point': data.get('pickup'),
      'Extras': extras.length ? extras.join(', ') : 'Not selected',
      'Occasion / special requests': data.get('occasion') || 'None provided',
      'Request status': 'Enquiry only — availability, final price and terms require confirmation'
    };
    const lines = [
      'PRIVATE YACHT CHARTER ENQUIRY — Concierge Service Türkiye',
      '',
      'Name: ' + customerName,
      'Email: ' + customerEmail,
      ...Object.entries(fields).map(([key, value]) => key + ': ' + value),
      '',
      'Please confirm availability, final price and booking terms. This is an enquiry, not a confirmed booking.'
    ];
    const whatsappUrl = 'https://wa.me/905344888624?text=' + encodeURIComponent(lines.join('\\n'));
    const whatsappWindow = preferredMethod === 'WhatsApp' ? window.open('about:blank', '_blank') : null;
    const submitButton = form.querySelector('[type="submit"]');
    const originalText = submitButton?.textContent || 'Submit Enquiry';
    if (submitButton) { submitButton.disabled = true; submitButton.textContent = 'Sending Request...'; }

    try {
      const response = await fetch('/api/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Idempotency-Key': crypto.randomUUID() },
        body: JSON.stringify({
          formType: 'Private yacht charter enquiry',
          subject: 'New Private Yacht Charter Enquiry — ' + customerName,
          customer: { name: customerName, email: customerEmail },
          preferredMethod,
          fields
        })
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok || result.success !== true) throw new Error(result.message || 'The request could not be submitted.');

      if (preferredMethod === 'WhatsApp') {
        if (whatsappWindow) { whatsappWindow.location.href = whatsappUrl; whatsappWindow.opener = null; }
        else window.location.href = whatsappUrl;
      }
      form.reset();
      if (submitButton) { submitButton.disabled = false; submitButton.textContent = originalText; }
      error.textContent = 'Your enquiry has been sent to our concierge team. We will contact you using your preferred method.';
      error.hidden = false;
      error.classList.add('is-success');
    } catch (err) {
      if (whatsappWindow && !whatsappWindow.closed) whatsappWindow.close();
      console.error('Yacht enquiry submission failed:', err);
      error.textContent = err.message || 'We could not submit your enquiry. Your details are still in the form; please try again.';
      error.hidden = false;
      if (submitButton) { submitButton.disabled = false; submitButton.textContent = originalText; }
    }
  });;
})();