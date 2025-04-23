import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ThemeToggle from './components/ThemeToggle';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  // Check if user is already logged in
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/');
    }
  }, [navigate]);

  const handleLogin = async () => {
    try {
      const res = await fetch('http://localhost:4002/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (data.token) {
        localStorage.setItem('token', data.token);
        navigate('/');
      } else {
        alert('Ошибка авторизации');
      }
    } catch (err) {
      alert('Ошибка сети', err);
    }
  };

  const handleRegistration = async () => {
    try {
      const res = await fetch('http://localhost:4002/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      if (res.ok) {
        const loginRes = await fetch('http://localhost:4002/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        });
        const data = await loginRes.json();
        if (data.token) {
          localStorage.setItem('token', data.token);
          navigate('/');
        }
      } else {
        alert('Ошибка');
      }
    } catch (err) {
      alert('Ошибка сети', err);
    }
  };

  return (
    <div className="login-container">
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' }}>
        <ThemeToggle />
      </div>
      <h2>Логин</h2>
      <input placeholder="email" value={email} onChange={e => setEmail(e.target.value)} />
      <input placeholder="пароль" type="password" value={password} onChange={e => setPassword(e.target.value)} />
      <button onClick={handleLogin}>Войти</button>
      <button onClick={handleRegistration}>Регистрация</button>
    </div>
  );
}