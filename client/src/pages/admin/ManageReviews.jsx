// import { useEffect, useState } from 'react';
// import { Link } from 'react-router-dom';
// import { 
//   FaArrowLeft, 
//   FaTrashAlt, 
//   FaStar, 
//   FaCar, 
//   FaUser, 
//   FaCalendarAlt, 
//   FaTimesCircle, 
//   FaCheckCircle 
// } from 'react-icons/fa';
// import api from '../../services/api.js';

// const StarDisplay = ({ rating }) => (
//   <div className='flex items-center gap-0.5'>
//     {[1, 2, 3, 4, 5].map((star) => (
//       <FaStar key={star} className={`text-sm ${star <= rating ? 'text-yellow-400' : 'text-gray-200'}`} />
//     ))}
//   </div>
// );

// const ManageReviews = () => {
//   const [reviews, setReviews] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [deleteConfirm, setDeleteConfirm] = useState(null);
//   const [success, setSuccess] = useState('');
//   const [error, setError] = useState('');
//   const [filterRating, setFilterRating] = useState(0);

//   useEffect(() => { fetchReviews(); }, []);

//   const fetchReviews = async () => {
//     try {
//       const res = await api.get('/reviews');
//       setReviews(res.data);
//     } catch (error) {
//       console.error(error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleDelete = async (id) => {
//     try {
//       await api.delete(`/reviews/${id}`);
//       setSuccess('Review deleted!');
//       fetchReviews();
//       setDeleteConfirm(null);
//       setTimeout(() => setSuccess(''), 3000);
//     } catch (err) {
//       setError(err.response?.data?.message || 'Delete failed');
//     }
//   };

//   const filteredReviews = filterRating
//     ? reviews.filter(r => r.rating === filterRating)
//     : reviews;

//   const avgRating = reviews.length
//     ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
//     : 0;

//   const stats = [
//     { label: 'Total', value: reviews.length, color: 'text-gray-900' },
//     { label: '5 Stars', value: reviews.filter(r => r.rating === 5).length, color: 'text-yellow-500' },
//     { label: '4 Stars', value: reviews.filter(r => r.rating === 4).length, color: 'text-yellow-400' },
//     { label: '3 Stars', value: reviews.filter(r => r.rating === 3).length, color: 'text-orange-400' },
//     { label: '≤2 Stars', value: reviews.filter(r => r.rating <= 2).length, color: 'text-red-500' },
//   ];

//   return (
//     <div className='min-h-screen bg-[#eaecf5] pt-20 pb-10'>
//       <div className='max-w-7xl mx-auto px-4 sm:px-6 py-8'>

//         {/* Header */}
//         <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6'>
//           <div>
//             <Link to='/admin' className='text-xs text-gray-400 hover:text-blue-600 transition-colors flex items-center gap-1 mb-1 w-fit'>
//               <FaArrowLeft size={12} />
//               Dashboard
//             </Link>
//             <h1 className='text-2xl sm:text-3xl font-bold text-gray-900'>Manage Reviews</h1>
//           </div>
//           <div className='flex items-center gap-2'>
//             <span className='text-xs bg-yellow-50 text-yellow-600 px-3 py-1.5 rounded-full font-semibold flex items-center gap-1.5'>
//               <FaStar size={12} />
//               Avg: {avgRating} / 5
//             </span>
//             <span className='text-xs bg-blue-50 text-blue-600 px-3 py-1.5 rounded-full font-semibold'>
//               {filteredReviews.length} reviews
//             </span>
//           </div>
//         </div>

//         {/* Alerts */}
//         {success && (
//           <div className='bg-green-50 border border-green-100 text-green-600 text-xs rounded-2xl px-4 py-3 mb-4 flex items-center justify-center gap-2'>
//             <FaCheckCircle size={14} />
//             {success}
//           </div>
//         )}
//         {error && (
//           <div className='bg-red-50 border border-red-100 text-red-500 text-xs rounded-2xl px-4 py-3 mb-4 flex items-center justify-center gap-2'>
//             <FaTimesCircle size={14} />
//             {error}
//           </div>
//         )}

