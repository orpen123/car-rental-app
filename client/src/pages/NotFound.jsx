import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className='min-h-screen bg-[#eaecf5] flex items-center justify-center px-4'>
      <div className='text-center'>

        {}
        <div className='relative mb-6'>
          <p className='text-[120px] sm:text-[160px] font-black text-blue-600 leading-none opacity-10'>
            404
          </p>
          <div className='absolute inset-0 flex items-center justify-center'>
            <div className='text-center'>
              <p className='text-6xl mb-2'>🚗</p>
              <p className='text-4xl sm:text-5xl font-black text-blue-600'>404</p>
            </div>
          </div>
        </div>

        <h1 className='text-xl sm:text-2xl font-bold text-gray-900 mb-3'>
          Oops! Page Not Found
        </h1>
        <p className='text-gray-400 text-sm mb-8 max-w-sm mx-auto leading-relaxed'>
          The page you're looking for doesn't exist or has been moved. Let's get you back on the road!
        </p>

        <div className='flex items-center justify-center gap-3'>
          <Link
            to='/'
            className='px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-2xl transition-all hover:shadow-lg hover:shadow-blue-200'
          >
            Go Home
          </Link>
          <Link
            to='/cars'
            className='px-6 py-3 bg-white hover:bg-gray-50 text-gray-700 text-sm font-semibold rounded-2xl border border-gray-200 transition-all'
          >
            Browse Cars
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;