import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Trash2, Star, Car, User, Calendar, XCircle, CheckCircle } from 'lucide-react';
import api from '../../services/api.js';

const StarDisplay = ({ rating }) => (
  <div className='flex items-center gap-0.5'>
    {[1, 2, 3, 4, 5].map((star) => (
      <span key={star} className={`text-sm ${star <= rating ? 'text-yellow-400' : 'text-gray-200'}`}>★</span>
    ))}
  </div>
);

const ManageReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [filterRating, setFilterRating] = useState(0);

  useEffect(() => { fetchReviews(); }, []);

  const fetchReviews = async () => {
    try {
      const res = await api.get('/reviews');
      setReviews(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/reviews/${id}`);
      setSuccess('Review deleted!');
      fetchReviews();
      setDeleteConfirm(null);
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Delete failed');
    }
  };

  const filteredReviews = filterRating
    ? reviews.filter(r => r.rating === filterRating)
    : reviews;

  const avgRating = reviews.length
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : 0;

  const stats = [
    { label: 'Total', value: reviews.length, color: 'text-gray-900' },
    { label: '5 Stars', value: reviews.filter(r => r.rating === 5).length, color: 'text-yellow-500' },
    { label: '4 Stars', value: reviews.filter(r => r.rating === 4).length, color: 'text-yellow-400' },
    { label: '3 Stars', value: reviews.filter(r => r.rating === 3).length, color: 'text-orange-400' },
    { label: '≤2 Stars', value: reviews.filter(r => r.rating <= 2).length, color: 'text-red-500' },
  ];

  return (
    <div className='min-h-screen bg-[#eaecf5] pt-20 pb-10'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 py-8'>

        {/* Header */}
        <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6'>
          <div>
            <Link to='/admin' className='text-xs text-gray-400 hover:text-blue-600 transition-colors flex items-center gap-1 mb-1 w-fit'>
              <ArrowLeft size={12} />
              Dashboard
            </Link>
            <h1 className='text-2xl sm:text-3xl font-bold text-gray-900'>Manage Reviews</h1>
          </div>
          <div className='flex items-center gap-2'>
            <span className='text-xs bg-yellow-50 text-yellow-600 px-3 py-1.5 rounded-full font-semibold flex items-center gap-1.5'>
              <Star size={12} />
              Avg: {avgRating} / 5
            </span>
            <span className='text-xs bg-blue-50 text-blue-600 px-3 py-1.5 rounded-full font-semibold'>
              {filteredReviews.length} reviews
            </span>
          </div>
        </div>

        {/* Alerts */}
        {success && (
          <div className='bg-green-50 border border-green-100 text-green-600 text-xs rounded-2xl px-4 py-3 mb-4 flex items-center justify-center gap-2'>
            <CheckCircle size={14} />
            {success}
          </div>
        )}
        {error && (
          <div className='bg-red-50 border border-red-100 text-red-500 text-xs rounded-2xl px-4 py-3 mb-4 flex items-center justify-center gap-2'>
            <XCircle size={14} />
            {error}
          </div>
        )}

        {/* Stats */}
        <div className='grid grid-cols-3 sm:grid-cols-5 gap-3 mb-5'>
          {stats.map((stat, i) => (
            <button
              key={i}
              onClick={() => setFilterRating(stat.label === 'Total' ? 0 : stat.label === '≤2 Stars' ? 2 : parseInt(stat.label))}
              className={`bg-white rounded-2xl shadow-sm p-3 sm:p-4 text-center transition-all hover:shadow-md active:scale-95 ${
                filterRating === (stat.label === 'Total' ? 0 : stat.label === '≤2 Stars' ? 2 : parseInt(stat.label))
                  ? 'ring-2 ring-blue-500 shadow-md'
                  : ''
              }`}
            >
              <p className={`text-xl sm:text-2xl font-black mb-0.5 ${stat.color}`}>{stat.value}</p>
              <p className='text-xs text-gray-400 font-medium'>{stat.label}</p>
            </button>
          ))}
        </div>

        {/* Filter Pills */}
        <div className='flex items-center gap-2 mb-4 flex-wrap'>
          {[0, 5, 4, 3, 2, 1].map((rating) => (
            <button
              key={rating}
              onClick={() => setFilterRating(rating)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                filterRating === rating
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-white text-gray-500 hover:bg-gray-50 border border-gray-100'
              }`}
            >
              {rating === 0 ? 'All' : (
                <>
                  {rating} <span className='text-yellow-400'>★</span>
                </>
              )}
            </button>
          ))}
        </div>

        {/* Reviews List */}
        <div className='bg-white rounded-2xl shadow-sm overflow-hidden'>
          <div className='px-5 py-4 border-b border-gray-50 flex items-center justify-between'>
            <h2 className='text-sm font-bold text-gray-900 flex items-center gap-2'>
              <Star size={14} className='text-yellow-400' />
              {filterRating ? `${filterRating} Star Reviews` : 'All Reviews'}
            </h2>
            {filteredReviews.length > 0 && (
              <span className='text-xs text-gray-400'>{filteredReviews.length} results</span>
            )}
          </div>

          {loading ? (
            <div className='flex justify-center items-center h-40'>
              <div className='w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin' />
            </div>
          ) : filteredReviews.length === 0 ? (
            <div className='text-center py-16'>
              <Star size={40} className='text-gray-200 mx-auto mb-3' />
              <p className='text-gray-400 text-sm font-medium'>No reviews found</p>
            </div>
          ) : (
            <div className='divide-y divide-gray-50'>
              {filteredReviews.map((review, idx) => (
                <div
                  key={review._id}
                  className='p-4 sm:p-5 hover:bg-gray-50 transition-colors'
                  style={{ animation: `fadeSlideUp 0.4s ease-out ${idx * 0.05}s both` }}
                >
                  <div className='flex gap-4'>

                    {/* Avatar */}
                    <div className='w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white font-bold text-sm flex-shrink-0'>
                      {review.user?.name?.charAt(0).toUpperCase()}
                    </div>

                    {/* Content */}
                    <div className='flex-1 min-w-0'>
                      <div className='flex items-start justify-between gap-2 mb-1'>
                        <div>
                          <div className='flex items-center gap-2 flex-wrap'>
                            <p className='text-sm font-bold text-gray-900'>{review.user?.name}</p>
                            <span className='text-xs text-gray-400 flex items-center gap-1'>
                              <User size={10} />
                              {review.user?.email}
                            </span>
                          </div>
                          <div className='flex items-center gap-2 mt-0.5'>
                            <StarDisplay rating={review.rating} />
                            <span className='text-xs font-semibold text-gray-700'>{review.rating}/5</span>
                          </div>
                        </div>
                        <button
                          onClick={() => setDeleteConfirm(review._id)}
                          className='flex items-center gap-1.5 px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-500 text-xs font-semibold rounded-xl transition-colors flex-shrink-0'
                        >
                          <Trash2 size={12} />
                          <span className='hidden sm:block'>Delete</span>
                        </button>
                      </div>

                      {/* Car info */}
                      <div className='flex items-center gap-1.5 text-xs text-gray-400 mb-2'>
                        <Car size={10} />
                        <span className='font-medium text-gray-600'>
                          {review.car?.brand} {review.car?.model}
                        </span>
                        <span>•</span>
                        <Calendar size={10} />
                        <span>{new Date(review.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                      </div>

                      {/* Comment */}
                      <div className='bg-gray-50 rounded-xl px-3 py-2.5'>
                        <p className='text-xs text-gray-600 leading-relaxed'>"{review.comment}"</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Delete Modal */}
        {deleteConfirm && (
          <div className='fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 px-4'>
            <div className='bg-white rounded-2xl shadow-xl p-6 max-w-sm w-full' style={{ animation: 'scaleIn 0.2s ease-out forwards' }}>
              <div className='w-12 h-12 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-4'>
                <Trash2 size={22} className='text-red-500' />
              </div>
              <h3 className='text-sm font-bold text-gray-900 text-center mb-1'>Delete Review</h3>
              <p className='text-xs text-gray-400 text-center mb-5'>Are you sure? This cannot be undone.</p>
              <div className='flex gap-3'>
                <button
                  onClick={() => handleDelete(deleteConfirm)}
                  className='flex-1 py-2.5 bg-red-500 hover:bg-red-600 text-white text-xs font-semibold rounded-xl transition-colors flex items-center justify-center gap-1.5'
                >
                  <Trash2 size={12} />
                  Delete
                </button>
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className='flex-1 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-600 text-xs font-semibold rounded-xl transition-colors'
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageReviews;