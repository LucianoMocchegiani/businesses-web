import { AppBar, Toolbar, IconButton, Box } from '@mui/material';
import { Menu as MenuIcon } from '@mui/icons-material';
import { drawerWidth } from '@/theme/constants';
import { DarkModeButton } from './DarkModeButton';
import { AccountButton, User } from './AccountButton';

interface HeaderBarProps {
    handleLogout: () => Promise<void>;
    user?: User;
    handleDrawerToggle: () => void;
}

export const HeaderBar = ({ handleLogout, user, handleDrawerToggle }: HeaderBarProps) => {
    return (
        <AppBar
            sx={{
                width: { md: `calc(100% - ${drawerWidth}px)` },
                ml: { md: `${drawerWidth}px` },
                backgroundColor: 'background.default',
            }}
        >
            <Toolbar>
                <Box sx={{ flexGrow: 1 }} >
                    <IconButton
                        aria-label="open drawer"
                        edge="start"
                        onClick={handleDrawerToggle}
                        sx={{ mr: 2, display: { md: 'none' } }}
                    >
                        <MenuIcon />
                    </IconButton>
                </Box>
                <DarkModeButton />
                <AccountButton handleLogout={handleLogout} user={user} />
            </Toolbar>
        </AppBar>
    );
};
