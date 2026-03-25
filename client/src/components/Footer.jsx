

// import { Link } from 'react-router-dom';

// const Footer = () => {
//   return (
//     <footer className='bg-gray-900 text-gray-400'>

//       {/* Main Footer */}
//       <div className='max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-14'>
//         <div className='grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10'>

//           {/* Brand — full width on mobile */}
//           <div className='col-span-2 sm:col-span-2 lg:col-span-1'>
//             <Link to='/' className='text-white font-bold text-base uppercase tracking-wide mb-3 block'>
//               CarRental
//             </Link>
//             <p className='text-xs leading-relaxed text-gray-500 mb-5 max-w-xs'>
//               Find the perfect car for your journey. Premium vehicles, unbeatable prices, and exceptional service.
//             </p>
//             {/* Social Links */}
//             <div className='flex items-center gap-2'>
//               {[
//                 {
//                   label: 'Facebook',
//                   href: 'https://www.facebook.com/soulaimane.el.masnaouy',
//                   path: 'M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z',
//                 },
//                 {
//                   label: 'Twitter',
//                   href: 'https://x.com/https_soul98',
//                   path: 'M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z',
//                 },
//                 {
//                   label: 'Instagram',
//                   href: 'https://www.instagram.com/orpenamyaluos/',
//                   path: 'M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37zm1.5-4.87h.01M6.5 19.5h11a3 3 0 003-3v-11a3 3 0 00-3-3h-11a3 3 0 00-3 3v11a3 3 0 003 3z',
//                 },
//               ].map((s, i) => (
//                 <a
//                   key={i}
//                   href={s.href}
//                   target='_blank'
//                   rel='noopener noreferrer'
//                   className='w-8 h-8 rounded-full bg-gray-800 hover:bg-blue-600 flex items-center justify-center transition-all duration-300 group'
//                   aria-label={s.label}
//                 >
//                   <svg className='w-3.5 h-3.5 text-gray-400 group-hover:text-white transition-colors' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
//                     <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d={s.path} />
//                   </svg>
//                 </a>
//               ))}
//             </div>
//           </div>

//           {/* Quick Links */}
//           <div className='col-span-1'>
//             <h4 className='text-white text-xs font-semibold mb-4 uppercase tracking-widest'>
//               Quick Links
//             </h4>
//             <ul className='space-y-2.5'>
//               {[
//                 { label: 'Home', to: '/' },
//                 { label: 'Browse Cars', to: '/cars' },
//                 { label: 'About Us', to: '/about' },
//                 { label: 'Contact', to: '/contact' },
//                 { label: 'Blog', to: '/blog' },
//               ].map((link, i) => (
//                 <li key={i}>
//                   <Link
//                     to={link.to}
//                     className='text-xs text-gray-500 hover:text-blue-400 transition-colors flex items-center gap-1'
//                   >
//                     <span className='text-gray-700'>→</span> {link.label}
//                   </Link>
//                 </li>
//               ))}
//             </ul>
//           </div>

//           {/* Car Types */}
//           <div className='col-span-1'>
//             <h4 className='text-white text-xs font-semibold mb-4 uppercase tracking-widest'>
//               Car Types
//             </h4>
//             <ul className='space-y-2.5'>
//               {['Sedan', 'SUV', 'Truck', 'Convertible', 'Van', 'Coupe'].map((type, i) => (
//                 <li key={i}>
//                   <Link
//                     to={`/cars?type=${type.toLowerCase()}`}
//                     className='text-xs text-gray-500 hover:text-blue-400 transition-colors flex items-center gap-1'
//                   >
//                     <span className='text-gray-700'>→</span> {type}
//                   </Link>
//                 </li>
//               ))}
//             </ul>
//           </div>

//           {/* Contact — full width on small, normal on lg */}
//           <div className='col-span-2 sm:col-span-2 lg:col-span-1'>
//             <h4 className='text-white text-xs font-semibold mb-4 uppercase tracking-widest'>
//               Contact Us
//             </h4>
//             <ul className='space-y-3'>
//               {[
//                 {
//                   icon: 'M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z',
//                   text: 'Temara, Rabat, Maroc',
//                 },
//                 {
//                   icon: 'M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z',
//                   text: '0606383278',
//                 },
//                 {
//                   icon: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
//                   text: 'soulaymaane@gmail.com',
//                 },
//               ].map((item, i) => (
//                 <li key={i} className='flex items-start gap-2.5'>
//                   <svg className='w-3.5 h-3.5 text-blue-500 flex-shrink-0 mt-0.5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
//                     <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d={item.icon} />
//                   </svg>
//                   <span className='text-xs text-gray-500 leading-relaxed'>{item.text}</span>
//                 </li>
//               ))}
//             </ul>
//           </div>
//         </div>
//       </div>

//       {/* Bottom Bar */}
//       <div className='border-t border-gray-800'>
//         <div className='max-w-7xl mx-auto px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-3'>
//           <p className='text-xs text-gray-600 text-center sm:text-left'>
//             © {new Date().getFullYear()} CarRental. All rights reserved.
//           </p>
//           <div className='flex flex-wrap items-center justify-center gap-4'>
//             <a href='#' className='text-xs text-gray-600 hover:text-blue-400 transition-colors'>Privacy Policy</a>
//             <a href='#' className='text-xs text-gray-600 hover:text-blue-400 transition-colors'>Terms of Service</a>
//             <a href='#' className='text-xs text-gray-600 hover:text-blue-400 transition-colors'>Cookie Policy</a>
//           </div>
//         </div>
//       </div>

//     </footer>
//   );
// };

// export default Footer;
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
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
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
      {/* Main Footer Content */}
      <div className='max-w-7xl mx-auto px-4 sm:px-6 pb-12'>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12'>

          {/* Column 1: Brand & Socials */}
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

          {/* Column 2: Quick Links */}
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

          {/* Column 3: Car Types */}
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

          {/* Column 4: Contact Info */}
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

      {/* Bottom Legal Bar */}
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