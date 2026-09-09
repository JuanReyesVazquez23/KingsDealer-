import { showToast } from './utils';

export function initPWA(): void {
  // Service Worker registration
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js', { scope: '/' })
        .then(r => console.log('[Peña\'s Autos PWA] SW:', r.scope))
        .catch(e => console.warn('[Peña\'s Autos PWA] SW error:', e));
    });
  }

  // Install prompt
  let deferredPrompt: any = null;
  const banner = document.getElementById('pwaBanner');
  const fab = document.getElementById('pwaFab');
  const installBtn = document.getElementById('pwaBannerInstall');
  const closeBtn = document.getElementById('pwaBannerClose');
  const dismissed = sessionStorage.getItem('pwa-dismissed');

  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    if (!dismissed && banner) {
      setTimeout(() => banner.classList.add('show'), 2500);
    }
  });

  if (installBtn) {
    installBtn.addEventListener('click', async () => {
      if (!deferredPrompt) return;
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      deferredPrompt = null;
      banner?.classList.remove('show');
      if (outcome === 'accepted') showToast('✅ ¡App instalada!', 'success');
    });
  }

  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      banner?.classList.remove('show');
      sessionStorage.setItem('pwa-dismissed', '1');
      if (deferredPrompt && fab) {
        setTimeout(() => { fab.style.display = 'flex'; }, 400);
      }
    });
  }

  if (fab) {
    fab.addEventListener('click', async () => {
      if (!deferredPrompt) return;
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      deferredPrompt = null;
      fab.style.display = 'none';
      if (outcome === 'accepted') showToast('✅ ¡App instalada!', 'success');
    });
  }

  // iOS Safari
  const isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent);
  const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
  if (isIOS && !isStandalone && !dismissed && banner) {
    setTimeout(() => {
      const inst = document.getElementById('pwaBannerInstall');
      if (inst) {
        inst.textContent = 'Ver cómo';
        inst.addEventListener('click', () => {
          showToast('Toca Compartir ↑ → "Añadir a pantalla de inicio"', 'success');
          banner.classList.remove('show');
        }, { once: true });
      }
      banner.classList.add('show');
    }, 2500);
  }
}
