import { fetchCount } from './api';

function animateCount(el: HTMLElement | null, target: number): void {
  if (!el || !target) return;
  let current = 0;
  const step = Math.max(1, Math.ceil(target / 20));
  const timer = setInterval(() => {
    current = Math.min(current + step, target);
    el.textContent = String(current);
    if (current >= target) clearInterval(timer);
  }, 40);
}

export async function updateStatCount(): Promise<void> {
  try {
    const data = await fetchCount();
    animateCount(document.getElementById('statVehiculos'), data.dealer || 0);
    animateCount(document.getElementById('statParticulares'), data.particulares || 0);
  } catch { /* silent */ }
}
