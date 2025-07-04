import { LotCreationData, InventoryMovement } from '@/screens/business/purchases/types';

// Mock data para simulación de inventario
let mockInventoryLots: InventoryLot[] = [];
let mockStockMovements: StockMovement[] = [];

interface InventoryLot {
  id: string;
  productId: string;
  lotNumber: string;
  quantity: number;
  availableQuantity: number;
  unitCost: number;
  entryDate: Date;
  expirationDate?: Date;
  supplierId: string;
  purchaseId: string;
  location?: string;
  status: 'ACTIVE' | 'EXPIRED' | 'CONSUMED';
}

interface StockMovement {
  id: string;
  type: 'PURCHASE_IN' | 'SALE_OUT' | 'ADJUSTMENT' | 'TRANSFER';
  productId: string;
  lotNumber?: string;
  quantity: number;
  unitCost?: number;
  reference: string;
  performedBy: string;
  timestamp: Date;
  notes?: string;
}

class InventoryIntegrationService {
  
  // Crear lotes de inventario desde una compra
  async createLotsFromPurchase(purchaseId: string, lotData: LotCreationData[]): Promise<InventoryLot[]> {
    try {
      const newLots: InventoryLot[] = [];
      
      for (const lot of lotData) {
        const inventoryLot: InventoryLot = {
          id: `lot_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          productId: lot.productId,
          lotNumber: lot.lotNumber || this.generateLotNumber(lot.productId),
          quantity: lot.quantity,
          availableQuantity: lot.quantity,
          unitCost: lot.unitCost,
          entryDate: lot.entryDate,
          expirationDate: lot.expirationDate,
          supplierId: lot.supplierId,
          purchaseId: lot.purchaseId,
          location: lot.location,
          status: 'ACTIVE'
        };
        
        mockInventoryLots.push(inventoryLot);
        newLots.push(inventoryLot);
        
        // Registrar movimiento de entrada
        await this.recordStockMovement({
          type: 'PURCHASE_IN',
          productId: lot.productId,
          lotNumber: inventoryLot.lotNumber,
          quantity: lot.quantity,
          unitCost: lot.unitCost,
          reference: purchaseId,
          performedBy: 'system',
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
        id: `mov_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        type: movement.type,
        productId: movement.productId,
        lotNumber: movement.lotNumber,
        quantity: movement.quantity,
        unitCost: movement.unitCost,
        reference: movement.reference,
        performedBy: movement.performedBy,
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
        lot => lot.productId === productId && lot.status === 'ACTIVE'
      );
      
      const currentStock = productLots.reduce((total, lot) => total + lot.availableQuantity, 0);
      const availableLots = productLots.length;
      
      console.log(`Product ${productId} stock updated: ${currentStock} units in ${availableLots} lots`);
      
      // Aquí se actualizaría el stock en el servicio de productos
      // await productService.updateStock(productId, currentStock);
      
      return { currentStock, availableLots };
      
    } catch (error) {
      console.error('Error updating product stock:', error);
      throw new Error('Failed to update product stock');
    }
  }
  
  // Consumir stock desde lotes (para ventas)
  async consumeStock(productId: string, quantity: number, saleId: string): Promise<{ consumedLots: InventoryLot[]; shortage: number }> {
    try {
      const availableLots = mockInventoryLots
        .filter(lot => lot.productId === productId && lot.status === 'ACTIVE' && lot.availableQuantity > 0)
        .sort((a, b) => a.entryDate.getTime() - b.entryDate.getTime()); // FIFO
      
      let remainingQuantity = quantity;
      const consumedLots: InventoryLot[] = [];
      
      for (const lot of availableLots) {
        if (remainingQuantity <= 0) break;
        
        const consumeFromLot = Math.min(lot.availableQuantity, remainingQuantity);
        lot.availableQuantity -= consumeFromLot;
        remainingQuantity -= consumeFromLot;
        
        if (lot.availableQuantity === 0) {
          lot.status = 'CONSUMED';
        }
        
        consumedLots.push(lot);
        
        // Registrar movimiento de salida
        await this.recordStockMovement({
          type: 'SALE_OUT',
          productId: productId,
          lotNumber: lot.lotNumber,
          quantity: consumeFromLot,
          reference: saleId,
          performedBy: 'system',
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
    return mockInventoryLots.filter(lot => lot.productId === productId);
  }
  
  // Obtener movimientos por producto
  async getMovementsByProduct(productId: string): Promise<StockMovement[]> {
    return mockStockMovements.filter(movement => movement.productId === productId);
  }
  
  // Verificar stock disponible
  async checkAvailableStock(productId: string): Promise<{ available: number; lots: InventoryLot[] }> {
    const activeLots = mockInventoryLots.filter(
      lot => lot.productId === productId && lot.status === 'ACTIVE'
    );
    
    const available = activeLots.reduce((total, lot) => total + lot.availableQuantity, 0);
    
    return { available, lots: activeLots };
  }
  
  // Generar número de lote automático
  private generateLotNumber(productId: string): string {
    const date = new Date();
    const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '');
    const productCode = productId.slice(-4).toUpperCase();
    const random = Math.random().toString(36).substr(2, 4).toUpperCase();
    
    return `LOT${dateStr}${productCode}${random}`;
  }
  
  // Limpiar datos mock (para testing)
  clearMockData(): void {
    mockInventoryLots = [];
    mockStockMovements = [];
  }
}

export const inventoryIntegrationService = new InventoryIntegrationService();
