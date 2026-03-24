import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { 
  FaHome, 
  FaCar, 
  FaInfoCircle, 
  FaEnvelope, 
  FaUser, 
  FaTachometerAlt, 
  FaCalendarAlt, 
  FaStar, 
  FaSignOutAlt, 
  FaChevronDown, 
} from 'react-icons/fa';
import { FiX, FiMenu } from 'react-icons/fi';



const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
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

  useEffect(() => {
    setMenuOpen(false);
    setDropdownOpen(null);
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  const navItems = [
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
      label: 'Pages',
      key: 'pages',
      links: [
        { to: '/', label: 'Home' },
        { to: '/cars', label: 'Cars' },
        ...(user?.role === 'admin'
          ? [
              { to: '/admin', label: 'Dashboard' },
              { to: '/admin/bookings', label: 'Bookings' },
              { to: '/admin/reviews', label: 'Reviews' },
            ]
          : []),
      ],
    },
  ];

  const mobileLinks = [
    { to: '/', label: 'Home', icon: FaHome },
    { to: '/cars', label: 'Browse Cars', icon: FaCar },
    { to: '/about', label: 'About', icon: FaInfoCircle },
    { to: '/contact', label: 'Contact', icon: FaEnvelope },
  ];

  return (
    <nav
      ref={navRef}
      className='fixed top-0 left-0 right-0 z-50 bg-white shadow-sm'
    >
      {/* Main bar */}
      <div className='max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between'>
        {/* Logo */}
        <div className='flex items-center gap-6'>
          <Link
            to='/'
            onClick={() => setMenuOpen(false)}
            className='text-gray-900 font-black text-sm uppercase tracking-widest hover:text-blue-600 transition-colors md:static absolute left-1/2 -translate-x-1/2 md:translate-x-0'
          >
            Car<span className='text-blue-600'>Rental</span>
          </Link>
        </div>

        {/* Center — Desktop Nav (no icons) */}
        <div className='hidden md:flex items-center gap-1 flex-1 justify-center'>
          {navItems.map((item) => (
            <div key={item.key} className='relative'>
              <button
                onClick={() =>
                  setDropdownOpen(dropdownOpen === item.key ? null : item.key)
                }
                className={`flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                  dropdownOpen === item.key
                    ? 'text-blue-600 bg-blue-50'
                    : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
                }`}
              >
                {item.label}
                <FaChevronDown
                  className={`w-3 h-3 transition-transform duration-200 ${
                    dropdownOpen === item.key ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {dropdownOpen === item.key && (
                <div className='absolute top-full left-0 mt-1 bg-white shadow-xl rounded-2xl py-2 w-44 border border-gray-100 z-50 animate-fadeIn'>
                  {item.links.map((link, i) => (
                    <Link
                      key={i}
                      to={link.to}
                      onClick={() => setDropdownOpen(null)}
                      className={`block px-4 py-2.5 text-xs font-medium transition-colors ${
                        isActive(link.to)
                          ? 'text-blue-600 bg-blue-50'
                          : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                      }`}
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}

          <Link
            to='/about'
            className='px-3 py-2 rounded-xl text-xs font-medium text-gray-600 hover:text-blue-600 hover:bg-gray-50 transition-all'
          >
            About
          </Link>
          <Link
            to='/contact'
            className='px-3 py-2 rounded-xl text-xs font-medium text-gray-600 hover:text-blue-600 hover:bg-gray-50 transition-all'
          >
            Contact
          </Link>
        </div>

        {/* Right — Desktop (with icons) */}
        <div className='hidden md:flex items-center gap-3 flex-shrink-0'>
          {user ? (
            <div className='relative'>
              <button
                onClick={() =>
                  setDropdownOpen(dropdownOpen === 'profile' ? null : 'profile')
                }
                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                  dropdownOpen === 'profile'
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <div className='w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white text-xs font-bold'>
                  {user.name?.charAt(0).toUpperCase()}
                </div>
                <span className='max-w-[80px] truncate'>{user.name}</span>
                <FaChevronDown
                  className={`w-3 h-3 transition-transform duration-200 ${
                    dropdownOpen === 'profile' ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {dropdownOpen === 'profile' && (
                <div className='absolute top-full right-0 mt-1 bg-white shadow-xl rounded-2xl py-2 w-48 border border-gray-100 z-50 animate-fadeIn'>
                  {/* User info */}
                  <div className='px-4 py-2 mb-1 border-b border-gray-50'>
                    <p className='text-xs font-bold text-gray-900 truncate'>
                      {user.name}
                    </p>
                    <p className='text-xs text-gray-400 truncate'>
                      {user.email}
                    </p>
                  </div>

                  <Link
                    to='/profile'
                    onClick={() => setDropdownOpen(null)}
                    className={`flex items-center gap-2.5 px-4 py-2.5 text-xs font-medium transition-colors ${
                      isActive('/profile')
                        ? 'text-blue-600 bg-blue-50'
                        : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                    }`}
                  >
                    <FaUser className='w-3.5 h-3.5 text-gray-400' />
                    My Profile
                  </Link>

                  {user.role === 'admin' && (
                    <>
                      <Link
                        to='/admin'
                        onClick={() => setDropdownOpen(null)}
                        className={`flex items-center gap-2.5 px-4 py-2.5 text-xs font-medium transition-colors ${
                          isActive('/admin')
                            ? 'text-blue-600 bg-blue-50'
                            : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                        }`}
                      >
                        <FaTachometerAlt className='w-3.5 h-3.5 text-gray-400' />
                        Admin Dashboard
                      </Link>
                      <Link
                        to='/admin/bookings'
                        onClick={() => setDropdownOpen(null)}
                        className={`flex items-center gap-2.5 px-4 py-2.5 text-xs font-medium transition-colors ${
                          isActive('/admin/bookings')
                            ? 'text-blue-600 bg-blue-50'
                            : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                        }`}
                      >
                        <FaCalendarAlt className='w-3.5 h-3.5 text-gray-400' />
                        Manage Bookings
                      </Link>
                      <Link
                        to='/admin/reviews'
                        onClick={() => setDropdownOpen(null)}
                        className={`flex items-center gap-2.5 px-4 py-2.5 text-xs font-medium transition-colors ${
                          isActive('/admin/reviews')
                            ? 'text-orange-600 bg-orange-50'
                            : 'text-gray-600 hover:text-orange-600 hover:bg-orange-50'
                        }`}
                      >
                        <FaStar className='w-3.5 h-3.5' />
                        Manage Reviews
                      </Link>
                    </>
                  )}

                  <div className='border-t border-gray-50 mt-1 pt-1'>
                    <button
                      onClick={handleLogout}
                      className='w-full flex items-center gap-2.5 px-4 py-2.5 text-xs text-red-500 hover:bg-red-50 transition-colors font-medium'
                    >
                      <FaSignOutAlt className='w-3.5 h-3.5' />
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link
              to='/login'
              className='flex items-center gap-1.5 text-gray-600 hover:text-blue-600 text-xs font-medium transition-colors px-3 py-2 rounded-xl hover:bg-gray-50'
            >
              <FaUser className='w-3.5 h-3.5' />
              Sign in
            </Link>
          )}

          <Link
            to='/cars'
            className='px-4 py-2 bg-gray-900 hover:bg-blue-600 text-white text-xs font-semibold rounded-xl transition-all duration-300 flex items-center gap-1.5'
          >
            <FaCar className='w-3.5 h-3.5' />
            Browse Cars
          </Link>
        </div>

        {/* Mobile hamburger - Improved */}
        <button
          className='md:hidden flex items-center justify-center w-8 h-8 flex-shrink-0'
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label='Toggle menu'
        >
          {/* {menuOpen ? (
            <FaTimes className='w-5 h-5 text-gray-500 hover:text-gray-700 transition-colors' />
            
          ) : (
            <FaBarsStaggered className='w-5 h-5 text-gray-500 hover:text-gray-700 transition-colors' />
          )} */}
          {menuOpen ? (
  <FiX className='w-5 h-5 text-gray-500 hover:text-gray-700 transition-colors' />
) : (
  <FiMenu className='w-5 h-5 text-gray-500 hover:text-gray-700 transition-colors' />
)}
        </button>
      </div>

      {/* Mobile Overlay */}
      <div
        className={`md:hidden fixed inset-x-0 top-[53px] bottom-0 bg-black/40 backdrop-blur-sm transition-all duration-300 z-40 ${
          menuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setMenuOpen(false)}
      />

      {/* Mobile Menu - Slides down from navbar bottom */}
      <div
        className={`md:hidden fixed left-0 right-0 bg-white shadow-xl transition-all duration-300 ease-in-out z-50 ${
          menuOpen 
            ? 'opacity-100 translate-y-0' 
            : 'opacity-0 -translate-y-full pointer-events-none'
        }`}
        style={{ top: '53px' }}
      >
        {/* Scrollable Container */}
        <div className='max-h-[calc(100vh-53px)] overflow-y-auto overscroll-contain'>
          <div className='px-5 py-5 space-y-1'>
            {/* User Card */}
            {user && (
              <div className='flex items-center gap-3 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl mb-3'>
                <div className='w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white font-bold text-sm flex-shrink-0'>
                  {user.name?.charAt(0).toUpperCase()}
                </div>
                <div className='min-w-0 flex-1'>
                  <p className='text-sm font-bold text-gray-900 truncate'>
                    {user.name}
                  </p>
                  <p className='text-xs text-gray-500 truncate'>{user.email}</p>
                </div>
                {user.role === 'admin' && (
                  <span className='text-xs bg-blue-600 text-white px-2 py-0.5 rounded-full font-semibold flex-shrink-0'>
                    Admin
                  </span>
                )}
              </div>
            )}

            {/* Nav Links with Icons */}
            {mobileLinks.map((link, i) => {
              const Icon = link.icon;
              return (
                <Link
                  key={i}
                  to={link.to}
                  onClick={() => setMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                    isActive(link.to)
                      ? 'text-blue-600 bg-blue-50'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-blue-600'
                  }`}
                >
                  <Icon className='w-4 h-4 text-gray-300 flex-shrink-0' />
                  {link.label}
                </Link>
              );
            })}

            {/* User Links */}
            {user && (
              <>
                <div className='h-px bg-gray-100 my-2' />
                <Link
                  to='/profile'
                  onClick={() => setMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                    isActive('/profile')
                      ? 'text-blue-600 bg-blue-50'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-blue-600'
                  }`}
                >
                  <FaUser className='w-4 h-4 text-gray-300' />
                  My Profile
                </Link>

                {user.role === 'admin' && (
                  <>
                    <Link
                      to='/admin'
                      onClick={() => setMenuOpen(false)}
                      className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                        isActive('/admin')
                          ? 'text-blue-600 bg-blue-50'
                          : 'text-gray-700 hover:bg-gray-50 hover:text-blue-600'
                      }`}
                    >
                      <FaTachometerAlt className='w-4 h-4 text-gray-300' />
                      Admin Dashboard
                    </Link>
                    <Link
                      to='/admin/bookings'
                      onClick={() => setMenuOpen(false)}
                      className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                        isActive('/admin/bookings')
                          ? 'text-blue-600 bg-blue-50'
                          : 'text-gray-700 hover:bg-gray-50 hover:text-blue-600'
                      }`}
                    >
                      <FaCalendarAlt className='w-4 h-4 text-gray-300' />
                      Manage Bookings
                    </Link>
                    <Link
                      to='/admin/reviews'
                      onClick={() => setMenuOpen(false)}
                      className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                        isActive('/admin/reviews')
                          ? 'text-orange-600 bg-orange-50'
                          : 'text-gray-700 hover:bg-orange-50 hover:text-orange-600'
                      }`}
                    >
                      <FaStar className='w-4 h-4' />
                      Manage Reviews
                    </Link>
                  </>
                )}
              </>
            )}

            {/* Bottom */}
            <div className='pt-3 mt-1 border-t border-gray-100 space-y-2'>
              {user ? (
                <button
                  onClick={handleLogout}
                  className='w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-red-500 font-medium hover:bg-red-50 transition-colors'
                >
                  <FaSignOutAlt className='w-4 h-4' />
                  Logout
                </button>
              ) : (
                <div className='flex flex-col gap-2'>
                  <Link
                    to='/login'
                    onClick={() => setMenuOpen(false)}
                    className='w-full text-center py-2.5 rounded-xl text-sm font-semibold text-blue-600 border border-blue-100 bg-blue-50 hover:bg-blue-100 transition-colors'
                  >
                    Sign In
                  </Link>
                  <Link
                    to='/register'
                    onClick={() => setMenuOpen(false)}
                    className='w-full text-center py-2.5 rounded-xl text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-colors'
                  >
                    Create Account
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;