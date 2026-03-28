





















































































































































































































































































































































































































































































































































































































import { useEffect, useState, useCallback } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiSearch, FiX, FiFilter, FiChevronLeft, FiChevronRight,
  FiMapPin, FiSettings, FiDroplet, FiUsers,
} from 'react-icons/fi';
import api from '../services/api.js';
import Select from 'react-select';

const CARS_PER_PAGE = 9;

const Cars = () => {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
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
    { value: '', label: 'Any Make' },
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
    { value: '', label: 'Any Price' },
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
      border: `1.5px solid ${state.isFocused ? '#3b82f6' : '#e5e7eb'}`,
      boxShadow: state.isFocused ? '0 0 0 3px rgba(59,130,246,0.08)' : 'none',
      background: 'white',
      minHeight: '42px',
      cursor: 'pointer',
      borderRadius: '12px',
      transition: 'all 0.2s ease',
      '&:hover': { borderColor: '#93c5fd' },
    }),
    indicatorSeparator: () => ({ display: 'none' }),
    dropdownIndicator: (base, state) => ({
      ...base,
      color: state.isFocused ? '#3b82f6' : '#9ca3af',
      padding: '0 8px',
      transition: 'transform 0.2s ease',
      transform: state.selectProps.menuIsOpen ? 'rotate(180deg)' : 'rotate(0deg)',
    }),
    menu: (base) => ({
      ...base,
      borderRadius: '14px',
      boxShadow: '0 16px 48px rgba(0,0,0,0.12)',
      border: '1px solid #f1f5f9',
      overflow: 'hidden',
      marginTop: '6px',
      zIndex: 999,
    }),
    menuList: (base) => ({ ...base, padding: '6px' }),
    option: (base, state) => ({
      ...base,
      borderRadius: '8px',
      fontSize: '13px',
      padding: '9px 12px',
      cursor: 'pointer',
      backgroundColor: state.isSelected ? '#3b82f6' : state.isFocused ? '#eff6ff' : 'white',
      color: state.isSelected ? 'white' : '#374151',
      fontWeight: state.isSelected ? '600' : '400',
    }),
    singleValue: (base) => ({ ...base, fontSize: '13px', color: '#374151', fontWeight: '500' }),
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
        filtered = filtered.filter((c) => c.pricePerDay <= Number(filters.price));
      }
      setCars(filtered);
      setCurrentPage(1);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    const timer = setTimeout(() => fetchCars(), filters.search ? 400 : 0);
    return () => clearTimeout(timer);
  }, [fetchCars, filters.search]);

  useEffect(() => {
    fetchCars();
  }, [filters.type, filters.brand, filters.price, filters.available, filters.transmission, filters.fuel]);

  const clearFilters = () => {
    setFilters({ search: '', type: '', brand: '', price: '', available: '', transmission: '', fuel: '' });
    setCurrentPage(1);
  };

  const activeFiltersCount = Object.entries(filters).filter(([key, v]) => key !== 'search' && v !== '').length;

  // Pagination
  const totalPages = Math.ceil(cars.length / CARS_PER_PAGE);
  const paginatedCars = cars.slice((currentPage - 1) * CARS_PER_PAGE, currentPage * CARS_PER_PAGE);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  const goToPage = (page) => {
    setCurrentPage(page);
    scrollToTop();
  };

  const getPageNumbers = () => {
    if (totalPages <= 5) return Array.from({ length: totalPages }, (_, i) => i + 1);
    if (currentPage <= 3) return [1, 2, 3, 4, '...', totalPages];
    if (currentPage >= totalPages - 2) return [1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    return [1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages];
  };

  const FilterContent = () => (
    <div className='space-y-5'>
      {}
      <div className='grid grid-cols-2 gap-3 lg:grid-cols-1'>
        <div>
          <label className='block text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2'>Type</label>
          <Select
            options={typeOptions} styles={selectStyles} placeholder='All Types'
            value={typeOptions.find((o) => o.value === filters.type) || null}
            onChange={(opt) => setFilters((f) => ({ ...f, type: opt?.value || '' }))}
          />
        </div>
        <div>
          <label className='block text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2'>Brand</label>
          <Select
            options={brandOptions} styles={selectStyles} placeholder='Any Make'
            value={brandOptions.find((o) => o.value === filters.brand) || null}
            onChange={(opt) => setFilters((f) => ({ ...f, brand: opt?.value || '' }))}
          />
        </div>
      </div>

      {/* Price & Availability */}
      <div className='grid grid-cols-2 gap-3 lg:grid-cols-1'>
        <div>
          <label className='block text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2'>Max Price</label>
          <Select
            options={priceOptions} styles={selectStyles} placeholder='Any Price'
            value={priceOptions.find((o) => o.value === filters.price) || null}
            onChange={(opt) => setFilters((f) => ({ ...f, price: opt?.value || '' }))}
          />
        </div>
        <div>
          <label className='block text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2'>Status</label>
          <Select
            options={availabilityOptions} styles={selectStyles} placeholder='All Cars'
            value={availabilityOptions.find((o) => o.value === filters.available) || null}
            onChange={(opt) => setFilters((f) => ({ ...f, available: opt?.value ?? '' }))}
          />
        </div>
      </div>

      {/* Transmission */}
      <div>
        <label className='block text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2'>Transmission</label>
        <div className='flex gap-2'>
          {['automatic', 'manual'].map((t) => (
            <button
              key={t}
              onClick={() => setFilters((f) => ({ ...f, transmission: f.transmission === t ? '' : t }))}
              className={`flex-1 py-2.5 rounded-xl text-xs font-semibold border transition-all duration-200 ${
                filters.transmission === t
                  ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                  : 'bg-gray-50 text-gray-500 border-gray-200 hover:border-blue-300 hover:text-blue-500 hover:bg-blue-50'
              }`}
            >
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Fuel Type */}
      <div>
        <label className='block text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2'>Fuel Type</label>
        <div className='grid grid-cols-4 gap-1.5 lg:grid-cols-2'>
          {[
            { value: 'petrol', label: '⛽', text: 'Petrol' },
            { value: 'diesel', label: '🛢️', text: 'Diesel' },
            { value: 'electric', label: '⚡', text: 'Electric' },
            { value: 'hybrid', label: '🌿', text: 'Hybrid' },
          ].map((f) => (
            <button
              key={f.value}
              onClick={() => setFilters((prev) => ({ ...prev, fuel: prev.fuel === f.value ? '' : f.value }))}
              className={`py-2.5 px-1 rounded-xl text-xs font-semibold border transition-all duration-200 text-center flex flex-col items-center gap-1 ${
                filters.fuel === f.value
                  ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                  : 'bg-gray-50 text-gray-500 border-gray-200 hover:border-blue-300 hover:text-blue-500 hover:bg-blue-50'
              }`}
            >
              <span className='text-base'>{f.label}</span>
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
          Clear All Filters ({activeFiltersCount})
        </button>
      )}
    </div>
  );

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({ opacity: 1, y: 0, transition: { duration: 0.35, delay: i * 0.05, ease: [0.22, 1, 0.36, 1] } }),
  };

  return (
    <div className='min-h-screen bg-[#f0f2f8] pt-20'>

      {/* ── Page Header ─────────────────────────────────────────── */}
      <div className='bg-white border-b border-gray-100 sticky top-16 z-30 shadow-sm'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 py-4'>

          {/* Top row */}
          <div className='flex items-center justify-between mb-3'>
            <div className='flex items-center gap-3'>
              <div>
                <p className='text-blue-600 uppercase tracking-widest text-[10px] font-bold mb-0.5'>Our Fleet</p>
                <h1 className='text-lg sm:text-xl font-extrabold text-gray-900 leading-none'>Browse Cars</h1>
              </div>
              {!loading && (
                <span className='hidden sm:flex items-center gap-1 text-xs text-gray-400 bg-gray-100 px-3 py-1 rounded-full font-medium'>
                  <span className='w-1.5 h-1.5 rounded-full bg-blue-500 inline-block'></span>
                  {cars.length} cars
                </span>
              )}
            </div>

            <div className='flex items-center gap-2'>
              {/* Mobile filter toggle */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`lg:hidden relative flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all duration-200 ${
                  showFilters || activeFiltersCount > 0
                    ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-200'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-blue-300'
                }`}
              >
                <FiFilter className='w-3.5 h-3.5' />
                <span className='hidden xs:block'>Filters</span>
                {activeFiltersCount > 0 && (
                  <span className='absolute -top-1.5 -right-1.5 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-[9px] font-bold'>
                    {activeFiltersCount}
                  </span>
                )}
              </button>

              {(activeFiltersCount > 0 || filters.search) && (
                <button
                  onClick={clearFilters}
                  className='flex items-center gap-1 text-xs text-red-500 font-semibold border border-red-100 bg-red-50 px-3 py-2 rounded-xl hover:bg-red-100 transition-all'
                >
                  <FiX className='w-3 h-3' />
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Search bar */}
          <div className='relative'>
            <FiSearch className='absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none' />
            <input
              type='text'
              placeholder='Search by brand, model, city...'
              value={filters.search}
              onChange={(e) => setFilters((f) => ({ ...f, search: e.target.value }))}
              className='w-full pl-11 pr-10 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm text-gray-800 outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 focus:bg-white placeholder-gray-300 transition-all duration-200'
            />
            {filters.search && (
              <button
                onClick={() => setFilters((f) => ({ ...f, search: '' }))}
                className='absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-300 hover:text-gray-600 transition-colors rounded-full hover:bg-gray-100'
              >
                <FiX className='w-4 h-4' />
              </button>
            )}
          </div>

          {/* Mobile collapsible filters */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className='lg:hidden overflow-hidden'
              >
                <div className='mt-4 bg-gray-50 rounded-2xl p-4 border border-gray-100'>
                  <FilterContent />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* ── Main Content ─────────────────────────────────────────── */}
      <div className='max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8'>
        <div className='flex flex-col lg:flex-row gap-6'>

          {/* ── Sidebar (desktop) ──────────────────────────────── */}
          <aside className='hidden lg:block w-64 flex-shrink-0'>
            <div className='bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sticky top-36'>
              <div className='flex items-center justify-between mb-5'>
                <div className='flex items-center gap-2'>
                  <FiFilter className='w-4 h-4 text-blue-600' />
                  <h3 className='text-sm font-bold text-gray-900'>Filters</h3>
                </div>
                {activeFiltersCount > 0 && (
                  <span className='text-xs bg-blue-600 text-white px-2.5 py-0.5 rounded-full font-bold'>
                    {activeFiltersCount}
                  </span>
                )}
              </div>
              <FilterContent />
            </div>
          </aside>

          {/* ── Cars Grid ──────────────────────────────────────── */}
          <div className='flex-1 min-w-0'>

            {/* Results info */}
            {!loading && (
              <div className='flex items-center justify-between mb-4'>
                <p className='text-sm text-gray-500'>
                  {filters.search
                    ? <span>Results for <span className='font-semibold text-blue-600'>"{filters.search}"</span></span>
                    : <span><span className='font-semibold text-gray-800'>{cars.length}</span> cars found</span>
                  }
                </p>
                {totalPages > 1 && (
                  <p className='text-xs text-gray-400'>
                    Page <span className='font-semibold text-gray-600'>{currentPage}</span> of {totalPages}
                  </p>
                )}
              </div>
            )}

            {/* Loading skeleton */}
            {loading ? (
              <div className='grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4'>
                {[...Array(6)].map((_, i) => (
                  <div key={i} className='bg-white rounded-2xl overflow-hidden animate-pulse border border-gray-100'>
                    <div className='w-full aspect-video bg-gradient-to-r from-gray-100 via-gray-50 to-gray-100' />
                    <div className='p-4 space-y-3'>
                      <div className='h-4 bg-gray-100 rounded-full w-3/4' />
                      <div className='h-3 bg-gray-100 rounded-full w-1/2' />
                      <div className='grid grid-cols-2 gap-2'>
                        <div className='h-3 bg-gray-100 rounded-full' />
                        <div className='h-3 bg-gray-100 rounded-full' />
                      </div>
                      <div className='h-8 bg-gray-100 rounded-xl mt-2' />
                    </div>
                  </div>
                ))}
              </div>

            ) : cars.length === 0 ? (
              /* Empty state */
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className='flex flex-col items-center justify-center min-h-[400px] text-center bg-white rounded-2xl border border-gray-100 shadow-sm p-12'
              >
                <div className='w-20 h-20 rounded-full bg-blue-50 flex items-center justify-center mb-5 text-4xl'>
                  🔍
                </div>
                <h3 className='text-gray-800 font-bold text-lg mb-2'>No cars found</h3>
                <p className='text-gray-400 text-sm mb-6 max-w-xs'>
                  {filters.search ? `No results for "${filters.search}". Try a different search.` : 'Try adjusting your filters to find more cars.'}
                </p>
                <button
                  onClick={clearFilters}
                  className='text-sm text-white bg-blue-600 hover:bg-blue-700 font-semibold px-6 py-2.5 rounded-xl transition-colors shadow-sm shadow-blue-200'
                >
                  Clear All Filters
                </button>
              </motion.div>

            ) : (
              <>
                {/* Car cards */}
                <motion.div
                  key={currentPage}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.25 }}
                  className='grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4'
                >
                  {paginatedCars.map((car, i) => (
                    <motion.div key={car._id} custom={i} variants={cardVariants} initial='hidden' animate='visible'>
                      <Link to={`/cars/${car._id}`} className='group block'>
                        <div className='bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden'>

                          {/* Image */}
                          <div className='relative w-full aspect-video bg-[#eaecf5] overflow-hidden'>
                            {car.images?.[0] ? (
                              <img
                                src={car.images[0]}
                                alt={`${car.brand} ${car.model}`}
                                className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-500'
                              />
                            ) : (
                              <div className='w-full h-full flex items-center justify-center'>
                                <svg className='w-12 h-12 text-gray-300' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={1} d='M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0zM1 9l2-2m0 0l8-3 8 3m-8-3v12m-8-7h16' />
                                </svg>
                              </div>
                            )}

                            {/* Availability badge */}
                            <div className='absolute top-3 right-3'>
                              <span className={`text-[11px] px-2.5 py-1 rounded-full font-bold backdrop-blur-sm ${
                                car.available
                                  ? 'bg-green-500/90 text-white'
                                  : 'bg-red-500/90 text-white'
                              }`}>
                                {car.available ? '● Available' : '● Booked'}
                              </span>
                            </div>

                            {/* Price overlay */}
                            <div className='absolute bottom-3 left-3'>
                              <span className='bg-white/95 backdrop-blur-sm text-blue-600 font-black text-sm px-3 py-1 rounded-full shadow-sm'>
                                ${car.pricePerDay}<span className='font-normal text-gray-400 text-xs'>/day</span>
                              </span>
                            </div>
                          </div>

                          {/* Card body */}
                          <div className='p-4'>
                            <div className='flex items-start justify-between gap-2 mb-1'>
                              <h3 className='text-sm font-bold text-gray-900 truncate leading-tight'>
                                {car.brand} {car.model}
                              </h3>
                              <span className='text-[11px] text-gray-400 font-medium whitespace-nowrap shrink-0 bg-gray-50 px-2 py-0.5 rounded-full'>
                                {car.year}
                              </span>
                            </div>

                            <p className='text-xs text-gray-400 capitalize mb-3'>{car.type}</p>

                            {/* Specs grid */}
                            <div className='grid grid-cols-2 gap-y-2 gap-x-3 text-xs text-gray-500 mb-4'>
                              <span className='flex items-center gap-1.5'>
                                <FiSettings className='w-3 h-3 text-gray-400 shrink-0' />
                                <span className='capitalize truncate'>{car.transmission}</span>
                              </span>
                              <span className='flex items-center gap-1.5'>
                                <FiDroplet className='w-3 h-3 text-gray-400 shrink-0' />
                                <span className='capitalize truncate'>{car.fuel}</span>
                              </span>
                              <span className='flex items-center gap-1.5'>
                                <FiUsers className='w-3 h-3 text-gray-400 shrink-0' />
                                <span>{car.seats} seats</span>
                              </span>
                              <span className='flex items-center gap-1.5'>
                                <FiMapPin className='w-3 h-3 text-gray-400 shrink-0' />
                                <span className='truncate'>{car.location}</span>
                              </span>
                            </div>

                            {/* CTA */}
                            <div className={`w-full py-2.5 rounded-xl text-xs font-bold text-center transition-all duration-200 ${
                              car.available
                                ? 'bg-blue-600 text-white group-hover:bg-blue-700 shadow-sm shadow-blue-200'
                                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            }`}>
                              {car.available ? 'View Details →' : 'Not Available'}
                            </div>
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </motion.div>

                {/* ── Pagination ──────────────────────────────── */}
                {totalPages > 1 && (
                  <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className='mt-8 flex items-center justify-center gap-1.5'
                  >
                    {/* Prev */}
                    <button
                      onClick={() => goToPage(currentPage - 1)}
                      disabled={currentPage === 1}
                      className='flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold border transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed bg-white border-gray-200 text-gray-600 hover:border-blue-300 hover:text-blue-600 hover:bg-blue-50 disabled:hover:bg-white disabled:hover:border-gray-200 disabled:hover:text-gray-600'
                    >
                      <FiChevronLeft className='w-3.5 h-3.5' />
                      <span className='hidden sm:block'>Prev</span>
                    </button>

                    {/* Page numbers */}
                    <div className='flex items-center gap-1'>
                      {getPageNumbers().map((page, idx) =>
                        page === '...' ? (
                          <span key={`ellipsis-${idx}`} className='w-9 h-9 flex items-center justify-center text-gray-400 text-sm'>
                            ···
                          </span>
                        ) : (
                          <button
                            key={page}
                            onClick={() => goToPage(page)}
                            className={`w-9 h-9 rounded-xl text-xs font-bold transition-all duration-200 ${
                              currentPage === page
                                ? 'bg-blue-600 text-white shadow-sm shadow-blue-200'
                                : 'bg-white border border-gray-200 text-gray-600 hover:border-blue-300 hover:text-blue-600 hover:bg-blue-50'
                            }`}
                          >
                            {page}
                          </button>
                        )
                      )}
                    </div>

                    {}
                    <button
                      onClick={() => goToPage(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className='flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold border transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed bg-white border-gray-200 text-gray-600 hover:border-blue-300 hover:text-blue-600 hover:bg-blue-50 disabled:hover:bg-white disabled:hover:border-gray-200 disabled:hover:text-gray-600'
                    >
                      <span className='hidden sm:block'>Next</span>
                      <FiChevronRight className='w-3.5 h-3.5' />
                    </button>
                  </motion.div>
                )}

                {}
                {totalPages > 1 && (
                  <p className='text-center text-xs text-gray-400 mt-3'>
                    Showing {(currentPage - 1) * CARS_PER_PAGE + 1}–{Math.min(currentPage * CARS_PER_PAGE, cars.length)} of {cars.length} cars
                  </p>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cars;
