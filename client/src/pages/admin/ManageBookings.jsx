import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api.js';

const ManageBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [filterStatus, setFilterStatus] = useState('');
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    fetchBookings();
  }, []);

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
      setSuccess('Booking updated successfully!');
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
      setSuccess('Booking deleted successfully!');
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

  const filteredBookings = filterStatus
    ? bookings.filter(b => b.status === filterStatus)
    : bookings;

  const stats = [
    { label: 'Total', value: bookings.length, color: 'text-gray-900' },
    { label: 'Pending', value: bookings.filter(b => b.status === 'pending').length, color: 'text-yellow-600' },
    { label: 'Confirmed', value: bookings.filter(b => b.status === 'confirmed').length, color: 'text-green-600' },
    { label: 'Cancelled', value: bookings.filter(b => b.status === 'cancelled').length, color: 'text-red-500' },
    { label: 'Completed', value: bookings.filter(b => b.status === 'completed').length, color: 'text-blue-600' },
  ];

  return (
    <div className='min-h-screen bg-[#eaecf5] pt-20 pb-10'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 py-8'>

        {/* Header */}
        <div className='flex items-center justify-between mb-6'>
          <div>
            <Link to='/admin' className='text-xs text-gray-400 hover:text-blue-600 transition-colors'>
              ← Dashboard
            </Link>
            <h1 className='text-2xl sm:text-3xl font-bold text-gray-900 mt-1'>Manage Bookings</h1>
          </div>
          <span className='text-xs text-gray-400 bg-white px-3 py-1.5 rounded-xl shadow-sm'>
            {filteredBookings.length} bookings
          </span>
        </div>

        {/* Success / Error */}
        {success && (
          <div className='bg-green-50 border border-green-100 text-green-600 text-xs rounded-2xl px-4 py-3 mb-4 text-center'>
            ✅ {success}
          </div>
        )}
        {error && (
          <div className='bg-red-50 border border-red-100 text-red-500 text-xs rounded-2xl px-4 py-3 mb-4 text-center'>
            {error}
          </div>
        )}

        {/* Stats */}
        <div className='grid grid-cols-3 sm:grid-cols-5 gap-3 mb-6'>
          {stats.map((stat, i) => (
            <button
              key={i}
              onClick={() => setFilterStatus(stat.label === 'Total' ? '' : stat.label.toLowerCase())}
              className={`bg-white rounded-2xl shadow-sm p-3 text-center transition-all hover:shadow-md ${filterStatus === stat.label.toLowerCase() ? 'ring-2 ring-blue-500' : ''}`}
            >
              <p className={`text-xl sm:text-2xl font-black mb-0.5 ${stat.color}`}>{stat.value}</p>
              <p className='text-xs text-gray-400'>{stat.label}</p>
            </button>
          ))}
        </div>

        {/* Filter Pills */}
        <div className='flex items-center gap-2 mb-4 flex-wrap'>
          {['', 'pending', 'confirmed', 'completed', 'cancelled'].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${filterStatus === status ? 'bg-blue-600 text-white' : 'bg-white text-gray-500 hover:bg-gray-50'}`}
            >
              {status === '' ? 'All' : status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>

        {/* Bookings List */}
        <div className='bg-white rounded-2xl shadow-sm overflow-hidden'>
          <div className='px-5 py-4 border-b border-gray-50'>
            <h2 className='text-sm font-bold text-gray-900'>
              {filterStatus ? `${filterStatus.charAt(0).toUpperCase() + filterStatus.slice(1)} Bookings` : 'All Bookings'}
            </h2>
          </div>

          {loading ? (
            <div className='flex justify-center items-center h-40'>
              <div className='w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin' />
            </div>
          ) : filteredBookings.length === 0 ? (
            <div className='text-center py-16 text-gray-300 text-sm'>
              No bookings found
            </div>
          ) : (
            <div className='divide-y divide-gray-50'>
              {filteredBookings.map((booking) => (
                <div key={booking._id} className='p-4 sm:p-5 hover:bg-gray-50 transition-colors'>
                  <div className='flex flex-col sm:flex-row gap-4'>

                    {/* Car Image */}
                    <div className='w-full sm:w-24 h-16 rounded-xl bg-[#eaecf5] overflow-hidden flex-shrink-0'>
                      {booking.car?.images?.[0] ? (
                        <img src={booking.car.images[0]} alt='' className='w-full h-full object-cover' />
                      ) : (
                        <div className='w-full h-full flex items-center justify-center text-gray-300'>🚗</div>
                      )}
                    </div>

                    {/* Info */}
                    <div className='flex-1 min-w-0'>
                      <div className='flex items-start justify-between gap-2 mb-2'>
                        <div>
                          <p className='text-sm font-bold text-gray-900'>
                            {booking.car?.brand} {booking.car?.model}
                          </p>
                          <p className='text-xs text-gray-400 mt-0.5'>
                            👤 {booking.user?.name} • {booking.user?.email}
                          </p>
                        </div>
                        <div className='flex flex-col items-end gap-1 flex-shrink-0'>
                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize ${getStatusColor(booking.status)}`}>
                            {booking.status}
                          </span>
                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize ${getPaymentColor(booking.paymentStatus)}`}>
                            {booking.paymentStatus}
                          </span>
                        </div>
                      </div>

                      {/* Dates + Price */}
                      <div className='flex flex-wrap items-center gap-3 text-xs text-gray-400 mb-3'>
                        <span>📅 {new Date(booking.startDate).toLocaleDateString()} → {new Date(booking.endDate).toLocaleDateString()}</span>
                        <span>🗓️ {booking.totalDays} days</span>
                        {booking.pickupLocation && <span>📍 {booking.pickupLocation}</span>}
                        <span className='font-bold text-blue-600 text-sm'>${booking.totalPrice}</span>
                      </div>

                      {/* Actions */}
                      <div className='flex flex-wrap items-center gap-2'>
                        {/* Status Update */}
                        <select
                          value={booking.status}
                          onChange={(e) => handleStatusUpdate(booking._id, e.target.value, booking.paymentStatus)}
                          disabled={updatingId === booking._id}
                          className='px-3 py-1.5 bg-gray-50 border border-gray-100 rounded-xl text-xs text-gray-600 outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer'
                        >
                          <option value='pending'>Pending</option>
                          <option value='confirmed'>Confirmed</option>
                          <option value='completed'>Completed</option>
                          <option value='cancelled'>Cancelled</option>
                        </select>

                        {/* Payment Update */}
                        <select
                          value={booking.paymentStatus}
                          onChange={(e) => handleStatusUpdate(booking._id, booking.status, e.target.value)}
                          disabled={updatingId === booking._id}
                          className='px-3 py-1.5 bg-gray-50 border border-gray-100 rounded-xl text-xs text-gray-600 outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer'
                        >
                          <option value='unpaid'>Unpaid</option>
                          <option value='paid'>Paid</option>
                          <option value='refunded'>Refunded</option>
                        </select>

                        {updatingId === booking._id && (
                          <div className='w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin' />
                        )}

                        <button
                          onClick={() => setDeleteConfirm(booking._id)}
                          className='px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-500 text-xs font-semibold rounded-xl transition-colors ml-auto'
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Delete Confirm Modal */}
        {deleteConfirm && (
          <div className='fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 px-4'>
            <div className='bg-white rounded-2xl shadow-xl p-6 max-w-sm w-full'>
              <h3 className='text-sm font-bold text-gray-900 mb-2'>Delete Booking</h3>
              <p className='text-xs text-gray-400 mb-5'>
                Are you sure you want to delete this booking? This action cannot be undone.
              </p>
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
