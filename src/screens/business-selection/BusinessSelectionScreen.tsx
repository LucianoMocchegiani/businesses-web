import React from 'react';
import {
    Box,
    Typography,
    Grid,
    Card,
    CardContent,
    Alert,
    CircularProgress,
    Container,
    CardActionArea,
    Avatar
} from '@mui/material';
import {  Business as BusinessIcon, Search as SearchIcon } from '@mui/icons-material';
import { SnackbarAlert } from '@/components';
import { BusinessCard, CreateBusinessDialog } from './components';
import { useBusinessSelection } from './hooks';

export const BusinessSelectionScreen: React.FC = () => {
    const {
        businessesWithProfiles,
        loading,
        createBusinessDialogOpen,
        error,
        snackbar,
        hideSnackbar,
        handleSelectBusiness,
        handleCreateBusiness,
        handleCloseDialog,
        handleSubmitNewBusiness,
        clearError,
    } = useBusinessSelection();

    if (loading) {
        return (
            <Container maxWidth="lg" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
                <CircularProgress size={60} />
            </Container>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            {/* Header */}
            <Box sx={{ textAlign: 'center', mb: 6 }}>
                <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
                    {businessesWithProfiles.length === 0 ? '¡Bienvenido al Sistema!' : 'Selecciona un Negocio'}
                </Typography>

                {businessesWithProfiles.length === 0 ? (
                    <Typography variant="h6" color="text.secondary" sx={{ mt: 2 }}>
                        Para comenzar, puedes crear tu propio negocio o acceder a uno existente
                    </Typography>
                ) : (
                    <Typography variant="h6" color="text.secondary" sx={{ mt: 2 }}>
                        Elige el negocio al que quieres acceder
                    </Typography>
                )}
            </Box>

            {/* Error Alert */}
            {error && (
                <Alert severity="error" sx={{ mb: 3 }} onClose={clearError}>
                    {error}
                </Alert>
            )}

            {/* Content */}
            <Grid container spacing={3} sx={{ mb: 4 }}>

                {/* Caso B: Con negocios - Mostrar cards de negocios */}
                {businessesWithProfiles.map((businessWithProfile) => (
                    <Grid item xs={12} sm={6} md={4} key={businessWithProfile.business.business_id}>
                        <BusinessCard
                            businessWithProfile={businessWithProfile}
                            onClick={() => handleSelectBusiness(businessWithProfile)}
                        />
                    </Grid>
                ))}
            </Grid>

            <Grid container spacing={3}>
                {/* Crear Negocio */}
                <Grid item xs={12} sm={6}>
                    <Card sx={{
                        height: '100%',
                        border: '2px solid',
                        borderColor: 'primary.main',
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        color: 'white'
                    }}>
                        <CardActionArea onClick={handleCreateBusiness} sx={{ height: '100%' }}>
                            <CardContent sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                textAlign: 'center',
                                height: '100%',
                                p: 4,
                                minHeight: 250
                            }}>
                                <Avatar sx={{
                                    width: 80,
                                    height: 80,
                                    mb: 2,
                                    bgcolor: 'rgba(255,255,255,0.2)',
                                    backdropFilter: 'blur(10px)'
                                }}>
                                    <BusinessIcon sx={{ fontSize: 40 }} />
                                </Avatar>
                                <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
                                    💼 Crear Mi Negocio
                                </Typography>
                                <Typography variant="body1" sx={{ mb: 2, opacity: 0.9 }}>
                                    Inicia tu propio negocio desde cero con control total sobre todas las funcionalidades
                                </Typography>
                                <Box sx={{
                                    mt: 'auto',
                                    p: 2,
                                    bgcolor: 'rgba(255,255,255,0.1)',
                                    borderRadius: 1,
                                    backdropFilter: 'blur(5px)'
                                }}>
                                    <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                                        ✅ Administrador completo<br />
                                        ✅ Todos los permisos<br />
                                        ✅ Configuración personalizada
                                    </Typography>
                                </Box>
                            </CardContent>
                        </CardActionArea>
                    </Card>
                </Grid>

                {/* Buscar Negocio */}
                <Grid item xs={12} sm={6}>
                    <Card sx={{
                        height: '100%',
                        border: '2px dashed',
                        borderColor: 'grey.400',
                        bgcolor: 'grey.50'
                    }}>
                        <CardActionArea sx={{ height: '100%' }}>
                            <CardContent sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                textAlign: 'center',
                                height: '100%',
                                p: 4,
                                minHeight: 250
                            }}>
                                <Avatar sx={{
                                    width: 80,
                                    height: 80,
                                    mb: 2,
                                    bgcolor: 'grey.300'
                                }}>
                                    <SearchIcon sx={{ fontSize: 40 }} />
                                </Avatar>
                                <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
                                    👥 Buscar Negocios
                                </Typography>
                                <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                                    ¿Te invitaron a un negocio? Busca por código de invitación o contacta al administrador
                                </Typography>
                                <Box sx={{
                                    mt: 'auto',
                                    p: 2,
                                    bgcolor: 'info.50',
                                    borderRadius: 1,
                                    border: '1px solid',
                                    borderColor: 'info.200'
                                }}>
                                    <Typography variant="body2" color="info.dark">
                                        💡 Próximamente: Búsqueda por código de invitación
                                    </Typography>
                                </Box>
                            </CardContent>
                        </CardActionArea>
                    </Card>
                </Grid>
            </Grid>

            {/* Create Business Dialog */}
            <CreateBusinessDialog
                open={createBusinessDialogOpen}
                onClose={handleCloseDialog}
                onSubmit={handleSubmitNewBusiness}
                isFirstBusiness={businessesWithProfiles.length === 0}
            />

            {/* Snackbar */}
            <SnackbarAlert
                snackbar={snackbar}
                onClose={hideSnackbar}
            />
        </Container>
    );
};
