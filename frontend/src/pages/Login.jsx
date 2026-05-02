import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { login, register } from '../services/api';

function Login() {
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const updateField = (event) => {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  };

  const persistSession = (payload) => {
    const token = payload?.token || 'local-dev-token';
    const user = payload?.user || {
      id: '123e4567-e89b-12d3-a456-426614174000',
      username: form.username || 'admin',
      email: form.email || 'admin@edugenelearn.com',
      role: 'USER',
    };

    localStorage.setItem('authToken', token);
    localStorage.setItem('user', JSON.stringify(user));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!form.username || !form.password) {
      toast.error('Username and password are required.');
      return;
    }

    if (mode === 'register') {
      if (!form.email) {
        toast.error('Email is required.');
        return;
      }
      if (form.password !== form.confirmPassword) {
        toast.error('Passwords must match.');
        return;
      }
    }

    setSubmitting(true);
    try {
      const response = mode === 'register'
        ? await register(form)
        : await login({ username: form.username, password: form.password });
      persistSession(response.data);
      toast.success(mode === 'register' ? 'Registration successful.' : 'Login successful.');
      navigate(location.state?.from?.pathname || '/dashboard');
    } catch (error) {
      if (form.username === 'admin' && form.password === 'Admin123!') {
        persistSession();
        toast.success('Login successful in local mode.');
        navigate('/dashboard');
        return;
      }
      toast.error(error.response?.data?.message || 'Invalid credentials.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="grid two">
      <div className="panel">
        <h2>{mode === 'register' ? 'Sign Up' : 'Login'}</h2>
        <form className="form" onSubmit={handleSubmit}>
          <div className="field">
            <label htmlFor="username">Username</label>
            <input id="username" name="username" value={form.username} onChange={updateField} />
          </div>

          {mode === 'register' && (
            <>
              <div className="field">
                <label htmlFor="email">Email</label>
                <input id="email" name="email" type="email" value={form.email} onChange={updateField} />
              </div>
              <div className="field">
                <label htmlFor="fullName">Full name</label>
                <input id="fullName" name="fullName" value={form.fullName} onChange={updateField} />
              </div>
            </>
          )}

          <div className="field">
            <label htmlFor="password">Password</label>
            <input id="password" name="password" type="password" value={form.password} onChange={updateField} />
          </div>

          {mode === 'register' && (
            <>
              <div className="field">
                <label htmlFor="confirmPassword">Confirm password</label>
                <input id="confirmPassword" name="confirmPassword" type="password" value={form.confirmPassword} onChange={updateField} />
              </div>
            </>
          )}

          <div className="actions">
            <button className="button" type="submit" disabled={submitting}>
              {submitting ? 'Working...' : mode === 'register' ? 'Create account' : 'Login'}
            </button>
            <button className="button secondary" type="button" onClick={() => setMode(mode === 'register' ? 'login' : 'register')}>
              {mode === 'register' ? 'Back to Login' : 'Sign Up'}
            </button>
          </div>
        </form>
      </div>

      <aside className="panel">
        <h2>Mock Login</h2>
        <p>This local build is ready to use without backend services.</p>
        <div className="credential-list">
          <div>
            <strong>Username</strong>
            <code>admin</code>
          </div>
          <div>
            <strong>Password</strong>
            <code>Admin123!</code>
          </div>
        </div>
        <button
          className="button secondary"
          type="button"
          onClick={() => setForm((current) => ({ ...current, username: 'admin', password: 'Admin123!' }))}
        >
          Use demo credentials
        </button>
      </aside>
    </div>
  );
}

export default Login;
