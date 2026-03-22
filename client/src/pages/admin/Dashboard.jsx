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
//   });
//   const [recentBookings, setRecentBookings] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const [carsRes, bookingsRes] = await Promise.all([
//           api.get('/cars'),
//           api.get('/bookings'),
//         ]);

//         const cars = carsRes.data;
//         const bookings = bookingsRes.data;

//         setStats({
//           totalCars: cars.length,
//           availableCars: cars.filter(c => c.available).length,
//           totalBookings: bookings.length,
//           pendingBookings: bookings.filter(b => b.status === 'pending').length,
//           confirmedBookings: bookings.filter(b => b.status === 'confirmed').length,
//           totalRevenue: bookings.reduce((sum, b) => sum + b.totalPrice, 0),
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

//   const statCards = [
//     { label: 'Total Cars', value: stats.totalCars, icon: '🚗', color: 'bg-blue-50 text-blue-600', sub: `${stats.availableCars} available` },
//     { label: 'Total Bookings', value: stats.totalBookings, icon: '📋', color: 'bg-purple-50 text-purple-600', sub: `${stats.pendingBookings} pending` },
//     { label: 'Confirmed', value: stats.confirmedBookings, icon: '✅', color: 'bg-green-50 text-green-600', sub: 'Active bookings' },
//     { label: 'Revenue', value: `$${stats.totalRevenue}`, icon: '💰', color: 'bg-yellow-50 text-yellow-600', sub: 'Total earnings' },
//   ];

//   const getStatusColor = (status) => {
//     switch (status) {
//       case 'confirmed': return 'bg-green-100 text-green-600';
//       case 'pending': return 'bg-yellow-100 text-yellow-600';
//       case 'cancelled': return 'bg-red-100 text-red-500';
//       case 'completed': return 'bg-blue-100 text-blue-600';
//       default: return 'bg-gray-100 text-gray-500';
//     }
//   };

//   if (loading) {
//     return (
//       <div className='min-h-screen bg-[#eaecf5] flex items-center justify-center'>
//         <div className='w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin' />
//       </div>
//     );
//   }

//   return (
//     <div className='min-h-screen bg-[#eaecf5] pt-20 pb-10'>
//       <div className='max-w-7xl mx-auto px-4 sm:px-6 py-8'>

//         {/* Header */}
//         <div className='flex items-center justify-between mb-6'>
//           <div>
//             <p className='text-blue-600 uppercase tracking-widest text-xs font-semibold mb-1'>Admin</p>
//             <h1 className='text-2xl sm:text-3xl font-bold text-gray-900'>Dashboard</h1>
//           </div>
//           <div className='flex items-center gap-2'>
//             <Link
//               to='/admin/cars'
//               className='px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl transition-colors'
//             >
//               Manage Cars
//             </Link>
//             <Link
//               to='/admin/bookings'
//               className='px-4 py-2 bg-white hover:bg-gray-50 text-gray-700 text-xs font-semibold rounded-xl border border-gray-200 transition-colors'
//             >
//               Manage Bookings
//             </Link>
//           </div>
//         </div>

//         {/* Stat Cards */}
//         <div className='grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6'>
//           {statCards.map((card, i) => (
//             <div key={i} className='bg-white rounded-2xl shadow-sm p-4 sm:p-5'>
//               <div className={`w-10 h-10 rounded-xl ${card.color} flex items-center justify-center text-lg mb-3`}>
//                 {card.icon}
//               </div>
//               <p className='text-2xl sm:text-3xl font-black text-gray-900 mb-0.5'>{card.value}</p>
//               <p className='text-xs font-semibold text-gray-600'>{card.label}</p>
//               <p className='text-xs text-gray-400 mt-0.5'>{card.sub}</p>
//             </div>
//           ))}
//         </div>

//         <div className='grid grid-cols-1 lg:grid-cols-3 gap-5'>

//           {/* Recent Bookings */}
//           <div className='lg:col-span-2 bg-white rounded-2xl shadow-sm overflow-hidden'>
//             <div className='flex items-center justify-between px-5 py-4 border-b border-gray-50'>
//               <h2 className='text-sm font-bold text-gray-900'>Recent Bookings</h2>
//               <Link to='/admin/bookings' className='text-xs text-blue-600 hover:underline font-medium'>
//                 View all →
//               </Link>
//             </div>

