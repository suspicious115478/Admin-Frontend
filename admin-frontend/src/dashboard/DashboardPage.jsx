// src/dashboard/DashboardPage.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../auth/AuthContext';
import { useNavigate } from 'react-router-dom';

// ⚠️ IMPORTANT: Set your deployed backend URL here
const API_BASE_URL = 'https://admin-backend-sxev.onrender.com'; 

export function DashboardPage() {
    const { currentUser, logout } = useAuth();
    const navigate = useNavigate();
    const [adminId, setAdminId] = useState('Fetching...');
    const [error, setError] = useState(null);

    useEffect(() => {
        if (currentUser) {
            const fetchAdminId = async () => {
                const firebaseUid = currentUser.uid;
                const url = `${API_BASE_URL}/api/admin/adminid/${firebaseUid}`;
                
                try {
                    const response = await fetch(url);
                    if (!response.ok) {
                        const errData = await response.json().catch(() => ({ message: 'Unknown Error' }));
                        throw new Error(`HTTP Error ${response.status}: ${errData.message}`);
                    }

                    const data = await response.json();
                    setAdminId(data.admin_id);
                } catch (err) {
                    console.error("Fetch Admin ID Failed:", err);
                    setError(err.message || 'Error connecting to backend.');
                    setAdminId('N/A (Error)');
                }
            };

            fetchAdminId();
        }
    }, [currentUser]);

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/login');
        } catch (err) {
            console.error('Logout failed:', err);
        }
    };

    if (!currentUser) {
        // Should be caught by the PrivateRoute wrapper, but safe fallback
        return <div style={styles.loading}>Redirecting to login...</div>;
    }

    return (
        <div style={styles.container}>
            <header style={styles.header}>
                <h1 style={styles.title}>Admin Dashboard</h1>
                <button onClick={handleLogout} style={styles.logoutButton}>
                    Logout
                </button>
            </header>
            <div style={styles.content}>
                <div style={styles.card}>
                    <h2 style={styles.cardTitle}>Your Credentials</h2>
                    <p style={styles.detailLine}>
                        **Firebase User ID (UID):** <span style={styles.highlight}>{currentUser.uid}</span>
                    </p>
                    <p style={styles.detailLine}>
                        **Fetched Admin ID:** <span style={styles.highlightId}>{adminId}</span>
                    </p>
                    {error && <p style={styles.error}>**Backend Error:** {error}</p>}
                </div>
            </div>
        </div>
    );
}

const styles = {
    container: { display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: '#f3f4f6' },
    header: { backgroundColor: '#1f2937', color: 'white', padding: '20px 30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
    title: { fontSize: '1.5rem', margin: 0 },
    logoutButton: { padding: '8px 15px', backgroundColor: '#ef4444', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: '600' },
    content: { padding: '30px', maxWidth: '800px', margin: '0 auto', width: '100%' },
    card: { backgroundColor: 'white', padding: '30px', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' },
    cardTitle: { borderBottom: '2px solid #e5e7eb', paddingBottom: '10px', marginBottom: '20px', color: '#1f2937' },
    detailLine: { marginBottom: '10px', fontSize: '1.1rem', color: '#4b5563' },
    highlight: { backgroundColor: '#eef2ff', padding: '2px 8px', borderRadius: '4px', fontFamily: 'monospace', color: '#4f46e5' },
    highlightId: { backgroundColor: '#dcfce7', padding: '2px 8px', borderRadius: '4px', fontWeight: 'bold', color: '#10b981' },
    error: { color: '#ef4444', marginTop: '15px', border: '1px solid #fee2e2', padding: '10px', borderRadius: '4px' },
    loading: { textAlign: 'center', padding: '50px' }

};