//         {/* Stats */}
//         <div className='grid grid-cols-3 sm:grid-cols-5 gap-3 mb-5'>
//           {stats.map((stat, i) => (
//             <button
//               key={i}
//               onClick={() => setFilterRating(stat.label === 'Total' ? 0 : stat.label === '≤2 Stars' ? 2 : parseInt(stat.label))}
//               className={`bg-white rounded-2xl shadow-sm p-3 sm:p-4 text-center transition-all hover:shadow-md active:scale-95 ${
//                 filterRating === (stat.label === 'Total' ? 0 : stat.label === '≤2 Stars' ? 2 : parseInt(stat.label))
//                   ? 'ring-2 ring-blue-500 shadow-md'
//                   : ''
//               }`}
//             >
//               <p className={`text-xl sm:text-2xl font-black mb-0.5 ${stat.color}`}>{stat.value}</p>
//               <p className='text-xs text-gray-400 font-medium'>{stat.label}</p>
//             </button>
//           ))}
//         </div>

//         {/* Filter Pills */}
//         <div className='flex items-center gap-2 mb-4 flex-wrap'>
//           {[0, 5, 4, 3, 2, 1].map((rating) => (
//             <button
//               key={rating}
//               onClick={() => setFilterRating(rating)}
//               className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
//                 filterRating === rating
//                   ? 'bg-blue-600 text-white shadow-sm'
//                   : 'bg-white text-gray-500 hover:bg-gray-50 border border-gray-100'
//               }`}
//             >
//               {rating === 0 ? 'All' : (
//                 <>
//                   {rating} <FaStar className='text-yellow-400' size={12} />
//                 </>
//               )}
//             </button>
//           ))}
//         </div>

//         {/* Reviews List */}
//         <div className='bg-white rounded-2xl shadow-sm overflow-hidden'>
//           <div className='px-5 py-4 border-b border-gray-50 flex items-center justify-between'>
//             <h2 className='text-sm font-bold text-gray-900 flex items-center gap-2'>
//               <FaStar size={14} className='text-yellow-400' />
//               {filterRating ? `${filterRating} Star Reviews` : 'All Reviews'}
//             </h2>
//             {filteredReviews.length > 0 && (
//               <span className='text-xs text-gray-400'>{filteredReviews.length} results</span>
//             )}
//           </div>

//           {loading ? (
//             <div className='flex justify-center items-center h-40'>
//               <div className='w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin' />
//             </div>
//           ) : filteredReviews.length === 0 ? (
//             <div className='text-center py-16'>
//               <FaStar size={40} className='text-gray-200 mx-auto mb-3' />
//               <p className='text-gray-400 text-sm font-medium'>No reviews found</p>
//             </div>
//           ) : (
//             <div className='divide-y divide-gray-50'>
//               {filteredReviews.map((review, idx) => (
//                 <div
//                   key={review._id}
//                   className='p-4 sm:p-5 hover:bg-gray-50 transition-colors'
//                   style={{ animation: `fadeSlideUp 0.4s ease-out ${idx * 0.05}s both` }}
//                 >
//                   <div className='flex gap-4'>

//                     {/* Avatar */}
//                     <div className='w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white font-bold text-sm flex-shrink-0'>
//                       {review.user?.name?.charAt(0).toUpperCase()}
//                     </div>

