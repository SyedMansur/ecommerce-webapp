import React, { JSX } from 'react';
import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
    children: JSX.Element;
    allowedRoles: number[]; // e.g., [1] for user-only
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const roleId = user?.roleId;

    if (!allowedRoles.includes(roleId)) {
        return <Navigate to="/unauthorized" replace />;
    }

    return children;
};

export default ProtectedRoute;
