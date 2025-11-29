// src/auth/LoginPage.jsx
import React, { useState } from 'react';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { app } from '../config';
import { useNavigate } from 'react-router-dom';

const auth = getAuth(app);

export function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await signInWithEmailAndPassword(auth, email, password);
            // On successful login, Firebase handles the redirection via AuthContext
            navigate('/dashboard');
        } catch (err) {
            console.error(err);
            setError('Login failed: Invalid email or password.');
        }
    };

    return (
        <div style={styles.container}>
            <form onSubmit={handleLogin} style={styles.form}>
                <h2 style={styles.header}>Admin Login</h2>
                <input
                    type="email"
                    placeholder="Admin Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    style={styles.input}
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    style={styles.input}
                />
                <button type="submit" style={styles.button}>Log In</button>
                {error && <p style={styles.error}>{error}</p>}
            </form>
        </div>
    );
}

const styles = {
    container: { display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', backgroundColor: '#f3f4f6' },
    form: { backgroundColor: 'white', padding: '40px', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', width: '300px', display: 'flex', flexDirection: 'column' },
    header: { marginBottom: '20px', textAlign: 'center', color: '#1f2937' },
    input: { marginBottom: '15px', padding: '10px', borderRadius: '4px', border: '1px solid #d1d5db', fontSize: '16px' },
    button: { padding: '10px', backgroundColor: '#4f46e5', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '16px', fontWeight: '600' },
    error: { color: '#ef4444', marginTop: '10px', textAlign: 'center' }
};