//             {recentBookings.length === 0 ? (
//               <div className='flex items-center justify-center h-40 text-gray-300 text-sm'>
//                 No bookings yet
//               </div>
//             ) : (
//               <div className='divide-y divide-gray-50'>
//                 {recentBookings.map((booking) => (
//                   <div key={booking._id} className='flex items-center gap-4 px-5 py-3.5 hover:bg-gray-50 transition-colors'>
//                     {/* Car Image */}
//                     <div className='w-12 h-10 rounded-xl bg-[#eaecf5] overflow-hidden flex-shrink-0'>
//                       {booking.car?.images?.[0] ? (
//                         <img src={booking.car.images[0]} alt='' className='w-full h-full object-cover' />
//                       ) : (
//                         <div className='w-full h-full flex items-center justify-center text-gray-300 text-xs'>🚗</div>
//                       )}
//                     </div>

//                     {/* Info */}
//                     <div className='flex-1 min-w-0'>
//                       <p className='text-xs font-semibold text-gray-900 truncate'>
//                         {booking.car?.brand} {booking.car?.model}
//                       </p>
//                       <p className='text-xs text-gray-400 truncate'>
//                         {booking.user?.name} • {new Date(booking.startDate).toLocaleDateString()}
//                       </p>
//                     </div>

//                     {/* Status + Price */}
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

//           {/* Quick Actions */}
//           <div className='space-y-4'>
//             <div className='bg-white rounded-2xl shadow-sm p-5'>
//               <h2 className='text-sm font-bold text-gray-900 mb-4'>Quick Actions</h2>
//               <div className='space-y-2'>
//                 {[
//                   { to: '/admin/cars', label: 'Add New Car', icon: '🚗', color: 'bg-blue-50 hover:bg-blue-100 text-blue-600' },
//                   { to: '/admin/bookings', label: 'View Bookings', icon: '📋', color: 'bg-purple-50 hover:bg-purple-100 text-purple-600' },
//                   { to: '/cars', label: 'View Fleet', icon: '👀', color: 'bg-green-50 hover:bg-green-100 text-green-600' },
//                   { to: '/profile', label: 'My Profile', icon: '👤', color: 'bg-gray-50 hover:bg-gray-100 text-gray-600' },
//                 ].map((action, i) => (
//                   <Link
//                     key={i}
//                     to={action.to}
//                     className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold transition-colors ${action.color}`}
//                   >
//                     <span className='text-base'>{action.icon}</span>
//                     {action.label}
//                   </Link>
//                 ))}
//               </div>
//             </div>

