import { showToast, esc } from './utils';
import { submitAnuncioApi } from './api';
import { syncFilesToInput } from './photos';

export function setVMoneda(v: string): void {
  const el = document.getElementById('vMoneda') as HTMLInputElement | null;
  if (el) el.value = v;
  document.getElementById('vBtnDOP')?.classList.toggle('active', v === 'DOP');
  document.getElementById('vBtnUSD')?.classList.toggle('active', v === 'USD');
}

export function setCondicion(v: string): void {
  const el = document.getElementById('vCondicion') as HTMLInputElement | null;
  if (el) el.value = v;
  document.getElementById('cBtnUsado')?.classList.toggle('cond-inactive', v !== 'usado');
  document.getElementById('cBtnNuevo')?.classList.toggle('cond-inactive', v !== 'nuevo');
}

export function vstepNext(step: number): void {
  const cont = document.getElementById('vstep' + step);
  if (!cont) return;
  const reqs = cont.querySelectorAll<HTMLElement>('[required]');
  let ok = true;
  let firstErr: HTMLElement | null = null;

  reqs.forEach(el => {
    el.classList.remove('field-error');
    const val = (el as HTMLInputElement).value.trim();
    if (!val) {
      el.classList.add('field-error');
      ok = false;
      if (!firstErr) firstErr = el;
    }
  });

  if (ok) {
    const anioEl = cont.querySelector('#vAnio') as HTMLInputElement | null;
    if (anioEl) {
      const anio = parseInt(anioEl.value);
      if (anio < 1980 || anio > 2030) {
        anioEl.classList.add('field-error');
        ok = false;
        firstErr = anioEl;
      }
    }
    const precioEl = cont.querySelector('#vPrecio') as HTMLInputElement | null;
    if (precioEl && parseFloat(precioEl.value) <= 0) {
      precioEl.classList.add('field-error');
      ok = false;
      firstErr = precioEl;
    }
  }

  if (!ok) {
    firstErr?.focus();
    firstErr?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    const btn = cont.querySelector('.btn-primary') as HTMLElement | null;
    if (btn) {
      btn.classList.add('btn-shake');
      setTimeout(() => btn.classList.remove('btn-shake'), 500);
    }
    return;
  }

  cont.style.display = 'none';
  const next = document.getElementById('vstep' + (step + 1));
  if (next) next.style.display = '';
  updateStepIndicators(step + 1);
  if (step + 1 === 3) buildResumen();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

export function vstepBack(step: number): void {
  const curr = document.getElementById('vstep' + step);
  const prev = document.getElementById('vstep' + (step - 1));
  if (curr) curr.style.display = 'none';
  if (prev) prev.style.display = '';
  updateStepIndicators(step - 1);
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function updateStepIndicators(active: number): void {
  [1, 2, 3].forEach(i => {
    const el = document.getElementById('vstep-ind-' + i);
    if (!el) return;
    el.classList.toggle('vstep-active', i === active);
    el.classList.toggle('vstep-done', i < active);
  });
}

function buildResumen(): void {
  const moneda = (document.getElementById('vMoneda') as HTMLInputElement | null)?.value === 'USD' ? 'US$' : 'RD$';
  const precio = Number((document.getElementById('vPrecio') as HTMLInputElement | null)?.value || 0).toLocaleString('es-DO');
  const cond = (document.getElementById('vCondicion') as HTMLInputElement | null)?.value;
  const rows: [string, string][] = [
    ['Nombre', (document.getElementById('vNombre') as HTMLInputElement | null)?.value || ''],
    ['Teléfono', (document.getElementById('vTelefono') as HTMLInputElement | null)?.value || ''],
    ['Vehículo', `${(document.getElementById('vMarca') as HTMLInputElement | null)?.value || ''} ${(document.getElementById('vModelo') as HTMLInputElement | null)?.value || ''} ${(document.getElementById('vAnio') as HTMLInputElement | null)?.value || ''}`],
    ['Tipo', (document.getElementById('vTipo') as HTMLInputElement | null)?.value || ''],
    ['Condición', cond === 'nuevo' ? 'Nuevo' : 'Usado'],
    ['Precio', `${moneda} ${precio}`],
  ];
  const resumen = document.getElementById('vResumen');
  if (resumen) {
    resumen.innerHTML = rows.map(([label, val]) =>
      `<div class="resumen-row">
         <span>${label}</span>
         <strong>${esc(val)}</strong>
       </div>`
    ).join('');
  }
}

export async function submitAnuncio(e: Event): Promise<void> {
  e.preventDefault();
  const btn = document.getElementById('vSubmitBtn') as HTMLButtonElement | null;
  const errEl = document.getElementById('vFormError');
  if (btn) { btn.disabled = true; btn.textContent = 'Enviando…'; }
  if (errEl) errEl.textContent = '';

  syncFilesToInput();

  try {
    const formData = new FormData(document.getElementById('venderForm') as HTMLFormElement);
    const result = await submitAnuncioApi(formData);
    if (!result.ok) {
      if (errEl) errEl.textContent = result.error || 'Error al enviar.';
      if (btn) { btn.disabled = false; btn.textContent = 'Publicar mi vehículo'; }
    } else {
      const step3 = document.getElementById('vstep3');
      const success = document.getElementById('vstepSuccess');
      if (step3) step3.style.display = 'none';
      if (success) success.style.display = '';
    }
  } catch {
    if (errEl) errEl.textContent = 'Error de conexión.';
    if (btn) { btn.disabled = false; btn.textContent = 'Publicar mi vehículo'; }
  }
}

export function initVenderPage(): void {
  setCondicion('usado');

  document.getElementById('menuToggle')?.addEventListener('click', () => {
    document.getElementById('mobileNav')?.classList.toggle('open');
    document.getElementById('menuToggle')?.classList.toggle('open');
  });

  const form = document.getElementById('venderForm');
  if (form) {
    form.addEventListener('input', clearFieldErr);
    form.addEventListener('change', clearFieldErr);
  }
}

function clearFieldErr(e: Event): void {
  (e.target as HTMLElement).classList.remove('field-error');
}
