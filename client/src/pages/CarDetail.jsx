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
    { icon: FiSettings, label: 'Type', value: car.type }, // Replaced emoji with icon for professionalism
    { icon: FiMapPin, label: 'Location', value: car.location },
  ];

  return (
    <div className='min-h-screen bg-[#f8fafc] pt-24 pb-12'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6'>
        
        {/* Breadcrumb */}
        <Link to='/cars' className='inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-blue-600 transition-colors mb-6'>
          <FiArrowLeft /> Back to Listings
        </Link>

        <div className='grid grid-cols-1 lg:grid-cols-12 gap-8 items-start'>
          
          {/* LEFT COLUMN: Gallery */}
          <div className='lg:col-span-7 space-y-4'>
            <motion.div 
              initial={{ opacity: 0, y: 10 }} 
              animate={{ opacity: 1, y: 0 }}
              className='relative aspect-[16/10] bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-100 group'
            >
              {/* Status Badge */}
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

              {/* Navigation Arrows */}
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

            {/* Optimized Thumbnails */}
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
            
            {/* Main Header Card */}
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

            {/* Specifications Card */}
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

            {/* Description Card */}
            {car.description && (
              <div className='bg-white p-6 rounded-3xl border border-slate-100 shadow-sm'>
                <h3 className='text-sm font-bold text-slate-900 mb-3'>Description</h3>
                <p className='text-sm text-slate-500 leading-relaxed'>
                  {car.description}
                </p>
              </div>
            )}

            {/* Action Card */}
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
      </div>
    </div>
  );
};

export default CarDetail;