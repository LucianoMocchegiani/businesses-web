import { useState, useEffect } from 'react';
import { SaleFormData, SaleDetailFormData } from '../types';
import { SaleEntity } from '@/types/business';
import { ProductSearchResult } from '@/components/BarcodeScanner';
import { productSearchService } from '@/services/productSearchService'; 

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
        customer_id: '',
        customer_name: '',
        total_amount: 0,
        status: 'PENDING',
        saleDetails: [],
        notes: '',
    });

    const [newItem, setNewItem] = useState<Partial<SaleDetailFormData>>({
        product_id: '',
        product_name: '',
        quantity: 1,
        price: 0,
        total_amount: 0,
    });

    useEffect(() => {
        if (initialData) {
            setFormData({
                customer_id: initialData.customer_id || '',
                customer_name: initialData.customer_name || '',
                total_amount: initialData.total_amount,
                status: initialData.status,
                saleDetails: initialData.saleDetails || [],
                notes: '',
            });
        }
    }, [initialData]);

    // Function to calculate total amount from sale details
    const handleCalculateTotal = (saleDetails: SaleDetailFormData[]) => {
        const total = saleDetails.reduce((sum, item) => sum + item.total_amount, 0);
        setFormData(prev => ({ ...prev, total_amount: total }));
    }

    const handleInputChange = (field: keyof SaleFormData, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };
    

    // Function to search products using the ProductSearchService
    const handleProductSearch = async (query: string): Promise<ProductSearchResult[]> => {
        return await productSearchService.searchProducts(query);
    };

    // Function to handle product selection from search results
    const handleProductSelect = (product: ProductSearchResult) => {
        // Check if product is already in the list
        const existingItemIndex = formData.saleDetails.findIndex(
            item => item.product_id === product.id
        );

        if (existingItemIndex >= 0) {
            // Increase quantity if product already exists
            const updatedDetails = [...formData.saleDetails];
            updatedDetails[existingItemIndex] = {
                ...updatedDetails[existingItemIndex],
                quantity: updatedDetails[existingItemIndex].quantity + 1,
                total_amount: (updatedDetails[existingItemIndex].quantity + 1) * updatedDetails[existingItemIndex].price,
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
                product_id: product.id,
                product_name: product.name,
                quantity: 1,
                price: product.price,
                total_amount: product.price,
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
                customer_id: customer.id,
                customer_name: customer.name,
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                customer_id: '',
                customer_name: '',
            }));
        }
    };

    // Function to handle product change in the select
    const handleProductChange = (product: any) => {
        // Check if product is already in the list
        const existingItemIndex = formData.saleDetails.findIndex(
            item => item.product_id === product.id
        );
        if (existingItemIndex >= 0) {
            // If product already exists, set new item to that product
            const existingItem = formData.saleDetails[existingItemIndex];
            setNewItem({
                product_id: existingItem.product_id,
                product_name: existingItem.product_name,
                quantity: existingItem.quantity,
                price: existingItem.price,
                total_amount: existingItem.total_amount,
            });
        } else if (product) {
            setNewItem(prev => ({
                ...prev,
                product_id: product.id,
                product_name: product.name,
                price: product.price,
                total_amount: (prev.quantity || 1) * (product.price || 0),
            }));
        } else {
            setNewItem({
                product_id: '',
                product_name: '',
                quantity: 1,
                price: 0,
                total_amount: 0,
            });
        }
    };

    const handleNewItemChange = (field: keyof SaleDetailFormData, value: any) => {
        setNewItem(prev => ({
            ...prev,
            [field]: value,
            total_amount: (field==='quantity'? value * (prev.price || 0):(field==='price'? value * (prev.quantity || 1):prev.total_amount)),
        }));
    };

    const handleAddItem = () => {
        if (newItem.product_id && newItem.quantity && newItem.price) {
            // Check if product is already in the list
            const existingItemIndex = formData.saleDetails.findIndex(
                item => item.product_id === newItem.product_id
            );
            if (existingItemIndex >= 0) {
                // If product already exists, increase quantity
                const updatedDetails = [...formData.saleDetails];
                updatedDetails[existingItemIndex] = {
                    ...updatedDetails[existingItemIndex],
                    quantity: (newItem.quantity || 1),
                    price: (newItem.price || 0),
                    total_amount: (newItem.quantity || 1) * (newItem.price || 0),
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
                    product_id: '',
                    product_name: '',
                    quantity: 1,
                    price: 0,
                    total_amount: 0,
                });
            } else {
                // If product does not exist, add it as a new item
                const item: SaleDetailFormData = {
                    product_id: newItem.product_id!,
                    product_name: newItem.product_name!,
                    quantity: newItem.quantity!,
                    price: newItem.price!,
                    total_amount: newItem.total_amount!,
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
                    product_id: '',
                    product_name: '',
                    quantity: 1,
                    price: 0,
                    total_amount: 0,
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
