




























































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaUser, FaEnvelope, FaPhone, FaCar, FaCalendarAlt, 
  FaMapMarkerAlt, FaDollarSign, FaStar, FaEdit, FaTrashAlt,
  FaCheckCircle, FaClock, FaTimesCircle, FaFlag, FaCreditCard,
  FaSignOutAlt, FaShieldAlt, FaLock, FaEye, FaEyeSlash,
  FaArrowLeft, FaSpinner
} from 'react-icons/fa';
import api from '../services/api.js';
import { useAuth } from '../context/AuthContext.jsx';

const StarRating = ({
  rating,
  onRate,
  readonly = false,
  size = 'text-2xl',
}) => (
  <div className='flex gap-1'>
    {[1, 2, 3, 4, 5].map((star) => (
      <button
        key={star}
        onClick={() => !readonly && onRate && onRate(star)}
        disabled={readonly}
        className={`${size} transition-all ${!readonly ? 'hover:scale-110 cursor-pointer' : 'cursor-default'} ${
          star <= rating ? 'text-yellow-400' : 'text-gray-200'
        }`}
      >
        ★
      </button>
    ))}
  </div>
);

const ratingLabel = ['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent'];

const Profile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('bookings');
  const [cancelling, setCancelling] = useState(null);
  const [cancelConfirm, setCancelConfirm] = useState(null);

  
  const [reviewModal, setReviewModal] = useState(null);
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' });
  const [reviewLoading, setReviewLoading] = useState(false);
  const [reviewError, setReviewError] = useState('');
  const [reviewSuccess, setReviewSuccess] = useState('');
  const [reviewedBookings, setReviewedBookings] = useState({});

  const [editForm, setEditForm] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
  });
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileError, setProfileError] = useState('');
  const [profileSuccess, setProfileSuccess] = useState('');

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const fetchBookings = async () => {
    try {
      const res = await api.get('/bookings/my');
      setBookings(res.data);
      const completed = res.data.filter((b) => b.status === 'completed');
      const reviewChecks = await Promise.all(
        completed.map(async (b) => {
          try {
            const r = await api.get(`/reviews/can-review/${b._id}`);
            return { id: b._id, ...r.data };
          } catch (err) {
            return { id: b._id, canReview: false, reviewed: false };
          }
        }),
      );
      const map = {};
      reviewChecks.forEach((r) => {
        map[r.id] = r;
      });
      setReviewedBookings(map);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleCancel = async (bookingId) => {
    setCancelling(bookingId);
    try {
      await api.put(`/bookings/${bookingId}/cancel`);
      await fetchBookings();
      setCancelConfirm(null);
    } catch (error) {
      console.error(error);
    } finally {
      setCancelling(null);
    }
  };

  const handleReview = async () => {
    if (!reviewForm.comment.trim())
      return setReviewError('Please write a comment');
    setReviewLoading(true);
    setReviewError('');
    try {
      await api.post('/reviews', {
        bookingId: reviewModal._id,
        rating: reviewForm.rating,
        comment: reviewForm.comment,
      });
      setReviewSuccess('Review submitted! ⭐');
      setReviewModal(null);
      setReviewForm({ rating: 5, comment: '' });
      await fetchBookings();
      setTimeout(() => setReviewSuccess(''), 3000);
    } catch (err) {
      setReviewError(err.response?.data?.message || 'Failed to submit review');
    } finally {
      setReviewLoading(false);
    }
  };

  const handleUpdateProfile = async () => {
    setProfileLoading(true);
    setProfileError('');
    setProfileSuccess('');
    try {
      const res = await api.put('/users/profile', {
        name: editForm.name,
        phone: editForm.phone,
      });
      const stored = JSON.parse(localStorage.getItem('user'));
      localStorage.setItem(
        'user',
        JSON.stringify({
          ...stored,
          name: res.data.name,
          phone: res.data.phone,
        }),
      );
      setProfileSuccess('Profile updated successfully!');
      setTimeout(() => setProfileSuccess(''), 3000);
    } catch (err) {
      setProfileError(err.response?.data?.message || 'Update failed');
    } finally {
      setProfileLoading(false);
    }
  };

  const handleChangePassword = async () => {
    setPasswordError('');
    setPasswordSuccess('');
    if (
      !passwordForm.currentPassword ||
      !passwordForm.newPassword ||
      !passwordForm.confirmPassword
    ) {
      return setPasswordError('Please fill in all fields');
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      return setPasswordError('Passwords do not match');
    }
    if (passwordForm.newPassword.length < 6) {
      return setPasswordError('Password must be at least 6 characters');
    }
    setPasswordLoading(true);
    try {
      await api.put('/users/password', {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });
      setPasswordSuccess('Password updated successfully!');
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      setTimeout(() => setPasswordSuccess(''), 3000);
    } catch (err) {
      setPasswordError(err.response?.data?.message || 'Update failed');
    } finally {
      setPasswordLoading(false);
    }
  };

  const getStatusConfig = (status) => {
    switch (status) {
      case 'confirmed':
        return { bg: 'bg-emerald-100 text-emerald-600', icon: <FaCheckCircle size={10} /> };
      case 'pending':
        return { bg: 'bg-amber-100 text-amber-600', icon: <FaClock size={10} /> };
      case 'cancelled':
        return { bg: 'bg-rose-100 text-rose-500', icon: <FaTimesCircle size={10} /> };
      case 'completed':
        return { bg: 'bg-blue-100 text-blue-600', icon: <FaFlag size={10} /> };
      default:
        return { bg: 'bg-gray-100 text-gray-500', icon: null };
    }
  };

  const getPaymentConfig = (status) => {
    switch (status) {
      case 'paid':
        return { bg: 'bg-emerald-100 text-emerald-600', icon: <FaCheckCircle size={10} /> };
      case 'unpaid':
        return { bg: 'bg-orange-100 text-orange-500', icon: <FaCreditCard size={10} /> };
      case 'refunded':
        return { bg: 'bg-purple-100 text-purple-600', icon: <FaDollarSign size={10} /> };
      default:
        return { bg: 'bg-gray-100 text-gray-500', icon: null };
    }
  };

  const stats = [
    { label: 'Total', value: bookings.length, color: 'text-blue-600', icon: <FaCar size={12} /> },
    {
      label: 'Active',
      value: bookings.filter((b) => b.status === 'confirmed').length,
      color: 'text-emerald-600',
      icon: <FaCheckCircle size={12} />,
    },
    {
      label: 'Completed',
      value: bookings.filter((b) => b.status === 'completed').length,
      color: 'text-purple-600',
      icon: <FaFlag size={12} />,
    },
    {
      label: 'Cancelled',
      value: bookings.filter((b) => b.status === 'cancelled').length,
      color: 'text-rose-500',
      icon: <FaTimesCircle size={12} />,
    },
  ];

  const inputClass =
    'w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm text-slate-800 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-slate-400';
  const labelClass =
    'block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5';

  
  const containerVars = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.05 } }
  };

  const itemVars = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const modalVars = {
    hidden: { scale: 0.95, opacity: 0 },
    visible: { scale: 1, opacity: 1 },
    exit: { scale: 0.95, opacity: 0 }
  };

  return (
    <div className='min-h-screen bg-[#f8fafc] pt-20 pb-10'>
      <div className='max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8'>
        
        {}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className='bg-white rounded-2xl sm:rounded-3xl shadow-sm border border-slate-100 p-4 sm:p-6 mb-5'
        >
          <div className='flex flex-col sm:flex-row items-start sm:items-center gap-4'>
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className='w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-indigo-700 flex items-center justify-center text-white font-black text-2xl flex-shrink-0 shadow-md'
            >
              {user?.name?.charAt(0).toUpperCase()}
            </motion.div>
            <div className='flex-1'>
              <div className='flex items-center gap-2 mb-1 flex-wrap'>
                <h1 className='text-xl sm:text-2xl font-bold text-slate-900'>
                  {user?.name}
                </h1>
                {user?.role === 'admin' && (
                  <span className='text-xs bg-indigo-100 text-indigo-600 px-2 py-0.5 rounded-full font-semibold'>
                    Admin
                  </span>
                )}
              </div>
              <p className='text-sm text-slate-500 flex items-center gap-1.5'>
                <FaEnvelope size={12} className="text-slate-400" />
                {user?.email}
              </p>
              {user?.phone && (
                <p className='text-xs text-slate-400 flex items-center gap-1.5 mt-0.5'>
                  <FaPhone size={10} />
                  {user?.phone}
                </p>
              )}
            </div>
            <div className='flex items-center gap-2 w-full sm:w-auto'>
              {user?.role === 'admin' && (
                <Link
                  to='/admin'
                  className='flex-1 sm:flex-none text-center px-4 py-2 bg-indigo-50 text-indigo-600 text-xs font-semibold rounded-xl hover:bg-indigo-100 transition-colors'
                >
                  Dashboard
                </Link>
              )}
              <button
                onClick={handleLogout}
                className='flex-1 sm:flex-none px-4 py-2 bg-rose-50 text-rose-500 text-xs font-semibold rounded-xl hover:bg-rose-100 transition-colors flex items-center justify-center gap-1.5'
              >
                <FaSignOutAlt size={10} />
                Logout
              </button>
            </div>
          </div>
        </motion.div>

        {}
        <div className='grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5'>
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              whileHover={{ y: -2 }}
              className='bg-white rounded-xl sm:rounded-2xl shadow-sm border border-slate-100 p-3 sm:p-4 text-center hover:shadow-md transition-all'
            >
              <div className={`inline-flex p-2 rounded-lg bg-slate-50 mb-2 ${stat.color}`}>
                {stat.icon}
              </div>
              <p className={`text-xl sm:text-2xl font-black mb-0.5 ${stat.color}`}>
                {stat.value}
              </p>
              <p className='text-[10px] sm:text-xs text-slate-400 uppercase tracking-wide font-medium'>
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>

        {}
        <AnimatePresence>
          {reviewSuccess && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className='bg-amber-50 border border-amber-100 text-amber-600 text-xs rounded-xl px-4 py-3 mb-4 flex items-center justify-center gap-2'
            >
              <FaStar size={12} />
              {reviewSuccess}
            </motion.div>
          )}
        </AnimatePresence>

        {}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className='bg-white rounded-2xl sm:rounded-3xl shadow-sm border border-slate-100 overflow-hidden'
        >
          <div className='flex border-b border-slate-100'>
            {['bookings', 'account'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-3.5 text-xs font-bold uppercase tracking-wider transition-all ${
                  activeTab === tab
                    ? 'text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50/30'
                    : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                {tab === 'bookings'
                  ? `My Bookings (${bookings.length})`
                  : 'Account Settings'}
              </button>
            ))}
          </div>

          <div className='p-4 sm:p-6'>
            {}
            {activeTab === 'bookings' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {loading ? (
                  <div className='flex justify-center items-center h-40'>
                    <FaSpinner className='animate-spin text-indigo-600' size={28} />
                  </div>
                ) : bookings.length === 0 ? (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className='text-center py-12 sm:py-16'
                  >
                    <div className='w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-4'>
                      <FaCar size={32} className='text-slate-300' />
                    </div>
                    <p className='text-slate-400 font-medium text-sm mb-1'>
                      No bookings yet
                    </p>
                    <p className='text-slate-300 text-xs mb-5'>
                      Start by browsing our fleet
                    </p>
                    <Link
                      to='/cars'
                      className='inline-block px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl transition-colors'
                    >
                      Browse Cars
                    </Link>
                  </motion.div>
                ) : (
                  <motion.div 
                    variants={containerVars}
                    initial="hidden"
                    animate="visible"
                    className='space-y-3'
                  >
                    {bookings.map((booking) => {
                      const reviewInfo = reviewedBookings[booking._id];
                      const canLeaveReview = reviewInfo?.canReview;
                      const alreadyReviewed = reviewInfo?.reviewed;
                      const statusConfig = getStatusConfig(booking.status);
                      const paymentConfig = getPaymentConfig(booking.paymentStatus);

                      return (
                        <motion.div
                          key={booking._id}
                          variants={itemVars}
                          whileHover={{ y: -2 }}
                          className={`border rounded-xl sm:rounded-2xl overflow-hidden transition-all ${
                            booking.status === 'cancelled'
                              ? 'border-slate-100 opacity-60'
                              : 'border-slate-100 hover:border-indigo-200 hover:shadow-md'
                          }`}
                        >
                          <div className='flex flex-col sm:flex-row'>
                            <div className='w-full sm:w-40 h-28 sm:h-auto bg-slate-100 flex-shrink-0'>
                              {booking.car?.images?.[0] ? (
                                <img
                                  src={booking.car.images[0]}
                                  alt=''
                                  className='w-full h-full object-cover'
                                />
                              ) : (
                                <div className='w-full h-full flex items-center justify-center'>
                                  <FaCar size={24} className='text-slate-300' />
                                </div>
                              )}
                            </div>

                            <div className='flex-1 p-4'>
                              <div className='flex flex-col sm:flex-row sm:items-start justify-between gap-2 mb-2'>
                                <div>
                                  <h3 className='text-sm font-bold text-slate-900'>
                                    {booking.car?.brand} {booking.car?.model}
                                  </h3>
                                  <p className='text-[10px] sm:text-xs text-slate-500 flex items-center gap-1 mt-1'>
                                    <FaCalendarAlt size={10} className="text-slate-400" />
                                    {new Date(booking.startDate).toLocaleDateString()} →{' '}
                                    {new Date(booking.endDate).toLocaleDateString()}
                                  </p>
                                </div>
                                <div className='flex flex-wrap items-center gap-2'>
                                  <span className={`text-[10px] px-2 py-0.5 rounded-lg font-bold uppercase tracking-wider flex items-center gap-1 ${statusConfig.bg}`}>
                                    {statusConfig.icon}
                                    {booking.status}
                                  </span>
                                  <span className={`text-[10px] px-2 py-0.5 rounded-lg font-bold uppercase tracking-wider flex items-center gap-1 ${paymentConfig.bg}`}>
                                    {paymentConfig.icon}
                                    {booking.paymentStatus}
                                  </span>
                                </div>
                              </div>

                              <div className='flex flex-wrap gap-3 text-xs text-slate-500 mb-3'>
                                <span className='flex items-center gap-1'>
                                  <FaCalendarAlt size={10} />
                                  {booking.totalDays} day{booking.totalDays > 1 ? 's' : ''}
                                </span>
                                {booking.pickupLocation && (
                                  <span className='flex items-center gap-1'>
                                    <FaMapMarkerAlt size={10} />
                                    {booking.pickupLocation}
                                  </span>
                                )}
                              </div>

                              <div className='flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100'>
                                <span className='text-base font-black text-indigo-600 flex items-center gap-1'>
                                  <FaDollarSign size={12} />
                                  {booking.totalPrice}
                                </span>
                                <div className='flex items-center gap-2 flex-wrap'>
                                  {(booking.status === 'pending' ||
                                    booking.status === 'confirmed') && (
                                    <button
                                      onClick={() => setCancelConfirm(booking._id)}
                                      className='text-[10px] px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-500 font-bold rounded-lg transition-colors flex items-center gap-1'
                                    >
                                      <FaTrashAlt size={10} />
                                      Cancel
                                    </button>
                                  )}

                                  {booking.status === 'cancelled' && (
                                    <span className='text-[10px] px-3 py-1.5 text-slate-400 font-bold'>
                                      Cancelled
                                    </span>
                                  )}

                                  {booking.status === 'completed' && (
                                    <div className='flex items-center gap-2'>
                                      {alreadyReviewed ? (
                                        <span className='text-[10px] px-3 py-1.5 bg-amber-50 text-amber-500 font-bold rounded-lg flex items-center gap-1'>
                                          <FaStar size={10} />
                                          Reviewed
                                        </span>
                                      ) : canLeaveReview ? (
                                        <button
                                          onClick={() => {
                                            setReviewModal(booking);
                                            setReviewForm({
                                              rating: 5,
                                              comment: '',
                                            });
                                            setReviewError('');
                                          }}
                                          className='text-[10px] px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-600 font-bold rounded-lg transition-colors flex items-center gap-1'
                                        >
                                          <FaStar size={10} />
                                          Leave Review
                                        </button>
                                      ) : null}
                                      <Link
                                        to={`/cars/${booking.car?._id}`}
                                        className='text-[10px] px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 font-bold rounded-lg transition-colors'
                                      >
                                        Book Again
                                      </Link>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </motion.div>
                )}
              </motion.div>
            )}

            {}
            {activeTab === 'account' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className='grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6'
              >
                {}
                <div className='bg-slate-50 rounded-xl sm:rounded-2xl p-5 sm:p-6'>
                  <div className='flex items-center gap-3 mb-5'>
                    <div className='w-9 h-9 rounded-xl bg-indigo-100 flex items-center justify-center flex-shrink-0'>
                      <FaUser className='w-4 h-4 text-indigo-600' />
                    </div>
                    <div>
                      <h3 className='text-sm font-bold text-slate-900'>
                        Personal Info
                      </h3>
                      <p className='text-[10px] sm:text-xs text-slate-500'>
                        Update your name and phone
                      </p>
                    </div>
                  </div>
                  <div className='space-y-4'>
                    <div>
                      <label className={labelClass}>Full Name</label>
                      <input
                        type='text'
                        value={editForm.name}
                        onChange={(e) =>
                          setEditForm({ ...editForm, name: e.target.value })
                        }
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className={labelClass}>Phone Number</label>
                      <input
                        type='tel'
                        value={editForm.phone}
                        onChange={(e) =>
                          setEditForm({ ...editForm, phone: e.target.value })
                        }
                        placeholder='+212 6XX XXX XXX'
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className={labelClass}>Email Address</label>
                      <div className='relative'>
                        <input
                          type='email'
                          value={user?.email || ''}
                          readOnly
                          className='w-full px-4 py-3 bg-slate-100 rounded-xl text-sm text-slate-500 outline-none cursor-not-allowed'
                        />
                        <FaEnvelope className='absolute right-3 top-1/2 -translate-y-1/2 text-slate-400' size={14} />
                      </div>
                      <p className='text-[10px] text-slate-400 mt-1.5 flex items-center gap-1'>
                        <FaLock size={10} />
                        Email cannot be changed
                      </p>
                    </div>
                    
                    <AnimatePresence>
                      {profileSuccess && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className='bg-emerald-50 border border-emerald-100 text-emerald-600 text-xs rounded-xl px-4 py-3 flex items-center gap-2'
                        >
                          <FaCheckCircle size={12} />
                          {profileSuccess}
                        </motion.div>
                      )}
                    </AnimatePresence>
                    
                    <AnimatePresence>
                      {profileError && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className='bg-rose-50 border border-rose-100 text-rose-500 text-xs rounded-xl px-4 py-3'
                        >
                          {profileError}
                        </motion.div>
                      )}
                    </AnimatePresence>
                    
                    <button
                      onClick={handleUpdateProfile}
                      disabled={profileLoading}
                      className='w-full py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 text-white text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2'
                    >
                      {profileLoading ? (
                        <>
                          <FaSpinner className='animate-spin' size={12} />
                          Saving...
                        </>
                      ) : (
                        <>
                          <FaCheckCircle size={12} />
                          Save Changes
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {}
                <div className='bg-slate-50 rounded-xl sm:rounded-2xl p-5 sm:p-6'>
                  <div className='flex items-center gap-3 mb-5'>
                    <div className='w-9 h-9 rounded-xl bg-slate-200 flex items-center justify-center flex-shrink-0'>
                      <FaLock className='w-4 h-4 text-slate-600' />
                    </div>
                    <div>
                      <h3 className='text-sm font-bold text-slate-900'>
                        Change Password
                      </h3>
                      <p className='text-[10px] sm:text-xs text-slate-500'>
                        Keep your account secure
                      </p>
                    </div>
                  </div>
                  <div className='space-y-4'>
                    <div>
                      <label className={labelClass}>Current Password</label>
                      <div className='relative'>
                        <input
                          type={showPassword.current ? 'text' : 'password'}
                          value={passwordForm.currentPassword}
                          onChange={(e) =>
                            setPasswordForm({
                              ...passwordForm,
                              currentPassword: e.target.value,
                            })
                          }
                          placeholder='••••••••'
                          className={inputClass}
                        />
                        <button
                          type='button'
                          onClick={() => setShowPassword({ ...showPassword, current: !showPassword.current })}
                          className='absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600'
                        >
                          {showPassword.current ? <FaEyeSlash size={14} /> : <FaEye size={14} />}
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className={labelClass}>New Password</label>
                      <div className='relative'>
                        <input
                          type={showPassword.new ? 'text' : 'password'}
                          value={passwordForm.newPassword}
                          onChange={(e) =>
                            setPasswordForm({
                              ...passwordForm,
                              newPassword: e.target.value,
                            })
                          }
                          placeholder='••••••••'
                          className={inputClass}
                        />
                        <button
                          type='button'
                          onClick={() => setShowPassword({ ...showPassword, new: !showPassword.new })}
                          className='absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600'
                        >
                          {showPassword.new ? <FaEyeSlash size={14} /> : <FaEye size={14} />}
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className={labelClass}>Confirm New Password</label>
                      <div className='relative'>
                        <input
                          type={showPassword.confirm ? 'text' : 'password'}
                          value={passwordForm.confirmPassword}
                          onChange={(e) =>
                            setPasswordForm({
                              ...passwordForm,
                              confirmPassword: e.target.value,
                            })
                          }
                          placeholder='••••••••'
                          className={inputClass}
                        />
                        <button
                          type='button'
                          onClick={() => setShowPassword({ ...showPassword, confirm: !showPassword.confirm })}
                          className='absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600'
                        >
                          {showPassword.confirm ? <FaEyeSlash size={14} /> : <FaEye size={14} />}
                        </button>
                      </div>
                    </div>
                    <p className='text-[10px] text-slate-400 flex items-center gap-1'>
                      <FaShieldAlt size={10} />
                      Password must be at least 6 characters
                    </p>
                    
                    <AnimatePresence>
                      {passwordSuccess && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className='bg-emerald-50 border border-emerald-100 text-emerald-600 text-xs rounded-xl px-4 py-3 flex items-center gap-2'
                        >
                          <FaCheckCircle size={12} />
                          {passwordSuccess}
                        </motion.div>
                      )}
                    </AnimatePresence>
                    
                    <AnimatePresence>
                      {passwordError && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className='bg-rose-50 border border-rose-100 text-rose-500 text-xs rounded-xl px-4 py-3'
                        >
                          {passwordError}
                        </motion.div>
                      )}
                    </AnimatePresence>
                    
                    <button
                      onClick={handleChangePassword}
                      disabled={passwordLoading}
                      className='w-full py-3 bg-slate-800 hover:bg-slate-900 disabled:bg-slate-300 text-white text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2'
                    >
                      {passwordLoading ? (
                        <>
                          <FaSpinner className='animate-spin' size={12} />
                          Updating...
                        </>
                      ) : (
                        <>
                          <FaLock size={12} />
                          Update Password
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {}
                <div className='lg:col-span-2 bg-slate-50 rounded-xl sm:rounded-2xl p-5 sm:p-6'>
                  <div className='flex items-center gap-3 mb-5'>
                    <div className='w-9 h-9 rounded-xl bg-purple-100 flex items-center justify-center flex-shrink-0'>
                      <FaShieldAlt className='w-4 h-4 text-purple-600' />
                    </div>
                    <div>
                      <h3 className='text-sm font-bold text-slate-900'>
                        Account Info
                      </h3>
                      <p className='text-[10px] sm:text-xs text-slate-500'>
                        Your account details
                      </p>
                    </div>
                  </div>
                  <div className='grid grid-cols-1 sm:grid-cols-3 gap-3'>
                    <div className='bg-white rounded-xl p-4 border border-slate-100'>
                      <p className='text-[10px] text-slate-400 uppercase tracking-wide mb-1'>
                        Role
                      </p>
                      <p className='text-sm font-semibold text-slate-900 capitalize'>
                        {user?.role}
                      </p>
                    </div>
                    <div className='bg-white rounded-xl p-4 border border-slate-100'>
                      <p className='text-[10px] text-slate-400 uppercase tracking-wide mb-1'>
                        Email
                      </p>
                      <p className='text-sm font-semibold text-slate-900 truncate'>
                        {user?.email}
                      </p>
                    </div>
                    <div className='bg-white rounded-xl p-4 border border-slate-100'>
                      <p className='text-[10px] text-slate-400 uppercase tracking-wide mb-1'>
                        Total Bookings
                      </p>
                      <p className='text-sm font-semibold text-slate-900'>
                        {bookings.length} bookings
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>

      {}
      <AnimatePresence>
        {reviewModal && (
          <div className='fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 px-4'>
            <motion.div
              variants={modalVars}
              initial="hidden"
              animate="visible"
              exit="exit"
              className='bg-white rounded-2xl sm:rounded-3xl shadow-xl p-5 sm:p-6 max-w-sm w-full'
            >
              <div className='flex items-center gap-3 mb-5'>
                <div className='w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center flex-shrink-0'>
                  <FaStar className='text-amber-500' size={18} />
                </div>
                <div>
                  <h3 className='text-sm font-bold text-slate-900'>
                    Leave a Review
                  </h3>
                  <p className='text-xs text-slate-500'>
                    {reviewModal.car?.brand} {reviewModal.car?.model}
                  </p>
                </div>
              </div>

              <div className='mb-4'>
                <label className={labelClass}>Your Rating</label>
                <StarRating
                  rating={reviewForm.rating}
                  onRate={(star) =>
                    setReviewForm({ ...reviewForm, rating: star })
                  }
                />
                <p className='text-xs text-amber-500 font-semibold mt-1'>
                  {ratingLabel[reviewForm.rating]}
                </p>
              </div>

              <div className='mb-4'>
                <label className={labelClass}>Your Comment</label>
                <textarea
                  value={reviewForm.comment}
                  onChange={(e) =>
                    setReviewForm({ ...reviewForm, comment: e.target.value })
                  }
                  placeholder='Share your experience with this car...'
                  rows={3}
                  maxLength={500}
                  className='w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm text-slate-800 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-slate-400 resize-none'
                />
                <p className='text-[10px] text-slate-400 text-right mt-1'>
                  {reviewForm.comment.length}/500
                </p>
              </div>

              <AnimatePresence>
                {reviewError && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className='bg-rose-50 text-rose-500 text-xs rounded-xl px-4 py-3 mb-3 text-center'
                  >
                    {reviewError}
                  </motion.div>
                )}
              </AnimatePresence>

              <div className='flex gap-3'>
                <button
                  onClick={handleReview}
                  disabled={reviewLoading}
                  className='flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 text-white text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-2'
                >
                  {reviewLoading ? (
                    <FaSpinner className='animate-spin' size={12} />
                  ) : (
                    <>
                      <FaStar size={12} />
                      Submit Review
                    </>
                  )}
                </button>
                <button
                  onClick={() => {
                    setReviewModal(null);
                    setReviewError('');
                    setReviewForm({ rating: 5, comment: '' });
                  }}
                  className='flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-bold rounded-xl transition-colors'
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {}
      <AnimatePresence>
        {cancelConfirm && (
          <div className='fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 px-4'>
            <motion.div
              variants={modalVars}
              initial="hidden"
              animate="visible"
              exit="exit"
              className='bg-white rounded-2xl sm:rounded-3xl shadow-xl p-5 sm:p-6 max-w-sm w-full'
            >
              <div className='w-12 h-12 bg-rose-50 rounded-2xl flex items-center justify-center mx-auto mb-4'>
                <FaTrashAlt className='text-rose-500' size={20} />
              </div>
              <h3 className='text-sm font-bold text-slate-900 text-center mb-1'>
                Cancel Booking
              </h3>
              <p className='text-xs text-slate-500 text-center mb-5'>
                Are you sure you want to cancel this booking? This action cannot be undone.
              </p>
              <div className='flex gap-3'>
                <button
                  onClick={() => handleCancel(cancelConfirm)}
                  disabled={cancelling === cancelConfirm}
                  className='flex-1 py-2.5 bg-rose-500 hover:bg-rose-600 disabled:bg-rose-300 text-white text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-2'
                >
                  {cancelling === cancelConfirm ? (
                    <FaSpinner className='animate-spin' size={12} />
                  ) : (
                    'Yes, Cancel'
                  )}
                </button>
                <button
                  onClick={() => setCancelConfirm(null)}
                  className='flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-bold rounded-xl transition-colors'
                >
                  Keep Booking
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Profile;
