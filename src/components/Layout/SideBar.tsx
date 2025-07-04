import { Box, Toolbar, Typography, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material'
import {
    Dashboard as DashboardIcon,
    People as PeopleIcon,
    Inventory as InventoryIcon,
    PointOfSale as PointOfSaleIcon,
    ShoppingCart as ShoppingCartIcon,
    Warehouse as WarehouseIcon,
    Settings as SettingsIcon
} from '@mui/icons-material'
import { useLocation, useNavigate } from 'react-router-dom'

export interface NavItem {
    label: string
    path: string
    icon: string
}

const iconMap = {
    dashboard: DashboardIcon,
    people: PeopleIcon,
    inventory: InventoryIcon,
    point_of_sale: PointOfSaleIcon,
    shopping_cart: ShoppingCartIcon,
    warehouse: WarehouseIcon,
    settings: SettingsIcon,
}

export const Sidebar = ({ navData }: { navData: NavItem[]; }) => {
    const location = useLocation()
    const navigate = useNavigate()
    return ((
        <Box>
            <Toolbar>
                <Typography variant="h6" noWrap component="div">
                    Business Admin
                </Typography>
            </Toolbar>
            <List>
                {navData.map((item) => {
                    const IconComponent = iconMap[item.icon as keyof typeof iconMap] || DashboardIcon
                    const isActive = location.pathname === item.path

                    return (
                        <ListItem key={item.path} disablePadding>
                            <ListItemButton
                                onClick={() => navigate(item.path)}
                                selected={isActive}
                                sx={{
                                    mx: 1,
                                    borderRadius: 1,
                                    '&.Mui-selected': {
                                        backgroundColor: 'primary.light',
                                        color: 'primary.contrastText',
                                        '&:hover': {
                                            backgroundColor: 'primary.main',
                                        },
                                    },
                                }}
                            >
                                <ListItemIcon>
                                    <IconComponent
                                        color={isActive ? 'inherit' : 'action'}
                                    />
                                </ListItemIcon>
                                <ListItemText primary={item.label} />
                            </ListItemButton>
                        </ListItem>
                    )
                })}
            </List>
        </Box>
    )
    )
}