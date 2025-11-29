// src/auth/SignupPage.jsx
import React, { useState } from 'react';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { app } from '../config';
import { useNavigate, Link } from 'react-router-dom';

const auth = getAuth(app);
// ⚠️ IMPORTANT: Set your deployed backend URL here
const API_BASE_URL = 'https://admin-backend-sxev.onrender.com'; 

export function SignupPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [adminId, setAdminId] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSignup = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        if (password.length < 6) {
            setError('Password must be at least 6 characters.');
            setLoading(false);
            return;
        }

        try {
            // 1. Create User in Firebase Authentication
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const firebase_uid = userCredential.user.uid;
            
            // 2. Call Backend API to save Admin ID to Realtime DB
            const response = await fetch(`${API_BASE_URL}/api/admin/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    firebase_uid,
                    email,
                    admin_id: adminId,
                }),
            });

            if (!response.ok) {
                // If backend saving fails, log the error but still guide the user to log in
                const errorData = await response.json().catch(() => ({ message: 'Failed to save details to backend DB.' }));
                console.error("Backend Registration Failed:", errorData.message);
                setError(`Signup successful, but failed to save details: ${errorData.message}. Try logging in.`);
            }

            // 3. Success: Redirect to Login
            alert('Sign up successful! Please log in.');
            navigate('/login');

        } catch (err) {
            console.error(err);
            // Handle common Firebase errors
            if (err.code === 'auth/email-already-in-use') {
                setError('This email is already in use. Try logging in.');
            } else {
                setError(`Signup failed: ${err.message}`);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.container}>
            <form onSubmit={handleSignup} style={styles.form}>
                <h2 style={styles.header}>Admin Sign Up 📝</h2>
                <input
                    type="text"
                    placeholder="Unique Admin ID (e.g., ADM-001)"
                    value={adminId}
                    onChange={(e) => setAdminId(e.target.value)}
                    required
                    style={styles.input}
                />
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    style={styles.input}
                />
                <input
                    type="password"
                    placeholder="Password (min 6 chars)"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    style={styles.input}
                />
                <button type="submit" style={styles.button} disabled={loading}>
                    {loading ? 'Signing Up...' : 'Sign Up'}
                </button>
                {error && <p style={styles.error}>{error}</p>}
                
                <p style={styles.footer}>
                    Already have an account? <Link to="/login" style={styles.link}>Log In</Link>
                </p>
            </form>
        </div>
    );
}

const styles = {
    container: { display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', backgroundColor: '#f3f4f6' },
    form: { backgroundColor: 'white', padding: '40px', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', width: '350px', display: 'flex', flexDirection: 'column' },
    header: { marginBottom: '20px', textAlign: 'center', color: '#1f2937' },
    input: { marginBottom: '15px', padding: '10px', borderRadius: '4px', border: '1px solid #d1d5db', fontSize: '16px' },
    button: { padding: '10px', backgroundColor: '#10b981', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '16px', fontWeight: '600' },
    error: { color: '#ef4444', marginTop: '10px', textAlign: 'center' },
    footer: { marginTop: '15px', textAlign: 'center', fontSize: '0.9rem', color: '#4b5563' },
    link: { color: '#4f46e5', textDecoration: 'none', fontWeight: '600' }
};
