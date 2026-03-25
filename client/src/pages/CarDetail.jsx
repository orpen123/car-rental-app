// import { useEffect, useState, useCallback } from 'react';
// import { useParams, useNavigate, Link } from 'react-router-dom';
// import { motion, AnimatePresence } from 'framer-motion';
// import {
//   FiArrowLeft, FiChevronLeft, FiChevronRight, FiCalendar,
//   FiMapPin, FiSettings, FiDroplet, FiUsers, FiShield,
//   FiCreditCard, FiImage,
// } from 'react-icons/fi';
// import { FaStar } from 'react-icons/fa';
// import api from '../services/api.js';
// import { useAuth } from '../context/AuthContext.jsx';

// const StarDisplay = ({ rating, size = 'sm' }) => {
//   const sizes = { sm: 'w-3 h-3', md: 'w-4 h-4', lg: 'w-5 h-5' };
//   return (
//     <div className='flex items-center gap-0.5'>
//       {[1, 2, 3, 4, 5].map((star) => (
//         <FaStar key={star} className={`${sizes[size]} ${star <= rating ? 'text-amber-400' : 'text-slate-200'}`} />
//       ))}
//     </div>
//   );
// };

// const CarDetail = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const { user } = useAuth();
//   const [car, setCar] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [selectedImage, setSelectedImage] = useState(0);
//   const [isTransitioning, setIsTransitioning] = useState(false);
//   const [reviews, setReviews] = useState([]);
//   const [avgRating, setAvgRating] = useState(0);

//   useEffect(() => {
//     const fetchDetails = async () => {
//       try {
//         const [carRes, reviewsRes] = await Promise.all([
//           api.get(`/cars/${id}`),
//           api.get(`/reviews/car/${id}`)
//         ]);
//         setCar(carRes.data);
//         setReviews(reviewsRes.data.reviews || []);
//         setAvgRating(reviewsRes.data.avgRating || 0);
//       } catch (error) {
//         console.error(error);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchDetails();
//   }, [id]);

//   const changeImage = useCallback((index) => {
//     if (isTransitioning || index === selectedImage) return;
//     setIsTransitioning(true);
//     setSelectedImage(index);
//     setTimeout(() => setIsTransitioning(false), 200);
//   }, [isTransitioning, selectedImage]);

//   const prevImage = () => changeImage(selectedImage === 0 ? car.images.length - 1 : selectedImage - 1);
//   const nextImage = () => changeImage(selectedImage === car.images.length - 1 ? 0 : selectedImage + 1);

//   if (loading) {
//     return (
//       <div className='min-h-screen bg-slate-50 flex items-center justify-center'>
//         <div className='w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin' />
//       </div>
//     );
//   }

//   if (!car) return null;

//   const specs = [
//     { icon: FiSettings, label: 'Transmission', value: car.transmission },
//     { icon: FiDroplet, label: 'Fuel Type', value: car.fuel },
//     { icon: FiUsers, label: 'Seats', value: `${car.seats} Seats` },
//     { icon: FiCalendar, label: 'Year', value: car.year },
//     { icon: FiSettings, label: 'Type', value: car.type }, // Replaced emoji with icon for professionalism
//     { icon: FiMapPin, label: 'Location', value: car.location },
//   ];

//   return (
//     <div className='min-h-screen bg-[#f8fafc] pt-24 pb-12'>
//       <div className='max-w-7xl mx-auto px-4 sm:px-6'>
        
//         {/* Breadcrumb */}
//         <Link to='/cars' className='inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-blue-600 transition-colors mb-6'>
//           <FiArrowLeft /> Back to Listings
//         </Link>

//         <div className='grid grid-cols-1 lg:grid-cols-12 gap-8 items-start'>
          
