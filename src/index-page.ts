import { showToast } from './utils';
import { fetchMapConfig, saveMapConfig, fetchAnuncios, cambiarEstadoAnuncioApi, eliminarAnuncioApi } from './api';

export function setMonedaIndex(v: string): void {
  const el = document.getElementById('fMoneda') as HTMLInputElement | null;
  if (el) el.value = v;
  document.getElementById('btnDOP')?.classList.toggle('active', v === 'DOP');
  document.getElementById('btnUSD')?.classList.toggle('active', v === 'USD');
}

export function toggleBanco(card: HTMLElement): void {
  const isOpen = card.classList.contains('banco-open');
  document.querySelectorAll('.banco-card').forEach(c => c.classList.remove('banco-open'));
  if (!isOpen) card.classList.add('banco-open');
}

export function toggleBancosGrid(): void {
  const grid = document.getElementById('bancosGrid');
  const btn = document.getElementById('bancosToggleBtn');
  if (!grid || !btn) return;
  const open = grid.classList.toggle('open');
  btn.classList.toggle('open', open);
  const label = btn.querySelector('span:not(.bancos-trigger-arrow)');
  if (label) label.textContent = open ? 'Ocultar bancos' : 'Ver nuestros bancos aliados';
  if (open) grid.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

export async function abrirConfigMapa(): Promise<void> {
  const d = await fetchMapConfig();
  const lat = document.getElementById('mapaLat') as HTMLInputElement | null;
  const lon = document.getElementById('mapaLon') as HTMLInputElement | null;
  const label = document.getElementById('mapaLabel') as HTMLInputElement | null;
  const wrap = document.getElementById('mapaConfigWrap');
  if (lat) lat.value = d.lat;
  if (lon) lon.value = d.lon;
  if (label) label.value = d.label;
  if (wrap) { wrap.style.display = 'block'; wrap.scrollIntoView({ behavior: 'smooth' }); }
}

export async function guardarMapa(): Promise<void> {
  const lat = (document.getElementById('mapaLat') as HTMLInputElement | null)?.value.trim() || '';
  const lon = (document.getElementById('mapaLon') as HTMLInputElement | null)?.value.trim() || '';
  const label = (document.getElementById('mapaLabel') as HTMLInputElement | null)?.value.trim() || '';
  if (!lat || !lon) { alert('Ingresa latitud y longitud.'); return; }

  const ok = await saveMapConfig(lat, lon, label);
  if (ok) {
    const bbox = `${parseFloat(lon) - .012},${parseFloat(lat) - .008},${parseFloat(lon) + .012},${parseFloat(lat) + .008}`;
    const iframe = document.getElementById('mapaIframe') as HTMLIFrameElement | null;
    if (iframe) iframe.src = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat},${lon}`;
    const wrap = document.getElementById('mapaConfigWrap');
    if (wrap) wrap.style.display = 'none';
    showToast('✅ Ubicación actualizada', 'success');
  } else {
    alert('Error al guardar.');
  }
}

export function toggleAnuncios(): void {
  const panel = document.getElementById('anunciosPanel');
  if (!panel) return;
  const vis = panel.style.display !== 'none';
  panel.style.display = vis ? 'none' : 'block';
  if (!vis) loadAnuncios('pendiente', document.querySelector('.anuncio-filter-btn'));
}

export async function loadAnuncios(estado: string, btn: HTMLElement | null): Promise<void> {
  document.querySelectorAll('.anuncio-filter-btn').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');
  const list = await fetchAnuncios(estado || undefined) as any[];
  const cont = document.getElementById('anunciosList');
  if (!cont) return;
  if (!list.length) { cont.innerHTML = '<p class="anuncio-empty">No hay anuncios en esta categoría.</p>'; return; }
  cont.innerHTML = list.map((a: any) => {
    const moneda = a.moneda === 'USD' ? 'US$' : 'RD$';
    const precio = Number(a.precio).toLocaleString('es-DO');
    const img = a.imagen ? `<img src="/img/${a.imagen}" class="anuncio-img" />` : '';
    return `<div class="anuncio-item">
      ${img}
      <div class="anuncio-data">
        <div class="anuncio-titulo">${a.marca} ${a.modelo} ${a.anio} — <span class="anuncio-cond ${a.condicion}">${a.condicion}</span></div>
        <div class="anuncio-precio">${moneda} ${precio}</div>
        <div class="anuncio-contacto"><strong>${a.nombre}</strong> · ${a.telefono}${a.whatsapp ? ' · WA: ' + a.whatsapp : ''}</div>
        ${a.descripcion ? `<p class="anuncio-desc">${a.descripcion}</p>` : ''}
        <div class="anuncio-estado-badge estado-${a.estado}">${a.estado.toUpperCase()}</div>
      </div>
      <div class="anuncio-actions">
        ${a.estado !== 'aprobado' ? `<button class="btn-anuncio-accion btn-aprobar" onclick="cambiarEstadoAnuncio(${a.id},'aprobado')">Aprobar</button>` : ''}
        ${a.estado !== 'rechazado' ? `<button class="btn-anuncio-accion btn-rechazar" onclick="cambiarEstadoAnuncio(${a.id},'rechazado')">Rechazar</button>` : ''}
        <button class="btn-anuncio-accion btn-eliminar-an" onclick="eliminarAnuncio(${a.id})">Eliminar</button>
      </div>
    </div>`;
  }).join('');
}

export async function cambiarEstadoAnuncio(id: number, estado: string): Promise<void> {
  await cambiarEstadoAnuncioApi(id, estado);
  const activeBtn = document.querySelector('.anuncio-filter-btn.active') as HTMLElement | null;
  const txt = activeBtn?.textContent?.toLowerCase() || '';
  const e = txt === 'todos' ? '' : txt === 'pendientes' ? 'pendiente' : txt === 'aprobados' ? 'aprobado' : 'rechazado';
  loadAnuncios(e, activeBtn);
  showToast(`✅ Marcado como ${estado}`, 'success');
}

export async function eliminarAnuncio(id: number): Promise<void> {
  if (!confirm('¿Eliminar este anuncio?')) return;
  await eliminarAnuncioApi(id);
  loadAnuncios('', document.querySelector('.anuncio-filter-btn:last-child'));
  showToast('🗑 Anuncio eliminado', 'success');
}

// ── Stat sync (MutationObserver for statVehiculos2) ──
export function initStatSync(): void {
  const card = document.getElementById('statVehiculos');
  const bar = document.getElementById('statVehiculos2');
  if (!card || !bar) return;
  const obs = new MutationObserver(() => { bar.textContent = card.textContent; });
  obs.observe(card, { childList: true, subtree: true, characterData: true });
}
