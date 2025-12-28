import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase'; // Ensure this path is correct

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    console.log("1. Login Attempt Started for:", formData.email);

    try {
      // 1. Authenticate with Firebase
      const userCredential = await signInWithEmailAndPassword(auth, formData.email, formData.password);
      console.log("2. Firebase Auth Success:", userCredential.user.uid);
      
      // 2. Redirect
      console.log("3. Redirecting to Dashboard...");
      navigate('/',{ replace: true }); 
      
    } catch (err: any) {
      console.error("❌ Login Error:", err.code, err.message);
      
      if (err.code === 'auth/user-not-found' || err.code === 'auth/invalid-credential') {
        setError('Account does not exist or Invalid Credentials');
      } else if (err.code === 'auth/wrong-password') {
        setError('Invalid Password');
      } else {
        setError('Login failed: ' + err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#fff' }}>
      <div style={{ width: '400px', border: '1px solid #e5e7eb', borderRadius: '16px', padding: '40px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '30px', fontSize: '24px', fontWeight: 'bold' }}>Login Page</h2>
        
        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: '#374151' }}>Email id</label>
            <input 
              name="email"
              type="email" 
              required
              value={formData.email}
              onChange={handleChange}
              style={{ width: '100%', padding: '10px', borderBottom: '1px solid #9ca3af', borderTop: 'none', borderLeft: 'none', borderRight: 'none', outline: 'none' }}
            />
          </div>
          <div style={{ marginBottom: '30px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: '#374151' }}>Password</label>
            <input 
              name="password"
              type="password" 
              required 
              value={formData.password}
              onChange={handleChange}
              style={{ width: '100%', padding: '10px', borderBottom: '1px solid #9ca3af', borderTop: 'none', borderLeft: 'none', borderRight: 'none', outline: 'none' }} 
            />
            {error && <div style={{ color: 'red', marginTop: '10px', fontSize: '14px' }}>{error}</div>}
          </div>
          
          <button type="submit" disabled={loading} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #374151', background: 'white', cursor: 'pointer', fontWeight: '600' }}>
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>
        
        <div style={{ marginTop: '20px', textAlign: 'center', fontSize: '14px', color: '#6b7280' }}>
           <span style={{ color: '#2563eb', cursor: 'pointer' }}>Forget Password?</span> | <Link to="/signup" style={{ color: '#2563eb', textDecoration: 'none' }}>Sign Up</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;