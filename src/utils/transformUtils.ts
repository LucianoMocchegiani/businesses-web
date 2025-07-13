/**
 * Utilidades para transformar entre camelCase y snake_case
 * Útil para la comunicación entre frontend (camelCase) y backend (snake_case)
 */

/**
 * Convierte una cadena de camelCase a snake_case
 * Ejemplo: "includeStock" -> "include_stock"
 */
export const camelToSnake = (str: string): string => {
  return str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
};

/**
 * Convierte una cadena de snake_case a camelCase
 * Ejemplo: "include_stock" -> "includeStock"
 */
export const snakeToCamel = (str: string): string => {
  return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
};

/**
 * Convierte las claves de un objeto de camelCase a snake_case
 * Útil para enviar datos al backend
 */
export const transformKeysToSnake = <T extends Record<string, any>>(obj: T): Record<string, any> => {
  const transformed: Record<string, any> = {};
  
  for (const [key, value] of Object.entries(obj)) {
    const snakeKey = camelToSnake(key);
    
    if (value && typeof value === 'object' && !Array.isArray(value) && !(value instanceof Date)) {
      // Recursivamente transformar objetos anidados
      transformed[snakeKey] = transformKeysToSnake(value);
    } else if (Array.isArray(value)) {
      // Transformar arrays de objetos
      transformed[snakeKey] = value.map(item => 
        item && typeof item === 'object' && !(item instanceof Date) 
          ? transformKeysToSnake(item) 
          : item
      );
    } else {
      transformed[snakeKey] = value;
    }
  }
  
  return transformed;
};

/**
 * Convierte las claves de un objeto de snake_case a camelCase
 * Útil para procesar respuestas del backend
 */
export const transformKeysToCamel = <T extends Record<string, any>>(obj: T): Record<string, any> => {
  const transformed: Record<string, any> = {};
  
  for (const [key, value] of Object.entries(obj)) {
    const camelKey = snakeToCamel(key);
    
    if (value && typeof value === 'object' && !Array.isArray(value) && !(value instanceof Date)) {
      // Recursivamente transformar objetos anidados
      transformed[camelKey] = transformKeysToCamel(value);
    } else if (Array.isArray(value)) {
      // Transformar arrays de objetos
      transformed[camelKey] = value.map(item => 
        item && typeof item === 'object' && !(item instanceof Date) 
          ? transformKeysToCamel(item) 
          : item
      );
    } else {
      transformed[camelKey] = value;
    }
  }
  
  return transformed;
};

/**
 * Convierte parámetros de query de camelCase a snake_case
 * Específico para URLs y query parameters
 */
export const transformQueryParams = (params: Record<string, any>): Record<string, any> => {
  const transformed: Record<string, any> = {};
  
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null) {
      const snakeKey = camelToSnake(key);
      transformed[snakeKey] = value;
    }
  }
  
  return transformed;
};

/**
 * Mapeo específico para parámetros de productos
 * Maneja casos especiales que no siguen el patrón estándar
 */
export const mapProductQueryParams = (params: Record<string, any>): Record<string, any> => {
  const paramMapping: Record<string, string> = {
    // Mapeos específicos si hay casos especiales
    'includeStock': 'include_stock',
    'onlyLowStock': 'only_low_stock',
    'includeGlobal': 'include_global',
    'includeBusiness': 'include_business',
    'onlyWithInventory': 'only_with_inventory',
    'isActive': 'is_active',
    // Otros campos que no necesitan transformación
    'name': 'name',
    'barcode': 'barcode',
    'category': 'category',
    'page': 'page',
    'limit': 'limit',
  };

  const transformed: Record<string, any> = {};
  
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null) {
      const mappedKey = paramMapping[key] || camelToSnake(key);
      transformed[mappedKey] = value;
    }
  }
  
  return transformed;
};

/**
 * Mapeo específico para parámetros de ventas
 * Maneja casos especiales que no siguen el patrón estándar
 */
export const mapSaleQueryParams = (params: Record<string, any>): Record<string, any> => {
  const paramMapping: Record<string, string> = {
    // Mapeos específicos para sales
    'customerName': 'customer_name',
    'totalAmount': 'total_amount',
    'createdAt': 'created_at',
    'updatedAt': 'updated_at',
    // Campos de ordenamiento
    'orderBy': 'orderBy', // Se maneja especialmente
    'orderDirection': 'orderDirection',
    // Otros campos que no necesitan transformación
    'page': 'page',
    'limit': 'limit',
    'status': 'status',
  };

  const transformed: Record<string, any> = {};
  
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null) {
      if (key === 'orderBy') {
        // Transformar el valor de orderBy también
        const orderByMapping: Record<string, string> = {
          'customerName': 'customer_name',
          'totalAmount': 'total_amount',
          'createdAt': 'created_at',
          'updatedAt': 'updated_at',
          'status': 'status',
        };
        transformed[key] = orderByMapping[value as string] || value;
      } else {
        const mappedKey = paramMapping[key] || camelToSnake(key);
        transformed[mappedKey] = value;
      }
    }
  }
  
  return transformed;
};

/**
 * Mapeo específico para datos de creación de ventas
 * Transforma la estructura del frontend al formato esperado por el backend
 */
