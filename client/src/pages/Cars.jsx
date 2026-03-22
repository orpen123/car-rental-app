// import { useEffect, useState } from 'react';
// import { Link, useSearchParams } from 'react-router-dom';
// import api from '../services/api.js';
// import Select from 'react-select';

// const Cars = () => {
//   const [cars, setCars] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [showFilters, setShowFilters] = useState(false);
//   const [searchParams] = useSearchParams();
//   const [filters, setFilters] = useState({
//     type: searchParams.get('type') || '',
//     brand: searchParams.get('brand') || '',
//     price: searchParams.get('price') || '',
//     available: '',
//     transmission: '',
//     fuel: '',
//   });

//   const typeOptions = [
//     { value: '', label: 'All Types' },
//     { value: 'sedan', label: '🚗 Sedan' },
//     { value: 'suv', label: '🚙 SUV' },
//     { value: 'truck', label: '🚚 Truck' },
//     { value: 'convertible', label: '🏎️ Convertible' },
//     { value: 'van', label: '🚐 Van' },
//     { value: 'coupe', label: '🚘 Coupe' },
//   ];

//   const brandOptions = [
//     { value: '', label: 'Any Makes' },
//     { value: 'Toyota', label: 'Toyota' },
//     { value: 'BMW', label: 'BMW' },
//     { value: 'Mercedes', label: 'Mercedes' },
//     { value: 'Audi', label: 'Audi' },
//     { value: 'Honda', label: 'Honda' },
//     { value: 'Peugeot', label: 'Peugeot' },
//     { value: 'Dacia', label: 'Dacia' },
//     { value: 'Hyundai', label: 'Hyundai' },
//     { value: 'Renault', label: 'Renault' },
//     { value: 'Ford', label: 'Ford' },
//     { value: 'Tesla', label: 'Tesla' },
//   ];

//   const priceOptions = [
//     { value: '', label: 'All Prices' },
//     { value: '50', label: 'Up to $50/day' },
//     { value: '100', label: 'Up to $100/day' },
//     { value: '200', label: 'Up to $200/day' },
//   ];

//   const availabilityOptions = [
//     { value: '', label: 'All Cars' },
//     { value: 'true', label: '✅ Available' },
//     { value: 'false', label: '❌ Booked' },
//   ];

//   const selectStyles = {
//     control: (base, state) => ({
//       ...base,
//       border: `1px solid ${state.isFocused ? '#3b82f6' : '#e5e7eb'}`,
//       boxShadow: state.isFocused ? '0 0 0 3px rgba(59,130,246,0.1)' : 'none',
//       background: 'white',
//       minHeight: '40px',
//       cursor: 'pointer',
//       borderRadius: '12px',
//       transition: 'all 0.2s ease',
//       '&:hover': { borderColor: '#3b82f6' },
//     }),
//     indicatorSeparator: () => ({ display: 'none' }),
//     dropdownIndicator: (base, state) => ({
//       ...base,
//       color: state.isFocused ? '#3b82f6' : '#9ca3af',
//       padding: '0 8px',
//       transition: 'all 0.2s ease',
//       transform: state.selectProps.menuIsOpen ? 'rotate(180deg)' : 'rotate(0deg)',
//     }),
//     menu: (base) => ({
//       ...base,
//       borderRadius: '16px',
//       boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
//       border: '1px solid #f1f5f9',
//       overflow: 'hidden',
//       marginTop: '6px',
//       zIndex: 999,
//       animation: 'selectSlideDown 0.2s ease-out forwards',
//     }),
//     menuList: (base) => ({ ...base, padding: '6px' }),
//     option: (base, state) => ({
//       ...base,
//       borderRadius: '10px',
//       fontSize: '13px',
//       padding: '9px 12px',
//       cursor: 'pointer',
//       backgroundColor: state.isSelected ? '#3b82f6' : state.isFocused ? '#eff6ff' : 'white',
//       color: state.isSelected ? 'white' : '#374151',
//       fontWeight: state.isSelected ? '600' : '400',
//       transition: 'all 0.15s ease',
//     }),
//     singleValue: (base) => ({ ...base, fontSize: '13px', color: '#374151', fontWeight: '500' }),
//     placeholder: (base) => ({ ...base, fontSize: '13px', color: '#9ca3af' }),
//     valueContainer: (base) => ({ ...base, padding: '0 10px' }),
//   };

