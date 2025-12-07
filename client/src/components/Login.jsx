import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '../services/auth';

function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(formData.email, formData.password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-5 bg-gradient-to-br from-peach to-tan">
      <div className="w-full max-w-md bg-white border-3 border-primary rounded-lg p-10 shadow-lg">
        <h1 className="text-4xl text-primary-dark text-center mb-2 tracking-widest font-bold font-mono">
          LOGIN
        </h1>
        <p className="text-center text-text-primary mb-6 font-mono">
          Welcome back to LifeXP
        </p>
        
        {error && (
          <div className="bg-red-50 border-2 border-red-500 rounded-md p-3 mb-5 text-red-500 text-center font-bold font-mono">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="mb-5">
            <label className="block text-text-primary mb-2 font-mono font-bold">
              Email
            </label>
            <input
              type="email"
              name="email"
              className="w-full p-3 bg-purple-50 border-2 border-primary rounded-md text-text-primary font-mono focus:outline-none focus:border-primary-dark focus:bg-white transition-all"
              placeholder="your@email.com"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-5">
            <label className="block text-text-primary mb-2 font-mono font-bold">
              Password
            </label>
            <input
              type="password"
              name="password"
              className="w-full p-3 bg-purple-50 border-2 border-primary rounded-md text-text-primary font-mono focus:outline-none focus:border-primary-dark focus:bg-white transition-all"
              placeholder="Enter password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <button 
            type="submit" 
            className="w-full p-4 bg-gradient-to-r from-primary-dark to-primary border-2 border-primary-dark rounded-md text-white font-mono text-lg font-bold uppercase tracking-wider cursor-pointer transition-all hover:-translate-y-0.5 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading ? 'LOGGING IN...' : 'LOGIN'}
          </button>
        </form>

        <p className="text-center mt-5 text-text-primary font-mono">
          Don't have an account?{' '}
          <Link to="/signup" className="text-primary-dark font-bold hover:text-primary hover:underline transition-colors">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
