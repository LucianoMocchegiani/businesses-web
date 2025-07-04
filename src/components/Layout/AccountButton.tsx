import { IconButton, Menu, MenuItem, Avatar, Typography } from '@mui/material';
import { AccountCircle, Logout } from '@mui/icons-material';
import { useState, MouseEvent } from 'react';

export interface User {
  username?: string;
  rol?: string;
}

interface AccountButtonProps {
  handleLogout: () => void;
  user?: User;
};


export const AccountButton = ({ handleLogout, user }: AccountButtonProps) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleMenu = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogoutClick = () => {
    handleClose();
    handleLogout();
  };

  return (
    <>
      <IconButton
        aria-label="account of current user"
        aria-controls="menu-appbar"
        aria-haspopup="true"
        onClick={handleMenu}
      >
        <Avatar sx={{ width: 32, height: 32 }}>
          <AccountCircle />
        </Avatar>
      </IconButton>
      <Menu
        id="menu-appbar"
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        keepMounted
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        {user && (
          <MenuItem disabled>
            <Typography variant="body2">
              {user.username || user.rol}
            </Typography>
          </MenuItem>
        )}
        <MenuItem onClick={handleLogoutClick}>
          <Logout fontSize="small" sx={{ mr: 1 }} />
          Cerrar Sesión
        </MenuItem>
      </Menu>
    </>
  );
};
