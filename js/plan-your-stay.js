(() => {
  const form = document.getElementById('stayPlanner');
  const results = document.getElementById('stayResults');
  const recommendationBox = document.getElementById('stayRecommendations');
  const whatsapp = document.getElementById('stayWhatsApp');
  const edit = document.getElementById('editStay');
  if (!form || !results || !recommendationBox || !whatsapp) return;

  const get = name => form.querySelector('[name="' + name + '"]:checked')?.value || '';
  const checked = name => [...form.querySelectorAll('[name="' + name + '"]:checked')].map(el => el.value);
  const field = name => form.elements[name]?.value?.trim() || '';
  const recommendations = [];

  const add = (key, label, title, body, href, linkText) => {
    if (!recommendations.some(item => item.key === key)) recommendations.push({key,label,title,body,href,linkText});
  };

  form.addEventListener('submit', event => {
    event.preventDefault();
    recommendations.length = 0;
    const interests = checked('interests');
    const duration = get('duration');
    const travellers = get('travellers');
    const pace = get('pace');
    const needs = {
      hotel:get('hotel'), transfer:get('transfer'), tour:get('tour'), internet:get('internet'),
      dining:get('dining'), hammam:get('hammam'), bosphorus:get('bosphorus'), chauffeur:get('chauffeur')
    };

    if (needs.hotel === 'Need help' || needs.hotel === 'Not sure') {
      add('hotel','A comfortable base','Choose the right area to stay','Your hotel location can shape every day. We can discuss neighbourhoods based on the atmosphere you want, the places you plan to visit and your travel style.','hotel-reservations.html','Explore hotel assistance');
    }
    if (needs.transfer === 'Interested' || needs.transfer === 'Not sure') {
      add('transfer','A smoother arrival','Arrange your airport transfer','After a flight, knowing your ride is arranged can make the first step in the city easier — especially with luggage, children or a late arrival.','airport-transfer.html','Explore airport transfers');
    }
    if (needs.tour === 'Interested' || needs.tour === 'Not sure' || interests.some(x => /History|Culture|Surprise|Relaxation/.test(x))) {
      add('tour','Make your time count','Consider a private guide or tour','A local guide can help connect the landmarks, neighbourhoods and stories that interest you. It can be especially useful when your time is limited or you want a day shaped around your pace.','guidetours.html','Explore private tours');
    }
    if (needs.internet === 'Interested' || needs.internet === 'Not sure') {
      add('internet','Stay connected','Plan your internet before you arrive','Maps, transport apps, messages and bookings are easier when you can get online. Portable Wi-Fi or an eSIM may be useful depending on your devices, trip length and whether you need to connect more than one device.','portable-wifi.html','Compare connectivity options');
    }
    if (needs.dining === 'Interested' || needs.dining === 'Not sure' || interests.some(x => /Food/.test(x))) {
      add('dining','Taste the city','Find places worth making time for','From Turkish breakfast and street food to a special dinner, we can help you explore options that match your interests and occasion.','restaurants.html','Explore restaurant assistance');
    }
    if (needs.hammam === 'Interested' || needs.hammam === 'Not sure' || interests.some(x => /hammam|Relaxation|Culture/.test(x))) {
      add('hammam','A distinctly Istanbul experience','Discover a traditional Turkish hammam','A hammam can be more than a spa visit — it is a way to experience an important part of local culture. We can help you explore available experiences and what to expect.','turkish-baths.html','Explore Turkish baths');
    }
    if (needs.bosphorus === 'Interested' || needs.bosphorus === 'Not sure' || interests.some(x => /Bosphorus/.test(x))) {
      add('bosphorus','See Istanbul from the water','Add a Bosphorus experience','A cruise offers a different perspective on the city. Depending on your preferences, you can explore shared cruises or ask us about private yacht options.','istanbul-yacht-bosphorus-guide.html','Explore Bosphorus options');
    }
    if (needs.chauffeur === 'Interested' || needs.chauffeur === 'Not sure' || interests.some(x => /Shopping|Family|Nature/.test(x))) {
      add('chauffeur','Move at your own pace','Consider a private chauffeur','A driver can make multi-stop days, shopping trips and journeys with children more comfortable. It may be worth considering for selected days rather than your whole stay.','chauffeur-service.html','Explore chauffeur service');
    }
    if (interests.some(x => /History|iconic/.test(x))) add('history','Start with the essentials','Build a day around Istanbul’s history','The historic peninsula is rich in major sights. With limited time, grouping nearby places helps avoid spending your day crossing the city.','istanbul-first-time-guide.html','Read the first-time guide');
    if (interests.some(x => /Food|local flavours/.test(x))) add('food','Follow your appetite','Discover Istanbul one bite at a time','A food-focused route can mix markets, local favourites and a sit-down meal. Decide whether you want a self-guided day or help from a local guide.','guide-food-restaurants.html','Explore food and restaurants');
    if (interests.some(x => /Shopping/.test(x))) add('shopping','Shop with a plan','Explore bazaars and neighbourhood finds','Traditional bazaars, independent shops and modern shopping areas each offer a different experience. A little planning helps you use your time well.','guide-shopping.html','Explore shopping in Istanbul');
    if (interests.some(x => /Family/.test(x)) || travellers === 'Family with children') add('family','Make room for everyone','Balance sightseeing with family-friendly stops','A family itinerary works best with realistic travel times, breaks and activities suited to the children’s ages. Tell us their ages when you contact us.','istanbul-family-kids-guide.html','Explore family ideas');
    if (interests.some(x => /Nature|outdoor/.test(x))) add('outdoors','Take a breather from the centre','Add an outdoor or waterfront day','Parks, waterfront walks and the Princes’ Islands can offer a change of pace. The best choice depends on the season and how far you want to travel.','guide-parks-outdoors.html','Explore outdoor ideas');
    if (interests.some(x => /Nightlife/.test(x))) add('evening','Give your evenings a plan','Explore rooftops and after-dark Istanbul','A rooftop, live music or a neighbourhood dinner can become a highlight of your stay. If a venue matters to you, ask about reservations ahead of time.','guide-nightlife.html','Explore nightlife');
    if (interests.some(x => /Surprise/.test(x)) || interests.length === 0) {
      add('starter','Not sure where to begin?','Start with a balanced Istanbul mix','For a first visit, consider a little history, a neighbourhood walk, a food stop and time by the Bosphorus. We can adapt the mix to your interests and energy.','things-to-do-in-istanbul.html','Browse things to do');
    }
    if (!recommendations.length) {
      add('starter','A helpful starting point','Build a balanced first itinerary','Start with the areas you most want to see, then group nearby sights and leave room for meals and breaks. We can help refine the outline.','istanbul-guide.html','Explore the Istanbul guide');
    }

    const paceText = pace === 'Relaxed' ? 'a relaxed pace with time to wander' : pace === 'See as much as possible' ? 'an efficient itinerary with plenty to see' : 'a balanced mix of highlights and free time';
    const intro = document.querySelector('.pys-results-intro');
    intro.textContent = 'For ' + (duration || 'your stay') + ', travelling ' + (travellers === 'Solo' ? 'solo' : travellers.toLowerCase()) + ', we would start with ' + paceText + '. Here are some options based on your answers — choose only what feels right.';
    recommendationBox.innerHTML = recommendations.map(item => '<article class="pys-recommendation"><div class="pys-rec-label">' + item.label + '</div><h3>' + item.title + '</h3><p>' + item.body + '</p><a href="' + item.href + '">' + item.linkText + ' ↗</a></article>').join('');

    const lines = [
      'Hello Concierge Service Türkiye, I would like help planning my Istanbul stay.',
      'Duration: ' + (duration || 'Not decided'),
      'Arrival: ' + (field('arrival') || 'Not decided'),
      'Departure: ' + (field('departure') || 'Not decided'),
      'Travelling with: ' + (travellers || 'Not specified'),
      'Interests: ' + (interests.join(', ') || 'Please suggest ideas'),
      'Preferred pace: ' + (pace || 'Not specified'),
      'Accommodation: ' + (needs.hotel || 'Not decided'),
      'Airport transfer: ' + (needs.transfer || 'Not decided'),
      'Private guide/tour: ' + (needs.tour || 'Not decided'),
      'Internet: ' + (needs.internet || 'Not decided'),
      'Restaurant assistance: ' + (needs.dining || 'Not decided'),
      'Turkish hammam: ' + (needs.hammam || 'Not decided'),
      'Bosphorus/yacht: ' + (needs.bosphorus || 'Not decided'),
      'Private chauffeur: ' + (needs.chauffeur || 'Not decided'),
      'Additional notes: ' + (field('notes') || 'None yet'),
      '',
      'Please help me explore suitable options and next steps.'
    ];
    whatsapp.href = 'https://wa.me/905344888624?text=' + encodeURIComponent(lines.join('\n'));
    results.hidden = false;
    results.scrollIntoView({behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'start'});
  });

  if (edit) edit.addEventListener('click', () => {
    results.hidden = true;
    document.getElementById('stay-builder').scrollIntoView({behavior:'smooth',block:'start'});
  });

  const arrival = form.elements.arrival;
  const departure = form.elements.departure;
  if (arrival && departure) {
    arrival.addEventListener('change', () => { if (arrival.value) departure.min = arrival.value; });
    departure.addEventListener('change', () => { if (departure.value) arrival.max = departure.value; });
  }
})();