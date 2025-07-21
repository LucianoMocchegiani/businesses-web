import { useState, useEffect } from 'react';
import { PurchaseFormData, PurchaseDetailFormData } from '../types';
import { PurchaseEntity } from '@/types/business';
import { ProductSearchResult } from '@/components/BarcodeScanner';
import { productSearchService } from '@/services/productSearchService';
import { getCurrentTimestamp } from '@/utils/dateUtils';

interface UsePurchaseFormProps {
    initialData?: PurchaseEntity | null;
}

export interface UsePurchaseFormReturn {
    formData: PurchaseFormData;
    newItem: Partial<PurchaseDetailFormData>;
    handleInputChange: (field: keyof PurchaseFormData, value: any) => void;
    handleProductSearch: (query: string) => Promise<ProductSearchResult[]>;
    handleProductSelect: (product: ProductSearchResult) => void;
    handleNewItemChange: (field: keyof PurchaseDetailFormData, value: any) => void;
    handleSupplierChange: (supplier: any) => void;
    handleProductChange: (product: any) => void;
    handleAddItem: () => void;
    handleRemoveItem: (index: number) => void;
}

export const usePurchaseForm = ({ initialData }: UsePurchaseFormProps): UsePurchaseFormReturn => {
    const [formData, setFormData] = useState<PurchaseFormData>({
        supplier_id: '',
        supplier_name: '',
        total_amount: 0,
        status: 'PENDING',
        purchaseDetails: [],
        comments: '',
    });

    const [newItem, setNewItem] = useState<Partial<PurchaseDetailFormData>>({
        product_id: '',
        product_name: '',
        quantity_ordered: 1,
        price: 0,
        total_amount: 0,
        lot_number: '',
        entry_date: getCurrentTimestamp(),
        expiration_date: undefined,
    });

    useEffect(() => {
        if (initialData) {
            setFormData({
                supplier_id: initialData.supplier_id || '',
                supplier_name: initialData.supplier_name || '',
                total_amount: initialData.total_amount,
                status: initialData.status,
                purchaseDetails: initialData.purchaseDetails?.map(detail => ({
                    product_id: detail.product_id || detail.business_product_id || detail.global_product_id || '',
                    product_name: detail.product_name || detail.businessProduct?.product_name || detail.globalProduct?.product_name || 'Producto sin nombre',
                    quantity_ordered: detail.quantity || 0,
                    quantity_received: detail.quantity_received,
                    price: detail.price || 0,
                    total_amount: detail.total_amount || 0,
                    lot_number: detail.lot_number || '',
                    entry_date: detail.entry_date || getCurrentTimestamp(),
                    expiration_date: detail.expiration_date || undefined,
                    quality_check: detail.quality_check,
                    quality_notes: detail.quality_notes,
                    warehouse_location: detail.warehouse_location,
                    business_product_id: detail.business_product_id,
                    global_product_id: detail.global_product_id,
                    businessProduct: detail.businessProduct,
                    globalProduct: detail.globalProduct,
                })) || [],
                comments: '',
            });
        }
    }, [initialData]);

    // Function to calculate total amount from purchase details
    const handleCalculateTotal = (purchaseDetails: PurchaseDetailFormData[]) => {
        const total = purchaseDetails.reduce((sum, item) => sum + (item.total_amount || 0), 0);
        setFormData(prev => ({ ...prev, total_amount: total }));
    }

    const handleInputChange = (field: keyof PurchaseFormData, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    // Function to search products using the ProductSearchService
    const handleProductSearch = async (query: string): Promise<ProductSearchResult[]> => {
        return await productSearchService.searchProducts(query);
    };

    // Function to handle product selection from search results
    const handleProductSelect = (product: ProductSearchResult) => {
        // Check if product is already in the list
        const existingItemIndex = formData.purchaseDetails.findIndex(
            item => item.product_id === product.product_id
        );

        if (existingItemIndex >= 0) {
            // Increase quantity if product already exists
            const updatedDetails = [...formData.purchaseDetails];
            updatedDetails[existingItemIndex] = {
                ...updatedDetails[existingItemIndex],
                quantity_ordered: updatedDetails[existingItemIndex].quantity_ordered + 1,
                total_amount: (updatedDetails[existingItemIndex].quantity_ordered + 1) * updatedDetails[existingItemIndex].price,
            };

            setFormData(prev => {
                // Calculate total when items change
                handleCalculateTotal(updatedDetails);
                return ({
                    ...prev,
                    purchaseDetails: updatedDetails,
                })
            });

        } else {
            // Add new product to the list
            const newPurchaseDetail: PurchaseDetailFormData = {
                product_id: product.product_id,
                product_name: product.product_name,
                quantity_ordered: 1,
                price: product.price,
                total_amount: product.price,
                lot_number: '',
                entry_date: getCurrentTimestamp(),
                expiration_date: undefined,
            };

            setFormData(prev => {
                // Calculate total when items change
                handleCalculateTotal([...prev.purchaseDetails, newPurchaseDetail]);
                return ({
                    ...prev,
                    purchaseDetails: [...prev.purchaseDetails, newPurchaseDetail],
                });
            });
        }
    };

    const handleSupplierChange = (supplier: any) => {
        if (supplier) {
            setFormData(prev => ({
                ...prev,
                supplier_id: supplier.supplier_id,
                supplier_name: supplier.supplier_name,
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                supplier_id: '',
                supplier_name: '',
            }));
        }
    };

    // Function to handle product change in the select
    const handleProductChange = (product: any) => {
        // Check if product is already in the list
        const existingItemIndex = formData.purchaseDetails.findIndex(
            item => item.product_id === product.product_id
        );
        if (existingItemIndex >= 0) {
            // If product already exists, set new item to that product
            const existingItem = formData.purchaseDetails[existingItemIndex];
            setNewItem({
                product_id: existingItem.product_id,
                product_name: existingItem.product_name,
                quantity_ordered: existingItem.quantity_ordered,
                price: existingItem.price,
                total_amount: existingItem.total_amount,
                lot_number: existingItem.lot_number,
                entry_date: existingItem.entry_date,
                expiration_date: existingItem.expiration_date,
            });
        } else if (product) {
            setNewItem(prev => ({
                ...prev,
                product_id: product.product_id,
                product_name: product.product_name,
                price: product.price,
                total_amount: (prev.quantity_ordered || 1) * (product.price || 0),
            }));
        } else {
            setNewItem({
                product_id: '',
                product_name: '',
                quantity_ordered: 1,
                price: 0,
                total_amount: 0,
                lot_number: '',
                entry_date: getCurrentTimestamp(),
                expiration_date: undefined,
            });
        }
    };

    const handleNewItemChange = (field: keyof PurchaseDetailFormData, value: any) => {
        setNewItem(prev => ({
            ...prev,
            [field]: value,
            total_amount: (field === 'quantity_ordered' ? value * (prev.price || 0) : (field === 'price' ? value * (prev.quantity_ordered || 1) : prev.total_amount)),
        }));
    };

    const handleAddItem = () => {
        if (newItem.product_id && newItem.quantity_ordered && newItem.price) {
            // Check if product is already in the list
            const existingItemIndex = formData.purchaseDetails.findIndex(
                item => item.product_id === newItem.product_id
            );
            if (existingItemIndex >= 0) {
                // If product already exists, increase quantity
                const updatedDetails = [...formData.purchaseDetails];
                updatedDetails[existingItemIndex] = {
                    ...updatedDetails[existingItemIndex],
                    quantity_ordered: (newItem.quantity_ordered || 1),
                    price: (newItem.price || 0),
                    total_amount: (newItem.quantity_ordered || 1) * (newItem.price || 0),
                };

                setFormData(prev => {
                    // Calculate total when items change
                    handleCalculateTotal(updatedDetails);
                    return ({
                        ...prev,
                        purchaseDetails: updatedDetails,
                    });
                });

                setNewItem({
                    product_id: '',
                    product_name: '',
                    quantity_ordered: 1,
                    price: 0,
                    total_amount: 0,
                    lot_number: '',
                    entry_date: getCurrentTimestamp(),
                    expiration_date: undefined,
                });
            } else {
                // If product does not exist, add it as a new item
                const item: PurchaseDetailFormData = {
                    product_id: newItem.product_id!,
                    product_name: newItem.product_name!,
                    quantity_ordered: newItem.quantity_ordered!,
                    price: newItem.price!,
                    total_amount: newItem.total_amount!,
                    lot_number: newItem.lot_number || '',
                    entry_date: newItem.entry_date || getCurrentTimestamp(),
                    expiration_date: newItem.expiration_date || undefined,
                };

                setFormData(prev => {
                    // Calculate total when items change
                    handleCalculateTotal([...prev.purchaseDetails, item]);
                    return ({
                        ...prev,
                        purchaseDetails: [...prev.purchaseDetails, item],
                    })
                });

                setNewItem({
                    product_id: '',
                    product_name: '',
                    quantity_ordered: 1,
                    price: 0,
                    total_amount: 0,
                    lot_number: '',
                    entry_date: getCurrentTimestamp(),
                    expiration_date: undefined,
                });
            }
        }
    };

    const handleRemoveItem = (index: number) => {
        setFormData(prev => {
            // Calculate total when items change
            handleCalculateTotal(prev.purchaseDetails.filter((_, i) => i !== index));
            return ({
                ...prev,
                purchaseDetails: prev.purchaseDetails.filter((_, i) => i !== index),
            })
        });
    };

    return {
        formData,
        newItem,
        handleInputChange,
        handleProductSearch,
        handleProductSelect,
        handleSupplierChange,
        handleProductChange,
        handleNewItemChange,
        handleAddItem,
        handleRemoveItem,
    }
}; 