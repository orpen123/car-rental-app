
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FaCar, FaClipboardList, FaCheckCircle, FaDollarSign, 
  FaStar, FaPlus, FaEye, FaUser, FaChevronRight, FaArrowRight,
  FaHourglassHalf, FaRegStar
} from 'react-icons/fa';
import api from '../../services/api.js';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalCars: 0,
    availableCars: 0,
    totalBookings: 0,
    pendingBookings: 0,
    confirmedBookings: 0,
    totalRevenue: 0,
    totalReviews: 0,
    avgRating: 0,
  });
  const [recentBookings, setRecentBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [carsRes, bookingsRes, reviewsRes] = await Promise.all([
          api.get('/cars'),
          api.get('/bookings'),
          api.get('/reviews'),
        ]);
        const cars = carsRes.data;
        const bookings = bookingsRes.data;
        const reviews = reviewsRes.data;
        const avgRating = reviews.length
          ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
          : 0;
        setStats({
          totalCars: cars.length,
          availableCars: cars.filter(c => c.available).length,
          totalBookings: bookings.length,
          pendingBookings: bookings.filter(b => b.status === 'pending').length,
          confirmedBookings: bookings.filter(b => b.status === 'confirmed').length,
          totalRevenue: bookings.reduce((sum, b) => sum + b.totalPrice, 0),
          totalReviews: reviews.length,
          avgRating,
        });
        setRecentBookings(bookings.slice(0, 5));
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return 'bg-emerald-100 text-emerald-700';
      case 'pending': return 'bg-amber-100 text-amber-700';
      case 'cancelled': return 'bg-rose-100 text-rose-700';
      case 'completed': return 'bg-blue-100 text-blue-700';
      default: return 'bg-slate-100 text-slate-600';
    }
  };

  const statCards = [
    { label: 'Total Cars', value: stats.totalCars, icon: <FaCar />, bg: 'bg-blue-50', text: 'text-blue-600' },
    { label: 'Total Bookings', value: stats.totalBookings, icon: <FaClipboardList />, bg: 'bg-indigo-50', text: 'text-indigo-600' },
    { label: 'Confirmed', value: stats.confirmedBookings, icon: <FaCheckCircle />, bg: 'bg-emerald-50', text: 'text-emerald-600' },
    { label: 'Revenue', value: `$${stats.totalRevenue.toLocaleString()}`, icon: <FaDollarSign />, bg: 'bg-amber-50', text: 'text-amber-600' },
    { label: 'Reviews', value: stats.totalReviews, icon: <FaStar />, bg: 'bg-orange-50', text: 'text-orange-600' },
  ];

  if (loading) {
    return (
      <div className='min-h-screen bg-[#f8fafc] flex items-center justify-center'>
        <div className='w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin' />
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-[#f8fafc] pt-24 pb-12'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6'>
        
        {}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8'
        >
          <div>
            <h1 className='text-3xl font-extrabold text-slate-900 tracking-tight'>Admin Dashboard</h1>
            <p className='text-slate-500 text-sm mt-1'>Real-time overview of your rental business.</p>
          </div>
          {}
        </motion.div>

        {}
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8'>
          {statCards.map((card, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -5 }}
              className='bg-white rounded-3xl p-6 shadow-sm border border-slate-100'
            >
              <div className={`w-12 h-12 rounded-2xl ${card.bg} ${card.text} flex items-center justify-center text-xl mb-4`}>
                {card.icon}
              </div>
              <h3 className='text-slate-500 text-xs font-bold uppercase tracking-widest'>{card.label}</h3>
              <p className='text-2xl font-black text-slate-900 mt-1'>{card.value}</p>
            </motion.div>
          ))}
        </div>

        <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
          
          {}
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className='lg:col-span-2 bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden'
          >
            <div className='flex items-center justify-between px-8 py-6 border-b border-slate-50'>
              <h2 className='text-lg font-bold text-slate-900'>Recent Bookings</h2>
              <Link to='/admin/bookings' className='text-xs font-bold text-indigo-600 hover:gap-2 flex items-center gap-1 transition-all'>
                View all <FaChevronRight size={10} />
              </Link>
            </div>

            <div className='divide-y divide-slate-50'>
              {recentBookings.length === 0 ? (
                <div className='py-20 text-center flex flex-col items-center'>
                  <FaClipboardList className='text-slate-100 text-6xl mb-4' />
                  <p className='text-slate-400 font-medium'>No active bookings found.</p>
                </div>
              ) : (
                recentBookings.map((booking) => (
                  <div key={booking._id} className='flex items-center gap-4 px-8 py-5 hover:bg-slate-50/50 transition-colors'>
                    <div className='w-16 h-12 rounded-2xl bg-slate-100 overflow-hidden flex-shrink-0 border border-slate-200'>
                      {booking.car?.images?.[0] ? (
                        <img src={booking.car.images[0]} alt='' className='w-full h-full object-cover' />
                      ) : (
                        <div className='w-full h-full flex items-center justify-center text-slate-300'><FaCar /></div>
                      )}
                    </div>
                    <div className='flex-1 min-w-0'>
                      <p className='text-sm font-bold text-slate-900 truncate'>
                        {booking.car?.brand} {booking.car?.model}
                      </p>
                      <p className='text-[11px] text-slate-500 flex items-center gap-2 mt-1 uppercase font-bold tracking-tighter'>
                        <FaUser className='text-slate-300' /> {booking.user?.name} 
                        <span className='text-slate-200 text-[8px]'>●</span>
                        {new Date(booking.startDate).toLocaleDateString()}
                      </p>
                    </div>
                    <div className='flex flex-col items-end gap-2'>
                      <span className={`text-[10px] px-3 py-1 rounded-xl font-black uppercase tracking-widest ${getStatusColor(booking.status)}`}>
                        {booking.status}
                      </span>
                      <span className='text-sm font-black text-slate-900'>${booking.totalPrice}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </motion.div>

          {}
          <div className='space-y-6'>
            
            {}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className='bg-white rounded-[2rem] shadow-sm border border-slate-100 p-8'>
              <h2 className='text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-6'>Quick Actions</h2>
              <div className='space-y-3'>
                {[
                  { to: '/admin/cars', label: 'Manage Fleet', icon: <FaCar />, color: 'bg-blue-50 text-blue-600' },
                  { to: '/admin/bookings', label: 'View Schedule', icon: <FaClipboardList />, color: 'bg-indigo-50 text-indigo-600' },
                  { to: '/admin/reviews', label: 'User Feedback', icon: <FaStar />, color: 'bg-orange-50 text-orange-600' },
                  { to: '/profile', label: 'Admin Settings', icon: <FaUser />, color: 'bg-slate-50 text-slate-600' },
                ].map((action, i) => (
                  <Link key={i} to={action.to} className='flex items-center gap-4 p-3 rounded-2xl hover:bg-slate-50 transition-all group'>
                    <div className={`w-10 h-10 rounded-xl ${action.color} flex items-center justify-center text-sm`}>{action.icon}</div>
                    <span className='text-sm font-bold text-slate-700 group-hover:text-slate-900'>{action.label}</span>
                    <FaArrowRight size={12} className='ml-auto text-slate-200 group-hover:translate-x-1 group-hover:text-indigo-500 transition-all' />
                  </Link>
                ))}
              </div>
            </motion.div>

            {}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} className='bg-white rounded-[2rem] shadow-sm border border-slate-100 p-8'>
              <h2 className='text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-6'>Fleet Utilization</h2>
              <div className='space-y-6'>
                <div className='space-y-2'>
                  <div className='flex justify-between text-xs font-bold'>
                    <span className='text-slate-500'>AVAILABLE</span>
                    <span className='text-emerald-600'>{stats.availableCars}</span>
                  </div>
                  <div className='w-full h-1.5 bg-slate-100 rounded-full overflow-hidden'>
                    <motion.div initial={{ width: 0 }} animate={{ width: stats.totalCars ? `${(stats.availableCars / stats.totalCars) * 100}%` : '0%' }} className='h-full bg-emerald-500' />
                  </div>
                </div>
                <div className='space-y-2'>
                  <div className='flex justify-between text-xs font-bold'>
                    <span className='text-slate-500'>BOOKED</span>
                    <span className='text-indigo-600'>{stats.totalCars - stats.availableCars}</span>
                  </div>
                  <div className='w-full h-1.5 bg-slate-100 rounded-full overflow-hidden'>
                    <motion.div initial={{ width: 0 }} animate={{ width: stats.totalCars ? `${((stats.totalCars - stats.availableCars) / stats.totalCars) * 100}%` : '0%' }} className='h-full bg-indigo-500' />
                  </div>
                </div>
              </div>
            </motion.div>

            {}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className='bg-white rounded-[2rem] shadow-sm border border-slate-100 p-8'>
              <h2 className='text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-6'>Stats Overview</h2>
              <div className='space-y-4'>
                {[
                  { label: 'Pending', value: stats.pendingBookings, color: 'text-amber-600 bg-amber-50', icon: <FaHourglassHalf /> },
                  { label: 'Confirmed', value: stats.confirmedBookings, color: 'text-emerald-600 bg-emerald-50', icon: <FaCheckCircle /> },
                  { label: 'Total Bookings', value: stats.totalBookings, color: 'text-blue-600 bg-blue-50', icon: <FaClipboardList /> },
                  { label: 'Total Reviews', value: stats.totalReviews, color: 'text-orange-600 bg-orange-50', icon: <FaRegStar /> },
                  { label: 'Avg Rating', value: `${stats.avgRating} / 5`, color: 'text-rose-600 bg-rose-50', icon: <FaStar /> },
                ].map((s, i) => (
                  <div key={i} className='flex items-center justify-between group cursor-default'>
                    <div className='flex items-center gap-3'>
                      <span className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs ${s.color}`}>{s.icon}</span>
                      <span className='text-xs font-bold text-slate-500'>{s.label}</span>
                    </div>
                    <span className={`text-xs font-black px-3 py-1 rounded-xl shadow-sm ${s.color}`}>
                      {s.value}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;