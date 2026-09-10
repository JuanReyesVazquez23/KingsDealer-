let cropper: any = null;
let activeInput: HTMLInputElement | null = null;
let croppedFiles: Record<string, File[]> = {};
let pendingIndex = 0;
let pendingCropFiles: File[] = [];
let currentRatio = 1.6;

function initCropListeners(): void {
  document.querySelectorAll<HTMLInputElement>('input[type="file"][data-crop]').forEach(bindInput);
}

function bindInput(input: HTMLInputElement): void {
  if ((input as any)._cropBound) return;
  (input as any)._cropBound = true;

  input.addEventListener('change', function () {
    const files = Array.from(this.files || []);
    if (!files.length) return;

    const ratio = parseFloat(this.dataset.ratio || '1.6') || 1.6;
    currentRatio = ratio;
    syncRatioBtns(ratio);

    const ratioBtnsEl = document.getElementById('cropRatioBtns');
    if (ratioBtnsEl) {
      ratioBtnsEl.style.display = this.dataset.hideRatio ? 'none' : '';
    }

    activeInput = input;
    croppedFiles[input.id] = croppedFiles[input.id] || [];
    pendingCropFiles = files;
    pendingIndex = 0;

    openCropForFile(files[0]);
  });
}

function openCropForFile(file: File): void {
  const reader = new FileReader();
  reader.onload = function (e) {
    const img = document.getElementById('cropImg') as HTMLImageElement;
    img.src = e.target!.result as string;

    const overlay = document.getElementById('cropOverlay')!;
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';

    setTimeout(() => {
      if (cropper) { cropper.destroy(); cropper = null; }
      // Cropper.js is loaded from CDN as a global
      const CropperConstructor = (window as any).Cropper;
      if (!CropperConstructor) return;
      cropper = new CropperConstructor(img, {
        aspectRatio: currentRatio || NaN,
        viewMode: 1,
        dragMode: 'move',
        autoCropArea: 0.88,
        responsive: true,
        restore: false,
        guides: true,
        center: true,
        highlight: false,
        cropBoxMovable: true,
        cropBoxResizable: true,
        toggleDragModeOnDblclick: false,
      });
    }, 80);
  };
  reader.readAsDataURL(file);
}

export function setCropRatio(ratio: number, btn: HTMLElement): void {
  currentRatio = ratio;
  if (cropper) cropper.setAspectRatio(ratio || NaN);
  syncRatioBtns(ratio);
}

function syncRatioBtns(ratio: number): void {
  document.querySelectorAll<HTMLElement>('.crop-ratio-btn').forEach(b => {
    b.classList.toggle('active', parseFloat(b.dataset.ratio || '0') === ratio);
  });
}

export function confirmCrop(): void {
  if (!cropper || !activeInput) return;

  const canvas = cropper.getCroppedCanvas({ maxWidth: 1600, maxHeight: 1600 });
  canvas.toBlob(function (blob: Blob) {
    if (!blob || !activeInput) return;
    const originalName = pendingCropFiles[pendingIndex].name.replace(/\.[^.]+$/, '') + '.jpg';
    const croppedFile = new File([blob], originalName, { type: 'image/jpeg' });

    if (!croppedFiles[activeInput.id]) croppedFiles[activeInput.id] = [];
    croppedFiles[activeInput.id].push(croppedFile);

    pendingIndex++;

    if (pendingIndex < pendingCropFiles.length) {
      openCropForFile(pendingCropFiles[pendingIndex]);
    } else {
      injectFiles(activeInput, croppedFiles[activeInput.id]);
      closeCropOverlay();
      showCropPreviews(activeInput, croppedFiles[activeInput.id]);
      croppedFiles[activeInput.id] = [];
    }
  }, 'image/jpeg', 0.82);
}

export function cancelCrop(): void {
  if (activeInput) activeInput.value = '';
  closeCropOverlay();
}

function closeCropOverlay(): void {
  if (cropper) { cropper.destroy(); cropper = null; }
  const overlay = document.getElementById('cropOverlay');
  overlay?.classList.remove('open');
  document.body.style.overflow = '';
  activeInput = null;
  pendingCropFiles = [];
  pendingIndex = 0;
}

function injectFiles(input: HTMLInputElement, files: File[]): void {
  try {
    const dt = new DataTransfer();
    files.forEach(f => dt.items.add(f));
    input.files = dt.files;
  } catch {
    (input as any)._croppedFiles = files;
  }
}

function showCropPreviews(input: HTMLInputElement, files: File[]): void {
  const previewId = input.id + '_preview';
  let prevWrap = document.getElementById(previewId);
  if (!prevWrap) {
    prevWrap = document.createElement('div');
    prevWrap.id = previewId;
    prevWrap.className = 'crop-previews';
    input.parentNode!.insertBefore(prevWrap, input.nextSibling);
  }
  prevWrap.innerHTML = '';
  files.forEach((file, i) => {
    const url = URL.createObjectURL(file);
    const wrap = document.createElement('div');
    wrap.className = 'crop-preview-item';
    wrap.innerHTML = `
      <img src="${url}" alt="Vista previa ${i+1}" />
      <span class="crop-preview-badge">✓ Recortada</span>
    `;
    prevWrap!.appendChild(wrap);
  });
}

export function initCropper(): void {
  document.addEventListener('DOMContentLoaded', initCropListeners);
  const observer = new MutationObserver(() => initCropListeners());
  observer.observe(document.body, { childList: true, subtree: true });
}
