import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  FaCar,
  FaUsers,
  FaShieldAlt,
  FaAward,
  FaStar,
  FaQuoteLeft,
  FaCalendarAlt,
  FaCheckCircle
} from 'react-icons/fa';
import api from '../services/api';

const About = () => {
  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch reviews from backend
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await api.get('/reviews');
        setReviews(response.data.slice(0, 4)); // Display fewer reviews for conciseness
        setError(null);
      } catch (error) {
        console.error('Error fetching reviews:', error);
        setError(error.response?.data?.message || 'Failed to load reviews');
      } finally {
        setReviewsLoading(false);
      }
    };
    fetchReviews();
  }, []);

  const stats = [
    { number: '500+', label: 'Happy Customers', icon: FaUsers },
    { number: '50+', label: 'Premium Cars', icon: FaCar },
    { number: '98%', label: 'Satisfaction', icon: FaAward },
  ];

  const values = [
    {
      icon: FaShieldAlt,
      title: 'Trust & Safety',
      description: 'All vehicles are fully insured and regularly maintained for your peace of mind.',
    },
    {
      icon: FaAward,
      title: 'Quality Service',
      description: 'Premium cars with exceptional service at competitive prices.',
    },
    {
      icon: FaStar,
      title: 'Transparent Pricing',
      description: 'No hidden fees. What you see is what you pay, always.',
    },
  ];

  // Render star rating
  const renderStars = (rating) => {
    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <FaStar
            key={star}
            className={`w-3 h-3 ${
              star <= rating
                ? 'text-yellow-400'
                : 'text-gray-300'
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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 pt-20">
      {/* Hero Section */}
      <section className="bg-white py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl font-extrabold text-gray-900 mb-4"
          >
            About CarRental
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-lg text-gray-700 leading-relaxed"
          >
            Your trusted partner for premium car rentals. We offer a seamless experience with a diverse fleet and exceptional customer service.
          </motion.p>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className="text-center p-6 bg-white rounded-lg shadow-sm"
                >
                  <Icon className="w-8 h-8 text-gray-800 mx-auto mb-3" />
                  <div className="text-3xl font-bold text-gray-900 mb-1">
                    {stat.number}
                  </div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Our Story & Mission */}
      <section className="bg-white py-16">
        <div className="max-w-4xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              <h2 className="text-3xl font-bold text-gray-900">Our Story & Mission</h2>
              <p className="text-gray-700 leading-relaxed">
                Founded in 2020, CarRental set out to redefine the car rental experience. We believe in making luxury and convenience accessible to everyone, ensuring every journey is memorable and hassle-free.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Our mission is to provide top-tier vehicles, transparent pricing, and unparalleled customer support, making us the preferred choice for travelers and locals alike.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <img
                src="https://images.unsplash.com/photo-1549399542-747805177964?q=80&w=1932&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                alt="Modern car interior"
                className="rounded-lg shadow-md w-full h-auto"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-4xl mx-auto px-4">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-3xl font-bold text-gray-900 text-center mb-10"
          >
            Our Core Values
          </motion.h2>
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid md:grid-cols-3 gap-8"
          >
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className="bg-white p-6 rounded-lg shadow-sm text-center"
                >
                  <Icon className="w-8 h-8 text-gray-800 mx-auto mb-3" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {value.title}
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {value.description}
                  </p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Customer Reviews Section */}
      <section className="bg-white py-16">
        <div className="max-w-4xl mx-auto px-4">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-3xl font-bold text-gray-900 text-center mb-10"
          >
            What Our Customers Say
          </motion.h2>
          <div className="bg-gray-50 rounded-lg shadow-md overflow-hidden">
            {/* Header */}
            <div className="p-6 border-b border-gray-100">
              {reviews.length > 0 && (
                <div className="flex items-center justify-center gap-4">
                  <div className="text-right">
                    <div className="text-3xl font-bold text-gray-900">{averageRating}</div>
                    <div className="text-sm text-gray-600">out of 5</div>
                  </div>
                  <div>
                    {renderStars(Math.round(averageRating))}
                    <div className="text-sm text-gray-600 mt-1">{reviews.length} reviews</div>
                  </div>
                </div>
              )}
            </div>

            {/* Reviews List */}
            <div>
              {reviewsLoading ? (
                <div className="p-12 text-center">
                  <div className="inline-block w-6 h-6 border-2 border-gray-800 border-t-transparent rounded-full animate-spin" />
                </div>
              ) : error ? (
                <div className="p-12 text-center">
                  <p className="text-sm text-red-500 mb-2">{error}</p>
                  <button
                    onClick={() => window.location.reload()}
                    className="text-gray-800 text-sm hover:underline"
                  >
                    Try again
                  </button>
                </div>
              ) : reviews.length === 0 ? (
                <div className="p-12 text-center text-gray-500">
                  <FaQuoteLeft className="w-12 h-12 mx-auto mb-3 text-gray-300" />
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
                      className="p-6 hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex gap-4">
                        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-800 font-bold text-md flex-shrink-0">
                          {getUserName(review).charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between flex-wrap gap-2 mb-1">
                            <span className="font-semibold text-gray-900 text-sm">
                              {getUserName(review)}
                            </span>
                            {renderStars(review.rating)}
                          </div>
                          <p className="text-sm text-gray-700 leading-relaxed italic mt-1">
                            "{review.comment}"
                          </p>
                          <span className="text-xs text-gray-500 flex items-center gap-1 mt-2">
                            <FaCalendarAlt className="w-3 h-3" />
                            {formatDate(review.createdAt)}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gray-900 py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl font-bold text-white mb-4">
              Ready for Your Next Adventure?
            </h2>
            <p className="text-base text-gray-300 mb-8">
              Explore our fleet and book your perfect car today.
            </p>
            <a
              href="/cars"
              className="inline-flex items-center justify-center gap-2 bg-white text-gray-900 px-8 py-3 rounded-md font-semibold hover:bg-gray-200 transition-all"
            >
              Browse Cars
              <FaCar className="w-4 h-4" />
            </a>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default About;
