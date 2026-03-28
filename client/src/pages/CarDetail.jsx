




















































































        






          
































































            







              


























































































































































































































































































































































































































































































































import { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiArrowLeft, FiChevronLeft, FiChevronRight, FiCalendar,
  FiMapPin, FiSettings, FiDroplet, FiUsers, FiShield,
  FiCreditCard, FiImage,
} from 'react-icons/fi';
import { FaStar } from 'react-icons/fa';
import api from '../services/api.js';
import { useAuth } from '../context/AuthContext.jsx';

const StarDisplay = ({ rating, size = 'sm' }) => {
  const sizes = { sm: 'w-3 h-3', md: 'w-4 h-4', lg: 'w-5 h-5' };
  return (
    <div className='flex items-center gap-0.5'>
      {[1, 2, 3, 4, 5].map((star) => (
        <FaStar key={star} className={`${sizes[size]} ${star <= rating ? 'text-amber-400' : 'text-slate-200'}`} />
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
    const fetchDetails = async () => {
      try {
        const [carRes, reviewsRes] = await Promise.all([
          api.get(`/cars/${id}`),
          api.get(`/reviews/car/${id}`)
        ]);
        setCar(carRes.data);
        setReviews(reviewsRes.data.reviews || []);
        setAvgRating(reviewsRes.data.avgRating || 0);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
        setReviewsLoading(false);
      }
    };
    fetchDetails();
  }, [id]);

  const changeImage = useCallback((index) => {
    if (isTransitioning || index === selectedImage) return;
    setIsTransitioning(true);
    setSelectedImage(index);
    setTimeout(() => setIsTransitioning(false), 200);
  }, [isTransitioning, selectedImage]);

  const prevImage = () => changeImage(selectedImage === 0 ? car.images.length - 1 : selectedImage - 1);
  const nextImage = () => changeImage(selectedImage === car.images.length - 1 ? 0 : selectedImage + 1);

  if (loading) {
    return (
      <div className='min-h-screen bg-slate-50 flex items-center justify-center'>
        <div className='w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin' />
      </div>
    );
  }

  if (!car) return null;

  const specs = [
    { icon: FiSettings, label: 'Transmission', value: car.transmission },
    { icon: FiDroplet, label: 'Fuel Type', value: car.fuel },
    { icon: FiUsers, label: 'Seats', value: `${car.seats} Seats` },
    { icon: FiCalendar, label: 'Year', value: car.year },
    { icon: FiSettings, label: 'Type', value: car.type },
    { icon: FiMapPin, label: 'Location', value: car.location },
  ];

  const ratingCounts = [5, 4, 3, 2, 1].map(star => ({
    star,
    count: reviews.filter(r => r.rating === star).length,
    percent: reviews.length ? Math.round((reviews.filter(r => r.rating === star).length / reviews.length) * 100) : 0,
  }));

  return (
    <div className='min-h-screen bg-[#f8fafc] pt-24 pb-12'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6'>
        
        {}
        <Link to='/cars' className='inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-blue-600 transition-colors mb-6'>
          <FiArrowLeft /> Back to Listings
        </Link>

        <div className='grid grid-cols-1 lg:grid-cols-12 gap-8 items-start'>
          
          {}
          <div className='lg:col-span-7 space-y-4'>
            <motion.div 
              initial={{ opacity: 0, y: 10 }} 
              animate={{ opacity: 1, y: 0 }}
              className='relative aspect-[16/10] bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-100 group'
            >
              {}
              <div className='absolute top-4 left-4 z-10'>
                <span className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold tracking-wide uppercase backdrop-blur-md shadow-sm ${car.available ? 'bg-emerald-500/90 text-white' : 'bg-rose-500/90 text-white'}`}>
                  <span className={`w-1.5 h-1.5 rounded-full bg-white ${car.available && 'animate-pulse'}`} />
                  {car.available ? 'Available' : 'Booked'}
                </span>
              </div>

              <AnimatePresence mode='wait'>
                <motion.img
                  key={selectedImage}
                  src={car.images[selectedImage]}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className='w-full h-full object-contain p-6'
                />
              </AnimatePresence>

              {}
              {car.images.length > 1 && (
                <div className='absolute inset-0 flex items-center justify-between px-4 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none'>
                  <button onClick={prevImage} className='p-2 bg-white/90 rounded-full shadow-lg pointer-events-auto hover:bg-white transition-transform hover:scale-110'>
                    <FiChevronLeft size={20} />
                  </button>
                  <button onClick={nextImage} className='p-2 bg-white/90 rounded-full shadow-lg pointer-events-auto hover:bg-white transition-transform hover:scale-110'>
                    <FiChevronRight size={20} />
                  </button>
                </div>
              )}

              <div className='absolute bottom-4 right-4 bg-slate-900/70 backdrop-blur-md text-white px-3 py-1 rounded-lg text-[11px] font-medium'>
                {selectedImage + 1} / {car.images.length}
              </div>
            </motion.div>

            {}
            {car.images.length > 1 && (
              <div className='flex gap-3 overflow-x-auto pb-2 scrollbar-hide'>
                {car.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => changeImage(i)}
                    className={`relative flex-shrink-0 w-20 h-14 rounded-xl overflow-hidden border-2 transition-all duration-200 ${
                      selectedImage === i ? 'border-blue-600 ring-2 ring-blue-100' : 'border-transparent opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={img} className='w-full h-full object-cover' alt='' />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT COLUMN: Content (Sticky) */}
          <div className='lg:col-span-5 space-y-6 lg:sticky lg:top-24'>
            
            {}
            <div className='bg-white p-6 rounded-3xl border border-slate-100 shadow-sm'>
              <div className='flex justify-between items-start mb-2'>
                <h1 className='text-3xl font-extrabold text-slate-900 tracking-tight'>
                  {car.brand} <span className='text-blue-600'>{car.model}</span>
                </h1>
              </div>
              
              <div className='flex items-center gap-3 mb-6'>
                <p className='text-slate-400 font-medium text-sm'>{car.year} · {car.type}</p>
                {reviews.length > 0 && (
                  <>
                    <div className='w-1 h-1 bg-slate-200 rounded-full' />
                    <div className='flex items-center gap-1.5'>
                      <StarDisplay rating={avgRating} />
                      <span className='text-sm font-bold text-slate-700'>{avgRating}</span>
                      <span className='text-xs text-slate-400'>({reviews.length})</span>
                    </div>
                  </>
                )}
              </div>

              <div className='flex items-baseline gap-1 pt-4 border-t border-slate-50'>
                <span className='text-4xl font-black text-slate-900'>${car.pricePerDay}</span>
                <span className='text-slate-400 font-medium'>/ day</span>
              </div>
            </div>

            {}
            <div className='bg-white p-6 rounded-3xl border border-slate-100 shadow-sm'>
              <h3 className='text-sm font-bold text-slate-900 mb-5 flex items-center gap-2'>
                <div className='p-1.5 bg-blue-50 text-blue-600 rounded-lg'>
                  <FiSettings size={14} />
                </div>
                Key Specifications
              </h3>
              <div className='grid grid-cols-2 gap-3'>
                {specs.map((spec, i) => (
                  <div key={i} className='flex items-center gap-3 bg-slate-50 p-3 rounded-2xl border border-slate-100/50'>
                    <spec.icon className='text-blue-500' size={16} />
                    <div className='min-w-0'>
                      <p className='text-[10px] text-slate-400 font-bold uppercase tracking-wider'>{spec.label}</p>
                      <p className='text-xs font-bold text-slate-800 truncate'>{spec.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {}
            {car.description && (
              <div className='bg-white p-6 rounded-3xl border border-slate-100 shadow-sm'>
                <h3 className='text-sm font-bold text-slate-900 mb-3'>Description</h3>
                <p className='text-sm text-slate-500 leading-relaxed'>
                  {car.description}
                </p>
              </div>
            )}

            {}
            <div className='bg-white p-6 rounded-3xl border border-slate-100 shadow-sm'>
              {car.available ? (
                user ? (
                  <button 
                    onClick={() => navigate(`/booking/${car._id}`)} 
                    className='w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-2xl text-sm transition-all shadow-lg shadow-blue-100 active:scale-[0.98]'
                  >
                    Confirm Booking
                  </button>
                ) : (
                  <Link to='/login' className='w-full block text-center bg-slate-900 hover:bg-slate-800 text-white font-bold py-4 rounded-2xl text-sm'>
                    Login to Rent
                  </Link>
                )
              ) : (
                <button disabled className='w-full bg-slate-100 text-slate-400 font-bold py-4 rounded-2xl text-sm cursor-not-allowed'>
                  Currently Unavailable
                </button>
              )}

              <div className='flex items-center justify-center gap-6 mt-5 pt-5 border-t border-slate-50'>
                <div className='flex items-center gap-2 text-[11px] font-bold text-slate-400 uppercase tracking-tight'>
                  <FiShield className='text-emerald-500' size={14} /> 
                  Insured
                </div>
                <div className='w-px h-3 bg-slate-200' />
                <div className='flex items-center gap-2 text-[11px] font-bold text-slate-400 uppercase tracking-tight'>
                  <FiCreditCard className='text-blue-500' size={14} /> 
                  Secure
                </div>
              </div>
            </div>

          </div>
        </div>

        {}
        <div className='mt-10'>
          <div className='bg-white rounded-3xl border border-slate-100 shadow-sm p-6'>

            {}
            <div className='flex items-center justify-between mb-6'>
              <div>
                <h3 className='text-sm font-bold text-slate-900'>Customer Reviews</h3>
                <p className='text-xs text-slate-400 mt-0.5'>
                  {reviews.length > 0 ? `${reviews.length} review${reviews.length !== 1 ? 's' : ''}` : 'No reviews yet'}
                </p>
              </div>
              {reviews.length > 0 && (
                <div className='text-right'>
                  <div className='flex items-center gap-1.5 justify-end'>
                    <span className='text-2xl font-black text-slate-900'>{avgRating}</span>
                    <StarDisplay rating={Math.round(avgRating)} size='sm' />
                  </div>
                  <p className='text-[10px] text-slate-400'>out of 5</p>
                </div>
              )}
            </div>

            {reviewsLoading ? (
              <div className='flex justify-center py-8'>
                <div className='w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin' />
              </div>
            ) : reviews.length === 0 ? (
              <div className='text-center py-10'>
                <div className='text-4xl mb-2'>⭐</div>
                <p className='text-slate-400 text-sm font-medium'>No reviews yet</p>
                <p className='text-slate-300 text-xs mt-1'>Be the first to review this car after your rental</p>
              </div>
            ) : (
              <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>

                {}
                <div className='lg:col-span-1'>
                  <div className='bg-slate-50 rounded-2xl p-5'>
                    <p className='text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-4'>Rating Breakdown</p>
                    <div className='space-y-2.5'>
                      {ratingCounts.map(({ star, count, percent }) => (
                        <div key={star} className='flex items-center gap-2'>
                          <span className='text-xs text-slate-500 w-3'>{star}</span>
                          <FaStar className='w-3 h-3 text-amber-400' />
                          <div className='flex-1 h-1.5 bg-slate-200 rounded-full overflow-hidden'>
                            <div
                              className='h-full bg-amber-400 rounded-full transition-all duration-500'
                              style={{ width: `${percent}%` }}
                            />
                          </div>
                          <span className='text-[10px] text-slate-400 w-5 text-right'>{count}</span>
                        </div>
                      ))}
                    </div>

                    {}
                    <div className='mt-5 pt-4 border-t border-slate-200 text-center'>
                      <p className='text-3xl font-black text-slate-900'>{avgRating}</p>
                      <div className='flex justify-center mt-1'>
                        <StarDisplay rating={Math.round(avgRating)} size='md' />
                      </div>
                      <p className='text-[10px] text-slate-400 mt-1.5'>{reviews.length} review{reviews.length !== 1 ? 's' : ''}</p>
                    </div>
                  </div>
                </div>

                {/* Review list */}
                <div className='lg:col-span-2 space-y-3'>
                  {reviews.map((review, idx) => (
                    <div
                      key={review._id}
                      className='bg-slate-50 rounded-2xl p-4 hover:bg-slate-100 transition-colors'
                    >
                      <div className='flex items-start justify-between mb-2'>
                        <div className='flex items-center gap-2.5'>
                          <div className='w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white text-xs font-bold flex-shrink-0'>
                            {review.user?.name?.charAt(0).toUpperCase() || 'U'}
                          </div>
                          <div>
                            <p className='text-xs font-semibold text-slate-900'>{review.user?.name || 'Anonymous'}</p>
                            <p className='text-[10px] text-slate-400'>
                              {new Date(review.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                            </p>
                          </div>
                        </div>
                        <StarDisplay rating={review.rating} size='sm' />
                      </div>
                      <p className='text-xs text-slate-600 leading-relaxed mt-1'>{review.comment}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {}
            {!user && reviews.length === 0 && (
              <div className='mt-6 pt-4 border-t border-slate-100 text-center'>
                <Link to='/login' className='text-xs text-blue-600 hover:underline font-medium'>
                  Sign in to leave a review after your rental
                </Link>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default CarDetail;