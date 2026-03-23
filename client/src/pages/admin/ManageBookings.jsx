import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Select from 'react-select';
import api from '../../services/api.js';

const ManageBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [filterStatus, setFilterStatus] = useState('');
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => { fetchBookings(); }, []);

  const fetchBookings = async () => {
    try {
      const res = await api.get('/bookings');
      setBookings(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id, status, paymentStatus) => {
    setUpdatingId(id);
    try {
      await api.put(`/bookings/${id}`, { status, paymentStatus });
      setSuccess('Booking updated!');
      fetchBookings();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Update failed');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/bookings/${id}`);
      setSuccess('Booking deleted!');
      fetchBookings();
      setDeleteConfirm(null);
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Delete failed');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-600';
      case 'pending': return 'bg-yellow-100 text-yellow-600';
      case 'cancelled': return 'bg-red-100 text-red-500';
      case 'completed': return 'bg-blue-100 text-blue-600';
      default: return 'bg-gray-100 text-gray-500';
    }
  };

  const getPaymentColor = (status) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-600';
      case 'unpaid': return 'bg-orange-100 text-orange-500';
      case 'refunded': return 'bg-purple-100 text-purple-600';
      default: return 'bg-gray-100 text-gray-500';
    }
  };

  const statusOptions = [
    { value: 'pending', label: '🕐 Pending', color: '#d97706' },
    { value: 'confirmed', label: '✅ Confirmed', color: '#16a34a' },
    { value: 'completed', label: '🏁 Completed', color: '#2563eb' },
    { value: 'cancelled', label: '❌ Cancelled', color: '#ef4444' },
  ];

  const paymentOptions = [
    { value: 'unpaid', label: '💳 Unpaid', color: '#f97316' },
    { value: 'paid', label: '✅ Paid', color: '#16a34a' },
    { value: 'refunded', label: '↩️ Refunded', color: '#9333ea' },
  ];

  const makeSelectStyles = (type) => ({
    control: (base, state) => ({
      ...base,
      border: `1.5px solid ${state.isFocused ? '#3b82f6' : '#f3f4f6'}`,
      boxShadow: state.isFocused ? '0 0 0 3px rgba(59,130,246,0.1)' : 'none',
      background: '#f9fafb',
      minHeight: '34px',
      height: '34px',
      cursor: 'pointer',
      borderRadius: '12px',
      transition: 'all 0.2s ease',
      width: type === 'status' ? '150px' : '130px',
      '&:hover': { borderColor: '#3b82f6', background: 'white' },
    }),
    valueContainer: (base) => ({ ...base, padding: '0 10px', height: '34px' }),
    singleValue: (base, { data }) => ({
      ...base,
      fontSize: '12px',
      fontWeight: '600',
      color: data.color || '#374151',
    }),
    indicatorSeparator: () => ({ display: 'none' }),
    dropdownIndicator: (base, state) => ({
      ...base,
      color: state.isFocused ? '#3b82f6' : '#9ca3af',
      padding: '0 6px',
      transition: 'all 0.2s ease',
      transform: state.selectProps.menuIsOpen ? 'rotate(180deg)' : 'rotate(0deg)',
    }),
    menu: (base) => ({
      ...base,
      borderRadius: '14px',
      boxShadow: '0 10px 40px rgba(0,0,0,0.12)',
      border: '1px solid #f1f5f9',
      overflow: 'hidden',
      marginTop: '4px',
      zIndex: 999,
      animation: 'selectSlideDown 0.15s ease-out forwards',
    }),
    menuList: (base) => ({ ...base, padding: '4px' }),
    option: (base, state) => ({
      ...base,
      borderRadius: '10px',
      fontSize: '12px',
      padding: '8px 10px',
      cursor: 'pointer',
      fontWeight: state.isSelected ? '600' : '400',
      backgroundColor: state.isSelected ? '#3b82f6' : state.isFocused ? '#eff6ff' : 'white',
      color: state.isSelected ? 'white' : '#374151',
      transition: 'all 0.1s ease',
    }),
    placeholder: (base) => ({ ...base, fontSize: '12px', color: '#9ca3af' }),
  });

  const filteredBookings = filterStatus
    ? bookings.filter(b => b.status === filterStatus)
    : bookings;

  const stats = [
    { label: 'Total', value: bookings.length, color: 'text-gray-900', bg: 'bg-gray-50' },
    { label: 'Pending', value: bookings.filter(b => b.status === 'pending').length, color: 'text-yellow-600', bg: 'bg-yellow-50' },
    { label: 'Confirmed', value: bookings.filter(b => b.status === 'confirmed').length, color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'Cancelled', value: bookings.filter(b => b.status === 'cancelled').length, color: 'text-red-500', bg: 'bg-red-50' },
    { label: 'Completed', value: bookings.filter(b => b.status === 'completed').length, color: 'text-blue-600', bg: 'bg-blue-50' },
  ];

  return (
    <div className='min-h-screen bg-[#eaecf5] pt-20 pb-10'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 py-8'>

        {/* Header */}
        <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6'>
          <div>
            <Link to='/admin' className='text-xs text-gray-400 hover:text-blue-600 transition-colors flex items-center gap-1 mb-1 w-fit'>
              <svg className='w-3 h-3' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15 19l-7-7 7-7' />
              </svg>
              Dashboard
            </Link>
            <h1 className='text-2xl sm:text-3xl font-bold text-gray-900'>Manage Bookings</h1>
          </div>
          <span className='text-xs bg-blue-50 text-blue-600 px-3 py-1.5 rounded-full font-semibold w-fit'>
            {filteredBookings.length} bookings
          </span>
        </div>

        {/* Alerts */}
        {success && (
          <div className='bg-green-50 border border-green-100 text-green-600 text-xs rounded-2xl px-4 py-3 mb-4 flex items-center justify-center gap-2'>
            <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M5 13l4 4L19 7' />
            </svg>
            {success}
          </div>
        )}
        {error && (
          <div className='bg-red-50 border border-red-100 text-red-500 text-xs rounded-2xl px-4 py-3 mb-4 text-center'>
            {error}
          </div>
        )}

        {/* Stats */}
        <div className='grid grid-cols-3 sm:grid-cols-5 gap-3 mb-5'>
          {stats.map((stat, i) => (
            <button
              key={i}
              onClick={() => setFilterStatus(stat.label === 'Total' ? '' : stat.label.toLowerCase())}
              className={`bg-white rounded-2xl shadow-sm p-3 sm:p-4 text-center transition-all hover:shadow-md active:scale-95 ${
                filterStatus === stat.label.toLowerCase() || (stat.label === 'Total' && filterStatus === '')
                  ? 'ring-2 ring-blue-500 shadow-md'
                  : ''
              }`}
            >
              <p className={`text-xl sm:text-2xl font-black mb-0.5 ${stat.color}`}>{stat.value}</p>
              <p className='text-xs text-gray-400 font-medium'>{stat.label}</p>
            </button>
          ))}
        </div>

        {/* Filter Pills */}
        <div className='flex items-center gap-2 mb-4 flex-wrap'>
          {['', 'pending', 'confirmed', 'completed', 'cancelled'].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                filterStatus === status
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-white text-gray-500 hover:bg-gray-50 border border-gray-100'
              }`}
            >
              {status === '' ? 'All' : status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>

        {/* Bookings List */}
        <div className='bg-white rounded-2xl shadow-sm overflow-hidden'>
          <div className='px-5 py-4 border-b border-gray-50 flex items-center justify-between'>
            <h2 className='text-sm font-bold text-gray-900'>
              {filterStatus ? `${filterStatus.charAt(0).toUpperCase() + filterStatus.slice(1)} Bookings` : 'All Bookings'}
            </h2>
            {filteredBookings.length > 0 && (
              <span className='text-xs text-gray-400'>{filteredBookings.length} results</span>
            )}
          </div>

          {loading ? (
            <div className='flex justify-center items-center h-40'>
              <div className='w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin' />
            </div>
          ) : filteredBookings.length === 0 ? (
            <div className='text-center py-16'>
              <p className='text-3xl mb-2'>📋</p>
              <p className='text-gray-400 text-sm font-medium'>No bookings found</p>
            </div>
          ) : (
            <div className='divide-y divide-gray-50'>
              {filteredBookings.map((booking, idx) => (
                <div
                  key={booking._id}
                  className='p-4 sm:p-5 hover:bg-gray-50 transition-colors'
                  style={{ animation: `fadeSlideUp 0.4s ease-out ${idx * 0.05}s both` }}
                >
                  <div className='flex gap-3 sm:gap-4'>

                    {/* Car Image — small fixed size on all screens */}
                    <div className='w-16 h-16 sm:w-24 sm:h-16 rounded-2xl bg-[#eaecf5] overflow-hidden flex-shrink-0'>
                      {booking.car?.images?.[0] ? (
                        <img src={booking.car.images[0]} alt='' className='w-full h-full object-cover' />
                      ) : (
                        <div className='w-full h-full flex items-center justify-center text-gray-300 text-lg'>🚗</div>
                      )}
                    </div>

                    {/* Info */}
                    <div className='flex-1 min-w-0'>

                      {/* Top row */}
                      <div className='flex items-start justify-between gap-2 mb-1.5'>
                        <div className='min-w-0'>
                          <p className='text-sm font-bold text-gray-900 truncate'>
                            {booking.car?.brand} {booking.car?.model}
                          </p>
                          <p className='text-xs text-gray-400 truncate'>
                            👤 {booking.user?.name}
                            <span className='hidden sm:inline'> • {booking.user?.email}</span>
                          </p>
                        </div>
                        <div className='flex flex-col items-end gap-1 flex-shrink-0'>
                          <span className={`text-xs px-2 py-0.5 rounded-full font-semibold capitalize ${getStatusColor(booking.status)}`}>
                            {booking.status}
                          </span>
                          <span className={`text-xs px-2 py-0.5 rounded-full font-semibold capitalize ${getPaymentColor(booking.paymentStatus)}`}>
                            {booking.paymentStatus}
                          </span>
                        </div>
                      </div>

                      {/* Dates + Price */}
                      <div className='flex flex-wrap items-center gap-2 text-xs text-gray-400 mb-3'>
                        <span>📅 {new Date(booking.startDate).toLocaleDateString()} → {new Date(booking.endDate).toLocaleDateString()}</span>
                        <span className='hidden sm:block'>🗓️ {booking.totalDays} days</span>
                        {booking.pickupLocation && <span className='hidden sm:block'>📍 {booking.pickupLocation}</span>}
                        <span className='font-bold text-blue-600 text-sm ml-auto sm:ml-0'>${booking.totalPrice}</span>
                      </div>

                      {/* Actions */}
                      <div className='flex flex-wrap items-center gap-2'>
                        <Select
                          value={statusOptions.find(o => o.value === booking.status)}
                          onChange={(opt) => handleStatusUpdate(booking._id, opt.value, booking.paymentStatus)}
                          options={statusOptions}
                          styles={makeSelectStyles('status')}
                          isDisabled={updatingId === booking._id}
                          isSearchable={false}
                        />
                        <Select
                          value={paymentOptions.find(o => o.value === booking.paymentStatus)}
                          onChange={(opt) => handleStatusUpdate(booking._id, booking.status, opt.value)}
                          options={paymentOptions}
                          styles={makeSelectStyles('payment')}
                          isDisabled={updatingId === booking._id}
                          isSearchable={false}
                        />
                        {updatingId === booking._id && (
                          <div className='w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin' />
                        )}
                        <button
                          onClick={() => setDeleteConfirm(booking._id)}
                          className='ml-auto flex items-center gap-1.5 px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-500 text-xs font-semibold rounded-xl transition-colors'
                        >
                          <svg className='w-3 h-3' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16' />
                          </svg>
                          <span className='hidden sm:block'>Delete</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Delete Modal */}
        {deleteConfirm && (
          <div className='fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 px-4'>
            <div className='bg-white rounded-2xl shadow-xl p-6 max-w-sm w-full' style={{ animation: 'scaleIn 0.2s ease-out forwards' }}>
              <div className='w-12 h-12 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-4'>
                <svg className='w-6 h-6 text-red-500' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16' />
                </svg>
              </div>
              <h3 className='text-sm font-bold text-gray-900 text-center mb-1'>Delete Booking</h3>
              <p className='text-xs text-gray-400 text-center mb-5'>Are you sure? This cannot be undone.</p>
              <div className='flex gap-3'>
                <button
                  onClick={() => handleDelete(deleteConfirm)}
                  className='flex-1 py-2.5 bg-red-500 hover:bg-red-600 text-white text-xs font-semibold rounded-xl transition-colors'
                >
                  Delete
                </button>
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className='flex-1 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-600 text-xs font-semibold rounded-xl transition-colors'
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageBookings;