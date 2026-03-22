import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api.js';
import carImg from '../assets/car-rental.png';
import Select from 'react-select';

const Home = () => {
  const [cars, setCars] = useState([]);
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
  ];

  const modelOptions = [{ value: '', label: 'Any Models' }];

  const priceOptions = [
    { value: '', label: 'All Prices' },
    { value: '50', label: 'Up to $50/day' },
    { value: '100', label: 'Up to $100/day' },
    { value: '200', label: 'Up to $200/day' },
  ];

  const selectStyles = {
    control: (base) => ({
      ...base,
      border: 'none',
      boxShadow: 'none',
      background: 'transparent',
      minHeight: '44px',
      cursor: 'pointer',
      '&:hover': { border: 'none' },
    }),
    indicatorSeparator: () => ({ display: 'none' }),
    dropdownIndicator: (base) => ({
      ...base,
      color: '#9ca3af',
      padding: '0 6px',
      transition: 'color 0.2s',
      '&:hover': { color: '#3b82f6' },
    }),
    menu: (base) => ({
      ...base,
      borderRadius: '16px',
      boxShadow: '0 10px 40px rgba(0,0,0,0.12)',
      border: '1px solid #f1f5f9',
      overflow: 'hidden',
      marginTop: '8px',
      zIndex: 999,
      animation: 'selectSlideDown 0.2s ease-out forwards',
    }),
    menuList: (base) => ({ ...base, padding: '6px' }),
    option: (base, state) => ({
      ...base,
      borderRadius: '10px',
      fontSize: '13px',
      padding: '10px 12px',
      cursor: 'pointer',
      backgroundColor: state.isSelected
        ? '#3b82f6'
        : state.isFocused
          ? '#eff6ff'
          : 'white',
      color: state.isSelected ? 'white' : '#374151',
      fontWeight: state.isSelected ? '600' : '400',
      transition: 'all 0.15s ease',
      '&:active': { backgroundColor: '#dbeafe' },
    }),
    singleValue: (base) => ({
      ...base,
      fontSize: '13px',
      color: '#374151',
      fontWeight: '500',
    }),
    placeholder: (base) => ({
      ...base,
      fontSize: '13px',
      color: '#9ca3af',
    }),
    valueContainer: (base) => ({
      ...base,
      padding: '0 12px',
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
    <div className='min-h-screen bg-[#eaecf5]'>
      {/* Hero Section */}
      {/* Hero Section */}
      <section className='relative flex flex-col items-center text-center px-4 pt-20 pb-0 bg-[#eaecf5] overflow-hidden sm:min-h-screen'>
        {/* Background circles */}
        <div className='absolute inset-0 z-0 overflow-hidden pointer-events-none'>
          <div className='absolute top-20 right-10 w-64 h-64 bg-blue-100 rounded-full opacity-30 blur-3xl animate-pulse' />
          <div className='absolute bottom-40 left-10 w-48 h-48 bg-indigo-100 rounded-full opacity-20 blur-2xl animate-pulse delay-300' />
        </div>

        {/* Gradient overlay */}
        <div className='absolute z-10 inset-0 bg-gradient-to-b from-[#eaecf5] via-[#eaecf5]/70 to-transparent pointer-events-none' />

        {/* Subtitle */}
        <p
          className='relative z-20 text-gray-400 text-xs sm:text-sm mb-2 tracking-wide'
          style={{
            opacity: heroVisible ? 1 : 0,
            transform: heroVisible ? 'translateY(0)' : 'translateY(-15px)',
            transition: 'all 0.6s ease-out',
          }}
        >
          Find cars for sale and for rent near you
        </p>

        {/* Title */}
        <h1
          className='relative z-20 text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-5 leading-tight tracking-tight max-w-2xl'
          style={{
            opacity: heroVisible ? 1 : 0,
            transform: heroVisible ? 'translateY(0)' : 'translateY(-20px)',
            transition: 'all 0.7s ease-out 0.1s',
          }}
        >
          Find Your Dream Car
        </h1>

        {/* Search Bar */}
        <div
          className='relative z-30 bg-white rounded-2xl shadow-md w-full max-w-3xl'
          style={{
            opacity: heroVisible ? 1 : 0,
            transform: heroVisible
              ? 'translateY(0) scale(1)'
              : 'translateY(20px) scale(0.97)',
            transition: 'all 0.7s ease-out 0.2s',
          }}
        >
          {/* Mobile layout — compact */}
          <div className='flex flex-col sm:hidden divide-y divide-gray-100'>
            <div className='flex items-center px-4 py-2.5'>
              <span className='text-xs text-gray-400 w-14 flex-shrink-0'>
                Type
              </span>
              <div className='flex-1'>
                <Select
                  options={typeOptions}
                  styles={mobileSelectStyles}
                  placeholder='All Types'
                  onChange={(opt) =>
                    setFilters({ ...filters, type: opt?.value || '' })
                  }
                />
              </div>
            </div>
            <div className='flex items-center px-4 py-2.5'>
              <span className='text-xs text-gray-400 w-14 flex-shrink-0'>
                Make
              </span>
              <div className='flex-1'>
                <Select
                  options={brandOptions}
                  styles={mobileSelectStyles}
                  placeholder='Any Makes'
                  onChange={(opt) =>
                    setFilters({ ...filters, brand: opt?.value || '' })
                  }
                />
              </div>
            </div>
            <div className='flex items-center px-4 py-2.5'>
              <span className='text-xs text-gray-400 w-14 flex-shrink-0'>
                Model
              </span>
              <div className='flex-1'>
                <Select
                  options={modelOptions}
                  styles={mobileSelectStyles}
                  placeholder='Any Models'
                  onChange={(opt) =>
                    setFilters({ ...filters, model: opt?.value || '' })
                  }
                />
              </div>
            </div>
            <div className='flex items-center px-4 py-2.5'>
              <span className='text-xs text-gray-400 w-14 flex-shrink-0'>
                Price
              </span>
              <div className='flex-1'>
                <Select
                  options={priceOptions}
                  styles={mobileSelectStyles}
                  placeholder='All Prices'
                  onChange={(opt) =>
                    setFilters({ ...filters, price: opt?.value || '' })
                  }
                />
              </div>
            </div>
            <button
              onClick={handleSearch}
              className='w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white rounded-b-2xl py-3 text-sm font-semibold transition-all duration-200 flex items-center justify-center gap-2'
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
                  d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z'
                />
              </svg>
              Search Cars
            </button>
          </div>

          {/* Desktop layout */}
          <div className='hidden sm:flex items-center px-2 py-2'>
            <div className='flex-1'>
              <Select
                options={typeOptions}
                styles={selectStyles}
                placeholder='All Types'
                onChange={(opt) =>
                  setFilters({ ...filters, type: opt?.value || '' })
                }
              />
            </div>
            <div className='w-px h-5 bg-gray-200 flex-shrink-0' />
            <div className='flex-1'>
              <Select
                options={brandOptions}
                styles={selectStyles}
                placeholder='Any Makes'
                onChange={(opt) =>
                  setFilters({ ...filters, brand: opt?.value || '' })
                }
              />
            </div>
            <div className='w-px h-5 bg-gray-200 flex-shrink-0' />
            <div className='flex-1'>
              <Select
                options={modelOptions}
                styles={selectStyles}
                placeholder='Any Models'
                onChange={(opt) =>
                  setFilters({ ...filters, model: opt?.value || '' })
                }
              />
            </div>
            <div className='w-px h-5 bg-gray-200 flex-shrink-0' />
            <div className='flex-1'>
              <Select
                options={priceOptions}
                styles={selectStyles}
                placeholder='All Prices'
                onChange={(opt) =>
                  setFilters({ ...filters, price: opt?.value || '' })
                }
              />
            </div>
            <button
              onClick={handleSearch}
              className='bg-blue-600 hover:bg-blue-700 active:scale-95 text-white rounded-full w-11 h-11 flex items-center justify-center transition-all duration-200 flex-shrink-0 ml-2 mr-1'
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
                  d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z'
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Car Image */}
        {/* Car Image */}
        <div className='relative z-0 w-full max-w-xs mx-auto mt-4 sm:absolute sm:bottom-0 sm:left-0 sm:right-0 sm:max-w-xl sm:mx-auto md:max-w-2xl lg:max-w-3xl sm:mt-0'>
          <img
            src={carImg}
            alt='Dream Car'
            className='w-full object-contain object-bottom drop-shadow-2xl'
          />
        </div>
      </section>

      {/* Stats Section */}
      <section className='bg-white py-10 px-4'>
        <div className='max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center'>
          {[
            { number: '500+', label: 'Cars Available' },
            { number: '10K+', label: 'Happy Customers' },
            { number: '50+', label: 'Cities Covered' },
            { number: '24/7', label: 'Support' },
          ].map((stat, i) => (
            <div
              key={i}
              className='group cursor-default'
              style={{
                animation: `fadeSlideUp 0.6s ease-out ${i * 0.1}s both`,
              }}
            >
              <p className='text-2xl sm:text-4xl font-bold text-blue-600 mb-1 group-hover:scale-110 transition-transform duration-300'>
                {stat.number}
              </p>
              <p className='text-gray-400 text-xs uppercase tracking-widest'>
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Cars */}
      <section className='py-14 px-4 max-w-6xl mx-auto'>
        <div className='flex items-end justify-between mb-8'>
          <div>
            <p className='text-blue-600 uppercase tracking-widest text-xs font-semibold mb-1'>
              Our Fleet
            </p>
            <h2 className='text-xl sm:text-3xl font-bold text-gray-900'>
              Featured Cars
            </h2>
          </div>
          <Link
            to='/cars'
            className='text-blue-600 hover:underline text-xs sm:text-sm font-semibold group flex items-center gap-1'
          >
            View All
            <span className='group-hover:translate-x-1 transition-transform duration-200'>
              →
            </span>
          </Link>
        </div>

        {loading ? (
          <div className='flex justify-center items-center h-40'>
            <div className='w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin' />
          </div>
        ) : cars.length === 0 ? (
          <div className='text-center text-gray-400 py-20'>
            <p className='text-lg'>No cars available yet.</p>
          </div>
        ) : (
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-5'>
            {cars.map((car, i) => (
              <Link
                to={`/cars/${car._id}`}
                key={car._id}
                className='group'
                style={{
                  animation: `fadeSlideUp 0.5s ease-out ${i * 0.08}s both`,
                }}
              >
                <div className='bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden hover:-translate-y-1'>
                  <div className='w-full aspect-video bg-[#eaecf5] flex items-center justify-center overflow-hidden rounded-t-2xl'>
                    {car.images && car.images[0] ? (
                      <img
                        src={car.images[0]}
                        alt={`${car.brand} ${car.model}`}
                        className='w-full h-full object-cover group-hover:scale-110 transition-transform duration-500'
                      />
                    ) : (
                      <div className='text-gray-300 text-center'>
                        <svg
                          className='w-12 h-12 mx-auto mb-1'
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
                          <path
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            strokeWidth={1}
                            d='M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10l2-2h8z'
                          />
                        </svg>
                        <p className='text-xs'>No Image</p>
                      </div>
                    )}
                  </div>
                  <div className='p-4'>
                    <div className='flex items-start justify-between mb-2'>
                      <div>
                        <h3 className='text-sm font-semibold text-gray-900'>
                          {car.brand} {car.model}
                        </h3>
                        <p className='text-gray-400 text-xs mt-0.5'>
                          {car.year} • {car.type}
                        </p>
                      </div>
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full font-medium ${car.available ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-500'}`}
                      >
                        {car.available ? 'Available' : 'Booked'}
                      </span>
                    </div>
                    <div className='grid grid-cols-2 gap-1 mb-3 text-xs text-gray-400'>
                      <span>⚙️ {car.transmission}</span>
                      <span>⛽ {car.fuel}</span>
                      <span>💺 {car.seats} seats</span>
                      <span>📍 {car.location}</span>
                    </div>
                    <div className='flex items-center justify-between'>
                      <div>
                        <span className='text-lg font-bold text-blue-600'>
                          ${car.pricePerDay}
                        </span>
                        <span className='text-gray-400 text-xs'> /day</span>
                      </div>
                      <span className='text-xs text-gray-400 group-hover:text-blue-600 transition-colors font-medium flex items-center gap-1'>
                        View Details
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
      </section>

      {/* How it works */}
      <section className='py-14 px-4 bg-white'>
        <div className='max-w-5xl mx-auto text-center mb-10'>
          <p className='text-blue-600 uppercase tracking-widest text-xs font-semibold mb-2'>
            Simple Process
          </p>
          <h2 className='text-xl sm:text-3xl font-bold text-gray-900'>
            How It Works
          </h2>
        </div>
        <div className='max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-8'>
          {[
            {
              step: '01',
              title: 'Choose a Car',
              desc: 'Browse our fleet and pick the perfect car for your journey.',
            },
            {
              step: '02',
              title: 'Book Online',
              desc: 'Select your dates and locations and confirm your booking instantly.',
            },
            {
              step: '03',
              title: 'Hit the Road',
              desc: "Pick up your car and enjoy the ride. Return it when you're done.",
            },
          ].map((item, i) => (
            <div
              key={i}
              className='text-center group'
              style={{
                animation: `fadeSlideUp 0.6s ease-out ${i * 0.15}s both`,
              }}
            >
              <div className='w-11 h-11 rounded-full bg-blue-50 flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-600 transition-colors duration-300'>
                <span className='text-blue-600 font-bold text-sm group-hover:text-white transition-colors duration-300'>
                  {item.step}
                </span>
              </div>
              <h3 className='text-sm font-semibold text-gray-900 mb-2'>
                {item.title}
              </h3>
              <p className='text-gray-400 text-xs leading-relaxed'>
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className='py-14 px-4 bg-[#eaecf5]'>
        <div className='max-w-2xl mx-auto text-center'>
          <h2 className='text-xl sm:text-3xl font-bold text-gray-900 mb-4'>
            Ready to Drive?
          </h2>
          <p className='text-gray-400 text-sm mb-8'>
            Join thousands of satisfied customers. Sign up today and get your
            first rental at a special rate.
          </p>
          <Link
            to='/register'
            className='inline-block px-8 py-3 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-semibold text-sm rounded-full transition-all duration-300 hover:shadow-lg hover:shadow-blue-200'
          >
            Get Started Now
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
