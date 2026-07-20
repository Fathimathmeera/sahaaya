const $ = (selector) => document.querySelector(selector);
const savedName = localStorage.getItem('sahayaName');
if (!savedName) window.location.replace('login.html');
if (savedName) $('#userGreeting').textContent = `Hello ${savedName}`;
const toast = (message) => { const t = $('#toast'); t.textContent = message; t.classList.add('show'); clearTimeout(window.toastTimeout); window.toastTimeout = setTimeout(() => t.classList.remove('show'), 3000); };
const openModal = (id) => { const modal = $(id); modal.classList.add('open'); modal.setAttribute('aria-hidden', 'false'); modal.querySelector('button:not(.close), input, select')?.focus(); };
const closeModal = (modal) => { modal.classList.remove('open'); modal.setAttribute('aria-hidden', 'true'); };
$('#logoutButton')?.addEventListener('click', () => openModal('#exitModal'));
const featureIds = ['home', 'routes', 'places', 'indoor', 'updates', 'sos', 'preferences'];
const showFeature = (requestedId) => {
  const activeId = featureIds.includes(requestedId) ? requestedId : 'home';
  featureIds.forEach((id) => { const panel = document.getElementById(id); if (panel) panel.hidden = id !== activeId; });
  document.querySelectorAll('[data-home-panel]').forEach((panel) => { panel.hidden = activeId !== 'home'; });
  document.querySelectorAll('.side-nav a').forEach((link) => {
    const selected = link.getAttribute('href') === `#${activeId}`;
    link.classList.toggle('active', selected);
    link.setAttribute('aria-current', selected ? 'page' : 'false');
  });
  window.scrollTo({ top: 0, behavior: 'smooth' });
};
document.querySelectorAll('.side-nav a, .quick-card, footer a[href="#home"]').forEach((link) => link.addEventListener('click', (event) => {
  const targetId = link.getAttribute('href')?.replace('#', '');
  if (!featureIds.includes(targetId)) return;
  event.preventDefault();
  history.replaceState(null, '', `#${targetId}`);
  showFeature(targetId);
}));
showFeature(location.hash.replace('#', ''));

$('#routeForm').addEventListener('submit', (event) => { event.preventDefault(); const destination = $('#to').value.trim() || 'your destination'; $('#routeResult').textContent = `AI found the safest route to ${destination}: accessibility score 9.6/10, 6 ramps, 2 working elevators, and an 18-minute wheelchair travel time.`; });
$('#startNavigation').addEventListener('click', () => openModal('#navigationModal'));
$('#completeNavigation').addEventListener('click', () => { $('#completeNavigation').hidden = true; $('#rateRoute').hidden = false; });
document.querySelectorAll('[data-rating]').forEach((button) => button.addEventListener('click', () => { toast(`Thank you for rating this route ${button.dataset.rating} out of 5.`); closeModal($('#navigationModal')); }));
document.querySelectorAll('.filter').forEach((button) => button.addEventListener('click', () => { document.querySelectorAll('.filter').forEach((b) => b.classList.remove('active')); button.classList.add('active'); document.querySelectorAll('.place-card').forEach((card) => card.classList.toggle('hidden', button.dataset.filter !== 'all' && card.dataset.type !== button.dataset.filter)); }));
['#assistantButton', '#assistantFab', '#voiceButton', '#voiceButtonTwo'].forEach((id) => $(id)?.addEventListener('click', () => openModal('#assistantModal')));
$('#reportButton').addEventListener('click', () => openModal('#reportModal'));
$('#scanEntrance')?.addEventListener('click', () => openModal('#scannerModal'));
document.querySelectorAll('[data-close]').forEach((button) => button.addEventListener('click', () => closeModal(button.closest('.modal'))));
document.querySelectorAll('.modal').forEach((modal) => modal.addEventListener('click', (event) => { if (event.target === modal) closeModal(modal); }));
document.addEventListener('keydown', (event) => { if (event.key === 'Escape') document.querySelectorAll('.modal.open').forEach(closeModal); });
$('#sendReport').addEventListener('click', () => { $('#reportStatus').textContent = 'Thank you — your mobility update is now helping local wheelchair users.'; toast('Mobility update shared successfully.'); });
$('#entranceImage').addEventListener('change', (event) => { if (event.target.files.length) { $('#scannerUpload strong').textContent = 'Entrance image ready for analysis'; $('#analysis').style.display = 'block'; toast('AI entrance analysis complete.'); } });
$('#addContact')?.addEventListener('click', () => { const name = window.prompt('Enter the emergency contact name:'); if (!name?.trim()) return; const relation = window.prompt('Relationship or role:', 'Emergency contact') || 'Emergency contact'; const initials = name.trim().split(/\s+/).map((part) => part[0]).slice(0, 2).join('').toUpperCase(); const contact = document.createElement('article'); contact.innerHTML = `<b>${initials}</b><span><strong>${name.trim()}</strong><small>${relation}</small></span>`; $('#emergencyContacts').insertBefore(contact, $('#addContact')); toast(`${name.trim()} was added as an emergency contact.`); });
document.querySelectorAll('.verify').forEach((button) => button.addEventListener('click', () => { button.innerHTML = '✓ You verified this <b>+1</b>'; toast('Thanks for verifying this mobility update.'); }));

