
import { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import Select from 'react-select';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaArrowLeft, FaTrashAlt, FaCheckCircle, FaClock, 
  FaTimesCircle, FaFlag, FaCreditCard, FaCalendarAlt, 
  FaMapMarkerAlt, FaUser, FaCar, FaSyncAlt, FaSearch, FaDollarSign,
  FaChevronDown, FaChevronUp, FaFilter, FaEye, FaHourglassHalf,
  FaCheck, FaBan, FaUndo, FaSpinner, FaClipboardList
} from 'react-icons/fa';
import api from '../../services/api.js';

const ManageBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [filterStatus, setFilterStatus] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [updatingId, setUpdatingId] = useState(null);
  const [expandedCard, setExpandedCard] = useState(null);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => { fetchBookings(); }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const res = await api.get('/bookings');
      setBookings(res.data);
    } catch (error) {
      setError('Connection failed');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id, status, paymentStatus) => {
    setUpdatingId(id);
    try {
      await api.put(`/bookings/${id}`, { status, paymentStatus });
      setSuccess('Updated!');
      fetchBookings();
      setTimeout(() => setSuccess(''), 2000);
    } catch (err) {
      setError('Update failed');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/bookings/${id}`);
      setSuccess('Deleted');
      fetchBookings();
      setDeleteConfirm(null);
      setTimeout(() => setSuccess(''), 2000);
    } catch (err) {
      setError('Delete failed');
    }
  };

  const STATUS_CONFIG = {
    pending: { label: 'Pending', color: '#b45309', bg: 'bg-amber-50', text: 'text-amber-700', icon: <FaHourglassHalf size={10} /> },
    confirmed: { label: 'Confirmed', color: '#047857', bg: 'bg-emerald-50', text: 'text-emerald-700', icon: <FaCheckCircle size={10} /> },
    completed: { label: 'Completed', color: '#1d4ed8', bg: 'bg-blue-50', text: 'text-blue-700', icon: <FaFlag size={10} /> },
    cancelled: { label: 'Cancelled', color: '#be123c', bg: 'bg-rose-50', text: 'text-rose-700', icon: <FaBan size={10} /> },
  };

  const PAYMENT_CONFIG = {
    paid: { label: 'Paid', color: '#047857', bg: 'bg-emerald-50', text: 'text-emerald-700', icon: <FaCheckCircle size={10} /> },
    unpaid: { label: 'Unpaid', color: '#64748b', bg: 'bg-slate-100', text: 'text-slate-600', icon: <FaCreditCard size={10} /> },
    refunded: { label: 'Refunded', color: '#6366f1', bg: 'bg-indigo-50', text: 'text-indigo-600', icon: <FaUndo size={10} /> },
  };

  // Custom select styles matching dashboard style
  const customSelectStyles = {
    control: (base, state) => ({
      ...base,
      border: '1px solid #e2e8f0',
      backgroundColor: '#ffffff',
      borderRadius: '12px',
      fontSize: '11px',
      fontWeight: '500',
      minHeight: '36px',
      cursor: 'pointer',
      boxShadow: state.isFocused ? '0 0 0 2px #e2e8f0' : 'none',
      '&:hover': { borderColor: '#cbd5e1' }
    }),
    singleValue: (base, { data }) => ({ 
      ...base, 
      color: data.color, 
      fontWeight: '600',
      fontSize: '11px'
    }),
    menu: (base) => ({ 
      ...base, 
      borderRadius: '12px', 
      border: '1px solid #e2e8f0', 
      boxShadow: '0 4px 12px rgba(0,0,0,0.05)', 
      zIndex: 9999,
      overflow: 'hidden',
      marginTop: '4px'
    }),
    menuPortal: base => ({ ...base, zIndex: 9999 }),
    menuList: (base) => ({
      ...base,
      padding: '4px',
      backgroundColor: '#ffffff'
    }),
    option: (base, state) => ({
      ...base,
      fontSize: '11px',
      fontWeight: '500',
      padding: '8px 12px',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      backgroundColor: state.isSelected ? '#f1f5f9' : state.isFocused ? '#f8fafc' : '#ffffff',
      color: '#334155',
      '&:active': { backgroundColor: '#f1f5f9' }
    }),
    indicatorSeparator: () => ({ display: 'none' }),
    dropdownIndicator: (base) => ({
      ...base,
      color: '#94a3b8',
      padding: '0 6px'
    })
  };

  const formatStatusOption = (option) => {
    const config = STATUS_CONFIG[option.value];
    return (
      <div className="flex items-center gap-2">
        <span style={{ color: config?.color }}>{config?.icon}</span>
        <span>{option.label}</span>
      </div>
    );
  };

  const formatPaymentOption = (option) => {
    const config = PAYMENT_CONFIG[option.value];
    return (
      <div className="flex items-center gap-2">
        <span style={{ color: config?.color }}>{config?.icon}</span>
        <span>{option.label}</span>
      </div>
    );
  };

  const filteredBookings = useMemo(() => {
    return bookings.filter(b => {
      const matchesStatus = filterStatus ? b.status === filterStatus : true;
      const matchesSearch = 
        b.car?.brand?.toLowerCase().includes(searchTerm.toLowerCase()) || 
        b.car?.model?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.user?.name?.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesStatus && matchesSearch;
    });
  }, [bookings, filterStatus, searchTerm]);

  const getStatusColor = (status) => {
    const config = STATUS_CONFIG[status];
    return config ? `${config.bg} ${config.text}` : 'bg-slate-100 text-slate-600';
  };

  const getPaymentColor = (status) => {
    const config = PAYMENT_CONFIG[status];
    return config ? `${config.bg} ${config.text}` : 'bg-slate-100 text-slate-600';
  };

  // Stats for bookings
  const bookingStats = [
    { label: 'Total', value: bookings.length, icon: <FaClipboardList />, bg: 'bg-blue-50', text: 'text-blue-600' },
    { label: 'Pending', value: bookings.filter(b => b.status === 'pending').length, icon: <FaHourglassHalf />, bg: 'bg-amber-50', text: 'text-amber-600' },
    { label: 'Confirmed', value: bookings.filter(b => b.status === 'confirmed').length, icon: <FaCheckCircle />, bg: 'bg-emerald-50', text: 'text-emerald-600' },
    { label: 'Revenue', value: `$${bookings.reduce((s, b) => s + (b.totalPrice || 0), 0).toLocaleString()}`, icon: <FaDollarSign />, bg: 'bg-indigo-50', text: 'text-indigo-600' },
  ];

  return (
    <div className='min-h-screen bg-[#f8fafc] pt-24 pb-12'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6'>
        
        {/* Header - Same as Dashboard */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8'
        >
          <div>
            <Link to='/admin' className='inline-flex items-center gap-1.5 text-xs font-medium text-slate-400 hover:text-indigo-600 transition-colors mb-1'>
              <FaArrowLeft size={10} />
              Dashboard
            </Link>
            <h1 className='text-3xl font-extrabold text-slate-900 tracking-tight'>Manage Bookings</h1>
            <p className='text-slate-500 text-sm mt-1'>View and manage all rental bookings</p>
          </div>
          <div className='flex items-center gap-2'>
            <div className='relative'>
              <FaSearch className='absolute left-3 top-1/2 -translate-y-1/2 text-slate-400' size={12} />
              <input 
                type="text" 
                placeholder="Search bookings..."
                className='pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-2xl text-xs w-48 sm:w-56 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all'
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button 
              onClick={fetchBookings} 
              className='p-2 bg-white border border-slate-200 text-slate-500 hover:text-indigo-600 rounded-2xl transition-all'
              disabled={loading}
            >
              <FaSyncAlt size={12} className={loading ? 'animate-spin' : ''} />
            </button>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className='lg:hidden p-2 bg-white border border-slate-200 rounded-2xl'
            >
              <FaFilter size={12} className={showFilters ? 'text-indigo-600' : 'text-slate-400'} />
            </button>
          </div>
        </motion.div>

        {/* Stats Cards - Same style as Dashboard */}
        <div className='grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8'>
          {bookingStats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -5 }}
              className='bg-white rounded-3xl p-6 shadow-sm border border-slate-100'
            >
              <div className={`w-12 h-12 rounded-2xl ${stat.bg} ${stat.text} flex items-center justify-center text-xl mb-4`}>
                {stat.icon}
              </div>
              <h3 className='text-slate-500 text-xs font-bold uppercase tracking-widest'>{stat.label}</h3>
              <p className='text-2xl font-black text-slate-900 mt-1'>{stat.value}</p>
            </motion.div>
          ))}
        </div>

        {/* Mobile Filters */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className='lg:hidden overflow-hidden mb-4'
            >
              <div className='flex gap-2 flex-wrap py-2'>
                {['', 'pending', 'confirmed', 'completed', 'cancelled'].map(s => (
                  <button 
                    key={s}
                    onClick={() => setFilterStatus(s)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
                      filterStatus === s 
                        ? 'bg-indigo-600 text-white shadow-md' 
                        : 'bg-white text-slate-500 border border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    {s === '' ? 'All' : s}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Desktop Filters */}
        <div className='hidden lg:flex gap-2 mb-6 flex-wrap'>
          {['', 'pending', 'confirmed', 'completed', 'cancelled'].map(s => (
            <button 
              key={s}
              onClick={() => setFilterStatus(s)}
              className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
                filterStatus === s 
                  ? 'bg-indigo-600 text-white shadow-md' 
                  : 'bg-white text-slate-500 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {s === '' ? 'All Bookings' : s}
            </button>
          ))}
        </div>

        {/* Bookings List - Same style as Recent Bookings in Dashboard */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className='bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden'
        >
          <div className='flex items-center justify-between px-8 py-6 border-b border-slate-50'>
            <h2 className='text-lg font-bold text-slate-900'>All Bookings</h2>
            <span className='text-xs font-medium text-slate-400 bg-slate-50 px-3 py-1 rounded-full'>
              {filteredBookings.length} bookings
            </span>
          </div>

          <div className='divide-y divide-slate-50'>
            {loading ? (
              <div className='py-20 flex justify-center'>
                <div className='w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin' />
              </div>
            ) : filteredBookings.length === 0 ? (
              <div className='py-20 text-center flex flex-col items-center'>
                <FaClipboardList className='text-slate-100 text-6xl mb-4' />
                <p className='text-slate-400 font-medium'>No bookings found.</p>
              </div>
            ) : (
              filteredBookings.map((booking, idx) => (
                <motion.div
                  key={booking._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.03 }}
                  className='relative'
                >
                  <div className='flex flex-col lg:flex-row lg:items-center gap-4 px-6 py-5 hover:bg-slate-50/50 transition-colors'>
                    
                    {/* Car Image */}
                    <div className='w-16 h-14 rounded-2xl bg-slate-100 overflow-hidden flex-shrink-0 border border-slate-200'>
                      {booking.car?.images?.[0] ? (
                        <img src={booking.car.images[0]} className='w-full h-full object-cover' alt="" />
                      ) : (
                        <div className='w-full h-full flex items-center justify-center text-slate-300'>
                          <FaCar />
                        </div>
                      )}
                    </div>

                    {/* Main Info */}
                    <div className='flex-1 min-w-0'>
                      <div className='flex items-start justify-between gap-2'>
                        <div>
                          <h3 className='text-sm font-bold text-slate-900 truncate'>
                            {booking.car?.brand} {booking.car?.model}
                          </h3>
                          <div className='flex flex-wrap items-center gap-3 mt-1'>
                            <span className='text-[11px] text-slate-500 flex items-center gap-1'>
                              <FaUser className='text-slate-300' size={10} />
                              {booking.user?.name}
                            </span>
                            <span className='text-[11px] text-slate-400 flex items-center gap-1'>
                              <FaCalendarAlt className='text-slate-300' size={10} />
                              {new Date(booking.startDate).toLocaleDateString()} - {new Date(booking.endDate).toLocaleDateString()}
                            </span>
                            {booking.pickupLocation && (
                              <span className='text-[11px] text-slate-400 flex items-center gap-1'>
                                <FaMapMarkerAlt className='text-slate-300' size={10} />
                                {booking.pickupLocation}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className='flex flex-col items-end gap-1'>
                          <span className={`text-[10px] px-3 py-1 rounded-xl font-black uppercase tracking-widest ${getStatusColor(booking.status)}`}>
                            {booking.status}
                          </span>
                          <span className={`text-[10px] px-3 py-1 rounded-xl font-black uppercase tracking-widest ${getPaymentColor(booking.paymentStatus)}`}>
                            {booking.paymentStatus}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Price */}
                    <div className='flex items-center gap-4'>
                      <div className='text-right min-w-[80px]'>
                        <p className='text-sm font-black text-indigo-600'>${booking.totalPrice}</p>
                        <p className='text-[9px] text-slate-400 uppercase'>total</p>
                      </div>
                    </div>
                  </div>

                  {/* Actions - Below on mobile, inline on desktop */}
                  <div className='flex flex-wrap items-center gap-2 px-6 pb-5 lg:px-6 lg:pb-5 lg:pt-0 lg:border-t-0 border-t border-slate-50 lg:mt-0'>
                    <div className='w-[130px]'>
                      <Select
                        styles={customSelectStyles}
                        options={Object.entries(STATUS_CONFIG).map(([val, cfg]) => ({
                          value: val, 
                          label: cfg.label,
                          color: cfg.color
                        }))}
                        value={{
                          value: booking.status, 
                          label: STATUS_CONFIG[booking.status]?.label,
                          color: STATUS_CONFIG[booking.status]?.color
                        }}
                        onChange={(opt) => handleStatusUpdate(booking._id, opt.value, booking.paymentStatus)}
                        isSearchable={false}
                        menuPortalTarget={document.body}
                        isLoading={updatingId === booking._id}
                        isDisabled={updatingId === booking._id}
                        formatOptionLabel={formatStatusOption}
                      />
                    </div>
                    <div className='w-[120px]'>
                      <Select
                        styles={customSelectStyles}
                        options={Object.entries(PAYMENT_CONFIG).map(([val, cfg]) => ({
                          value: val, 
                          label: cfg.label,
                          color: cfg.color
                        }))}
                        value={{
                          value: booking.paymentStatus, 
                          label: PAYMENT_CONFIG[booking.paymentStatus]?.label,
                          color: PAYMENT_CONFIG[booking.paymentStatus]?.color
                        }}
                        onChange={(opt) => handleStatusUpdate(booking._id, booking.status, opt.value)}
                        isSearchable={false}
                        menuPortalTarget={document.body}
                        isLoading={updatingId === booking._id}
                        isDisabled={updatingId === booking._id}
                        formatOptionLabel={formatPaymentOption}
                      />
                    </div>
                    <button 
                      onClick={() => setDeleteConfirm(booking._id)}
                      className='ml-auto p-2 text-rose-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all'
                      disabled={updatingId === booking._id}
                    >
                      <FaTrashAlt size={12} />
                    </button>
                  </div>

                  {/* Loading Overlay */}
                  {updatingId === booking._id && (
                    <div className='absolute inset-0 bg-white/70 flex items-center justify-center rounded-[2rem]'>
                      <FaSpinner className='animate-spin text-indigo-600' size={20} />
                    </div>
                  )}
                </motion.div>
              ))
            )}
          </div>
        </motion.div>

        {/* Delete Modal - Same style as Dashboard */}
        <AnimatePresence>
          {deleteConfirm && (
            <div className='fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-[9999] px-4'>
              <motion.div 
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className='bg-white rounded-3xl p-8 max-w-sm w-full shadow-xl'
              >
                <div className='w-16 h-16 bg-rose-50 rounded-2xl flex items-center justify-center mx-auto mb-4'>
                  <FaTrashAlt className='text-rose-500' size={24} />
                </div>
                <h3 className='text-lg font-bold text-slate-900 text-center'>Delete Booking?</h3>
                <p className='text-xs text-slate-500 text-center mt-2'>This action cannot be undone.</p>
                <div className='flex gap-3 mt-6'>
                  <button 
                    onClick={() => setDeleteConfirm(null)} 
                    className='flex-1 py-3 bg-slate-100 text-slate-600 text-sm font-semibold rounded-xl hover:bg-slate-200 transition-all'
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={() => handleDelete(deleteConfirm)} 
                    className='flex-1 py-3 bg-rose-500 text-white text-sm font-semibold rounded-xl hover:bg-rose-600 transition-all'
                  >
                    Delete
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Success Toast */}
        <AnimatePresence>
          {success && (
            <motion.div 
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
              className='fixed bottom-6 left-1/2 -translate-x-1/2 z-[10000] bg-slate-800 text-white px-5 py-3 rounded-2xl shadow-lg flex items-center gap-2 text-sm font-medium'
            >
              <FaCheckCircle className='text-emerald-400' size={14} />
              {success}
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
};

export default ManageBookings;