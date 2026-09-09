import {
  sliderOffers, setSliderOffers,
  sliderIndex, setSliderIndex,
  sliderAutoplay, setSliderAutoplay,
  SLIDE_MS,
} from './state';
import { esc, fmtMoneda } from './utils';
import { fetchOfertas } from './api';
import type { Vehicle } from './types';

export async function loadOfertas(): Promise<void> {
  try {
    const data = await fetchOfertas();
    setSliderOffers(data);
    if (!sliderOffers.length) return;
    const section = document.getElementById('ofertas-section');
    if (section) section.style.display = '';
    buildSlider();
    startAutoplay();
  } catch { /* silent */ }
}

function buildSlider(): void {
  const track = document.getElementById('sliderTrack');
  const dots = document.getElementById('sliderDots');
  if (!track || !dots) return;

  track.innerHTML = sliderOffers.map((v, i) => {
    const moneda = v.moneda || 'DOP';
    const img = v.imagen
      ? `<img class="slide-img" src="/img/${esc(v.imagen)}"
              alt="${esc(v.marca)} ${esc(v.modelo)}" loading="lazy" />`
      : `<div class="slide-img-ph">🚗</div>`;
    const precio = v.precio_oferta
      ? `<div class="slide-prices">
           <span class="slide-price-old">${fmtMoneda(v.precio, moneda)}</span>
           <span class="slide-price-new">${fmtMoneda(v.precio_oferta, moneda)}</span>
         </div>`
      : `<div class="slide-prices">
           <span class="slide-price-new">${fmtMoneda(v.precio, moneda)}</span>
         </div>`;
    return `
      <div class="slide-item${i === 0 ? ' active' : ''}" data-index="${i}">
        <div class="slide-img-wrap">${img}<div class="slide-overlay"></div></div>
        <div class="slide-info">
          <span class="slide-badge">OFERTA ESPECIAL</span>
          <h3 class="slide-name">${esc(v.marca)} ${esc(v.modelo)}</h3>
          <p class="slide-year">${v.anio} · ${esc(v.tipo)}</p>
          ${precio}
          <button class="slide-cta" onclick="openModalFromSlider(${v.id})">Ver detalles</button>
        </div>
      </div>`;
  }).join('');

  dots.innerHTML = sliderOffers.map((_, i) =>
    `<button class="slider-dot${i === 0 ? ' active' : ''}" onclick="goToSlide(${i})" aria-label="Slide ${i+1}"></button>`
  ).join('');

  const prev = document.getElementById('sliderPrev');
  const next = document.getElementById('sliderNext');
  if (prev) {
    const np = prev.cloneNode(true) as HTMLElement;
    prev.replaceWith(np);
    np.addEventListener('click', () => {
      goToSlide((sliderIndex - 1 + sliderOffers.length) % sliderOffers.length);
      resetAutoplay();
    });
  }
  if (next) {
    const nn = next.cloneNode(true) as HTMLElement;
    next.replaceWith(nn);
    nn.addEventListener('click', () => {
      goToSlide((sliderIndex + 1) % sliderOffers.length);
      resetAutoplay();
    });
  }
}

export function goToSlide(idx: number): void {
  document.querySelectorAll('.slide-item')[sliderIndex]?.classList.remove('active');
  document.querySelectorAll('.slider-dot')[sliderIndex]?.classList.remove('active');
  setSliderIndex(idx);
  document.querySelectorAll('.slide-item')[sliderIndex]?.classList.add('active');
  document.querySelectorAll('.slider-dot')[sliderIndex]?.classList.add('active');
}

function startAutoplay(): void {
  setSliderAutoplay(setInterval(() => {
    goToSlide((sliderIndex + 1) % sliderOffers.length);
  }, SLIDE_MS));
}

export function resetAutoplay(): void {
  if (sliderAutoplay) clearInterval(sliderAutoplay);
  startAutoplay();
}
