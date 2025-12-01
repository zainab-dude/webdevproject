const gradients = [
    "from-cyan-400 to-blue-600",
    "from-purple-500 to-pink-500",
    "from-orange-400 to-rose-500",
    "from-indigo-500 via-purple-500 to-indigo-500",
    "from-emerald-400 to-teal-600",
    "from-slate-600 to-slate-800",
    "from-rose-400 to-red-500",
    "from-fuchsia-500 to-cyan-500"
  ];
  
  const getRandomGradient = () => {
    return gradients[Math.floor(Math.random() * gradients.length)];
  };
  
  module.exports = { getRandomGradient };