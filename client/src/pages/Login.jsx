// import React, { useState } from 'react';
// import { GoogleLogo, ArrowLeft } from '@phosphor-icons/react';
// import { useNavigate } from 'react-router-dom';

// const Login = () => {
//   const navigate = useNavigate();
//   const [form, setForm] = useState({ email: '', password: '' });
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setForm((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setIsSubmitting(true);

//     // TODO: hook this up to real backend auth
//     setTimeout(() => {
//       setIsSubmitting(false);
//       navigate('/');
//     }, 800);
//   };

//   const handleGoogleLogin = () => {
//     // TODO: integrate Google OAuth flow here
//     alert('Google login coming soon 🙂');
//   };

//   return (
//     <div className="flex-1 flex items-center justify-center h-full relative z-10">
//       <div className="max-w-md w-full px-6 py-8 bg-[#1A1D23] rounded-2xl border border-gray-800 shadow-2xl">
//         <button
//           type="button"
//           onClick={() => navigate('/')}
//           className="mb-6 flex items-center gap-2 text-sm text-gray-400 hover:text-white transition"
//         >
//           <ArrowLeft size={18} /> Back to feed
//         </button>

//         <h1 className="text-2xl font-bold text-white mb-2">Welcome back</h1>
//         <p className="text-sm text-gray-400 mb-6">
//           Login to save your favourite captions and sync across devices.
//         </p>

//         <form onSubmit={handleSubmit} className="space-y-4">
//           <div>
//             <label className="block text-sm text-gray-300 mb-1">Email</label>
//             <input
//               type="email"
//               name="email"
//               required
//               value={form.email}
//               onChange={handleChange}
//               className="w-full bg-[#121418] border border-gray-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
//               placeholder="you@example.com"
//             />
//           </div>

//           <div>
//             <label className="block text-sm text-gray-300 mb-1">Password</label>
//             <input
//               type="password"
//               name="password"
//               required
//               value={form.password}
//               onChange={handleChange}
//               className="w-full bg-[#121418] border border-gray-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
//               placeholder="••••••••"
//             />
//           </div>

//           <button
//             type="submit"
//             disabled={isSubmitting}
//             className="w-full mt-2 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-sm font-semibold text-white shadow-lg shadow-purple-900/40 hover:shadow-purple-900/60 hover:scale-[1.01] transition disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center"
//           >
//             {isSubmitting ? 'Logging in…' : 'Login'}
//           </button>
//         </form>

//         <div className="mt-6 flex items-center gap-2 text-xs text-gray-500">
//           <div className="flex-1 h-px bg-gray-700" />
//           OR
//           <div className="flex-1 h-px bg-gray-700" />
//         </div>

//         <button
//           type="button"
//           onClick={handleGoogleLogin}
//           className="mt-4 w-full py-2.5 rounded-xl border border-gray-700 bg-[#121418] text-sm font-medium text-gray-100 hover:bg-gray-900 transition flex items-center justify-center gap-2"
//         >
//           <GoogleLogo size={18} weight="fill" className="text-[#4285F4]" />
//           Continue with Google
//         </button>
//       </div>
//     </div>
//   );
// };

// export default Login;


