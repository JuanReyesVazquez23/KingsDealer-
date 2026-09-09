import {
  editingId, setEditingId,
  keepImages, setKeepImages,
  allVehicles,
  pendingFiles, setPendingFiles,
  MAX_UPLOAD_BYTES,
} from './state';
import { pesoTotalFotos, formatMB, showToast } from './utils';
import { saveVehicle, deleteVehicleApi } from './api';
import { renderPendingPreviews } from './photos';
import { loadVehicles } from './vehicles';
import { loadOfertas } from './slider';

export function togglePrecioOferta(checkbox: HTMLInputElement): void {
  const hidden = document.getElementById('fOfertaHidden') as HTMLInputElement | null;
  const wrap = document.getElementById('precioOfertaWrap');
  if (hidden) hidden.value = checkbox.checked ? '1' : '0';
  if (wrap) wrap.style.display = checkbox.checked ? 'block' : 'none';
}

export function toggleForm(): void {
  const wrap = document.getElementById('vehicleFormWrap');
  const btn = document.getElementById('toggleFormBtn');
  if (!wrap) return;
  const open = wrap.style.display === 'none' || wrap.style.display === '';
  wrap.style.display = open ? 'block' : 'none';
  if (btn) btn.textContent = open ? '✕ Cerrar formulario' : '+ Agregar vehículo';
  if (!open) resetForm();
}

export function resetForm(): void {
  setEditingId(null);
  setKeepImages([]);
  setPendingFiles([]);

  const fImagen = document.getElementById('fImagen') as HTMLInputElement | null;
  if (fImagen) {
    fImagen.value = '';
    const prevCrop = fImagen.parentNode?.querySelector('.crop-previews');
    if (prevCrop) prevCrop.innerHTML = '';
  }
  const fExtra = document.getElementById('fImagenesExtra') as HTMLInputElement | null;
  if (fExtra) fExtra.value = '';
  const pprev = document.getElementById('fotoPendingPreview');
  if (pprev) pprev.innerHTML = '';
  const fcnt = document.getElementById('fotosCount');
  if (fcnt) fcnt.textContent = '';

  const form = document.getElementById('vehicleForm') as HTMLFormElement | null;
  if (form) form.reset();

  const set = (id: string, val: string) => { const el = document.getElementById(id) as HTMLInputElement | null; if (el) el.value = val; };
  const txt = (id: string, val: string) => { const el = document.getElementById(id); if (el) el.textContent = val; };

  set('editId', '');
  set('fOfertaHidden', '0');
  set('fMoneda', 'DOP');
  txt('formTitle', 'Nuevo vehículo');
  txt('submitBtn', 'Guardar vehículo');
  txt('formError', '');

  const wrap = document.getElementById('vehicleFormWrap');
  if (wrap) wrap.style.display = 'none';
  const toggleBtn = document.getElementById('toggleFormBtn');
  if (toggleBtn) toggleBtn.textContent = '+ Agregar vehículo';
  const pw = document.getElementById('precioOfertaWrap');
  if (pw) pw.style.display = 'none';

  renderImagenesExistentes([]);
  syncMonedaBtns('DOP');
}

