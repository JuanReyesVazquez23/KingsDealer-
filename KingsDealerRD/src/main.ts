import { loadVehicles, initFilters, initSortBar, toggleShowMore, clearSort } from './vehicles';
import { loadOfertas, goToSlide, resetAutoplay } from './slider';
import { initMobileNav, initSecretTrigger } from './nav';
import { updateStatCount } from './stats';
import { initFotoPreview, removePendingFile, syncFilesToInput } from './photos';
import { initCropper, setCropRatio, confirmCrop, cancelCrop } from './cropper';
import { openModal, closeModal, mgGoTo, mgPrev, mgNext, openModalFromSlider } from './modal';
import { showToast } from './utils';
import { setMoneda, toggleForm, resetForm, editVehicle, deleteVehicle, submitVehicle, togglePrecioOferta, eliminarFotoExistente } from './admin';
import { initPWA } from './pwa';
import {
  setMonedaIndex, toggleBanco, toggleBancosGrid,
  abrirConfigMapa, guardarMapa, toggleAnuncios, loadAnuncios,
  cambiarEstadoAnuncio, eliminarAnuncio, initStatSync,
} from './index-page';
import { initVenderPage, setVMoneda, setCondicion, vstepNext, vstepBack, submitAnuncio } from './vender-page';
import { initLoginPage, togglePw } from './login-page';

// ── DOMContentLoaded init ─────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  loadVehicles();
  loadOfertas();
  initFilters();
  initSortBar();
  initMobileNav();
  initSecretTrigger();
  initFotoPreview();
  updateStatCount();
  initCropper();
  initPWA();

  // Page-specific init
  if (document.getElementById('venderForm')) {
    initVenderPage();
  }
  if (document.getElementById('bancosGrid')) {
    initStatSync();
  }
  if (document.getElementById('loginForm')) {
    initLoginPage();
  }
});

// ── Expose globals for inline onclick handlers ────
const w = window as any;
w.toggleShowMore = toggleShowMore;
w.clearSort = clearSort;
w.openModal = openModal;
w.closeModal = closeModal;
w.mgGoTo = mgGoTo;
w.mgPrev = mgPrev;
w.mgNext = mgNext;
w.openModalFromSlider = openModalFromSlider;
w.goToSlide = goToSlide;
w.showToast = showToast;
w.setMoneda = setMoneda;
w.setMonedaIndex = setMonedaIndex;
w.toggleForm = toggleForm;
w.resetForm = resetForm;
w.editVehicle = editVehicle;
w.deleteVehicle = deleteVehicle;
w.submitVehicle = submitVehicle;
w.togglePrecioOferta = togglePrecioOferta;
w.eliminarFotoExistente = eliminarFotoExistente;
w.removePendingFile = removePendingFile;
w.syncFilesToInput = syncFilesToInput;
w.setCropRatio = setCropRatio;
w.confirmCrop = confirmCrop;
w.cancelCrop = cancelCrop;
w.toggleBanco = toggleBanco;
w.toggleBancosGrid = toggleBancosGrid;
w.abrirConfigMapa = abrirConfigMapa;
w.guardarMapa = guardarMapa;
w.toggleAnuncios = toggleAnuncios;
w.loadAnuncios = loadAnuncios;
w.cambiarEstadoAnuncio = cambiarEstadoAnuncio;
w.eliminarAnuncio = eliminarAnuncio;
w.setVMoneda = setVMoneda;
w.setCondicion = setCondicion;
w.vstepNext = vstepNext;
w.vstepBack = vstepBack;
w.submitAnuncio = submitAnuncio;
w.togglePw = togglePw;
