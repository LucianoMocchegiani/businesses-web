import { LotCreationData, InventoryMovement } from '@/screens/business/purchases/types';

// NOTA: Este servicio utiliza mock data para simulación
// En producción, debería conectarse a un sistema de inventario real

interface InventoryLot {
  id: string;
  product_id: string;
  lot_number: string;
  quantity: number;
  available_quantity: number;
  unit_cost: number;
  entry_date: Date;
  expiration_date?: Date;
  supplier_id: string;
  purchase_id: string;
  location?: string;
  status: 'ACTIVE' | 'EXPIRED' | 'CONSUMED';
}

interface StockMovement {
  id: string;
  type: 'PURCHASE_IN' | 'SALE_OUT' | 'ADJUSTMENT' | 'TRANSFER';
  product_id: string;
  lot_number?: string;
  quantity: number;
  unit_cost?: number;
  reference: string;
  performed_by: string;
  timestamp: Date;
  notes?: string;
}

// Mock data storage para simulación
let mockInventoryLots: InventoryLot[] = [];
let mockStockMovements: StockMovement[] = [];

class InventoryIntegrationService {
  // Crear lotes de inventario desde una compra
  async createLotsFromPurchase(purchaseId: string, lotData: LotCreationData[]): Promise<InventoryLot[]> {
    try {
      const newLots: InventoryLot[] = [];
      
      for (const lot of lotData) {
        const inventoryLot: InventoryLot = {
          id: this.generateLotId(),
          product_id: lot.product_id,
          lot_number: lot.lot_number || this.generateLotNumber(lot.product_id),
          quantity: lot.quantity,
          available_quantity: lot.quantity,
          unit_cost: lot.unit_cost,
          entry_date: lot.entry_date,
          expiration_date: lot.expiration_date,
          supplier_id: lot.supplier_id,
          purchase_id: lot.purchase_id,
          location: lot.location,
          status: 'ACTIVE'
        };
        
        mockInventoryLots.push(inventoryLot);
        newLots.push(inventoryLot);
        
        // Registrar movimiento de entrada
        await this.recordStockMovement({
          type: 'PURCHASE_IN',
          product_id: lot.product_id,
          lot_number: inventoryLot.lot_number,
          quantity: lot.quantity,
          unit_cost: lot.unit_cost,
          reference: purchaseId,
          performed_by: 'system',
          notes: `Lot created from purchase ${purchaseId}`
        });
      }
      
      console.log(`Created ${newLots.length} inventory lots from purchase ${purchaseId}`);
      return newLots;
      
    } catch (error) {
      console.error('Error creating inventory lots:', error);
      throw new Error('Failed to create inventory lots');
    }
  }
  
  // Registrar movimiento de stock
  async recordStockMovement(movement: InventoryMovement): Promise<StockMovement> {
    try {
      const stockMovement: StockMovement = {
        id: this.generateMovementId(),
        type: movement.type,
        product_id: movement.product_id,
        lot_number: movement.lot_number,
        quantity: movement.quantity,
        unit_cost: movement.unit_cost,
        reference: movement.reference,
        performed_by: movement.performed_by,
        timestamp: new Date(),
        notes: movement.notes
      };
      
      mockStockMovements.push(stockMovement);
      console.log('Stock movement recorded:', stockMovement);
      
      return stockMovement;
      
    } catch (error) {
      console.error('Error recording stock movement:', error);
      throw new Error('Failed to record stock movement');
    }
  }
  
  // Actualizar stock de producto
  async updateProductStock(productId: string): Promise<{ currentStock: number; availableLots: number }> {
    try {
      const productLots = mockInventoryLots.filter(
        lot => lot.product_id === productId && lot.status === 'ACTIVE'
      );
      
      const currentStock = productLots.reduce((total, lot) => total + lot.available_quantity, 0);
      const availableLots = productLots.length;
      
      console.log(`Product ${productId} stock updated: ${currentStock} units in ${availableLots} lots`);
      
      // En producción, aquí se actualizaría el stock en el servicio de productos
      // await productService.updateStock(productId, currentStock);
      
      return { currentStock, availableLots };
      
    } catch (error) {
      console.error('Error updating product stock:', error);
      throw new Error('Failed to update product stock');
    }
  }
  
