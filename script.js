/* =========================================================
   SAHYADRI HOUSE — script.js
   1. Sticky nav + mobile menu
   2. Image carousel (hero)
   3. Live weather fetch (Open-Meteo API)
   4. "Find your room" interactive quiz
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {
  initNav();
  initCarousel();
  initWeather();
  initQuiz();
  initDateDefaults();
  initRipples();
  initBooking();
});

/* ---------------------------------------------------------
   0. RIPPLE EFFECT — adds a Material-style click pulse to
   every button on the page, sized to where the click landed.
--------------------------------------------------------- */
function initRipples(){
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('button');
    if (!btn) return;

    const rect = btn.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const ripple = document.createElement('span');

    ripple.className = 'ripple';
    ripple.style.width = ripple.style.height = `${size}px`;
    ripple.style.left = `${e.clientX - rect.left - size / 2}px`;
    ripple.style.top = `${e.clientY - rect.top - size / 2}px`;

    btn.appendChild(ripple);
    ripple.addEventListener('animationend', () => ripple.remove());
  });
}

/* ---------------------------------------------------------
   1. NAV
--------------------------------------------------------- */
function initNav(){
  const header = document.getElementById('siteHeader');
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');

  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 40);
  });

  hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('open');
  });

  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => navLinks.classList.remove('open'));
  });
}

/* ---------------------------------------------------------
   2. CAROUSEL
--------------------------------------------------------- */
function initCarousel(){
  const slides = document.querySelectorAll('.slide');
  const dotsWrap = document.getElementById('carouselDots');
  const prevBtn = document.getElementById('prevSlide');
  const nextBtn = document.getElementById('nextSlide');

  let current = 0;
  let timer;
  const AUTO_MS = 5500;

  // build dots dynamically based on slide count
  slides.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.className = 'dot' + (i === 0 ? ' active' : '');
    dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
    dot.addEventListener('click', () => goTo(i));
    dotsWrap.appendChild(dot);
  });
  const dots = dotsWrap.querySelectorAll('.dot');

  function render(){
    slides.forEach((s, i) => s.classList.toggle('active', i === current));
    dots.forEach((d, i) => d.classList.toggle('active', i === current));
  }

  function goTo(index){
    current = (index + slides.length) % slides.length;
    render();
    resetTimer();
  }

  function next(){ goTo(current + 1); }
  function prev(){ goTo(current - 1); }

  function resetTimer(){
    clearInterval(timer);
    timer = setInterval(next, AUTO_MS);
  }

  nextBtn.addEventListener('click', next);
  prevBtn.addEventListener('click', prev);

  // pause autoplay while hovering hero, resume on leave
  const hero = document.querySelector('.hero');
  hero.addEventListener('mouseenter', () => clearInterval(timer));
  hero.addEventListener('mouseleave', resetTimer);

  render();
  resetTimer();
}

