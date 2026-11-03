const heroFilm = document.querySelector('#hero-film');
const filmControl = document.querySelector('.film-control');
const filmLabel = document.querySelector('.film-control-label');
const filmMotionPreference = matchMedia('(prefers-reduced-motion: reduce)');
let filmUserPaused = false;
let filmVisible = true;
let filmAutoplayAllowed = !filmMotionPreference.matches && !navigator.connection?.saveData;

function loadFilm() {
  if (!heroFilm.getAttribute('src')) {
    heroFilm.src = innerWidth >= 900 ? heroFilm.dataset.uhd : heroFilm.dataset.mobile;
    heroFilm.muted = true;
    heroFilm.load();
  }
}
function updateFilmControl() {
  const playing = !heroFilm.paused;
  filmControl.setAttribute('aria-label', playing ? 'Pause background video' : 'Play background video');
  filmControl.setAttribute('aria-pressed', String(playing));
  filmControl.querySelector('span').textContent = playing ? 'Ⅱ' : '▶';
  filmLabel.textContent = playing ? 'PAUSE FILM' : 'PLAY FILM';
}
async function startFilm() {
  loadFilm();
  try { await heroFilm.play(); } catch { updateFilmControl(); }
}
function syncFilmPlayback() {
  if (!filmVisible || document.hidden || filmUserPaused || !filmAutoplayAllowed) heroFilm.pause();
  else startFilm();
}
filmControl.hidden = false;
filmControl.addEventListener('click', () => {
  if (heroFilm.paused) {
    filmUserPaused = false;
    filmAutoplayAllowed = true;
    startFilm();
  } else {
    filmUserPaused = true;
    heroFilm.pause();
  }
});
heroFilm.addEventListener('playing', () => {
  heroFilm.classList.add('film-ready');
  updateFilmControl();
});
heroFilm.addEventListener('pause', updateFilmControl);
heroFilm.addEventListener('error', () => {
  heroFilm.classList.remove('film-ready');
  filmControl.hidden = true;
});
filmMotionPreference.addEventListener('change', () => {
  filmAutoplayAllowed = !filmMotionPreference.matches && !navigator.connection?.saveData;
  if (!filmAutoplayAllowed) heroFilm.classList.remove('film-ready');
  syncFilmPlayback();
});
document.addEventListener('visibilitychange', syncFilmPlayback);
if ('IntersectionObserver' in window) {
  const filmObserver = new IntersectionObserver(entries => {
    filmVisible = entries[0].isIntersecting;
    syncFilmPlayback();
  }, { threshold: 0.05 });
  filmObserver.observe(document.querySelector('.hero'));
} else syncFilmPlayback();
