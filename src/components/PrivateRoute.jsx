import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
    const { username } = useSelector((state) => state.user);
    const location = useLocation();

    if (!username) {
        // User is not authenticated
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return children; // User is authenticated, render the children
};

export default PrivateRoute;