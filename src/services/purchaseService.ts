import { apiService } from './apiService';
import { PurchaseEntity, PurchaseStatus } from '@/types/business';
import { inventoryIntegrationService } from './inventoryIntegrationService';
import { 
  LotCreationData, 
  PurchaseStatus as FormPurchaseStatus 
} from '@/screens/business/purchases/types';

export interface CreatePurchaseRequest {
  businessId: string;
  supplierId?: string;
  supplierName?: string;
  totalAmount?: number;
  status?: PurchaseStatus;
  purchaseDetails: {
    productId: string;
    productName: string;
    quantity: number;
    price: number;
    totalAmount?: number;
    lotNumber?: string;
    entryDate?: string;
    expirationDate?: string;
  }[];
}

export interface UpdatePurchaseRequest extends Partial<CreatePurchaseRequest> {
  id: string;
  // Nuevos campos para recepción
  actualDeliveryDate?: string;
  receivedBy?: string;
  invoiceNumber?: string;
}

export interface GetPurchasesParams {
  businessId: string;
  page?: number;
  limit?: number;
  orderBy?: 'supplierName' | 'totalAmount' | 'status' | 'createdAt' | 'updatedAt';
  orderDirection?: 'asc' | 'desc';
  supplierName?: string;
  totalAmount?: number;
  status?: PurchaseStatus;
  createdAt?: string;
  updatedAt?: string;
}

