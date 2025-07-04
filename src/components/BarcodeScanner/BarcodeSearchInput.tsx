import React, { useState, useRef, useEffect } from 'react';
import {
  TextField,
  InputAdornment,
  IconButton,
  Box,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Typography,
  Chip,
  CircularProgress,
} from '@mui/material';
import {
  QrCodeScanner as ScannerIcon,
  Search as SearchIcon,
  Clear as ClearIcon,
  ShoppingCart as ProductIcon,
} from '@mui/icons-material';

export interface ProductSearchResult {
  id: string;
  name: string;
  barcode: string;
  price: number;
  stock: number;
  category?: string;
  image?: string;
}

interface BarcodeSearchInputProps {
  onProductSelect: (product: ProductSearchResult) => void;
  onSearch?: (query: string) => Promise<ProductSearchResult[]>;
  placeholder?: string;
  disabled?: boolean;
  label?: string;
  autoFocus?: boolean;
}

export const BarcodeSearchInput: React.FC<BarcodeSearchInputProps> = ({
  onProductSelect,
  onSearch,
  placeholder = "Buscar por código de barras o nombre...",
  disabled = false,
  label = "Buscar Producto",
  autoFocus = false,
}) => {
  const [searchValue, setSearchValue] = useState('');
  const [searchResults, setSearchResults] = useState<ProductSearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const searchTimeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus]);

  const performSearch = async (query: string) => {
    if (!query.trim() || !onSearch) {
      setSearchResults([]);
      setShowResults(false);
      return;
    }

    setLoading(true);
    try {
      const results = await onSearch(query);
      setSearchResults(results);
      setShowResults(results.length > 0);
    } catch (error) {
      console.error('Error searching products:', error);
      setSearchResults([]);
      setShowResults(false);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchValue(value);

    // Clear previous timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    // Debounce search for 300ms
    searchTimeoutRef.current = setTimeout(() => {
      performSearch(value);
    }, 300);
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      
      // If there's exactly one result, select it
      if (searchResults.length === 1) {
        handleProductSelect(searchResults[0]);
      } else if (searchValue.trim()) {
        // For barcode scanning, perform immediate search
        performSearch(searchValue);
      }
    }

    if (event.key === 'Escape') {
      setShowResults(false);
      setSearchValue('');
    }
  };

  const handleProductSelect = (product: ProductSearchResult) => {
    onProductSelect(product);
    setSearchValue('');
    setSearchResults([]);
    setShowResults(false);
    
    // Return focus to input for continuous scanning
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleClear = () => {
    setSearchValue('');
    setSearchResults([]);
    setShowResults(false);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleScannerClick = () => {
    // Focus input for barcode scanner gun input
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <Box sx={{ position: 'relative', width: '100%' }}>
      <TextField
        ref={inputRef}
        fullWidth
        label={label}
        placeholder={placeholder}
        value={searchValue}
        onChange={handleInputChange}
        onKeyDown={handleKeyPress}
        disabled={disabled}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <IconButton
                onClick={handleScannerClick}
                disabled={disabled}
                size="small"
                title="Listo para escanear código de barras"
              >
                <ScannerIcon />
              </IconButton>
            </InputAdornment>
          ),
          endAdornment: (
            <InputAdornment position="end">
              {loading && <CircularProgress size={20} />}
              {searchValue && !loading && (
                <IconButton onClick={handleClear} size="small">
                  <ClearIcon />
                </IconButton>
              )}
              {!searchValue && !loading && (
                <SearchIcon color="action" />
              )}
            </InputAdornment>
          ),
        }}
      />

      {showResults && searchResults.length > 0 && (
        <Paper
          sx={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            zIndex: 1000,
            maxHeight: 300,
            overflow: 'auto',
            mt: 1,
          }}
        >
          <List dense>
            {searchResults.map((product) => (                <ListItem
                  key={product.id}
                  component="div"
                  onClick={() => handleProductSelect(product)}
                  sx={{
                    cursor: 'pointer',
                    '&:hover': {
                      backgroundColor: 'action.hover',
                    },
                  }}
                >
                <ListItemAvatar>
                  <Avatar sx={{ bgcolor: 'primary.main' }}>
                    <ProductIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="body2" fontWeight="medium">
                        {product.name}
                      </Typography>
                      {product.stock <= 5 && (
                        <Chip 
                          label="Stock Bajo" 
                          size="small" 
                          color="warning" 
                        />
                      )}
                    </Box>
                  }
                  secondary={
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Código: {product.barcode}
                      </Typography>
                      <br />
                      <Typography variant="caption" color="text.secondary">
                        Stock: {product.stock} | Precio: ${product.price.toFixed(2)}
                      </Typography>
                    </Box>
                  }
                />
              </ListItem>
            ))}
          </List>
        </Paper>
      )}

      {showResults && searchResults.length === 0 && searchValue.trim() && !loading && (
        <Paper
          sx={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            zIndex: 1000,
            mt: 1,
            p: 2,
          }}
        >
          <Typography variant="body2" color="text.secondary" textAlign="center">
            No se encontraron productos con "{searchValue}"
          </Typography>
        </Paper>
      )}
    </Box>
  );
};
