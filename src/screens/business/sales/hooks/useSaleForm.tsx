import { useState, useEffect } from 'react';
import { SaleFormData, SaleDetailFormData } from '../types';
import { SaleEntity } from '@/types/business';
import { ProductSearchResult } from '@/components/BarcodeScanner';
import { ProductSearchService } from '@/services/productSearchService';

interface UseSaleFormProps {
    initialData?: SaleEntity | null;
}

export interface UseSaleFormReturn {
    formData: SaleFormData;
    newItem: Partial<SaleDetailFormData>;
    handleInputChange: (field: keyof SaleFormData, value: any) => void;
    handleProductSearch: (query: string) => Promise<ProductSearchResult[]>;
    handleProductSelect: (product: ProductSearchResult) => void;
    handleNewItemChange: (field: keyof SaleDetailFormData, value: any) => void;
    handleCustomerChange: (customer: any) => void;
    handleProductChange: (product: any) => void;
    handleAddItem: () => void;
    handleRemoveItem: (index: number) => void;
}

export const useSaleForm = ({ initialData }: UseSaleFormProps): UseSaleFormReturn => {
    const [formData, setFormData] = useState<SaleFormData>({
        customerId: '',
        customerName: '',
        totalAmount: 0,
        status: 'PENDING',
        saleDetails: [],
        notes: '',
    });

    const [newItem, setNewItem] = useState<Partial<SaleDetailFormData>>({
        productId: '',
        productName: '',
        quantity: 1,
        price: 0,
        totalAmount: 0,
    });

    useEffect(() => {
        if (initialData) {
            setFormData({
                customerId: initialData.customerId || '',
                customerName: initialData.customerName || '',
                totalAmount: initialData.totalAmount,
                status: initialData.status,
                saleDetails: initialData.saleDetails || [],
                notes: '',
            });
        }
    }, [initialData]);

    // Function to calculate total amount from sale details
    const handleCalculateTotal = (saleDetails: SaleDetailFormData[]) => {
        const total = saleDetails.reduce((sum, item) => sum + item.totalAmount, 0);
        setFormData(prev => ({ ...prev, totalAmount: total }));
    }

    const handleInputChange = (field: keyof SaleFormData, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };
    

    // Function to search products using the ProductSearchService
    const handleProductSearch = async (query: string): Promise<ProductSearchResult[]> => {
        return await ProductSearchService.searchProducts(query);
    };

    // Function to handle product selection from search results
    const handleProductSelect = (product: ProductSearchResult) => {
        // Check if product is already in the list
        const existingItemIndex = formData.saleDetails.findIndex(
            item => item.productId === product.id
        );

        if (existingItemIndex >= 0) {
            // Increase quantity if product already exists
            const updatedDetails = [...formData.saleDetails];
            updatedDetails[existingItemIndex] = {
                ...updatedDetails[existingItemIndex],
                quantity: updatedDetails[existingItemIndex].quantity + 1,
                totalAmount: (updatedDetails[existingItemIndex].quantity + 1) * updatedDetails[existingItemIndex].price,
            };

            setFormData(prev => {
                // Calculate total when items change
                handleCalculateTotal(updatedDetails);
                return ({
                    ...prev,
                    saleDetails: updatedDetails,
                })
            });

        } else {
            // Add new product to the list
            const newSaleDetail: SaleDetailFormData = {
                productId: product.id,
                productName: product.name,
                quantity: 1,
                price: product.price,
                totalAmount: product.price,
            };

            setFormData(prev => {
                // Calculate total when items change
                handleCalculateTotal([...prev.saleDetails, newSaleDetail]);
                return ({
                    ...prev,
                    saleDetails: [...prev.saleDetails, newSaleDetail],
                });
            });
        }
    };

    const handleCustomerChange = (customer: any) => {
        if (customer) {
            setFormData(prev => ({
                ...prev,
                customerId: customer.id,
                customerName: customer.name,
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                customerId: '',
                customerName: '',
            }));
        }
    };

    // Function to handle product change in the select
    const handleProductChange = (product: any) => {
        // Check if product is already in the list
        const existingItemIndex = formData.saleDetails.findIndex(
            item => item.productId === product.id
        );
        if (existingItemIndex >= 0) {
            // If product already exists, set new item to that product
            const existingItem = formData.saleDetails[existingItemIndex];
            setNewItem({
                productId: existingItem.productId,
                productName: existingItem.productName,
                quantity: existingItem.quantity,
                price: existingItem.price,
                totalAmount: existingItem.totalAmount,
            });
        } else if (product) {
            setNewItem(prev => ({
                ...prev,
                productId: product.id,
                productName: product.name,
                price: product.price,
                totalAmount: (prev.quantity || 1) * (product.price || 0),
            }));
        } else {
            setNewItem({
                productId: '',
                productName: '',
                quantity: 1,
                price: 0,
                totalAmount: 0,
            });
        }
    };

    const handleNewItemChange = (field: keyof SaleDetailFormData, value: any) => {
        setNewItem(prev => ({
            ...prev,
            [field]: value,
            totalAmount: (field==='quantity'? value * (prev.price || 0):(field==='price'? value * (prev.quantity || 1):prev.totalAmount)),
        }));
    };

    const handleAddItem = () => {
        if (newItem.productId && newItem.quantity && newItem.price) {
            // Check if product is already in the list
            const existingItemIndex = formData.saleDetails.findIndex(
                item => item.productId === newItem.productId
            );
            if (existingItemIndex >= 0) {
                // If product already exists, increase quantity
                const updatedDetails = [...formData.saleDetails];
                updatedDetails[existingItemIndex] = {
                    ...updatedDetails[existingItemIndex],
                    quantity: (newItem.quantity || 1),
                    price: (newItem.price || 0),
                    totalAmount: (newItem.quantity || 1) * (newItem.price || 0),
                };

                setFormData(prev => {
                    // Calculate total when items change
                    handleCalculateTotal(updatedDetails);
                    return ({
                        ...prev,
                        saleDetails: updatedDetails,
                    });
                });

                setNewItem({
                    productId: '',
                    productName: '',
                    quantity: 1,
                    price: 0,
                    totalAmount: 0,
                });
            } else {
                // If product does not exist, add it as a new item
                const item: SaleDetailFormData = {
                    productId: newItem.productId!,
                    productName: newItem.productName!,
                    quantity: newItem.quantity!,
                    price: newItem.price!,
                    totalAmount: newItem.totalAmount!,
                };

                setFormData(prev => {
                    // Calculate total when items change
                    handleCalculateTotal([...prev.saleDetails, item]);
                    return ({
                        ...prev,
                        saleDetails: [...prev.saleDetails, item],
                    })
                });

                setNewItem({
                    productId: '',
                    productName: '',
                    quantity: 1,
                    price: 0,
                    totalAmount: 0,
                });
            }
        }
    };

    const handleRemoveItem = (index: number) => {
        setFormData(prev => {
            // Calculate total when items change
            handleCalculateTotal(prev.saleDetails.filter((_, i) => i !== index));
            return ({
                ...prev,
                saleDetails: prev.saleDetails.filter((_, i) => i !== index),
            })
        });
    };

    return {
        formData,
        newItem,
        handleInputChange,
        handleProductSearch,
        handleProductSelect,
        handleCustomerChange,
        handleProductChange,
        handleNewItemChange,
        handleAddItem,
        handleRemoveItem,
    }
};
