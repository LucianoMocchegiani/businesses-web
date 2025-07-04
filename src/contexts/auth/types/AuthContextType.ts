import { AuthValue } from "./AuthValue";

export interface AuthContextType {
    auth: AuthValue | null;
    setAuth: (value: AuthValue) => void;
    user: any;
    setUser: (user: any) => void;
    selectedBusinessId: number | null;
    setSelectedBusinessId: (id: number | null) => void;
};
