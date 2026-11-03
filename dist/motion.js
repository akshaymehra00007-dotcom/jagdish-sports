// Motion stays decorative: all content is available without JavaScript or animation.
const motionPreference = matchMedia('(prefers-reduced-motion: reduce)');
const finePointer = matchMedia('(hover: hover) and (pointer: fine)');
const motionRoot = document.documentElement;
const heroScene = document.querySelector('.hero');
let revealObserver;
let sceneFrame = 0;

function refreshMotionPreference() {
  const enabled = !motionPreference.matches;
  motionRoot.classList.toggle('motion-enabled', enabled);
  motionRoot.classList.toggle('motion-ready', enabled && 'IntersectionObserver' in window);
  revealObserver?.disconnect();
  if (enabled && 'IntersectionObserver' in window) {
    revealObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -16px 0px' });
    document.querySelectorAll('.reveal:not(.visible)').forEach(el => revealObserver.observe(el));
  }
  if (!enabled) {
    heroScene.style.removeProperty('--hero-shift');
    document.querySelectorAll('.button,.nav-cta,.pillar').forEach(el => {
      ['--mx', '--my', '--tilt-x', '--tilt-y'].forEach(property => el.style.removeProperty(property));
    });
  }
  updateScene();
}

document.querySelectorAll('.pillars,.gallery').forEach(group => {
  [...group.children].forEach((el, index) => el.style.setProperty('--reveal-delay', `${index * 100}ms`));
});
document.querySelectorAll('.enquiry-form .field').forEach((el, index) => {
  el.style.setProperty('--field-delay', `${120 + index * 70}ms`);
});

function updateScene() {
  sceneFrame = 0;
  if (motionPreference.matches) return;
  const rect = heroScene.getBoundingClientRect();
  if (rect.bottom > 0 && rect.top < innerHeight) {
    const distance = Math.min(Math.max(-rect.top, 0), rect.height);
    heroScene.style.setProperty('--hero-shift', `${Math.round(distance * (finePointer.matches ? 0.17 : 0.07))}px`);
  }
}
addEventListener('scroll', () => {
  if (!motionPreference.matches && !sceneFrame) sceneFrame = requestAnimationFrame(updateScene);
}, { passive: true });

document.querySelectorAll('.button,.nav-cta').forEach(button => {
  button.addEventListener('pointermove', event => {
    if (motionPreference.matches || !finePointer.matches) return;
    const rect = button.getBoundingClientRect();
    button.style.setProperty('--mx', `${((event.clientX - rect.left) / rect.width - 0.5) * 8}px`);
    button.style.setProperty('--my', `${((event.clientY - rect.top) / rect.height - 0.5) * 6}px`);
  });
  button.addEventListener('pointerleave', () => {
    button.style.setProperty('--mx', '0px');
    button.style.setProperty('--my', '0px');
  });
});

document.querySelectorAll('.pillar').forEach(card => {
  card.addEventListener('pointermove', event => {
    if (motionPreference.matches || !finePointer.matches) return;
    const rect = card.getBoundingClientRect();
    card.style.setProperty('--tilt-x', `${((event.clientY - rect.top) / rect.height - 0.5) * -3}deg`);
    card.style.setProperty('--tilt-y', `${((event.clientX - rect.left) / rect.width - 0.5) * 3}deg`);
  });
  card.addEventListener('pointerleave', () => {
    card.style.setProperty('--tilt-x', '0deg');
    card.style.setProperty('--tilt-y', '0deg');
  });
});

motionPreference.addEventListener('change', refreshMotionPreference);
refreshMotionPreference();