//   useEffect(() => {
//     const fetchCars = async () => {
//       setLoading(true);
//       try {
//         const res = await api.get('/cars');
//         let filtered = res.data;
//         if (filters.type) filtered = filtered.filter(c => c.type === filters.type);
//         if (filters.brand) filtered = filtered.filter(c => c.brand === filters.brand);
//         if (filters.price) filtered = filtered.filter(c => c.pricePerDay <= Number(filters.price));
//         if (filters.available !== '' && filters.available !== undefined)
//           filtered = filtered.filter(c => String(c.available) === filters.available);
//         if (filters.transmission)
//           filtered = filtered.filter(c => c.transmission === filters.transmission);
//         if (filters.fuel)
//           filtered = filtered.filter(c => c.fuel === filters.fuel);
//         setCars(filtered);
//       } catch (error) {
//         console.error(error);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchCars();
//   }, [filters]);

//   const clearFilters = () => {
//     setFilters({ type: '', brand: '', price: '', available: '', transmission: '', fuel: '' });
//   };

//   const activeFiltersCount = Object.values(filters).filter(v => v !== '').length;

//   const FilterContent = () => (
//     <div className='space-y-4'>
//       {/* Type + Brand — row on mobile */}
//       <div className='grid grid-cols-2 gap-3 lg:grid-cols-1'>
//         <div>
//           <label className='block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5'>Type</label>
//           <Select
//             options={typeOptions}
//             styles={selectStyles}
//             placeholder='All Types'
//             value={typeOptions.find(o => o.value === filters.type) || null}
//             onChange={(opt) => setFilters({ ...filters, type: opt?.value || '' })}
//           />
//         </div>
//         <div>
//           <label className='block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5'>Brand</label>
//           <Select
//             options={brandOptions}
//             styles={selectStyles}
//             placeholder='Any Makes'
//             value={brandOptions.find(o => o.value === filters.brand) || null}
//             onChange={(opt) => setFilters({ ...filters, brand: opt?.value || '' })}
//           />
//         </div>
//       </div>

//       {/* Price + Availability — row on mobile */}
//       <div className='grid grid-cols-2 gap-3 lg:grid-cols-1'>
//         <div>
//           <label className='block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5'>Max Price</label>
//           <Select
//             options={priceOptions}
//             styles={selectStyles}
//             placeholder='All Prices'
//             value={priceOptions.find(o => o.value === filters.price) || null}
//             onChange={(opt) => setFilters({ ...filters, price: opt?.value || '' })}
//           />
//         </div>
//         <div>
//           <label className='block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5'>Availability</label>
//           <Select
//             options={availabilityOptions}
//             styles={selectStyles}
//             placeholder='All Cars'
//             value={availabilityOptions.find(o => o.value === filters.available) || null}
//             onChange={(opt) => setFilters({ ...filters, available: opt?.value ?? '' })}
//           />
//         </div>
//       </div>

//       {/* Transmission */}
//       <div>
//         <label className='block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5'>Transmission</label>
//         <div className='flex gap-2'>
//           {['automatic', 'manual'].map((t) => (
//             <button
//               key={t}
//               onClick={() => setFilters({ ...filters, transmission: filters.transmission === t ? '' : t })}
//               className={`flex-1 py-2 rounded-xl text-xs font-semibold border transition-all duration-200 ${
//                 filters.transmission === t
//                   ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
//                   : 'bg-white text-gray-500 border-gray-200 hover:border-blue-300 hover:text-blue-500'
//               }`}
//             >
//               {t.charAt(0).toUpperCase() + t.slice(1)}
//             </button>
//           ))}
//         </div>
//       </div>

