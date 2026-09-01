document.addEventListener('DOMContentLoaded', function () {
  var form = document.getElementById('serviceForm');
  if (!form) return;

  var alertBox = document.getElementById('formInlineAlert');
  var service = document.getElementById('service');
  var vehicle = document.getElementById('vehicle');
  var passengers = document.getElementById('passengers');
  var startDate = document.getElementById('startDate');
  var endDate = document.getElementById('endDate');
  var startTime = document.getElementById('startTime');
  var endTime = document.getElementById('endTime');
  var phone = document.getElementById('phone');
  var email = document.getElementById('email');
  var flight = document.getElementById('flightNumber');
  var message = document.getElementById('message');
  var count = document.getElementById('charCount');
  var destinations = document.getElementById('destinations');
  var flightNote = document.getElementById('flightNote');

  var params = new URLSearchParams(window.location.search);
  var requestedService = params.get('service');
  if (requestedService && service) {
    Array.prototype.forEach.call(service.options, function (option) {
      if (option.text.toLowerCase() === requestedService.toLowerCase()) service.value = option.value;
    });
  }

  var iti = null;
  if (window.intlTelInput && phone) {
    iti = window.intlTelInput(phone, {
      initialCountry: 'us',
      separateDialCode: true,
      allowDropdown: true,
      autoPlaceholder: 'off',
      nationalMode: false,
      showSelectedDialCode: true,
      utilsScript: 'https://cdn.jsdelivr.net/npm/intl-tel-input@19.5.4/build/js/utils.js'
    });
  }

  function makeLuxurySelect(select) {
    if (!select || select.dataset.luxuryReady === '1') return null;
    var wrap = document.createElement('div');
    var trigger = document.createElement('button');
    var list = document.createElement('div');
    wrap.className = 'luxury-select';
    trigger.type = 'button';
    trigger.className = 'luxury-select-trigger';
    trigger.setAttribute('aria-expanded', 'false');
    list.className = 'luxury-select-menu';
    list.hidden = true;

    function refresh() {
      var option = select.options[select.selectedIndex];
      trigger.textContent = option ? option.textContent : '';
      trigger.classList.toggle('has-selection', !!select.value);
    }

    function rebuild() {
      list.innerHTML = '';
      Array.prototype.forEach.call(select.options, function (option) {
        var item = document.createElement('button');
        item.type = 'button';
        item.className = 'luxury-select-option';
        item.textContent = option.textContent;
        item.dataset.value = option.value;
        item.addEventListener('click', function (event) {
          event.stopPropagation();
          select.value = option.value;
          select.dispatchEvent(new Event('change', { bubbles: true }));
          close();
          refresh();
        });
        list.appendChild(item);
      });
    }

    function open() {
      document.querySelectorAll('.luxury-select-menu:not([hidden])').forEach(function (menu) {
        if (menu !== list) {
          menu.hidden = true;
          var other = menu.closest('.luxury-select');
          if (other) other.classList.remove('is-open');
        }
      });
      list.hidden = false;
      wrap.classList.add('is-open');
      trigger.setAttribute('aria-expanded', 'true');
    }

    function close() {
      list.hidden = true;
      wrap.classList.remove('is-open');
      trigger.setAttribute('aria-expanded', 'false');
    }

    rebuild();
    trigger.addEventListener('click', function (event) {
      event.stopPropagation();
      if (list.hidden) open(); else close();
    });
    wrap.appendChild(trigger);
    wrap.appendChild(list);
    select.parentNode.insertBefore(wrap, select);
    select.classList.add('luxury-native-select');
    select.dataset.luxuryReady = '1';
    select.setAttribute('tabindex', '-1');
    select.addEventListener('change', refresh);
    refresh();
    return { trigger: trigger, refresh: refresh, rebuild: rebuild, close: close };
  }

  var serviceLuxury = makeLuxurySelect(service);
  var vehicleLuxury = makeLuxurySelect(vehicle);
  var passengerLuxury = makeLuxurySelect(passengers);

  var capacities = {
    'Mercedes-Maybach S-Class': 3,
    'Mercedes-Benz S-Class': 3,
    'Mercedes-Benz V-Class VIP': 7,
    'Mercedes-Benz EQS Electric': 3,
    'Mercedes-Benz E-Class': 3,
    'Mercedes-Benz Vito V-Class VIP': 7,
    'Mercedes-Benz Vito V-Class Minivan': 8,
    'Mercedes-Benz Sprinter VIP': 16
  };

  function updatePassengerOptions() {
    if (!vehicle || !passengers) return;
    var selected = vehicle.options[vehicle.selectedIndex];
    var vehicleName = selected ? selected.textContent : '';
    var max = selected && selected.dataset.capacity ? Number(selected.dataset.capacity) : (capacities[vehicleName] || 0);
    var old = passengers.value;
    passengers.innerHTML = '';
    var placeholder = document.createElement('option');
    placeholder.value = '';
    placeholder.textContent = max ? 'Select number of passengers (1–' + max + ')' : 'Select vehicle first';
    passengers.appendChild(placeholder);
    for (var i = 1; i <= max; i++) {
      var option = document.createElement('option');
      option.value = String(i);
      option.textContent = String(i);
      passengers.appendChild(option);
    }
    if (old && Number(old) <= max) passengers.value = old;
    if (passengerLuxury) {
      passengerLuxury.rebuild();
      passengerLuxury.refresh();
    }
  }

  if (vehicle) vehicle.addEventListener('change', function () {
    updatePassengerOptions();
    if (vehicleLuxury) vehicleLuxury.refresh();
  });

  document.addEventListener('click', function () {
    document.querySelectorAll('.luxury-select-menu:not([hidden])').forEach(function (menu) {
      menu.hidden = true;
      var wrap = menu.closest('.luxury-select');
      if (wrap) wrap.classList.remove('is-open');
    });
  });

  function buildTimePicker(input) {
    if (!input) return null;
    var wrap = document.createElement('div');
    var grid = document.createElement('div');
    var hourBox = document.createElement('div');
    var minuteBox = document.createElement('div');
    var hourLabel = document.createElement('label');
    var minuteLabel = document.createElement('label');
    var hour = document.createElement('select');
    var minute = document.createElement('select');

    wrap.className = 'time-picker-inline';
    grid.className = 'time-picker-grid';
    hourBox.className = 'time-picker-part';
    minuteBox.className = 'time-picker-part';
    hourLabel.textContent = 'Hour';
    minuteLabel.textContent = 'Minute';
    hour.className = 'time-part-select';
    minute.className = 'time-part-select';
    hour.setAttribute('aria-label', 'Hour');
    minute.setAttribute('aria-label', 'Minute');

    for (var h = 0; h < 24; h++) {
      var ho = document.createElement('option');
      ho.value = String(h).padStart(2, '0');
      ho.textContent = ho.value;
      hour.appendChild(ho);
    }
    for (var m = 0; m < 60; m++) {
      var mo = document.createElement('option');
      mo.value = String(m).padStart(2, '0');
      mo.textContent = mo.value;
      minute.appendChild(mo);
    }

    hourBox.appendChild(hourLabel);
    hourBox.appendChild(hour);
    minuteBox.appendChild(minuteLabel);
    minuteBox.appendChild(minute);
    grid.appendChild(hourBox);
    grid.appendChild(minuteBox);
    wrap.appendChild(grid);
    input.parentNode.insertBefore(wrap, input);
    input.classList.add('luxury-native-select');
    input.setAttribute('tabindex', '-1');
    input.setAttribute('aria-hidden', 'true');

    function syncFromInput() {
      var match = /^(\d{2}):(\d{2})$/.exec(input.value || '');
      hour.value = match ? match[1] : '00';
      minute.value = match ? match[2] : '00';
    }
    function syncToInput() {
      input.value = hour.value + ':' + minute.value;
      input.dispatchEvent(new Event('change', { bubbles: true }));
    }
    hour.addEventListener('change', syncToInput);
    minute.addEventListener('change', syncToInput);
    syncFromInput();
    return { refresh: syncFromInput };
  }

  var startTimeUI = buildTimePicker(startTime);
  var endTimeUI = buildTimePicker(endTime);

  var startDatePicker = null;
  var endDatePicker = null;
  if (window.flatpickr) {
    startDatePicker = flatpickr(startDate, {
      dateFormat: 'd/m/Y',
      allowInput: true,
      disableMobile: true,
      minDate: 'today',
      locale: { firstDayOfWeek: 1 },
      positionElement: startDate
    });
    endDatePicker = flatpickr(endDate, {
      dateFormat: 'd/m/Y',
      allowInput: true,
      disableMobile: true,
      minDate: 'today',
      locale: { firstDayOfWeek: 1 },
      positionElement: endDate
    });
    var startCalendar = document.getElementById('startDateCalendarButton');
    var endCalendar = document.getElementById('endDateCalendarButton');
    if (startCalendar) startCalendar.addEventListener('click', function () { startDatePicker.open(); });
    if (endCalendar) endCalendar.addEventListener('click', function () { endDatePicker.open(); });
  }

  var destinationRows = [];
  function updateFlightRequirement() {
    var first = destinationRows[0];
    var input = first ? first.querySelector('input') : null;
    var value = input ? input.value.toLowerCase().trim() : '';
    var airport = /airport|havalimani|havalimanı|istanbul airport|i̇stanbul airport|sabiha gökçen|sabiha gokcen|\bist\b|\bsaw\b/.test(value);
    flight.required = airport;
    flightNote.classList.toggle('show', airport);
    flight.placeholder = airport ? 'Required for airport pickup' : 'Optional';
  }

  function renumberDestinations() {
    destinationRows.forEach(function (row, index) {
      var number = row.querySelector('.stop-no');
      var label = row.querySelector('label');
      var input = row.querySelector('input');
      if (number) number.textContent = String(index + 1);
      if (label) label.textContent = index === 0 ? 'Pickup' : 'Destination';
      if (input) input.name = 'destination_' + String(index + 1);
      if (index === 0) {
        row.classList.add('pickup-row');
        var remove = row.querySelector('.remove-stop');
        if (remove) remove.remove();
      } else {
        row.classList.remove('pickup-row');
      }
    });
    updateFlightRequirement();
  }

  function addDestination(value) {
    var index = destinationRows.length + 1;
    var row = document.createElement('div');
    row.className = 'destination-row' + (index === 1 ? ' pickup-row' : '');
    row.innerHTML = '<div class="stop-no">' + index + '</div>' +
      '<div class="form-group"><label>' + (index === 1 ? 'Pickup' : 'Destination') + '</label>' +
      '<input type="text" name="destination_' + index + '" placeholder="' + (index === 1 ? 'Airport / Hotel / Address' : 'Add a destination') + '" required></div>' +
      (index === 1 ? '' : '<button type="button" class="remove-stop" aria-label="Remove destination">×</button>');
    destinations.appendChild(row);
    destinationRows.push(row);
    var input = row.querySelector('input');
    if (input && value) input.value = value;
    if (index > 1) {
      row.querySelector('.remove-stop').addEventListener('click', function () {
        row.remove();
        destinationRows = destinationRows.filter(function (item) { return item !== row; });
        renumberDestinations();
      });
    }
    if (input) input.addEventListener('input', updateFlightRequirement);
    renumberDestinations();
  }

  addDestination('');
  var addDestinationButton = document.getElementById('addDestination');
  if (addDestinationButton) addDestinationButton.addEventListener('click', function () { addDestination(''); });

  if (message && count) {
    message.addEventListener('input', function () { count.textContent = message.value.length + ' / 2000'; });
  }

  function showValidation(text, fields) {
    fields.forEach(function (field) { if (field) field.classList.add('field-error'); });
    alertBox.textContent = text;
    alertBox.style.visibility = 'visible';
    alertBox.style.opacity = '1';
    setTimeout(function () { alertBox.style.opacity = '0'; alertBox.style.visibility = 'hidden'; }, 3500);
  }

  form.addEventListener('submit', function (event) {
    event.preventDefault();
    var errors = [];
    if (!service.value) errors.push(serviceLuxury ? serviceLuxury.trigger : service);
    if (!vehicle.value) errors.push(vehicleLuxury ? vehicleLuxury.trigger : vehicle);
    if (!passengers.value) errors.push(passengerLuxury ? passengerLuxury.trigger : passengers);
    if (!startDate.value) errors.push(startDate);
    if (!endDate.value) errors.push(endDate);
    if (!startTime.value) errors.push(startTime);
    if (!endTime.value) errors.push(endTime);

    if (startDatePicker && endDatePicker) {
      var sd = startDatePicker.selectedDates[0];
      var ed = endDatePicker.selectedDates[0];
      if (sd && ed && ed < sd) errors.push(endDate);
      if (sd && ed && sd.getTime() === ed.getTime() && startTime.value && endTime.value && endTime.value <= startTime.value) errors.push(endTime);
    }

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.value.trim())) errors.push(email);
    if (iti && !iti.isValidNumber()) errors.push(phone);
    if (flight.required && !flight.value.trim()) errors.push(flight);
    destinationRows.forEach(function (row) {
      var input = row.querySelector('input');
      if (input && !input.value.trim()) errors.push(input);
    });

    if (errors.length) {
      showValidation('Please complete the highlighted fields so we can submit your request.', errors);
      return;
    }

    alertBox.textContent = 'Your private chauffeur request is ready to be connected to the reservation system.';
    alertBox.style.visibility = 'visible';
    alertBox.style.opacity = '1';
  });

  updatePassengerOptions();
  if (serviceLuxury) serviceLuxury.refresh();
  if (vehicleLuxury) vehicleLuxury.refresh();
  if (passengerLuxury) passengerLuxury.refresh();
  updateFlightRequirement();
});