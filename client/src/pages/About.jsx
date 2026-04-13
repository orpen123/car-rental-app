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
  FaCheckCircle,
  FaArrowRight,
} from 'react-icons/fa';
import api from '../services/api';

const About = () => {
  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await api.get('/reviews');
        setReviews(response.data.slice(0, 4));
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
      description:
        'All vehicles are fully insured and regularly maintained for your peace of mind.',
    },
    {
      icon: FaAward,
      title: 'Quality Service',
      description:
        'Premium cars with exceptional service at competitive prices.',
    },
    {
      icon: FaStar,
      title: 'Transparent Pricing',
      description: 'No hidden fees. What you see is what you pay, always.',
    },
  ];

  const renderStars = (rating) => (
    <div className='flex items-center gap-0.5'>
      {[1, 2, 3, 4, 5].map((star) => (
        <FaStar
          key={star}
          className={`w-3.5 h-3.5 ${star <= rating ? 'text-blue-500' : 'text-gray-200'}`}
        />
      ))}
    </div>
  );

  const getUserName = (review) => {
    if (review.user?.name) return review.user.name;
    if (review.userId?.name) return review.userId.name;
    return 'Customer';
  };

  const formatDate = (date) => {
    if (!date) return 'Recently';
    const d = new Date(date);
    if (isNaN(d.getTime())) return 'Recently';
    return `${d.getMonth() + 1}/${d.getFullYear()}`;
  };

  const averageRating =
    reviews.length > 0
      ? (
          reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
        ).toFixed(1)
      : 0;

  const fadeUp = {
    hidden: { opacity: 0, y: 28 },
    visible: (i = 0) => ({
      opacity: 1,
      y: 0,
      transition: { duration: 0.55, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] },
    }),
  };

  const stagger = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.1, delayChildren: 0.15 } },
  };

  return (
    <div className='min-h-screen bg-white text-gray-900 pt-20 font-sans'>
      {}
      <section className='relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-slate-50 py-24 md:py-32'>
        {}
        <div className='pointer-events-none absolute -top-32 -right-32 w-[420px] h-[420px] rounded-full bg-blue-100/60 blur-3xl' />
        <div className='pointer-events-none absolute bottom-0 left-0 w-64 h-64 rounded-full bg-blue-50 blur-2xl' />

        <div className='relative max-w-4xl mx-auto px-4 sm:px-6 text-center'>
          <motion.span
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.45 }}
            className='inline-block mb-4 px-4 py-1.5 rounded-full bg-blue-600/10 text-blue-600 text-xs sm:text-sm font-semibold tracking-widest uppercase'
          >
            Who We Are
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.1 }}
            className='text-4xl sm:text-5xl md:text-6xl font-extrabold text-blue-600 leading-tight mb-5'
          >
            Drive with Confidence
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.2 }}
            className='text-base sm:text-lg md:text-xl text-gray-600 leading-relaxed max-w-2xl mx-auto'
          >
            Your trusted partner for premium car rentals — seamless experience,
            diverse fleet, and customer service that goes the extra mile.
          </motion.p>
        </div>
      </section>

      {}
      <section className='bg-white py-14 md:py-20'>
        <div className='max-w-5xl mx-auto px-4 sm:px-6'>
          <motion.div
            variants={stagger}
            initial='hidden'
            whileInView='visible'
            viewport={{ once: true }}
            className='grid grid-cols-1 sm:grid-cols-3 gap-6'
          >
            {stats.map((stat, i) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={i}
                  custom={i}
                  variants={fadeUp}
                  className='group relative flex flex-col items-center text-center p-8 rounded-2xl border border-gray-100 bg-white shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300'
                >
                  <div className='mb-4 w-14 h-14 rounded-xl bg-blue-600/10 flex items-center justify-center group-hover:bg-blue-600 transition-colors duration-300'>
                    <Icon className='w-6 h-6 text-blue-600 group-hover:text-white transition-colors duration-300' />
                  </div>
                  <div className='text-4xl font-black text-blue-600 mb-1'>
                    {stat.number}
                  </div>
                  <div className='text-sm font-medium text-gray-500 uppercase tracking-wider'>
                    {stat.label}
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {}
      <section className='bg-slate-50 py-16 md:py-24'>
        <div className='max-w-5xl mx-auto px-4 sm:px-6'>
          <div className='grid md:grid-cols-2 gap-12 lg:gap-16 items-center'>
            {}
            <motion.div
              initial={{ opacity: 0, x: -24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className='space-y-4 sm:space-y-5 max-w-xl'
            >
              {}
              <span className='inline-block px-3 sm:px-4 py-1 rounded-full bg-blue-600/10 text-blue-600 text-[10px] sm:text-xs font-semibold tracking-widest uppercase'>
                Our Story
              </span>

              {}
              <h2 className='text-2xl sm:text-3xl md:text-4xl font-extrabold text-blue-600 leading-tight sm:leading-snug'>
                Built to Redefine
                <br className='hidden sm:block' />
                Car Rentals
              </h2>

              {}
              <p className='text-gray-600 leading-relaxed text-sm sm:text-base'>
                Founded in 2020, CarRental was created to bring luxury and
                convenience together — making every journey smooth, memorable,
                and accessible.
              </p>

              <p className='text-gray-600 leading-relaxed text-sm sm:text-base'>
                We focus on premium vehicles, transparent pricing, and reliable
                support, becoming a trusted choice for travelers and locals
                alike.
              </p>

              {}
              <ul className='space-y-2 pt-2'>
                {[
                  'Fully insured fleet',
                  'No hidden charges',
                  '24/7 customer support',
                ].map((item) => (
                  <li
                    key={item}
                    className='flex items-start gap-2.5 text-sm sm:text-base text-gray-700'
                  >
                    <FaCheckCircle className='text-blue-600 w-4 h-4 mt-[2px] flex-shrink-0' />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            {}
            <motion.div
              initial={{ opacity: 0, x: 24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className='relative  md:space-y-0  sm:w-full mx-auto '
            >
              <div className='absolute inset-0 -m-3 rounded-3xl bg-blue-600/8 rotate-1' />

              <img
                src='https://res.cloudinary.com/dstpycxwd/image/upload/v1774373575/top_dj5hnx.png'
                alt='Modern car interior'
                className='rounded-2xl shadow-xl w-full object-cover  md:h-auto md:aspect-[16/9]'
              />

              <img
                src='https://res.cloudinary.com/dstpycxwd/image/upload/v1776110128/073ab3ac-f708-4ede-acda-73a97182b1b8.png'
                alt='Modern car interior'
                className='rounded-2xl shadow-xl w-full object-cover  md:h-auto md:aspect-[16/9]'
              />
              {}
              <div className='absolute -bottom-5 -left-5 bg-white rounded-xl shadow-lg px-4 py-3 flex items-center gap-3 border border-gray-100'>
                <div className='w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center'>
                  <FaCar className='text-white w-4 h-4' />
                </div>
                <div>
                  <p className='text-xs text-gray-500'>Est.</p>
                  <p className='text-sm font-bold text-blue-600'>2020</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {}
      <section className='bg-white py-16 md:py-24'>
        <div className='max-w-5xl mx-auto px-4 sm:px-6'>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className='text-center mb-12'
          >
            <span className='inline-block mb-3 px-4 py-1.5 rounded-full bg-blue-600/10 text-blue-600 text-xs font-semibold tracking-widest uppercase'>
              What We Stand For
            </span>
            <h2 className='text-3xl sm:text-4xl font-extrabold text-blue-600'>
              Our Core Values
            </h2>
          </motion.div>

          <motion.div
            variants={stagger}
            initial='hidden'
            whileInView='visible'
            viewport={{ once: true }}
            className='grid sm:grid-cols-2 md:grid-cols-3 gap-6'
          >
            {values.map((value, i) => {
              const Icon = value.icon;
              return (
                <motion.div
                  key={i}
                  custom={i}
                  variants={fadeUp}
                  className='group relative p-7 rounded-2xl border border-gray-100 bg-white hover:border-blue-100 hover:shadow-md transition-all duration-300 overflow-hidden'
                >
                  {}
                  <div className='absolute top-0 right-0 w-20 h-20 bg-blue-50 rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-300' />
                  <div className='relative'>
                    <div className='mb-4 w-12 h-12 rounded-lg bg-blue-600/10 flex items-center justify-center group-hover:bg-blue-600 transition-colors duration-300'>
                      <Icon className='w-5 h-5 text-blue-600 group-hover:text-white transition-colors duration-300' />
                    </div>
                    <h3 className='text-base sm:text-lg font-bold text-blue-600 mb-2'>
                      {value.title}
                    </h3>
                    <p className='text-sm text-gray-500 leading-relaxed'>
                      {value.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {}
      <section className='bg-slate-50 py-16 md:py-24'>
        <div className='max-w-5xl mx-auto px-4 sm:px-6'>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className='text-center mb-12'
          >
            <span className='inline-block mb-3 px-4 py-1.5 rounded-full bg-blue-600/10 text-blue-600 text-xs font-semibold tracking-widest uppercase'>
              Testimonials
            </span>
            <h2 className='text-3xl sm:text-4xl font-extrabold text-blue-600'>
              What Our Customers Say
            </h2>
          </motion.div>

          {}
          {reviews.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className='flex flex-col sm:flex-row items-center justify-center gap-4 mb-10 p-6 bg-white rounded-2xl border border-gray-100 shadow-sm max-w-sm mx-auto'
            >
              <div className='text-5xl font-black text-blue-600'>
                {averageRating}
              </div>
              <div className='text-center sm:text-left'>
                {renderStars(Math.round(averageRating))}
                <p className='text-xs text-gray-400 mt-1'>
                  {reviews.length} verified reviews
                </p>
              </div>
            </motion.div>
          )}

          {}
          {reviewsLoading ? (
            <div className='flex justify-center py-16'>
              <div className='w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin' />
            </div>
          ) : error ? (
            <div className='text-center py-16'>
              <p className='text-sm text-red-500 mb-3'>{error}</p>
              <button
                onClick={() => window.location.reload()}
                className='text-blue-600 text-sm font-medium hover:underline'
              >
                Try again
              </button>
            </div>
          ) : reviews.length === 0 ? (
            <div className='text-center py-16 text-gray-400'>
              <FaQuoteLeft className='w-10 h-10 mx-auto mb-3 opacity-40' />
              <p className='text-sm'>
                No reviews yet. Be the first to share your experience!
              </p>
            </div>
          ) : (
            <motion.div
              variants={stagger}
              initial='hidden'
              whileInView='visible'
              viewport={{ once: true }}
              className='grid sm:grid-cols-2 gap-5'
            >
              {reviews.map((review, i) => (
                <motion.div
                  key={review._id}
                  custom={i}
                  variants={fadeUp}
                  className='bg-white rounded-2xl border border-gray-100 shadow-sm p-6 hover:shadow-md transition-shadow duration-300'
                >
                  <FaQuoteLeft className='text-blue-100 w-7 h-7 mb-3' />
                  <p className='text-sm sm:text-base text-gray-600 leading-relaxed italic mb-5'>
                    "{review.comment}"
                  </p>
                  <div className='flex items-center justify-between flex-wrap gap-3 pt-4 border-t border-gray-100'>
                    <div className='flex items-center gap-3'>
                      <div className='w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0'>
                        {getUserName(review).charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className='text-sm font-semibold text-blue-600'>
                          {getUserName(review)}
                        </p>
                        <p className='text-xs text-gray-400 flex items-center gap-1'>
                          <FaCalendarAlt className='w-2.5 h-2.5' />
                          {formatDate(review.createdAt)}
                        </p>
                      </div>
                    </div>
                    {renderStars(review.rating)}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </section>

      {}
      <section className='relative overflow-hidden bg-blue-600 py-20 md:py-28'>
        {}
        <div className='pointer-events-none absolute -top-20 -right-20 w-72 h-72 rounded-full bg-white/10' />
        <div className='pointer-events-none absolute -bottom-16 -left-16 w-56 h-56 rounded-full bg-white/5' />

        <div className='relative max-w-3xl mx-auto px-4 sm:px-6 text-center'>
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55 }}
          >
            <h2 className='text-3xl sm:text-4xl md:text-5xl font-extrabold text-white mb-4 leading-tight'>
              Ready for Your
              <br className='hidden sm:block' /> Next Adventure?
            </h2>
            <p className='text-blue-100 text-sm sm:text-base mb-10 max-w-lg mx-auto'>
              Explore our premium fleet and book your perfect car today. Fast,
              easy, transparent.
            </p>
            <a
              href='/cars'
              className='inline-flex items-center gap-2.5 bg-white text-blue-600 px-8 py-3.5 rounded-full font-bold text-sm sm:text-base shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200'
            >
              Browse Our Fleet
              <FaArrowRight className='w-3.5 h-3.5' />
            </a>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default About;
