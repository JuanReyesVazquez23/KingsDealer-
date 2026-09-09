import {
  allVehicles, setAllVehicles,
  activeFilter, setActiveFilter,
  sortPrecio, setSortPrecio,
  sortAnio, setSortAnio,
  filterMarca, setFilterMarca,
  showingAll, setShowingAll,
  isParticulares, setIsParticulares,
  allParticulares, setAllParticulares,
  CARDS_INITIAL,
} from './state';
import { esc, fmtMoneda, badgeMoneda, formatPrice } from './utils';
import { fetchVehicles, fetchParticulares } from './api';
import type { Vehicle } from './types';

declare const ROLE: string | undefined;

export async function loadVehicles(): Promise<void> {
  const grid = document.getElementById('vehiclesGrid');
  try {
    if (isParticulares) {
      const data = await fetchParticulares();
      setAllParticulares(data);
      renderVehicles(allParticulares);
      return;
    }
    const data = await fetchVehicles(activeFilter || undefined);
    setAllVehicles(data);
    populateMarcaSelect();
    applySort();
    updateStatCount();
  } catch {
    if (grid) grid.innerHTML =
      '<div class="empty-state"><div class="es-icon">⚠️</div><p>No se pudo cargar el catálogo. Verifica tu conexión.</p></div>';
  }
}

function buildCardImage(v: Vehicle): string {
  if (v.imagen)
    return `<img class="card-img" src="/img/${esc(v.imagen)}"
                 alt="${esc(v.marca)} ${esc(v.modelo)}" loading="lazy" />`;
  return `<div class="card-img-placeholder">
            <span class="ph-icon">🚗</span>
            <span>${esc(v.marca)} ${esc(v.modelo)}</span>
          </div>`;
}

export function renderVehicles(list: Vehicle[]): void {
  const grid = document.getElementById('vehiclesGrid');
  const moreWrap = document.getElementById('showMoreWrap');
  const gridWrap = document.getElementById('gridWrap');
  if (!grid) return;

  if (gridWrap) gridWrap.classList.toggle('grid-wrap--part', isParticulares);

  if (!list.length) {
    grid.innerHTML = `
      <div class="empty-state${isParticulares ? ' empty-state--dark' : ''}">
        <div class="es-icon">🚗</div>
        <p>${isParticulares ? 'No hay publicaciones de vendedores particulares.' : 'No hay vehículos en esta categoría.'}</p>
      </div>`;
    if (moreWrap) moreWrap.style.display = 'none';
    return;
  }

  const isTodos = !activeFilter && !isParticulares;
  const needsToggle = (isTodos || isParticulares) && list.length > CARDS_INITIAL;
  if (!needsToggle) setShowingAll(false);

  const displayList = needsToggle && !showingAll ? list.slice(0, CARDS_INITIAL) : list;

  if (moreWrap) {
    moreWrap.style.display = needsToggle ? 'flex' : 'none';
    const label = document.getElementById('showMoreLabel');
    const arrow = document.getElementById('showMoreArrow');
    const btn = document.getElementById('showMoreBtn');
    const txt = isParticulares ? 'publicaciones' : 'vehículos';
    if (label) label.textContent = showingAll ? `Ver menos ${txt}` : `Ver más ${txt}`;
    if (arrow) arrow.style.transform = showingAll ? 'rotate(180deg)' : 'rotate(0deg)';
    if (btn) btn.classList.toggle('btn-show-more--part', isParticulares);
  }

  grid.innerHTML = displayList.map((v, i) => {
    const moneda = v.moneda || 'DOP';
    const precioHtml = v.oferta && v.precio_oferta
      ? `<span class="price-original">${fmtMoneda(v.precio, moneda)}</span>
         <span class="price-oferta">${fmtMoneda(v.precio_oferta, moneda)}</span>`
      : fmtMoneda(v.precio, moneda);

    const adminBtns = (typeof ROLE !== 'undefined' && ROLE === 'admin')
      ? `<button class="card-btn card-btn-edit"   onclick="editVehicle(${v.id})">✏️</button>
         <button class="card-btn card-btn-delete" onclick="deleteVehicle(${v.id})">🗑</button>`
      : '';

    const esCliente = v.origen === 'cliente';
    return `
    <article class="vehicle-card${v.oferta ? ' card-en-oferta' : ''}${esCliente ? ' card-cliente' : ''}" style="animation-delay:${i * 50}ms">
      ${v.oferta ? '<div class="card-oferta-ribbon">OFERTA</div>' : ''}
      ${esCliente ? '<div class="card-cliente-ribbon">Particular</div>' : ''}
      ${buildCardImage(v)}
      <div class="card-body">
        <div class="card-tipo-row">
          <span class="card-tipo">${esc(v.tipo)}</span>
          ${badgeMoneda(moneda)}
        </div>
        <div class="card-name">${esc(v.marca)} ${esc(v.modelo)}<span class="card-year">${v.anio}</span></div>
        ${esCliente && v.condicion ? `<span class="card-condicion card-condicion-${v.condicion}">${v.condicion === 'nuevo' ? 'Nuevo' : 'Usado'}</span>` : ''}
        <p class="card-desc">${esc(v.descripcion || 'Consulta disponibilidad y condiciones.')}</p>
      </div>
      <div class="card-footer">
        <div class="card-price">${precioHtml}</div>
        <div class="card-actions">
          <button class="card-btn card-btn-detail" onclick="openModal(${v.id},'${v.origen}')">Ver</button>
          ${!esCliente ? adminBtns : ''}
        </div>
      </div>
    </article>`;
  }).join('');
}

