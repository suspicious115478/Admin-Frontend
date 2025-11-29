// src/auth/PrivateRoute.jsx
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './AuthContext';

export function PrivateRoute() {
    const { currentUser } = useAuth();
    
    // If authenticated, render the child route (Outlet), otherwise redirect to login
    return currentUser ? <Outlet /> : <Navigate to="/login" replace />;
}
