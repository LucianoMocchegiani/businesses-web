import { ApiError } from '@/types/api'

class ApiService {
  private baseURL: string
  private defaultHeaders: Record<string, string>

  constructor() {
    this.baseURL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api'
    this.defaultHeaders = {
      'Content-Type': 'application/json',
    }
  }

  private getHeaders(customHeaders?: Record<string, string>): Record<string, string> {
    const headers = { ...this.defaultHeaders, ...customHeaders }
    
    const token = localStorage.getItem('authToken')
    if (token) {
      headers.Authorization = `Bearer ${token}`
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
