import { allVehicles, allParticulares, setAllVehicles } from './state';
import { esc, fmtMoneda } from './utils';
import type { Vehicle } from './types';

let mgFotos: string[] | null = null;
let mgActual = 0;

export function openModal(id: number, origen: string): void {
  const lista = (origen === 'cliente') ? allParticulares : allVehicles;
  const v = lista.find(x => x.id === id);
  if (!v) return;

  const moneda = v.moneda || 'DOP';
  const extras = Array.isArray(v.imagenes_extra) ? v.imagenes_extra : [];
  const todasFotos: string[] = [];
  if (v.imagen) todasFotos.push(v.imagen);
  extras.forEach(e => { if (e) todasFotos.push(e); });

  let galeriaHtml = '';
  if (!todasFotos.length) {
    galeriaHtml = `<div class="modal-img-ph">🚗</div>`;
  } else if (todasFotos.length === 1) {
    galeriaHtml = `<img class="modal-img"
                        src="/img/${esc(todasFotos[0])}"
                        alt="${esc(v.marca)} ${esc(v.modelo)}" />`;
  } else {
    galeriaHtml = `
      <div class="modal-gallery">
        <div class="mg-main-wrap">
          <img class="mg-main-img" id="mgMain"
               src="/img/${esc(todasFotos[0])}"
               alt="${esc(v.marca)} ${esc(v.modelo)}" />
          <button class="mg-arrow mg-arrow-l" onclick="mgPrev()" aria-label="Anterior">&#8592;</button>
          <button class="mg-arrow mg-arrow-r" onclick="mgNext()" aria-label="Siguiente">&#8594;</button>
          <div class="mg-counter"><span id="mgCurrent">1</span>/${todasFotos.length}</div>
        </div>
        <div class="mg-thumbs" id="mgThumbs">
          ${todasFotos.map((f, i) => `
            <button class="mg-thumb${i === 0 ? ' active' : ''}" onclick="mgGoTo(${i})" aria-label="Foto ${i+1}">
              <img src="/img/${esc(f)}" alt="Foto ${i+1}" loading="lazy" />
            </button>`).join('')}
        </div>
      </div>`;
  }

  const precioHtml = (v.oferta && v.precio_oferta)
    ? `<p class="modal-price">
         <span class="modal-price-original">${fmtMoneda(v.precio, moneda)}</span>
         ${fmtMoneda(v.precio_oferta, moneda)}
       </p>`
    : `<p class="modal-price">${fmtMoneda(v.precio, moneda)}</p>`;

  document.getElementById('modalContent')!.innerHTML = `
    ${galeriaHtml}
    <div class="modal-body">
      ${v.oferta ? '<span class="modal-oferta-tag">OFERTA</span>' : ''}
      <div class="modal-tipo-row">
        <p class="modal-tipo">${esc(v.tipo)}</p>
        <span class="modal-moneda-badge modal-moneda-${moneda.toLowerCase()}">${moneda}</span>
      </div>
      <h2 class="modal-title">${esc(v.marca)} ${esc(v.modelo)}</h2>
      <p class="modal-year">Año ${v.anio}</p>
      <p class="modal-desc">${esc(v.descripcion || 'Consulta disponibilidad y financiamiento.')}</p>
      ${precioHtml}
      ${v.origen === 'cliente' && v.nombre_vendedor ? `
        <div class="modal-vendedor">
          <p class="modal-vendedor-label">Vendedor particular</p>
          <p class="modal-vendedor-nombre">${esc(v.nombre_vendedor)}</p>
        </div>
        <div class="modal-cta">
          ${v.whatsapp_vendedor
            ? `<a href="https://wa.me/${v.whatsapp_vendedor.replace(/[^0-9]/g,'')}?text=${encodeURIComponent('Hola ' + v.nombre_vendedor + ', vi tu ' + v.marca + ' ' + v.modelo + ' ' + v.anio + ' en Peña\u0027s Autos')}" class="btn-primary" target="_blank" rel="noopener">WhatsApp vendedor</a>`
            : ''}
          <a href="tel:${v.telefono_vendedor}" class="btn-ghost" style="color:#333;border-color:#ccc;">Llamar: ${esc(v.telefono_vendedor)}</a>
        </div>` : `
        <div class="modal-cta">
          <a href="https://wa.me/18091234567?text=${encodeURIComponent('Hola, me interesa el ' + v.marca + ' ' + v.modelo + ' ' + v.anio)}"
             class="btn-primary" target="_blank" rel="noopener">WhatsApp</a>
          <a href="tel:+18091234567" class="btn-ghost" style="color:#333;border-color:#ccc;">Llamar</a>
        </div>`}
    </div>`;

  mgFotos = todasFotos.length > 1 ? todasFotos : null;
  mgActual = 0;

  document.getElementById('modalOverlay')!.classList.add('open');
  document.body.style.overflow = 'hidden';
}

export function mgGoTo(idx: number): void {
  if (!mgFotos?.length) return;
  mgActual = idx;
  const main = document.getElementById('mgMain') as HTMLImageElement | null;
  const curr = document.getElementById('mgCurrent');
  const thumbs = document.querySelectorAll('.mg-thumb');
  if (main) main.src = `/img/${esc(mgFotos[idx])}`;
  if (curr) curr.textContent = String(idx + 1);
  thumbs.forEach((t, i) => t.classList.toggle('active', i === idx));
}

export function mgPrev(): void {
  if (mgFotos) mgGoTo((mgActual - 1 + mgFotos.length) % mgFotos.length);
}

export function mgNext(): void {
  if (mgFotos) mgGoTo((mgActual + 1) % mgFotos.length);
}

export function closeModal(): void {
  document.getElementById('modalOverlay')?.classList.remove('open');
  document.body.style.overflow = '';
  mgFotos = null;
  mgActual = 0;
}

export function openModalFromSlider(id: number, offers: Vehicle[]): void {
  if (!allVehicles.find(x => x.id === id)) {
    const v = offers.find(x => x.id === id);
    if (v) setAllVehicles([...allVehicles, v]);
  }
  openModal(id, 'dealer');
}

// Keyboard navigation
document.addEventListener('keydown', (e: KeyboardEvent) => {
  if (e.key === 'Escape') closeModal();
  if (e.key === 'ArrowLeft' && mgFotos) mgPrev();
  if (e.key === 'ArrowRight' && mgFotos) mgNext();
});
