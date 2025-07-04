import { useAuthContext } from '@/contexts/auth/AuthContext';
import { authService, AuthUser } from '@/services/authService';
import { useEffect, useCallback, useMemo } from 'react';

export const useBusinessAuth = () => {
    const { auth, setAuth, user, setUser, selectedBusinessId, setSelectedBusinessId } = useAuthContext();

    // Monitor Firebase auth state changes
    useEffect(() => {
        const unsubscribe = authService.onAuthStateChanged(async (firebaseUser) => {
            if (firebaseUser) {
                try {
                    const token = await firebaseUser.getIdToken();
                    const authUser: AuthUser = {
                        uid: firebaseUser.uid,
                        email: firebaseUser.email,
                        displayName: firebaseUser.displayName,
                        token
                    };
                    
                    setUser(authUser);
                    setAuth('business');
                    localStorage.setItem('authToken', token);
                } catch (error) {
                    console.error('Error getting user token:', error);
                }
            } else {
                setUser(null);
                setAuth(null);
                setSelectedBusinessId(null);
                localStorage.removeItem('authToken');
                localStorage.removeItem('firebaseUid');
                localStorage.removeItem('selectedBusinessId');
            }
        });

        return () => unsubscribe();
    }, [setAuth, setUser, setSelectedBusinessId]);

    const login = useCallback(async (email: string, password: string) => {
        try {
            const { user: authUser } = await authService.login(email, password);
            setUser(authUser);
            setAuth('business');
            return authUser;
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    }, [setUser, setAuth]);

    const register = useCallback(async (email: string, password: string, fullName: string) => {
        try {
            const { user: authUser } = await authService.register({
                email,
                password,
                fullName
            });
            setUser(authUser);
            setAuth('business');
            return authUser;
        } catch (error) {
            console.error('Register error:', error);
            throw error;
        }
    }, [setUser, setAuth]);

    const logout = useCallback(async () => {
        try {
            await authService.logout();
            // El onAuthStateChanged se encargará de limpiar el estado
        } catch (error) {
            console.error('Logout error:', error);
            throw error;
        }
    }, []);

    const selectBusiness = useCallback((businessId: number) => {
        setSelectedBusinessId(businessId);
        localStorage.setItem('selectedBusinessId', businessId.toString());
    }, [setSelectedBusinessId]);

    // Memoize el objeto de retorno para evitar re-renders
    const authMethods = useMemo(() => ({
        auth,
        user,
        userData: user,
        selectedBusinessId,
        login,
        register,
        logout,
        selectBusiness,
        isAuthenticated: !!auth
    }), [auth, user, selectedBusinessId, login, register, logout, selectBusiness]);

    return authMethods;
};
