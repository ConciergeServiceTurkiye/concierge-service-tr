(() => {
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