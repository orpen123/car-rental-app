// pages/About.jsx
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Car, Users, Shield, Clock, Award, Star, Quote, User, Calendar } from 'lucide-react';
import api from '../services/api';

const About = () => {
  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch reviews from backend
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        console.log('Fetching from:', api.defaults.baseURL + '/reviews');
        
        // ✅ FIX: Remove '/api' since it's already in baseURL
        const response = await api.get('/reviews');
        
        console.log('Reviews fetched:', response.data);
        setReviews(response.data.slice(0, 4)); // Show only 4 latest reviews
        setError(null);
      } catch (error) {
        console.error('Error fetching reviews:', error);
        console.error('Error response:', error.response?.data);
        setError(error.response?.data?.message || 'Failed to load reviews');
      } finally {
        setReviewsLoading(false);
      }
    };
    fetchReviews();
  }, []);

  const stats = [
    { number: '500+', label: 'Happy Customers', icon: Users },
    { number: '50+', label: 'Luxury Cars', icon: Car },
    { number: '98%', label: 'Satisfaction', icon: Award },
    { number: '24/7', label: 'Support', icon: Clock },
  ];

  const values = [
    {
      icon: Shield,
      title: 'Trust & Safety',
      description: 'All vehicles are fully insured and regularly maintained.',
    },
    {
      icon: Award,
      title: 'Quality Service',
      description: 'Premium cars with exceptional service at competitive prices.',
    },
    {
      icon: Star,
      title: 'Best Price',
      description: 'No hidden fees. What you see is what you pay.',
    },
  ];

  // Render star rating
  const renderStars = (rating) => {
    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-3 h-3 ${
              star <= rating 
                ? 'text-yellow-400 fill-yellow-400' 
                : 'text-gray-300 fill-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };

  // Get user name from user object or ID
  const getUserName = (review) => {
    if (review.user?.name) return review.user.name;
    if (typeof review.user === 'object' && review.user.name) return review.user.name;
    if (review.userId?.name) return review.userId.name;
    return 'Customer';
  };

  // Format date
  const formatDate = (date) => {
    if (!date) return 'Recently';
    const d = new Date(date);
    if (isNaN(d.getTime())) return 'Recently';
    return `${d.getMonth() + 1}/${d.getFullYear()}`;
  };

  // Calculate average rating
  const averageRating = reviews.length > 0
    ? (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1)
    : 0;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pt-20">
      {/* Hero Section */}
      <section className="bg-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-3xl md:text-4xl font-bold mb-3"
          >
            Your Journey, Our Passion
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-base text-blue-100 max-w-2xl mx-auto"
          >
            Premium car rental service with transparent pricing and exceptional customer care.
          </motion.p>
        </div>
      </section>

      {/* Stats Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.4 }}
                className="text-center"
              >
                <div className="inline-flex p-2 bg-blue-100 rounded-xl mb-2">
                  <Icon className="w-5 h-5 text-blue-600" />
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-0.5">
                  {stat.number}
                </div>
                <div className="text-xs text-gray-600">{stat.label}</div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Our Story */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="space-y-4"
          >
            <h2 className="text-2xl font-bold text-gray-900">Our Story</h2>
            <p className="text-sm text-gray-600 leading-relaxed">
              Founded in 2020, CarRental began with a simple mission: to make premium car rental 
              accessible, transparent, and hassle-free.
            </p>
            <p className="text-sm text-gray-600 leading-relaxed">
              Today, we're proud to serve thousands of customers with our growing fleet of 
              quality vehicles. Your satisfaction is our priority.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <img
                    key={i}
                    src={`https://randomuser.me/api/portraits/men/${i}.jpg`}
                    alt="Team member"
                    className="w-8 h-8 rounded-full border-2 border-white"
                  />
                ))}
              </div>
              <div className="text-xs text-gray-600">
                <span className="font-semibold text-gray-900">500+</span> customers served
              </div>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="relative"
          >
            <img
              src="https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800"
              alt="Luxury car fleet"
              className="rounded-2xl shadow-lg w-full h-auto"
            />
          </motion.div>
        </div>
      </section>

      {/* Our Values */}
      <section className="bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="text-center mb-8"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-1">Our Values</h2>
            <p className="text-sm text-gray-600">What makes us different</p>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-6">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.4 }}
                  className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition-shadow"
                >
                  <div className="inline-flex p-2 bg-blue-100 rounded-xl mb-3">
                    <Icon className="w-5 h-5 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-1">
                    {value.title}
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {value.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Customer Reviews Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-5">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Customer Reviews</h2>
                <p className="text-sm text-gray-600">What our customers say about us</p>
              </div>
              {reviews.length > 0 && (
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="text-2xl font-bold text-blue-600">{averageRating}</div>
                    <div className="text-xs text-gray-500">out of 5</div>
                  </div>
                  <div>
                    {renderStars(Math.round(averageRating))}
                    <div className="text-xs text-gray-500 mt-1">{reviews.length} reviews</div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Reviews List */}
          <div>
            {reviewsLoading ? (
              <div className="p-12 text-center">
                <div className="inline-block w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : error ? (
              <div className="p-12 text-center">
                <p className="text-sm text-red-500 mb-2">{error}</p>
                <button 
                  onClick={() => window.location.reload()}
                  className="text-blue-600 text-sm hover:underline"
                >
                  Try again
                </button>
              </div>
            ) : reviews.length === 0 ? (
              <div className="p-12 text-center text-gray-500">
                <Quote className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p className="text-sm">No reviews yet. Be the first to share your experience!</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {reviews.map((review, index) => (
                  <motion.div
                    key={review._id}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.05, duration: 0.3 }}
                    className="p-5 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex gap-3">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                        {getUserName(review).charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between flex-wrap gap-2 mb-1">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-gray-900 text-sm">
                              {getUserName(review)}
                            </span>
                            <span className="text-xs text-gray-400 flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {formatDate(review.createdAt)}
                            </span>
                          </div>
                          {renderStars(review.rating)}
                        </div>
                        <p className="text-sm text-gray-600 leading-relaxed mt-1">
                          "{review.comment}"
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-700 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-2xl font-bold text-white mb-2">
              Ready to Start Your Journey?
            </h2>
            <p className="text-sm text-blue-100 mb-5">
              Choose from our premium fleet and experience the best car rental service
            </p>
            <a
              href="/cars"
              className="inline-flex items-center gap-2 bg-white text-blue-600 px-6 py-2.5 rounded-xl font-semibold hover:shadow-lg transition-all text-sm"
            >
              Browse Cars
              <Car className="w-4 h-4" />
            </a>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default About;