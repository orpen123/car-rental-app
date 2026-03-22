import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import api from '../services/api.js';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post('/auth/login', formData);
      login(res.data);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='min-h-screen bg-[#eaecf5] flex items-center justify-center px-4 py-24'>
      <div className='w-full max-w-md'>

        {/* Card */}
        <div className='bg-white rounded-3xl shadow-sm p-8 sm:p-10'>

          {/* Header */}
          <div className='text-center mb-8'>
            <Link to='/' className='text-gray-900 font-bold text-lg uppercase tracking-wide'>
              CarRental
            </Link>
            <h2 className='text-2xl sm:text-3xl font-bold text-gray-900 mt-4 mb-1'>
              Welcome back
            </h2>
            <p className='text-gray-400 text-sm'>
              Sign in to your account to continue
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className='bg-red-50 border border-red-100 text-red-500 text-xs rounded-2xl px-4 py-3 mb-6 text-center'>
              {error}
            </div>
          )}

          {/* Form */}
          <div className='space-y-4'>

            {/* Email */}
            <div>
              <label className='block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide'>
                Email
              </label>
              <input
                type='email'
                name='email'
                value={formData.email}
                onChange={handleChange}
                placeholder='you@example.com'
                className='w-full px-4 py-3 bg-gray-50 rounded-2xl text-sm text-gray-800 outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all placeholder-gray-300'
                required
              />
            </div>

            {/* Password */}
            <div>
              <div className='flex items-center justify-between mb-1.5'>
                <label className='block text-xs font-semibold text-gray-600 uppercase tracking-wide'>
                  Password
                </label>
                <a href='#' className='text-xs text-blue-600 hover:underline'>
                  Forgot password?
                </a>
              </div>
              <input
                type='password'
                name='password'
                value={formData.password}
                onChange={handleChange}
                placeholder='••••••••'
                className='w-full px-4 py-3 bg-gray-50 rounded-2xl text-sm text-gray-800 outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all placeholder-gray-300'
                required
              />
            </div>

            {/* Submit */}
            <button
              onClick={handleSubmit}
              disabled={loading}
              className='w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-semibold py-3 rounded-2xl text-sm transition-all duration-300 mt-2'
            >
              {loading ? (
                <span className='flex items-center justify-center gap-2'>
                  <svg className='w-4 h-4 animate-spin' fill='none' viewBox='0 0 24 24'>
                    <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4' />
                    <path className='opacity-75' fill='currentColor' d='M4 12a8 8 0 018-8v8z' />
                  </svg>
                  Signing in...
                </span>
              ) : 'Sign In'}
            </button>
          </div>

          {/* Divider */}
          <div className='flex items-center gap-3 my-6'>
            <div className='flex-1 h-px bg-gray-100' />
            <span className='text-xs text-gray-300'>or continue with</span>
            <div className='flex-1 h-px bg-gray-100' />
          </div>

          {/* Social Buttons */}
          <div className='grid grid-cols-2 gap-3'>
            <button className='flex items-center justify-center gap-2 px-4 py-2.5 border border-gray-100 rounded-2xl text-xs text-gray-600 font-medium hover:bg-gray-50 transition-all'>
              <svg className='w-4 h-4' viewBox='0 0 24 24'>
                <path fill='#4285F4' d='M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z' />
                <path fill='#34A853' d='M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z' />
                <path fill='#FBBC05' d='M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z' />
                <path fill='#EA4335' d='M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z' />
              </svg>
              Google
            </button>
            <button className='flex items-center justify-center gap-2 px-4 py-2.5 border border-gray-100 rounded-2xl text-xs text-gray-600 font-medium hover:bg-gray-50 transition-all'>
              <svg className='w-4 h-4' fill='currentColor' viewBox='0 0 24 24'>
                <path d='M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z' />
              </svg>
              Facebook
            </button>
          </div>

          {/* Register Link */}
          <p className='text-center text-xs text-gray-400 mt-6'>
            Don't have an account?{' '}
            <Link to='/register' className='text-blue-600 font-semibold hover:underline'>
              Sign up for free
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;