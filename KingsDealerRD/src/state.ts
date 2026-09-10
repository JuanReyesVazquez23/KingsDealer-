import type { Vehicle } from './types';

// ── Upload weight validation ──────────────────────
export const MAX_UPLOAD_BYTES = 4 * 1024 * 1024; // 4 MB

// ── Global state ──────────────────────────────────
export let allVehicles: Vehicle[] = [];
export let activeFilter = '';
export let editingId: number | null = null;
export let sortPrecio = '';
export let sortAnio = '';
export let filterMarca = '';
export let keepImages: string[] = [];

// ── Show more / Show less ─────────────────────────
export const CARDS_INITIAL = 5;
export let showingAll = false;
export let isParticulares = false;
export let allParticulares: Vehicle[] = [];

// ── Pending files (photo preview) ─────────────────
export let pendingFiles: File[] = [];

// ── Slider state ──────────────────────────────────
export let sliderOffers: Vehicle[] = [];
export let sliderIndex = 0;
export let sliderAutoplay: ReturnType<typeof setInterval> | null = null;
export const SLIDE_MS = 4500;

// ── Toast timer ───────────────────────────────────
export let _toastTimer: ReturnType<typeof setTimeout> | null = null;

// ── Setters ───────────────────────────────────────
export function setAllVehicles(v: Vehicle[]) { allVehicles = v; }
export function setActiveFilter(v: string) { activeFilter = v; }
export function setEditingId(v: number | null) { editingId = v; }
export function setSortPrecio(v: string) { sortPrecio = v; }
export function setSortAnio(v: string) { sortAnio = v; }
export function setFilterMarca(v: string) { filterMarca = v; }
export function setKeepImages(v: string[]) { keepImages = v; }
export function setShowingAll(v: boolean) { showingAll = v; }
export function setIsParticulares(v: boolean) { isParticulares = v; }
export function setAllParticulares(v: Vehicle[]) { allParticulares = v; }
export function setPendingFiles(v: File[]) { pendingFiles = v; }
export function setSliderOffers(v: Vehicle[]) { sliderOffers = v; }
export function setSliderIndex(v: number) { sliderIndex = v; }
export function setSliderAutoplay(v: ReturnType<typeof setInterval> | null) { sliderAutoplay = v; }
export function set_toastTimer(v: ReturnType<typeof setTimeout> | null) { _toastTimer = v; }
