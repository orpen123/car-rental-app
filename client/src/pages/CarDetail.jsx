// import { useEffect, useState } from 'react';
// import { useParams, useNavigate, Link } from 'react-router-dom';
// import api from '../services/api.js';
// import { useAuth } from '../context/AuthContext.jsx';

// const CarDetail = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const { user } = useAuth();
//   const [car, setCar] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [selectedImage, setSelectedImage] = useState(0);

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
//         <p className='text-gray-500 text-lg font-medium'>Car not found</p>
//         <Link to='/cars' className='mt-4 text-blue-600 text-sm hover:underline'>
//           Back to Cars
//         </Link>
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

//   return (
//     <div className='min-h-screen bg-[#eaecf5] pt-20'>
//       <div className='max-w-6xl mx-auto px-4 sm:px-6 py-8'>

//         {/* Back */}
//         <Link
//           to='/cars'
//           className='inline-flex items-center gap-2 text-xs text-gray-500 hover:text-blue-600 transition-colors mb-6 group'
//         >
//           <svg className='w-4 h-4 group-hover:-translate-x-1 transition-transform' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
//             <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15 19l-7-7 7-7' />
//           </svg>
//           Back to Cars
//         </Link>

//         <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>

//           {/* Left — Images */}
//           <div className='space-y-3'>
//             {/* Main Image */}
//             <div className='w-full aspect-video bg-white rounded-2xl overflow-hidden shadow-sm'>
//               {car.images && car.images[selectedImage] ? (
//                 <img
//                   src={car.images[selectedImage]}
//                   alt={`${car.brand} ${car.model}`}
//                   className='w-full h-full object-cover'
//                 />
//               ) : (
//                 <div className='w-full h-full bg-[#eaecf5] flex items-center justify-center'>
//                   <svg className='w-16 h-16 text-gray-300' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
//                     <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={1} d='M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z' />
//                     <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={1} d='M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10l2-2h8z' />
//                   </svg>
//                 </div>
//               )}
//             </div>

//             {/* Thumbnail Images */}
//             {car.images && car.images.length > 1 && (
//               <div className='flex gap-2 overflow-x-auto pb-1'>
//                 {car.images.map((img, i) => (
//                   <button
//                     key={i}
//                     onClick={() => setSelectedImage(i)}
//                     className={`flex-shrink-0 w-20 h-14 rounded-xl overflow-hidden border-2 transition-all ${selectedImage === i ? 'border-blue-600' : 'border-transparent'}`}
//                   >
//                     <img src={img} alt='' className='w-full h-full object-cover' />
//                   </button>
//                 ))}
//               </div>
//             )}
//           </div>

//           {/* Right — Info */}
//           <div className='space-y-4'>

//             {/* Title + Status */}
//             <div className='bg-white rounded-2xl shadow-sm p-5'>
//               <div className='flex items-start justify-between mb-3'>
//                 <div>
//                   <h1 className='text-2xl sm:text-3xl font-bold text-gray-900'>
//                     {car.brand} {car.model}
//                   </h1>
//                   <p className='text-gray-400 text-sm mt-1'>{car.year} • {car.type}</p>
//                 </div>
//                 <span className={`text-xs px-3 py-1.5 rounded-full font-semibold flex-shrink-0 ${car.available ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-500'}`}>
//                   {car.available ? '✅ Available' : '❌ Booked'}
//                 </span>
//               </div>

//               {/* Price */}
//               <div className='flex items-end gap-1 pt-3 border-t border-gray-50'>
//                 <span className='text-3xl font-black text-blue-600'>${car.pricePerDay}</span>
//                 <span className='text-gray-400 text-sm mb-1'>/day</span>
//               </div>
//             </div>

//             {/* Specs */}
//             <div className='bg-white rounded-2xl shadow-sm p-5'>
//               <h3 className='text-sm font-bold text-gray-900 mb-4'>Specifications</h3>
//               <div className='grid grid-cols-2 gap-3'>
//                 {specs.map((spec, i) => (
//                   <div key={i} className='flex items-center gap-3 bg-gray-50 rounded-xl px-3 py-2.5'>
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
//                     className='w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3.5 rounded-2xl text-sm transition-all duration-300'
//                   >
//                     Book Now
//                   </button>
//                 ) : (
//                   <div className='space-y-3'>
//                     <p className='text-xs text-gray-400 text-center'>
//                       You need to be logged in to book this car
//                     </p>
//                     <Link
//                       to='/login'
//                       className='w-full block text-center bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3.5 rounded-2xl text-sm transition-all duration-300'
//                     >
//                       Sign In to Book
//                     </Link>
//                   </div>
//                 )
//               ) : (
//                 <button
//                   disabled
//                   className='w-full bg-gray-100 text-gray-400 font-semibold py-3.5 rounded-2xl text-sm cursor-not-allowed'
//                 >
//                   Currently Unavailable
//                 </button>
//               )}

