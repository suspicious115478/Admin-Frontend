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
    const [orders, setOrders] = useState([]); 
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Function to handle the two-step data fetching
    const fetchAdminData = async (firebaseUid) => {
        setLoading(true);
        setError(null);
        let currentAdminId = null;

        try {
            // 1. Fetch admin_id using Firebase UID
            const idUrl = `${API_BASE_URL}/api/admin/adminid/${firebaseUid}`;
            const idResponse = await fetch(idUrl);
            
            if (!idResponse.ok) {
                const errData = await idResponse.json().catch(() => ({ message: 'Unknown ID Error' }));
                throw new Error(`ID Fetch Error ${idResponse.status}: ${errData.message}`);
            }

            const idData = await idResponse.json();
            currentAdminId = idData.admin_id;
            setAdminId(currentAdminId);

            // 2. Fetch orders using the retrieved admin_id
            const ordersUrl = `${API_BASE_URL}/api/admin/orders/${currentAdminId}`;
            const ordersResponse = await fetch(ordersUrl);

            if (!ordersResponse.ok) {
                const errData = await ordersResponse.json().catch(() => ({ message: 'Unknown Orders Error' }));
                throw new Error(`Orders Fetch Error ${ordersResponse.status}: ${errData.message}`);
            }

            const ordersData = await ordersResponse.json();
            setOrders(ordersData.orders); 

        } catch (err) {
            console.error("Data Fetch Failed:", err);
            setError(err.message || 'Error connecting to backend for data.');
            setAdminId(currentAdminId || 'N/A (Error)');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (currentUser) {
            fetchAdminData(currentUser.uid);
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
                        **Fetched Admin ID (for Supabase lookup):** <span style={styles.highlightId}>{adminId}</span>
                    </p>
                    {error && <p style={styles.error}>**Backend Error:** {error}</p>}
                </div>
                
                {/* --- Orders Display Section --- */}
                <div style={{...styles.card, marginTop: '20px'}}>
                    <h2 style={styles.cardTitle}>❌ Cancelled Orders (from Supabase)</h2>
                    {loading && <p>Loading orders...</p>}
                    {!loading && !error && (
                        orders.length > 0 ? (
                            <table style={styles.table}>
                                <thead>
                                    <tr>
                                        <th style={styles.th}>Order ID</th>
                                        <th style={styles.th}>Category</th>
                                        <th style={styles.th}>Request</th>
                                        <th style={styles.th}>Address</th>
                                        <th style={styles.th}>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {orders.map((order) => (
                                        <tr key={order.order_id}>
                                            <td style={styles.td}>{order.order_id}</td>
                                            <td style={styles.td}>{order.category}</td>
                                            <td style={styles.td}>{order.order_request}</td>
                                            <td style={styles.td}>{order.request_address}</td>
                                            <td style={styles.tdStatus(order.order_status)}>{order.order_status}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <p>No **Cancelled** orders found for Admin ID: **{adminId}**</p>
                        )
                    )}
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
    content: { padding: '30px', maxWidth: '1000px', margin: '0 auto', width: '100%' }, // Increased max-width
    card: { backgroundColor: 'white', padding: '30px', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' },
    cardTitle: { borderBottom: '2px solid #e5e7eb', paddingBottom: '10px', marginBottom: '20px', color: '#1f2937' },
    detailLine: { marginBottom: '10px', fontSize: '1.1rem', color: '#4b5563' },
    highlight: { backgroundColor: '#eef2ff', padding: '2px 8px', borderRadius: '4px', fontFamily: 'monospace', color: '#4f46e5' },
    highlightId: { backgroundColor: '#dcfce7', padding: '2px 8px', borderRadius: '4px', fontWeight: 'bold', color: '#10b981' },
    error: { color: '#ef4444', marginTop: '15px', border: '1px solid #fee2e2', padding: '10px', borderRadius: '4px' },
    loading: { textAlign: 'center', padding: '50px' },
    
    // Table Styles
    table: { width: '100%', borderCollapse: 'collapse', marginTop: '15px' },
    th: { borderBottom: '2px solid #e5e7eb', padding: '12px', textAlign: 'left', backgroundColor: '#f9fafb', color: '#374151', fontSize: '0.9rem' },
    td: { borderBottom: '1px solid #e5e7eb', padding: '12px', textAlign: 'left', fontSize: '0.9rem' },
    
    // Dynamic Status Style
    tdStatus: (status) => {
        let color = '#374151'; // Default
        let bgColor = 'transparent';
        
        if (status === 'Cancelled') {
            color = '#ef4444'; // Red
            bgColor = '#fee2e2';
        } 
        
        // Add styles for other potential statuses if you need them:
        // if (status === 'Dispatched') color = '#2563eb'; 
        // if (status === 'Delivered') color = '#10b981'; 
        // if (status === 'Pending') color = '#f59e0b'; 
        
        return { 
            borderBottom: '1px solid #e5e7eb', 
            padding: '12px', 
            textAlign: 'left', 
            fontWeight: '700', 
            color: color,
            backgroundColor: bgColor,
            borderRadius: '4px'
        };
    }
};