const finishAccount = () => { closeModal($('#welcomeModal')); closeModal($('#singleLoginModal')); closeModal($('#singleSignupModal')); showFeature('home'); toast('Welcome to Sahaya.'); };
if (savedName) { closeModal($('#welcomeModal')); $('#splashScreen')?.classList.add('hidden'); }
$('#startSahaya')?.addEventListener('click', () => { $('#splashScreen').classList.add('hidden'); if (localStorage.getItem('sahayaName')) { closeModal($('#welcomeModal')); showFeature('home'); } else { closeModal($('#welcomeModal')); openModal('#singleLoginModal'); } });
$('#openLogin').addEventListener('click', () => openModal('#singleLoginModal'));
$('#openSignup').addEventListener('click', () => openModal('#singleSignupModal'));
$('#singleLoginForm').addEventListener('submit', (event) => { event.preventDefault(); const email = $('#singleLoginEmail').value.trim(); const rawName = email.split('@')[0].split(/[._-]/)[0]; const name = rawName.charAt(0).toUpperCase() + rawName.slice(1); localStorage.setItem('sahayaName', name); localStorage.setItem('sahayaEmail', email); $('#userGreeting').textContent = `Hello ${name}`; finishAccount(); });
$('#singleSignupForm').addEventListener('submit', (event) => { event.preventDefault(); const name = $('#singleSignupName').value.trim(); localStorage.setItem('sahayaName', name); localStorage.setItem('sahayaEmail', $('#singleSignupEmail').value.trim()); localStorage.setItem('sahayaMobility', $('#singleSignupMobility').value); localStorage.setItem('sahayaEmergencyContact', $('#singleSignupContact').value.trim()); $('#userGreeting').textContent = `Hello ${name}`; finishAccount(); });

$('#mapSearchButton')?.addEventListener('click', () => { const term = $('#mapSearch').value.trim(); if (term) { $('#selectedPlace').textContent = term; toast(`Showing wheelchair-accessible results for ${term}.`); } else { toast('Enter a place, service, or landmark to search.'); } });
$('#locateButton')?.addEventListener('click', () => toast('Location found. Showing accessible places near you.'));
document.querySelectorAll('.map-filter').forEach((button) => button.addEventListener('click', () => { document.querySelectorAll('.map-filter').forEach((item) => item.classList.remove('active')); button.classList.add('active'); const filter = button.dataset.mapFilter; document.querySelectorAll('.place-pin').forEach((pin) => { pin.hidden = filter !== 'all' && !pin.classList.contains(filter); }); }));
document.querySelectorAll('.place-pin').forEach((pin) => pin.addEventListener('click', () => { $('#selectedPlace').textContent = pin.dataset.pin; toast(`${pin.dataset.pin} selected on the map.`); }));
document.querySelector('[data-open-route]')?.addEventListener('click', () => { showFeature('routes'); history.replaceState(null, '', '#routes'); });

