import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import api from '../services/api.js';

const BookingSuccess = () => {
  const [searchParams] = useSearchParams();
  const [booking, setBooking] = useState(null);
  const bookingId = searchParams.get('bookingId');

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const res = await api.get(`/bookings/${bookingId}`);
        setBooking(res.data);
      } catch (error) {
        console.error(error);
      }
    };
    if (bookingId) fetchBooking();
  }, [bookingId]);

  return (
    <div className='min-h-screen bg-[#eaecf5] flex items-center justify-center px-4'>
      <div className='bg-white rounded-3xl shadow-sm p-10 text-center max-w-md w-full' style={{ animation: 'scaleIn 0.3s ease-out forwards' }}>

        {/* Success Icon */}
        <div className='w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6'>
          <svg className='w-10 h-10 text-green-500' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M5 13l4 4L19 7' />
          </svg>
        </div>

        <h1 className='text-2xl font-bold text-gray-900 mb-2'>Payment Successful! 🎉</h1>
        <p className='text-gray-400 text-sm mb-6'>Your booking has been confirmed and paid.</p>

        {booking && (
          <div className='bg-gray-50 rounded-2xl p-4 mb-6 text-left space-y-2'>
            <p className='text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3'>Booking Details</p>
            <div className='flex justify-between text-sm'>
              <span className='text-gray-400'>Car</span>
              <span className='font-semibold text-gray-900'>{booking.car?.brand} {booking.car?.model}</span>
            </div>
            <div className='flex justify-between text-sm'>
              <span className='text-gray-400'>Dates</span>
              <span className='font-semibold text-gray-900'>
                {new Date(booking.startDate).toLocaleDateString()} → {new Date(booking.endDate).toLocaleDateString()}
              </span>
            </div>
            <div className='flex justify-between text-sm'>
              <span className='text-gray-400'>Total Paid</span>
              <span className='font-bold text-blue-600'>${booking.totalPrice}</span>
            </div>
            <div className='flex justify-between text-sm'>
              <span className='text-gray-400'>Status</span>
              <span className='text-green-600 font-semibold capitalize'>{booking.status}</span>
            </div>
          </div>
        )}

        <div className='flex gap-3'>
          <Link
            to='/profile'
            className='flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-2xl transition-colors'
          >
            View Booking
          </Link>
          <Link
            to='/cars'
            className='flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-semibold rounded-2xl transition-colors'
          >
            Browse Cars
          </Link>
        </div>

        <p className='text-xs text-gray-400 mt-4'>
          📧 Confirmation email sent to your inbox
        </p>
      </div>
    </div>
  );
};

export default BookingSuccess;