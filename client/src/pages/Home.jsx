import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';


import { FaSearch, FaCar, FaUsers, FaMapMarkerAlt, FaHeadphones, FaCog, FaGasPump, FaUser, FaArrowRight, FaCalendarAlt, FaTh } from 'react-icons/fa';


import { FaTruck, FaCarSide, FaBus } from 'react-icons/fa';
import { PiVanFill } from 'react-icons/pi';
import { BsFillCarFrontFill } from 'react-icons/bs';
import { GiJeep } from 'react-icons/gi';

import api from '../services/api.js';
import carImg from '../assets/car-rental.png';
import Select from 'react-select';

const Home = () => {
  const [cars, setCars] = useState([]);
  const [totalCars, setTotalCars] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    type: '',
    brand: '',
    model: '',
    price: '',
  });
  const [heroVisible, setHeroVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => setHeroVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const res = await api.get('/cars');
        setTotalCars(res.data.length);
        setCars(res.data.slice(0, 6));
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchCars();
  }, []);

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (filters.type) params.append('type', filters.type);
    if (filters.brand) params.append('brand', filters.brand);
    if (filters.price) params.append('price', filters.price);
    navigate(`/cars?${params.toString()}`);
  };

  
  const typeOptions = [
    { value: '',            label: 'All Types',    Icon: FaTh },
    { value: 'sedan',       label: 'Sedan',        Icon: BsFillCarFrontFill },
    { value: 'suv',         label: 'SUV',          Icon: GiJeep },
    { value: 'truck',       label: 'Truck',        Icon: FaTruck },
    { value: 'van',         label: 'Van',          Icon: PiVanFill },
    { value: 'hatchback',   label: 'Hatchback',    Icon: FaCarSide },
    { value: 'minibus',     label: 'Minibus',      Icon: FaBus },
  ];

  const brandOptions = [
    { value: '', label: 'Any Make' },
    { value: 'Toyota', label: 'Toyota' },
    { value: 'BMW', label: 'BMW' },
    { value: 'Mercedes', label: 'Mercedes' },
    { value: 'Audi', label: 'Audi' },
    { value: 'Honda', label: 'Honda' },
  ];

  const modelOptions = [{ value: '', label: 'Any Model' }];

  const priceOptions = [
    { value: '', label: 'Any Price' },
    { value: '50', label: 'Up to $50/day' },
    { value: '100', label: 'Up to $100/day' },
    { value: '200', label: 'Up to $200/day' },
  ];

  
  const formatOptionLabel = ({ label, Icon }) => (
    <div className="flex items-center gap-2">
      {Icon && <Icon className="w-4 h-4 text-gray-500 flex-shrink-0" />}
      <span>{label}</span>
    </div>
  );

  const selectStyles = {
    control: (base) => ({
      ...base,
      border: 'none',
      boxShadow: 'none',
      background: 'transparent',
      cursor: 'pointer',
      minHeight: '44px',
      '&:hover': { border: 'none' },
    }),
    indicatorSeparator: () => ({ display: 'none' }),
    dropdownIndicator: (base) => ({
      ...base,
      color: '#94a3b8',
      padding: '0 8px',
      '&:hover': { color: '#2563eb' },
    }),
    menu: (base) => ({
      ...base,
      borderRadius: '14px',
      boxShadow: '0 8px 32px rgba(0,0,0,0.10)',
      border: '1px solid #e2e8f0',
      overflow: 'visible',
      marginTop: '6px',
      zIndex: 999,
      animation: 'selectFadeSlide 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards',
    }),
    menuList: (base) => ({
      ...base,
      padding: '6px',
      maxHeight: '160px',
      overflowY: 'auto',
      borderRadius: '14px',
    }),
    option: (base, state) => ({
      ...base,
      borderRadius: '8px',
      fontSize: '13px',
      padding: '9px 12px',
      cursor: 'pointer',
      backgroundColor: state.isSelected
        ? '#2563eb'
        : state.isFocused
          ? '#eff6ff'
          : 'white',
      color: state.isSelected ? 'white' : '#374151',
      fontWeight: state.isSelected ? '600' : '400',
      '&:active': { backgroundColor: '#dbeafe' },
    }),
    singleValue: (base) => ({
      ...base,
      fontSize: '13px',
      color: '#1e293b',
      fontWeight: '500',
    }),
    placeholder: (base) => ({
      ...base,
      fontSize: '13px',
      color: '#94a3b8',
    }),
    valueContainer: (base) => ({
      ...base,
      padding: '0 10px',
    }),
  };

  const mobileSelectStyles = {
    ...selectStyles,
    control: (base) => ({
      ...base,
      border: 'none',
      boxShadow: 'none',
      background: 'transparent',
      minHeight: '36px',
      cursor: 'pointer',
      '&:hover': { border: 'none' },
    }),
  };

  return (
    <div className='min-h-screen bg-slate-50'>
      <style>{`
        @keyframes selectFadeSlide {
          from { opacity: 0; transform: translateY(-6px) scale(0.98); }
          to   { opacity: 1; transform: translateY(0)   scale(1);    }
        }
        [class*="-MenuList"]::-webkit-scrollbar { width: 4px; }
        [class*="-MenuList"]::-webkit-scrollbar-track { background: transparent; }
        [class*="-MenuList"]::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 99px; }
        [class*="-MenuList"]::-webkit-scrollbar-thumb:hover { background: #2563eb; }
      `}</style>

      {}
      <section className='relative flex flex-col items-center text-center px-4 pt-16 pb-0 bg-gradient-to-b from-slate-100 to-slate-50 overflow-hidden sm:min-h-screen overflow-x-hidden'>

      {/* <section className='relative flex flex-col items-center text-center px-4 pt-16 pb-0 bg-gradient-to-b from-slate-100 to-slate-50 overflow-hidden sm:min-h-screen'> */}
        <motion.div
          className='absolute inset-0 pointer-events-none overflow-hidden'
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            className='absolute -top-20 -right-20 w-96 h-96 bg-blue-100 rounded-full opacity-40 blur-3xl'
            animate={{ scale: [1, 1.05, 1], x: [0, -10, 0] }}
            transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className='absolute top-1/2 -left-24 w-72 h-72 bg-indigo-100 rounded-full opacity-30 blur-3xl'
            animate={{ scale: [1, 1.08, 1], y: [0, 15, 0] }}
            transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
          />
        </motion.div>

        <div className='absolute z-10 inset-0 bg-gradient-to-b from-[#eaecf5] via-[#eaecf5]/70 to-transparent pointer-events-none' />

        {}
        <motion.div
          className='relative z-20 mb-4'
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: heroVisible ? 1 : 0, y: heroVisible ? 0 : -10 }}
          transition={{ duration: 0.5 }}
        >
          <span className='inline-flex items-center gap-1.5 bg-blue-50 border border-blue-100 text-blue-600 text-xs font-semibold px-3 py-1.5 rounded-full'>
            <motion.span
              className='w-1.5 h-1.5 rounded-full bg-blue-500 inline-block'
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
            {totalCars !== null ? `${totalCars}+ Cars Available Now` : 'Cars Available Now'}
          </span>
        </motion.div>

        {}
        <motion.h1
          className='relative z-20 text-4xl sm:text-5xl md:text-6xl font-extrabold text-slate-900 mb-3 leading-tight tracking-tight max-w-2xl'
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: heroVisible ? 1 : 0, y: heroVisible ? 0 : -16 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          Find Your{' '}
          <span className='text-blue-600 relative'>
            Dream Car
            <motion.svg
              className='absolute -bottom-1 left-0 w-full'
              viewBox='0 0 200 8'
              fill='none'
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: heroVisible ? 1 : 0, opacity: heroVisible ? 1 : 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              <path d='M1 5.5 Q100 1 199 5.5' stroke='#bfdbfe' strokeWidth='3' strokeLinecap='round' />
            </motion.svg>
          </span>
        </motion.h1>

        {}
        <motion.p
          className='relative z-20 text-slate-400 text-sm sm:text-base mb-8 max-w-md'
          initial={{ opacity: 0 }}
          animate={{ opacity: heroVisible ? 1 : 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          Browse, filter, and book the perfect car — all in one place.
        </motion.p>

        {}
        <motion.div
          className='relative z-30 bg-white rounded-2xl shadow-md w-full max-w-3xl'
          initial={{ opacity: 0, y: 20, scale: 0.97 }}
          animate={{ opacity: heroVisible ? 1 : 0, y: heroVisible ? 0 : 20, scale: heroVisible ? 1 : 0.97 }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          {}
          <div className='flex flex-col sm:hidden divide-y divide-gray-100'>
            <div className='flex items-center px-4 py-2.5'>
              <span className='text-xs text-gray-400 w-14 flex-shrink-0'>Type</span>
              <div className='flex-1'>
                <Select
                  options={typeOptions}
                  styles={mobileSelectStyles}
                  placeholder='All Types'
                  formatOptionLabel={formatOptionLabel}
                  onChange={(opt) => setFilters({ ...filters, type: opt?.value || '' })}
                />
              </div>
            </div>
            <div className='flex items-center px-4 py-2.5'>
              <span className='text-xs text-gray-400 w-14 flex-shrink-0'>Make</span>
              <div className='flex-1'>
                <Select
                  options={brandOptions}
                  styles={mobileSelectStyles}
                  placeholder='Any Make'
                  onChange={(opt) => setFilters({ ...filters, brand: opt?.value || '' })}
                />
              </div>
            </div>
            <div className='flex items-center px-4 py-2.5'>
              <span className='text-xs text-gray-400 w-14 flex-shrink-0'>Model</span>
              <div className='flex-1'>
                <Select
                  options={modelOptions}
                  styles={mobileSelectStyles}
                  placeholder='Any Model'
                  onChange={(opt) => setFilters({ ...filters, model: opt?.value || '' })}
                />
              </div>
            </div>
            <div className='flex items-center px-4 py-2.5'>
              <span className='text-xs text-gray-400 w-14 flex-shrink-0'>Price</span>
              <div className='flex-1'>
                <Select
                  options={priceOptions}
                  styles={mobileSelectStyles}
                  placeholder='Any Price'
                  onChange={(opt) => setFilters({ ...filters, price: opt?.value || '' })}
                />
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSearch}
              className='w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white rounded-b-2xl py-3 text-sm font-semibold transition-all duration-200 flex items-center justify-center gap-2'
            >
              <FaSearch className='w-4 h-4' />
              Search Cars
            </motion.button>
          </div>

          {}
          <div className='hidden sm:flex items-center px-2 py-2'>
            <div className='flex-1'>
              <Select
                options={typeOptions}
                styles={selectStyles}
                placeholder='All Types'
                formatOptionLabel={formatOptionLabel}
                onChange={(opt) => setFilters({ ...filters, type: opt?.value || '' })}
              />
            </div>
            <div className='w-px h-5 bg-gray-200 flex-shrink-0' />
            <div className='flex-1'>
              <Select
                options={brandOptions}
                styles={selectStyles}
                placeholder='Any Make'
                onChange={(opt) => setFilters({ ...filters, brand: opt?.value || '' })}
              />
            </div>
            <div className='w-px h-5 bg-gray-200 flex-shrink-0' />
            <div className='flex-1'>
              <Select
                options={modelOptions}
                styles={selectStyles}
                placeholder='Any Model'
                onChange={(opt) => setFilters({ ...filters, model: opt?.value || '' })}
              />
            </div>
            <div className='w-px h-5 bg-gray-200 flex-shrink-0' />
            <div className='flex-1'>
              <Select
                options={priceOptions}
                styles={selectStyles}
                placeholder='Any Price'
                onChange={(opt) => setFilters({ ...filters, price: opt?.value || '' })}
              />
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSearch}
              className='bg-blue-600 hover:bg-blue-700 text-white rounded-full w-11 h-11 flex items-center justify-center transition-all duration-200 flex-shrink-0 ml-2 mr-1'
            >
              <FaSearch className='w-4 h-4' />
            </motion.button>
          </div>
        </motion.div>

        {}
        <motion.div
          className='relative z-0 w-full max-w-xs mx-auto mt-6 sm:absolute sm:bottom-0 sm:left-0 sm:right-0 sm:max-w-xl sm:mx-auto md:max-w-2xl lg:max-w-3xl sm:mt-0'
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: heroVisible ? 1 : 0, y: heroVisible ? 0 : 50 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <motion.img
            src={carImg}
            alt='Dream Car'
            className='w-full object-contain object-bottom drop-shadow-2xl'
            // animate={{ y: [0, -5, 0] }}
            animate={{ y: [0, -3, 0] }}

            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          />
        </motion.div>
      </section>

      {}
      <motion.section
        className='bg-white border-y border-slate-100 py-8 px-4'
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6 }}
      >
        <div className='max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4'>
          {[
            { number: totalCars !== null ? `${totalCars}+` : '...', label: 'Cars Available', icon: FaCar },
            { number: '10K+', label: 'Happy Customers', icon: FaUsers },
            { number: '50+', label: 'Cities Covered', icon: FaMapMarkerAlt },
            { number: '24/7', label: 'Support', icon: FaHeadphones },
          ].map((stat, i) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={i}
                className='text-center py-2 group cursor-default'
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.4 }}
                whileHover={{ scale: 1.05 }}
              >
                <div className='inline-flex p-2 bg-blue-50 rounded-xl mb-2'>
                  <Icon className='w-4 h-4 text-blue-600' />
                </div>
                <p className='text-2xl sm:text-3xl font-bold text-blue-600 mb-0.5 group-hover:scale-110 transition-transform duration-300'>
                  {stat.number}
                </p>
                <p className='text-slate-400 text-xs uppercase tracking-widest font-medium'>
                  {stat.label}
                </p>
              </motion.div>
            );
          })}
        </div>
      </motion.section>

      {}
      <section className='py-16 px-4 max-w-6xl mx-auto'>
        <motion.div
          className='flex items-end justify-between mb-8'
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div>
            <p className='text-blue-600 uppercase tracking-widest text-xs font-bold mb-1'>Our Fleet</p>
            <h2 className='text-2xl sm:text-3xl font-bold text-slate-900'>Featured Cars</h2>
          </div>
          <Link to='/cars' className='text-blue-600 hover:text-blue-700 text-sm font-semibold flex items-center gap-1 group'>
            View All
            <span className='group-hover:translate-x-0.5 transition-transform duration-200'>→</span>
          </Link>
        </motion.div>

        {loading ? (
          <motion.div className='flex justify-center items-center h-40' initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <motion.div
              className='w-9 h-9 border-[3px] border-blue-600 border-t-transparent rounded-full'
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            />
          </motion.div>
        ) : cars.length === 0 ? (
          <motion.div className='text-center text-slate-400 py-20' initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <FaCar className='w-12 h-12 mx-auto mb-3 text-slate-300' />
            <p className='text-lg'>No cars available yet.</p>
          </motion.div>
        ) : (
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
            {cars.map((car, i) => (
              <motion.div
                key={car._id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07, duration: 0.4 }}
                whileHover={{ y: -4 }}
              >
                <Link
                  to={`/cars/${car._id}`}
                  className='group bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col'
                >
                  <div className='w-full aspect-[16/10] bg-slate-100 flex items-center justify-center overflow-hidden'>
                    {car.images?.[0] ? (
                      <img
                        src={car.images[0]}
                        alt={`${car.brand} ${car.model}`}
                        className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-500'
                      />
                    ) : (
                      <div className='text-slate-300 text-center'>
                        <FaCar className='w-10 h-10 mx-auto mb-1' />
                        <p className='text-xs'>No Image</p>
                      </div>
                    )}
                  </div>
                  <div className='p-4 flex flex-col flex-1'>
                    <div className='flex items-start justify-between mb-3'>
                      <div>
                        <h3 className='text-sm font-semibold text-slate-900'>{car.brand} {car.model}</h3>
                        <p className='text-slate-400 text-xs mt-0.5'>{car.year} · {car.type}</p>
                      </div>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium flex-shrink-0 ${car.available ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-500'}`}>
                        {car.available ? 'Available' : 'Booked'}
                      </span>
                    </div>
                    <div className='grid grid-cols-2 gap-1.5 mb-4'>
                      {[
                        { icon: FaCog, label: car.transmission },
                        { icon: FaGasPump, label: car.fuel },
                        { icon: FaUser, label: `${car.seats} seats` },
                        { icon: FaMapMarkerAlt, label: car.location },
                      ].map((item, j) => {
                        const Icon = item.icon;
                        return (
                          <span key={j} className='text-xs text-slate-400 flex items-center gap-1'>
                            <Icon className='w-3 h-3' />
                            {item.label}
                          </span>
                        );
                      })}
                    </div>
                    <div className='flex items-center justify-between mt-auto pt-3 border-t border-slate-50'>
                      <div>
                        <span className='text-lg font-bold text-blue-600'>${car.pricePerDay}</span>
                        <span className='text-slate-400 text-xs'>/day</span>
                      </div>
                      <span className='text-xs font-semibold text-slate-400 group-hover:text-blue-600 transition-colors flex items-center gap-1'>
                        View Details
                        <span className='group-hover:translate-x-0.5 transition-transform duration-200'>→</span>
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </section>

      {}
      <motion.section
        className='py-16 px-4 bg-white border-y border-slate-100'
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <div className='max-w-5xl mx-auto text-center mb-12'>
          <motion.p
            className='text-blue-600 uppercase tracking-widest text-xs font-bold mb-2'
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
          >
            Simple Process
          </motion.p>
          <motion.h2
            className='text-2xl sm:text-3xl font-bold text-slate-900'
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            How It Works
          </motion.h2>
        </div>
        <div className='max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-8 relative'>
          <div className='hidden sm:block absolute top-6 left-[calc(16.66%+1rem)] right-[calc(16.66%+1rem)] h-px bg-slate-100' />
          {[
            { step: '01', title: 'Choose a Car', desc: 'Browse our fleet and pick the perfect car for your journey.', icon: FaCar },
            { step: '02', title: 'Book Online', desc: 'Select your dates and location and confirm your booking instantly.', icon: FaCalendarAlt },
            { step: '03', title: 'Hit the Road', desc: "Pick up your car and enjoy the ride. Return it when you're done.", icon: FaArrowRight },
          ].map((item, i) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={i}
                className='text-center group'
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, duration: 0.5 }}
                whileHover={{ y: -2 }}
              >
                <motion.div
                  className='w-12 h-12 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-600 group-hover:border-blue-600 transition-all duration-300 relative z-10'
                  whileHover={{ scale: 1.05 }}
                >
                  <Icon className='w-5 h-5 text-blue-600 group-hover:text-white transition-colors duration-300' />
                </motion.div>
                <h3 className='text-sm font-semibold text-slate-800 mb-2'>{item.title}</h3>
                <p className='text-slate-400 text-xs leading-relaxed max-w-[200px] mx-auto'>{item.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </motion.section>

      {}
      <motion.section
        className='py-16 px-4'
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <div className='max-w-xl mx-auto text-center'>
          <motion.p
            className='text-blue-600 uppercase tracking-widest text-xs font-bold mb-3'
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
          >
            Get Started
          </motion.p>
          <motion.h2
            className='text-2xl sm:text-3xl font-bold text-slate-900 mb-3'
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            Ready to Drive?
          </motion.h2>
          <motion.p
            className='text-slate-400 text-sm mb-8 leading-relaxed'
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            Join thousands of happy customers. Sign up today and get your first rental at a special rate.
          </motion.p>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link
              to='/register'
              className='inline-flex items-center gap-2 px-7 py-3 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-semibold text-sm rounded-xl transition-all duration-200 shadow-lg shadow-blue-200 hover:shadow-blue-300'
            >
              Get Started Now
              <FaArrowRight className='w-4 h-4' />
            </Link>
          </motion.div>
        </div>
      </motion.section>
    </div>
  );
};

export default Home;