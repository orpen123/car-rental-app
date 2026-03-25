// import { useEffect, useState } from 'react';
// import { Link } from 'react-router-dom';
// import api from '../../services/api.js';

// const Dashboard = () => {
//   const [stats, setStats] = useState({
//     totalCars: 0,
//     availableCars: 0,
//     totalBookings: 0,
//     pendingBookings: 0,
//     confirmedBookings: 0,
//     totalRevenue: 0,
//     totalReviews: 0,
//     avgRating: 0,
//   });
//   const [recentBookings, setRecentBookings] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const [carsRes, bookingsRes, reviewsRes] = await Promise.all([
//           api.get('/cars'),
//           api.get('/bookings'),
//           api.get('/reviews'),
//         ]);
//         const cars = carsRes.data;
//         const bookings = bookingsRes.data;
//         const reviews = reviewsRes.data;
//         const avgRating = reviews.length
//           ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
//           : 0;
//         setStats({
//           totalCars: cars.length,
//           availableCars: cars.filter(c => c.available).length,
//           totalBookings: bookings.length,
//           pendingBookings: bookings.filter(b => b.status === 'pending').length,
//           confirmedBookings: bookings.filter(b => b.status === 'confirmed').length,
//           totalRevenue: bookings.reduce((sum, b) => sum + b.totalPrice, 0),
//           totalReviews: reviews.length,
//           avgRating,
//         });
//         setRecentBookings(bookings.slice(0, 5));
//       } catch (error) {
//         console.error(error);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchData();
//   }, []);

//   const getStatusColor = (status) => {
//     switch (status) {
//       case 'confirmed': return 'bg-green-100 text-green-600';
//       case 'pending': return 'bg-yellow-100 text-yellow-600';
//       case 'cancelled': return 'bg-red-100 text-red-500';
//       case 'completed': return 'bg-blue-100 text-blue-600';
//       default: return 'bg-gray-100 text-gray-500';
//     }
//   };

//   const statCards = [
//     {
//       label: 'Total Cars',
//       value: stats.totalCars,
//       icon: '🚗',
//       bg: 'bg-blue-50',
//       text: 'text-blue-600',
//       sub: `${stats.availableCars} available`,
//       subColor: 'text-blue-400',
//     },
//     {
//       label: 'Total Bookings',
//       value: stats.totalBookings,
//       icon: '📋',
//       bg: 'bg-purple-50',
//       text: 'text-purple-600',
//       sub: `${stats.pendingBookings} pending`,
//       subColor: 'text-purple-400',
//     },
//     {
//       label: 'Confirmed',
//       value: stats.confirmedBookings,
//       icon: '✅',
//       bg: 'bg-green-50',
//       text: 'text-green-600',
//       sub: 'Active bookings',
//       subColor: 'text-green-400',
//     },
//     {
//       label: 'Revenue',
//       value: `$${stats.totalRevenue}`,
//       icon: '💰',
//       bg: 'bg-yellow-50',
//       text: 'text-yellow-600',
//       sub: 'Total earnings',
//       subColor: 'text-yellow-400',
//     },
//     {
//       label: 'Reviews',
//       value: stats.totalReviews,
//       icon: '⭐',
//       bg: 'bg-orange-50',
//       text: 'text-orange-500',
//       sub: `Avg ${stats.avgRating} / 5`,
//       subColor: 'text-orange-400',
//     },
//   ];

//   if (loading) {
//     return (
//       <div className='min-h-screen bg-[#eaecf5] flex items-center justify-center'>
//         <div className='w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin' />
//       </div>
//     );
//   }

//   return (
//     <div className='min-h-screen bg-[#eaecf5] pt-20 pb-10'>
//       <div className='max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8'>

//         {/* Header */}
//         <div className='mb-6'>
//           <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3'>
//             <div>
//               <p className='text-blue-600 uppercase tracking-widest text-xs font-semibold mb-1'>Admin</p>
//               <h1 className='text-2xl sm:text-3xl font-bold text-gray-900'>Dashboard</h1>
//             </div>
//             <div className='flex items-center gap-2 flex-wrap'>
//               <Link
//                 to='/admin/cars'
//                 className='flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl transition-colors'
//               >
//                 🚗 Manage Cars
//               </Link>
//               <Link
//                 to='/admin/bookings'
//                 className='flex items-center gap-1.5 px-4 py-2 bg-white hover:bg-gray-50 text-gray-700 text-xs font-semibold rounded-xl border border-gray-200 transition-colors'
//               >
//                 📋 Bookings
//               </Link>
//               <Link
//                 to='/admin/reviews'
//                 className='flex items-center gap-1.5 px-4 py-2 bg-orange-50 hover:bg-orange-100 text-orange-600 text-xs font-semibold rounded-xl border border-orange-100 transition-colors'
//               >
//                 ⭐ Reviews
//               </Link>
//             </div>
//           </div>
//         </div>