const indoorBuildings = {
  hospital: { title: 'City Care Hospital', rooms: ['Reception', 'Pharmacy', 'Outpatient'] },
  mall: { title: 'Orchard Square Mall', rooms: ['Information desk', 'Food court', 'Cinema'] },
  station: { title: 'Central Railway Station', rooms: ['Ticket hall', 'Platform lift', 'Waiting area'] },
  office: { title: 'Municipal Service Office', rooms: ['Reception', 'Permit desk', 'Public services'] }
};
const updateIndoorMap = () => { const building = indoorBuildings[$('#buildingSelect').value]; const floor = $('#floorSelect').value; $('#indoorMapTitle').childNodes[0].nodeValue = `${building.title.toUpperCase()} `; $('#indoorMapFloor').textContent = floor.toUpperCase(); $('#roomOne').textContent = building.rooms[0]; $('#roomTwo').textContent = building.rooms[1]; $('#roomThree').textContent = building.rooms[2]; };
$('#buildingSelect')?.addEventListener('change', updateIndoorMap);
$('#floorSelect')?.addEventListener('change', updateIndoorMap);
$('#showIndoorRoute')?.addEventListener('click', () => { const building = indoorBuildings[$('#buildingSelect').value].title; const floor = $('#floorSelect').value; const destination = $('#indoorDestination').value; $('#indoorRoute').classList.add('active-route'); $('#indoorStatus').textContent = `${building}, ${floor}: step-free route to the ${destination.toLowerCase()} is highlighted. It uses the accessible entrance and avoids stairs.`; toast('Wheelchair-friendly indoor route ready.'); });

window.addEventListener('hashchange', () => showFeature(location.hash.replace('#', '')));
let sosTimer;
let sosSeconds = 10;
const resetSos = (message = '') => { clearInterval(sosTimer); sosSeconds = 10; $('#sosProgress').hidden = true; $('#sosButton').disabled = false; $('#sosButton').innerHTML = '<span>!</span> Send SOS'; if (message) $('#sosStatus').textContent = message; };
const sendEmergencyAlert = (lat, lon) => { clearInterval(sosTimer); $('#sosProgress').hidden = true; $('#sosButton').disabled = false; $('#sosButton').innerHTML = '<span>&#10003;</span> SOS Sent'; $('#sosStatus').textContent = 'SOS alert sent successfully to your saved emergency contacts with your live location.'; toast('Emergency SOS sent. Your contacts have been notified.'); };
const beginSosCountdown = (lat, lon) => { sosSeconds = 10; $('#sosProgress').hidden = false; $('#sosButton').disabled = true; $('#sosCountdown').textContent = `Your alert will be sent in ${sosSeconds} seconds.`; sosTimer = setInterval(() => { sosSeconds -= 1; $('#sosCountdown').textContent = `Your alert will be sent in ${sosSeconds} seconds.`; if (sosSeconds <= 0) sendEmergencyAlert(lat, lon); }, 1000); };
$('#sosButton')?.addEventListener('click', () => { $('#sosStatus').textContent = 'Requesting your GPS location…'; if (!navigator.geolocation) { $('#sosStatus').textContent = 'GPS location is not available in this browser.'; return; } navigator.geolocation.getCurrentPosition((position) => { const lat = position.coords.latitude.toFixed(6); const lon = position.coords.longitude.toFixed(6); $('#coordinates').textContent = `Live coordinates: ${lat}, ${lon}`; $('#locationEmpty').textContent = 'Live location acquired'; $('#sosMap').classList.add('location-ready'); $('#sosMap').style.setProperty('--lat', `${lat}`); $('#sosMap').style.setProperty('--lon', `${lon}`); $('#sosStatus').textContent = 'Live location attached. You can cancel the alert for the next 10 seconds.'; beginSosCountdown(lat, lon); }, () => { $('#sosStatus').textContent = 'Location permission was not granted. Please enable GPS access and try again.'; }); });
$('#cancelSos')?.addEventListener('click', () => resetSos('SOS cancelled. Your alert was not sent.'));

$('#cancelExit')?.addEventListener('click', () => closeModal($('#exitModal')));
$('#confirmExit')?.addEventListener('click', () => { localStorage.removeItem('sahayaName'); localStorage.removeItem('sahayaEmail'); localStorage.removeItem('sahayaMobility'); localStorage.removeItem('sahayaEmergencyContact'); closeModal($('#exitModal')); $('#splashScreen').classList.remove('hidden'); $('#userGreeting').textContent = 'Hello Username'; showFeature('home'); });