//           {/* LEFT COLUMN: Gallery */}
//           <div className='lg:col-span-7 space-y-4'>
//             <motion.div 
//               initial={{ opacity: 0, y: 10 }} 
//               animate={{ opacity: 1, y: 0 }}
//               className='relative aspect-[16/10] bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-100 group'
//             >
//               {/* Status Badge */}
//               <div className='absolute top-4 left-4 z-10'>
//                 <span className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold tracking-wide uppercase backdrop-blur-md shadow-sm ${car.available ? 'bg-emerald-500/90 text-white' : 'bg-rose-500/90 text-white'}`}>
//                   <span className={`w-1.5 h-1.5 rounded-full bg-white ${car.available && 'animate-pulse'}`} />
//                   {car.available ? 'Available' : 'Booked'}
//                 </span>
//               </div>

//               <AnimatePresence mode='wait'>
//                 <motion.img
//                   key={selectedImage}
//                   src={car.images[selectedImage]}
//                   initial={{ opacity: 0 }}
//                   animate={{ opacity: 1 }}
//                   exit={{ opacity: 0 }}
//                   transition={{ duration: 0.3 }}
//                   className='w-full h-full object-contain p-6'
//                 />
//               </AnimatePresence>

//               {/* Navigation Arrows */}
//               {car.images.length > 1 && (
//                 <div className='absolute inset-0 flex items-center justify-between px-4 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none'>
//                   <button onClick={prevImage} className='p-2 bg-white/90 rounded-full shadow-lg pointer-events-auto hover:bg-white transition-transform hover:scale-110'>
//                     <FiChevronLeft size={20} />
//                   </button>
//                   <button onClick={nextImage} className='p-2 bg-white/90 rounded-full shadow-lg pointer-events-auto hover:bg-white transition-transform hover:scale-110'>
//                     <FiChevronRight size={20} />
//                   </button>
//                 </div>
//               )}

//               <div className='absolute bottom-4 right-4 bg-slate-900/70 backdrop-blur-md text-white px-3 py-1 rounded-lg text-[11px] font-medium'>
//                 {selectedImage + 1} / {car.images.length}
//               </div>
//             </motion.div>

//             {/* Optimized Thumbnails */}
//             {car.images.length > 1 && (
//               <div className='flex gap-3 overflow-x-auto pb-2 scrollbar-hide'>
//                 {car.images.map((img, i) => (
//                   <button
//                     key={i}
//                     onClick={() => changeImage(i)}
//                     className={`relative flex-shrink-0 w-20 h-14 rounded-xl overflow-hidden border-2 transition-all duration-200 ${
//                       selectedImage === i ? 'border-blue-600 ring-2 ring-blue-100' : 'border-transparent opacity-60 hover:opacity-100'
//                     }`}
//                   >
//                     <img src={img} className='w-full h-full object-cover' alt='' />
//                   </button>
//                 ))}
//               </div>
//             )}
//           </div>

//           {/* RIGHT COLUMN: Content (Sticky) */}
//           <div className='lg:col-span-5 space-y-6 lg:sticky lg:top-24'>
            
//             {/* Main Header Card */}
//             <div className='bg-white p-6 rounded-3xl border border-slate-100 shadow-sm'>
//               <div className='flex justify-between items-start mb-2'>
//                 <h1 className='text-3xl font-extrabold text-slate-900 tracking-tight'>
//                   {car.brand} <span className='text-blue-600'>{car.model}</span>
//                 </h1>
//               </div>
              
//               <div className='flex items-center gap-3 mb-6'>
//                 <p className='text-slate-400 font-medium text-sm'>{car.year} · {car.type}</p>
//                 {reviews.length > 0 && (
//                   <>
//                     <div className='w-1 h-1 bg-slate-200 rounded-full' />
//                     <div className='flex items-center gap-1.5'>
//                       <StarDisplay rating={avgRating} />
//                       <span className='text-sm font-bold text-slate-700'>{avgRating}</span>
//                       <span className='text-xs text-slate-400'>({reviews.length})</span>
//                     </div>
//                   </>
//                 )}
//               </div>

