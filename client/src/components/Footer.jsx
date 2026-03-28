
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FaFacebookF, 
  FaTwitter, 
  FaInstagram, 
  FaChevronRight, 
  FaMapMarkerAlt, 
  FaPhoneAlt, 
  FaEnvelope 
} from 'react-icons/fa';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const containerVariants = {
  hidden: { opacity: 0 },  // remove y: 20
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, staggerChildren: 0.1 }
  }
};

  const itemVariants = {
  hidden: { opacity: 0 },  // remove y: 10
  visible: { opacity: 1, y: 0 }
};

  return (
    <motion.footer 
      className='bg-slate-950 text-slate-400 pt-16 border-t border-slate-900'
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={containerVariants}
    >
      {}
      <div className='max-w-7xl mx-auto px-4 sm:px-6 pb-12'>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12'>

          {}
          <motion.div variants={itemVariants} className='space-y-6'>
            <Link to='/' className='flex items-center gap-2 group'>
              <div className='w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg shadow-indigo-500/20 group-hover:rotate-6 transition-transform'>
                C
              </div>
              <span className='text-white font-black text-xl uppercase tracking-tighter'>
                Car<span className='text-blue-600'>Rental</span>
              </span>
            </Link>
            <p className='text-sm leading-relaxed text-slate-500 max-w-xs'>
              Experience the ultimate freedom on the road with our premium fleet. Reliable, affordable, and always ready for your next adventure.
            </p>
            <div className='flex items-center gap-3'>
              {[
                { icon: <FaFacebookF />, href: 'https://www.facebook.com/soulaimane.el.masnaouy' },
                { icon: <FaTwitter />, href: 'https://x.com/https_soul98' },
                { icon: <FaInstagram />, href: 'https://www.instagram.com/orpenamyaluos/' },
              ].map((social, i) => (
                <a
                  key={i}
                  href={social.href}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='w-9 h-9 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:bg-indigo-600 hover:text-white hover:border-indigo-500 hover:-translate-y-1 transition-all duration-300'
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </motion.div>

          <motion.div variants={itemVariants}>
            <h4 className='text-white text-xs font-black uppercase tracking-[0.2em] mb-7'>
              Quick Links
            </h4>
            <ul className='space-y-4'>
              {[
                { label: 'Home', to: '/' },
                { label: 'Browse Cars', to: '/cars' },
                { label: 'About Us', to: '/about' },
                { label: 'Contact', to: '/contact' },
                { label: 'Our Blog', to: '/blog' },
              ].map((link, i) => (
                <li key={i}>
                  <Link
                    to={link.to}
                    className='text-sm text-slate-500 hover:text-indigo-400 flex items-center gap-2 group transition-colors'
                  >
                    <FaChevronRight size={10} className='text-slate-800 group-hover:text-indigo-500 transition-all group-hover:translate-x-1' />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div variants={itemVariants}>
            <h4 className='text-white text-xs font-black uppercase tracking-[0.2em] mb-7'>
              Fleet Categories
            </h4>
            <div className='grid grid-cols-2 gap-4'>
              {['Sedan', 'SUV', 'Truck', 'Luxury', 'Van', 'Coupe'].map((type, i) => (
                <Link
                  key={i}
                  to={`/cars?type=${type.toLowerCase()}`}
                  className='text-sm text-slate-500 hover:text-indigo-400 transition-colors flex items-center gap-2 group'
                >
                  <div className='w-1.5 h-1.5 rounded-full bg-slate-800 group-hover:bg-indigo-500 transition-colors' />
                  {type}
                </Link>
              ))}
            </div>
          </motion.div>

          <motion.div variants={itemVariants}>
            <h4 className='text-white text-xs font-black uppercase tracking-[0.2em] mb-7'>
              Contact Us
            </h4>
            <ul className='space-y-5'>
              {[
                { icon: <FaMapMarkerAlt />, text: 'Temara, Rabat, Maroc' },
                { icon: <FaPhoneAlt />, text: '0606383278' },
                { icon: <FaEnvelope />, text: 'soulaymaane@gmail.com' },
              ].map((item, i) => (
                <li key={i} className='flex items-start gap-4'>
                  <div className='w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-indigo-500 flex-shrink-0'>
                    {item.icon}
                  </div>
                  <span className='text-sm text-slate-500 leading-relaxed pt-1'>{item.text}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>
      <div className='border-t border-slate-900 bg-slate-950/50 py-8'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-6'>
          <p className='text-xs font-medium text-slate-600'>
            © {currentYear} <span className='text-slate-400'>CarRental</span>. Designed for excellence.
          </p>
          <div className='flex items-center gap-8'>
            {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map((text, i) => (
              <a 
                key={i} 
                href='#' 
                className='text-[11px] font-bold uppercase tracking-wider text-slate-600 hover:text-indigo-400 transition-colors'
              >
                {text}
              </a>
            ))}
          </div>
        </div>
      </div>
    </motion.footer>
  );
};

export default Footer;