export function initFilters(): void {
  document.querySelectorAll<HTMLButtonElement>('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const tipo = btn.dataset.tipo || '';
      const isPart = tipo === '__particulares__';
      setIsParticulares(isPart);
      setActiveFilter(isPart ? '' : tipo);
      setShowingAll(false);
      setSortPrecio('');
      setSortAnio('');
      setFilterMarca('');
      ['sortPrecio', 'sortAnio', 'filterMarca'].forEach(id => {
        const el = document.getElementById(id) as HTMLInputElement | null;
        if (el) { el.value = ''; el.classList.remove('active-filter'); }
      });
      updateClearBtn();
      const sb = document.getElementById('sortBar');
      if (sb) sb.style.display = isPart ? 'none' : '';
      loadVehicles();
    });
  });
}

function populateMarcaSelect(): void {
  const sel = document.getElementById('filterMarca') as HTMLSelectElement | null;
  if (!sel) return;
  const current = sel.value;
  const marcas = [...new Set(allVehicles.map(v => v.marca))].sort();
  sel.innerHTML = '<option value="">Todas</option>' +
    marcas.map(m => `<option value="${esc(m)}"${m === current ? ' selected' : ''}>${esc(m)}</option>`).join('');
}

export function initSortBar(): void {
  updateClearBtn();
}

export function applySort(): void {
  if (isParticulares) { renderVehicles(allParticulares); return; }

  const sp = (document.getElementById('sortPrecio') as HTMLSelectElement | null)?.value || '';
  const sa = (document.getElementById('sortAnio') as HTMLSelectElement | null)?.value || '';
  const fm = (document.getElementById('filterMarca') as HTMLSelectElement | null)?.value || '';
  setSortPrecio(sp);
  setSortAnio(sa);
  setFilterMarca(fm);

  ['sortPrecio', 'sortAnio', 'filterMarca'].forEach(id => {
    document.getElementById(id)?.classList.toggle('active-filter',
      !!(id === 'sortPrecio' ? sp : id === 'sortAnio' ? sa : fm));
  });
  updateClearBtn();

  let list = [...allVehicles];
  if (fm) list = list.filter(v => v.marca === fm);

  if (sp) {
    const F = 60;
    list.sort((a, b) => {
      const pa = (a.oferta && a.precio_oferta ? a.precio_oferta : a.precio) * (a.moneda === 'USD' ? F : 1);
      const pb = (b.oferta && b.precio_oferta ? b.precio_oferta : b.precio) * (b.moneda === 'USD' ? F : 1);
      return sp === 'desc' ? pb - pa : pa - pb;
    });
  } else if (sa) {
    list.sort((a, b) => sa === 'desc' ? b.anio - a.anio : a.anio - b.anio);
  }

  renderVehicles(list);
}

function updateClearBtn(): void {
  const btn = document.getElementById('sortClearBtn');
  if (btn) btn.style.display = (sortPrecio || sortAnio || filterMarca) ? 'flex' : 'none';
}

export function clearSort(): void {
  setSortPrecio('');
  setSortAnio('');
  setFilterMarca('');
  ['sortPrecio', 'sortAnio', 'filterMarca'].forEach(id => {
    const el = document.getElementById(id) as HTMLInputElement | null;
    if (el) { el.value = ''; el.classList.remove('active-filter'); }
  });
  updateClearBtn();
  renderVehicles(allVehicles.filter(v => v.origen !== 'cliente'));
}

export function toggleShowMore(): void {
  setShowingAll(!showingAll);
  if (isParticulares) { renderVehicles(allParticulares); }
  else { applySort(); }
  if (!showingAll) {
    document.getElementById('catalogo')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

// Lazy import to avoid circular dependency
let _updateStatCount: (() => Promise<void>) | null = null;
export function setUpdateStatCount(fn: () => Promise<void>) { _updateStatCount = fn; }
async function updateStatCount(): Promise<void> {
  if (_updateStatCount) await _updateStatCount();
}