export interface PurchasesResponse {
  data: PurchaseEntity[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface ReceivePurchaseRequest {
  purchaseId: string;
  receivedBy: string;
  actualDeliveryDate: Date;
  purchaseDetails: {
    productId: string;
    quantityReceived: number;
    qualityCheck?: 'APPROVED' | 'REJECTED' | 'PARTIALLY_APPROVED';
    qualityNotes?: string;
    lotNumber?: string;
    expirationDate?: Date;
    warehouseLocation?: string;
  }[];
  generalNotes?: string;
}

class PurchaseService {
  private readonly endpoint = '/purchases';

  async getAll(params: GetPurchasesParams): Promise<PurchasesResponse> {
    try {
      // In a real implementation, this would call the backend API
      const response = await apiService.get<PurchasesResponse>(`${this.endpoint}?${new URLSearchParams(params as any).toString()}`);
      return response;
    } catch (error) {
      console.error('Error fetching purchases:', error);
      // Mock data for development
      return this.getMockPurchases(params);
    }
  }

  async getById(id: string): Promise<PurchaseEntity> {
    try {
      const response = await apiService.get<PurchaseEntity>(`${this.endpoint}/${id}`);
      return response;
    } catch (error) {
      console.error('Error fetching purchase:', error);
      // Mock data for development
      return this.getMockPurchaseById(id);
    }
  }

  async create(data: CreatePurchaseRequest): Promise<PurchaseEntity> {
    try {
      const response = await apiService.post<PurchaseEntity>(this.endpoint, data);
      return response;
    } catch (error) {
      console.error('Error creating purchase:', error);
      // Mock implementation for development
      return this.createMockPurchase(data);
    }
  }

  async update(data: UpdatePurchaseRequest): Promise<PurchaseEntity> {
    try {
      const response = await apiService.put<PurchaseEntity>(`${this.endpoint}/${data.id}`, data);
      return response;
    } catch (error) {
      console.error('Error updating purchase:', error);
      // Mock implementation for development
      return this.updateMockPurchase(data);
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await apiService.delete(`${this.endpoint}/${id}`);
    } catch (error) {
      console.error('Error deleting purchase:', error);
      // Mock implementation for development
      console.log('Mock: Purchase deleted successfully');
    }
  }

  async cancel(id: string): Promise<PurchaseEntity> {
    try {
      const response = await apiService.post<PurchaseEntity>(`${this.endpoint}/${id}/cancel`);
      return response;
    } catch (error) {
      console.error('Error canceling purchase:', error);
      // Mock implementation for development
      return this.cancelMockPurchase(id);
    }
  }

  // Recibir mercadería y actualizar inventario
  async receivePurchase(request: ReceivePurchaseRequest): Promise<PurchaseEntity> {
    try {
      console.log('Receiving purchase:', request.purchaseId);
      
      // 1. Actualizar estado de la compra
      const updatedPurchase = await this.update({
        id: request.purchaseId,
        status: 'RECEIVED',
        actualDeliveryDate: request.actualDeliveryDate.toISOString(),
        receivedBy: request.receivedBy
      });
      
      // 2. Crear datos de lotes para inventario
      const lotData: LotCreationData[] = request.purchaseDetails.map(detail => ({
        productId: detail.productId,
        lotNumber: detail.lotNumber || this.generateLotNumber(detail.productId),
        quantity: detail.quantityReceived,
        unitCost: this.getProductCostFromPurchase(request.purchaseId, detail.productId),
        entryDate: request.actualDeliveryDate,
        expirationDate: detail.expirationDate,
        supplierId: updatedPurchase.supplierId || '',
        purchaseId: request.purchaseId,
        location: detail.warehouseLocation
      }));
      
      // 3. Crear lotes en inventario
      const createdLots = await inventoryIntegrationService.createLotsFromPurchase(
        request.purchaseId,
        lotData
      );
      
      // 4. Actualizar stock de productos
      const uniqueProductIds = [...new Set(lotData.map(lot => lot.productId))];
      for (const productId of uniqueProductIds) {
        await inventoryIntegrationService.updateProductStock(productId);
      }
      
      console.log(`Purchase ${request.purchaseId} received successfully. Created ${createdLots.length} lots.`);
      
      return updatedPurchase;
      
    } catch (error) {
      console.error('Error receiving purchase:', error);
      throw new Error('Failed to receive purchase');
    }
  }
  
  // Actualizar estado a "En tránsito"
  async markAsInTransit(purchaseId: string): Promise<PurchaseEntity> {
    return this.update({
      id: purchaseId,
      status: 'IN_TRANSIT'
    });
  }
  
  // Completar purchase después de facturación
  async completePurchase(purchaseId: string, invoiceNumber?: string): Promise<PurchaseEntity> {
    return this.update({
      id: purchaseId,
      status: 'COMPLETED',
      invoiceNumber
    });
  }
  
  // Obtener purchases por estado
  async getPurchasesByStatus(params: { businessId: string; status: FormPurchaseStatus }): Promise<PurchasesResponse> {
    return this.getAll({
      ...params,
      status: params.status as PurchaseStatus
    });
  }
  
  // Verificar si una purchase puede ser recibida
  canBeReceived(purchase: PurchaseEntity): boolean {
    return ['ORDERED', 'IN_TRANSIT'].includes(purchase.status);
  }
  
  // Métodos auxiliares privados
  private generateLotNumber(productId: string): string {
    const date = new Date();
    const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '');
    const productCode = productId.slice(-4).toUpperCase();
    const random = Math.random().toString(36).substr(2, 4).toUpperCase();
    
    return `LOT${dateStr}${productCode}${random}`;
  }
  
  private getProductCostFromPurchase(purchaseId: string, productId: string): number {
    try {
      const purchase = this.getMockPurchaseById(purchaseId);
      const detail = purchase.purchaseDetails.find(d => d.productId === productId);
      return detail?.price || 0;
    } catch {
      return 0;
    }
  }

  // Mock data methods for development
  private getMockPurchases(params: GetPurchasesParams): PurchasesResponse {
    const mockPurchases: PurchaseEntity[] = [
      {
        id: '1',
        businessId: params.businessId,
        supplierId: '1',
        supplierName: 'TechDistribuidor S.A.',
        totalAmount: 2500.00,
        status: 'COMPLETED',
        createdAt: '2024-01-15T08:30:00Z',
        updatedAt: '2024-01-15T08:30:00Z',
        purchaseDetails: [
          {
            id: '1',
            purchaseId: '1',
            productId: '1',
            productName: 'Laptop Dell Inspiron',
            quantity: 5,
            price: 450.00,
            totalAmount: 2250.00,
            lotNumber: 'LOT-2024-001',
            entryDate: '2024-01-15T08:30:00Z',
            expirationDate: '2026-01-15T00:00:00Z'
          },
          {
            id: '2',
            purchaseId: '1',
            productId: '2',
            productName: 'Mouse Inalámbrico',
            quantity: 10,
            price: 25.00,
            totalAmount: 250.00,
            lotNumber: 'LOT-2024-002',
            entryDate: '2024-01-15T08:30:00Z'
          }
        ]
      },
      {
        id: '2',
        businessId: params.businessId,
        supplierId: '2',
        supplierName: 'Componentes Pro',
        totalAmount: 850.00,
        status: 'PENDING',
        createdAt: '2024-01-14T14:20:00Z',
        updatedAt: '2024-01-14T14:20:00Z',
        purchaseDetails: [
          {
            id: '3',
            purchaseId: '2',
            productId: '3',
            productName: 'Teclado Mecánico',
            quantity: 15,
            price: 45.00,
            totalAmount: 675.00,
            lotNumber: 'LOT-2024-003',
            entryDate: '2024-01-14T14:20:00Z'
          },
          {
            id: '4',
            purchaseId: '2',
            productId: '4',
            productName: 'Monitor 24"',
            quantity: 1,
            price: 175.00,
            totalAmount: 175.00,
            lotNumber: 'LOT-2024-004',
            entryDate: '2024-01-14T14:20:00Z'
          }
        ]
      },
      {
        id: '3',
        businessId: params.businessId,
        supplierId: '3',
        supplierName: 'ElectroSuministros',
        totalAmount: 320.75,
        status: 'COMPLETED',
        createdAt: '2024-01-13T11:45:00Z',
        updatedAt: '2024-01-13T11:45:00Z',
        purchaseDetails: [
          {
            id: '5',
            purchaseId: '3',
            productId: '5',
            productName: 'Cable HDMI 2m',
            quantity: 25,
            price: 12.83,
            totalAmount: 320.75,
            lotNumber: 'LOT-2024-005',
            entryDate: '2024-01-13T11:45:00Z'
          }
        ]
      },
      {
        id: '4',
        businessId: params.businessId,
        supplierName: 'Compra sin proveedor registrado',
        totalAmount: 180.00,
        status: 'COMPLETED',
        createdAt: '2024-01-12T16:30:00Z',
        updatedAt: '2024-01-12T16:30:00Z',
        purchaseDetails: [
          {
            id: '6',
            purchaseId: '4',
            productId: '6',
            productName: 'Auriculares Bluetooth',
            quantity: 6,
            price: 30.00,
            totalAmount: 180.00,
            lotNumber: 'LOT-2024-006',
            entryDate: '2024-01-12T16:30:00Z'
          }
        ]
      }
    ];

    // Apply filters
    let filteredPurchases = mockPurchases;
    
    if (params.supplierName) {
      filteredPurchases = filteredPurchases.filter(purchase => 
        purchase.supplierName?.toLowerCase().includes(params.supplierName!.toLowerCase())
      );
    }
    
    if (params.status) {
      filteredPurchases = filteredPurchases.filter(purchase => purchase.status === params.status);
    }
    
    if (params.totalAmount) {
      filteredPurchases = filteredPurchases.filter(purchase => purchase.totalAmount === params.totalAmount);
    }

    // Apply sorting
    const sortField = params.orderBy || 'createdAt';
    const sortDirection = params.orderDirection || 'desc';
    
    filteredPurchases.sort((a, b) => {
      let aValue: any, bValue: any;
      
      switch (sortField) {
        case 'supplierName':
          aValue = a.supplierName || '';
          bValue = b.supplierName || '';
          break;
        case 'totalAmount':
          aValue = a.totalAmount;
          bValue = b.totalAmount;
          break;
        case 'status':
          aValue = a.status;
          bValue = b.status;
          break;
        case 'updatedAt':
          aValue = new Date(a.updatedAt);
          bValue = new Date(b.updatedAt);
          break;
        default: // createdAt
          aValue = new Date(a.createdAt);
          bValue = new Date(b.createdAt);
      }
      
      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    // Apply pagination
    const page = params.page || 1;
    const limit = params.limit || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedPurchases = filteredPurchases.slice(startIndex, endIndex);

    return {
      data: paginatedPurchases,
      meta: {
        total: filteredPurchases.length,
        page,
        limit,
        totalPages: Math.ceil(filteredPurchases.length / limit)
      }
    };
  }

  private getMockPurchaseById(id: string): PurchaseEntity {
    const mockPurchases = this.getMockPurchases({ businessId: 'mock-business' });
    const purchase = mockPurchases.data.find(p => p.id === id);
    if (!purchase) {
      throw new Error(`Purchase with id ${id} not found`);
    }
    return purchase;
  }

  private createMockPurchase(data: CreatePurchaseRequest): PurchaseEntity {
    const newPurchase: PurchaseEntity = {
      id: Math.random().toString(36).substr(2, 9),
      businessId: data.businessId,
      supplierId: data.supplierId,
      supplierName: data.supplierName || '',
      totalAmount: data.totalAmount || data.purchaseDetails.reduce((sum, detail) => sum + (detail.totalAmount || detail.quantity * detail.price), 0),
      status: data.status || 'PENDING',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      purchaseDetails: data.purchaseDetails.map(detail => ({
        id: Math.random().toString(36).substr(2, 9),
        purchaseId: '', // Will be set after purchase creation
        productId: detail.productId,
        productName: detail.productName,
        quantity: detail.quantity,
        price: detail.price,
        totalAmount: detail.totalAmount || detail.quantity * detail.price,
        lotNumber: detail.lotNumber,
        entryDate: detail.entryDate || new Date().toISOString(),
        expirationDate: detail.expirationDate
      }))
    };

    // Update purchaseId in details
    newPurchase.purchaseDetails.forEach(detail => {
      detail.purchaseId = newPurchase.id;
    });

    return newPurchase;
  }

  private updateMockPurchase(data: UpdatePurchaseRequest): PurchaseEntity {
    // In a real implementation, this would update the purchase in the backend
    const existingPurchase = this.getMockPurchaseById(data.id);
    
    return {
      ...existingPurchase,
      ...data,
      id: existingPurchase.id, // Ensure ID doesn't change
      updatedAt: new Date().toISOString(),
      purchaseDetails: data.purchaseDetails ? data.purchaseDetails.map(detail => ({
        id: detail.productId + '-' + data.id,
        purchaseId: data.id,
        productId: detail.productId,
        productName: detail.productName,
        quantity: detail.quantity,
        price: detail.price,
        totalAmount: detail.totalAmount || detail.quantity * detail.price,
        lotNumber: detail.lotNumber,
        entryDate: detail.entryDate || new Date().toISOString(),
        expirationDate: detail.expirationDate
      })) : existingPurchase.purchaseDetails
    };
  }

  private cancelMockPurchase(id: string): PurchaseEntity {
    const existingPurchase = this.getMockPurchaseById(id);
    return {
      ...existingPurchase,
      status: 'CANCELED',
      updatedAt: new Date().toISOString()
    };
  }
}

export const purchaseService = new PurchaseService();
