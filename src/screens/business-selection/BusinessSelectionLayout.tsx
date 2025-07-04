import { Layout } from '@/components';
import { useBusinessAuth } from '../../hooks/useBusinessAuth';

export const BusinessSelectionLayout = () => {
    const { logout, userData } = useBusinessAuth();

    return (
        <Layout
            handleLogout={logout}
            navData={[]}
            user={userData}
        />
    );
};
