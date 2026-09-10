import { pendingFiles, setPendingFiles, keepImages, MAX_UPLOAD_BYTES } from './state';
import { formatMB, pesoTotalFotos } from './utils';

export function initFotoPreview(): void {
  const input = document.getElementById('fImagenesExtra') as HTMLInputElement | null;
  if (!input) return;

  input.setAttribute('multiple', '');

  input.addEventListener('change', () => {
    const newFiles = Array.from(input.files || []);
    newFiles.forEach(f => {
      if (!pendingFiles.find(p => p.name === f.name && p.size === f.size)) {
        pendingFiles.push(f);
      }
    });
    renderPendingPreviews();
    input.value = '';
  });
}

export function renderPendingPreviews(): void {
  let previewCont = document.getElementById('fotoPendingPreview');
  if (!previewCont) {
    const input = document.getElementById('fImagenesExtra');
    if (!input) return;
    previewCont = document.createElement('div');
    previewCont.id = 'fotoPendingPreview';
    previewCont.className = 'foto-preview-grid';
    previewCont.style.marginTop = '10px';
    input.parentNode!.insertBefore(previewCont, input.nextSibling);
  }

  let countEl = document.getElementById('fotosCount');
  if (!countEl) {
    countEl = document.createElement('p');
    countEl.id = 'fotosCount';
    countEl.className = 'fotos-count';
    const previewCont2 = document.getElementById('fotoPendingPreview');
    if (previewCont2) previewCont2.parentNode!.insertBefore(countEl, previewCont2.nextSibling);
  }

  previewCont.innerHTML = pendingFiles.map((f, i) => {
    const url = URL.createObjectURL(f);
    return `<div class="foto-preview-item">
      <img src="${url}" alt="Nueva foto ${i+1}" />
      <button type="button" class="foto-preview-del" onclick="removePendingFile(${i})" aria-label="Quitar foto">✕</button>
    </div>`;
  }).join('');

  const total = keepImages.length + pendingFiles.length;
  countEl.textContent = total > 0 ? `${total} foto${total !== 1 ? 's' : ''} en total` : '';
  countEl.className = 'fotos-count';

  syncFilesToInput();
}

export function removePendingFile(idx: number): void {
  pendingFiles.splice(idx, 1);
  renderPendingPreviews();
}

export function syncFilesToInput(): void {
  try {
    const dt = new DataTransfer();
    pendingFiles.forEach(f => dt.items.add(f));
    const input = document.getElementById('fImagenesExtra') as HTMLInputElement | null;
    if (input) input.files = dt.files;
  } catch {
    // DataTransfer not supported on older browsers
  }
}
