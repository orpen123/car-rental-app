




































































































































































































































































































































































































































































































































































































































































import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Select from 'react-select';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaArrowLeft, FaPlus, FaTimes, FaCheck, FaEdit, FaTrashAlt, 
  FaCar, FaCog, FaGasPump, FaUsers, FaMapMarkerAlt, FaCalendarAlt,
  FaImage, FaUpload, FaSpinner, FaCheckCircle, FaExclamationTriangle,
  FaTachometerAlt, FaBolt, FaLeaf, FaTint, FaFilter
} from 'react-icons/fa';
import api from '../../services/api.js';

const ManageCars = () => {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editCar, setEditCar] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const emptyForm = {
    brand: '',
    model: '',
    year: '',
    type: 'sedan',
    pricePerDay: '',
    seats: '',
    transmission: 'automatic',
    fuel: 'petrol',
    location: '',
    description: '',
    images: [],
    available: true,
  };

  const [formData, setFormData] = useState(emptyForm);

  const typeOptions = [
    { value: 'sedan', label: 'Sedan', icon: <FaCar /> },
    { value: 'suv', label: 'SUV', icon: <FaCar /> },
    { value: 'truck', label: 'Truck', icon: <FaCar /> },
    { value: 'convertible', label: 'Convertible', icon: <FaCar /> },
    { value: 'van', label: 'Van', icon: <FaCar /> },
    { value: 'coupe', label: 'Coupe', icon: <FaCar /> },
  ];

  const transmissionOptions = [
    { value: 'automatic', label: 'Automatic', icon: <FaCog /> },
    { value: 'manual', label: 'Manual', icon: <FaCog /> },
  ];

  const fuelOptions = [
    { value: 'petrol', label: 'Petrol', icon: <FaGasPump /> },
    { value: 'diesel', label: 'Diesel', icon: <FaTint /> },
    { value: 'electric', label: 'Electric', icon: <FaBolt /> },
    { value: 'hybrid', label: 'Hybrid', icon: <FaLeaf /> },
  ];

  const formatOption = (option) => (
    <div className="flex items-center gap-2">
      <span className="text-gray-400 text-xs">{option.icon}</span>
      <span>{option.label}</span>
    </div>
  );

  const selectStyles = {
    control: (base, state) => ({
      ...base,
      border: `1px solid ${state.isFocused ? '#3b82f6' : '#e2e8f0'}`,
      boxShadow: state.isFocused ? '0 0 0 2px #e2e8f0' : 'none',
      background: '#ffffff',
      minHeight: '42px',
      cursor: 'pointer',
      borderRadius: '12px',
      transition: 'all 0.2s ease',
      '&:hover': { borderColor: '#cbd5e1' },
    }),
    indicatorSeparator: () => ({ display: 'none' }),
    dropdownIndicator: (base, state) => ({
      ...base,
      color: state.isFocused ? '#3b82f6' : '#94a3b8',
      padding: '0 8px',
      transition: 'all 0.2s ease',
      transform: state.selectProps.menuIsOpen ? 'rotate(180deg)' : 'rotate(0deg)',
    }),
    menu: (base) => ({
      ...base,
      borderRadius: '12px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
      border: '1px solid #e2e8f0',
      overflow: 'hidden',
      marginTop: '4px',
      zIndex: 999,
    }),
    menuList: (base) => ({ ...base, padding: '4px' }),
    option: (base, state) => ({
      ...base,
      borderRadius: '8px',
      fontSize: '12px',
      padding: '8px 12px',
      cursor: 'pointer',
      backgroundColor: state.isSelected ? '#f1f5f9' : state.isFocused ? '#f8fafc' : 'white',
      color: '#334155',
      fontWeight: state.isSelected ? '600' : '400',
    }),
    singleValue: (base) => ({ ...base, fontSize: '12px', color: '#334155', fontWeight: '500' }),
    placeholder: (base) => ({ ...base, fontSize: '12px', color: '#94a3b8' }),
    valueContainer: (base) => ({ ...base, padding: '0 12px' }),
  };

  useEffect(() => { fetchCars(); }, []);

  const fetchCars = async () => {
    try {
      const res = await api.get('/cars');
      setCars(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
    setError('');
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const data = new FormData();
      data.append('image', file);
      const res = await api.post('/upload', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setFormData((prev) => ({ ...prev, images: [...prev.images, res.data.url] }));
      setSuccess('Image uploaded! ✅');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Image upload failed');
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (index) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleEdit = (car) => {
    setEditCar(car);
    setFormData({
      brand: car.brand,
      model: car.model,
      year: car.year,
      type: car.type,
      pricePerDay: car.pricePerDay,
      seats: car.seats,
      transmission: car.transmission,
      fuel: car.fuel,
      location: car.location,
      description: car.description,
      images: car.images || [],
      available: car.available,
    });
    setShowForm(true);
    setError('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async () => {
    if (!formData.brand || !formData.model || !formData.year || !formData.pricePerDay) {
      return setError('Please fill in all required fields');
    }
    setSubmitting(true);
    try {
      const payload = {
        ...formData,
        year: Number(formData.year),
        pricePerDay: Number(formData.pricePerDay),
        seats: Number(formData.seats),
      };
      if (editCar) {
        await api.put(`/cars/${editCar._id}`, payload);
        setSuccess('Car updated! ✅');
      } else {
        await api.post('/cars', payload);
        setSuccess('Car added! ✅');
      }
      setFormData(emptyForm);
      setEditCar(null);
      setShowForm(false);
      fetchCars();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/cars/${id}`);
      setSuccess('Car deleted! ✅');
      fetchCars();
      setDeleteConfirm(null);
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Delete failed');
    }
  };

  const inputClass = 'w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-800 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-slate-400';
  const labelClass = 'block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5';

  
  const containerVars = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.05 } }
  };

  const formVars = {
    hidden: { opacity: 0, height: 0 },
    visible: { opacity: 1, height: 'auto', transition: { duration: 0.4, ease: 'easeInOut' } },
    exit: { opacity: 0, height: 0, transition: { duration: 0.3 } }
  };

  
  const carStats = [
    { label: 'Total Cars', value: cars.length, icon: <FaCar />, bg: 'bg-blue-50', text: 'text-blue-600' },
    { label: 'Available', value: cars.filter(c => c.available).length, icon: <FaCheckCircle />, bg: 'bg-emerald-50', text: 'text-emerald-600' },
    { label: 'Booked', value: cars.filter(c => !c.available).length, icon: <FaTimes />, bg: 'bg-amber-50', text: 'text-amber-600' },
  ];

  return (
    <div className='min-h-screen bg-[#f8fafc] pt-20 sm:pt-24 pb-10'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6'>

        {}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 sm:mb-8'
        >
          <div>
            <Link to='/admin' className='inline-flex items-center gap-1.5 text-xs font-medium text-slate-400 hover:text-indigo-600 transition-colors mb-1'>
              <FaArrowLeft size={10} />
              Dashboard
            </Link>
            <h1 className='text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight'>Manage Cars</h1>
            <p className='text-slate-500 text-xs sm:text-sm mt-1'>View and manage your vehicle fleet</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              setShowForm(!showForm);
              setEditCar(null);
              setFormData(emptyForm);
              setError('');
            }}
            className={`flex items-center justify-center gap-2 px-4 sm:px-5 py-2.5 text-sm font-bold rounded-2xl transition-all w-full sm:w-auto ${
              showForm
                ? 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm'
            }`}
          >
            {showForm ? (
              <>
                <FaTimes size={12} />
                Cancel
              </>
            ) : (
              <>
                <FaPlus size={12} />
                Add New Car
              </>
            )}
          </motion.button>
        </motion.div>

        {/* Stats Cards - Responsive Grid */}
        <div className='grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-6 sm:mb-8'>
          {carStats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -5 }}
              className='bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-sm border border-slate-100'
            >
              <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl ${stat.bg} ${stat.text} flex items-center justify-center text-lg sm:text-xl mb-3 sm:mb-4`}>
                {stat.icon}
              </div>
              <h3 className='text-slate-500 text-[10px] sm:text-xs font-bold uppercase tracking-widest'>{stat.label}</h3>
              <p className='text-xl sm:text-2xl font-black text-slate-900 mt-1'>{stat.value}</p>
            </motion.div>
          ))}
        </div>

        {}
        <AnimatePresence>
          {success && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className='bg-emerald-50 border border-emerald-100 text-emerald-600 text-xs rounded-xl sm:rounded-2xl px-3 sm:px-4 py-2.5 sm:py-3 mb-4 text-center flex items-center justify-center gap-2'
            >
              <FaCheckCircle size={12} className="sm:w-3.5 sm:h-3.5" />
              <span className="text-[11px] sm:text-xs">{success}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {}
        <AnimatePresence>
          {showForm && (
            <motion.div
              variants={formVars}
              initial="hidden"
              animate="visible"
              exit="exit"
              className='overflow-hidden mb-6'
            >
              <div className='bg-white rounded-2xl sm:rounded-3xl shadow-sm border border-slate-100 p-4 sm:p-6'>

                {}
                <div className='flex items-center gap-3 mb-5 sm:mb-6 pb-3 sm:pb-4 border-b border-slate-50'>
                  <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center ${editCar ? 'bg-amber-50' : 'bg-indigo-50'}`}>
                    {editCar ? <FaEdit size={14} className="sm:text-base text-amber-600" /> : <FaCar size={14} className="sm:text-base text-indigo-600" />}
                  </div>
                  <div>
                    <h2 className='text-sm sm:text-base font-bold text-slate-900'>
                      {editCar ? 'Edit Car' : 'Add New Car'}
                    </h2>
                    {editCar && (
                      <p className='text-[10px] sm:text-xs text-slate-400 mt-0.5'>
                        {editCar.brand} {editCar.model} • {editCar.year}
                      </p>
                    )}
                  </div>
                </div>

                <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4'>

                  {}
                  <div>
                    <label className={labelClass}>Brand *</label>
                    <input
                      name='brand'
                      value={formData.brand}
                      onChange={handleChange}
                      placeholder='Toyota'
                      className={inputClass}
                    />
                  </div>

                  {}
                  <div>
                    <label className={labelClass}>Model *</label>
                    <input
                      name='model'
                      value={formData.model}
                      onChange={handleChange}
                      placeholder='Camry'
                      className={inputClass}
                    />
                  </div>

                  {}
                  <div>
                    <label className={labelClass}>Year *</label>
                    <input
                      name='year'
                      type='number'
                      value={formData.year}
                      onChange={handleChange}
                      placeholder='2023'
                      className={inputClass}
                    />
                  </div>

                  {}
                  <div>
                    <label className={labelClass}>Price Per Day ($) *</label>
                    <div className='relative'>
                      <span className='absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-semibold'>$</span>
                      <input
                        name='pricePerDay'
                        type='number'
                        value={formData.pricePerDay}
                        onChange={handleChange}
                        placeholder='50'
                        className={`${inputClass} pl-7`}
                      />
                    </div>
                  </div>

                  {}
                  <div>
                    <label className={labelClass}>Seats</label>
                    <div className="relative">
                      <FaUsers className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                      <input
                        name='seats'
                        type='number'
                        value={formData.seats}
                        onChange={handleChange}
                        placeholder='5'
                        className={`${inputClass} pl-9`}
                      />
                    </div>
                  </div>

                  {}
                  <div>
                    <label className={labelClass}>Location</label>
                    <div className="relative">
                      <FaMapMarkerAlt className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={12} />
                      <input
                        name='location'
                        value={formData.location}
                        onChange={handleChange}
                        placeholder='Casablanca'
                        className={`${inputClass} pl-9`}
                      />
                    </div>
                  </div>

                  {}
                  <div>
                    <label className={labelClass}>Type</label>
                    <Select
                      styles={selectStyles}
                      options={typeOptions}
                      value={typeOptions.find(o => o.value === formData.type)}
                      onChange={(opt) => setFormData({ ...formData, type: opt.value })}
                      formatOptionLabel={formatOption}
                    />
                  </div>

                  {}
                  <div>
                    <label className={labelClass}>Transmission</label>
                    <Select
                      styles={selectStyles}
                      options={transmissionOptions}
                      value={transmissionOptions.find(o => o.value === formData.transmission)}
                      onChange={(opt) => setFormData({ ...formData, transmission: opt.value })}
                      formatOptionLabel={formatOption}
                    />
                  </div>

                  {}
                  <div>
                    <label className={labelClass}>Fuel</label>
                    <Select
                      styles={selectStyles}
                      options={fuelOptions}
                      value={fuelOptions.find(o => o.value === formData.fuel)}
                      onChange={(opt) => setFormData({ ...formData, fuel: opt.value })}
                      formatOptionLabel={formatOption}
                    />
                  </div>

                  {}
                  <div className='sm:col-span-2 lg:col-span-3'>
                    <label className={labelClass}>Description</label>
                    <textarea
                      name='description'
                      value={formData.description}
                      onChange={handleChange}
                      placeholder='Car description...'
                      rows={3}
                      className={`${inputClass} resize-none`}
                    />
                  </div>

                  {}
                  <div className='sm:col-span-2 lg:col-span-3'>
                    <label className={labelClass}>Car Images</label>
                    <label className={`flex flex-col items-center justify-center w-full h-24 sm:h-28 border-2 border-dashed rounded-xl sm:rounded-2xl cursor-pointer transition-all duration-200 ${
                      uploading
                        ? 'border-indigo-300 bg-indigo-50 cursor-not-allowed'
                        : 'border-slate-200 hover:border-indigo-400 hover:bg-indigo-50'
                    }`}>
                      <input
                        type='file'
                        accept='image/*'
                        className='hidden'
                        onChange={handleImageUpload}
                        disabled={uploading}
                      />
                      {uploading ? (
                        <div className='flex flex-col items-center gap-2'>
                          <FaSpinner className='animate-spin text-indigo-600' size={18} />
                          <p className='text-[10px] sm:text-xs text-indigo-600 font-medium'>Uploading...</p>
                        </div>
                      ) : (
                        <div className='flex flex-col items-center gap-1'>
                          <FaImage size={22} className="sm:w-7 sm:h-7 text-slate-300" />
                          <p className='text-[10px] sm:text-xs text-slate-400 font-medium'>Click to upload image</p>
                          <p className='text-[9px] sm:text-xs text-slate-300'>JPG, PNG, WEBP</p>
                        </div>
                      )}
                    </label>

                    {}
                    {formData.images.length > 0 && (
                      <div className='flex flex-wrap gap-2 sm:gap-3 mt-3'>
                        {formData.images.map((img, i) => (
                          <div key={i} className='relative w-16 h-12 sm:w-20 sm:h-16 rounded-lg sm:rounded-xl overflow-hidden group border border-slate-100'>
                            <img src={img} alt='' className='w-full h-full object-cover' />
                            <div className='absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200' />
                            <button
                              onClick={() => removeImage(i)}
                              className='absolute top-0.5 right-0.5 sm:top-1 sm:right-1 w-4 h-4 sm:w-5 sm:h-5 bg-red-500 text-white rounded-full text-[10px] opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center font-bold'
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {}
                  <div className='sm:col-span-2 lg:col-span-3'>
                    <button
                      type='button'
                      onClick={() => setFormData({ ...formData, available: !formData.available })}
                      className='flex items-center gap-2 sm:gap-3 cursor-pointer group'
                    >
                      <div className={`relative w-8 h-5 sm:w-10 sm:h-6 rounded-full transition-all duration-300 ${formData.available ? 'bg-indigo-600' : 'bg-slate-200'}`}>
                        <div className={`absolute top-0.5 w-3.5 h-3.5 sm:top-1 sm:w-4 sm:h-4 bg-white rounded-full shadow transition-all duration-300 ${formData.available ? 'left-4 sm:left-5' : 'left-0.5 sm:left-1'}`} />
                      </div>
                      <span className='text-[11px] sm:text-xs font-semibold text-slate-700'>Available for booking</span>
                      <span className={`text-[9px] sm:text-[10px] px-1.5 py-0.5 sm:px-2 rounded-full font-semibold ${formData.available ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-500'}`}>
                        {formData.available ? 'Available' : 'Unavailable'}
                      </span>
                    </button>
                  </div>
                </div>

                {}
                <AnimatePresence>
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className='bg-rose-50 border border-rose-100 text-rose-500 text-[10px] sm:text-xs rounded-xl px-3 sm:px-4 py-2 sm:py-3 mt-4 text-center flex items-center justify-center gap-2'
                    >
                      <FaExclamationTriangle size={10} className="sm:w-3 sm:h-3" />
                      {error}
                    </motion.div>
                  )}
                </AnimatePresence>

                {}
                <div className='flex flex-col sm:flex-row items-center gap-2 sm:gap-3 mt-5 sm:mt-6 pt-3 sm:pt-4 border-t border-slate-50'>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleSubmit}
                    disabled={submitting || uploading}
                    className='w-full sm:w-auto flex items-center justify-center gap-2 px-4 sm:px-6 py-2 sm:py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 text-white text-xs sm:text-sm font-bold rounded-xl transition-all'
                  >
                    {submitting ? (
                      <>
                        <FaSpinner className='animate-spin' size={12} />
                        Saving...
                      </>
                    ) : (
                      <>
                        <FaCheck size={12} />
                        {editCar ? 'Update Car' : 'Add Car'}
                      </>
                    )}
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      setShowForm(false);
                      setEditCar(null);
                      setFormData(emptyForm);
                      setError('');
                    }}
                    className='w-full sm:w-auto flex items-center justify-center px-4 sm:px-6 py-2 sm:py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs sm:text-sm font-bold rounded-xl transition-all'
                  >
                    Cancel
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className='bg-white rounded-2xl sm:rounded-3xl shadow-sm border border-slate-100 overflow-hidden'
        >
          <div className='px-4 sm:px-6 py-3 sm:py-5 border-b border-slate-50 flex items-center justify-between'>
            <h2 className='text-xs sm:text-sm font-bold text-slate-900'>All Vehicles</h2>
            <span className='text-[10px] sm:text-xs font-medium bg-slate-100 text-slate-600 px-2 sm:px-3 py-0.5 sm:py-1 rounded-full'>
              {cars.length} cars
            </span>
          </div>

          {loading ? (
            <div className='flex justify-center items-center h-40 sm:h-48'>
              <FaSpinner className='animate-spin text-indigo-600' size={24} />
            </div>
          ) : cars.length === 0 ? (
            <div className='text-center py-12 sm:py-16'>
              <FaCar size={36} className="sm:w-12 sm:h-12 text-slate-200 mx-auto mb-3" />
              <p className='text-slate-400 text-xs sm:text-sm font-medium'>No cars yet</p>
              <p className='text-slate-300 text-[10px] sm:text-xs mt-1'>Add your first car above</p>
            </div>
          ) : (
            <div className='divide-y divide-slate-50 max-h-[500px] sm:max-h-[600px] overflow-y-auto'>
              {cars.map((car, i) => (
                <motion.div
                  key={car._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03 }}
                  className='flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 px-4 sm:px-6 py-3 sm:py-4 hover:bg-slate-50/50 transition-colors'
                >
                  {}
                  <div className='flex items-center gap-3 sm:gap-4 flex-1'>
                    <div className='w-12 h-10 sm:w-16 sm:h-14 rounded-xl sm:rounded-2xl bg-slate-100 overflow-hidden flex-shrink-0 border border-slate-200'>
                      {car.images?.[0] ? (
                        <img src={car.images[0]} alt='' className='w-full h-full object-cover' />
                      ) : (
                        <div className='w-full h-full flex items-center justify-center text-slate-300'>
                          <FaCar size={16} className="sm:w-5 sm:h-5" />
                        </div>
                      )}
                    </div>

                    <div className='flex-1 min-w-0'>
                      <p className='text-xs sm:text-sm font-bold text-slate-900 truncate'>{car.brand} {car.model}</p>
                      <div className='flex flex-wrap items-center gap-2 sm:gap-3 mt-1'>
                        <span className='text-[9px] sm:text-[11px] text-slate-500 flex items-center gap-0.5 sm:gap-1'>
                          <FaCalendarAlt size={8} className="sm:w-2.5 sm:h-2.5 text-slate-400" />
                          {car.year}
                        </span>
                        <span className='text-[9px] sm:text-[11px] text-slate-500 flex items-center gap-0.5 sm:gap-1'>
                          <FaCog size={8} className="sm:w-2.5 sm:h-2.5 text-slate-400" />
                          {car.transmission}
                        </span>
                        <span className='text-[9px] sm:text-[11px] text-slate-500 flex items-center gap-0.5 sm:gap-1'>
                          <FaGasPump size={8} className="sm:w-2.5 sm:h-2.5 text-slate-400" />
                          {car.fuel}
                        </span>
                      </div>
                    </div>
                  </div>

                  {}
                  <div className='flex items-center justify-between sm:justify-end gap-3 sm:gap-4 ml-auto w-full sm:w-auto'>
                    <div className='text-left sm:text-right min-w-[60px] sm:min-w-[80px]'>
                      <p className='text-xs sm:text-sm font-black text-indigo-600'>${car.pricePerDay}</p>
                      <p className='text-[8px] sm:text-[10px] text-slate-400'>/day</p>
                    </div>

                    <span className={`text-[8px] sm:text-[10px] px-2 sm:px-3 py-0.5 sm:py-1 rounded-lg sm:rounded-xl font-black uppercase tracking-wider ${car.available ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-500'}`}>
                      {car.available ? 'Available' : 'Booked'}
                    </span>

                    <div className='flex items-center gap-1.5 sm:gap-2 flex-shrink-0'>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleEdit(car)}
                        className='p-1.5 sm:p-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg sm:rounded-xl transition-colors'
                      >
                        <FaEdit size={10} className="sm:w-3 sm:h-3" />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setDeleteConfirm(car._id)}
                        className='p-1.5 sm:p-2 bg-rose-50 hover:bg-rose-100 text-rose-500 rounded-lg sm:rounded-xl transition-colors'
                      >
                        <FaTrashAlt size={10} className="sm:w-3 sm:h-3" />
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        {}
        <AnimatePresence>
          {deleteConfirm && (
            <div className='fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-[9999] px-4'>
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className='bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-8 max-w-sm w-full shadow-xl mx-4'
              >
                <div className='w-12 h-12 sm:w-16 sm:h-16 bg-rose-50 rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4'>
                  <FaTrashAlt className='text-rose-500' size={20} />
                </div>
                <h3 className='text-base sm:text-lg font-bold text-slate-900 text-center'>Delete Car?</h3>
                <p className='text-[10px] sm:text-xs text-slate-500 text-center mt-1 sm:mt-2'>This action cannot be undone.</p>
                <div className='flex gap-2 sm:gap-3 mt-5 sm:mt-6'>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setDeleteConfirm(null)}
                    className='flex-1 py-2.5 sm:py-3 bg-slate-100 text-slate-600 text-xs sm:text-sm font-semibold rounded-xl hover:bg-slate-200 transition-all'
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleDelete(deleteConfirm)}
                    className='flex-1 py-2.5 sm:py-3 bg-rose-500 text-white text-xs sm:text-sm font-semibold rounded-xl hover:bg-rose-600 transition-all'
                  >
                    Delete
                  </motion.button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

      </div>

      {}
      <style jsx>{`
        .overflow-y-auto::-webkit-scrollbar {
          width: 4px;
        }
        .overflow-y-auto::-webkit-scrollbar-track {
          background: #f1f5f9;
          border-radius: 10px;
        }
        .overflow-y-auto::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 10px;
        }
        .overflow-y-auto::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
        
        @media (min-width: 640px) {
          .overflow-y-auto::-webkit-scrollbar {
            width: 6px;
          }
        }
      `}</style>
    </div>
  );
};

export default ManageCars;