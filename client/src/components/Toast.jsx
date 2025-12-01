import React from 'react';
import { CheckCircle } from '@phosphor-icons/react';

const Toast = ({ message, isVisible }) => {
  return (
    <div 
      className={`fixed bottom-10 left-1/2 transform -translate-x-1/2 bg-white text-black px-6 py-3 rounded-full shadow-2xl transition-all duration-300 z-50 font-medium flex items-center gap-2 
      ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}
    >
      <CheckCircle size={20} color="#10B981" weight="fill" />
      {message}
    </div>
  );
};

export default Toast;