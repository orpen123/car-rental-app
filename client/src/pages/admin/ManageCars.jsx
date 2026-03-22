// import { useEffect, useState } from 'react';
// import { Link } from 'react-router-dom';
// import api from '../../services/api.js';

// const ManageCars = () => {
//   const [cars, setCars] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [showForm, setShowForm] = useState(false);
//   const [editCar, setEditCar] = useState(null);
//   const [submitting, setSubmitting] = useState(false);
//   const [error, setError] = useState('');
//   const [success, setSuccess] = useState('');
//   const [deleteConfirm, setDeleteConfirm] = useState(null);

//   const emptyForm = {
//     brand: '',
//     model: '',
//     year: '',
//     type: 'sedan',
//     pricePerDay: '',
//     seats: '',
//     transmission: 'automatic',
//     fuel: 'petrol',
//     location: '',
//     description: '',
//     images: '',
//     available: true,
//   };

//   const [formData, setFormData] = useState(emptyForm);

//   useEffect(() => {
//     fetchCars();
//   }, []);

//   const fetchCars = async () => {
//     try {
//       const res = await api.get('/cars');
//       setCars(res.data);
//     } catch (error) {
//       console.error(error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
//     setError('');
//   };

//   const handleEdit = (car) => {
//     setEditCar(car);
//     setFormData({
//       brand: car.brand,
//       model: car.model,
//       year: car.year,
//       type: car.type,
//       pricePerDay: car.pricePerDay,
//       seats: car.seats,
//       transmission: car.transmission,
//       fuel: car.fuel,
//       location: car.location,
//       description: car.description,
//       images: car.images?.join(', ') || '',
//       available: car.available,
//     });
//     setShowForm(true);
//     window.scrollTo({ top: 0, behavior: 'smooth' });
//   };

//   const handleSubmit = async () => {
//     if (!formData.brand || !formData.model || !formData.year || !formData.pricePerDay) {
//       return setError('Please fill in all required fields');
//     }

//     setSubmitting(true);
//     try {
//       const payload = {
//         ...formData,
//         year: Number(formData.year),
//         pricePerDay: Number(formData.pricePerDay),
//         seats: Number(formData.seats),
//         images: formData.images ? formData.images.split(',').map(i => i.trim()).filter(Boolean) : [],
//       };

//       if (editCar) {
//         await api.put(`/cars/${editCar._id}`, payload);
//         setSuccess('Car updated successfully!');
//       } else {
//         await api.post('/cars', payload);
//         setSuccess('Car added successfully!');
//       }

