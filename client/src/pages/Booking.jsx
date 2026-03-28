import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import DatePicker from 'react-datepicker';
import {
  FiArrowLeft,
  FiCalendar,
  FiMapPin,
  FiFileText,
  FiShield,
  FiCreditCard,
  FiAlertTriangle,
  FiCheck,
  FiSettings,
  FiDroplet,
  FiUsers,
} from 'react-icons/fi';
import api from '../services/api.js';
import { useAuth } from '../context/AuthContext.jsx';

const StepBadge = ({ number, label, active }) => (
  <div className='flex items-center gap-2 mb-4'>
    <div
      className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
        active
          ? 'bg-blue-600 text-white shadow-sm shadow-blue-200'
          : 'bg-blue-50 text-blue-600'
      }`}
    >
      {number}
    </div>
    <h3 className='text-sm font-bold text-gray-900'>{label}</h3>
  </div>
);

const toMidnight = (date) => {
  if (!date) return null;
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
};

const nextDay = (date) => {
  const d = toMidnight(date);
  d.setDate(d.getDate() + 1);
  return d;
};

const countDays = (start, end) => {
  if (!start || !end) return 0;
  const ms = toMidnight(end) - toMidnight(start);
  return Math.round(ms / (1000 * 60 * 60 * 24));
};

const Booking = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [dateError, setDateError] = useState('');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [bookedDates, setBookedDates] = useState([]);
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
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCar();
  }, [id]);

  useEffect(() => {
    const fetchBookedDates = async () => {
      try {
        const res = await api.get(`/cars/${id}/booked-dates`);
        setBookedDates(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchBookedDates();
  }, [id]);

  const isDateBooked = (date) => {
    return bookedDates.some((range) => {
      const start = toMidnight(new Date(range.start));
      const end = toMidnight(new Date(range.end));
      return date >= start && date <= end;
    });
  };

  const getFirstBookedDateAfter = (date) => {
    if (!date) return null;
    const futureBookings = bookedDates
      .map((range) => toMidnight(new Date(range.start)))
      .filter((start) => start > date)
      .sort((a, b) => a - b);

    return futureBookings.length > 0 ? futureBookings[0] : null;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (e.target.name === 'pickupLocation') setError('');
  };

  const totalDays = countDays(startDate, endDate);
  const totalPrice = car ? totalDays * car.pricePerDay : 0;

  const formatDate = (date) =>
    date ? toMidnight(date).toISOString().split('T')[0] : '';

  const handleSubmit = async () => {
    if (!startDate || !endDate)
      return setDateError('Please select start and end dates');
    if (totalDays < 1)
      return setDateError('End date must be at least 1 day after start date');
    if (!formData.pickupLocation)
      return setError('Please enter a pickup location');

    setSubmitting(true);
    setDateError('');
    setError('');
    try {
      const bookingRes = await api.post('/bookings', {
        carId: id,
        startDate: formatDate(startDate),
        endDate: formatDate(endDate),
        ...formData,
      });
      const stripeRes = await api.post('/payment/create-checkout-session', {
        bookingId: bookingRes.data._id,
      });
      window.location.href = stripeRes.data.url;
    } catch (err) {
      const message = err.response?.data?.message || 'Booking failed';
      if (
        message.includes('already booked') ||
        message.includes('dates') ||
        message.includes('available')
      ) {
        setDateError(message);
      } else {
        setError(message);
      }
      setSubmitting(false);
    }
  };

  const inputClass =
    'w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm text-gray-800 outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 focus:bg-white transition-all placeholder-gray-300';

  const fadeUp = {
    hidden: { opacity: 0, y: 18 },
    visible: (i = 0) => ({
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] },
    }),
  };

  if (loading) {
    return (
      <div className='min-h-screen bg-[#f0f2f8] flex items-center justify-center'>
        <div className='flex flex-col items-center gap-4'>
          <div className='w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin' />
          <p className='text-sm text-gray-400 font-medium'>
            Loading booking details...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-[#f0f2f8] pt-20 pb-12'>
      <div className='max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8'>
        {}
        <motion.div
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.35 }}
        >
          <Link
            to={`/cars/${id}`}
            className='inline-flex items-center gap-2 text-sm text-gray-500 hover:text-blue-600 transition-colors mb-6 group font-medium'
          >
            <FiArrowLeft className='w-4 h-4 group-hover:-translate-x-1 transition-transform duration-200' />
            Back to Car
          </Link>
        </motion.div>

        {}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.05 }}
          className='mb-6'
        >
          <p className='text-blue-600 uppercase tracking-widest text-[10px] font-bold mb-1'>
            Reservation
          </p>
          <h1 className='text-2xl sm:text-3xl font-extrabold text-gray-900'>
            Book Your Car
          </h1>
          {car && (
            <p className='text-sm text-gray-400 mt-1'>
              {car.brand} {car.model} ·{' '}
              <span className='text-blue-600 font-semibold'>
                ${car.pricePerDay}/day
              </span>
            </p>
          )}
        </motion.div>

        <div className='grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6'>
          {}
          <div className='md:col-span-2 space-y-4'>
            {}
            <motion.div
              custom={0}
              variants={fadeUp}
              initial='hidden'
              animate='visible'
              className='bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sm:p-6'
            >
              <StepBadge
                number={1}
                label='Select Dates'
                active={!startDate || !endDate}
              />

              <AnimatePresence mode='wait'>
                {bookedDates.length > 0 && (!startDate || !endDate) && (
                  <motion.div
                    initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                    animate={{ opacity: 1, height: 'auto', marginBottom: 16 }}
                    exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                    className='overflow-hidden'
                  >
                    <div className='flex items-center gap-2 text-xs text-red-500 bg-red-50 border border-red-100 px-3 py-2.5 rounded-xl'>
                      <FiAlertTriangle className='w-3.5 h-3.5 shrink-0' />
                      Highlighted dates are already booked — please choose
                      different dates
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className='flex items-start sm:items-center gap-2 mb-4 text-[11px] sm:text-xs text-blue-600 bg-blue-50 border border-blue-100 px-3 py-2.5 rounded-xl leading-relaxed sm:leading-normal'>
                <FiCalendar className='w-3.5 h-3.5 shrink-0 mt-0.5 sm:mt-0' />
                <p>
                  Minimum rental period is{' '}
                  <strong className='font-bold mx-0.5'>1 full day</strong> — end
                  date must be at least the day after start date
                </p>
              </div>

              <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                {}
                <div>
                  <label className='flex items-center gap-1.5 text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2'>
                    <FiCalendar className='w-3.5 h-3.5' />
                    Start Date
                  </label>
                  <div className='relative'>
                    <DatePicker
                      selected={startDate}
                      onChange={(date) => {
                        const d = toMidnight(date);
                        setStartDate(d);
                        if (endDate && endDate <= d) setEndDate(null);
                        setDateError('');
                      }}
                      minDate={toMidnight(new Date())}
                      placeholderText='Pick start date'
                      dateFormat='dd/MM/yyyy'
                      className={`${inputClass} cursor-pointer`}
                      withPortal
                      filterDate={(date) => !isDateBooked(date)}
                      dayClassName={(date) =>
                        isDateBooked(date) ? 'booked-date' : undefined
                      }
                    />
                    {startDate && (
                      <FiCheck className='absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-green-500 pointer-events-none' />
                    )}
                  </div>
                </div>

                {}
                <div>
                  <label className='flex items-center gap-1.5 text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2'>
                    <FiCalendar className='w-3.5 h-3.5' />
                    End Date
                  </label>
                  <div className='relative'>
                    <DatePicker
                      selected={endDate}
                      onChange={(date) => {
                        setEndDate(toMidnight(date));
                        setDateError('');
                      }}
                      minDate={
                        startDate ? nextDay(startDate) : nextDay(new Date())
                      }
                      maxDate={getFirstBookedDateAfter(startDate)}
                      placeholderText={
                        startDate ? 'Pick end date' : 'Select start date first'
                      }
                      disabled={!startDate}
                      dateFormat='dd/MM/yyyy'
                      className={`${inputClass} cursor-pointer ${!startDate ? 'opacity-50 cursor-not-allowed' : ''}`}
                      withPortal
                      filterDate={(date) => !isDateBooked(date)}
                      dayClassName={(date) =>
                        isDateBooked(date) ? 'booked-date' : undefined
                      }
                    />
                    {endDate && (
                      <FiCheck className='absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-green-500 pointer-events-none' />
                    )}
                  </div>
                  {!startDate && (
                    <p className='text-xs text-gray-400 mt-1.5 flex items-center gap-1'>
                      <FiCalendar className='w-3 h-3' />
                      Pick a start date first
                    </p>
                  )}
                </div>
              </div>

              {}
              <AnimatePresence>
                {dateError && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    className='mt-3 flex items-center gap-2 bg-red-50 border border-red-100 text-red-500 text-xs rounded-xl px-4 py-3'
                  >
                    <FiAlertTriangle className='w-4 h-4 shrink-0' />
                    {dateError}
                  </motion.div>
                )}
              </AnimatePresence>

              {}
              <AnimatePresence>
                {totalDays >= 1 && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className='mt-4 flex items-center justify-between bg-blue-50 border border-blue-100 rounded-xl px-4 py-3'
                  >
                    <div className='flex items-center gap-2 text-blue-600'>
                      <FiCalendar className='w-4 h-4 shrink-0' />
                      <span className='text-xs font-semibold'>
                        {startDate?.toLocaleDateString('en-GB')} →{' '}
                        {endDate?.toLocaleDateString('en-GB')}
                      </span>
                    </div>
                    <span className='text-sm font-black text-blue-600 bg-blue-100 px-3 py-1 rounded-lg'>
                      {totalDays} day{totalDays > 1 ? 's' : ''}
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Step 2 — Locations */}
            <motion.div
              custom={1}
              variants={fadeUp}
              initial='hidden'
              animate='visible'
              className='bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sm:p-6'
            >
              <StepBadge
                number={2}
                label='Pickup & Dropoff'
                active={!!startDate && !!endDate && !formData.pickupLocation}
              />

              <div className='space-y-4'>
                <div>
                  <label className='flex items-center gap-1.5 text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2'>
                    <FiMapPin className='w-3.5 h-3.5 text-blue-500' />
                    Pickup Location <span className='text-red-400 ml-1'>*</span>
                  </label>
                  <input
                    type='text'
                    name='pickupLocation'
                    value={formData.pickupLocation}
                    onChange={handleChange}
                    placeholder='e.g. Casablanca Airport'
                    className={`${inputClass} ${error ? 'border-red-300 focus:ring-red-300 focus:border-red-300' : ''}`}
                  />
                  <AnimatePresence>
                    {error && (
                      <motion.p
                        initial={{ opacity: 0, y: -6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        className='mt-2 flex items-center gap-1.5 text-xs text-red-500'
                      >
                        <FiAlertTriangle className='w-3.5 h-3.5 shrink-0' />
                        {error}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>

                <div>
                  <label className='flex items-center gap-1.5 text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2'>
                    <FiMapPin className='w-3.5 h-3.5 text-gray-400' />
                    Dropoff Location
                    <span className='text-xs text-gray-300 font-normal normal-case tracking-normal ml-1'>
                      (optional)
                    </span>
                  </label>
                  <input
                    type='text'
                    name='dropoffLocation'
                    value={formData.dropoffLocation}
                    onChange={handleChange}
                    placeholder='e.g. Rabat City Center'
                    className={inputClass}
                  />
                </div>
              </div>
            </motion.div>

            {}
            <motion.div
              custom={2}
              variants={fadeUp}
              initial='hidden'
              animate='visible'
              className='bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sm:p-6'
            >
              <StepBadge number={3} label='Additional Notes' active={false} />
              <div>
                <label className='flex items-center gap-1.5 text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2'>
                  <FiFileText className='w-3.5 h-3.5' />
                  Notes
                  <span className='text-xs text-gray-300 font-normal normal-case tracking-normal ml-1'>
                    (optional)
                  </span>
                </label>
                <textarea
                  name='notes'
                  value={formData.notes}
                  onChange={handleChange}
                  placeholder='Any special requests, preferences, or instructions...'
                  rows={4}
                  className={`${inputClass} resize-none`}
                />
              </div>
            </motion.div>
          </div>

          {}
          <motion.div
            custom={3}
            variants={fadeUp}
            initial='hidden'
            animate='visible'
            className='space-y-4'
          >
            {}
            {car && (
              <div className='bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col sm:flex-row md:flex-col'>
                {}
                <div className='relative w-full sm:w-2/5 md:w-full aspect-video sm:aspect-auto md:aspect-video bg-[#eaecf5]'>
                  {car.images?.[0] ? (
                    <img
                      src={car.images[0]}
                      alt={`${car.brand} ${car.model}`}
                      className='w-full h-full object-cover'
                    />
                  ) : (
                    <div className='w-full h-full flex items-center justify-center'>
                      <FiSettings className='w-12 h-12 text-gray-300' />
                    </div>
                  )}
                  <div className='absolute top-2.5 right-2.5'>
                    <span className='bg-white/95 backdrop-blur-sm text-blue-600 font-black text-xs px-2.5 py-1 rounded-full shadow-sm border border-gray-100'>
                      ${car.pricePerDay}
                      <span className='font-normal text-gray-400'>/day</span>
                    </span>
                  </div>
                </div>

                {}
                <div className='p-4 sm:flex-1 md:flex-none'>
                  <h3 className='text-sm font-bold text-gray-900'>
                    {car.brand} {car.model}
                  </h3>
                  <p className='text-xs text-gray-400 mt-0.5 capitalize'>
                    {car.year} · {car.type}
                  </p>
                  <div className='grid grid-cols-2 gap-y-2 gap-x-3 mt-3 text-xs text-gray-500'>
                    <span className='flex items-center gap-1.5'>
                      <FiSettings className='w-3 h-3 text-gray-400' />
                      <span className='capitalize'>{car.transmission}</span>
                    </span>
                    <span className='flex items-center gap-1.5'>
                      <FiDroplet className='w-3 h-3 text-gray-400' />
                      <span className='capitalize'>{car.fuel}</span>
                    </span>
                    <span className='flex items-center gap-1.5'>
                      <FiUsers className='w-3 h-3 text-gray-400' />
                      {car.seats} seats
                    </span>
                    <span className='flex items-center gap-1.5'>
                      <FiMapPin className='w-3 h-3 text-gray-400' />
                      <span className='truncate'>{car.location}</span>
                    </span>
                  </div>
                </div>
              </div>
            )}

            {}
            <div className='bg-white rounded-2xl border border-gray-100 shadow-sm p-5'>
              <h3 className='text-sm font-bold text-gray-900 mb-4'>
                Price Summary
              </h3>

              <div className='space-y-3'>
                <div className='flex items-center justify-between text-xs text-gray-500'>
                  <span>${car?.pricePerDay}/day</span>
                  <span>
                    × {totalDays} day{totalDays !== 1 ? 's' : ''}
                  </span>
                </div>
                <div className='flex items-center justify-between text-xs'>
                  <span className='text-gray-500'>Service fee</span>
                  <span className='text-green-600 font-semibold'>Free</span>
                </div>
                <div className='h-px bg-gray-100' />
                <div className='flex items-center justify-between'>
                  <span className='text-sm font-bold text-gray-900'>Total</span>
                  <motion.span
                    key={totalPrice}
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className='text-xl font-black text-blue-600'
                  >
                    ${totalPrice}
                  </motion.span>
                </div>
              </div>

              <motion.button
                whileHover={
                  !submitting && totalDays >= 1 ? { scale: 1.01 } : {}
                }
                whileTap={!submitting && totalDays >= 1 ? { scale: 0.98 } : {}}
                onClick={handleSubmit}
                disabled={submitting || totalDays < 1}
                className='w-full mt-5 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed text-white font-bold py-4 rounded-2xl text-sm transition-colors duration-200 flex items-center justify-center gap-2.5 shadow-sm shadow-blue-200 disabled:shadow-none'
              >
                {submitting ? (
                  <>
                    <svg
                      className='w-4 h-4 animate-spin'
                      fill='none'
                      viewBox='0 0 24 24'
                    >
                      <circle
                        className='opacity-25'
                        cx='12'
                        cy='12'
                        r='10'
                        stroke='currentColor'
                        strokeWidth='4'
                      />
                      <path
                        className='opacity-75'
                        fill='currentColor'
                        d='M4 12a8 8 0 018-8v8z'
                      />
                    </svg>
                    Processing payment...
                  </>
                ) : totalDays < 1 ? (
                  'Select dates to continue'
                ) : (
                  <>
                    <FiCreditCard className='w-4 h-4' />
                    Confirm & Pay — ${totalPrice}
                  </>
                )}
              </motion.button>

              <div className='flex items-center justify-center gap-5 mt-4 pt-4 border-t border-gray-50'>
                <span className='flex items-center gap-1.5 text-xs text-gray-400'>
                  <FiShield className='w-3.5 h-3.5 text-green-500' />
                  Free cancellation
                </span>
                <span className='w-px h-3 bg-gray-200' />
                <span className='flex items-center gap-1.5 text-xs text-gray-400'>
                  <FiCreditCard className='w-3.5 h-3.5 text-blue-500' />
                  Secure payment
                </span>
              </div>
            </div>

            {}
            {user && (
              <div className='bg-white rounded-2xl border border-gray-100 shadow-sm p-4'>
                <p className='text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3'>
                  Booking As
                </p>
                <div className='flex items-center gap-3'>
                  <div className='w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white font-bold text-sm flex-shrink-0 shadow-sm'>
                    {user.name?.charAt(0).toUpperCase()}
                  </div>
                  <div className='min-w-0'>
                    <p className='text-sm font-bold text-gray-900 truncate'>
                      {user.name}
                    </p>
                    <p className='text-xs text-gray-400 truncate'>
                      {user.email}
                    </p>
                  </div>
                  <div className='ml-auto'>
                    <span className='flex items-center gap-1 text-[10px] text-green-600 bg-green-50 px-2 py-1 rounded-full border border-green-100 font-semibold'>
                      <FiCheck className='w-3 h-3' />
                      Verified
                    </span>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Booking;