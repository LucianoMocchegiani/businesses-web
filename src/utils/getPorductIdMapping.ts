// Helper function to determine product ID type based on prefix
export const getProductIdMapping = (productId: string) => {
    // Extract the numeric part after the prefix and dash
    const extractNumericId = (id: string) => {
      const parts = id.split('-');
      return parts.length > 1 ? parts[1] : id;
    };

    if (productId.startsWith('business')) {
      return {
        business_product_id: extractNumericId(productId),
      };
    } else if (productId.startsWith('global')) {
      return {
        global_product_id: extractNumericId(productId)
      };
    }
  };