//               <div className='flex items-baseline gap-1 pt-4 border-t border-slate-50'>
//                 <span className='text-4xl font-black text-slate-900'>${car.pricePerDay}</span>
//                 <span className='text-slate-400 font-medium'>/ day</span>
//               </div>
//             </div>

//             {/* Specifications Card */}
//             <div className='bg-white p-6 rounded-3xl border border-slate-100 shadow-sm'>
//               <h3 className='text-sm font-bold text-slate-900 mb-5 flex items-center gap-2'>
//                 <div className='p-1.5 bg-blue-50 text-blue-600 rounded-lg'>
//                   <FiSettings size={14} />
//                 </div>
//                 Key Specifications
//               </h3>
//               <div className='grid grid-cols-2 gap-3'>
//                 {specs.map((spec, i) => (
//                   <div key={i} className='flex items-center gap-3 bg-slate-50 p-3 rounded-2xl border border-slate-100/50'>
//                     <spec.icon className='text-blue-500' size={16} />
//                     <div className='min-w-0'>
//                       <p className='text-[10px] text-slate-400 font-bold uppercase tracking-wider'>{spec.label}</p>
//                       <p className='text-xs font-bold text-slate-800 truncate'>{spec.value}</p>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>

//             {/* Description Card */}
//             {car.description && (
//               <div className='bg-white p-6 rounded-3xl border border-slate-100 shadow-sm'>
//                 <h3 className='text-sm font-bold text-slate-900 mb-3'>Description</h3>
//                 <p className='text-sm text-slate-500 leading-relaxed'>
//                   {car.description}
//                 </p>
//               </div>
//             )}

//             {/* Action Card */}
//             <div className='bg-white p-6 rounded-3xl border border-slate-100 shadow-sm'>
//               {car.available ? (
//                 user ? (
//                   <button 
//                     onClick={() => navigate(`/booking/${car._id}`)} 
//                     className='w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-2xl text-sm transition-all shadow-lg shadow-blue-100 active:scale-[0.98]'
//                   >
//                     Confirm Booking
//                   </button>
//                 ) : (
//                   <Link to='/login' className='w-full block text-center bg-slate-900 hover:bg-slate-800 text-white font-bold py-4 rounded-2xl text-sm'>
//                     Login to Rent
//                   </Link>
//                 )
//               ) : (
//                 <button disabled className='w-full bg-slate-100 text-slate-400 font-bold py-4 rounded-2xl text-sm cursor-not-allowed'>
//                   Currently Unavailable
//                 </button>
//               )}

//               <div className='flex items-center justify-center gap-6 mt-5 pt-5 border-t border-slate-50'>
//                 <div className='flex items-center gap-2 text-[11px] font-bold text-slate-400 uppercase tracking-tight'>
//                   <FiShield className='text-emerald-500' size={14} /> 
//                   Insured
//                 </div>
//                 <div className='w-px h-3 bg-slate-200' />
//                 <div className='flex items-center gap-2 text-[11px] font-bold text-slate-400 uppercase tracking-tight'>
//                   <FiCreditCard className='text-blue-500' size={14} /> 
//                   Secure
//                 </div>
//               </div>
//             </div>

//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CarDetail;








// import { useEffect, useState, useCallback } from 'react';
// import { useParams, useNavigate, Link } from 'react-router-dom';
// import api from '../services/api.js';
// import { useAuth } from '../context/AuthContext.jsx';

// const StarDisplay = ({ rating, size = 'text-sm' }) => (
//   <div className='flex items-center gap-0.5'>
//     {[1, 2, 3, 4, 5].map((star) => (
//       <span key={star} className={`${size} ${star <= rating ? 'text-yellow-400' : 'text-gray-200'}`}>★</span>
//     ))}
//   </div>
// );

// const CarDetail = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const { user } = useAuth();
//   const [car, setCar] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [selectedImage, setSelectedImage] = useState(0);
//   const [isTransitioning, setIsTransitioning] = useState(false);
//   const [reviews, setReviews] = useState([]);
//   const [avgRating, setAvgRating] = useState(0);
//   const [reviewsLoading, setReviewsLoading] = useState(true);

