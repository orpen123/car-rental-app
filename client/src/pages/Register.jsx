import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import api from '../services/api.js';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
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
    if (formData.password !== formData.confirmPassword) {
      return setError('Passwords do not match');
    }
    if (formData.password.length < 6) {
      return setError('Password must be at least 6 characters');
    }
    setLoading(true);
    try {
      const res = await api.post('/auth/register', {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
      });
      login(res.data);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
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
              Create account
            </h2>
            <p className='text-gray-400 text-sm'>
              Join us and find your dream car today
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

            {/* Name */}
            <div>
              <label className='block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide'>
                Full Name
              </label>
              <input
                type='text'
                name='name'
                value={formData.name}
                onChange={handleChange}
                placeholder='John Doe'
                className='w-full px-4 py-3 bg-gray-50 rounded-2xl text-sm text-gray-800 outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all placeholder-gray-300'
                required
              />
            </div>

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

            {/* Phone */}
            <div>
              <label className='block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide'>
                Phone
              </label>
              <input
                type='tel'
                name='phone'
                value={formData.phone}
                onChange={handleChange}
                placeholder='+1 234 567 890'
                className='w-full px-4 py-3 bg-gray-50 rounded-2xl text-sm text-gray-800 outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all placeholder-gray-300'
              />
            </div>

            {/* Password */}
            <div>
              <label className='block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide'>
                Password
              </label>
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

            {/* Confirm Password */}
            <div>
              <label className='block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide'>
                Confirm Password
              </label>
              <input
                type='password'
                name='confirmPassword'
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder='••••••••'
                className='w-full px-4 py-3 bg-gray-50 rounded-2xl text-sm text-gray-800 outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all placeholder-gray-300'
                required
              />
            </div>

            {/* Terms */}
            <div className='flex items-start gap-2.5 pt-1'>
              <input
                type='checkbox'
                id='terms'
                className='mt-0.5 w-4 h-4 accent-blue-600 flex-shrink-0'
                required
              />
              <label htmlFor='terms' className='text-xs text-gray-400 leading-relaxed'>
                I agree to the{' '}
                <a href='#' className='text-blue-600 hover:underline'>Terms of Service</a>
                {' '}and{' '}
                <a href='#' className='text-blue-600 hover:underline'>Privacy Policy</a>
              </label>
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
                  Creating account...
                </span>
              ) : 'Create Account'}
            </button>
          </div>

          {/* Login Link */}
          <p className='text-center text-xs text-gray-400 mt-6'>
            Already have an account?{' '}
            <Link to='/login' className='text-blue-600 font-semibold hover:underline'>
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
