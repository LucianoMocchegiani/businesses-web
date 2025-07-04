import { IconButton } from '@mui/material';
import { Brightness4, Brightness7 } from '@mui/icons-material';
import { useState } from 'react';

export const DarkModeButton = () => {
  const [darkMode, setDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    // TODO: Implementar cambio de tema
  };

  return (
    <IconButton 
      onClick={toggleDarkMode}
      sx={{
        transition: 'all 0.3s ease-in-out',
        '&:hover': {
          transform: 'scale(1.1)',
          backgroundColor: darkMode ? 'rgba(255, 215, 0, 0.1)' : 'rgba(192, 192, 192, 0.1)',
        }
      }}
    >
      {darkMode ? (
        <Brightness7 
          sx={{ 
            color: '#FFD700', // Color dorado del sol
            transition: 'all 0.3s ease-in-out',
            filter: 'drop-shadow(0 0 8px rgba(255, 215, 0, 0.5))',
          }} 
        />
      ) : (
        <Brightness4 
          sx={{ 
            color: '#B0C4DE', // Color azul plateado de la luna
            transition: 'all 0.3s ease-in-out',
            filter: 'drop-shadow(0 0 6px rgba(176, 196, 222, 0.4))',
          }} 
        />
      )}
    </IconButton>
  );
};
