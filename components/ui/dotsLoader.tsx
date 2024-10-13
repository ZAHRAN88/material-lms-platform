import React from 'react';

const DotsLoader = () => {
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="flex space-x-2">
        <div className="w-4 h-4 bg-[#003285] dark:bg-[#626F7F]   rounded-full animate-bounce"></div>
        <div className="w-4 h-4 bg-[#003285] dark:bg-[#626F7F]    rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
        <div className="w-4 h-4 bg-[#003285] dark:bg-[#626F7F]   rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
      </div>
    </div>
  );
};

export default DotsLoader;