import { _toastTimer, set_toastTimer } from './state';

// ── HTML escape ───────────────────────────────────
export function esc(str: unknown): string {
  if (str == null) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// ── Price formatting ──────────────────────────────
export function formatPrice(n: number): string {
  return Number(n).toLocaleString('es-DO');
}

// ── Currency helpers ──────────────────────────────
export function fmtMoneda(valor: number, moneda: string): string {
  return `${moneda === 'USD' ? 'US$' : 'RD$'} ${formatPrice(valor)}`;
}

export function badgeMoneda(moneda: string): string {
  const cls = moneda === 'USD' ? 'card-moneda-usd' : 'card-moneda-dop';
  return `<span class="card-moneda-badge ${cls}">${moneda || 'DOP'}</span>`;
}

// ── Upload weight helpers ─────────────────────────
export function pesoTotalFotos(formData: FormData): number {
  let total = 0;
  for (const value of formData.values()) {
    if (value instanceof File) total += value.size;
  }
  return total;
}

export function formatMB(bytes: number): string {
  return (bytes / (1024 * 1024)).toFixed(1);
}

// ── Toast notification ────────────────────────────
export function showToast(msg: string, type = ''): void {
  const toast = document.getElementById('toast');
  if (!toast) return;
  if (_toastTimer) clearTimeout(_toastTimer);
  toast.textContent = msg;
  toast.className = `toast show${type ? ' ' + type : ''}`;
  const timer = setTimeout(() => { toast.className = 'toast'; }, 3200);
  set_toastTimer(timer);
}
