/**
 * Utilidades para manejo de fechas y timestamps
 * Estandariza la conversión entre fechas y timestamps en toda la aplicación
 */

export type Timestamp = number; // Unix timestamp en milisegundos

/**
 * Convierte una fecha a timestamp (milisegundos desde epoch)
 */
export const dateToTimestamp = (date: Date | string | null | undefined): Timestamp | null => {
  if (!date) return null;
  
  if (typeof date === 'string') {
    return new Date(date).getTime();
  }
  
  if (date instanceof Date) {
    return date.getTime();
  }
  
  return null;
};

/**
 * Convierte un timestamp a objeto Date
 */
export const timestampToDate = (timestamp: Timestamp | null | undefined): Date | null => {
  if (!timestamp) return null;
  return new Date(timestamp);
};

/**
 * Convierte un timestamp a string ISO
 */
export const timestampToISOString = (timestamp: Timestamp | null | undefined): string | null => {
  if (!timestamp) return null;
  return new Date(timestamp).toISOString();
};

/**
 * Convierte un timestamp a string de fecha local
 */
export const timestampToLocalDateString = (timestamp: Timestamp | null | undefined): string | null => {
  if (!timestamp) return null;
  return new Date(timestamp).toLocaleDateString();
};

/**
 * Convierte un timestamp a string de fecha y hora local
 */
export const timestampToLocalDateTimeString = (timestamp: Timestamp | null | undefined): string | null => {
  if (!timestamp) return null;
  return new Date(timestamp).toLocaleString();
};

/**
 * Convierte un timestamp a string de fecha y hora local con zona horaria específica
 */
export const timestampToLocalDateTimeStringWithTimezone = (
  timestamp: Timestamp | null | undefined,
  timezone?: string
): string | null => {
  if (!timestamp) return null;
  
  try {
    return new Date(timestamp).toLocaleString('es-ES', {
      timeZone: timezone || Intl.DateTimeFormat().resolvedOptions().timeZone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  } catch (error) {
    // Fallback si la zona horaria no es válida
    return new Date(timestamp).toLocaleString();
  }
};

/**
 * Obtiene la zona horaria del usuario
 */
export const getUserTimezone = (): string => {
  return Intl.DateTimeFormat().resolvedOptions().timeZone;
};

/**
 * Convierte un timestamp a fecha local para inputs de fecha
 */
export const timestampToLocalDateInput = (timestamp: Timestamp | null | undefined): string | null => {
  if (!timestamp) return null;
  
  const date = new Date(timestamp);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  
  return `${year}-${month}-${day}`;
};

/**
 * Obtiene el timestamp actual
 */
export const getCurrentTimestamp = (): Timestamp => {
  return Date.now();
};

/**
 * Formatea un timestamp para mostrar tiempo relativo (ej: "2 horas atrás")
 */
export const formatTimeAgo = (timestamp: Timestamp | null | undefined): string => {
  if (!timestamp) return 'N/A';
  
  const now = getCurrentTimestamp();
  const diffInMs = now - timestamp;
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
  const diffInDays = Math.floor(diffInHours / 24);

  if (diffInMinutes < 1) {
    return 'Justo ahora';
  } else if (diffInMinutes < 60) {
    return `${diffInMinutes} minuto${diffInMinutes > 1 ? 's' : ''} atrás`;
  } else if (diffInHours < 24) {
    return `${diffInHours} hora${diffInHours > 1 ? 's' : ''} atrás`;
  } else {
    return `${diffInDays} día${diffInDays > 1 ? 's' : ''} atrás`;
  }
};

/**
 * Valida si un valor es un timestamp válido
 */
export const isValidTimestamp = (value: any): value is Timestamp => {
  return typeof value === 'number' && !isNaN(value) && value > 0;
};

/**
 * Convierte un objeto con fechas a timestamps
 */
export const convertObjectDatesToTimestamps = <T extends Record<string, any>>(
  obj: T,
  dateFields: (keyof T)[]
): T => {
  const result = { ...obj } as any;
  
  dateFields.forEach(field => {
    if (field in result && result[field] !== null && result[field] !== undefined) {
      const timestamp = dateToTimestamp(result[field]);
      if (timestamp !== null) {
        result[field] = timestamp;
      }
    }
  });
  
  return result as T;
};

/**
 * Convierte un objeto con timestamps a fechas
 */
export const convertObjectTimestampsToDates = <T extends Record<string, any>>(
  obj: T,
  timestampFields: (keyof T)[]
): T => {
  const result = { ...obj } as any;
  
  timestampFields.forEach(field => {
    if (field in result && result[field] !== null && result[field] !== undefined) {
      const date = timestampToDate(result[field]);
      if (date !== null) {
        result[field] = date;
      }
    }
  });
  
  return result as T;
}; 