//   useEffect(() => {
//     const fetchCar = async () => {
//       try {
//         const res = await api.get(`/cars/${id}`);
//         setCar(res.data);
//       } catch (error) {
//         console.error(error);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchCar();
//   }, [id]);

//   useEffect(() => {
//     const fetchReviews = async () => {
//       try {
//         const res = await api.get(`/reviews/car/${id}`);
//         setReviews(res.data.reviews);
//         setAvgRating(res.data.avgRating);
//       } catch (error) {
//         console.error(error);
//       } finally {
//         setReviewsLoading(false);
//       }
//     };
//     fetchReviews();
//   }, [id]);

//   const changeImage = useCallback((index) => {
//     if (isTransitioning || index === selectedImage) return;
//     setIsTransitioning(true);
//     setTimeout(() => {
//       setSelectedImage(index);
//       setIsTransitioning(false);
//     }, 200);
//   }, [isTransitioning, selectedImage]);

//   const prevImage = useCallback(() => {
//     if (!car?.images?.length) return;
//     changeImage(selectedImage === 0 ? car.images.length - 1 : selectedImage - 1);
//   }, [car, selectedImage, changeImage]);

//   const nextImage = useCallback(() => {
//     if (!car?.images?.length) return;
//     changeImage(selectedImage === car.images.length - 1 ? 0 : selectedImage + 1);
//   }, [car, selectedImage, changeImage]);

//   useEffect(() => {
//     const handleKey = (e) => {
//       if (e.key === 'ArrowLeft') prevImage();
//       if (e.key === 'ArrowRight') nextImage();
//     };
//     window.addEventListener('keydown', handleKey);
//     return () => window.removeEventListener('keydown', handleKey);
//   }, [prevImage, nextImage]);

//   if (loading) {
//     return (
//       <div className='min-h-screen bg-[#eaecf5] flex items-center justify-center'>
//         <div className='w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin' />
//       </div>
//     );
//   }

//   if (!car) {
//     return (
//       <div className='min-h-screen bg-[#eaecf5] flex flex-col items-center justify-center'>
//         <p className='text-4xl mb-3'>🚗</p>
//         <p className='text-gray-500 text-lg font-medium'>Car not found</p>
//         <Link to='/cars' className='mt-4 text-blue-600 text-sm hover:underline'>Back to Cars</Link>
//       </div>
//     );
//   }

//   const specs = [
//     { icon: '⚙️', label: 'Transmission', value: car.transmission },
//     { icon: '⛽', label: 'Fuel Type', value: car.fuel },
//     { icon: '💺', label: 'Seats', value: `${car.seats} seats` },
//     { icon: '📅', label: 'Year', value: car.year },
//     { icon: '🚗', label: 'Type', value: car.type },
//     { icon: '📍', label: 'Location', value: car.location },
//   ];

//   const hasMultipleImages = car.images && car.images.length > 1;

//   const ratingCounts = [5, 4, 3, 2, 1].map(star => ({
//     star,
//     count: reviews.filter(r => r.rating === star).length,
//     percent: reviews.length ? Math.round((reviews.filter(r => r.rating === star).length / reviews.length) * 100) : 0,
//   }));

//   return (
//     <div className='min-h-screen bg-[#eaecf5] pt-20'>
//       <div className='max-w-6xl mx-auto px-4 sm:px-6 py-8'>

//         {/* Back */}
//         <Link to='/cars' className='inline-flex items-center gap-2 text-xs text-gray-500 hover:text-blue-600 transition-colors mb-6 group'>
//           <svg className='w-4 h-4 group-hover:-translate-x-1 transition-transform' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
//             <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15 19l-7-7 7-7' />
//           </svg>
//           Back to Cars
//         </Link>

//         <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>