//         {/* Stat Cards */}
//         <div className='grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4 mb-6'>
//           {statCards.map((card, i) => (
//             <div
//               key={i}
//               className='bg-white rounded-2xl shadow-sm p-4 sm:p-5 hover:shadow-md transition-shadow'
//               style={{ animation: `fadeSlideUp 0.5s ease-out ${i * 0.1}s both` }}
//             >
//               <div className={`w-10 h-10 rounded-xl ${card.bg} flex items-center justify-center text-lg mb-3`}>
//                 {card.icon}
//               </div>
//               <p className={`text-2xl sm:text-3xl font-black mb-0.5 ${card.text}`}>
//                 {card.value}
//               </p>
//               <p className='text-xs font-semibold text-gray-700'>{card.label}</p>
//               <p className={`text-xs mt-0.5 ${card.subColor}`}>{card.sub}</p>
//             </div>
//           ))}
//         </div>

//         <div className='grid grid-cols-1 lg:grid-cols-3 gap-5'>

//           {/* Recent Bookings */}
//           <div
//             className='lg:col-span-2 bg-white rounded-2xl shadow-sm overflow-hidden'
//             style={{ animation: 'fadeSlideUp 0.5s ease-out 0.2s both' }}
//           >
//             <div className='flex items-center justify-between px-5 py-4 border-b border-gray-50'>
//               <h2 className='text-sm font-bold text-gray-900'>Recent Bookings</h2>
//               <Link to='/admin/bookings' className='text-xs text-blue-600 hover:underline font-medium'>
//                 View all →
//               </Link>
//             </div>

//             {recentBookings.length === 0 ? (
//               <div className='flex flex-col items-center justify-center h-40 text-center px-5'>
//                 <p className='text-gray-300 text-3xl mb-2'>📋</p>
//                 <p className='text-gray-400 text-sm font-medium'>No bookings yet</p>
//               </div>
//             ) : (
//               <div className='divide-y divide-gray-50'>
//                 {recentBookings.map((booking) => (
//                   <div key={booking._id} className='flex items-center gap-3 px-5 py-3.5 hover:bg-gray-50 transition-colors'>
//                     <div className='w-12 h-10 rounded-xl bg-[#eaecf5] overflow-hidden flex-shrink-0'>
//                       {booking.car?.images?.[0] ? (
//                         <img src={booking.car.images[0]} alt='' className='w-full h-full object-cover' />
//                       ) : (
//                         <div className='w-full h-full flex items-center justify-center text-gray-300 text-xs'>🚗</div>
//                       )}
//                     </div>
//                     <div className='flex-1 min-w-0'>
//                       <p className='text-xs font-semibold text-gray-900 truncate'>
//                         {booking.car?.brand} {booking.car?.model}
//                       </p>
//                       <p className='text-xs text-gray-400 truncate'>
//                         👤 {booking.user?.name} • 📅 {new Date(booking.startDate).toLocaleDateString()}
//                       </p>
//                     </div>
//                     <div className='flex flex-col items-end gap-1 flex-shrink-0'>
//                       <span className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize ${getStatusColor(booking.status)}`}>
//                         {booking.status}
//                       </span>
//                       <span className='text-xs font-bold text-blue-600'>${booking.totalPrice}</span>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>

//           {/* Right side */}
//           <div
//             className='space-y-4'
//             style={{ animation: 'fadeSlideUp 0.5s ease-out 0.3s both' }}
//           >
//             {/* Quick Actions */}
//             <div className='bg-white rounded-2xl shadow-sm p-5'>
//               <h2 className='text-sm font-bold text-gray-900 mb-3'>Quick Actions</h2>
//               <div className='space-y-2'>
//                 {[
//                   { to: '/admin/cars', label: 'Add New Car', icon: '🚗', color: 'bg-blue-50 hover:bg-blue-100 text-blue-600' },
//                   { to: '/admin/bookings', label: 'View Bookings', icon: '📋', color: 'bg-purple-50 hover:bg-purple-100 text-purple-600' },
//                   { to: '/admin/reviews', label: 'Manage Reviews', icon: '⭐', color: 'bg-orange-50 hover:bg-orange-100 text-orange-600' },
//                   { to: '/cars', label: 'View Fleet', icon: '👀', color: 'bg-green-50 hover:bg-green-100 text-green-600' },
//                   { to: '/profile', label: 'My Profile', icon: '👤', color: 'bg-gray-50 hover:bg-gray-100 text-gray-600' },
//                 ].map((action, i) => (
//                   <Link
//                     key={i}
//                     to={action.to}
//                     className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all hover:translate-x-1 duration-200 ${action.color}`}
//                   >
//                     <span className='text-base'>{action.icon}</span>
//                     {action.label}
//                     <span className='ml-auto'>→</span>
//                   </Link>
//                 ))}
//               </div>
//             </div>

//             {/* Fleet Overview */}
//             <div className='bg-white rounded-2xl shadow-sm p-5'>
//               <h2 className='text-sm font-bold text-gray-900 mb-4'>Fleet Overview</h2>
//               <div className='space-y-3'>
//                 <div>
//                   <div className='flex items-center justify-between mb-1.5'>
//                     <span className='text-xs text-gray-500'>Available</span>
//                     <span className='text-xs font-bold text-green-600'>{stats.availableCars}</span>
//                   </div>
//                   <div className='w-full h-2 bg-gray-100 rounded-full overflow-hidden'>
//                     <div
//                       className='h-full bg-green-500 rounded-full transition-all duration-700'
//                       style={{ width: stats.totalCars ? `${(stats.availableCars / stats.totalCars) * 100}%` : '0%' }}
//                     />
//                   </div>
//                 </div>
//                 <div>
//                   <div className='flex items-center justify-between mb-1.5'>
//                     <span className='text-xs text-gray-500'>Booked</span>
//                     <span className='text-xs font-bold text-red-500'>{stats.totalCars - stats.availableCars}</span>
//                   </div>
//                   <div className='w-full h-2 bg-gray-100 rounded-full overflow-hidden'>
//                     <div
//                       className='h-full bg-red-400 rounded-full transition-all duration-700'
//                       style={{ width: stats.totalCars ? `${((stats.totalCars - stats.availableCars) / stats.totalCars) * 100}%` : '0%' }}
//                     />
//                   </div>
//                 </div>
//                 <div className='pt-3 border-t border-gray-50 flex items-center justify-between'>
//                   <span className='text-xs text-gray-500'>Total Fleet</span>
//                   <span className='text-xs font-bold text-gray-900'>{stats.totalCars} cars</span>
//                 </div>
//               </div>
//             </div>

//             {/* Booking + Review Stats */}
//             <div className='bg-white rounded-2xl shadow-sm p-5'>
//               <h2 className='text-sm font-bold text-gray-900 mb-3'>Stats Overview</h2>
//               <div className='space-y-2'>
//                 {[
//                   { label: 'Pending', value: stats.pendingBookings, color: 'bg-yellow-100 text-yellow-600' },
//                   { label: 'Confirmed', value: stats.confirmedBookings, color: 'bg-green-100 text-green-600' },
//                   { label: 'Total Bookings', value: stats.totalBookings, color: 'bg-blue-100 text-blue-600' },
//                   { label: 'Total Reviews', value: stats.totalReviews, color: 'bg-orange-100 text-orange-600' },
//                   { label: 'Avg Rating', value: `${stats.avgRating} ⭐`, color: 'bg-yellow-100 text-yellow-600' },
//                 ].map((s, i) => (
//                   <div key={i} className='flex items-center justify-between'>
//                     <span className='text-xs text-gray-500'>{s.label}</span>
//                     <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${s.color}`}>
//                       {s.value}
//                     </span>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Dashboard;
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
        
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8'
        >
          <div>
            <h1 className='text-3xl font-extrabold text-slate-900 tracking-tight'>Admin Dashboard</h1>
            <p className='text-slate-500 text-sm mt-1'>Real-time overview of your rental business.</p>
          </div>
          <Link to='/admin/cars' className='flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-2xl transition-all shadow-sm'>
            <FaPlus size={12} /> Add New Car
          </Link>
        </motion.div>

        {/* Stat Cards */}
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
          
          {/* Recent Bookings (Left Side) */}
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

          {/* Sidebar (Right Side) */}
          <div className='space-y-6'>
            
            {/* Quick Actions */}
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

            {/* Fleet Status */}
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

            {/* Stats Overview (Restored Section) */}
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