//       {/* Fuel */}
//       <div>
//         <label className='block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5'>Fuel Type</label>
//         <div className='grid grid-cols-4 gap-1.5 lg:grid-cols-2'>
//           {[
//             { value: 'petrol', label: '⛽', text: 'Petrol' },
//             { value: 'diesel', label: '🛢️', text: 'Diesel' },
//             { value: 'electric', label: '⚡', text: 'Electric' },
//             { value: 'hybrid', label: '🌿', text: 'Hybrid' },
//           ].map((f) => (
//             <button
//               key={f.value}
//               onClick={() => setFilters({ ...filters, fuel: filters.fuel === f.value ? '' : f.value })}
//               className={`py-2 px-1 rounded-xl text-xs font-semibold border transition-all duration-200 text-center flex flex-col items-center gap-0.5 ${
//                 filters.fuel === f.value
//                   ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
//                   : 'bg-white text-gray-500 border-gray-200 hover:border-blue-300 hover:text-blue-500'
//               }`}
//             >
//               <span>{f.label}</span>
//               <span>{f.text}</span>
//             </button>
//           ))}
//         </div>
//       </div>

//       {/* Clear */}
//       {activeFiltersCount > 0 && (
//         <button
//           onClick={clearFilters}
//           className='w-full py-2.5 rounded-xl text-xs font-semibold text-red-500 border border-red-100 bg-red-50 hover:bg-red-100 transition-all'
//         >
//           Clear All ({activeFiltersCount})
//         </button>
//       )}
//     </div>
//   );

//   return (
//     <div className='min-h-screen bg-[#eaecf5] pt-20'>

//       {/* Header */}
//       <div className='bg-white border-b border-gray-100'>
//         <div className='max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-6'>
//           <div className='flex items-center justify-between'>
//             <div>
//               <p className='text-blue-600 uppercase tracking-widest text-xs font-semibold mb-0.5'>Our Fleet</p>
//               <h1 className='text-xl sm:text-3xl font-bold text-gray-900'>Browse Cars</h1>
//             </div>
//             <div className='flex items-center gap-2'>
//               <span className='text-xs text-gray-400 bg-gray-50 px-3 py-1.5 rounded-full hidden sm:block'>
//                 {cars.length} cars found
//               </span>

//               {/* Mobile filter toggle */}
//               <button
//                 onClick={() => setShowFilters(!showFilters)}
//                 className={`lg:hidden flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
//                   showFilters || activeFiltersCount > 0
//                     ? 'bg-blue-600 text-white border-blue-600'
//                     : 'bg-white text-gray-600 border-gray-200'
//                 }`}
//               >
//                 <svg className='w-3.5 h-3.5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
//                   <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 017 21v-7.586L3.293 6.707A1 1 0 013 6V4z' />
//                 </svg>
//                 Filters
//                 {activeFiltersCount > 0 && (
//                   <span className='bg-white text-blue-600 rounded-full w-4 h-4 flex items-center justify-center text-xs font-bold'>
//                     {activeFiltersCount}
//                   </span>
//                 )}
//               </button>

//               {activeFiltersCount > 0 && (
//                 <button
//                   onClick={clearFilters}
//                   className='text-xs text-red-500 font-medium border border-red-100 bg-red-50 px-3 py-1.5 rounded-full transition-all hover:bg-red-100'
//                 >
//                   Clear
//                 </button>
//               )}
//             </div>
//           </div>

//           {/* Mobile filters — collapsible */}
//           <div className={`lg:hidden overflow-hidden transition-all duration-300 ease-in-out ${showFilters ? 'max-h-[600px] opacity-100 mt-4' : 'max-h-0 opacity-0'}`}>
//             <div className='bg-gray-50 rounded-2xl p-4'>
//               <FilterContent />
//             </div>
//           </div>
//         </div>
//       </div>

//       <div className='max-w-7xl mx-auto px-4 sm:px-6 py-6'>
//         <div className='flex flex-col lg:flex-row gap-6'>

//           {/* Sidebar — Desktop only */}
//           <div className='hidden lg:block w-64 flex-shrink-0'>
//             <div className='bg-white rounded-2xl shadow-sm p-5 sticky top-24'>
//               <div className='flex items-center justify-between mb-4'>
//                 <h3 className='text-sm font-bold text-gray-900'>Filters</h3>
//                 {activeFiltersCount > 0 && (
//                   <span className='text-xs bg-blue-600 text-white px-2 py-0.5 rounded-full font-semibold'>
//                     {activeFiltersCount}
//                   </span>
//                 )}
//               </div>
//               <FilterContent />
//             </div>
//           </div>