//               <p className='text-xs text-gray-400 text-center mt-3'>
//                 💳 Free cancellation • 🔒 Secure booking
//               </p>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CarDetail;

import { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../services/api.js';
import { useAuth } from '../context/AuthContext.jsx';

const CarDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

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

  const changeImage = useCallback((index) => {
    if (isTransitioning || index === selectedImage) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setSelectedImage(index);
      setIsTransitioning(false);
    }, 200);
  }, [isTransitioning, selectedImage]);

  const prevImage = useCallback(() => {
    if (!car?.images?.length) return;
    const newIndex = selectedImage === 0 ? car.images.length - 1 : selectedImage - 1;
    changeImage(newIndex);
  }, [car, selectedImage, changeImage]);

  const nextImage = useCallback(() => {
    if (!car?.images?.length) return;
    const newIndex = selectedImage === car.images.length - 1 ? 0 : selectedImage + 1;
    changeImage(newIndex);
  }, [car, selectedImage, changeImage]);

  // Keyboard navigation
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'ArrowLeft') prevImage();
      if (e.key === 'ArrowRight') nextImage();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [prevImage, nextImage]);

  if (loading) {
    return (
      <div className='min-h-screen bg-[#eaecf5] flex items-center justify-center'>
        <div className='w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin' />
      </div>
    );
  }

  if (!car) {
    return (
      <div className='min-h-screen bg-[#eaecf5] flex flex-col items-center justify-center'>
        <p className='text-4xl mb-3'>🚗</p>
        <p className='text-gray-500 text-lg font-medium'>Car not found</p>
        <Link to='/cars' className='mt-4 text-blue-600 text-sm hover:underline'>
          Back to Cars
        </Link>
      </div>
    );
  }

  const specs = [
    { icon: '⚙️', label: 'Transmission', value: car.transmission },
    { icon: '⛽', label: 'Fuel Type', value: car.fuel },
    { icon: '💺', label: 'Seats', value: `${car.seats} seats` },
    { icon: '📅', label: 'Year', value: car.year },
    { value: car.type, icon: '🚗', label: 'Type' },
    { icon: '📍', label: 'Location', value: car.location },
  ];

  const hasMultipleImages = car.images && car.images.length > 1;

  return (
    <div className='min-h-screen bg-[#eaecf5] pt-20'>
      <div className='max-w-6xl mx-auto px-4 sm:px-6 py-8'>

        {/* Back */}
        <Link
          to='/cars'
          className='inline-flex items-center gap-2 text-xs text-gray-500 hover:text-blue-600 transition-colors mb-6 group'
        >
          <svg className='w-4 h-4 group-hover:-translate-x-1 transition-transform' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15 19l-7-7 7-7' />
          </svg>
          Back to Cars
        </Link>

        <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>

          {/* Left — Image Carousel */}
          <div className='space-y-3'>

            {/* Main Image */}
            <div className='relative w-full aspect-video bg-white rounded-2xl overflow-hidden shadow-sm group'>

              {car.images && car.images[selectedImage] ? (
                <img
                  src={car.images[selectedImage]}
                  alt={`${car.brand} ${car.model}`}
                  className={`w-full h-full object-cover transition-opacity duration-200 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}
                />
              ) : (
                <div className='w-full h-full bg-[#eaecf5] flex items-center justify-center'>
                  <svg className='w-16 h-16 text-gray-300' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={1} d='M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z' />
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={1} d='M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10l2-2h8z' />
                  </svg>
                </div>
              )}

              {/* Navigation Arrows */}
              {hasMultipleImages && (
                <>
                  <button
                    onClick={prevImage}
                    className='absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white bg-opacity-90 hover:bg-opacity-100 rounded-full shadow-md flex items-center justify-center transition-all duration-200 opacity-0 group-hover:opacity-100 hover:scale-110'
                  >
                    <svg className='w-4 h-4 text-gray-700' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15 19l-7-7 7-7' />
                    </svg>
                  </button>
                  <button
                    onClick={nextImage}
                    className='absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white bg-opacity-90 hover:bg-opacity-100 rounded-full shadow-md flex items-center justify-center transition-all duration-200 opacity-0 group-hover:opacity-100 hover:scale-110'
                  >
                    <svg className='w-4 h-4 text-gray-700' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 5l7 7-7 7' />
                    </svg>
                  </button>
                </>
              )}

              {/* Image counter */}
              {hasMultipleImages && (
                <div className='absolute bottom-3 right-3 bg-black bg-opacity-50 text-white text-xs px-2.5 py-1 rounded-full font-medium backdrop-blur-sm'>
                  {selectedImage + 1} / {car.images.length}
                </div>
              )}

              {/* Dot indicators */}
              {hasMultipleImages && (
                <div className='absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5'>
                  {car.images.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => changeImage(i)}
                      className={`rounded-full transition-all duration-300 ${
                        selectedImage === i
                          ? 'w-5 h-2 bg-white'
                          : 'w-2 h-2 bg-white bg-opacity-50 hover:bg-opacity-75'
                      }`}
                    />
                  ))}
                </div>
              )}

              {/* Availability badge */}
              <div className='absolute top-3 left-3'>
                <span className={`text-xs px-2.5 py-1 rounded-full font-semibold backdrop-blur-sm ${
                  car.available
                    ? 'bg-green-100 bg-opacity-90 text-green-700'
                    : 'bg-red-100 bg-opacity-90 text-red-600'
                }`}>
                  {car.available ? '✅ Available' : '❌ Booked'}
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
                        ? 'border-blue-600 shadow-md shadow-blue-200'
                        : 'border-transparent opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt='' className='w-full h-full object-cover' />
                  </button>
                ))}
              </div>
            )}

            {/* Mobile swipe hint */}
            {hasMultipleImages && (
              <p className='text-xs text-gray-400 text-center sm:hidden'>
                ← Use arrow keys or tap arrows to navigate →
              </p>
            )}
          </div>

          {/* Right — Info */}
          <div className='space-y-4'>

            {/* Title + Price */}
            <div className='bg-white rounded-2xl shadow-sm p-5'>
              <div className='mb-3'>
                <h1 className='text-2xl sm:text-3xl font-bold text-gray-900'>
                  {car.brand} {car.model}
                </h1>
                <p className='text-gray-400 text-sm mt-1'>{car.year} • {car.type}</p>
              </div>

              <div className='flex items-end justify-between pt-3 border-t border-gray-50'>
                <div>
                  <span className='text-3xl font-black text-blue-600'>${car.pricePerDay}</span>
                  <span className='text-gray-400 text-sm'> /day</span>
                </div>
                {car.images && car.images.length > 1 && (
                  <span className='text-xs text-gray-400 bg-gray-50 px-2.5 py-1 rounded-full'>
                    📸 {car.images.length} photos
                  </span>
                )}
              </div>
            </div>

            {/* Specs */}
            <div className='bg-white rounded-2xl shadow-sm p-5'>
              <h3 className='text-sm font-bold text-gray-900 mb-4'>Specifications</h3>
              <div className='grid grid-cols-2 gap-3'>
                {specs.map((spec, i) => (
                  <div key={i} className='flex items-center gap-3 bg-gray-50 rounded-xl px-3 py-2.5 hover:bg-blue-50 transition-colors'>
                    <span className='text-base'>{spec.icon}</span>
                    <div>
                      <p className='text-xs text-gray-400'>{spec.label}</p>
                      <p className='text-xs font-semibold text-gray-800 capitalize'>{spec.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Description */}
            {car.description && (
              <div className='bg-white rounded-2xl shadow-sm p-5'>
                <h3 className='text-sm font-bold text-gray-900 mb-3'>Description</h3>
                <p className='text-sm text-gray-500 leading-relaxed'>{car.description}</p>
              </div>
            )}

            {/* Book Button */}
            <div className='bg-white rounded-2xl shadow-sm p-5'>
              {car.available ? (
                user ? (
                  <button
                    onClick={() => navigate(`/booking/${car._id}`)}
                    className='w-full bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-semibold py-3.5 rounded-2xl text-sm transition-all duration-300 flex items-center justify-center gap-2'
                  >
                    <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' />
                    </svg>
                    Book Now — ${car.pricePerDay}/day
                  </button>
                ) : (
                  <div className='space-y-3'>
                    <p className='text-xs text-gray-400 text-center'>
                      Sign in to book this car
                    </p>
                    <Link
                      to='/login'
                      className='w-full block text-center bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3.5 rounded-2xl text-sm transition-all duration-300'
                    >
                      Sign In to Book
                    </Link>
                  </div>
                )
              ) : (
                <button
                  disabled
                  className='w-full bg-gray-100 text-gray-400 font-semibold py-3.5 rounded-2xl text-sm cursor-not-allowed'
                >
                  Currently Unavailable
                </button>
              )}

              <p className='text-xs text-gray-400 text-center mt-3'>
                💳 Free cancellation • 🔒 Secure booking
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarDetail;