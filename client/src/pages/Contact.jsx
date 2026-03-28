import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Select from 'react-select';
import {
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkerAlt,
  FaClock,
  FaArrowRight,
  FaCheckCircle,
  FaUser,
  FaCommentDots,
  FaPaperPlane,
  FaCar,
  FaExclamationCircle,
} from 'react-icons/fa';
import api from '../services/api';


const selectStyles = () => ({
  control: (base, state) => ({
    ...base,
    minHeight: '46px',
    borderRadius: '12px',
    borderWidth: '1px',
    borderColor: state.isFocused ? '#2563eb' : '#e5e7eb',
    boxShadow: state.isFocused ? '0 0 0 3px rgba(37,99,235,0.12)' : 'none',
    backgroundColor: '#fff',
    fontSize: '14px',
    cursor: 'pointer',
    transition: 'border-color 0.2s, box-shadow 0.2s',
    '&:hover': { borderColor: '#93c5fd' },
  }),
  valueContainer: (base) => ({ ...base, padding: '0 14px' }),
  placeholder: (base) => ({ ...base, color: '#9ca3af', fontSize: '14px' }),
  singleValue: (base) => ({ ...base, color: '#1e3a5f', fontWeight: 600, fontSize: '14px' }),
  indicatorSeparator: () => ({ display: 'none' }),
  dropdownIndicator: (base, state) => ({
    ...base,
    color: state.isFocused ? '#2563eb' : '#9ca3af',
    transition: 'transform 0.25s, color 0.2s',
    transform: state.selectProps.menuIsOpen ? 'rotate(180deg)' : 'rotate(0deg)',
    paddingRight: '12px',
  }),
  menu: (base) => ({
    ...base,
    borderRadius: '14px',
    border: '1px solid #dbeafe',
    boxShadow: '0 10px 40px rgba(37,99,235,0.12)',
    overflow: 'hidden',
    marginTop: '6px',
    zIndex: 50,
  }),
  menuList: (base) => ({ ...base, padding: '6px' }),
  option: (base, state) => ({
    ...base,
    borderRadius: '8px',
    fontSize: '13px',
    fontWeight: state.isSelected ? 600 : 400,
    color: state.isSelected ? '#fff' : '#374151',
    backgroundColor: state.isSelected
      ? '#2563eb'
      : state.isFocused
      ? '#eff6ff'
      : 'transparent',
    padding: '10px 14px',
    cursor: 'pointer',
    transition: 'background 0.15s',
  }),
});

const subjectOptions = [
  { value: 'booking', label: '🚗  Booking Inquiry'  },
  { value: 'support', label: '🛠️  Customer Support' },
  { value: 'fleet',   label: '🚙  Fleet / Cars'      },
  { value: 'pricing', label: '💰  Pricing'           },
  { value: 'other',   label: '💬  Other'             },
];


const heroVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.13, delayChildren: 0.05 } },
};
const heroItem = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};
const cardStagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.09, delayChildren: 0.15 } },
};
const cardItem = {
  hidden: { opacity: 0, y: 22, scale: 0.97 },
  visible: (i) => ({
    opacity: 1, y: 0, scale: 1,
    transition: { duration: 0.5, delay: i * 0.07, ease: [0.22, 1, 0.36, 1] },
  }),
};
const panelVariants = {
  hidden: { opacity: 0, x: -28 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] } },
};
const formVariants = {
  hidden: { opacity: 0, x: 28 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] } },
};
const fieldVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07, delayChildren: 0.1 } },
};
const fieldItem = {
  hidden: { opacity: 0, y: 14 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } },
};
const successVariants = {
  hidden: { opacity: 0, scale: 0.88, y: 16 },
  visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
  exit: { opacity: 0, scale: 0.92, y: -10, transition: { duration: 0.3 } },
};


const Contact = () => {
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: null, message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [focused, setFocused] = useState('');

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const handleSelectChange = (option) => { setForm({ ...form, subject: option }); setError(null); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.subject) { setError('Please select a topic.'); return; }
    setLoading(true);
    setError(null);
    try {
      await api.post('/contact', { ...form, subject: form.subject.value });
      setSubmitted(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const contactInfo = [
    { icon: FaPhoneAlt,     label: 'Call Us',       value: '+212 600 000 000',   sub: 'Mon–Sat, 9am – 7pm',  href: 'tel:+212600000000'           },
    { icon: FaEnvelope,     label: 'Email Us',      value: 'hello@carrental.ma', sub: 'We reply within 24h', href: 'mailto:hello@carrental.ma'   },
    { icon: FaMapMarkerAlt, label: 'Find Us',       value: 'Rabat, Morocco',     sub: 'Open for walk-ins',   href: '#'                           },
    { icon: FaClock,        label: 'Working Hours', value: '9:00 AM – 7:00 PM',  sub: 'Monday to Saturday',  href: null                          },
  ];

  const inputCls = (name) =>
    `w-full bg-white border rounded-xl px-4 py-3 text-sm text-gray-800 placeholder-gray-400 outline-none transition-all duration-200 ${
      focused === name
        ? 'border-blue-500 ring-2 ring-blue-100 shadow-sm'
        : 'border-gray-200 hover:border-blue-300'
    }`;

  return (
    <div className="min-h-screen bg-white pt-20 overflow-x-hidden">

      {}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 py-20 md:py-28">
        <div className="pointer-events-none absolute -top-24 -right-24 w-96 h-96 rounded-full bg-white/5" />
        <div className="pointer-events-none absolute -bottom-20 -left-20 w-72 h-72 rounded-full bg-white/5" />
        <motion.div
          className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[520px] h-[520px] rounded-full bg-blue-500/20 blur-3xl"
          animate={{ scale: [1, 1.08, 1] }}
          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
        />
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              'linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />

        <motion.div
          variants={heroVariants}
          initial="hidden"
          animate="visible"
          className="relative max-w-4xl mx-auto px-5 sm:px-6 text-center"
        >
          <motion.div variants={heroItem}
            className="inline-flex items-center gap-2 mb-5 px-4 py-1.5 rounded-full bg-white/15 border border-white/20 text-white text-xs font-semibold tracking-widest uppercase"
          >
            <FaCar className="w-3 h-3" /> Get In Touch
          </motion.div>

          <motion.h1 variants={heroItem}
            className="text-3xl sm:text-5xl md:text-6xl font-extrabold text-white leading-tight mb-4"
          >
            We're Here to{' '}
            <br className="hidden sm:block" />
            <span className="text-blue-200">Help You</span>
          </motion.h1>

          <motion.p variants={heroItem}
            className="text-blue-100 text-sm sm:text-lg max-w-xl mx-auto leading-relaxed"
          >
            Have a question about a booking, a car, or anything else?
            Send us a message and we'll get back to you promptly.
          </motion.p>

          {}
          <motion.div
            variants={heroItem}
            className="mt-10 flex justify-center"
          >
            <motion.div
              animate={{ y: [0, 7, 0] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut', delay: 0.8 }}
              className="w-8 h-8 rounded-full border-2 border-white/30 flex items-center justify-center"
            >
              <svg className="w-3 h-3 text-white/60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </motion.div>
          </motion.div>
        </motion.div>
      </section>

      {}
      <section className="bg-white py-10 md:py-14">
        <div className="max-w-5xl mx-auto px-5 sm:px-6">
          <motion.div
            variants={cardStagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4"
          >
            {contactInfo.map((item, i) => {
              const Icon = item.icon;
              const Tag = item.href && item.href !== '#' ? 'a' : 'div';
              return (
                <motion.div
                  key={i}
                  custom={i}
                  variants={cardItem}
                  whileHover={{ y: -5, transition: { duration: 0.22 } }}
                >
                  <Tag
                    href={item.href || undefined}
                    className="group flex flex-col items-center text-center p-4 sm:p-6 rounded-2xl border border-gray-100 bg-white hover:border-blue-200 hover:shadow-lg transition-all duration-300 h-full"
                  >
                    <div className="w-11 h-11 rounded-xl bg-blue-600/10 flex items-center justify-center mb-3 group-hover:bg-blue-600 transition-all duration-300 group-hover:shadow-md group-hover:shadow-blue-200">
                      <Icon className="w-4 h-4 text-blue-600 group-hover:text-white transition-colors duration-300" />
                    </div>
                    <p className="text-[10px] sm:text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">{item.label}</p>
                    <p className="text-xs sm:text-sm font-bold text-blue-600 leading-snug mb-0.5">{item.value}</p>
                    <p className="text-[10px] sm:text-xs text-gray-400">{item.sub}</p>
                  </Tag>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {}
      <section className="bg-slate-50 py-12 md:py-20">
        <div className="max-w-5xl mx-auto px-5 sm:px-6">
          <div className="grid md:grid-cols-5 gap-8 md:gap-10 items-start">

            {}
            <motion.div
              variants={panelVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-60px' }}
              className="md:col-span-2 space-y-6"
            >
              <div>
                <span className="inline-block px-3 py-1 rounded-full bg-blue-600/10 text-blue-600 text-[11px] font-semibold tracking-widest uppercase mb-3">
                  Send a Message
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-blue-600 leading-tight">
                  Let's Start a<br /> Conversation
                </h2>
                <p className="text-gray-500 text-sm mt-3 leading-relaxed">
                  Fill out the form and our team will reach out as soon as possible —
                  bookings, questions, or feedback, we're happy to help.
                </p>
              </div>

              <motion.ul
                variants={fieldVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="space-y-3"
              >
                {['Response within 24 hours', 'No spam, ever', 'Dedicated support team'].map((p, i) => (
                  <motion.li key={i} variants={fieldItem} className="flex items-center gap-3 text-sm text-gray-600">
                    <div className="w-6 h-6 rounded-full bg-blue-600/10 flex items-center justify-center flex-shrink-0">
                      <FaCheckCircle className="text-blue-600 w-3 h-3" />
                    </div>
                    {p}
                  </motion.li>
                ))}
              </motion.ul>

              {}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.55, delay: 0.2 }}
                whileHover={{ scale: 1.02, transition: { duration: 0.22 } }}
                className="hidden md:block relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 to-blue-700 p-6 text-white shadow-lg shadow-blue-200"
              >
                <div className="pointer-events-none absolute -top-10 -right-10 w-32 h-32 rounded-full bg-white/10" />
                <div className="pointer-events-none absolute -bottom-8 -left-8 w-24 h-24 rounded-full bg-white/5" />
                <FaCar className="w-7 h-7 mb-3 text-blue-200" />
                <p className="font-bold text-base mb-1">Need a car right now?</p>
                <p className="text-blue-100 text-xs leading-relaxed mb-4">
                  Browse our full fleet and book instantly — no waiting required.
                </p>
                <a
                  href="/cars"
                  className="inline-flex items-center gap-2 bg-white text-blue-600 text-xs font-bold px-4 py-2 rounded-full hover:shadow-md hover:gap-3 transition-all duration-200"
                >
                  Browse Cars <FaArrowRight className="w-3 h-3" />
                </a>
              </motion.div>
            </motion.div>

            {}
            <motion.div
              variants={formVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-60px' }}
              className="md:col-span-3"
            >
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
                <AnimatePresence mode="wait">
                  {submitted ? (
                    <motion.div
                      key="success"
                      variants={successVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      className="flex flex-col items-center justify-center text-center py-14 gap-4"
                    >
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', stiffness: 220, damping: 14, delay: 0.15 }}
                        className="w-20 h-20 rounded-full bg-blue-600/10 flex items-center justify-center"
                      >
                        <FaCheckCircle className="w-9 h-9 text-blue-600" />
                      </motion.div>
                      <motion.h3
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="text-2xl font-extrabold text-blue-600"
                      >
                        Message Sent!
                      </motion.h3>
                      <motion.p
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="text-gray-500 text-sm max-w-xs leading-relaxed"
                      >
                        Thanks for reaching out. Our team will get back to you within 24 hours.
                      </motion.p>
                      <motion.button
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.55 }}
                        onClick={() => {
                          setSubmitted(false);
                          setForm({ name: '', email: '', phone: '', subject: null, message: '' });
                        }}
                        className="mt-1 text-xs text-blue-600 font-semibold hover:underline"
                      >
                        Send another message
                      </motion.button>
                    </motion.div>
                  ) : (
                    <motion.form
                      key="form"
                      variants={fieldVariants}
                      initial="hidden"
                      animate="visible"
                      exit={{ opacity: 0, y: -10, transition: { duration: 0.25 } }}
                      onSubmit={handleSubmit}
                      className="space-y-4"
                    >
                      {/* Name + Email */}
                      <div className="grid sm:grid-cols-2 gap-4">
                        <motion.div variants={fieldItem} className="space-y-1.5">
                          <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-600">
                            <FaUser className="w-3 h-3 text-blue-600" /> Full Name
                          </label>
                          <input
                            type="text" name="name" value={form.name}
                            onChange={handleChange}
                            onFocus={() => setFocused('name')} onBlur={() => setFocused('')}
                            placeholder="John Doe" required
                            className={inputCls('name')}
                          />
                        </motion.div>
                        <motion.div variants={fieldItem} className="space-y-1.5">
                          <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-600">
                            <FaEnvelope className="w-3 h-3 text-blue-600" /> Email Address
                          </label>
                          <input
                            type="email" name="email" value={form.email}
                            onChange={handleChange}
                            onFocus={() => setFocused('email')} onBlur={() => setFocused('')}
                            placeholder="john@example.com" required
                            className={inputCls('email')}
                          />
                        </motion.div>
                      </div>

                      {}
                      <div className="grid sm:grid-cols-2 gap-4">
                        <motion.div variants={fieldItem} className="space-y-1.5">
                          <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-600">
                            <FaPhoneAlt className="w-3 h-3 text-blue-600" /> Phone{' '}
                            <span className="text-gray-400 font-normal">(optional)</span>
                          </label>
                          <input
                            type="tel" name="phone" value={form.phone}
                            onChange={handleChange}
                            onFocus={() => setFocused('phone')} onBlur={() => setFocused('')}
                            placeholder="+212 6XX XXX XXX"
                            className={inputCls('phone')}
                          />
                        </motion.div>
                        <motion.div variants={fieldItem} className="space-y-1.5">
                          <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-600">
                            <FaCommentDots className="w-3 h-3 text-blue-600" /> Topic
                          </label>
                          <Select
                            options={subjectOptions}
                            value={form.subject}
                            onChange={handleSelectChange}
                            styles={selectStyles()}
                            placeholder="Select a topic…"
                            isSearchable={false}
                            classNamePrefix="rs"
                          />
                        </motion.div>
                      </div>

                      {}
                      <motion.div variants={fieldItem} className="space-y-1.5">
                        <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-600">
                          <FaPaperPlane className="w-3 h-3 text-blue-600" /> Your Message
                        </label>
                        <textarea
                          name="message" value={form.message}
                          onChange={handleChange}
                          onFocus={() => setFocused('message')} onBlur={() => setFocused('')}
                          rows={5} placeholder="Tell us how we can help you…" required
                          className={inputCls('message') + ' resize-none'}
                        />
                      </motion.div>

                      {}
                      <AnimatePresence>
                        {error && (
                          <motion.div
                            key="error"
                            initial={{ opacity: 0, y: -6, height: 0 }}
                            animate={{ opacity: 1, y: 0, height: 'auto' }}
                            exit={{ opacity: 0, y: -6, height: 0 }}
                            transition={{ duration: 0.28 }}
                            className="flex items-start gap-2.5 bg-red-50 border border-red-200 text-red-600 text-xs rounded-xl px-4 py-3 overflow-hidden"
                          >
                            <FaExclamationCircle className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
                            {error}
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {}
                      <motion.div variants={fieldItem}>
                        <motion.button
                          type="submit"
                          disabled={loading}
                          whileHover={{ scale: loading ? 1 : 1.015 }}
                          whileTap={{ scale: loading ? 1 : 0.975 }}
                          className="w-full flex items-center justify-center gap-2.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold text-sm py-3.5 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-70"
                        >
                          {loading ? (
                            <>
                              <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
                                className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                              />
                              Sending…
                            </>
                          ) : (
                            <>
                              <FaPaperPlane className="w-3.5 h-3.5" />
                              Send Message
                            </>
                          )}
                        </motion.button>
                      </motion.div>

                      <motion.p variants={fieldItem} className="text-center text-[11px] text-gray-400">
                        We respect your privacy. No spam, ever.
                      </motion.p>
                    </motion.form>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </div>

          {}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="md:hidden mt-6 relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 to-blue-700 p-6 text-white shadow-lg shadow-blue-200"
          >
            <div className="pointer-events-none absolute -top-8 -right-8 w-28 h-28 rounded-full bg-white/10" />
            <FaCar className="w-6 h-6 mb-2 text-blue-200" />
            <p className="font-bold text-base mb-1">Need a car right now?</p>
            <p className="text-blue-100 text-xs leading-relaxed mb-3">Browse our full fleet and book instantly.</p>
            <a
              href="/cars"
              className="inline-flex items-center gap-2 bg-white text-blue-600 text-xs font-bold px-4 py-2 rounded-full hover:shadow-md transition-all"
            >
              Browse Cars <FaArrowRight className="w-3 h-3" />
            </a>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Contact;