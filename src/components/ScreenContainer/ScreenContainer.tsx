import { Container, ContainerProps} from '@mui/material';
import { drawerWidth } from '../../theme/constants';

interface ScreenContainerProps extends ContainerProps {
}

export const ScreenContainer = ({children, sx, ...rest}:ScreenContainerProps) => {
  return (
    <Container
      maxWidth="xl"
      sx={{
        flexGrow: 1,
          p: 3,
          width: { md: `calc(100% - ${drawerWidth}px)` },
          mt: 5,
        ...sx
      }}
      {...rest}
    >
      {children}
    </Container>
  )
}
