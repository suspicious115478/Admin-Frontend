// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './auth/AuthContext';
import { PrivateRoute } from './auth/PrivateRoute';
import { LoginPage } from './auth/LoginPage';
// 🔥 NEW IMPORT
import { SignupPage } from './auth/SignupPage'; 
import { DashboardPage } from './dashboard/DashboardPage';

function App() {
    return (
        <Router>
            <AuthProvider>
                <Routes>
                    {/* 🔥 ADDED SIGNUP ROUTE */}
                    <Route path="/signup" element={<SignupPage />} />
                    
                    <Route path="/login" element={<LoginPage />} />
                    
                    {/* Protected Route */}
                    <Route path="/" element={<PrivateRoute />}>
                        <Route path="dashboard" element={<DashboardPage />} />
                        <Route path="/" element={<Navigate replace to="/dashboard" />} />
                    </Route>

                    {/* Fallback */}
                    <Route path="*" element={<Navigate replace to="/dashboard" />} />
                </Routes>
            </AuthProvider>
        </Router>
    );
}

export default App;