export const mapCreateSaleData = (data: any): any => {
  const transformed: any = {
    // Campos principales
    customer_id: data.customerId ? parseInt(data.customerId) : null,
    total_amount: data.totalAmount || null,
    status: data.status || 'PENDING',
    // Transformar saleDetails
    saleDetails: data.saleDetails?.map((detail: any) => ({
      // Determinar si es producto global o de negocio basado en el ID
      business_product_id: detail.productId?.startsWith('business-') 
        ? parseInt(detail.productId.replace('business-', '')) 
        : null,
      global_product_id: detail.productId?.startsWith('global-') 
        ? parseInt(detail.productId.replace('global-', '')) 
        : null,
      quantity: detail.quantity,
      price: detail.price,
      total_amount: detail.totalAmount || (detail.quantity * detail.price),
    })) || []
  };

  return transformed;
};

/**
 * Mapeo específico para transformar respuestas de ventas del backend
 * Convierte de snake_case a camelCase y ajusta la estructura
 */
export const mapSaleResponse = (data: any): any => {
  if (!data) return data;
  
  const transformed = transformKeysToCamel(data);
  
  // Ajustes específicos para ventas si es necesario
  if (transformed.saleDetails) {
    transformed.saleDetails = transformed.saleDetails.map((detail: any) => ({
      ...detail,
      // Reconstruir productId compuesto si es necesario
      productId: detail.businessProductId 
        ? `business-${detail.businessProductId}`
        : detail.globalProductId 
          ? `global-${detail.globalProductId}`
          : detail.productId
    }));
  }
  
  return transformed;
};

/**
 * Mapeo específico para parámetros de compras
 * Similar a sales pero para el módulo de purchases
 */
export const mapPurchaseQueryParams = (params: Record<string, any>): Record<string, any> => {
  const paramMapping: Record<string, string> = {
    // Mapeos específicos para purchases
    'supplierName': 'supplier_name',
    'totalAmount': 'total_amount',
    'createdAt': 'created_at',
    'updatedAt': 'updated_at',
    'purchaseDate': 'purchase_date',
    'actualDeliveryDate': 'actual_delivery_date',
    'invoiceNumber': 'invoice_number',
    // Campos de ordenamiento
    'orderBy': 'orderBy', // Se maneja especialmente
    'orderDirection': 'orderDirection',
    // Otros campos que no necesitan transformación
    'page': 'page',
    'limit': 'limit',
    'status': 'status',
  };

  const transformed: Record<string, any> = {};
  
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null) {
      if (key === 'orderBy') {
        // Transformar el valor de orderBy también
        const orderByMapping: Record<string, string> = {
          'supplierName': 'supplier_name',
          'totalAmount': 'total_amount',
          'createdAt': 'created_at',
          'updatedAt': 'updated_at',
          'purchaseDate': 'purchase_date',
          'actualDeliveryDate': 'actual_delivery_date',
          'status': 'status',
        };
        transformed[key] = orderByMapping[value as string] || value;
      } else {
        const mappedKey = paramMapping[key] || camelToSnake(key);
        transformed[mappedKey] = value;
      }
    }
  }
  
  return transformed;
};

/**
 * Mapeo específico para datos de creación de compras
 * Transforma la estructura del frontend al formato esperado por el backend
 */
export const mapCreatePurchaseData = (data: any): any => {
  const transformed: any = {
    // Campos principales
    supplier_id: data.supplierId ? parseInt(data.supplierId) : null,
    total_amount: data.totalAmount || null,
    status: data.status || 'PENDING',
    purchase_date: data.purchaseDate || null,
    actual_delivery_date: data.actualDeliveryDate || null,
    received_by: data.receivedBy || null,
    invoice_number: data.invoiceNumber || null,
    // Transformar purchaseDetails
    purchaseDetails: data.purchaseDetails?.map((detail: any) => ({
      // Determinar si es producto global o de negocio basado en el ID
      business_product_id: detail.productId?.startsWith('business-') 
        ? parseInt(detail.productId.replace('business-', '')) 
        : null,
      global_product_id: detail.productId?.startsWith('global-') 
        ? parseInt(detail.productId.replace('global-', '')) 
        : null,
      quantity: detail.quantity,
      quantity_received: detail.quantityReceived || detail.quantity,
      price: detail.price,
      total_amount: detail.totalAmount || (detail.quantity * detail.price),
      lot_number: detail.lotNumber || null,
      entry_date: detail.entryDate || null,
      expiration_date: detail.expirationDate || null,
      quality_check: detail.qualityCheck || 'PENDING',
      quality_notes: detail.qualityNotes || null,
      warehouse_location: detail.warehouseLocation || null,
    })) || []
  };

  return transformed;
};

/**
 * Mapeo específico para transformar respuestas de compras del backend
 * Convierte de snake_case a camelCase y ajusta la estructura
 */
export const mapPurchaseResponse = (data: any): any => {
  if (!data) return data;
  
  const transformed = transformKeysToCamel(data);
  
  // Ajustes específicos para compras si es necesario
  if (transformed.purchaseDetails) {
    transformed.purchaseDetails = transformed.purchaseDetails.map((detail: any) => ({
      ...detail,
      // Reconstruir productId compuesto si es necesario
      productId: detail.businessProductId 
        ? `business-${detail.businessProductId}`
        : detail.globalProductId 
          ? `global-${detail.globalProductId}`
          : detail.productId
    }));
  }
  
  return transformed;
};

/**
 * Tipo helper para inferir el tipo transformado
 */
export type TransformKeys<T> = {
  [K in keyof T as K extends string ? CamelToSnake<K> : K]: T[K];
};

/**
 * Tipo helper para convertir string de camelCase a snake_case a nivel de tipos
 */
type CamelToSnake<S extends string> = S extends `${infer T}${infer U}`
  ? `${T extends Capitalize<T> ? "_" : ""}${Lowercase<T>}${CamelToSnake<U>}`
  : S; 