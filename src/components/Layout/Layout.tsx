import { Outlet } from 'react-router-dom'
import { HeaderBar } from './HeaderBar'
import { Sidebar, NavItem } from './SideBar'
import { User } from './AccountButton'
import {
  Box,
  Drawer,
  useTheme,
  useMediaQuery,
} from '@mui/material'
import { useState } from 'react'
import { drawerWidth } from '@/theme/constants'
import { ScreenContainer } from '../ScreenContainer'

interface LayoutProps {
  navData: NavItem[]
  handleLogout: () => Promise<void>
  user?: User
}

export const Layout = ({ navData, handleLogout, user }: LayoutProps) => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const [drawerOpen, setDrawerOpen] = useState(!isMobile)

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen)
  }

  return (
    <Box sx={{ display: 'flex' }}>
      <HeaderBar
        handleDrawerToggle={handleDrawerToggle}
        handleLogout={handleLogout}
        user={user}
      />
      {navData.length && (
        <Box
          component="nav"
          sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
        >
          <Drawer
            variant={isMobile ? 'temporary' : 'permanent'}
            open={drawerOpen}
            onClose={handleDrawerToggle}
            ModalProps={{
              keepMounted: true, // Better open performance on mobile.
            }}
            sx={{
              '& .MuiDrawer-paper': {
                boxSizing: 'border-box',
                width: drawerWidth,
              },
            }}
          >
            <Sidebar
              navData={navData}
            />
          </Drawer>
        </Box>
      )}

      <ScreenContainer>
        <Outlet />
      </ScreenContainer>

    </Box>
  )
}
