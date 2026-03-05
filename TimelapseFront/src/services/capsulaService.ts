const API_BASE = '/api'

// ── Tipos ─────────────────────────────────────────────────────────────────────

export interface Capsula {
  idCapsula: number
  titulo: string
  descripcion: string
  fechaCreacion: string
  fechaApertura: string
  estado: string
  visibilidad: string
  emoji?: string
}

export interface CrearCapsulaPayload {
  titulo: string
  descripcion: string
  fechaCreacion: string
  fechaApertura: string
  estado: string
  visibilidad: string
}

export interface UsuarioCapsulaPayload {
  idUsuario: number
  idCapsula: number
  rol: string
}

// ── Cápsulas ──────────────────────────────────────────────────────────────────

export async function getCapsulas(): Promise<Capsula[]> {
  const res = await fetch(`${API_BASE}/Capsula`)
  if (!res.ok) throw new Error('Error al obtener cápsulas')
  return res.json()
}

export async function getCapsula(id: number): Promise<Capsula> {
  const res = await fetch(`${API_BASE}/Capsula/${id}`)
  if (!res.ok) throw new Error('Error al obtener la cápsula')
  return res.json()
}

export async function crearCapsula(payload: CrearCapsulaPayload): Promise<Capsula> {
  const res = await fetch(`${API_BASE}/Capsula`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  })
  if (!res.ok) throw new Error('Error al crear la cápsula')
  return res.json()
}

// ── Contenido (archivos) ──────────────────────────────────────────────────────

export async function subirArchivo(
  idCapsula: number,
  tipo: string,
  archivo: File
): Promise<void> {
  const formData = new FormData()
  formData.append('IdCapsula', String(idCapsula))
  formData.append('Tipo', tipo)
  formData.append('Archivo', archivo)

  const res = await fetch(`${API_BASE}/Contenido/archivo`, {
    method: 'POST',
    body: formData
  })
  if (!res.ok) throw new Error(`Error al subir el archivo: ${archivo.name}`)
}

// ── Participantes (UsuarioCapsula) ────────────────────────────────────────────

export async function añadirParticipante(
  idUsuario: number,
  idCapsula: number,
  rol = 'participante'
): Promise<void> {
  const res = await fetch(`${API_BASE}/UsuarioCapsula`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ idUsuario, idCapsula, rol } as UsuarioCapsulaPayload)
  })
  if (!res.ok) throw new Error('Error al añadir participante')
}

// ── Usuarios (búsqueda por nombre) ───────────────────────────────────────────

export interface Usuario {
  idUsuario: number
  nombre: string
  email: string
}

export async function buscarUsuarios(nombre: string): Promise<Usuario[]> {
  const res = await fetch(`${API_BASE}/Usuario/search?nombre=${encodeURIComponent(nombre)}`)
  if (!res.ok) throw new Error('Error al buscar usuarios')
  return res.json()
}