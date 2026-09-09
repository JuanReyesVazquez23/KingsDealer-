export interface Vehicle {
  id: number;
  marca: string;
  modelo: string;
  anio: number;
  tipo: string;
  precio: number;
  moneda: string;
  imagen: string | null;
  imagenes_extra: string[];
  oferta: boolean;
  precio_oferta: number | null;
  origen: 'dealer' | 'cliente';
  condicion?: string;
  descripcion?: string;
  nombre_vendedor?: string;
  whatsapp_vendedor?: string;
  telefono_vendedor?: string;
}

export interface Anuncio {
  id: number;
  marca: string;
  modelo: string;
  anio: number;
  tipo: string;
  precio: number;
  moneda: string;
  imagen: string | null;
  imagenes_extra: string[];
  condicion: string;
  descripcion: string;
  nombre: string;
  telefono: string;
  whatsapp: string;
  estado: 'pendiente' | 'aprobado' | 'rechazado';
}

export interface SliderOffer extends Vehicle {}

export interface CountResponse {
  dealer: number;
  particulares: number;
}

export interface MapConfig {
  lat: string;
  lon: string;
  label: string;
}
