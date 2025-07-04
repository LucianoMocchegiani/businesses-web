import { createContext, useState, useContext, ReactNode, useEffect, useCallback, useMemo } from "react";
import { AuthValue, AuthContextType } from "./types";

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuthContext = () => {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error("useAuth debe usarse dentro de un AuthProvider");
    }

    return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [auth, setAuth] = useState<AuthValue | null>(null);
    const [user, setUser] = useState<any>(null);
    const [selectedBusinessId, setSelectedBusinessId] = useState<number | null>(null);
    const [isInitializing, setIsInitializing] = useState(true);

    // Check for existing authentication on app load
    useEffect(() => {
        const initializeAuth = async () => {
            try {
                // Check for existing Firebase session or stored auth
                const storedAuth = localStorage.getItem('auth');
                const storedUser = localStorage.getItem('user');
                const storedBusinessId = localStorage.getItem('selectedBusinessId');

                if (storedAuth && storedUser) {
                    setAuth(storedAuth as AuthValue);
                    setUser(JSON.parse(storedUser));
                    if (storedBusinessId) {
                        setSelectedBusinessId(parseInt(storedBusinessId));
                    }
                }
            } catch (error) {
                console.error('Error initializing auth:', error);
            } finally {
                setIsInitializing(false);
            }
        };

        initializeAuth();
    }, []); // Sin dependencias para evitar re-runs

    const handleSetAuth = useCallback((value: AuthValue | null) => {
        setAuth(value);
        if (value) {
            localStorage.setItem('auth', value);
        } else {
            localStorage.removeItem('auth');
            localStorage.removeItem('user');
            localStorage.removeItem('selectedBusinessId');
            setUser(null);
            setSelectedBusinessId(null);
        }
    }, []);

    const handleSetUser = useCallback((userData: any) => {
        setUser(userData);
        if (userData) {
            localStorage.setItem('user', JSON.stringify(userData));
        } else {
            localStorage.removeItem('user');
        }
    }, []);

    const handleSetSelectedBusinessId = useCallback((id: number | null) => {
        setSelectedBusinessId(id);
        if (id) {
            localStorage.setItem('selectedBusinessId', id.toString());
        } else {
            localStorage.removeItem('selectedBusinessId');
        }
    }, []);

    // Memoize el valor del contexto para evitar re-renders
    const contextValue = useMemo(() => ({
        auth, 
        setAuth: handleSetAuth,
        user,
        setUser: handleSetUser,
        selectedBusinessId,
        setSelectedBusinessId: handleSetSelectedBusinessId
    }), [auth, user, selectedBusinessId, handleSetAuth, handleSetUser, handleSetSelectedBusinessId]);

    // Show loading while initializing
    if (isInitializing) {
        return <div>Loading...</div>;
    }

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
};