//             {/* Fleet Overview */}
//             <div className='bg-white rounded-2xl shadow-sm p-5'>
//               <h2 className='text-sm font-bold text-gray-900 mb-4'>Fleet Overview</h2>
//               <div className='space-y-3'>
//                 <div className='flex items-center justify-between'>
//                   <span className='text-xs text-gray-500'>Available</span>
//                   <div className='flex items-center gap-2'>
//                     <div className='w-20 h-1.5 bg-gray-100 rounded-full overflow-hidden'>
//                       <div
//                         className='h-full bg-green-500 rounded-full'
//                         style={{ width: stats.totalCars ? `${(stats.availableCars / stats.totalCars) * 100}%` : '0%' }}
//                       />
//                     </div>
//                     <span className='text-xs font-semibold text-gray-700'>{stats.availableCars}</span>
//                   </div>
//                 </div>
//                 <div className='flex items-center justify-between'>
//                   <span className='text-xs text-gray-500'>Booked</span>
//                   <div className='flex items-center gap-2'>
//                     <div className='w-20 h-1.5 bg-gray-100 rounded-full overflow-hidden'>
//                       <div
//                         className='h-full bg-red-400 rounded-full'
//                         style={{ width: stats.totalCars ? `${((stats.totalCars - stats.availableCars) / stats.totalCars) * 100}%` : '0%' }}
//                       />
//                     </div>
//                     <span className='text-xs font-semibold text-gray-700'>{stats.totalCars - stats.availableCars}</span>
//                   </div>
//                 </div>
//                 <div className='pt-2 border-t border-gray-50'>
//                   <div className='flex items-center justify-between'>
//                     <span className='text-xs text-gray-500'>Total Fleet</span>
//                     <span className='text-xs font-bold text-gray-900'>{stats.totalCars} cars</span>
//                   </div>
//                 </div>
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
import api from '../../services/api.js';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalCars: 0,
    availableCars: 0,
    totalBookings: 0,
    pendingBookings: 0,
    confirmedBookings: 0,
    totalRevenue: 0,
  });
  const [recentBookings, setRecentBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [carsRes, bookingsRes] = await Promise.all([
          api.get('/cars'),
          api.get('/bookings'),
        ]);
        const cars = carsRes.data;
        const bookings = bookingsRes.data;
        setStats({
          totalCars: cars.length,
          availableCars: cars.filter(c => c.available).length,
          totalBookings: bookings.length,
          pendingBookings: bookings.filter(b => b.status === 'pending').length,
          confirmedBookings: bookings.filter(b => b.status === 'confirmed').length,
          totalRevenue: bookings.reduce((sum, b) => sum + b.totalPrice, 0),
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
      case 'confirmed': return 'bg-green-100 text-green-600';
      case 'pending': return 'bg-yellow-100 text-yellow-600';
      case 'cancelled': return 'bg-red-100 text-red-500';
      case 'completed': return 'bg-blue-100 text-blue-600';
      default: return 'bg-gray-100 text-gray-500';
    }
  };

  const statCards = [
    {
      label: 'Total Cars',
      value: stats.totalCars,
      icon: '🚗',
      bg: 'bg-blue-50',
      text: 'text-blue-600',
      sub: `${stats.availableCars} available`,
      subColor: 'text-blue-400',
    },
    {
      label: 'Total Bookings',
      value: stats.totalBookings,
      icon: '📋',
      bg: 'bg-purple-50',
      text: 'text-purple-600',
      sub: `${stats.pendingBookings} pending`,
      subColor: 'text-purple-400',
    },
    {
      label: 'Confirmed',
      value: stats.confirmedBookings,
      icon: '✅',
      bg: 'bg-green-50',
      text: 'text-green-600',
      sub: 'Active bookings',
      subColor: 'text-green-400',
    },
    {
      label: 'Revenue',
      value: `$${stats.totalRevenue}`,
      icon: '💰',
      bg: 'bg-yellow-50',
      text: 'text-yellow-600',
      sub: 'Total earnings',
      subColor: 'text-yellow-400',
    },
  ];

  if (loading) {
    return (
      <div className='min-h-screen bg-[#eaecf5] flex items-center justify-center'>
        <div className='w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin' />
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-[#eaecf5] pt-20 pb-10'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8'>

        {/* Header — fixed mobile overlap */}
        <div className='mb-6'>
          <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3'>
            <div>
              <p className='text-blue-600 uppercase tracking-widest text-xs font-semibold mb-1'>Admin</p>
              <h1 className='text-2xl sm:text-3xl font-bold text-gray-900'>Dashboard</h1>
            </div>
            <div className='flex items-center gap-2'>
              <Link
                to='/admin/cars'
                className='flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl transition-colors'
              >
                🚗 Manage Cars
              </Link>
              <Link
                to='/admin/bookings'
                className='flex items-center gap-1.5 px-4 py-2 bg-white hover:bg-gray-50 text-gray-700 text-xs font-semibold rounded-xl border border-gray-200 transition-colors'
              >
                📋 Bookings
              </Link>
            </div>
          </div>
        </div>

        {/* Stat Cards */}
        <div className='grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6'>
          {statCards.map((card, i) => (
            <div
              key={i}
              className='bg-white rounded-2xl shadow-sm p-4 sm:p-5 hover:shadow-md transition-shadow'
              style={{ animation: `fadeSlideUp 0.5s ease-out ${i * 0.1}s both` }}
            >
              <div className={`w-10 h-10 rounded-xl ${card.bg} flex items-center justify-center text-lg mb-3`}>
                {card.icon}
              </div>
              <p className={`text-2xl sm:text-3xl font-black mb-0.5 ${card.text}`}>
                {card.value}
              </p>
              <p className='text-xs font-semibold text-gray-700'>{card.label}</p>
              <p className={`text-xs mt-0.5 ${card.subColor}`}>{card.sub}</p>
            </div>
          ))}
        </div>

        <div className='grid grid-cols-1 lg:grid-cols-3 gap-5'>

          {/* Recent Bookings */}
          <div
            className='lg:col-span-2 bg-white rounded-2xl shadow-sm overflow-hidden'
            style={{ animation: 'fadeSlideUp 0.5s ease-out 0.2s both' }}
          >
            <div className='flex items-center justify-between px-5 py-4 border-b border-gray-50'>
              <h2 className='text-sm font-bold text-gray-900'>Recent Bookings</h2>
              <Link to='/admin/bookings' className='text-xs text-blue-600 hover:underline font-medium flex items-center gap-1'>
                View all →
              </Link>
            </div>

            {recentBookings.length === 0 ? (
              <div className='flex flex-col items-center justify-center h-40 text-center px-5'>
                <p className='text-gray-300 text-3xl mb-2'>📋</p>
                <p className='text-gray-400 text-sm font-medium'>No bookings yet</p>
                <p className='text-gray-300 text-xs mt-1'>Bookings will appear here</p>
              </div>
            ) : (
              <div className='divide-y divide-gray-50'>
                {recentBookings.map((booking) => (
                  <div key={booking._id} className='flex items-center gap-3 px-5 py-3.5 hover:bg-gray-50 transition-colors'>
                    <div className='w-12 h-10 rounded-xl bg-[#eaecf5] overflow-hidden flex-shrink-0'>
                      {booking.car?.images?.[0] ? (
                        <img src={booking.car.images[0]} alt='' className='w-full h-full object-cover' />
                      ) : (
                        <div className='w-full h-full flex items-center justify-center text-gray-300 text-xs'>🚗</div>
                      )}
                    </div>
                    <div className='flex-1 min-w-0'>
                      <p className='text-xs font-semibold text-gray-900 truncate'>
                        {booking.car?.brand} {booking.car?.model}
                      </p>
                      <p className='text-xs text-gray-400 truncate'>
                        👤 {booking.user?.name} • 📅 {new Date(booking.startDate).toLocaleDateString()}
                      </p>
                    </div>
                    <div className='flex flex-col items-end gap-1 flex-shrink-0'>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize ${getStatusColor(booking.status)}`}>
                        {booking.status}
                      </span>
                      <span className='text-xs font-bold text-blue-600'>${booking.totalPrice}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right side */}
          <div
            className='space-y-4'
            style={{ animation: 'fadeSlideUp 0.5s ease-out 0.3s both' }}
          >
            {/* Quick Actions */}
            <div className='bg-white rounded-2xl shadow-sm p-5'>
              <h2 className='text-sm font-bold text-gray-900 mb-3'>Quick Actions</h2>
              <div className='space-y-2'>
                {[
                  { to: '/admin/cars', label: 'Add New Car', icon: '🚗', color: 'bg-blue-50 hover:bg-blue-100 text-blue-600' },
                  { to: '/admin/bookings', label: 'View Bookings', icon: '📋', color: 'bg-purple-50 hover:bg-purple-100 text-purple-600' },
                  { to: '/cars', label: 'View Fleet', icon: '👀', color: 'bg-green-50 hover:bg-green-100 text-green-600' },
                  { to: '/profile', label: 'My Profile', icon: '👤', color: 'bg-gray-50 hover:bg-gray-100 text-gray-600' },
                ].map((action, i) => (
                  <Link
                    key={i}
                    to={action.to}
                    className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all hover:translate-x-1 duration-200 ${action.color}`}
                  >
                    <span className='text-base'>{action.icon}</span>
                    {action.label}
                    <span className='ml-auto'>→</span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Fleet Overview */}
            <div className='bg-white rounded-2xl shadow-sm p-5'>
              <h2 className='text-sm font-bold text-gray-900 mb-4'>Fleet Overview</h2>
              <div className='space-y-3'>
                <div>
                  <div className='flex items-center justify-between mb-1.5'>
                    <span className='text-xs text-gray-500'>Available</span>
                    <span className='text-xs font-bold text-green-600'>{stats.availableCars}</span>
                  </div>
                  <div className='w-full h-2 bg-gray-100 rounded-full overflow-hidden'>
                    <div
                      className='h-full bg-green-500 rounded-full transition-all duration-700'
                      style={{ width: stats.totalCars ? `${(stats.availableCars / stats.totalCars) * 100}%` : '0%' }}
                    />
                  </div>
                </div>

                <div>
                  <div className='flex items-center justify-between mb-1.5'>
                    <span className='text-xs text-gray-500'>Booked</span>
                    <span className='text-xs font-bold text-red-500'>{stats.totalCars - stats.availableCars}</span>
                  </div>
                  <div className='w-full h-2 bg-gray-100 rounded-full overflow-hidden'>
                    <div
                      className='h-full bg-red-400 rounded-full transition-all duration-700'
                      style={{ width: stats.totalCars ? `${((stats.totalCars - stats.availableCars) / stats.totalCars) * 100}%` : '0%' }}
                    />
                  </div>
                </div>

                <div className='pt-3 border-t border-gray-50 flex items-center justify-between'>
                  <span className='text-xs text-gray-500'>Total Fleet</span>
                  <span className='text-xs font-bold text-gray-900'>{stats.totalCars} cars</span>
                </div>
              </div>
            </div>

            {/* Booking Stats */}
            <div className='bg-white rounded-2xl shadow-sm p-5'>
              <h2 className='text-sm font-bold text-gray-900 mb-3'>Booking Stats</h2>
              <div className='space-y-2'>
                {[
                  { label: 'Pending', value: stats.pendingBookings, color: 'bg-yellow-100 text-yellow-600' },
                  { label: 'Confirmed', value: stats.confirmedBookings, color: 'bg-green-100 text-green-600' },
                  { label: 'Total', value: stats.totalBookings, color: 'bg-blue-100 text-blue-600' },
                ].map((s, i) => (
                  <div key={i} className='flex items-center justify-between'>
                    <span className='text-xs text-gray-500'>{s.label}</span>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${s.color}`}>
                      {s.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;