//           {/* Cars Grid */}
//           <div className='flex-1'>
//             {/* Mobile cars count */}
//             <p className='text-xs text-gray-400 mb-4 lg:hidden'>{cars.length} cars found</p>

//             {loading ? (
//               <div className='flex justify-center items-center h-60'>
//                 <div className='w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin' />
//               </div>
//             ) : cars.length === 0 ? (
//               <div className='flex flex-col items-center justify-center h-60 text-center bg-white rounded-2xl shadow-sm p-10'>
//                 <svg className='w-12 h-12 text-gray-200 mb-3' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
//                   <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={1} d='M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z' />
//                   <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={1} d='M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10l2-2h8z' />
//                 </svg>
//                 <p className='text-gray-400 font-semibold text-sm mb-1'>No cars found</p>
//                 <p className='text-gray-300 text-xs mb-4'>Try adjusting your filters</p>
//                 <button
//                   onClick={clearFilters}
//                   className='text-xs text-white bg-blue-600 hover:bg-blue-700 font-semibold px-5 py-2 rounded-xl transition-colors'
//                 >
//                   Clear Filters
//                 </button>
//               </div>
//             ) : (
//               <div className='grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4'>
//                 {cars.map((car, i) => (
//                   <Link
//                     to={`/cars/${car._id}`}
//                     key={car._id}
//                     className='group'
//                     style={{ animation: `fadeSlideUp 0.5s ease-out ${i * 0.06}s both` }}
//                   >
//                     <div className='bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden hover:-translate-y-1'>

//                       {/* Image */}
//                       <div className='w-full aspect-video bg-[#eaecf5] overflow-hidden rounded-t-2xl relative'>
//                         {car.images && car.images[0] ? (
//                           <img
//                             src={car.images[0]}
//                             alt={`${car.brand} ${car.model}`}
//                             className='w-full h-full object-cover group-hover:scale-110 transition-transform duration-500'
//                           />
//                         ) : (
//                           <div className='w-full h-full flex items-center justify-center text-gray-300'>
//                             <svg className='w-10 h-10' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
//                               <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={1} d='M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z' />
//                             </svg>
//                           </div>
//                         )}
//                         <div className='absolute top-2 right-2'>
//                           <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${car.available ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-500'}`}>
//                             {car.available ? 'Available' : 'Booked'}
//                           </span>
//                         </div>
//                       </div>

//                       {/* Info */}
//                       <div className='p-3 sm:p-4'>
//                         <h3 className='text-xs sm:text-sm font-bold text-gray-900 truncate'>{car.brand} {car.model}</h3>
//                         <p className='text-gray-400 text-xs mt-0.5 mb-2'>{car.year} • {car.type}</p>

//                         <div className='hidden sm:grid grid-cols-2 gap-1 mb-3 text-xs text-gray-400'>
//                           <span>⚙️ {car.transmission}</span>
//                           <span>⛽ {car.fuel}</span>
//                           <span>💺 {car.seats} seats</span>
//                           <span>📍 {car.location}</span>
//                         </div>

//                         <div className='flex items-center justify-between pt-2 border-t border-gray-50'>
//                           <div>
//                             <span className='text-base sm:text-lg font-black text-blue-600'>${car.pricePerDay}</span>
//                             <span className='text-gray-400 text-xs'>/day</span>
//                           </div>
//                           <span className='text-xs text-gray-400 group-hover:text-blue-600 transition-colors font-semibold flex items-center gap-0.5'>
//                             <span className='hidden sm:block'>Details</span>
//                             <span className='group-hover:translate-x-1 transition-transform duration-200'>→</span>
//                           </span>
//                         </div>
//                       </div>
//                     </div>
//                   </Link>
//                 ))}
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Cars;
import { useEffect, useState, useCallback } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import api from '../services/api.js';
import Select from 'react-select';

