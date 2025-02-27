import { useContext, useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { KeycloakContext } from '../../KeycloakContext';

const ProtectedRoute = ({ children, requiredRole }) => {
    const { authenticated = false, role = "" } = useContext(KeycloakContext);
    const [loading, setLoading] = useState(true);
    const location = useLocation();

    useEffect(() => {
        if (authenticated !== false && role !== "") {
            setLoading(false);
        }
    }, [authenticated, role]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!authenticated) {
        return <Navigate to="/" state={{ from: location }} />;
    }

    if (requiredRole && role !== requiredRole) {
        return <Navigate to="/dashboard" state={{ from: location }} />;
    }

    return children;
};

export default ProtectedRoute;