//           {/* Left — Image Carousel */}
//           <div className='space-y-3'>
//             <div className='relative w-full aspect-video bg-white rounded-2xl overflow-hidden shadow-sm group'>
//               {car.images && car.images[selectedImage] ? (
//                 <img
//                   src={car.images[selectedImage]}
//                   alt={`${car.brand} ${car.model}`}
//                   className={`w-full h-full object-cover transition-opacity duration-200 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}
//                 />
//               ) : (
//                 <div className='w-full h-full bg-[#eaecf5] flex items-center justify-center'>
//                   <svg className='w-16 h-16 text-gray-300' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
//                     <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={1} d='M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z' />
//                   </svg>
//                 </div>
//               )}

//               {hasMultipleImages && (
//                 <>
//                   <button onClick={prevImage} className='absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white bg-opacity-90 hover:bg-opacity-100 rounded-full shadow-md flex items-center justify-center transition-all duration-200 opacity-0 group-hover:opacity-100 hover:scale-110'>
//                     <svg className='w-4 h-4 text-gray-700' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
//                       <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15 19l-7-7 7-7' />
//                     </svg>
//                   </button>
//                   <button onClick={nextImage} className='absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white bg-opacity-90 hover:bg-opacity-100 rounded-full shadow-md flex items-center justify-center transition-all duration-200 opacity-0 group-hover:opacity-100 hover:scale-110'>
//                     <svg className='w-4 h-4 text-gray-700' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
//                       <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 5l7 7-7 7' />
//                     </svg>
//                   </button>
//                 </>
//               )}

//               {hasMultipleImages && (
//                 <div className='absolute bottom-3 right-3 bg-black bg-opacity-50 text-white text-xs px-2.5 py-1 rounded-full font-medium backdrop-blur-sm'>
//                   {selectedImage + 1} / {car.images.length}
//                 </div>
//               )}

//               {hasMultipleImages && (
//                 <div className='absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5'>
//                   {car.images.map((_, i) => (
//                     <button
//                       key={i}
//                       onClick={() => changeImage(i)}
//                       className={`rounded-full transition-all duration-300 ${selectedImage === i ? 'w-5 h-2 bg-white' : 'w-2 h-2 bg-white bg-opacity-50 hover:bg-opacity-75'}`}
//                     />
//                   ))}
//                 </div>
//               )}

//               <div className='absolute top-3 left-3'>
//                 <span className={`text-xs px-2.5 py-1 rounded-full font-semibold backdrop-blur-sm ${car.available ? 'bg-green-100 bg-opacity-90 text-green-700' : 'bg-red-100 bg-opacity-90 text-red-600'}`}>
//                   {car.available ? '✅ Available' : '❌ Booked'}
//                 </span>
//               </div>
//             </div>

//             {hasMultipleImages && (
//               <div className='flex gap-2 overflow-x-auto pb-1'>
//                 {car.images.map((img, i) => (
//                   <button
//                     key={i}
//                     onClick={() => changeImage(i)}
//                     className={`flex-shrink-0 w-20 h-14 rounded-xl overflow-hidden border-2 transition-all duration-200 hover:scale-105 ${selectedImage === i ? 'border-blue-600 shadow-md shadow-blue-200' : 'border-transparent opacity-60 hover:opacity-100'}`}
//                   >
//                     <img src={img} alt='' className='w-full h-full object-cover' />
//                   </button>
//                 ))}
//               </div>
//             )}

//             {hasMultipleImages && (
//               <p className='text-xs text-gray-400 text-center sm:hidden'>← Use arrow keys or tap arrows to navigate →</p>
//             )}
//           </div>

//           {/* Right — Info */}
//           <div className='space-y-4'>

//             {/* Title + Price */}
//             <div className='bg-white rounded-2xl shadow-sm p-5'>
//               <div className='mb-3'>
//                 <h1 className='text-2xl sm:text-3xl font-bold text-gray-900'>{car.brand} {car.model}</h1>
//                 <p className='text-gray-400 text-sm mt-1'>{car.year} • {car.type}</p>
//               </div>

