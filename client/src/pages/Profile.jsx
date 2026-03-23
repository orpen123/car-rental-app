import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
        className={`${size} transition-transform ${!readonly ? 'hover:scale-110 cursor-pointer' : 'cursor-default'} ${
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

  // Review states
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

  const fetchBookings = async () => {
    try {
      const res = await api.get('/bookings/my');
      setBookings(res.data);
      // Check which completed bookings already have reviews
      const completed = res.data.filter((b) => b.status === 'completed');
      // const reviewChecks = await Promise.all(
      //   completed.map(b => api.get(`/reviews/can-review/${b._id}`).then(r => ({ id: b._id, ...r.data })))
      // );
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

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-600';
      case 'pending':
        return 'bg-yellow-100 text-yellow-600';
      case 'cancelled':
        return 'bg-red-100 text-red-500';
      case 'completed':
        return 'bg-blue-100 text-blue-600';
      default:
        return 'bg-gray-100 text-gray-500';
    }
  };

  const getPaymentColor = (status) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-600';
      case 'unpaid':
        return 'bg-orange-100 text-orange-500';
      case 'refunded':
        return 'bg-purple-100 text-purple-600';
      default:
        return 'bg-gray-100 text-gray-500';
    }
  };

  const stats = [
    { label: 'Total', value: bookings.length, color: 'text-blue-600' },
    {
      label: 'Active',
      value: bookings.filter((b) => b.status === 'confirmed').length,
      color: 'text-green-600',
    },
    {
      label: 'Completed',
      value: bookings.filter((b) => b.status === 'completed').length,
      color: 'text-purple-600',
    },
    {
      label: 'Cancelled',
      value: bookings.filter((b) => b.status === 'cancelled').length,
      color: 'text-red-500',
    },
  ];

  const inputClass =
    'w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl text-sm text-gray-800 outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all';
  const labelClass =
    'block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5';

  return (
    <div className='min-h-screen bg-[#eaecf5] pt-20 pb-10'>
      <div className='max-w-6xl mx-auto px-4 sm:px-6 py-8'>
        {/* Profile Header */}
        <div className='bg-white rounded-2xl shadow-sm p-5 sm:p-6 mb-5'>
          <div className='flex flex-col sm:flex-row items-start sm:items-center gap-4'>
            <div className='w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white font-black text-2xl flex-shrink-0 shadow-md shadow-blue-200'>
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div className='flex-1'>
              <div className='flex items-center gap-2 mb-1'>
                <h1 className='text-xl font-bold text-gray-900'>
                  {user?.name}
                </h1>
                {user?.role === 'admin' && (
                  <span className='text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full font-semibold'>
                    Admin
                  </span>
                )}
              </div>
              <p className='text-sm text-gray-400'>{user?.email}</p>
              {user?.phone && (
                <p className='text-xs text-gray-400 mt-0.5'>📞 {user?.phone}</p>
              )}
            </div>
            <div className='flex items-center gap-2 w-full sm:w-auto'>
              {user?.role === 'admin' && (
                <Link
                  to='/admin'
                  className='flex-1 sm:flex-none text-center px-4 py-2 bg-blue-50 text-blue-600 text-xs font-semibold rounded-xl hover:bg-blue-100 transition-colors'
                >
                  Dashboard
                </Link>
              )}
              <button
                onClick={handleLogout}
                className='flex-1 sm:flex-none px-4 py-2 bg-red-50 text-red-500 text-xs font-semibold rounded-xl hover:bg-red-100 transition-colors'
              >
                Logout
              </button>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className='grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5'>
          {stats.map((stat, i) => (
            <div
              key={i}
              className='bg-white rounded-2xl shadow-sm p-4 text-center hover:shadow-md transition-shadow'
            >
              <p className={`text-2xl font-black mb-1 ${stat.color}`}>
                {stat.value}
              </p>
              <p className='text-xs text-gray-400 uppercase tracking-wide'>
                {stat.label}
              </p>
            </div>
          ))}
        </div>

        {/* Review Success Toast */}
        {reviewSuccess && (
          <div className='bg-yellow-50 border border-yellow-100 text-yellow-600 text-xs rounded-2xl px-4 py-3 mb-4 flex items-center justify-center gap-2'>
            ⭐ {reviewSuccess}
          </div>
        )}

        {/* Tabs */}
        <div className='bg-white rounded-2xl shadow-sm overflow-hidden'>
          <div className='flex border-b border-gray-100'>
            {['bookings', 'account'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-3.5 text-xs font-semibold uppercase tracking-wide transition-colors ${
                  activeTab === tab
                    ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                    : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                {tab === 'bookings'
                  ? `My Bookings (${bookings.length})`
                  : 'Account Settings'}
              </button>
            ))}
          </div>

          <div className='p-5 sm:p-6'>
            {/* ===== BOOKINGS TAB ===== */}
            {activeTab === 'bookings' && (
              <div>
                {loading ? (
                  <div className='flex justify-center items-center h-40'>
                    <div className='w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin' />
                  </div>
                ) : bookings.length === 0 ? (
                  <div className='text-center py-16'>
                    <div className='w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-4'>
                      <svg
                        className='w-8 h-8 text-gray-300'
                        fill='none'
                        stroke='currentColor'
                        viewBox='0 0 24 24'
                      >
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          strokeWidth={1}
                          d='M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z'
                        />
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          strokeWidth={1}
                          d='M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10l2-2h8z'
                        />
                      </svg>
                    </div>
                    <p className='text-gray-400 font-medium text-sm mb-1'>
                      No bookings yet
                    </p>
                    <p className='text-gray-300 text-xs mb-5'>
                      Start by browsing our fleet
                    </p>
                    <Link
                      to='/cars'
                      className='inline-block px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl transition-colors'
                    >
                      Browse Cars
                    </Link>
                  </div>
                ) : (
                  <div className='space-y-3'>
                    {bookings.map((booking) => {
                      const reviewInfo = reviewedBookings[booking._id];
                      const canLeaveReview = reviewInfo?.canReview;
                      const alreadyReviewed = reviewInfo?.reviewed;

                      return (
                        <div
                          key={booking._id}
                          className={`border rounded-2xl overflow-hidden transition-all ${
                            booking.status === 'cancelled'
                              ? 'border-gray-100 opacity-60'
                              : 'border-gray-100 hover:border-blue-100 hover:shadow-sm'
                          }`}
                        >
                          <div className='flex flex-col sm:flex-row'>
                            <div className='w-full sm:w-40 h-28 sm:h-auto bg-[#eaecf5] flex-shrink-0'>
                              {booking.car?.images?.[0] ? (
                                <img
                                  src={booking.car.images[0]}
                                  alt=''
                                  className='w-full h-full object-cover'
                                />
                              ) : (
                                <div className='w-full h-full flex items-center justify-center'>
                                  <svg
                                    className='w-8 h-8 text-gray-300'
                                    fill='none'
                                    stroke='currentColor'
                                    viewBox='0 0 24 24'
                                  >
                                    <path
                                      strokeLinecap='round'
                                      strokeLinejoin='round'
                                      strokeWidth={1}
                                      d='M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z'
                                    />
                                  </svg>
                                </div>
                              )}
                            </div>

                            <div className='flex-1 p-4'>
                              <div className='flex items-start justify-between mb-2'>
                                <div>
                                  <h3 className='text-sm font-bold text-gray-900'>
                                    {booking.car?.brand} {booking.car?.model}
                                  </h3>
                                  <p className='text-xs text-gray-400 mt-0.5'>
                                    📅{' '}
                                    {new Date(
                                      booking.startDate,
                                    ).toLocaleDateString()}{' '}
                                    →{' '}
                                    {new Date(
                                      booking.endDate,
                                    ).toLocaleDateString()}
                                  </p>
                                </div>
                                <div className='flex flex-col items-end gap-1'>
                                  <span
                                    className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize ${getStatusColor(booking.status)}`}
                                  >
                                    {booking.status}
                                  </span>
                                  <span
                                    className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize ${getPaymentColor(booking.paymentStatus)}`}
                                  >
                                    {booking.paymentStatus}
                                  </span>
                                </div>
                              </div>

                              <div className='flex flex-wrap gap-3 text-xs text-gray-400 mb-3'>
                                <span>
                                  🗓️ {booking.totalDays} day
                                  {booking.totalDays > 1 ? 's' : ''}
                                </span>
                                {booking.pickupLocation && (
                                  <span>📍 {booking.pickupLocation}</span>
                                )}
                              </div>

                              <div className='flex items-center justify-between pt-3 border-t border-gray-50'>
                                <span className='text-base font-black text-blue-600'>
                                  ${booking.totalPrice}
                                </span>
                                <div className='flex items-center gap-2 flex-wrap justify-end'>
                                  {/* Pending / Confirmed → Cancel */}
                                  {(booking.status === 'pending' ||
                                    booking.status === 'confirmed') && (
                                    <button
                                      onClick={() =>
                                        setCancelConfirm(booking._id)
                                      }
                                      className='text-xs px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-500 font-semibold rounded-xl transition-colors'
                                    >
                                      Cancel
                                    </button>
                                  )}

                                  {/* Cancelled */}
                                  {booking.status === 'cancelled' && (
                                    <span className='text-xs text-gray-400'>
                                      Cancelled
                                    </span>
                                  )}

                                  {/* Completed → Review + Book Again */}
                                  {booking.status === 'completed' && (
                                    <div className='flex items-center gap-2'>
                                      {alreadyReviewed ? (
                                        <span className='text-xs px-3 py-1.5 bg-yellow-50 text-yellow-500 font-semibold rounded-xl flex items-center gap-1'>
                                          ⭐ Reviewed
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
                                          className='text-xs px-3 py-1.5 bg-yellow-50 hover:bg-yellow-100 text-yellow-600 font-semibold rounded-xl transition-colors flex items-center gap-1'
                                        >
                                          ⭐ Leave Review
                                        </button>
                                      ) : null}
                                      <Link
                                        to={`/cars/${booking.car?._id}`}
                                        className='text-xs px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 font-semibold rounded-xl transition-colors'
                                      >
                                        Book Again
                                      </Link>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* ===== ACCOUNT TAB ===== */}
            {activeTab === 'account' && (
              <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
                {/* Personal Info */}
                <div className='bg-gray-50 rounded-2xl p-5 sm:p-6'>
                  <div className='flex items-center gap-3 mb-5'>
                    <div className='w-9 h-9 rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0'>
                      <svg
                        className='w-4 h-4 text-blue-600'
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
                    </div>
                    <div>
                      <h3 className='text-sm font-bold text-gray-900'>
                        Personal Info
                      </h3>
                      <p className='text-xs text-gray-400'>
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
                        className={`${inputClass} placeholder-gray-300`}
                      />
                    </div>
                    <div>
                      <label className={labelClass}>Email Address</label>
                      <input
                        type='email'
                        value={user?.email || ''}
                        readOnly
                        className='w-full px-4 py-3 bg-gray-200 rounded-2xl text-sm text-gray-400 outline-none cursor-not-allowed'
                      />
                      <p className='text-xs text-gray-400 mt-1.5 flex items-center gap-1'>
                        <svg
                          className='w-3 h-3'
                          fill='none'
                          stroke='currentColor'
                          viewBox='0 0 24 24'
                        >
                          <path
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            strokeWidth={2}
                            d='M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z'
                          />
                        </svg>
                        Email cannot be changed
                      </p>
                    </div>
                    {profileSuccess && (
                      <div className='bg-green-50 border border-green-100 text-green-600 text-xs rounded-xl px-4 py-3 flex items-center gap-2'>
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
                            d='M5 13l4 4L19 7'
                          />
                        </svg>
                        {profileSuccess}
                      </div>
                    )}
                    {profileError && (
                      <div className='bg-red-50 border border-red-100 text-red-500 text-xs rounded-xl px-4 py-3'>
                        {profileError}
                      </div>
                    )}
                    <button
                      onClick={handleUpdateProfile}
                      disabled={profileLoading}
                      className='w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white text-xs font-semibold rounded-2xl transition-all flex items-center justify-center gap-2'
                    >
                      {profileLoading ? (
                        <>
                          <div className='w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin' />
                          Saving...
                        </>
                      ) : (
                        <>
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
                              d='M5 13l4 4L19 7'
                            />
                          </svg>
                          Save Changes
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Change Password */}
                <div className='bg-gray-50 rounded-2xl p-5 sm:p-6'>
                  <div className='flex items-center gap-3 mb-5'>
                    <div className='w-9 h-9 rounded-xl bg-gray-200 flex items-center justify-center flex-shrink-0'>
                      <svg
                        className='w-4 h-4 text-gray-600'
                        fill='none'
                        stroke='currentColor'
                        viewBox='0 0 24 24'
                      >
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          strokeWidth={2}
                          d='M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z'
                        />
                      </svg>
                    </div>
                    <div>
                      <h3 className='text-sm font-bold text-gray-900'>
                        Change Password
                      </h3>
                      <p className='text-xs text-gray-400'>
                        Keep your account secure
                      </p>
                    </div>
                  </div>
                  <div className='space-y-4'>
                    <div>
                      <label className={labelClass}>Current Password</label>
                      <input
                        type='password'
                        value={passwordForm.currentPassword}
                        onChange={(e) =>
                          setPasswordForm({
                            ...passwordForm,
                            currentPassword: e.target.value,
                          })
                        }
                        placeholder='••••••••'
                        className={`${inputClass} placeholder-gray-300`}
                      />
                    </div>
                    <div>
                      <label className={labelClass}>New Password</label>
                      <input
                        type='password'
                        value={passwordForm.newPassword}
                        onChange={(e) =>
                          setPasswordForm({
                            ...passwordForm,
                            newPassword: e.target.value,
                          })
                        }
                        placeholder='••••••••'
                        className={`${inputClass} placeholder-gray-300`}
                      />
                    </div>
                    <div>
                      <label className={labelClass}>Confirm New Password</label>
                      <input
                        type='password'
                        value={passwordForm.confirmPassword}
                        onChange={(e) =>
                          setPasswordForm({
                            ...passwordForm,
                            confirmPassword: e.target.value,
                          })
                        }
                        placeholder='••••••••'
                        className={`${inputClass} placeholder-gray-300`}
                      />
                    </div>
                    <p className='text-xs text-gray-400 flex items-center gap-1'>
                      <svg
                        className='w-3 h-3'
                        fill='none'
                        stroke='currentColor'
                        viewBox='0 0 24 24'
                      >
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          strokeWidth={2}
                          d='M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
                        />
                      </svg>
                      Password must be at least 6 characters
                    </p>
                    {passwordSuccess && (
                      <div className='bg-green-50 border border-green-100 text-green-600 text-xs rounded-xl px-4 py-3 flex items-center gap-2'>
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
                            d='M5 13l4 4L19 7'
                          />
                        </svg>
                        {passwordSuccess}
                      </div>
                    )}
                    {passwordError && (
                      <div className='bg-red-50 border border-red-100 text-red-500 text-xs rounded-xl px-4 py-3'>
                        {passwordError}
                      </div>
                    )}
                    <button
                      onClick={handleChangePassword}
                      disabled={passwordLoading}
                      className='w-full py-3 bg-gray-900 hover:bg-black disabled:bg-gray-300 text-white text-xs font-semibold rounded-2xl transition-all flex items-center justify-center gap-2'
                    >
                      {passwordLoading ? (
                        <>
                          <div className='w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin' />
                          Updating...
                        </>
                      ) : (
                        <>
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
                              d='M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z'
                            />
                          </svg>
                          Update Password
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Account Info */}
                <div className='lg:col-span-2 bg-gray-50 rounded-2xl p-5 sm:p-6'>
                  <div className='flex items-center gap-3 mb-5'>
                    <div className='w-9 h-9 rounded-xl bg-purple-100 flex items-center justify-center flex-shrink-0'>
                      <svg
                        className='w-4 h-4 text-purple-600'
                        fill='none'
                        stroke='currentColor'
                        viewBox='0 0 24 24'
                      >
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          strokeWidth={2}
                          d='M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z'
                        />
                      </svg>
                    </div>
                    <div>
                      <h3 className='text-sm font-bold text-gray-900'>
                        Account Info
                      </h3>
                      <p className='text-xs text-gray-400'>
                        Your account details
                      </p>
                    </div>
                  </div>
                  <div className='grid grid-cols-1 sm:grid-cols-3 gap-4'>
                    <div className='bg-white rounded-2xl p-4'>
                      <p className='text-xs text-gray-400 uppercase tracking-wide mb-1'>
                        Role
                      </p>
                      <p className='text-sm font-semibold text-gray-900 capitalize'>
                        {user?.role}
                      </p>
                    </div>
                    <div className='bg-white rounded-2xl p-4'>
                      <p className='text-xs text-gray-400 uppercase tracking-wide mb-1'>
                        Email
                      </p>
                      <p className='text-sm font-semibold text-gray-900 truncate'>
                        {user?.email}
                      </p>
                    </div>
                    <div className='bg-white rounded-2xl p-4'>
                      <p className='text-xs text-gray-400 uppercase tracking-wide mb-1'>
                        Total Bookings
                      </p>
                      <p className='text-sm font-semibold text-gray-900'>
                        {bookings.length} bookings
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ===== REVIEW MODAL ===== */}
      {reviewModal && (
        <div className='fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 px-4'>
          <div
            className='bg-white rounded-2xl shadow-xl p-6 max-w-sm w-full'
            style={{ animation: 'scaleIn 0.2s ease-out forwards' }}
          >
            {/* Header */}
            <div className='flex items-center gap-3 mb-5'>
              <div className='w-10 h-10 bg-yellow-50 rounded-xl flex items-center justify-center text-xl flex-shrink-0'>
                ⭐
              </div>
              <div>
                <h3 className='text-sm font-bold text-gray-900'>
                  Leave a Review
                </h3>
                <p className='text-xs text-gray-400'>
                  {reviewModal.car?.brand} {reviewModal.car?.model}
                </p>
              </div>
            </div>

            {/* Star Rating */}
            <div className='mb-4'>
              <label className={labelClass}>Your Rating</label>
              <StarRating
                rating={reviewForm.rating}
                onRate={(star) =>
                  setReviewForm({ ...reviewForm, rating: star })
                }
              />
              <p className='text-xs text-yellow-500 font-semibold mt-1'>
                {ratingLabel[reviewForm.rating]}
              </p>
            </div>

            {/* Comment */}
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
                className='w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl text-sm text-gray-800 outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all placeholder-gray-300 resize-none'
              />
              <p className='text-xs text-gray-300 text-right mt-1'>
                {reviewForm.comment.length}/500
              </p>
            </div>

            {reviewError && (
              <div className='bg-red-50 text-red-500 text-xs rounded-xl px-4 py-3 mb-3 text-center'>
                {reviewError}
              </div>
            )}

            <div className='flex gap-3'>
              <button
                onClick={handleReview}
                disabled={reviewLoading}
                className='flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white text-xs font-semibold rounded-xl transition-colors flex items-center justify-center gap-2'
              >
                {reviewLoading ? (
                  <div className='w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin' />
                ) : (
                  '⭐ Submit Review'
                )}
              </button>
              <button
                onClick={() => {
                  setReviewModal(null);
                  setReviewError('');
                  setReviewForm({ rating: 5, comment: '' });
                }}
                className='flex-1 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-600 text-xs font-semibold rounded-xl transition-colors'
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===== CANCEL MODAL ===== */}
      {cancelConfirm && (
        <div className='fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 px-4'>
          <div
            className='bg-white rounded-2xl shadow-xl p-6 max-w-sm w-full'
            style={{ animation: 'scaleIn 0.2s ease-out forwards' }}
          >
            <div className='w-12 h-12 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-4'>
              <svg
                className='w-6 h-6 text-red-500'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z'
                />
              </svg>
            </div>
            <h3 className='text-sm font-bold text-gray-900 text-center mb-1'>
              Cancel Booking
            </h3>
            <p className='text-xs text-gray-400 text-center mb-5'>
              Are you sure you want to cancel this booking? This action cannot
              be undone.
            </p>
            <div className='flex gap-3'>
              <button
                onClick={() => handleCancel(cancelConfirm)}
                disabled={cancelling === cancelConfirm}
                className='flex-1 py-2.5 bg-red-500 hover:bg-red-600 disabled:bg-red-300 text-white text-xs font-semibold rounded-xl transition-colors flex items-center justify-center gap-2'
              >
                {cancelling === cancelConfirm ? (
                  <>
                    <div className='w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin' />
                    Cancelling...
                  </>
                ) : (
                  'Yes, Cancel'
                )}
              </button>
              <button
                onClick={() => setCancelConfirm(null)}
                className='flex-1 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-600 text-xs font-semibold rounded-xl transition-colors'
              >
                Keep Booking
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