//                     {/* Content */}
//                     <div className='flex-1 min-w-0'>
//                       <div className='flex items-start justify-between gap-2 mb-1'>
//                         <div>
//                           <div className='flex items-center gap-2 flex-wrap'>
//                             <p className='text-sm font-bold text-gray-900'>{review.user?.name}</p>
//                             <span className='text-xs text-gray-400 flex items-center gap-1'>
//                               <FaUser size={10} />
//                               {review.user?.email}
//                             </span>
//                           </div>
//                           <div className='flex items-center gap-2 mt-0.5'>
//                             <StarDisplay rating={review.rating} />
//                             <span className='text-xs font-semibold text-gray-700'>{review.rating}/5</span>
//                           </div>
//                         </div>
//                         <button
//                           onClick={() => setDeleteConfirm(review._id)}
//                           className='flex items-center gap-1.5 px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-500 text-xs font-semibold rounded-xl transition-colors flex-shrink-0'
//                         >
//                           <FaTrashAlt size={12} />
//                           <span className='hidden sm:block'>Delete</span>
//                         </button>
//                       </div>

//                       {/* Car info */}
//                       <div className='flex items-center gap-1.5 text-xs text-gray-400 mb-2'>
//                         <FaCar size={10} />
//                         <span className='font-medium text-gray-600'>
//                           {review.car?.brand} {review.car?.model}
//                         </span>
//                         <span>•</span>
//                         <FaCalendarAlt size={10} />
//                         <span>{new Date(review.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
//                       </div>

//                       {/* Comment */}
//                       <div className='bg-gray-50 rounded-xl px-3 py-2.5'>
//                         <p className='text-xs text-gray-600 leading-relaxed'>"{review.comment}"</p>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>

//         {/* Delete Modal */}
//         {deleteConfirm && (
//           <div className='fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 px-4'>
//             <div className='bg-white rounded-2xl shadow-xl p-6 max-w-sm w-full' style={{ animation: 'scaleIn 0.2s ease-out forwards' }}>
//               <div className='w-12 h-12 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-4'>
//                 <FaTrashAlt size={22} className='text-red-500' />
//               </div>
//               <h3 className='text-sm font-bold text-gray-900 text-center mb-1'>Delete Review</h3>
//               <p className='text-xs text-gray-400 text-center mb-5'>Are you sure? This cannot be undone.</p>
//               <div className='flex gap-3'>
//                 <button
//                   onClick={() => handleDelete(deleteConfirm)}
//                   className='flex-1 py-2.5 bg-red-500 hover:bg-red-600 text-white text-xs font-semibold rounded-xl transition-colors flex items-center justify-center gap-1.5'
//                 >
//                   <FaTrashAlt size={12} />
//                   Delete
//                 </button>
//                 <button
//                   onClick={() => setDeleteConfirm(null)}
//                   className='flex-1 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-600 text-xs font-semibold rounded-xl transition-colors'
//                 >
//                   Cancel
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default ManageReviews;
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaArrowLeft, FaTrashAlt, FaStar, FaCar, FaUser, 
  FaCalendarAlt, FaCheckCircle, FaExclamationCircle, FaFilter,
  FaQuoteLeft, FaChevronRight
} from 'react-icons/fa';
import api from '../../services/api.js';

const StarDisplay = ({ rating }) => (
  <div className='flex items-center gap-0.5'>
    {[1, 2, 3, 4, 5].map((star) => (
      <FaStar key={star} className={`text-xs ${star <= rating ? 'text-amber-400' : 'text-slate-200'}`} />
    ))}
  </div>
);

const ManageReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [filterRating, setFilterRating] = useState(0);

  useEffect(() => { fetchReviews(); }, []);

  const fetchReviews = async () => {
    try {
      const res = await api.get('/reviews');
      setReviews(res.data);
    } catch (error) { console.error(error); } finally { setLoading(false); }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/reviews/${id}`);
      setSuccess('Review removed successfully');
      setReviews(reviews.filter(r => r._id !== id));
      setDeleteConfirm(null);
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Delete failed');
    }
  };

  const filteredReviews = filterRating
    ? reviews.filter(r => r.rating === filterRating)
    : reviews;

  const avgRating = reviews.length
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : 0;

  // Animation Variants
  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 }
  };

  const stats = [
    { label: 'Total', value: reviews.length, color: 'text-indigo-600 bg-indigo-50', icon: <FaStar /> },
    { label: '5 Stars', value: reviews.filter(r => r.rating === 5).length, color: 'text-emerald-600 bg-emerald-50', icon: <FaCheckCircle /> },
    { label: '4 Stars', value: reviews.filter(r => r.rating === 4).length, color: 'text-amber-500 bg-amber-50', icon: <FaStar /> },
    { label: '3 Stars', value: reviews.filter(r => r.rating === 3).length, color: 'text-orange-500 bg-orange-50', icon: <FaStar /> },
    { label: 'Critical', value: reviews.filter(r => r.rating <= 2).length, color: 'text-rose-600 bg-rose-50', icon: <FaExclamationCircle /> },
  ];

  return (
    <div className='min-h-screen bg-[#f8fafc] pt-24 pb-12'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6'>

        {/* Header Section */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className='mb-8 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4'>
          <div>
            <Link to='/admin' className='inline-flex items-center gap-2 text-indigo-600 font-bold text-xs uppercase tracking-widest mb-3 hover:gap-3 transition-all'>
              <FaArrowLeft /> Dashboard
            </Link>
            <h1 className='text-3xl font-black text-slate-900 tracking-tighter'>Review Management</h1>
          </div>
          <div className='flex items-center gap-3'>
            <div className='bg-white px-4 py-2 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-3'>
              <span className='text-[10px] font-black text-slate-400 uppercase tracking-widest'>Average Score</span>
              <span className='text-lg font-black text-amber-500 flex items-center gap-1'>
                <FaStar size={14} /> {avgRating}
              </span>
            </div>
          </div>
        </motion.div>

        {/* Feedback Alerts */}
        <AnimatePresence>
          {success && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className='bg-emerald-50 border border-emerald-100 text-emerald-600 text-xs font-bold rounded-2xl px-4 py-3 mb-6 flex items-center gap-2'>
              <FaCheckCircle /> {success}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Stats Grid */}
        <motion.div variants={container} initial="hidden" animate="show" className='grid grid-cols-2 md:grid-cols-5 gap-4 mb-8'>
          {stats.map((stat, i) => (
            <motion.button
              variants={item}
              key={i}
              onClick={() => setFilterRating(stat.label === 'Total' ? 0 : stat.label === 'Critical' ? 2 : parseInt(stat.label))}
              whileHover={{ y: -5 }}
              className={`bg-white rounded-3xl p-5 shadow-sm border transition-all text-left ${filterRating === (stat.label === 'Total' ? 0 : stat.label === 'Critical' ? 2 : parseInt(stat.label)) ? 'border-indigo-600 ring-4 ring-indigo-50' : 'border-slate-100'}`}
            >
              <div className={`w-10 h-10 rounded-xl ${stat.color} flex items-center justify-center mb-4 text-sm`}>
                {stat.icon}
              </div>
              <p className='text-2xl font-black text-slate-900'>{stat.value}</p>
              <p className='text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1'>{stat.label}</p>
            </motion.button>
          ))}
        </motion.div>

        {/* Filters & List */}
        <div className='bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden'>
          <div className='px-8 py-6 border-b border-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-4'>
            <div className='flex items-center gap-3'>
              <div className='w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400'>
                <FaFilter size={14} />
              </div>
              <h2 className='text-sm font-black text-slate-900 uppercase tracking-widest'>
                {filterRating ? `${filterRating} Star Feedback` : 'All User Reviews'}
              </h2>
            </div>
            
            <div className='flex items-center gap-2 flex-wrap'>
              {[0, 5, 4, 3, 2, 1].map((rating) => (
                <button
                  key={rating}
                  onClick={() => setFilterRating(rating)}
                  className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase transition-all ${filterRating === rating ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' : 'bg-slate-50 text-slate-500 hover:bg-slate-100'}`}
                >
                  {rating === 0 ? 'Show All' : `${rating} Stars`}
                </button>
              ))}
            </div>
          </div>

          <div className='divide-y divide-slate-50'>
            {loading ? (
              <div className='py-20 flex justify-center'><div className='w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin' /></div>
            ) : filteredReviews.length === 0 ? (
              <div className='py-24 text-center'>
                <FaStar className='mx-auto text-slate-100 text-6xl mb-4' />
                <p className='text-slate-400 font-bold uppercase tracking-widest text-xs'>No reviews found in this category</p>
              </div>
            ) : (
              filteredReviews.map((review, idx) => (
                <motion.div
                  key={review._id}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  className='p-8 hover:bg-slate-50/50 transition-colors group'
                >
                  <div className='flex flex-col md:flex-row gap-6'>
                    {/* User Avatar */}
                    <div className='w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-indigo-700 flex items-center justify-center text-white font-black text-xl shadow-lg shadow-indigo-200 flex-shrink-0'>
                      {review.user?.name?.charAt(0).toUpperCase()}
                    </div>

                    <div className='flex-1'>
                      <div className='flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4'>
                        <div>
                          <h3 className='text-base font-black text-slate-900 tracking-tight flex items-center gap-2'>
                            {review.user?.name}
                            <span className='text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md uppercase'>Verified User</span>
                          </h3>
                          <div className='flex items-center gap-3 mt-1'>
                            <StarDisplay rating={review.rating} />
                            <span className='text-[10px] font-black text-slate-400 uppercase tracking-widest'>{review.rating} / 5.0</span>
                          </div>
                        </div>
                        
                        <button
                          onClick={() => setDeleteConfirm(review._id)}
                          className='self-start md:self-center flex items-center gap-2 px-4 py-2 bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white rounded-xl text-[11px] font-black uppercase transition-all'
                        >
                          <FaTrashAlt size={12} /> Remove
                        </button>
                      </div>

                      <div className='relative bg-white border border-slate-100 p-5 rounded-3xl shadow-sm italic text-slate-600 text-sm leading-relaxed group-hover:border-indigo-100 transition-colors'>
                        <FaQuoteLeft className='absolute -top-3 -left-1 text-indigo-100 text-2xl' />
                        "{review.comment}"
                      </div>

                      <div className='mt-5 flex flex-wrap items-center gap-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest'>
                        <div className='flex items-center gap-2'><FaCar className='text-indigo-400' /> {review.car?.brand} {review.car?.model}</div>
                        <span className='text-slate-200'>•</span>
                        <div className='flex items-center gap-2'><FaCalendarAlt className='text-indigo-400' /> {new Date(review.createdAt).toLocaleDateString()}</div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>

        {/* Delete Confirmation Modal */}
        <AnimatePresence>
          {deleteConfirm && (
            <div className='fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4'>
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className='bg-white rounded-[2.5rem] shadow-2xl p-10 max-w-md w-full text-center'>
                <div className='w-20 h-20 bg-rose-50 rounded-3xl flex items-center justify-center mx-auto mb-6 text-rose-500'>
                  <FaTrashAlt size={32} />
                </div>
                <h3 className='text-xl font-black text-slate-900 mb-2'>Permanently Delete?</h3>
                <p className='text-slate-500 text-sm mb-8'>This review and its rating will be removed from the car's statistics. This action cannot be undone.</p>
                <div className='grid grid-cols-2 gap-4'>
                  <button onClick={() => handleDelete(deleteConfirm)} className='py-4 bg-rose-600 hover:bg-rose-700 text-white font-black rounded-2xl transition-all shadow-lg shadow-rose-200'>
                    Yes, Delete
                  </button>
                  <button onClick={() => setDeleteConfirm(null)} className='py-4 bg-slate-100 hover:bg-slate-200 text-slate-600 font-black rounded-2xl transition-all'>
                    Keep Review
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ManageReviews;