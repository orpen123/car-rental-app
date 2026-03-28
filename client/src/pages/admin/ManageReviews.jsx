






































































































































            
















































                        






















































import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaArrowLeft, FaTrashAlt, FaStar, FaCar, FaUser, 
  FaCalendarAlt, FaCheckCircle, FaExclamationCircle, FaFilter,
  FaQuoteLeft
} from 'react-icons/fa';
import api from '../../services/api.js';

const StarDisplay = ({ rating }) => (
  <div className='flex items-center gap-0.5'>
    {[1, 2, 3, 4, 5].map((star) => (
      <FaStar key={star} className={`text-[10px] sm:text-xs ${star <= rating ? 'text-amber-400' : 'text-slate-200'}`} />
    ))}
  </div>
);

const ManageReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [success, setSuccess] = useState('');
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
      setSuccess('Review deleted');
      setReviews(reviews.filter(r => r._id !== id));
      setDeleteConfirm(null);
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) { console.error(err); }
  };

  const filteredReviews = filterRating ? reviews.filter(r => r.rating === filterRating) : reviews;
  const avgRating = reviews.length ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1) : 0;

  const stats = [
    { label: 'Total', value: reviews.length, color: 'text-indigo-600 bg-indigo-50', icon: <FaStar /> },
    { label: '5 Stars', value: reviews.filter(r => r.rating === 5).length, color: 'text-emerald-600 bg-emerald-50', icon: <FaCheckCircle /> },
    { label: '4 Stars', value: reviews.filter(r => r.rating === 4).length, color: 'text-amber-500 bg-amber-50', icon: <FaStar /> },
    { label: '3 Stars', value: reviews.filter(r => r.rating === 3).length, color: 'text-orange-500 bg-orange-50', icon: <FaStar /> },
    { label: 'Critical', value: reviews.filter(r => r.rating <= 2).length, color: 'text-rose-600 bg-rose-50', icon: <FaExclamationCircle /> },
  ];

  return (
    <div className='min-h-screen bg-[#f8fafc] pt-20 sm:pt-24 pb-12'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6'>

        {}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className='mb-6 sm:mb-8 flex flex-col gap-4'>
          <div className='flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4'>
            <div>
              <Link to='/admin' className='inline-flex items-center gap-2 text-indigo-600 font-bold text-[10px] sm:text-xs uppercase tracking-widest mb-2 hover:gap-3 transition-all'>
                <FaArrowLeft /> Dashboard
              </Link>
              <h1 className='text-2xl sm:text-3xl font-black text-slate-900 tracking-tighter'>Review Management</h1>
            </div>
            
            <div className='bg-white px-3 py-2 rounded-xl sm:rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between sm:justify-start gap-3 w-full sm:w-auto'>
              <span className='text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-widest'>Avg Score</span>
              <span className='text-base sm:text-lg font-black text-amber-500 flex items-center gap-1'>
                <FaStar size={14} /> {avgRating}
              </span>
            </div>
          </div>
        </motion.div>

        {}
        <AnimatePresence>
          {success && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className='bg-emerald-50 border border-emerald-100 text-emerald-600 text-[11px] font-bold rounded-xl px-4 py-3 mb-6 flex items-center gap-2'>
              <FaCheckCircle /> {success}
            </motion.div>
          )}
        </AnimatePresence>

        {}
        <div className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 mb-8'>
          {stats.map((stat, i) => (
            <motion.button
              key={i}
              onClick={() => setFilterRating(stat.label === 'Total' ? 0 : stat.label === 'Critical' ? 2 : parseInt(stat.label))}
              whileHover={{ y: -3 }}
              className={`bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-5 shadow-sm border transition-all text-left ${filterRating === (stat.label === 'Total' ? 0 : stat.label === 'Critical' ? 2 : parseInt(stat.label)) ? 'border-indigo-600 ring-4 ring-indigo-50' : 'border-slate-100'}`}
            >
              <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl ${stat.color} flex items-center justify-center mb-3 sm:mb-4 text-xs sm:text-sm`}>
                {stat.icon}
              </div>
              <p className='text-xl sm:text-2xl font-black text-slate-900'>{stat.value}</p>
              <p className='text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1'>{stat.label}</p>
            </motion.button>
          ))}
        </div>

        {}
        <div className='bg-white rounded-[1.5rem] sm:rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden'>
          
          {}
          <div className='px-4 sm:px-8 py-5 sm:py-6 border-b border-slate-50 flex flex-col gap-4'>
            <div className='flex items-center gap-3'>
              <div className='w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400'>
                <FaFilter size={12} />
              </div>
              <h2 className='text-[11px] sm:text-sm font-black text-slate-900 uppercase tracking-widest'>
                {filterRating ? `${filterRating} Star Feedback` : 'All Feedback'}
              </h2>
            </div>
            
            <div className='flex items-center gap-2 flex-wrap'>
              {[0, 5, 4, 3, 2, 1].map((rating) => (
                <button
                  key={rating}
                  onClick={() => setFilterRating(rating)}
                  className={`px-3 sm:px-4 py-2 rounded-lg sm:rounded-xl text-[9px] sm:text-[10px] font-black uppercase transition-all ${filterRating === rating ? 'bg-indigo-600 text-white shadow-md' : 'bg-slate-50 text-slate-500 hover:bg-slate-100'}`}
                >
                  {rating === 0 ? 'All' : `${rating}★`}
                </button>
              ))}
            </div>
          </div>

          {}
          <div className='divide-y divide-slate-50'>
            {loading ? (
              <div className='py-20 flex justify-center'><div className='w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin' /></div>
            ) : filteredReviews.length === 0 ? (
              <div className='py-16 sm:py-24 text-center px-4'>
                <FaStar className='mx-auto text-slate-100 text-5xl sm:text-6xl mb-4' />
                <p className='text-slate-400 font-bold uppercase tracking-widest text-[10px] sm:text-xs'>No reviews in this category</p>
              </div>
            ) : (
              filteredReviews.map((review) => (
                <motion.div key={review._id} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className='p-4 sm:p-8 hover:bg-slate-50/30 transition-colors group'>
                  <div className='flex flex-col sm:flex-row gap-4 sm:gap-6'>
                    
                    {}
                    <div className='flex items-center sm:items-start gap-3 sm:gap-6'>
                      <div className='w-10 h-10 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-gradient-to-br from-indigo-500 to-indigo-700 flex items-center justify-center text-white font-black text-sm sm:text-xl flex-shrink-0 shadow-md'>
                        {review.user?.name?.charAt(0).toUpperCase()}
                      </div>
                      <div className='sm:hidden flex-1'>
                         <h3 className='text-sm font-black text-slate-900 tracking-tight leading-none'>{review.user?.name}</h3>
                         <div className='flex items-center gap-2 mt-1'>
                            <StarDisplay rating={review.rating} />
                         </div>
                      </div>
                    </div>

                    <div className='flex-1'>
                      {}
                      <div className='hidden sm:flex items-center justify-between gap-4 mb-4'>
                        <div>
                          <h3 className='text-base font-black text-slate-900 tracking-tight'>{review.user?.name}</h3>
                          <div className='flex items-center gap-2 mt-1'>
                            <StarDisplay rating={review.rating} />
                            <span className='text-[10px] font-black text-slate-400 uppercase tracking-widest'>{review.rating}/5</span>
                          </div>
                        </div>
                        <button onClick={() => setDeleteConfirm(review._id)} className='flex items-center gap-2 px-3 py-1.5 bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white rounded-lg text-[10px] font-black uppercase transition-all'>
                          <FaTrashAlt /> Remove
                        </button>
                      </div>

                      {}
                      <div className='relative bg-slate-50 sm:bg-white sm:border sm:border-slate-100 p-4 sm:p-5 rounded-2xl sm:rounded-3xl italic text-slate-600 text-xs sm:text-sm leading-relaxed group-hover:border-indigo-100 transition-colors'>
                        <FaQuoteLeft className='hidden sm:block absolute -top-2 -left-1 text-indigo-100 text-xl' />
                        "{review.comment}"
                      </div>

                      {}
                      <div className='mt-4 flex flex-col xs:flex-row items-start xs:items-center justify-between gap-4'>
                        <div className='flex flex-wrap items-center gap-3 text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-widest'>
                          <div className='flex items-center gap-1.5'><FaCar className='text-indigo-400' /> {review.car?.brand} {review.car?.model}</div>
                          <span className='hidden xs:block text-slate-200'>•</span>
                          <div className='flex items-center gap-1.5'><FaCalendarAlt className='text-indigo-400' /> {new Date(review.createdAt).toLocaleDateString()}</div>
                        </div>
                        
                        {}
                        <button onClick={() => setDeleteConfirm(review._id)} className='sm:hidden w-full flex items-center justify-center gap-2 py-2.5 bg-rose-50 text-rose-600 rounded-xl text-[10px] font-black uppercase'>
                           <FaTrashAlt /> Remove Review
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>

        {}
        <AnimatePresence>
          {deleteConfirm && (
            <div className='fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4'>
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className='bg-white rounded-[2rem] shadow-2xl p-6 sm:p-10 max-w-sm w-full text-center'>
                <div className='w-16 h-16 bg-rose-50 rounded-2xl flex items-center justify-center mx-auto mb-6 text-rose-500'>
                  <FaTrashAlt size={24} />
                </div>
                <h3 className='text-lg font-black text-slate-900 mb-2'>Delete Review?</h3>
                <p className='text-slate-500 text-xs mb-8'>This will permanently remove this feedback. This action is irreversible.</p>
                <div className='flex flex-col gap-3'>
                  <button onClick={() => handleDelete(deleteConfirm)} className='w-full py-3.5 bg-rose-600 text-white font-black rounded-xl text-xs uppercase tracking-widest shadow-lg shadow-rose-200'>
                    Yes, Delete
                  </button>
                  <button onClick={() => setDeleteConfirm(null)} className='w-full py-3.5 bg-slate-100 text-slate-600 font-black rounded-xl text-xs uppercase tracking-widest'>
                    Cancel
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