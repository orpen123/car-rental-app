import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(null);
  const navRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (navRef.current && !navRef.current.contains(e.target)) {
        setDropdownOpen(null);
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
    navigate('/');
  };

  return (
    <nav
      ref={navRef}
      className='fixed top-0 left-0 right-0 z-50 bg-white shadow-sm'
    >
      {/* Main bar */}
      <div className='max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between'>
        {/* Logo — center on mobile, left on desktop */}
        <div className='flex items-center gap-6'>
          <Link
            to='/'
            onClick={() => setMenuOpen(false)}
            className='text-gray-900 font-bold text-base uppercase tracking-wide md:static absolute left-1/2 -translate-x-1/2 md:translate-x-0'
          >
            CarRental
          </Link>

          <a
            href='tel:+1234567890'
            className='hidden lg:flex items-center gap-1.5 text-gray-400 text-xs hover:text-blue-600 transition-colors'
          >
            <svg
              className='w-3.5 h-3.5'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z'
              />
            </svg>
            +1-234-567-890
          </a>
        </div>

        {/* Center — Desktop Nav */}
        <div className='hidden md:flex items-center gap-6 flex-1 justify-center'>
          {[
            {
              label: 'Home',
              key: 'home',
              links: [
                { to: '/', label: 'Home' },
                { to: '/cars', label: 'Browse Cars' },
              ],
            },
            {
              label: 'Listings',
              key: 'listings',
              links: [
                { to: '/cars', label: 'All Cars' },
                ...(user ? [{ to: '/profile', label: 'My Bookings' }] : []),
              ],
            },
            {
              label: 'Blog',
              key: 'blog',
              links: [{ to: '/', label: 'Latest Posts' }],
            },
            {
              label: 'Pages',
              key: 'pages',
              links: [
                { to: '/', label: 'Home' },
                { to: '/cars', label: 'Cars' },
                ...(user?.role === 'admin'
                  ? [{ to: '/admin', label: 'Dashboard' }]
                  : []),
              ],
            },
          ].map((item) => (
            <div key={item.key} className='relative'>
              <button
                className='flex items-center gap-1 text-gray-600 hover:text-blue-600 text-xs font-medium transition-colors'
                onClick={() =>
                  setDropdownOpen(dropdownOpen === item.key ? null : item.key)
                }
              >
                {item.label}
                <svg
                  className={`w-3 h-3 transition-transform duration-200 ${dropdownOpen === item.key ? 'rotate-180' : ''}`}
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M19 9l-7 7-7-7'
                  />
                </svg>
              </button>
              {dropdownOpen === item.key && (
                <div className='absolute top-7 left-0 bg-white shadow-lg rounded-xl py-2 w-40 border border-gray-100 animate-fadeIn'>
                  {item.links.map((link, i) => (
                    <Link
                      key={i}
                      to={link.to}
                      className='block px-4 py-2 text-xs text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-colors'
                      onClick={() => setDropdownOpen(null)}
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
          <Link
            to='/'
            className='text-gray-600 hover:text-blue-600 text-xs font-medium transition-colors'
          >
            About
          </Link>
          <Link
            to='/'
            className='text-gray-600 hover:text-blue-600 text-xs font-medium transition-colors'
          >
            Contact
          </Link>
        </div>

        {/* Right — Desktop */}
        <div className='hidden md:flex items-center gap-4 flex-shrink-0'>
          {user ? (
            <div className='relative'>
              <button
                className='flex items-center gap-2 text-gray-600 hover:text-blue-600 text-xs font-medium transition-colors'
                onClick={() =>
                  setDropdownOpen(dropdownOpen === 'profile' ? null : 'profile')
                }
              >
                <div className='w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold'>
                  {user.name?.charAt(0).toUpperCase()}
                </div>
                <span>{user.name}</span>
                <svg
                  className={`w-3 h-3 transition-transform duration-200 ${dropdownOpen === 'profile' ? 'rotate-180' : ''}`}
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M19 9l-7 7-7-7'
                  />
                </svg>
              </button>
              {dropdownOpen === 'profile' && (
                <div className='absolute top-9 right-0 bg-white shadow-lg rounded-xl py-2 w-44 border border-gray-100 animate-fadeIn'>
                  <Link
                    to='/profile'
                    className='block px-4 py-2 text-xs text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                    onClick={() => setDropdownOpen(null)}
                  >
                    My Profile
                  </Link>
                  {user.role === 'admin' && (
                    <Link
                      to='/admin'
                      className='block px-4 py-2 text-xs text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                      onClick={() => setDropdownOpen(null)}
                    >
                      Admin Dashboard
                    </Link>
                  )}
                  <hr className='my-1 border-gray-100' />
                  <button
                    onClick={handleLogout}
                    className='w-full text-left px-4 py-2 text-xs text-red-500 hover:bg-red-50'
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              to='/login'
              className='flex items-center gap-1.5 text-gray-600 hover:text-blue-600 text-xs font-medium transition-colors'
            >
              <svg
                className='w-3.5 h-3.5'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z'
                />
              </svg>
              Sign in
            </Link>
          )}
          <Link
            to='/cars'
            className='px-4 py-2 border border-gray-800 text-gray-800 text-xs font-semibold rounded-md hover:bg-gray-900 hover:text-white transition-all duration-300'
          >
            Submit Listing
          </Link>
        </div>

        {/* Mobile right — hamburger only */}
        <button
          className='md:hidden flex flex-col justify-center items-center w-8 h-8 flex-shrink-0 gap-1.5'
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label='Toggle menu'
        >
          <span
            className={`block w-5 h-0.5 bg-gray-700 transition-all duration-300 origin-center ${menuOpen ? 'rotate-45 translate-y-2' : ''}`}
          />
          <span
            className={`block w-5 h-0.5 bg-gray-700 transition-all duration-300 ${menuOpen ? 'opacity-0 w-0' : ''}`}
          />
          <span
            className={`block w-5 h-0.5 bg-gray-700 transition-all duration-300 origin-center ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`}
          />
        </button>
      </div>

      {/* Mobile Overlay */}
      <div
        className={`md:hidden fixed inset-x-0 top-[53px] bottom-0 bg-black transition-opacity duration-300 ${menuOpen ? 'opacity-40 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setMenuOpen(false)}
      />

      {/* Mobile Menu Panel */}
      {/* Mobile Menu Panel */}
      <div
        className={`md:hidden fixed left-0 right-0 top-[53px] bg-white shadow-xl overflow-hidden transition-all duration-300 ease-in-out ${menuOpen ? 'max-h-[600px] opacity-100 translate-y-0' : 'max-h-0 opacity-0 -translate-y-2'}`}
      >
        <div className='px-5 py-5 space-y-1'>
          {/* User info */}
          {user && (
            <div className='flex items-center gap-3 pb-4 mb-1 border-b border-gray-100'>
              <div className='w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0'>
                {user.name?.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className='text-sm font-semibold text-gray-900'>
                  {user.name}
                </p>
                <p className='text-xs text-gray-400'>{user.email}</p>
              </div>
            </div>
          )}

          {/* Nav Links */}
          {[
            {
              to: '/',
              label: 'Home',
              icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6',
            },
            {
              to: '/cars',
              label: 'Browse Cars',
              icon: 'M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0zM13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10l2-2h8z',
            },
            {
              to: '/',
              label: 'About',
              icon: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
            },
            {
              to: '/',
              label: 'Contact',
              icon: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
            },
            {
              to: '/',
              label: 'Blog',
              icon: 'M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z',
            },
          ].map((link, i) => (
            <Link
              key={i}
              to={link.to}
              onClick={() => setMenuOpen(false)}
              className='flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-gray-700 font-medium hover:bg-gray-50 hover:text-blue-600 transition-colors duration-150'
            >
              <svg
                className='w-4 h-4 text-gray-300 flex-shrink-0'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d={link.icon}
                />
              </svg>
              {link.label}
            </Link>
          ))}

          {/* User links */}
          {user && (
            <>
              <Link
                to='/profile'
                onClick={() => setMenuOpen(false)}
                className='flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-gray-700 font-medium hover:bg-gray-50 hover:text-blue-600 transition-colors duration-150'
              >
                <svg
                  className='w-4 h-4 text-gray-300'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z'
                  />
                </svg>
                My Profile
              </Link>
              {user.role === 'admin' && (
                <Link
                  to='/admin'
                  onClick={() => setMenuOpen(false)}
                  className='flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-gray-700 font-medium hover:bg-gray-50 hover:text-blue-600 transition-colors duration-150'
                >
                  <svg
                    className='w-4 h-4 text-gray-300'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z'
                    />
                  </svg>
                  Admin Dashboard
                </Link>
              )}
            </>
          )}

          {/* Bottom */}
          <div className='pt-3 mt-1 border-t border-gray-100 space-y-2'>
            {user ? (
              <button
                onClick={handleLogout}
                className='w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-red-500 font-medium hover:bg-red-50 transition-colors duration-150'
              >
                <svg
                  className='w-4 h-4'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1'
                  />
                </svg>
                Logout
              </button>
            ) : (
              <div className='flex flex-col gap-2'>
                <Link
                  to='/login'
                  onClick={() => setMenuOpen(false)}
                  className='w-full text-center py-2.5 rounded-xl text-sm font-semibold text-blue-600 border border-blue-100 bg-blue-50 hover:bg-blue-100 transition-colors duration-150'
                >
                  Sign In
                </Link>
                <Link
                  to='/register'
                  onClick={() => setMenuOpen(false)}
                  className='w-full text-center py-2.5 rounded-xl text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-150'
                >
                  Create Account
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
