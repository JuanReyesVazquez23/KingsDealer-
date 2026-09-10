import type { Vehicle, CountResponse, MapConfig } from './types';

export async function fetchVehicles(tipo?: string): Promise<Vehicle[]> {
  const url = tipo ? `/api/vehiculos?tipo=${encodeURIComponent(tipo)}` : '/api/vehiculos';
  const res = await fetch(url);
  if (!res.ok) throw new Error();
  return res.json();
}

export async function fetchParticulares(): Promise<Vehicle[]> {
  const res = await fetch('/api/particulares');
  if (!res.ok) throw new Error();
  return res.json();
}

export async function fetchOfertas(): Promise<Vehicle[]> {
  const res = await fetch('/api/ofertas');
  if (!res.ok) return [];
  return res.json();
}

export async function fetchCount(): Promise<CountResponse> {
  const res = await fetch('/api/count');
  if (!res.ok) throw new Error();
  return res.json();
}

export async function fetchMapConfig(): Promise<MapConfig> {
  const res = await fetch('/api/config/mapa');
  return res.json();
}

export async function saveMapConfig(lat: string, lon: string, label: string): Promise<boolean> {
  const res = await fetch('/api/config/mapa', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ lat, lon, label }),
  });
  return res.ok;
}

export async function deleteVehicleApi(id: number): Promise<boolean> {
  const res = await fetch(`/api/vehiculos/${id}`, { method: 'DELETE' });
  return res.ok;
}

export async function saveVehicle(editingId: number | null, formData: FormData): Promise<{ ok: boolean; error?: string }> {
  const isEdit = editingId !== null;
  const res = await fetch(
    isEdit ? `/api/vehiculos/${editingId}` : '/api/vehiculos',
    { method: isEdit ? 'PUT' : 'POST', body: formData }
  );
  const data = await res.json();
  return { ok: res.ok, error: data.error };
}

export async function fetchAnuncios(estado?: string): Promise<unknown[]> {
  const url = estado ? `/api/anuncios?estado=${estado}` : '/api/anuncios';
  const res = await fetch(url);
  return res.json();
}

export async function cambiarEstadoAnuncioApi(id: number, estado: string): Promise<void> {
  await fetch(`/api/anuncios/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ estado }),
  });
}

export async function eliminarAnuncioApi(id: number): Promise<void> {
  await fetch(`/api/anuncios/${id}`, { method: 'DELETE' });
}

export async function submitAnuncioApi(formData: FormData): Promise<{ ok: boolean; error?: string }> {
  const res = await fetch('/api/anuncios', { method: 'POST', body: formData });
  const data = await res.json();
  return { ok: res.ok, error: data.error };
}