const Cars = () => {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [searchParams] = useSearchParams();
  const [filters, setFilters] = useState({
    search: '',
    type: searchParams.get('type') || '',
    brand: searchParams.get('brand') || '',
    price: searchParams.get('price') || '',
    available: '',
    transmission: '',
    fuel: '',
  });

  const typeOptions = [
    { value: '', label: 'All Types' },
    { value: 'sedan', label: '🚗 Sedan' },
    { value: 'suv', label: '🚙 SUV' },
    { value: 'truck', label: '🚚 Truck' },
    { value: 'convertible', label: '🏎️ Convertible' },
    { value: 'van', label: '🚐 Van' },
    { value: 'coupe', label: '🚘 Coupe' },
  ];

  const brandOptions = [
    { value: '', label: 'Any Makes' },
    { value: 'Toyota', label: 'Toyota' },
    { value: 'BMW', label: 'BMW' },
    { value: 'Mercedes', label: 'Mercedes' },
    { value: 'Audi', label: 'Audi' },
    { value: 'Honda', label: 'Honda' },
    { value: 'Peugeot', label: 'Peugeot' },
    { value: 'Dacia', label: 'Dacia' },
    { value: 'Hyundai', label: 'Hyundai' },
    { value: 'Renault', label: 'Renault' },
    { value: 'Ford', label: 'Ford' },
    { value: 'Tesla', label: 'Tesla' },
  ];

  const priceOptions = [
    { value: '', label: 'All Prices' },
    { value: '50', label: 'Up to $50/day' },
    { value: '100', label: 'Up to $100/day' },
    { value: '200', label: 'Up to $200/day' },
  ];

  const availabilityOptions = [
    { value: '', label: 'All Cars' },
    { value: 'true', label: '✅ Available' },
    { value: 'false', label: '❌ Booked' },
  ];

  const selectStyles = {
    control: (base, state) => ({
      ...base,
      border: `1px solid ${state.isFocused ? '#3b82f6' : '#e5e7eb'}`,
      boxShadow: state.isFocused ? '0 0 0 3px rgba(59,130,246,0.1)' : 'none',
      background: 'white',
      minHeight: '40px',
      cursor: 'pointer',
      borderRadius: '12px',
      transition: 'all 0.2s ease',
      '&:hover': { borderColor: '#3b82f6' },
    }),
    indicatorSeparator: () => ({ display: 'none' }),
    dropdownIndicator: (base, state) => ({
      ...base,
      color: state.isFocused ? '#3b82f6' : '#9ca3af',
      padding: '0 8px',
      transition: 'all 0.2s ease',
      transform: state.selectProps.menuIsOpen
        ? 'rotate(180deg)'
        : 'rotate(0deg)',
    }),
    menu: (base) => ({
      ...base,
      borderRadius: '16px',
      boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
      border: '1px solid #f1f5f9',
      overflow: 'hidden',
      marginTop: '6px',
      zIndex: 999,
      animation: 'selectSlideDown 0.2s ease-out forwards',
    }),
    menuList: (base) => ({ ...base, padding: '6px' }),
    option: (base, state) => ({
      ...base,
      borderRadius: '10px',
      fontSize: '13px',
      padding: '9px 12px',
      cursor: 'pointer',
      backgroundColor: state.isSelected
        ? '#3b82f6'
        : state.isFocused
          ? '#eff6ff'
          : 'white',
      color: state.isSelected ? 'white' : '#374151',
      fontWeight: state.isSelected ? '600' : '400',
      transition: 'all 0.15s ease',
    }),
    singleValue: (base) => ({
      ...base,
      fontSize: '13px',
      color: '#374151',
      fontWeight: '500',
    }),
    placeholder: (base) => ({ ...base, fontSize: '13px', color: '#9ca3af' }),
    valueContainer: (base) => ({ ...base, padding: '0 10px' }),
  };

  const fetchCars = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get('/cars', {
        params: {
          search: filters.search || undefined,
          type: filters.type || undefined,
          brand: filters.brand || undefined,
          fuel: filters.fuel || undefined,
          transmission: filters.transmission || undefined,
          available: filters.available || undefined,
        },
      });

      let filtered = res.data;
      if (filters.price) {
        filtered = filtered.filter(
          (c) => c.pricePerDay <= Number(filters.price),
        );
      }

      setCars(filtered);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    const timer = setTimeout(
      () => {
        fetchCars();
      },
      filters.search ? 400 : 0,
    ); // debounce search
    return () => clearTimeout(timer);
  }, [fetchCars, filters.search]);

  useEffect(() => {
    fetchCars();
  }, [
    filters.type,
    filters.brand,
    filters.price,
    filters.available,
    filters.transmission,
    filters.fuel,
  ]);

  const clearFilters = () => {
    setFilters({
      search: '',
      type: '',
      brand: '',
      price: '',
      available: '',
      transmission: '',
      fuel: '',
    });
  };

  const activeFiltersCount = Object.entries(filters).filter(
    ([key, v]) => key !== 'search' && v !== '',
  ).length;

  const FilterContent = () => (
    <div className='space-y-4'>
      <div className='grid grid-cols-2 gap-3 lg:grid-cols-1'>
        <div>
          <label className='block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5'>
            Type
          </label>
          <Select
            options={typeOptions}
            styles={selectStyles}
            placeholder='All Types'
            value={typeOptions.find((o) => o.value === filters.type) || null}
            onChange={(opt) =>
              setFilters((f) => ({ ...f, type: opt?.value || '' }))
            }
          />
        </div>
        <div>
          <label className='block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5'>
            Brand
          </label>
          <Select
            options={brandOptions}
            styles={selectStyles}
            placeholder='Any Makes'
            value={brandOptions.find((o) => o.value === filters.brand) || null}
            onChange={(opt) =>
              setFilters((f) => ({ ...f, brand: opt?.value || '' }))
            }
          />
        </div>
      </div>

      <div className='grid grid-cols-2 gap-3 lg:grid-cols-1'>
        <div>
          <label className='block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5'>
            Max Price
          </label>
          <Select
            options={priceOptions}
            styles={selectStyles}
            placeholder='All Prices'
            value={priceOptions.find((o) => o.value === filters.price) || null}
            onChange={(opt) =>
              setFilters((f) => ({ ...f, price: opt?.value || '' }))
            }
          />
        </div>
        <div>
          <label className='block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5'>
            Availability
          </label>
          <Select
            options={availabilityOptions}
            styles={selectStyles}
            placeholder='All Cars'
            value={
              availabilityOptions.find((o) => o.value === filters.available) ||
              null
            }
            onChange={(opt) =>
              setFilters((f) => ({ ...f, available: opt?.value ?? '' }))
            }
          />
        </div>
      </div>

      <div>
        <label className='block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5'>
          Transmission
        </label>
        <div className='flex gap-2'>
          {['automatic', 'manual'].map((t) => (
            <button
              key={t}
              onClick={() =>
                setFilters((f) => ({
                  ...f,
                  transmission: f.transmission === t ? '' : t,
                }))
              }
              className={`flex-1 py-2 rounded-xl text-xs font-semibold border transition-all duration-200 ${
                filters.transmission === t
                  ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                  : 'bg-white text-gray-500 border-gray-200 hover:border-blue-300 hover:text-blue-500'
              }`}
            >
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className='block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5'>
          Fuel Type
        </label>
        <div className='grid grid-cols-4 gap-1.5 lg:grid-cols-2'>
          {[
            { value: 'petrol', label: '⛽', text: 'Petrol' },
            { value: 'diesel', label: '🛢️', text: 'Diesel' },
            { value: 'electric', label: '⚡', text: 'Electric' },
            { value: 'hybrid', label: '🌿', text: 'Hybrid' },
          ].map((f) => (
            <button
              key={f.value}
              onClick={() =>
                setFilters((prev) => ({
                  ...prev,
                  fuel: prev.fuel === f.value ? '' : f.value,
                }))
              }
              className={`py-2 px-1 rounded-xl text-xs font-semibold border transition-all duration-200 text-center flex flex-col items-center gap-0.5 ${
                filters.fuel === f.value
                  ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                  : 'bg-white text-gray-500 border-gray-200 hover:border-blue-300 hover:text-blue-500'
              }`}
            >
              <span>{f.label}</span>
              <span>{f.text}</span>
            </button>
          ))}
        </div>
      </div>

      {activeFiltersCount > 0 && (
        <button
          onClick={clearFilters}
          className='w-full py-2.5 rounded-xl text-xs font-semibold text-red-500 border border-red-100 bg-red-50 hover:bg-red-100 transition-all'
        >
          Clear All ({activeFiltersCount})
        </button>
      )}
    </div>
  );

  return (
    <div className='min-h-screen bg-[#eaecf5] pt-20'>
      {/* Header */}
      <div className='bg-white border-b border-gray-100'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-5'>
          <div className='flex items-center justify-between mb-4'>
            <div>
              <p className='text-blue-600 uppercase tracking-widest text-xs font-semibold mb-0.5'>
                Our Fleet
              </p>
              <h1 className='text-xl sm:text-2xl font-bold text-gray-900'>
                Browse Cars
              </h1>
            </div>
            <div className='flex items-center gap-2'>
              <span className='text-xs text-gray-400 bg-gray-50 px-3 py-1.5 rounded-full hidden sm:block'>
                {loading ? '...' : `${cars.length} cars`}
              </span>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`lg:hidden flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                  showFilters || activeFiltersCount > 0
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white text-gray-600 border-gray-200'
                }`}
              >
                <svg
                  className='w-3.5 h-3.5'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 017 21v-7.586L3.293 6.707A1 1 0 013 6V4z'
                  />
                </svg>
                Filters
                {activeFiltersCount > 0 && (
                  <span className='bg-white text-blue-600 rounded-full w-4 h-4 flex items-center justify-center text-xs font-bold'>
                    {activeFiltersCount}
                  </span>
                )}
              </button>
              {(activeFiltersCount > 0 || filters.search) && (
                <button
                  onClick={clearFilters}
                  className='text-xs text-red-500 font-medium border border-red-100 bg-red-50 px-3 py-1.5 rounded-full transition-all hover:bg-red-100'
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Search Bar — always visible */}
          <div className='relative'>
            <div className='absolute inset-y-0 left-4 flex items-center pointer-events-none'>
              <svg
                className='w-4 h-4 text-gray-400'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z'
                />
              </svg>
            </div>
            <input
              type='text'
              placeholder='Search by brand, model, city...'
              value={filters.search}
              onChange={(e) =>
                setFilters((f) => ({ ...f, search: e.target.value }))
              }
              className='w-full pl-11 pr-10 py-3 bg-gray-50 border border-gray-100 rounded-2xl text-sm text-gray-800 outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white placeholder-gray-300 transition-all'
            />
            {filters.search && (
              <button
                onClick={() => setFilters((f) => ({ ...f, search: '' }))}
                className='absolute inset-y-0 right-4 flex items-center text-gray-300 hover:text-gray-500 transition-colors'
              >
                <svg
                  className='w-4 h-4'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M6 18L18 6M6 6l12 12'
                  />
                </svg>
              </button>
            )}
          </div>

          {/* Mobile filters collapsible */}
          <div
            className={`lg:hidden overflow-hidden transition-all duration-300 ease-in-out ${showFilters ? 'max-h-[600px] opacity-100 mt-4' : 'max-h-0 opacity-0'}`}
          >
            <div className='bg-gray-50 rounded-2xl p-4'>
              <FilterContent />
            </div>
          </div>
        </div>
      </div>

      <div className='max-w-7xl mx-auto px-4 sm:px-6 py-6'>
        <div className='flex flex-col lg:flex-row gap-6'>
          {/* Sidebar Desktop */}
          <div className='hidden lg:block w-64 flex-shrink-0'>
            <div className='bg-white rounded-2xl shadow-sm p-5 sticky top-24'>
              <div className='flex items-center justify-between mb-4'>
                <h3 className='text-sm font-bold text-gray-900'>Filters</h3>
                {activeFiltersCount > 0 && (
                  <span className='text-xs bg-blue-600 text-white px-2 py-0.5 rounded-full font-semibold'>
                    {activeFiltersCount}
                  </span>
                )}
              </div>
              <FilterContent />
            </div>
          </div>

          {/* Cars Grid */}
          <div className='flex-1'>
            {/* Active search indicator */}
            {filters.search && (
              <div className='flex items-center gap-2 mb-4'>
                <p className='text-xs text-gray-500'>
                  Results for{' '}
                  <span className='font-semibold text-blue-600'>
                    "{filters.search}"
                  </span>
                </p>
                <button
                  onClick={() => setFilters((f) => ({ ...f, search: '' }))}
                  className='text-xs text-gray-400 hover:text-gray-600'
                >
                  ×
                </button>
              </div>
            )}

            <p className='text-xs text-gray-400 mb-4 lg:hidden'>
              {loading ? 'Loading...' : `${cars.length} cars found`}
            </p>

            {loading ? (
              <div className='grid grid-cols-2 sm:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4'>
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className='bg-white rounded-2xl overflow-hidden animate-pulse'
                  >
                    <div className='w-full aspect-video bg-gray-100' />
                    <div className='p-4 space-y-2'>
                      <div className='h-3 bg-gray-100 rounded-full w-3/4' />
                      <div className='h-3 bg-gray-100 rounded-full w-1/2' />
                      <div className='h-3 bg-gray-100 rounded-full w-2/3' />
                    </div>
                  </div>
                ))}
              </div>
            ) : cars.length === 0 ? (
              <div className='flex flex-col items-center justify-center h-60 text-center bg-white rounded-2xl shadow-sm p-10'>
                <p className='text-4xl mb-3'>🔍</p>
                <p className='text-gray-400 font-semibold text-sm mb-1'>
                  No cars found
                </p>
                <p className='text-gray-300 text-xs mb-4'>
                  {filters.search
                    ? `No results for "${filters.search}"`
                    : 'Try adjusting your filters'}
                </p>
                <button
                  onClick={clearFilters}
                  className='text-xs text-white bg-blue-600 hover:bg-blue-700 font-semibold px-5 py-2 rounded-xl transition-colors'
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              <div className='grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4'>
                {cars.map((car, i) => (
                  <Link
                    to={`/cars/${car._id}`}
                    key={car._id}
                    className='group'
                    style={{
                      animation: `fadeSlideUp 0.4s ease-out ${i * 0.05}s both`,
                    }}
                  >
                    <div className='bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden hover:-translate-y-1'>
                      <div className='w-full aspect-video bg-[#eaecf5] overflow-hidden rounded-t-2xl relative'>
                        {car.images && car.images[0] ? (
                          <img
                            src={car.images[0]}
                            alt={`${car.brand} ${car.model}`}
                            className='w-full h-full object-cover group-hover:scale-110 transition-transform duration-500'
                          />
                        ) : (
                          <div className='w-full h-full flex items-center justify-center text-gray-300'>
                            <svg
                              className='w-10 h-10'
                              fill='none'
                              stroke='currentColor'
                              viewBox='0 0 24 24'
                            >
                              <path
                                strokeLinecap='round'
                                strokeLinejoin='round'
                                strokeWidth={1}
                                d='M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z'
                              />
                            </svg>
                          </div>
                        )}
                        <div className='absolute top-2 right-2'>
                          <span
                            className={`text-xs px-2 py-0.5 rounded-full font-semibold ${car.available ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-500'}`}
                          >
                            {car.available ? 'Available' : 'Booked'}
                          </span>
                        </div>
                      </div>

                      <div className='p-3 sm:p-4'>
                        <h3 className='text-xs sm:text-sm font-bold text-gray-900 truncate'>
                          {car.brand} {car.model}
                        </h3>
                        <p className='text-gray-400 text-xs mt-0.5 mb-2'>
                          {car.year} • {car.type}
                        </p>

                        <div className='hidden sm:grid grid-cols-2 gap-1 mb-3 text-xs text-gray-400'>
                          <span>⚙️ {car.transmission}</span>
                          <span>⛽ {car.fuel}</span>
                          <span>💺 {car.seats} seats</span>
                          <span>📍 {car.location}</span>
                        </div>

                        <div className='flex items-center justify-between pt-2 border-t border-gray-50'>
                          <div>
                            <span className='text-base sm:text-lg font-black text-blue-600'>
                              ${car.pricePerDay}
                            </span>
                            <span className='text-gray-400 text-xs'>/day</span>
                          </div>
                          <span className='text-xs text-gray-400 group-hover:text-blue-600 transition-colors font-semibold flex items-center gap-0.5'>
                            <span className='hidden sm:block'>Details</span>
                            <span className='group-hover:translate-x-1 transition-transform duration-200'>
                              →
                            </span>
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cars;
