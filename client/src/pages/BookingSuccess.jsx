import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiCheck, 
  FiCalendar, 
  FiCreditCard, 
  FiArrowRight, 
  FiTruck, 
  FiMail,
  FiHome,
  FiChevronRight
} from 'react-icons/fi';
import api from '../services/api.js';

const BookingSuccess = () => {
  const [searchParams] = useSearchParams();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const bookingId = searchParams.get('bookingId');

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const res = await api.get(`/bookings/${bookingId}`);
        setBooking(res.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    if (bookingId) fetchBooking();
  }, [bookingId]);

  // Animation Variants
  const containerVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1], staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const drawCheck = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: { 
      pathLength: 1, 
      opacity: 1,
      transition: { duration: 0.8, delay: 0.2, ease: "easeInOut" }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f0f2f8] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-[#f0f2f8] flex items-center justify-center px-4 py-12'>
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className='bg-white rounded-[2.5rem] shadow-xl shadow-blue-900/5 p-8 sm:p-12 text-center max-w-lg w-full border border-white'
      >
        {/* Animated Success Icon */}
        <div className='relative w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-8'>
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", damping: 12, stiffness: 200, delay: 0.1 }}
            className="absolute inset-0 bg-green-100/50 rounded-full"
          />
          <svg className="w-12 h-12 text-green-500 z-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
            <motion.path 
              variants={drawCheck}
              d="M5 13l4 4L19 7" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
            />
          </svg>
        </div>

        <motion.h1 variants={itemVariants} className='text-3xl font-black text-gray-900 mb-3 tracking-tight'>
          Payment Successful! 🎉
        </motion.h1>
        <motion.p variants={itemVariants} className='text-gray-400 text-sm font-medium mb-8'>
          Your reservation is confirmed. We've sent the receipt to your email.
        </motion.p>

        {booking && (
          <motion.div variants={itemVariants} className='bg-gray-50 rounded-3xl p-6 mb-8 text-left border border-gray-100 space-y-4'>
            <div className='flex items-center justify-between pb-2 border-b border-gray-200/60'>
              <p className='text-[10px] font-bold text-gray-400 uppercase tracking-widest'>Reservation Details</p>
              <span className='px-2.5 py-1 bg-green-100 text-green-700 text-[10px] font-bold rounded-full uppercase border border-green-200'>
                {booking.status}
              </span>
            </div>

            <div className='flex items-center gap-4'>
              <div className='w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-gray-100 shrink-0'>
                <FiTruck className='w-5 h-5 text-blue-600' />
              </div>
              <div>
                <p className='text-xs text-gray-400 font-medium'>Car Selected</p>
                <p className='text-sm font-bold text-gray-900'>{booking.car?.brand} {booking.car?.model}</p>
              </div>
            </div>

            <div className='flex items-center gap-4'>
              <div className='w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-gray-100 shrink-0'>
                <FiCalendar className='w-5 h-5 text-blue-600' />
              </div>
              <div>
                <p className='text-xs text-gray-400 font-medium'>Duration</p>
                <p className='text-sm font-bold text-gray-900'>
                  {new Date(booking.startDate).toLocaleDateString('en-GB')} 
                  <span className='mx-2 text-gray-300 font-normal'>→</span>
                  {new Date(booking.endDate).toLocaleDateString('en-GB')}
                </p>
              </div>
            </div>

            <div className='pt-2 flex justify-between items-center'>
              <div className='flex items-center gap-2'>
                <FiCreditCard className='text-gray-400 w-4 h-4' />
                <span className='text-sm text-gray-500'>Total Amount Paid</span>
              </div>
              <span className='text-xl font-black text-blue-600'>${booking.totalPrice}</span>
            </div>
          </motion.div>
        )}

        <motion.div variants={itemVariants} className='flex flex-col sm:flex-row gap-3'>
          <Link
            to='/profile'
            className='group flex-1 py-4 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-2xl transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-blue-200'
          >
            My Bookings
            <FiArrowRight className='group-hover:translate-x-1 transition-transform' />
          </Link>
          <Link
            to='/cars'
            className='flex-1 py-4 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-bold rounded-2xl transition-all duration-200 flex items-center justify-center gap-2'
          >
            <FiHome className='w-4 h-4' />
            Home
          </Link>
        </motion.div>

        <motion.div variants={itemVariants} className='mt-8 pt-6 border-t border-gray-50'>
          <div className='flex items-center justify-center gap-2 text-xs text-gray-400 bg-blue-50/50 py-3 rounded-xl px-4'>
            <FiMail className='text-blue-500 w-4 h-4' />
            <span>Need help? Contact us at <strong>support@carrental.com</strong></span>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default BookingSuccess;