import { apiService } from './apiService';
import { SaleEntity, SaleStatus } from '@/types/business';

export interface CreateSaleRequest {
  businessId: string;
  customerId?: string;
  customerName?: string;
  totalAmount?: number;
  status?: SaleStatus;
  saleDetails: {
    productId: string;
    productName: string;
    quantity: number;
    price: number;
    totalAmount?: number;
  }[];
}

export interface UpdateSaleRequest extends Partial<CreateSaleRequest> {
  id: string;
}

export interface GetSalesParams {
  businessId: string;
  page?: number;
  limit?: number;
  orderBy?: 'customerName' | 'totalAmount' | 'status' | 'createdAt' | 'updatedAt';
  orderDirection?: 'asc' | 'desc';
  customerName?: string;
  totalAmount?: number;
  status?: SaleStatus;
  createdAt?: string;
  updatedAt?: string;
}

export interface SalesResponse {
  data: SaleEntity[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

class SaleService {
  private readonly endpoint = '/sales';

  async getAll(params: GetSalesParams): Promise<SalesResponse> {
    try {
      // In a real implementation, this would call the backend API
      const response = await apiService.get<SalesResponse>(this.endpoint);
      return response;
    } catch (error) {
      console.error('Error fetching sales:', error);
      // Mock data for development
      return this.getMockSales(params);
    }
  }

  async getById(id: string): Promise<SaleEntity> {
    try {
      const response = await apiService.get<SaleEntity>(`${this.endpoint}/${id}`);
      return response;
    } catch (error) {
      console.error('Error fetching sale:', error);
      // Mock data for development
      return this.getMockSaleById(id);
    }
  }

  async create(data: CreateSaleRequest): Promise<SaleEntity> {
    try {
      const response = await apiService.post<SaleEntity>(this.endpoint, data);
      return response;
    } catch (error) {
      console.error('Error creating sale:', error);
      // Mock implementation for development
      return this.createMockSale(data);
    }
  }

  async update(data: UpdateSaleRequest): Promise<SaleEntity> {
    try {
      const response = await apiService.put<SaleEntity>(`${this.endpoint}/${data.id}`, data);
      return response;
    } catch (error) {
      console.error('Error updating sale:', error);
      // Mock implementation for development
      return this.updateMockSale(data);
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await apiService.delete(`${this.endpoint}/${id}`);
    } catch (error) {
      console.error('Error deleting sale:', error);
      // Mock implementation for development
      console.log('Mock: Sale deleted successfully');
    }
  }

  async cancel(id: string): Promise<SaleEntity> {
    try {
      const response = await apiService.put<SaleEntity>(`${this.endpoint}/${id}/cancel`, {});
      return response;
    } catch (error) {
      console.error('Error canceling sale:', error);
      // Mock implementation for development
      return this.cancelMockSale(id);
    }
  }

  // Mock data methods for development
  private getMockSales(params: GetSalesParams): SalesResponse {
    const mockSales: SaleEntity[] = [
      {
        id: '1',
        businessId: params.businessId,
        customerId: '1',
        customerName: 'Juan Pérez',
        totalAmount: 150.00,
        status: 'COMPLETED',
        createdAt: '2024-01-15T10:30:00Z',
        updatedAt: '2024-01-15T10:30:00Z',
        saleDetails: [
          {
            id: '1',
            saleId: '1',
            productId: '1',
            productName: 'Laptop Dell',
            quantity: 1,
            price: 150.00,
            totalAmount: 150.00
          }
        ]
      },
      {
        id: '2',
        businessId: params.businessId,
        customerId: '2',
        customerName: 'María García',
        totalAmount: 75.50,
        status: 'PENDING',
        createdAt: '2024-01-14T15:45:00Z',
        updatedAt: '2024-01-14T15:45:00Z',
        saleDetails: [
          {
            id: '2',
            saleId: '2',
            productId: '2',
            productName: 'Mouse Inalámbrico',
            quantity: 2,
            price: 25.00,
            totalAmount: 50.00
          },
          {
            id: '3',
            saleId: '2',
            productId: '3',
            productName: 'Teclado USB',
            quantity: 1,
            price: 25.50,
            totalAmount: 25.50
          }
        ]
      },
      {
        id: '3',
        businessId: params.businessId,
        customerId: '3',
        customerName: 'Carlos López',
        totalAmount: 299.99,
        status: 'COMPLETED',
        createdAt: '2024-01-13T09:15:00Z',
        updatedAt: '2024-01-13T09:15:00Z',
        saleDetails: [
          {
            id: '4',
            saleId: '3',
            productId: '4',
            productName: 'Monitor 24"',
            quantity: 1,
            price: 299.99,
            totalAmount: 299.99
          }
        ]
      },
      {
        id: '4',
        businessId: params.businessId,
        customerName: 'Venta sin cliente registrado',
        totalAmount: 45.00,
        status: 'COMPLETED',
        createdAt: '2024-01-12T14:20:00Z',
        updatedAt: '2024-01-12T14:20:00Z',
        saleDetails: [
          {
            id: '5',
            saleId: '4',
            productId: '5',
            productName: 'Cable HDMI',
            quantity: 3,
            price: 15.00,
            totalAmount: 45.00
          }
        ]
      }
    ];

    // Apply filters
    let filteredSales = mockSales;
    
    if (params.customerName) {
      filteredSales = filteredSales.filter(sale => 
        sale.customerName?.toLowerCase().includes(params.customerName!.toLowerCase())
      );
    }
    
    if (params.status) {
      filteredSales = filteredSales.filter(sale => sale.status === params.status);
    }
    
    if (params.totalAmount) {
      filteredSales = filteredSales.filter(sale => sale.totalAmount === params.totalAmount);
    }

    // Apply sorting
    const sortField = params.orderBy || 'createdAt';
    const sortDirection = params.orderDirection || 'desc';
    
    filteredSales.sort((a, b) => {
      let aValue: any, bValue: any;
      
      switch (sortField) {
        case 'customerName':
          aValue = a.customerName || '';
          bValue = b.customerName || '';
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
    const paginatedSales = filteredSales.slice(startIndex, endIndex);

    return {
      data: paginatedSales,
      meta: {
        total: filteredSales.length,
        page,
        limit,
        totalPages: Math.ceil(filteredSales.length / limit)
      }
    };
  }

  private getMockSaleById(id: string): SaleEntity {
    const mockSales = this.getMockSales({ businessId: 'mock-business' });
    const sale = mockSales.data.find(s => s.id === id);
    if (!sale) {
      throw new Error(`Sale with id ${id} not found`);
    }
    return sale;
  }

  private createMockSale(data: CreateSaleRequest): SaleEntity {
    const newSale: SaleEntity = {
      id: Math.random().toString(36).substr(2, 9),
      businessId: data.businessId,
      customerId: data.customerId,
      customerName: data.customerName || '',
      totalAmount: data.totalAmount || data.saleDetails.reduce((sum, detail) => sum + (detail.totalAmount || detail.quantity * detail.price), 0),
      status: data.status || 'PENDING',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      saleDetails: data.saleDetails.map(detail => ({
        id: Math.random().toString(36).substr(2, 9),
        saleId: '', // Will be set after sale creation
        productId: detail.productId,
        productName: detail.productName,
        quantity: detail.quantity,
        price: detail.price,
        totalAmount: detail.totalAmount || detail.quantity * detail.price
      }))
    };

    // Update saleId in details
    newSale.saleDetails.forEach(detail => {
      detail.saleId = newSale.id;
    });

    return newSale;
  }

  private updateMockSale(data: UpdateSaleRequest): SaleEntity {
    // In a real implementation, this would update the sale in the backend
    const existingSale = this.getMockSaleById(data.id);
    
    return {
      ...existingSale,
      ...data,
      id: existingSale.id, // Ensure ID doesn't change
      updatedAt: new Date().toISOString(),
      saleDetails: data.saleDetails ? data.saleDetails.map(detail => ({
        id: detail.productId + '-' + data.id,
        saleId: data.id,
        productId: detail.productId,
        productName: detail.productName,
        quantity: detail.quantity,
        price: detail.price,
        totalAmount: detail.totalAmount || detail.quantity * detail.price
      })) : existingSale.saleDetails
    };
  }

  private cancelMockSale(id: string): SaleEntity {
    const existingSale = this.getMockSaleById(id);
    return {
      ...existingSale,
      status: 'CANCELED',
      updatedAt: new Date().toISOString()
    };
  }
}

export const saleService = new SaleService();