  // Consumir stock desde lotes (para ventas) - FIFO
  async consumeStock(productId: string, quantity: number, saleId: string): Promise<{ consumedLots: InventoryLot[]; shortage: number }> {
    try {
      const availableLots = mockInventoryLots
        .filter(lot => lot.product_id === productId && lot.status === 'ACTIVE' && lot.available_quantity > 0)
        .sort((a, b) => a.entry_date.getTime() - b.entry_date.getTime()); // FIFO
      
      let remainingQuantity = quantity;
      const consumedLots: InventoryLot[] = [];
      
      for (const lot of availableLots) {
        if (remainingQuantity <= 0) break;
        
        const consumeFromLot = Math.min(lot.available_quantity, remainingQuantity);
        lot.available_quantity -= consumeFromLot;
        remainingQuantity -= consumeFromLot;
        
        if (lot.available_quantity === 0) {
          lot.status = 'CONSUMED';
        }
        
        consumedLots.push(lot);
        
        // Registrar movimiento de salida
        await this.recordStockMovement({
          type: 'SALE_OUT',
          product_id: productId,
          lot_number: lot.lot_number,
          quantity: consumeFromLot,
          reference: saleId,
          performed_by: 'system',
          notes: `Stock consumed for sale ${saleId}`
        });
      }
      
      await this.updateProductStock(productId);
      
      return { consumedLots, shortage: remainingQuantity };
      
    } catch (error) {
      console.error('Error consuming stock:', error);
      throw new Error('Failed to consume stock');
    }
  }
  
  // Obtener lotes por producto
  async getLotsByProduct(productId: string): Promise<InventoryLot[]> {
    return mockInventoryLots.filter(lot => lot.product_id === productId);
  }
  
  // Obtener movimientos por producto
  async getMovementsByProduct(productId: string): Promise<StockMovement[]> {
    return mockStockMovements.filter(movement => movement.product_id === productId);
  }
  
  // Verificar stock disponible
  async checkAvailableStock(productId: string): Promise<{ available: number; lots: InventoryLot[] }> {
    const activeLots = mockInventoryLots.filter(
      lot => lot.product_id === productId && lot.status === 'ACTIVE'
    );
    
    const available = activeLots.reduce((total, lot) => total + lot.available_quantity, 0);
    
    return { available, lots: activeLots };
  }
  
  // Obtener lotes próximos a expirar
  async getExpiringLots(days: number = 30): Promise<InventoryLot[]> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() + days);
    
    return mockInventoryLots.filter(lot => 
      lot.status === 'ACTIVE' && 
      lot.expiration_date && 
      lot.expiration_date <= cutoffDate
    );
  }
  
  // Obtener historial de movimientos
  async getStockHistory(productId?: string): Promise<StockMovement[]> {
    const movements = productId 
      ? mockStockMovements.filter(movement => movement.product_id === productId)
      : mockStockMovements;
    
    return movements.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }
  
  // Métodos auxiliares privados
  private generateLotId(): string {
    return `lot_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
  
  private generateMovementId(): string {
    return `mov_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
  
  private generateLotNumber(productId: string): string {
    const date = new Date();
    const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '');
    const productCode = productId.slice(-4).toUpperCase();
    const random = Math.random().toString(36).substr(2, 4).toUpperCase();
    
    return `LOT${dateStr}${productCode}${random}`;
  }
  
  // Método para limpiar datos mock (útil para testing)
  clearMockData(): void {
    mockInventoryLots = [];
    mockStockMovements = [];
  }
}

export const inventoryIntegrationService = new InventoryIntegrationService();