//       setFormData(emptyForm);
//       setEditCar(null);
//       setShowForm(false);
//       fetchCars();
//       setTimeout(() => setSuccess(''), 3000);
//     } catch (err) {
//       setError(err.response?.data?.message || 'Something went wrong');
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   const handleDelete = async (id) => {
//     try {
//       await api.delete(`/cars/${id}`);
//       setSuccess('Car deleted successfully!');
//       fetchCars();
//       setDeleteConfirm(null);
//       setTimeout(() => setSuccess(''), 3000);
//     } catch (err) {
//       setError(err.response?.data?.message || 'Delete failed');
//     }
//   };

//   const inputClass = 'w-full px-4 py-2.5 bg-gray-50 rounded-xl text-sm text-gray-800 outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all placeholder-gray-300 border border-gray-100';
//   const labelClass = 'block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5';

//   return (
//     <div className='min-h-screen bg-[#eaecf5] pt-20 pb-10'>
//       <div className='max-w-7xl mx-auto px-4 sm:px-6 py-8'>

//         {/* Header */}
//         <div className='flex items-center justify-between mb-6'>
//           <div>
//             <Link to='/admin' className='text-xs text-gray-400 hover:text-blue-600 transition-colors'>
//               ← Dashboard
//             </Link>
//             <h1 className='text-2xl sm:text-3xl font-bold text-gray-900 mt-1'>Manage Cars</h1>
//           </div>
//           <button
//             onClick={() => { setShowForm(!showForm); setEditCar(null); setFormData(emptyForm); setError(''); }}
//             className={`px-4 py-2 text-xs font-semibold rounded-xl transition-all ${showForm ? 'bg-gray-100 text-gray-600 hover:bg-gray-200' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
//           >
//             {showForm ? 'Cancel' : '+ Add Car'}
//           </button>
//         </div>

//         {/* Success */}
//         {success && (
//           <div className='bg-green-50 border border-green-100 text-green-600 text-xs rounded-2xl px-4 py-3 mb-4 text-center'>
//             ✅ {success}
//           </div>
//         )}

//         {/* Form */}
//         {showForm && (
//           <div className='bg-white rounded-2xl shadow-sm p-5 sm:p-6 mb-6'>
//             <h2 className='text-sm font-bold text-gray-900 mb-5'>
//               {editCar ? `Edit — ${editCar.brand} ${editCar.model}` : 'Add New Car'}
//             </h2>

//             <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
//               <div>
//                 <label className={labelClass}>Brand *</label>
//                 <input name='brand' value={formData.brand} onChange={handleChange} placeholder='Toyota' className={inputClass} />
//               </div>
//               <div>
//                 <label className={labelClass}>Model *</label>
//                 <input name='model' value={formData.model} onChange={handleChange} placeholder='Camry' className={inputClass} />
//               </div>
//               <div>
//                 <label className={labelClass}>Year *</label>
//                 <input name='year' type='number' value={formData.year} onChange={handleChange} placeholder='2023' className={inputClass} />
//               </div>
//               <div>
//                 <label className={labelClass}>Price Per Day ($) *</label>
//                 <input name='pricePerDay' type='number' value={formData.pricePerDay} onChange={handleChange} placeholder='50' className={inputClass} />
//               </div>
//               <div>
//                 <label className={labelClass}>Seats</label>
//                 <input name='seats' type='number' value={formData.seats} onChange={handleChange} placeholder='5' className={inputClass} />
//               </div>
//               <div>
//                 <label className={labelClass}>Location</label>
//                 <input name='location' value={formData.location} onChange={handleChange} placeholder='Casablanca' className={inputClass} />
//               </div>

//               <div>
//                 <label className={labelClass}>Type</label>
//                 <select name='type' value={formData.type} onChange={handleChange} className={inputClass}>
//                   {['sedan', 'suv', 'truck', 'convertible', 'van', 'coupe'].map(t => (
//                     <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>
//                   ))}
//                 </select>
//               </div>
//               <div>
//                 <label className={labelClass}>Transmission</label>
//                 <select name='transmission' value={formData.transmission} onChange={handleChange} className={inputClass}>
//                   <option value='automatic'>Automatic</option>
//                   <option value='manual'>Manual</option>
//                 </select>
//               </div>
//               <div>
//                 <label className={labelClass}>Fuel</label>
//                 <select name='fuel' value={formData.fuel} onChange={handleChange} className={inputClass}>
//                   {['petrol', 'diesel', 'electric', 'hybrid'].map(f => (
//                     <option key={f} value={f}>{f.charAt(0).toUpperCase() + f.slice(1)}</option>
//                   ))}
//                 </select>
//               </div>

//               <div className='sm:col-span-2 lg:col-span-3'>
//                 <label className={labelClass}>Images (comma separated URLs)</label>
//                 <input name='images' value={formData.images} onChange={handleChange} placeholder='https://image1.jpg, https://image2.jpg' className={inputClass} />
//               </div>

//               <div className='sm:col-span-2 lg:col-span-3'>
//                 <label className={labelClass}>Description</label>
//                 <textarea name='description' value={formData.description} onChange={handleChange} placeholder='Car description...' rows={3} className={`${inputClass} resize-none`} />
//               </div>

//               <div className='flex items-center gap-2'>
//                 <input type='checkbox' name='available' id='available' checked={formData.available} onChange={handleChange} className='w-4 h-4 accent-blue-600' />
//                 <label htmlFor='available' className='text-xs font-semibold text-gray-600'>Available for booking</label>
//               </div>
//             </div>

//             {error && (
//               <div className='bg-red-50 border border-red-100 text-red-500 text-xs rounded-xl px-4 py-3 mt-4 text-center'>
//                 {error}
//               </div>
//             )}

//             <div className='flex items-center gap-3 mt-5'>
//               <button
//                 onClick={handleSubmit}
//                 disabled={submitting}
//                 className='px-6 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white text-xs font-semibold rounded-xl transition-all'
//               >
//                 {submitting ? 'Saving...' : editCar ? 'Update Car' : 'Add Car'}
//               </button>
//               <button
//                 onClick={() => { setShowForm(false); setEditCar(null); setFormData(emptyForm); setError(''); }}
//                 className='px-6 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-600 text-xs font-semibold rounded-xl transition-all'
//               >
//                 Cancel
//               </button>
//             </div>
//           </div>
//         )}

//         {/* Cars Table */}
//         <div className='bg-white rounded-2xl shadow-sm overflow-hidden'>
//           <div className='px-5 py-4 border-b border-gray-50 flex items-center justify-between'>
//             <h2 className='text-sm font-bold text-gray-900'>All Cars ({cars.length})</h2>
//           </div>

//           {loading ? (
//             <div className='flex justify-center items-center h-40'>
//               <div className='w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin' />
//             </div>
//           ) : cars.length === 0 ? (
//             <div className='text-center py-16 text-gray-300 text-sm'>No cars yet</div>
//           ) : (
//             <div className='divide-y divide-gray-50'>
//               {cars.map((car) => (
//                 <div key={car._id} className='flex items-center gap-4 px-5 py-4 hover:bg-gray-50 transition-colors'>

//                   {/* Image */}
//                   <div className='w-16 h-12 rounded-xl bg-[#eaecf5] overflow-hidden flex-shrink-0'>
//                     {car.images?.[0] ? (
//                       <img src={car.images[0]} alt='' className='w-full h-full object-cover' />
//                     ) : (
//                       <div className='w-full h-full flex items-center justify-center text-gray-300 text-xs'>🚗</div>
//                     )}
//                   </div>

//                   {/* Info */}
//                   <div className='flex-1 min-w-0'>
//                     <p className='text-sm font-semibold text-gray-900 truncate'>{car.brand} {car.model}</p>
//                     <p className='text-xs text-gray-400'>{car.year} • {car.type} • {car.transmission}</p>
//                   </div>

//                   {/* Price */}
//                   <div className='hidden sm:block text-center flex-shrink-0'>
//                     <p className='text-sm font-bold text-blue-600'>${car.pricePerDay}</p>
//                     <p className='text-xs text-gray-400'>/day</p>
//                   </div>

//                   {/* Status */}
//                   <span className={`hidden sm:block text-xs px-2 py-1 rounded-full font-medium flex-shrink-0 ${car.available ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-500'}`}>
//                     {car.available ? 'Available' : 'Booked'}
//                   </span>

//                   {/* Actions */}
//                   <div className='flex items-center gap-2 flex-shrink-0'>
//                     <button
//                       onClick={() => handleEdit(car)}
//                       className='px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 text-xs font-semibold rounded-xl transition-colors'
//                     >
//                       Edit
//                     </button>
//                     <button
//                       onClick={() => setDeleteConfirm(car._id)}
//                       className='px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-500 text-xs font-semibold rounded-xl transition-colors'
//                     >
//                       Delete
//                     </button>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>

//         {/* Delete Confirm Modal */}
//         {deleteConfirm && (
//           <div className='fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 px-4'>
//             <div className='bg-white rounded-2xl shadow-xl p-6 max-w-sm w-full'>
//               <h3 className='text-sm font-bold text-gray-900 mb-2'>Delete Car</h3>
//               <p className='text-xs text-gray-400 mb-5'>Are you sure you want to delete this car? This action cannot be undone.</p>
//               <div className='flex gap-3'>
//                 <button
//                   onClick={() => handleDelete(deleteConfirm)}
//                   className='flex-1 py-2.5 bg-red-500 hover:bg-red-600 text-white text-xs font-semibold rounded-xl transition-colors'
//                 >
//                   Delete
//                 </button>
//                 <button
//                   onClick={() => setDeleteConfirm(null)}
//                   className='flex-1 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-600 text-xs font-semibold rounded-xl transition-colors'
//                 >
//                   Cancel
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default ManageCars;
// import { useEffect, useState } from 'react';
// import { Link } from 'react-router-dom';
// import api from '../../services/api.js';

// const ManageCars = () => {
//   const [cars, setCars] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [showForm, setShowForm] = useState(false);
//   const [editCar, setEditCar] = useState(null);
//   const [submitting, setSubmitting] = useState(false);
//   const [uploading, setUploading] = useState(false);
//   const [error, setError] = useState('');
//   const [success, setSuccess] = useState('');
//   const [deleteConfirm, setDeleteConfirm] = useState(null);
//   const [imagePreview, setImagePreview] = useState(null);

//   const emptyForm = {
//     brand: '',
//     model: '',
//     year: '',
//     type: 'sedan',
//     pricePerDay: '',
//     seats: '',
//     transmission: 'automatic',
//     fuel: 'petrol',
//     location: '',
//     description: '',
//     images: [],
//     available: true,
//   };

//   const [formData, setFormData] = useState(emptyForm);

//   useEffect(() => {
//     fetchCars();
//   }, []);

//   const fetchCars = async () => {
//     try {
//       const res = await api.get('/cars');
//       setCars(res.data);
//     } catch (error) {
//       console.error(error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
//     setError('');
//   };

//   // Handle image upload to Cloudinary
//   const handleImageUpload = async (e) => {
//     const file = e.target.files[0];
//     if (!file) return;

//     // Show preview immediately
//     const reader = new FileReader();
//     reader.onloadend = () => setImagePreview(reader.result);
//     reader.readAsDataURL(file);

//     // Upload to Cloudinary via backend
//     setUploading(true);
//     try {
//       const data = new FormData();
//       data.append('image', file);
//       const res = await api.post('/upload', data, {
//         headers: { 'Content-Type': 'multipart/form-data' },
//       });
//       setFormData((prev) => ({
//         ...prev,
//         images: [...prev.images, res.data.url],
//       }));
//       setSuccess('Image uploaded successfully! ✅');
//       setTimeout(() => setSuccess(''), 3000);
//     } catch (err) {
//       setError('Image upload failed');
//     } finally {
//       setUploading(false);
//     }
//   };

//   const removeImage = (index) => {
//     setFormData((prev) => ({
//       ...prev,
//       images: prev.images.filter((_, i) => i !== index),
//     }));
//     setImagePreview(null);
//   };

//   const handleEdit = (car) => {
//     setEditCar(car);
//     setFormData({
//       brand: car.brand,
//       model: car.model,
//       year: car.year,
//       type: car.type,
//       pricePerDay: car.pricePerDay,
//       seats: car.seats,
//       transmission: car.transmission,
//       fuel: car.fuel,
//       location: car.location,
//       description: car.description,
//       images: car.images || [],
//       available: car.available,
//     });
//     setImagePreview(car.images?.[0] || null);
//     setShowForm(true);
//     window.scrollTo({ top: 0, behavior: 'smooth' });
//   };

//   const handleSubmit = async () => {
//     if (!formData.brand || !formData.model || !formData.year || !formData.pricePerDay) {
//       return setError('Please fill in all required fields');
//     }

//     setSubmitting(true);
//     try {
//       const payload = {
//         ...formData,
//         year: Number(formData.year),
//         pricePerDay: Number(formData.pricePerDay),
//         seats: Number(formData.seats),
//       };

//       if (editCar) {
//         await api.put(`/cars/${editCar._id}`, payload);
//         setSuccess('Car updated successfully! ✅');
//       } else {
//         await api.post('/cars', payload);
//         setSuccess('Car added successfully! ✅');
//       }

//       setFormData(emptyForm);
//       setEditCar(null);
//       setShowForm(false);
//       setImagePreview(null);
//       fetchCars();
//       setTimeout(() => setSuccess(''), 3000);
//     } catch (err) {
//       setError(err.response?.data?.message || 'Something went wrong');
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   const handleDelete = async (id) => {
//     try {
//       await api.delete(`/cars/${id}`);
//       setSuccess('Car deleted! ✅');
//       fetchCars();
//       setDeleteConfirm(null);
//       setTimeout(() => setSuccess(''), 3000);
//     } catch (err) {
//       setError(err.response?.data?.message || 'Delete failed');
//     }
//   };

//   const inputClass = 'w-full px-4 py-2.5 bg-gray-50 rounded-xl text-sm text-gray-800 outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all placeholder-gray-300 border border-gray-100';
//   const labelClass = 'block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5';

//   return (
//     <div className='min-h-screen bg-[#eaecf5] pt-20 pb-10'>
//       <div className='max-w-7xl mx-auto px-4 sm:px-6 py-8'>

//         {/* Header */}
//         <div className='flex items-center justify-between mb-6'>
//           <div>
//             <Link to='/admin' className='text-xs text-gray-400 hover:text-blue-600 transition-colors'>
//               ← Dashboard
//             </Link>
//             <h1 className='text-2xl sm:text-3xl font-bold text-gray-900 mt-1'>Manage Cars</h1>
//           </div>
//           <button
//             onClick={() => { setShowForm(!showForm); setEditCar(null); setFormData(emptyForm); setError(''); setImagePreview(null); }}
//             className={`px-4 py-2 text-xs font-semibold rounded-xl transition-all ${showForm ? 'bg-gray-100 text-gray-600 hover:bg-gray-200' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
//           >
//             {showForm ? 'Cancel' : '+ Add Car'}
//           </button>
//         </div>

//         {/* Success */}
//         {success && (
//           <div className='bg-green-50 border border-green-100 text-green-600 text-xs rounded-2xl px-4 py-3 mb-4 text-center'>
//             {success}
//           </div>
//         )}

//         {/* Form */}
//         {showForm && (
//           <div className='bg-white rounded-2xl shadow-sm p-5 sm:p-6 mb-6'>
//             <h2 className='text-sm font-bold text-gray-900 mb-5'>
//               {editCar ? `Edit — ${editCar.brand} ${editCar.model}` : 'Add New Car'}
//             </h2>

//             <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
//               <div>
//                 <label className={labelClass}>Brand *</label>
//                 <input name='brand' value={formData.brand} onChange={handleChange} placeholder='Toyota' className={inputClass} />
//               </div>
//               <div>
//                 <label className={labelClass}>Model *</label>
//                 <input name='model' value={formData.model} onChange={handleChange} placeholder='Camry' className={inputClass} />
//               </div>
//               <div>
//                 <label className={labelClass}>Year *</label>
//                 <input name='year' type='number' value={formData.year} onChange={handleChange} placeholder='2023' className={inputClass} />
//               </div>
//               <div>
//                 <label className={labelClass}>Price Per Day ($) *</label>
//                 <input name='pricePerDay' type='number' value={formData.pricePerDay} onChange={handleChange} placeholder='50' className={inputClass} />
//               </div>
//               <div>
//                 <label className={labelClass}>Seats</label>
//                 <input name='seats' type='number' value={formData.seats} onChange={handleChange} placeholder='5' className={inputClass} />
//               </div>
//               <div>
//                 <label className={labelClass}>Location</label>
//                 <input name='location' value={formData.location} onChange={handleChange} placeholder='Casablanca' className={inputClass} />
//               </div>
//               <div>
//                 <label className={labelClass}>Type</label>
//                 <select name='type' value={formData.type} onChange={handleChange} className={inputClass}>
//                   {['sedan', 'suv', 'truck', 'convertible', 'van', 'coupe'].map(t => (
//                     <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>
//                   ))}
//                 </select>
//               </div>
//               <div>
//                 <label className={labelClass}>Transmission</label>
//                 <select name='transmission' value={formData.transmission} onChange={handleChange} className={inputClass}>
//                   <option value='automatic'>Automatic</option>
//                   <option value='manual'>Manual</option>
//                 </select>
//               </div>
//               <div>
//                 <label className={labelClass}>Fuel</label>
//                 <select name='fuel' value={formData.fuel} onChange={handleChange} className={inputClass}>
//                   {['petrol', 'diesel', 'electric', 'hybrid'].map(f => (
//                     <option key={f} value={f}>{f.charAt(0).toUpperCase() + f.slice(1)}</option>
//                   ))}
//                 </select>
//               </div>

//               <div className='sm:col-span-2 lg:col-span-3'>
//                 <label className={labelClass}>Description</label>
//                 <textarea name='description' value={formData.description} onChange={handleChange} placeholder='Car description...' rows={3} className={`${inputClass} resize-none`} />
//               </div>

//               {/* Image Upload */}
//               <div className='sm:col-span-2 lg:col-span-3'>
//                 <label className={labelClass}>Car Images</label>

//                 {/* Upload Button */}
//                 <label className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-200 rounded-2xl cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-all ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}>
//                   <input
//                     type='file'
//                     accept='image/*'
//                     className='hidden'
//                     onChange={handleImageUpload}
//                     disabled={uploading}
//                   />
//                   {uploading ? (
//                     <div className='flex flex-col items-center gap-2'>
//                       <div className='w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin' />
//                       <p className='text-xs text-blue-600 font-medium'>Uploading to Cloudinary...</p>
//                     </div>
//                   ) : (
//                     <div className='flex flex-col items-center gap-2'>
//                       <svg className='w-8 h-8 text-gray-300' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
//                         <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={1.5} d='M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z' />
//                       </svg>
//                       <p className='text-xs text-gray-400'>Click to upload image</p>
//                       <p className='text-xs text-gray-300'>JPG, PNG, WEBP up to 10MB</p>
//                     </div>
//                   )}
//                 </label>

//                 {/* Image Previews */}
//                 {formData.images.length > 0 && (
//                   <div className='flex flex-wrap gap-3 mt-3'>
//                     {formData.images.map((img, i) => (
//                       <div key={i} className='relative w-24 h-20 rounded-xl overflow-hidden group'>
//                         <img src={img} alt='' className='w-full h-full object-cover' />
//                         <button
//                           onClick={() => removeImage(i)}
//                           className='absolute top-1 right-1 w-5 h-5 bg-red-500 text-white rounded-full text-xs opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center'
//                         >
//                           ×
//                         </button>
//                       </div>
//                     ))}
//                   </div>
//                 )}
//               </div>

//               <div className='flex items-center gap-2'>
//                 <input type='checkbox' name='available' id='available' checked={formData.available} onChange={handleChange} className='w-4 h-4 accent-blue-600' />
//                 <label htmlFor='available' className='text-xs font-semibold text-gray-600'>Available for booking</label>
//               </div>
//             </div>

//             {error && (
//               <div className='bg-red-50 border border-red-100 text-red-500 text-xs rounded-xl px-4 py-3 mt-4 text-center'>
//                 {error}
//               </div>
//             )}

//             <div className='flex items-center gap-3 mt-5'>
//               <button
//                 onClick={handleSubmit}
//                 disabled={submitting || uploading}
//                 className='px-6 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white text-xs font-semibold rounded-xl transition-all'
//               >
//                 {submitting ? 'Saving...' : editCar ? 'Update Car' : 'Add Car'}
//               </button>
//               <button
//                 onClick={() => { setShowForm(false); setEditCar(null); setFormData(emptyForm); setError(''); setImagePreview(null); }}
//                 className='px-6 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-600 text-xs font-semibold rounded-xl transition-all'
//               >
//                 Cancel
//               </button>
//             </div>
//           </div>
//         )}

//         {/* Cars Table */}
//         <div className='bg-white rounded-2xl shadow-sm overflow-hidden'>
//           <div className='px-5 py-4 border-b border-gray-50 flex items-center justify-between'>
//             <h2 className='text-sm font-bold text-gray-900'>All Cars ({cars.length})</h2>
//           </div>

//           {loading ? (
//             <div className='flex justify-center items-center h-40'>
//               <div className='w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin' />
//             </div>
//           ) : cars.length === 0 ? (
//             <div className='text-center py-16 text-gray-300 text-sm'>No cars yet</div>
//           ) : (
//             <div className='divide-y divide-gray-50'>
//               {cars.map((car) => (
//                 <div key={car._id} className='flex items-center gap-4 px-5 py-4 hover:bg-gray-50 transition-colors'>

//                   {/* Image */}
//                   <div className='w-16 h-12 rounded-xl bg-[#eaecf5] overflow-hidden flex-shrink-0'>
//                     {car.images?.[0] ? (
//                       <img src={car.images[0]} alt='' className='w-full h-full object-cover' />
//                     ) : (
//                       <div className='w-full h-full flex items-center justify-center text-gray-300 text-xs'>🚗</div>
//                     )}
//                   </div>

//                   {/* Info */}
//                   <div className='flex-1 min-w-0'>
//                     <p className='text-sm font-semibold text-gray-900 truncate'>{car.brand} {car.model}</p>
//                     <p className='text-xs text-gray-400'>{car.year} • {car.type} • {car.transmission}</p>
//                   </div>

//                   {/* Price */}
//                   <div className='hidden sm:block text-center flex-shrink-0'>
//                     <p className='text-sm font-bold text-blue-600'>${car.pricePerDay}</p>
//                     <p className='text-xs text-gray-400'>/day</p>
//                   </div>

//                   {/* Status */}
//                   <span className={`hidden sm:block text-xs px-2 py-1 rounded-full font-medium flex-shrink-0 ${car.available ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-500'}`}>
//                     {car.available ? 'Available' : 'Booked'}
//                   </span>

//                   {/* Actions */}
//                   <div className='flex items-center gap-2 flex-shrink-0'>
//                     <button
//                       onClick={() => handleEdit(car)}
//                       className='px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 text-xs font-semibold rounded-xl transition-colors'
//                     >
//                       Edit
//                     </button>
//                     <button
//                       onClick={() => setDeleteConfirm(car._id)}
//                       className='px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-500 text-xs font-semibold rounded-xl transition-colors'
//                     >
//                       Delete
//                     </button>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>

//         {/* Delete Confirm Modal */}
//         {deleteConfirm && (
//           <div className='fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 px-4'>
//             <div className='bg-white rounded-2xl shadow-xl p-6 max-w-sm w-full'>
//               <h3 className='text-sm font-bold text-gray-900 mb-2'>Delete Car</h3>
//               <p className='text-xs text-gray-400 mb-5'>Are you sure? This action cannot be undone.</p>
//               <div className='flex gap-3'>
//                 <button
//                   onClick={() => handleDelete(deleteConfirm)}
//                   className='flex-1 py-2.5 bg-red-500 hover:bg-red-600 text-white text-xs font-semibold rounded-xl transition-colors'
//                 >
//                   Delete
//                 </button>
//                 <button
//                   onClick={() => setDeleteConfirm(null)}
//                   className='flex-1 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-600 text-xs font-semibold rounded-xl transition-colors'
//                 >
//                   Cancel
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default ManageCars;



import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Select from 'react-select';
import api from '../../services/api.js';

const ManageCars = () => {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editCar, setEditCar] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const emptyForm = {
    brand: '',
    model: '',
    year: '',
    type: 'sedan',
    pricePerDay: '',
    seats: '',
    transmission: 'automatic',
    fuel: 'petrol',
    location: '',
    description: '',
    images: [],
    available: true,
  };

  const [formData, setFormData] = useState(emptyForm);

  const typeOptions = [
    { value: 'sedan', label: '🚗 Sedan' },
    { value: 'suv', label: '🚙 SUV' },
    { value: 'truck', label: '🚚 Truck' },
    { value: 'convertible', label: '🏎️ Convertible' },
    { value: 'van', label: '🚐 Van' },
    { value: 'coupe', label: '🚘 Coupe' },
  ];

  const transmissionOptions = [
    { value: 'automatic', label: '⚙️ Automatic' },
    { value: 'manual', label: '🔧 Manual' },
  ];

  const fuelOptions = [
    { value: 'petrol', label: '⛽ Petrol' },
    { value: 'diesel', label: '🛢️ Diesel' },
    { value: 'electric', label: '⚡ Electric' },
    { value: 'hybrid', label: '🌿 Hybrid' },
  ];

  const selectStyles = {
    control: (base, state) => ({
      ...base,
      border: `1px solid ${state.isFocused ? '#3b82f6' : '#f3f4f6'}`,
      boxShadow: state.isFocused ? '0 0 0 3px rgba(59,130,246,0.1)' : 'none',
      background: '#f9fafb',
      minHeight: '42px',
      cursor: 'pointer',
      borderRadius: '12px',
      transition: 'all 0.2s ease',
      '&:hover': { borderColor: '#3b82f6' },
    }),
    indicatorSeparator: () => ({ display: 'none' }),
    dropdownIndicator: (base, state) => ({
      ...base,
      color: state.isFocused ? '#3b82f6' : '#9ca3af',
      padding: '0 8px',
      transition: 'all 0.2s ease',
      transform: state.selectProps.menuIsOpen ? 'rotate(180deg)' : 'rotate(0deg)',
    }),
    menu: (base) => ({
      ...base,
      borderRadius: '16px',
      boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
      border: '1px solid #f1f5f9',
      overflow: 'hidden',
      marginTop: '6px',
      zIndex: 999,
      animation: 'selectSlideDown 0.2s ease-out forwards',
    }),
    menuList: (base) => ({ ...base, padding: '6px' }),
    option: (base, state) => ({
      ...base,
      borderRadius: '10px',
      fontSize: '13px',
      padding: '10px 12px',
      cursor: 'pointer',
      backgroundColor: state.isSelected ? '#3b82f6' : state.isFocused ? '#eff6ff' : 'white',
      color: state.isSelected ? 'white' : '#374151',
      fontWeight: state.isSelected ? '600' : '400',
      transition: 'all 0.15s ease',
    }),
    singleValue: (base) => ({ ...base, fontSize: '13px', color: '#374151', fontWeight: '500' }),
    placeholder: (base) => ({ ...base, fontSize: '13px', color: '#9ca3af' }),
    valueContainer: (base) => ({ ...base, padding: '0 12px' }),
  };

  useEffect(() => { fetchCars(); }, []);

  const fetchCars = async () => {
    try {
      const res = await api.get('/cars');
      setCars(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
    setError('');
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const data = new FormData();
      data.append('image', file);
      const res = await api.post('/upload', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setFormData((prev) => ({ ...prev, images: [...prev.images, res.data.url] }));
      setSuccess('Image uploaded! ✅');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Image upload failed');
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (index) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleEdit = (car) => {
    setEditCar(car);
    setFormData({
      brand: car.brand,
      model: car.model,
      year: car.year,
      type: car.type,
      pricePerDay: car.pricePerDay,
      seats: car.seats,
      transmission: car.transmission,
      fuel: car.fuel,
      location: car.location,
      description: car.description,
      images: car.images || [],
      available: car.available,
    });
    setShowForm(true);
    setError('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async () => {
    if (!formData.brand || !formData.model || !formData.year || !formData.pricePerDay) {
      return setError('Please fill in all required fields');
    }
    setSubmitting(true);
    try {
      const payload = {
        ...formData,
        year: Number(formData.year),
        pricePerDay: Number(formData.pricePerDay),
        seats: Number(formData.seats),
      };
      if (editCar) {
        await api.put(`/cars/${editCar._id}`, payload);
        setSuccess('Car updated! ✅');
      } else {
        await api.post('/cars', payload);
        setSuccess('Car added! ✅');
      }
      setFormData(emptyForm);
      setEditCar(null);
      setShowForm(false);
      fetchCars();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/cars/${id}`);
      setSuccess('Car deleted! ✅');
      fetchCars();
      setDeleteConfirm(null);
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Delete failed');
    }
  };

  const inputClass = 'w-full px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-sm text-gray-800 outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all placeholder-gray-300';
  const labelClass = 'block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5';

  return (
    <div className='min-h-screen bg-[#eaecf5] pt-20 pb-10'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 py-8'>

        {/* Header */}
        <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6'>
          <div>
            <Link
              to='/admin'
              className='text-xs text-gray-400 hover:text-blue-600 transition-colors flex items-center gap-1 mb-1 w-fit'
            >
              <svg className='w-3 h-3' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15 19l-7-7 7-7' />
              </svg>
              Dashboard
            </Link>
            <h1 className='text-2xl sm:text-3xl font-bold text-gray-900'>Manage Cars</h1>
          </div>
          <button
            onClick={() => {
              setShowForm(!showForm);
              setEditCar(null);
              setFormData(emptyForm);
              setError('');
            }}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-xl transition-all w-fit ${
              showForm
                ? 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                : 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm'
            }`}
          >
            {showForm ? (
              <>
                <svg className='w-3.5 h-3.5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
                </svg>
                Cancel
              </>
            ) : (
              <>
                <svg className='w-3.5 h-3.5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 4v16m8-8H4' />
                </svg>
                Add Car
              </>
            )}
          </button>
        </div>

        {/* Success */}
        {success && (
          <div className='bg-green-50 border border-green-100 text-green-600 text-xs rounded-2xl px-4 py-3 mb-4 text-center flex items-center justify-center gap-2'>
            <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M5 13l4 4L19 7' />
            </svg>
            {success}
          </div>
        )}

        {/* Form — smooth animation */}
        <div className={`overflow-hidden transition-all duration-500 ease-in-out ${showForm ? 'max-h-[2000px] opacity-100 mb-6' : 'max-h-0 opacity-0'}`}>
          <div className='bg-white rounded-2xl shadow-sm p-5 sm:p-6'>

            {/* Form Header */}
            <div className='flex items-center gap-3 mb-6 pb-4 border-b border-gray-50'>
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-base ${editCar ? 'bg-orange-50' : 'bg-blue-50'}`}>
                {editCar ? '✏️' : '🚗'}
              </div>
              <div>
                <h2 className='text-sm font-bold text-gray-900'>
                  {editCar ? 'Edit Car' : 'Add New Car'}
                </h2>
                {editCar && (
                  <p className='text-xs text-gray-400 mt-0.5'>
                    {editCar.brand} {editCar.model} • {editCar.year}
                  </p>
                )}
              </div>
            </div>

            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>

              {/* Brand */}
              <div>
                <label className={labelClass}>Brand *</label>
                <input
                  name='brand'
                  value={formData.brand}
                  onChange={handleChange}
                  placeholder='Toyota'
                  className={inputClass}
                />
              </div>

              {/* Model */}
              <div>
                <label className={labelClass}>Model *</label>
                <input
                  name='model'
                  value={formData.model}
                  onChange={handleChange}
                  placeholder='Camry'
                  className={inputClass}
                />
              </div>

              {/* Year */}
              <div>
                <label className={labelClass}>Year *</label>
                <input
                  name='year'
                  type='number'
                  value={formData.year}
                  onChange={handleChange}
                  placeholder='2023'
                  className={inputClass}
                />
              </div>

              {/* Price */}
              <div>
                <label className={labelClass}>Price Per Day ($) *</label>
                <div className='relative'>
                  <span className='absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-semibold'>$</span>
                  <input
                    name='pricePerDay'
                    type='number'
                    value={formData.pricePerDay}
                    onChange={handleChange}
                    placeholder='50'
                    className={`${inputClass} pl-7`}
                  />
                </div>
              </div>

              {/* Seats */}
              <div>
                <label className={labelClass}>Seats</label>
                <input
                  name='seats'
                  type='number'
                  value={formData.seats}
                  onChange={handleChange}
                  placeholder='5'
                  className={inputClass}
                />
              </div>

              {/* Location */}
              <div>
                <label className={labelClass}>Location</label>
                <input
                  name='location'
                  value={formData.location}
                  onChange={handleChange}
                  placeholder='Casablanca'
                  className={inputClass}
                />
              </div>

              {/* Type */}
              <div>
                <label className={labelClass}>Type</label>
                <Select
                  styles={selectStyles}
                  options={typeOptions}
                  value={typeOptions.find(o => o.value === formData.type)}
                  onChange={(opt) => setFormData({ ...formData, type: opt.value })}
                />
              </div>

              {/* Transmission */}
              <div>
                <label className={labelClass}>Transmission</label>
                <Select
                  styles={selectStyles}
                  options={transmissionOptions}
                  value={transmissionOptions.find(o => o.value === formData.transmission)}
                  onChange={(opt) => setFormData({ ...formData, transmission: opt.value })}
                />
              </div>

              {/* Fuel */}
              <div>
                <label className={labelClass}>Fuel</label>
                <Select
                  styles={selectStyles}
                  options={fuelOptions}
                  value={fuelOptions.find(o => o.value === formData.fuel)}
                  onChange={(opt) => setFormData({ ...formData, fuel: opt.value })}
                />
              </div>

              {/* Description */}
              <div className='sm:col-span-2 lg:col-span-3'>
                <label className={labelClass}>Description</label>
                <textarea
                  name='description'
                  value={formData.description}
                  onChange={handleChange}
                  placeholder='Car description...'
                  rows={3}
                  className={`${inputClass} resize-none`}
                />
              </div>

              {/* Image Upload */}
              <div className='sm:col-span-2 lg:col-span-3'>
                <label className={labelClass}>Car Images</label>
                <label className={`flex flex-col items-center justify-center w-full h-28 border-2 border-dashed rounded-2xl cursor-pointer transition-all duration-200 ${
                  uploading
                    ? 'border-blue-300 bg-blue-50 cursor-not-allowed'
                    : 'border-gray-200 hover:border-blue-400 hover:bg-blue-50'
                }`}>
                  <input
                    type='file'
                    accept='image/*'
                    className='hidden'
                    onChange={handleImageUpload}
                    disabled={uploading}
                  />
                  {uploading ? (
                    <div className='flex flex-col items-center gap-2'>
                      <div className='w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin' />
                      <p className='text-xs text-blue-600 font-medium'>Uploading to Cloudinary...</p>
                    </div>
                  ) : (
                    <div className='flex flex-col items-center gap-1.5'>
                      <svg className='w-7 h-7 text-gray-300' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={1.5} d='M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z' />
                      </svg>
                      <p className='text-xs text-gray-400 font-medium'>Click to upload image</p>
                      <p className='text-xs text-gray-300'>JPG, PNG, WEBP</p>
                    </div>
                  )}
                </label>

                {/* Image Previews */}
                {formData.images.length > 0 && (
                  <div className='flex flex-wrap gap-3 mt-3'>
                    {formData.images.map((img, i) => (
                      <div key={i} className='relative w-20 h-16 rounded-xl overflow-hidden group border border-gray-100'>
                        <img src={img} alt='' className='w-full h-full object-cover' />
                        <div className='absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200' />
                        <button
                          onClick={() => removeImage(i)}
                          className='absolute top-1 right-1 w-5 h-5 bg-red-500 text-white rounded-full text-xs opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center font-bold'
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Available Toggle */}
              <div className='sm:col-span-2 lg:col-span-3'>
                <button
                  type='button'
                  onClick={() => setFormData({ ...formData, available: !formData.available })}
                  className='flex items-center gap-3 cursor-pointer group'
                >
                  <div className={`relative w-10 h-6 rounded-full transition-all duration-300 ${formData.available ? 'bg-blue-600' : 'bg-gray-200'}`}>
                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all duration-300 ${formData.available ? 'left-5' : 'left-1'}`} />
                  </div>
                  <span className='text-xs font-semibold text-gray-700'>Available for booking</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${formData.available ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-500'}`}>
                    {formData.available ? '✅ Available' : '❌ Unavailable'}
                  </span>
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className='bg-red-50 border border-red-100 text-red-500 text-xs rounded-xl px-4 py-3 mt-4 text-center'>
                {error}
              </div>
            )}

            {/* Form Actions */}
            <div className='flex items-center gap-3 mt-6 pt-4 border-t border-gray-50'>
              <button
                onClick={handleSubmit}
                disabled={submitting || uploading}
                className='flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white text-xs font-semibold rounded-xl transition-all'
              >
                {submitting ? (
                  <>
                    <div className='w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin' />
                    Saving...
                  </>
                ) : (
                  <>
                    <svg className='w-3.5 h-3.5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M5 13l4 4L19 7' />
                    </svg>
                    {editCar ? 'Update Car' : 'Add Car'}
                  </>
                )}
              </button>
              <button
                onClick={() => {
                  setShowForm(false);
                  setEditCar(null);
                  setFormData(emptyForm);
                  setError('');
                }}
                className='px-6 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-600 text-xs font-semibold rounded-xl transition-all'
              >
                Cancel
              </button>
            </div>
          </div>
        </div>

        {/* Cars List */}
        <div className='bg-white rounded-2xl shadow-sm overflow-hidden'>
          <div className='px-5 py-4 border-b border-gray-50 flex items-center justify-between'>
            <h2 className='text-sm font-bold text-gray-900'>All Cars</h2>
            <span className='text-xs bg-blue-50 text-blue-600 px-2.5 py-1 rounded-full font-semibold'>
              {cars.length} cars
            </span>
          </div>

          {loading ? (
            <div className='flex justify-center items-center h-40'>
              <div className='w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin' />
            </div>
          ) : cars.length === 0 ? (
            <div className='text-center py-16'>
              <p className='text-4xl mb-3'>🚗</p>
              <p className='text-gray-400 text-sm font-medium'>No cars yet</p>
              <p className='text-gray-300 text-xs mt-1'>Add your first car above</p>
            </div>
          ) : (
            <div className='divide-y divide-gray-50'>
              {cars.map((car, i) => (
                <div
                  key={car._id}
                  className='flex items-center gap-3 sm:gap-4 px-4 sm:px-5 py-4 hover:bg-gray-50 transition-colors'
                  style={{ animation: `fadeSlideUp 0.4s ease-out ${i * 0.05}s both` }}
                >
                  {/* Image */}
                  <div className='w-14 h-10 sm:w-16 sm:h-12 rounded-xl bg-[#eaecf5] overflow-hidden flex-shrink-0'>
                    {car.images?.[0] ? (
                      <img src={car.images[0]} alt='' className='w-full h-full object-cover' />
                    ) : (
                      <div className='w-full h-full flex items-center justify-center text-gray-300 text-sm'>🚗</div>
                    )}
                  </div>

                  {/* Info */}
                  <div className='flex-1 min-w-0'>
                    <p className='text-sm font-semibold text-gray-900 truncate'>{car.brand} {car.model}</p>
                    <p className='text-xs text-gray-400 truncate'>{car.year} • {car.type} • {car.fuel}</p>
                  </div>

                  {/* Price */}
                  <div className='hidden sm:block text-right flex-shrink-0'>
                    <p className='text-sm font-bold text-blue-600'>${car.pricePerDay}</p>
                    <p className='text-xs text-gray-400'>/day</p>
                  </div>

                  {/* Status */}
                  <span className={`hidden sm:block text-xs px-2.5 py-1 rounded-full font-semibold flex-shrink-0 ${car.available ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-500'}`}>
                    {car.available ? '✅ Available' : '❌ Booked'}
                  </span>

                  {/* Actions */}
                  <div className='flex items-center gap-1.5 flex-shrink-0'>
                    <button
                      onClick={() => handleEdit(car)}
                      className='flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 text-xs font-semibold rounded-xl transition-colors'
                    >
                      <svg className='w-3 h-3' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z' />
                      </svg>
                      <span className='hidden sm:block'>Edit</span>
                    </button>
                    <button
                      onClick={() => setDeleteConfirm(car._id)}
                      className='flex items-center gap-1.5 px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-500 text-xs font-semibold rounded-xl transition-colors'
                    >
                      <svg className='w-3 h-3' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16' />
                      </svg>
                      <span className='hidden sm:block'>Delete</span>
                    </button>
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
                <svg className='w-6 h-6 text-red-500' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16' />
                </svg>
              </div>
              <h3 className='text-sm font-bold text-gray-900 text-center mb-1'>Delete Car</h3>
              <p className='text-xs text-gray-400 text-center mb-5'>Are you sure? This cannot be undone.</p>
              <div className='flex gap-3'>
                <button
                  onClick={() => handleDelete(deleteConfirm)}
                  className='flex-1 py-2.5 bg-red-500 hover:bg-red-600 text-white text-xs font-semibold rounded-xl transition-colors'
                >
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

export default ManageCars;