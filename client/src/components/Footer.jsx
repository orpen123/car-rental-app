import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className='bg-gray-900 text-gray-400'>

      {/* Main Footer */}
      <div className='max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-14'>
        <div className='grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10'>

          {/* Brand — full width on mobile */}
          <div className='col-span-2 sm:col-span-2 lg:col-span-1'>
            <Link to='/' className='text-white font-bold text-base uppercase tracking-wide mb-3 block'>
              CarRental
            </Link>
            <p className='text-xs leading-relaxed text-gray-500 mb-5 max-w-xs'>
              Find the perfect car for your journey. Premium vehicles, unbeatable prices, and exceptional service.
            </p>
            {/* Social Links */}
            <div className='flex items-center gap-2'>
              {[
                { label: 'Facebook', path: 'M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z' },
                { label: 'Twitter', path: 'M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z' },
                { label: 'Instagram', path: 'M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37zm1.5-4.87h.01M6.5 19.5h11a3 3 0 003-3v-11a3 3 0 00-3-3h-11a3 3 0 00-3 3v11a3 3 0 003 3z' },
              ].map((s, i) => (
                
                <a key={i}
                  href='#'
                  className='w-8 h-8 rounded-full bg-gray-800 hover:bg-blue-600 flex items-center justify-center transition-all duration-300 group'
                  aria-label={s.label}
                >
                  <svg className='w-3.5 h-3.5 text-gray-400 group-hover:text-white transition-colors' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d={s.path} />
                  </svg>
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className='col-span-1'>
            <h4 className='text-white text-xs font-semibold mb-4 uppercase tracking-widest'>
              Quick Links
            </h4>
            <ul className='space-y-2.5'>
              {[
                { label: 'Home', to: '/' },
                { label: 'Browse Cars', to: '/cars' },
                { label: 'About Us', to: '/' },
                { label: 'Contact', to: '/' },
                { label: 'Blog', to: '/' },
              ].map((link, i) => (
                <li key={i}>
                  <Link
                    to={link.to}
                    className='text-xs text-gray-500 hover:text-blue-400 transition-colors flex items-center gap-1'
                  >
                    <span className='text-gray-700'>→</span> {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Car Types */}
          <div className='col-span-1'>
            <h4 className='text-white text-xs font-semibold mb-4 uppercase tracking-widest'>
              Car Types
            </h4>
            <ul className='space-y-2.5'>
              {['Sedan', 'SUV', 'Truck', 'Convertible', 'Van', 'Coupe'].map((type, i) => (
                <li key={i}>
                  <Link
                    to={`/cars?type=${type.toLowerCase()}`}
                    className='text-xs text-gray-500 hover:text-blue-400 transition-colors flex items-center gap-1'
                  >
                    <span className='text-gray-700'>→</span> {type}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact — full width on small, normal on lg */}
          <div className='col-span-2 sm:col-span-2 lg:col-span-1'>
            <h4 className='text-white text-xs font-semibold mb-4 uppercase tracking-widest'>
              Contact Us
            </h4>
            <ul className='space-y-3'>
              {[
                {
                  icon: 'M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z',
                  text: '123 Main Street, Casablanca, Morocco',
                },
                {
                  icon: 'M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z',
                  text: '+1 234 567 890',
                },
                {
                  icon: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
                  text: 'support@carrental.com',
                },
              ].map((item, i) => (
                <li key={i} className='flex items-start gap-2.5'>
                  <svg className='w-3.5 h-3.5 text-blue-500 flex-shrink-0 mt-0.5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d={item.icon} />
                  </svg>
                  <span className='text-xs text-gray-500 leading-relaxed'>{item.text}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className='border-t border-gray-800'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-3'>
          <p className='text-xs text-gray-600 text-center sm:text-left'>
            © {new Date().getFullYear()} CarRental. All rights reserved.
          </p>
          <div className='flex flex-wrap items-center justify-center gap-4'>
            <a href='#' className='text-xs text-gray-600 hover:text-blue-400 transition-colors'>Privacy Policy</a>
            <a href='#' className='text-xs text-gray-600 hover:text-blue-400 transition-colors'>Terms of Service</a>
            <a href='#' className='text-xs text-gray-600 hover:text-blue-400 transition-colors'>Cookie Policy</a>
          </div>
        </div>
      </div>

    </footer>
  );
};

export default Footer;