/* ---------------------------------------------------------
   3. LIVE WEATHER — Open-Meteo API (no key required)
   Location: Lonavala, Maharashtra (18.7546 N, 73.4062 E)
--------------------------------------------------------- */
function initWeather(){
  const LAT = 18.7546;
  const LON = 73.4062;
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${LAT}&longitude=${LON}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code,apparent_temperature&timezone=auto`;

  const card = document.getElementById('weatherCard');

  fetch(url)
    .then(res => {
      if (!res.ok) throw new Error('Weather service unavailable');
      return res.json();
    })
    .then(data => renderWeather(data))
    .catch(err => renderWeatherError(err));
}

function weatherCodeToText(code){
  // Simplified WMO weather code mapping
  const map = {
    0: 'Clear sky', 1: 'Mostly clear', 2: 'Partly cloudy', 3: 'Overcast',
    45: 'Fog', 48: 'Depositing fog',
    51: 'Light drizzle', 53: 'Drizzle', 55: 'Dense drizzle',
    61: 'Light rain', 63: 'Rain', 65: 'Heavy rain',
    71: 'Light snow', 73: 'Snow', 75: 'Heavy snow',
    80: 'Rain showers', 81: 'Rain showers', 82: 'Violent showers',
    95: 'Thunderstorm', 96: 'Thunderstorm with hail'
  };
  return map[code] || 'Misty conditions';
}

function renderWeather(data){
  const card = document.getElementById('weatherCard');
  const c = data.current;
  const condition = weatherCodeToText(c.weather_code);
  const now = new Date();
  const timeStr = now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });

  card.innerHTML = `
    <div class="weather-grid">
      <div class="weather-main">
        <p class="place">Lonavala, India</p>
        <p class="temp">${Math.round(c.temperature_2m)}°C</p>
        <p class="cond">${condition}</p>
      </div>
      <div class="weather-stat">
        <span class="stat-label">Feels Like</span>
        <span class="stat-value">${Math.round(c.apparent_temperature)}°C</span>
      </div>
      <div class="weather-stat">
        <span class="stat-label">Humidity</span>
        <span class="stat-value">${Math.round(c.relative_humidity_2m)}%</span>
      </div>
      <div class="weather-stat">
        <span class="stat-label">Wind</span>
        <span class="stat-value">${Math.round(c.wind_speed_10m)} km/h</span>
      </div>
      <div class="weather-note">Updated ${timeStr} · data via Open-Meteo, refreshed on page load</div>
    </div>
  `;
}

function renderWeatherError(err){
  const card = document.getElementById('weatherCard');
  card.innerHTML = `
    <p class="weather-error">Couldn't reach the valley right now (${err.message}). Try refreshing the page.</p>
  `;
  console.error('Weather fetch failed:', err);
}

/* ---------------------------------------------------------
   4. QUIZ — "Find your room"
--------------------------------------------------------- */
const QUIZ_QUESTIONS = [
  {
    prompt: "What does your ideal morning look like?",
    options: [
      { label: "Coffee on my own private veranda", scores: { cottage: 2, deluxe: 1 } },
      { label: "Watching mist burn off the whole valley", scores: { deluxe: 2 } },
      { label: "Coffee brought up to me in a treehouse", scores: { machaan: 2 } },
      { label: "The sound of the stream through an open door", scores: { suite: 2 } }
    ]
  },
  {
    prompt: "Who's coming with you?",
    options: [
      { label: "Just me", scores: { machaan: 1, cottage: 1 } },
      { label: "My partner", scores: { deluxe: 2, suite: 1 } },
      { label: "Family, with kids", scores: { suite: 2 } },
      { label: "A close friend", scores: { cottage: 1, machaan: 1 } }
    ]
  },
  {
    prompt: "Pick a way to spend a rainy afternoon.",
    options: [
      { label: "Wood stove, book, blanket", scores: { cottage: 2 } },
      { label: "Watching lightning over the range", scores: { deluxe: 2 } },
      { label: "Reading in a private outdoor tub", scores: { suite: 2 } },
      { label: "Listening to rain hit the canopy above me", scores: { machaan: 2 } }
    ]
  },
  {
    prompt: "How do you feel about Wi-Fi?",
    options: [
      { label: "Turn it off, please", scores: { machaan: 2, cottage: 1 } },
      { label: "Fine either way", scores: { deluxe: 1, suite: 1 } },
      { label: "I need it for at least an hour a day", scores: { suite: 2, deluxe: 1 } },
      { label: "Only if it's not in the room itself", scores: { cottage: 1, machaan: 1 } }
    ]
  }
];

const QUIZ_RESULTS = {
  cottage: {
    title: "The Cottage",
    desc: "You want quiet, low to the ground, and entirely your own. The Cottage's private veranda and wood stove face the tea rows — book it for a slower kind of trip."
  },
  deluxe: {
    title: "Valley View Deluxe",
    desc: "You came for the view, not the villa. Floor-to-ceiling windows in the Deluxe put the entire Sahyadri range right at the foot of your bed."
  },
  suite: {
    title: "Riverside Suite",
    desc: "Space, a private deck, and room to bring people along. The Riverside Suite's outdoor tub sits right over the stream — loudest, and best, in monsoon."
  },
  machaan: {
    title: "The Machaan",
    desc: "You didn't come here to be reachable. Ten feet up in the canopy, with no Wi-Fi and a fair number of squirrels, The Machaan is for disappearing a little."
  }
};

function initQuiz(){
  let step = 0;
  const scores = { cottage: 0, deluxe: 0, suite: 0, machaan: 0 };

  const promptEl = document.getElementById('quizPrompt');
  const optionsEl = document.getElementById('quizOptions');
  const countEl = document.getElementById('quizCount');
  const progressBar = document.getElementById('quizProgressBar');
  const questionView = document.getElementById('quizQuestion');
  const resultView = document.getElementById('quizResult');
  const resultTitle = document.getElementById('resultTitle');
  const resultDesc = document.getElementById('resultDesc');
  const restartBtn = document.getElementById('quizRestart');
  const viewRoomBtn = document.getElementById('quizViewRoom');

  function renderQuestion(){
    const q = QUIZ_QUESTIONS[step];
    countEl.textContent = `Question ${step + 1} of ${QUIZ_QUESTIONS.length}`;
    progressBar.style.width = `${((step) / QUIZ_QUESTIONS.length) * 100 + 5}%`;
    promptEl.textContent = q.prompt;
    optionsEl.innerHTML = '';

    q.options.forEach(opt => {
      const btn = document.createElement('button');
      btn.className = 'quiz-option';
      btn.textContent = opt.label;
      btn.addEventListener('click', () => selectOption(opt, btn));
      optionsEl.appendChild(btn);
    });
  }

  function selectOption(opt, btn){
    // brief visual confirmation before advancing, so the click feels registered
    optionsEl.querySelectorAll('.quiz-option').forEach(b => b.disabled = true);
    btn.classList.add('selected');

    Object.entries(opt.scores).forEach(([key, val]) => {
      scores[key] = (scores[key] || 0) + val;
    });

    setTimeout(() => {
      step++;
      if (step < QUIZ_QUESTIONS.length){
        renderQuestion();
      } else {
        showResult();
      }
    }, 280);
  }

  function showResult(){
    progressBar.style.width = '100%';
    const winner = Object.entries(scores).sort((a, b) => b[1] - a[1])[0][0];
    const result = QUIZ_RESULTS[winner];

    resultTitle.textContent = result.title;
    resultDesc.textContent = result.desc;

    questionView.classList.add('hidden');
    resultView.classList.remove('hidden');
    viewRoomBtn.dataset.room = winner;
  }

  restartBtn.addEventListener('click', () => {
    step = 0;
    Object.keys(scores).forEach(k => scores[k] = 0);
    questionView.classList.remove('hidden');
    resultView.classList.add('hidden');
    renderQuestion();
  });

  viewRoomBtn.addEventListener('click', () => {
    document.getElementById('rooms').scrollIntoView({ behavior: 'smooth' });
  });

  renderQuestion();
}

/* ---------------------------------------------------------
   Helper: sensible default check-in / check-out dates
--------------------------------------------------------- */
function initDateDefaults(){
  const checkin = document.getElementById('checkin');
  const checkout = document.getElementById('checkout');
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  const dayAfter = new Date(today);
  dayAfter.setDate(today.getDate() + 2);

  const fmt = (d) => d.toISOString().split('T')[0];
  checkin.min = fmt(tomorrow);
  checkout.min = fmt(dayAfter);
  checkin.value = fmt(tomorrow);
  checkout.value = fmt(dayAfter);

  checkin.addEventListener('change', () => {
    const next = new Date(checkin.value);
    next.setDate(next.getDate() + 1);
    checkout.min = fmt(next);
    if (new Date(checkout.value) <= new Date(checkin.value)){
      checkout.value = fmt(next);
    }
  });
}

/* ---------------------------------------------------------
   5. BOOKING ACTIONS — makes the header, hero, and room-card
   buttons actually do something (no backend, so we confirm
   the action clearly instead of silently doing nothing).
--------------------------------------------------------- */
function initBooking(){
  const bookBtn = document.querySelector('.book-btn');
  const searchBtn = document.getElementById('searchBtn');
  const checkin = document.getElementById('checkin');
  const checkout = document.getElementById('checkout');
  const guests = document.getElementById('guests');

  // Header "Check Availability" -> jump to the search card and focus it
  bookBtn.addEventListener('click', () => {
    document.querySelector('.search-card').scrollIntoView({ behavior: 'smooth', block: 'center' });
    setTimeout(() => checkin.focus(), 400);
  });

  // Hero "Search Rooms" -> validate dates, then scroll to rooms with a summary
  searchBtn.addEventListener('click', () => {
    if (!checkin.value || !checkout.value){
      showToast('Pick your check-in and check-out dates first.', 'error');
      return;
    }
    if (new Date(checkout.value) <= new Date(checkin.value)){
      showToast('Check-out has to be after check-in.', 'error');
      return;
    }

    const inDate = formatDisplayDate(checkin.value);
    const outDate = formatDisplayDate(checkout.value);
    document.getElementById('rooms').scrollIntoView({ behavior: 'smooth' });
    showToast(`Showing rooms for ${inDate} → ${outDate}, ${guests.value}.`, 'success');
  });

  // Every "Reserve" button on a room card
  document.querySelectorAll('.room-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const card = btn.closest('.room-card');
      const roomName = card.querySelector('h3').textContent;
      const price = card.querySelector('.price').firstChild.textContent.trim();

      if (!checkin.value || !checkout.value){
        showToast('Choose your dates at the top before reserving.', 'error');
        document.querySelector('.search-card').scrollIntoView({ behavior: 'smooth', block: 'center' });
        return;
      }

      const inDate = formatDisplayDate(checkin.value);
      const outDate = formatDisplayDate(checkout.value);
      showToast(`${roomName} reserved (${price}/night) for ${inDate} → ${outDate}. We'll email you a confirmation.`, 'success');
    });
  });
}

function formatDisplayDate(isoDate){
  const d = new Date(isoDate);
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
}

/* ---------------------------------------------------------
   TOAST — small confirmation banner, since there's no backend
   to redirect to after a booking action.
--------------------------------------------------------- */
function showToast(message, type = 'success'){
  let wrap = document.getElementById('toastWrap');
  if (!wrap){
    wrap = document.createElement('div');
    wrap.id = 'toastWrap';
    wrap.className = 'toast-wrap';
    document.body.appendChild(wrap);
  }

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.textContent = message;
  wrap.appendChild(toast);

  requestAnimationFrame(() => toast.classList.add('show'));

  setTimeout(() => {
    toast.classList.remove('show');
    toast.addEventListener('transitionend', () => toast.remove(), { once: true });
  }, 4200);
}