export function editVehicle(id: number): void {
  const v = allVehicles.find(x => x.id === id);
  if (!v) return;

  setEditingId(id);
  setKeepImages(Array.isArray(v.imagenes_extra) ? [...v.imagenes_extra] : []);

  const set = (fid: string, val: string | number) => { const el = document.getElementById(fid) as HTMLInputElement | null; if (el) el.value = String(val); };
  const txt = (fid: string, val: string) => { const el = document.getElementById(fid); if (el) el.textContent = val; };

  set('editId', id);
  set('fMarca', v.marca);
  set('fModelo', v.modelo);
  set('fAnio', v.anio);
  set('fTipo', v.tipo);
  set('fPrecio', v.precio);
  set('fDescripcion', v.descripcion || '');
  set('fOfertaHidden', v.oferta ? '1' : '0');
  set('fMoneda', v.moneda || 'DOP');
  set('fPrecioOferta', v.precio_oferta || '');

  const chk = document.getElementById('fOferta') as HTMLInputElement | null;
  if (chk) {
    chk.checked = !!v.oferta;
    const pw = document.getElementById('precioOfertaWrap');
    if (pw) pw.style.display = v.oferta ? 'block' : 'none';
  }

  txt('formTitle', `Editando: ${v.marca} ${v.modelo}`);
  txt('submitBtn', 'Actualizar vehículo');
  txt('formError', '');

  syncMonedaBtns(v.moneda || 'DOP');
  renderImagenesExistentes(keepImages);

  const wrap = document.getElementById('vehicleFormWrap');
  if (wrap) { wrap.style.display = 'block'; wrap.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
  const toggleBtn = document.getElementById('toggleFormBtn');
  if (toggleBtn) toggleBtn.textContent = '✕ Cerrar formulario';
}

export function syncMonedaBtns(value: string): void {
  const btnDOP = document.getElementById('btnDOP');
  const btnUSD = document.getElementById('btnUSD');
  if (btnDOP) btnDOP.classList.toggle('active', value === 'DOP');
  if (btnUSD) btnUSD.classList.toggle('active', value === 'USD');
}

export function setMoneda(value: string): void {
  const el = document.getElementById('fMoneda') as HTMLInputElement | null;
  if (el) el.value = value;
  syncMonedaBtns(value);
}

function renderImagenesExistentes(lista: string[]): void {
  const cont = document.getElementById('imagenesExistentes');
  if (!cont) return;
  if (!lista.length) { cont.innerHTML = ''; cont.style.display = 'none'; return; }
  cont.style.display = 'grid';
  cont.className = 'imagenes-existentes foto-preview-grid';
  cont.innerHTML = lista.map((nombre, i) => `
    <div class="foto-preview-item" id="ithumb-${i}">
      <img src="/img/${esc(nombre)}" alt="Foto ${i+1}" loading="lazy" />
      <button type="button" class="foto-preview-del" onclick="eliminarFotoExistente(${i})" aria-label="Eliminar foto ${i+1}">✕</button>
    </div>`).join('');
}

function esc(str: unknown): string {
  if (str == null) return '';
  return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;');
}

export function eliminarFotoExistente(idx: number): void {
  const images = [...keepImages];
  images.splice(idx, 1);
  setKeepImages(images);
  renderImagenesExistentes(keepImages);
}

export async function submitVehicle(e: Event): Promise<void> {
  e.preventDefault();
  const errEl = document.getElementById('formError');
  const btn = document.getElementById('submitBtn') as HTMLButtonElement | null;
  if (errEl) errEl.textContent = '';
  if (btn) { btn.disabled = true; btn.textContent = 'Guardando…'; }

  const formData = new FormData(document.getElementById('vehicleForm') as HTMLFormElement);
  formData.set('imagenes_extra_keep', JSON.stringify(keepImages));

  const peso = pesoTotalFotos(formData);
  if (peso > MAX_UPLOAD_BYTES) {
    if (errEl) errEl.textContent = `Las fotos pesan ${formatMB(peso)} MB en total (máx. ${formatMB(MAX_UPLOAD_BYTES)} MB). Quita alguna foto e intenta de nuevo.`;
    if (btn) { btn.disabled = false; btn.textContent = editingId ? 'Actualizar vehículo' : 'Guardar vehículo'; }
    return;
  }

  try {
    const result = await saveVehicle(editingId, formData);
    if (!result.ok) {
      if (errEl) errEl.textContent = result.error || 'Error al guardar.';
    } else {
      showToast(editingId ? '✅ Vehículo actualizado' : '✅ Vehículo agregado', 'success');
      resetForm();
      await Promise.all([loadVehicles(), loadOfertas()]);
    }
  } catch {
    if (errEl) errEl.textContent = 'Error de conexión.';
  } finally {
    if (btn) { btn.disabled = false; btn.textContent = editingId ? 'Actualizar vehículo' : 'Guardar vehículo'; }
  }
}

export async function deleteVehicle(id: number): Promise<void> {
  const v = allVehicles.find(x => x.id === id);
  if (!v || !confirm(`¿Eliminar "${v.marca} ${v.modelo}"? Esta acción no se puede deshacer.`)) return;
  try {
    const ok = await deleteVehicleApi(id);
    if (ok) {
      showToast('🗑 Vehículo eliminado', 'success');
      await Promise.all([loadVehicles(), loadOfertas()]);
    } else {
      showToast('Error al eliminar', 'error');
    }
  } catch { showToast('Error de conexión', 'error'); }
}
