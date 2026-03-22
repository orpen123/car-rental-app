import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import Home from './pages/Home.jsx';
import Cars from './pages/Cars.jsx';
import CarDetail from './pages/CarDetail.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Profile from './pages/Profile.jsx';
import Booking from './pages/Booking.jsx';
import Dashboard from './pages/admin/Dashboard.jsx';
import ManageCars from './pages/admin/ManageCars.jsx';
import ManageBookings from './pages/admin/ManageBookings.jsx';
import { useAuth } from './context/AuthContext.jsx';
import { Navigate } from 'react-router-dom';
import NotFound from './pages/NotFound.jsx';

// Protected Route — must be logged in
const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to='/login' replace />;
};

// Admin Route — must be admin
const AdminRoute = ({ children }) => {
  const { user } = useAuth();
  return user && user.role === 'admin' ? children : <Navigate to='/' replace />;
};

// Public Route — redirect to home if already logged in
const PublicRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? <Navigate to='/' replace /> : children;
};

function App() {
  return (
    <div className='flex flex-col min-h-screen'>
      <Navbar />
      <main className='flex-grow'>
        <Routes>
          {/* Public — accessible by everyone */}
          <Route path='/' element={<Home />} />
          <Route path='/cars' element={<Cars />} />
          <Route path='/cars/:id' element={<CarDetail />} />
          <Route path='*' element={<NotFound />} />

          {/* Public — redirect if already logged in */}
          <Route
            path='/login'
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />
          <Route
            path='/register'
            element={
              <PublicRoute>
                <Register />
              </PublicRoute>
            }
          />

          {/* Protected — must be logged in */}
          <Route
            path='/profile'
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path='/booking/:id'
            element={
              <ProtectedRoute>
                <Booking />
              </ProtectedRoute>
            }
          />

          {/* Admin — must be admin */}
          <Route
            path='/admin'
            element={
              <AdminRoute>
                <Dashboard />
              </AdminRoute>
            }
          />
          <Route
            path='/admin/cars'
            element={
              <AdminRoute>
                <ManageCars />
              </AdminRoute>
            }
          />
          <Route
            path='/admin/bookings'
            element={
              <AdminRoute>
                <ManageBookings />
              </AdminRoute>
            }
          />
        </Routes>
      </main>
      <Footer />
      {/* WhatsApp Floating Button */}

      {/* WhatsApp Floating Button */}

      <a
        href='https://wa.me/212606383278'
        target='_blank'
        rel='noopener noreferrer'
        className='fixed bottom-6 right-5 z-50 group flex items-center justify-end'
        aria-label='Chat on WhatsApp'
      >
        {/* Tooltip */}

        <div className='flex items-center gap-2 mr-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0'>
          <div className='bg-white rounded-2xl shadow-lg px-3 py-2 flex flex-col items-start'>
            <span className='text-xs font-bold text-gray-900'>Need help?</span>

            <span className='text-xs text-gray-400'>Chat with us</span>
          </div>

          {/* Arrow */}

          <div className='w-2 h-2 bg-white rotate-45 shadow-sm -ml-3 mt-0.5' />
        </div>

        {/* Button */}

        <div className='relative'>
          {/* Ping animation */}

          <span className='absolute inset-0 rounded-full bg-green-400 animate-ping opacity-20' />

          <div className='relative w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 hover:from-green-500 hover:to-green-700 text-white rounded-full shadow-lg shadow-green-200 hover:shadow-xl hover:shadow-green-300 flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95'>
            <svg className='w-6 h-6' fill='currentColor' viewBox='0 0 24 24'>
              <path d='M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z' />
            </svg>
          </div>
        </div>
      </a>
    </div>
  );
}

export default App;
