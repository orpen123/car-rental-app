import { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiArrowLeft, FiChevronLeft, FiChevronRight, FiCalendar,
  FiMapPin, FiSettings, FiDroplet, FiUsers, FiShield,
  FiCreditCard, FiStar, FiImage,
} from 'react-icons/fi';
import { FaStar } from 'react-icons/fa';
import api from '../services/api.js';
import { useAuth } from '../context/AuthContext.jsx';

const StarDisplay = ({ rating, size = 'sm' }) => {
  const sizes = { sm: 'w-3.5 h-3.5', md: 'w-4 h-4', lg: 'w-5 h-5' };
  return (
    <div className='flex items-center gap-0.5'>
      {[1, 2, 3, 4, 5].map((star) => (
        <FaStar key={star} className={`${sizes[size]} ${star <= rating ? 'text-amber-400' : 'text-gray-200'}`} />
      ))}
    </div>
  );
};

const CarDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [avgRating, setAvgRating] = useState(0);
  const [reviewsLoading, setReviewsLoading] = useState(true);

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

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await api.get(`/reviews/car/${id}`);
        setReviews(res.data.reviews);
        setAvgRating(res.data.avgRating);
      } catch (error) {
        console.error(error);
      } finally {
        setReviewsLoading(false);
      }
    };
    fetchReviews();
  }, [id]);

  const changeImage = useCallback((index) => {
    if (isTransitioning || index === selectedImage) return;
    setIsTransitioning(true);
    setTimeout(() => { setSelectedImage(index); setIsTransitioning(false); }, 200);
  }, [isTransitioning, selectedImage]);

  const prevImage = useCallback(() => {
    if (!car?.images?.length) return;
    changeImage(selectedImage === 0 ? car.images.length - 1 : selectedImage - 1);
  }, [car, selectedImage, changeImage]);

  const nextImage = useCallback(() => {
    if (!car?.images?.length) return;
    changeImage(selectedImage === car.images.length - 1 ? 0 : selectedImage + 1);
  }, [car, selectedImage, changeImage]);

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'ArrowLeft') prevImage();
      if (e.key === 'ArrowRight') nextImage();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [prevImage, nextImage]);

  // ── Loading ──────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className='min-h-screen bg-[#f0f2f8] flex items-center justify-center'>
        <div className='flex flex-col items-center gap-4'>
          <div className='w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin' />
          <p className='text-sm text-gray-400 font-medium'>Loading car details...</p>
        </div>
      </div>
    );
  }

  if (!car) {
    return (
      <div className='min-h-screen bg-[#f0f2f8] flex flex-col items-center justify-center gap-4'>
        <div className='w-20 h-20 rounded-full bg-white flex items-center justify-center text-4xl shadow-sm'>🚗</div>
        <p className='text-gray-700 font-bold text-lg'>Car not found</p>
        <p className='text-gray-400 text-sm'>This car may have been removed or doesn't exist.</p>
        <Link to='/cars' className='mt-2 bg-blue-600 text-white text-sm font-semibold px-6 py-2.5 rounded-xl hover:bg-blue-700 transition-colors'>
          Back to Cars
        </Link>
      </div>
    );
  }

  const specs = [
    { icon: FiSettings, label: 'Transmission', value: car.transmission },
    { icon: FiDroplet, label: 'Fuel Type', value: car.fuel },
    { icon: FiUsers, label: 'Seats', value: `${car.seats} seats` },
    { icon: FiCalendar, label: 'Year', value: car.year },
    { icon: null, label: 'Type', value: car.type, emoji: '🚗' },
    { icon: FiMapPin, label: 'Location', value: car.location },
  ];

  const hasMultipleImages = car.images && car.images.length > 1;

  const ratingCounts = [5, 4, 3, 2, 1].map(star => ({
    star,
    count: reviews.filter(r => r.rating === star).length,
    percent: reviews.length ? Math.round((reviews.filter(r => r.rating === star).length / reviews.length) * 100) : 0,
  }));

  const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    visible: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.45, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] } }),
  };

  return (
    <div className='min-h-screen bg-[#f0f2f8] pt-20'>
      <div className='max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8'>

        {/* ── Back ──────────────────────────────────────────────── */}
        <motion.div initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.35 }}>
          <Link
            to='/cars'
            className='inline-flex items-center gap-2 text-sm text-gray-500 hover:text-blue-600 transition-colors mb-6 group font-medium'
          >
            <FiArrowLeft className='w-4 h-4 group-hover:-translate-x-1 transition-transform duration-200' />
            Back to Cars
          </Link>
        </motion.div>

        <div className='grid grid-cols-1 lg:grid-cols-2 gap-5 lg:gap-6'>

          {/* ── Left — Image Carousel ─────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className='space-y-3'
          >
            {/* Main image */}
            <div className='relative w-full aspect-video bg-white rounded-2xl overflow-hidden shadow-sm group border border-gray-100'>
              <AnimatePresence mode='wait'>
                {car.images?.[selectedImage] ? (
                  <motion.img
                    key={selectedImage}
                    src={car.images[selectedImage]}
                    alt={`${car.brand} ${car.model}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className='w-full h-full object-cover'
                  />
                ) : (
                  <div className='w-full h-full bg-[#eaecf5] flex flex-col items-center justify-center gap-2'>
                    <FiImage className='w-12 h-12 text-gray-300' />
                    <p className='text-xs text-gray-300'>No image</p>
                  </div>
                )}
              </AnimatePresence>

              {/* Nav arrows */}
              {hasMultipleImages && (
                <>
                  <button
                    onClick={prevImage}
                    className='absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/90 hover:bg-white rounded-full shadow-md flex items-center justify-center transition-all duration-200 opacity-0 group-hover:opacity-100 hover:scale-110 border border-gray-100'
                  >
                    <FiChevronLeft className='w-4 h-4 text-gray-700' />
                  </button>
                  <button
                    onClick={nextImage}
                    className='absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/90 hover:bg-white rounded-full shadow-md flex items-center justify-center transition-all duration-200 opacity-0 group-hover:opacity-100 hover:scale-110 border border-gray-100'
                  >
                    <FiChevronRight className='w-4 h-4 text-gray-700' />
                  </button>
                </>
              )}

              {/* Counter */}
              {hasMultipleImages && (
                <div className='absolute bottom-3 right-3 bg-black/50 backdrop-blur-sm text-white text-xs px-2.5 py-1 rounded-full font-medium flex items-center gap-1'>
                  <FiImage className='w-3 h-3' />
                  {selectedImage + 1}/{car.images.length}
                </div>
              )}

              {/* Dot indicators */}
              {hasMultipleImages && (
                <div className='absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5'>
                  {car.images.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => changeImage(i)}
                      className={`rounded-full transition-all duration-300 ${selectedImage === i ? 'w-5 h-2 bg-white' : 'w-2 h-2 bg-white/50 hover:bg-white/80'}`}
                    />
                  ))}
                </div>
              )}

              {/* Availability badge */}
              <div className='absolute top-3 left-3'>
                <span className={`text-xs px-3 py-1 rounded-full font-bold backdrop-blur-sm shadow-sm ${
                  car.available ? 'bg-green-500/90 text-white' : 'bg-red-500/90 text-white'
                }`}>
                  {car.available ? '● Available' : '● Booked'}
                </span>
              </div>

              {/* Price overlay */}
              <div className='absolute top-3 right-3'>
                <span className='bg-white/95 backdrop-blur-sm text-blue-600 font-black text-sm px-3 py-1 rounded-full shadow-sm border border-gray-100'>
                  ${car.pricePerDay}<span className='font-normal text-gray-400 text-xs'>/day</span>
                </span>
              </div>
            </div>

            {/* Thumbnails */}
            {hasMultipleImages && (
              <div className='flex gap-2 overflow-x-auto pb-1 scrollbar-hide'>
                {car.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => changeImage(i)}
                    className={`flex-shrink-0 w-20 h-14 rounded-xl overflow-hidden border-2 transition-all duration-200 hover:scale-105 ${
                      selectedImage === i
                        ? 'border-blue-600 shadow-md shadow-blue-100'
                        : 'border-transparent opacity-50 hover:opacity-90'
                    }`}
                  >
                    <img src={img} alt='' className='w-full h-full object-cover' />
                  </button>
                ))}
              </div>
            )}
          </motion.div>

          {/* ── Right — Info ──────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className='space-y-4'
          >

            {/* Title + Rating + Price */}
            <div className='bg-white rounded-2xl border border-gray-100 shadow-sm p-5'>
              <div className='mb-4'>
                <div className='flex items-start justify-between gap-2 flex-wrap'>
                  <div>
                    <h1 className='text-2xl sm:text-3xl font-extrabold text-gray-900 leading-tight'>
                      {car.brand} {car.model}
                    </h1>
                    <p className='text-gray-400 text-sm mt-1 capitalize'>
                      {car.year} · {car.type}
                    </p>
                  </div>
                  {hasMultipleImages && (
                    <span className='flex items-center gap-1 text-xs text-gray-400 bg-gray-50 px-2.5 py-1 rounded-full border border-gray-100 shrink-0'>
                      <FiImage className='w-3 h-3' />
                      {car.images.length} photos
                    </span>
                  )}
                </div>
              </div>

              {reviews.length > 0 && (
                <div className='flex items-center gap-2 mb-4 p-3 bg-amber-50 rounded-xl border border-amber-100'>
                  <StarDisplay rating={Math.round(avgRating)} size='sm' />
                  <span className='text-sm font-black text-gray-900'>{avgRating}</span>
                  <span className='text-xs text-gray-500'>({reviews.length} review{reviews.length !== 1 ? 's' : ''})</span>
                </div>
              )}

              <div className='flex items-end justify-between pt-4 border-t border-gray-50'>
                <div>
                  <p className='text-xs text-gray-400 mb-0.5'>Price per day</p>
                  <div className='flex items-end gap-1'>
                    <span className='text-4xl font-black text-blue-600'>${car.pricePerDay}</span>
                    <span className='text-gray-400 text-sm mb-1'>/day</span>
                  </div>
                </div>
                <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold ${
                  car.available ? 'bg-green-50 text-green-600 border border-green-100' : 'bg-red-50 text-red-500 border border-red-100'
                }`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${car.available ? 'bg-green-500' : 'bg-red-500'}`} />
                  {car.available ? 'Available' : 'Booked'}
                </div>
              </div>
            </div>

            {/* Specs */}
            <div className='bg-white rounded-2xl border border-gray-100 shadow-sm p-5'>
              <h3 className='text-sm font-bold text-gray-900 mb-4 flex items-center gap-2'>
                <FiSettings className='w-4 h-4 text-blue-600' />
                Specifications
              </h3>
              <div className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3 gap-2.5'>
                {specs.map((spec, i) => {
                  const Icon = spec.icon;
                  return (
                    <motion.div
                      key={i}
                      custom={i}
                      variants={fadeUp}
                      initial='hidden'
                      animate='visible'
                      className='flex items-center gap-2.5 bg-gray-50 hover:bg-blue-50 rounded-xl px-3 py-2.5 transition-colors border border-transparent hover:border-blue-100'
                    >
                      {Icon
                        ? <Icon className='w-4 h-4 text-blue-500 shrink-0' />
                        : <span className='text-sm shrink-0'>{spec.emoji}</span>
                      }
                      <div className='min-w-0'>
                        <p className='text-[10px] text-gray-400 font-medium uppercase tracking-wide'>{spec.label}</p>
                        <p className='text-xs font-bold text-gray-800 capitalize truncate'>{spec.value}</p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Description */}
            {car.description && (
              <div className='bg-white rounded-2xl border border-gray-100 shadow-sm p-5'>
                <h3 className='text-sm font-bold text-gray-900 mb-3'>About this car</h3>
                <p className='text-sm text-gray-500 leading-relaxed'>{car.description}</p>
              </div>
            )}

            {/* Book CTA */}
            <div className='bg-white rounded-2xl border border-gray-100 shadow-sm p-5'>
              {car.available ? (
                user ? (
                  <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => navigate(`/booking/${car._id}`)}
                    className='w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-2xl text-sm transition-colors duration-200 flex items-center justify-center gap-2.5 shadow-md shadow-blue-200'
                  >
                    <FiCalendar className='w-4 h-4' />
                    Book Now — ${car.pricePerDay}/day
                  </motion.button>
                ) : (
                  <div className='space-y-3'>
                    <p className='text-xs text-gray-400 text-center'>Sign in to book this car</p>
                    <Link
                      to='/login'
                      className='w-full block text-center bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-2xl text-sm transition-colors duration-200 shadow-md shadow-blue-200'
                    >
                      Sign In to Book
                    </Link>
                  </div>
                )
              ) : (
                <button
                  disabled
                  className='w-full bg-gray-100 text-gray-400 font-semibold py-4 rounded-2xl text-sm cursor-not-allowed'
                >
                  Currently Unavailable
                </button>
              )}

              {/* Trust badges */}
              <div className='flex items-center justify-center gap-5 mt-4 pt-4 border-t border-gray-50'>
                <span className='flex items-center gap-1.5 text-xs text-gray-400'>
                  <FiShield className='w-3.5 h-3.5 text-green-500' />
                  Free cancellation
                </span>
                <span className='w-px h-3 bg-gray-200' />
                <span className='flex items-center gap-1.5 text-xs text-gray-400'>
                  <FiCreditCard className='w-3.5 h-3.5 text-blue-500' />
                  Secure booking
                </span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* ── Reviews Section ───────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className='mt-6'
        >
          <div className='bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sm:p-6'>

            {/* Reviews header */}
            <div className='flex items-center justify-between mb-6'>
              <div className='flex items-center gap-2'>
                <FiStar className='w-5 h-5 text-amber-400' />
                <div>
                  <h3 className='text-base font-bold text-gray-900'>Customer Reviews</h3>
                  <p className='text-xs text-gray-400 mt-0.5'>
                    {reviews.length > 0 ? `${reviews.length} verified review${reviews.length !== 1 ? 's' : ''}` : 'No reviews yet'}
                  </p>
                </div>
              </div>
              {reviews.length > 0 && (
                <div className='flex items-center gap-2 bg-amber-50 px-4 py-2 rounded-xl border border-amber-100'>
                  <FaStar className='w-4 h-4 text-amber-400' />
                  <span className='text-xl font-black text-gray-900'>{avgRating}</span>
                  <span className='text-xs text-gray-400'>/ 5</span>
                </div>
              )}
            </div>

            {reviewsLoading ? (
              <div className='flex justify-center py-10'>
                <div className='w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin' />
              </div>
            ) : reviews.length === 0 ? (
              <div className='text-center py-12 bg-gray-50 rounded-2xl'>
                <div className='w-16 h-16 rounded-full bg-amber-50 flex items-center justify-center mx-auto mb-3 text-3xl'>⭐</div>
                <p className='text-gray-700 font-semibold text-sm'>No reviews yet</p>
                <p className='text-gray-400 text-xs mt-1'>Be the first to review this car after your rental</p>
                {!user && (
                  <Link to='/login' className='inline-block mt-4 text-xs text-blue-600 hover:underline font-medium'>
                    Sign in to leave a review
                  </Link>
                )}
              </div>
            ) : (
              <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>

                {/* Rating breakdown */}
                <div className='lg:col-span-1'>
                  <div className='bg-gray-50 rounded-2xl p-5 border border-gray-100 h-full'>

                    {/* Big number */}
                    <div className='text-center mb-5 pb-5 border-b border-gray-200'>
                      <p className='text-5xl font-black text-gray-900 leading-none mb-2'>{avgRating}</p>
                      <StarDisplay rating={Math.round(avgRating)} size='lg' />
                      <p className='text-xs text-gray-400 mt-2'>{reviews.length} review{reviews.length !== 1 ? 's' : ''}</p>
                    </div>

                    {/* Bars */}
                    <p className='text-xs font-bold text-gray-500 uppercase tracking-widest mb-3'>Breakdown</p>
                    <div className='space-y-2.5'>
                      {ratingCounts.map(({ star, count, percent }) => (
                        <div key={star} className='flex items-center gap-2'>
                          <span className='text-xs font-semibold text-gray-600 w-3 text-right'>{star}</span>
                          <FaStar className='w-3 h-3 text-amber-400 shrink-0' />
                          <div className='flex-1 h-2 bg-gray-200 rounded-full overflow-hidden'>
                            <motion.div
                              initial={{ width: 0 }}
                              whileInView={{ width: `${percent}%` }}
                              viewport={{ once: true }}
                              transition={{ duration: 0.6, delay: (5 - star) * 0.08 }}
                              className='h-full bg-amber-400 rounded-full'
                            />
                          </div>
                          <span className='text-xs text-gray-400 w-5 text-right font-medium'>{count}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Review cards */}
                <div className='lg:col-span-2 space-y-3'>
                  {reviews.map((review, idx) => (
                    <motion.div
                      key={review._id}
                      custom={idx}
                      variants={fadeUp}
                      initial='hidden'
                      whileInView='visible'
                      viewport={{ once: true }}
                      className='bg-gray-50 hover:bg-blue-50/60 rounded-2xl p-4 transition-colors border border-transparent hover:border-blue-100'
                    >
                      <div className='flex items-start justify-between gap-3 mb-3'>
                        <div className='flex items-center gap-2.5'>
                          <div className='w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white text-sm font-bold flex-shrink-0 shadow-sm'>
                            {review.user?.name?.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className='text-sm font-bold text-gray-900'>{review.user?.name}</p>
                            <p className='text-xs text-gray-400'>
                              {new Date(review.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                            </p>
                          </div>
                        </div>
                        <StarDisplay rating={review.rating} size='sm' />
                      </div>
                      <p className='text-sm text-gray-600 leading-relaxed'>{review.comment}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </motion.div>

      </div>
    </div>
  );
};

export default CarDetail;