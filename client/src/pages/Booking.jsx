import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import api from '../services/api.js';
import { useAuth } from '../context/AuthContext.jsx';

const Booking = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [formData, setFormData] = useState({
    pickupLocation: '',
    dropoffLocation: '',
    notes: '',
  });

  useEffect(() => {
    const fetchCar = async () => {
      try {
        const res = await api.get(`/cars/${id}`);
        setCar(res.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchCar();
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const calculateDays = () => {
    if (!startDate || !endDate) return 0;
    const days = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
    return days > 0 ? days : 0;
  };

  const totalDays = calculateDays();
  const totalPrice = car ? totalDays * car.pricePerDay : 0;

  const formatDate = (date) => {
    if (!date) return '';
    return date.toISOString().split('T')[0];
  };

  const handleSubmit = async () => {
    if (!startDate || !endDate) {
      return setError('Please select start and end dates');
    }
    if (totalDays <= 0) {
      return setError('End date must be after start date');
    }
    if (!formData.pickupLocation) {
      return setError('Please enter a pickup location');
    }

    setSubmitting(true);
    try {
      await api.post('/bookings', {
        carId: id,
        startDate: formatDate(startDate),
        endDate: formatDate(endDate),
        ...formData,
      });
      setSuccess(true);
      setTimeout(() => navigate('/profile'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Booking failed');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className='min-h-screen bg-[#eaecf5] flex items-center justify-center'>
        <div className='w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin' />
      </div>
    );
  }

  if (success) {
    return (
      <div className='min-h-screen bg-[#eaecf5] flex items-center justify-center px-4'>
        <div className='bg-white rounded-3xl shadow-sm p-10 text-center max-w-sm w-full'>
          <div className='w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4'>
            <svg className='w-8 h-8 text-green-500' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M5 13l4 4L19 7' />
            </svg>
          </div>
          <h2 className='text-xl font-bold text-gray-900 mb-2'>Booking Confirmed!</h2>
          <p className='text-gray-400 text-sm mb-1'>Your booking has been placed successfully.</p>
          <p className='text-gray-300 text-xs'>Redirecting to your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-[#eaecf5] pt-20 pb-10'>
      <div className='max-w-5xl mx-auto px-4 sm:px-6 py-8'>

        {/* Header */}
        <div className='mb-6'>
          <p className='text-blue-600 uppercase tracking-widest text-xs font-semibold mb-1'>Reservation</p>
          <h1 className='text-2xl sm:text-3xl font-bold text-gray-900'>Book Your Car</h1>
        </div>

        <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>

          {/* Left — Form */}
          <div className='lg:col-span-2 space-y-4'>

            {/* Dates */}
            <div className='bg-white rounded-2xl shadow-sm p-5'>
              <h3 className='text-sm font-bold text-gray-900 mb-4 flex items-center gap-2'>
                <span className='w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold'>1</span>
                Select Dates
              </h3>

              <div className='flex flex-col gap-4'>
                {/* Start Date */}
                <div>
                  <label className='block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2'>
                    Start Date
                  </label>
                  <DatePicker
                    selected={startDate}
                    onChange={(date) => {
                      setStartDate(date);
                      if (endDate && date >= endDate) setEndDate(null);
                      setError('');
                    }}
                    minDate={new Date()}
                    placeholderText='Select start date'
                    dateFormat='dd/MM/yyyy'
                    className='w-full'
                    withPortal
                  />
                </div>

                {/* End Date */}
                <div>
                  <label className='block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2'>
                    End Date
                  </label>
                  <DatePicker
                    selected={endDate}
                    onChange={(date) => {
                      setEndDate(date);
                      setError('');
                    }}
                    minDate={startDate || new Date()}
                    placeholderText='Select end date'
                    dateFormat='dd/MM/yyyy'
                    className='w-full'
                    withPortal
                  />
                </div>
              </div>

              {/* Days indicator */}
              {totalDays > 0 && (
                <div className='mt-4 bg-blue-50 rounded-2xl px-4 py-3 flex items-center justify-between'>
                  <span className='text-xs text-blue-600 font-medium'>Duration</span>
                  <span className='text-sm font-bold text-blue-600'>{totalDays} day{totalDays > 1 ? 's' : ''}</span>
                </div>
              )}
            </div>

            {/* Locations */}
            <div className='bg-white rounded-2xl shadow-sm p-5'>
              <h3 className='text-sm font-bold text-gray-900 mb-4 flex items-center gap-2'>
                <span className='w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold'>2</span>
                Pickup & Dropoff
              </h3>
              <div className='space-y-4'>
                <div>
                  <label className='block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2'>
                    Pickup Location
                  </label>
                  <input
                    type='text'
                    name='pickupLocation'
                    value={formData.pickupLocation}
                    onChange={handleChange}
                    placeholder='e.g. Casablanca Airport'
                    className='w-full px-4 py-3 bg-gray-50 rounded-2xl text-sm text-gray-800 outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all placeholder-gray-300'
                  />
                </div>
                <div>
                  <label className='block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2'>
                    Dropoff Location
                  </label>
                  <input
                    type='text'
                    name='dropoffLocation'
                    value={formData.dropoffLocation}
                    onChange={handleChange}
                    placeholder='e.g. Rabat City Center'
                    className='w-full px-4 py-3 bg-gray-50 rounded-2xl text-sm text-gray-800 outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all placeholder-gray-300'
                  />
                </div>
              </div>
            </div>

            {/* Notes */}
            <div className='bg-white rounded-2xl shadow-sm p-5'>
              <h3 className='text-sm font-bold text-gray-900 mb-4 flex items-center gap-2'>
                <span className='w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold'>3</span>
                Additional Notes
              </h3>
              <textarea
                name='notes'
                value={formData.notes}
                onChange={handleChange}
                placeholder='Any special requests or notes...'
                rows={4}
                className='w-full px-4 py-3 bg-gray-50 rounded-2xl text-sm text-gray-800 outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all placeholder-gray-300 resize-none'
              />
            </div>

            {/* Error */}
            {error && (
              <div className='bg-red-50 border border-red-100 text-red-500 text-xs rounded-2xl px-4 py-3 text-center'>
                {error}
              </div>
            )}
          </div>

          {/* Right — Summary */}
          <div className='space-y-4'>

            {/* Car Summary */}
            {car && (
              <div className='bg-white rounded-2xl shadow-sm overflow-hidden'>
                <div className='w-full aspect-video bg-[#eaecf5]'>
                  {car.images && car.images[0] ? (
                    <img
                      src={car.images[0]}
                      alt={`${car.brand} ${car.model}`}
                      className='w-full h-full object-cover'
                    />
                  ) : (
                    <div className='w-full h-full flex items-center justify-center'>
                      <svg className='w-12 h-12 text-gray-300' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={1} d='M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z' />
                      </svg>
                    </div>
                  )}
                </div>
                <div className='p-4'>
                  <h3 className='text-sm font-bold text-gray-900'>{car.brand} {car.model}</h3>
                  <p className='text-xs text-gray-400 mt-0.5'>{car.year} • {car.type}</p>
                  <div className='grid grid-cols-2 gap-1 mt-3 text-xs text-gray-400'>
                    <span>⚙️ {car.transmission}</span>
                    <span>⛽ {car.fuel}</span>
                    <span>💺 {car.seats} seats</span>
                    <span>📍 {car.location}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Price Summary */}
            <div className='bg-white rounded-2xl shadow-sm p-5'>
              <h3 className='text-sm font-bold text-gray-900 mb-4'>Price Summary</h3>
              <div className='space-y-3'>
                <div className='flex items-center justify-between text-xs text-gray-500'>
                  <span>${car?.pricePerDay}/day</span>
                  <span>× {totalDays} day{totalDays !== 1 ? 's' : ''}</span>
                </div>
                <div className='flex items-center justify-between text-xs text-gray-500'>
                  <span>Service fee</span>
                  <span>Free</span>
                </div>
                <div className='h-px bg-gray-100' />
                <div className='flex items-center justify-between'>
                  <span className='text-sm font-bold text-gray-900'>Total</span>
                  <span className='text-lg font-black text-blue-600'>${totalPrice}</span>
                </div>
              </div>

              <button
                onClick={handleSubmit}
                disabled={submitting || totalDays === 0}
                className='w-full mt-5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed text-white font-semibold py-3.5 rounded-2xl text-sm transition-all duration-300'
              >
                {submitting ? (
                  <span className='flex items-center justify-center gap-2'>
                    <svg className='w-4 h-4 animate-spin' fill='none' viewBox='0 0 24 24'>
                      <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4' />
                      <path className='opacity-75' fill='currentColor' d='M4 12a8 8 0 018-8v8z' />
                    </svg>
                    Processing...
                  </span>
                ) : `Confirm Booking — $${totalPrice}`}
              </button>

              <p className='text-xs text-gray-400 text-center mt-3'>
                💳 Free cancellation • 🔒 Secure
              </p>
            </div>

            {/* User info */}
            {user && (
              <div className='bg-white rounded-2xl shadow-sm p-4'>
                <p className='text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3'>Booking As</p>
                <div className='flex items-center gap-3'>
                  <div className='w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0'>
                    {user.name?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className='text-sm font-semibold text-gray-900'>{user.name}</p>
                    <p className='text-xs text-gray-400'>{user.email}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Booking;