//               {/* Rating summary */}
//               {reviews.length > 0 && (
//                 <div className='flex items-center gap-2 mb-3'>
//                   <StarDisplay rating={Math.round(avgRating)} />
//                   <span className='text-sm font-bold text-gray-900'>{avgRating}</span>
//                   <span className='text-xs text-gray-400'>({reviews.length} review{reviews.length !== 1 ? 's' : ''})</span>
//                 </div>
//               )}

//               <div className='flex items-end justify-between pt-3 border-t border-gray-50'>
//                 <div>
//                   <span className='text-3xl font-black text-blue-600'>${car.pricePerDay}</span>
//                   <span className='text-gray-400 text-sm'> /day</span>
//                 </div>
//                 {car.images && car.images.length > 1 && (
//                   <span className='text-xs text-gray-400 bg-gray-50 px-2.5 py-1 rounded-full'>📸 {car.images.length} photos</span>
//                 )}
//               </div>
//             </div>

//             {/* Specs */}
//             <div className='bg-white rounded-2xl shadow-sm p-5'>
//               <h3 className='text-sm font-bold text-gray-900 mb-4'>Specifications</h3>
//               <div className='grid grid-cols-2 gap-3'>
//                 {specs.map((spec, i) => (
//                   <div key={i} className='flex items-center gap-3 bg-gray-50 rounded-xl px-3 py-2.5 hover:bg-blue-50 transition-colors'>
//                     <span className='text-base'>{spec.icon}</span>
//                     <div>
//                       <p className='text-xs text-gray-400'>{spec.label}</p>
//                       <p className='text-xs font-semibold text-gray-800 capitalize'>{spec.value}</p>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>

//             {/* Description */}
//             {car.description && (
//               <div className='bg-white rounded-2xl shadow-sm p-5'>
//                 <h3 className='text-sm font-bold text-gray-900 mb-3'>Description</h3>
//                 <p className='text-sm text-gray-500 leading-relaxed'>{car.description}</p>
//               </div>
//             )}

//             {/* Book Button */}
//             <div className='bg-white rounded-2xl shadow-sm p-5'>
//               {car.available ? (
//                 user ? (
//                   <button
//                     onClick={() => navigate(`/booking/${car._id}`)}
//                     className='w-full bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-semibold py-3.5 rounded-2xl text-sm transition-all duration-300 flex items-center justify-center gap-2'
//                   >
//                     <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
//                       <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' />
//                     </svg>
//                     Book Now — ${car.pricePerDay}/day
//                   </button>
//                 ) : (
//                   <div className='space-y-3'>
//                     <p className='text-xs text-gray-400 text-center'>Sign in to book this car</p>
//                     <Link to='/login' className='w-full block text-center bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3.5 rounded-2xl text-sm transition-all duration-300'>
//                       Sign In to Book
//                     </Link>
//                   </div>
//                 )
//               ) : (
//                 <button disabled className='w-full bg-gray-100 text-gray-400 font-semibold py-3.5 rounded-2xl text-sm cursor-not-allowed'>
//                   Currently Unavailable
//                 </button>
//               )}
//               <p className='text-xs text-gray-400 text-center mt-3'>💳 Free cancellation • 🔒 Secure booking</p>
//             </div>
//           </div>
//         </div>

//         {/* ===== REVIEWS SECTION ===== */}
//         <div className='mt-6'>
//           <div className='bg-white rounded-2xl shadow-sm p-5 sm:p-6'>

//             {/* Reviews Header */}
//             <div className='flex items-center justify-between mb-5'>
//               <div>
//                 <h3 className='text-sm font-bold text-gray-900'>Customer Reviews</h3>
//                 <p className='text-xs text-gray-400 mt-0.5'>
//                   {reviews.length > 0 ? `${reviews.length} review${reviews.length !== 1 ? 's' : ''}` : 'No reviews yet'}
//                 </p>
//               </div>
//               {reviews.length > 0 && (
//                 <div className='text-right'>
//                   <div className='flex items-center gap-1.5 justify-end'>
//                     <span className='text-2xl font-black text-gray-900'>{avgRating}</span>
//                     <span className='text-yellow-400 text-xl'>★</span>
//                   </div>
//                   <p className='text-xs text-gray-400'>out of 5</p>
//                 </div>
//               )}
//             </div>

