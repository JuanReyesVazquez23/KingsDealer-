export function initMobileNav(): void {
  const toggle = document.getElementById('menuToggle');
  const nav = document.getElementById('mobileNav');
  if (!toggle || !nav) return;
  toggle.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    toggle.classList.toggle('open', open);
  });
}

export function closeMobile(): void {
  document.getElementById('mobileNav')?.classList.remove('open');
  document.getElementById('menuToggle')?.classList.remove('open');
}

export function initSecretTrigger(): void {
  const trigger = document.getElementById('secretTrigger');
  if (!trigger) return;
  let clicks = 0;
  let timeout: ReturnType<typeof setTimeout>;
  trigger.addEventListener('click', () => {
    clicks++;
    trigger.classList.add('lit');
    clearTimeout(timeout);
    timeout = setTimeout(() => { clicks = 0; trigger.classList.remove('lit'); }, 3000);
    if (clicks >= 5) {
      clicks = 0;
      clearTimeout(timeout);
      trigger.classList.remove('lit');
      window.location.href = '/login';
    }
  });
}
