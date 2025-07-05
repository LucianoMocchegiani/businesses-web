import { ApiError } from '@/types/api'

class ApiService {
  private baseURL: string
  private defaultHeaders: Record<string, string>
  private onTokenExpired?: () => void

  constructor() {
    this.baseURL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api'
    this.defaultHeaders = {
      'Content-Type': 'application/json',
    }
  }

  // Método para configurar el callback cuando el token expira
  setTokenExpiredHandler(handler: () => void) {
    this.onTokenExpired = handler
  }

  private getHeaders(customHeaders?: Record<string, string>): Record<string, string> {
    const headers = { ...this.defaultHeaders, ...customHeaders }
    
    const token = localStorage.getItem('authToken')
    if (token) {
      headers.Authorization = `Bearer ${token}`
    }

    // Agregar headers de contexto de negocio automáticamente
    const selectedBusinessId = localStorage.getItem('selectedBusinessId')
    const selectedProfileId = localStorage.getItem('selectedProfileId')
    
    if (selectedBusinessId) {
      headers['x-business-id'] = selectedBusinessId
    }
    
    if (selectedProfileId) {
      headers['x-profile-id'] = selectedProfileId
    }
    
    return headers
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    const contentType = response.headers.get('content-type')
    let data: any

    if (contentType && contentType.includes('application/json')) {
      data = await response.json()
    } else {
      data = await response.text()
    }

    if (!response.ok) {
      // Si el token ha expirado o no es válido (401 o 403 con mensaje de auth)
      if (response.status === 401 || 
          (response.status === 403 && (
            data.message?.includes('Usuario no especificado') ||
            data.message?.includes('Token') ||
            data.message?.includes('autenticación')
          ))) {
        console.warn('Token expirado o inválido, redirigiendo al login...')
        
        // Limpiar datos de autenticación
        localStorage.removeItem('authToken')
        localStorage.removeItem('firebaseUid')
        localStorage.removeItem('selectedBusinessId')
        localStorage.removeItem('auth')
        localStorage.removeItem('user')
        
        // Ejecutar el handler de expiración de token si está definido
        if (this.onTokenExpired) {
          this.onTokenExpired()
        } else {
          // Redirigir al login por defecto si no hay handler configurado
          window.location.href = '/login'
        }
        
        // Lanzar error específico para la UI
        const authError: ApiError = {
          message: 'Sesión expirada. Por favor, inicia sesión nuevamente.',
          status: 401,
          code: 'TOKEN_EXPIRED',
        }
        throw authError
      }

      const apiError: ApiError = {
        message: data.message || `HTTP ${response.status}: ${response.statusText}`,
        status: response.status,
        code: data.code,
      }
      throw apiError
    }

    // Si la respuesta tiene la estructura ApiResponse<T>, extraer data
    if (data && typeof data === 'object' && 'data' in data) {
      return data.data
    }
    
    return data
  }

  async get<T>(url: string): Promise<T> {
    const response = await fetch(`${this.baseURL}${url}`, {
      method: 'GET',
      headers: this.getHeaders(),
    })
    return this.handleResponse<T>(response)
  }

  async post<T>(url: string, data?: any): Promise<T> {
    const headers = this.getHeaders()
    const body = data ? JSON.stringify(data) : undefined

    const response = await fetch(`${this.baseURL}${url}`, {
      method: 'POST',
      headers,
      body,
    })
    return this.handleResponse<T>(response)
  }

  async put<T>(url: string, data?: any): Promise<T> {
    const headers = this.getHeaders()
    const body = data ? JSON.stringify(data) : undefined

    const response = await fetch(`${this.baseURL}${url}`, {
      method: 'PUT',
      headers,
      body,
    })
    return this.handleResponse<T>(response)
  }

  async delete<T>(url: string): Promise<T> {
    const response = await fetch(`${this.baseURL}${url}`, {
      method: 'DELETE',
      headers: this.getHeaders(),
    })
    return this.handleResponse<T>(response)
  }
}

export const apiService = new ApiService()