//             {reviewsLoading ? (
//               <div className='flex justify-center py-8'>
//                 <div className='w-6 h-6 border-3 border-blue-600 border-t-transparent rounded-full animate-spin' />
//               </div>
//             ) : reviews.length === 0 ? (
//               <div className='text-center py-10'>
//                 <div className='text-4xl mb-2'>⭐</div>
//                 <p className='text-gray-400 text-sm font-medium'>No reviews yet</p>
//                 <p className='text-gray-300 text-xs mt-1'>Be the first to review this car after your rental</p>
//               </div>
//             ) : (
//               <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>

//                 {/* Rating breakdown */}
//                 <div className='lg:col-span-1'>
//                   <div className='bg-gray-50 rounded-2xl p-4'>
//                     <p className='text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3'>Rating Breakdown</p>
//                     <div className='space-y-2'>
//                       {ratingCounts.map(({ star, count, percent }) => (
//                         <div key={star} className='flex items-center gap-2'>
//                           <span className='text-xs text-gray-500 w-3'>{star}</span>
//                           <span className='text-yellow-400 text-xs'>★</span>
//                           <div className='flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden'>
//                             <div
//                               className='h-full bg-yellow-400 rounded-full transition-all duration-500'
//                               style={{ width: `${percent}%` }}
//                             />
//                           </div>
//                           <span className='text-xs text-gray-400 w-5 text-right'>{count}</span>
//                         </div>
//                       ))}
//                     </div>

//                     {/* Big rating display */}
//                     <div className='mt-4 pt-4 border-t border-gray-200 text-center'>
//                       <p className='text-4xl font-black text-gray-900'>{avgRating}</p>
//                       <StarDisplay rating={Math.round(avgRating)} size='text-lg' />
//                       <p className='text-xs text-gray-400 mt-1'>{reviews.length} review{reviews.length !== 1 ? 's' : ''}</p>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Review list */}
//                 <div className='lg:col-span-2 space-y-3'>
//                   {reviews.map((review, idx) => (
//                     <div
//                       key={review._id}
//                       className='bg-gray-50 rounded-2xl p-4 hover:bg-blue-50 transition-colors'
//                       style={{ animation: `fadeSlideUp 0.4s ease-out ${idx * 0.05}s both` }}
//                     >
//                       <div className='flex items-start justify-between mb-2'>
//                         <div className='flex items-center gap-2.5'>
//                           <div className='w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white text-xs font-bold flex-shrink-0'>
//                             {review.user?.name?.charAt(0).toUpperCase()}
//                           </div>
//                           <div>
//                             <p className='text-xs font-semibold text-gray-900'>{review.user?.name}</p>
//                             <p className='text-xs text-gray-400'>{new Date(review.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</p>
//                           </div>
//                         </div>
//                         <StarDisplay rating={review.rating} />
//                       </div>
//                       <p className='text-xs text-gray-600 leading-relaxed'>{review.comment}</p>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             )}

//             {/* CTA for non-logged users */}
//             {!user && reviews.length === 0 && (
//               <div className='mt-4 pt-4 border-t border-gray-50 text-center'>
//                 <Link to='/login' className='text-xs text-blue-600 hover:underline font-medium'>
//                   Sign in to leave a review after your rental
//                 </Link>
//               </div>
//             )}
//           </div>
//         </div>

//       </div>
//     </div>
//   );
// };

// export default CarDetail;




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

        {/* ===== REVIEWS SECTION ===== */}
        <div className='mt-10'>
          <div className='bg-white rounded-3xl border border-slate-100 shadow-sm p-6'>

            {/* Reviews Header */}
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

                {/* Rating breakdown */}
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

                    {/* Big rating display */}
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

            {/* CTA for non-logged users */}
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