const BASE_URL = '/api' //Cambiar cuando toque

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers
    },
    ...options
  })

  if (!response.ok) {
    // Intentamos leer el mensaje de error de la API
    let errorMsg = `Error ${response.status}`
    try {
      const data = await response.json()
      errorMsg = data.mensaje ?? data.message ?? errorMsg
    } catch {
      // Si no hay JSON ignoramos
    }
    throw new Error(errorMsg)
  }

  // 204 No Content no tiene body
  if (response.status === 204) return undefined as T

  return response.json() as Promise<T>
}

export const api = {
  get: <T>(endpoint: string) => request<T>(endpoint),
  post: <T>(endpoint: string, body: unknown) =>
    request<T>(endpoint, { method: 'POST', body: JSON.stringify(body) }),
  put: <T>(endpoint: string, body: unknown) =>
    request<T>(endpoint, { method: 'PUT', body: JSON.stringify(body) }),
  delete: <T>(endpoint: string) =>
    request<T>(endpoint, { method: 'DELETE' })
}