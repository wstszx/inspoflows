import React from 'react';

const SkeletonCard: React.FC = () => {
  return (
    <div className="bg-gray-200/80 rounded-3xl p-5 sm:p-6 animate-pulse">
      <div className="flex items-center mb-4">
        <div className="w-12 h-12 rounded-full bg-gray-300/80 mr-4"></div>
        <div>
          <div className="h-5 w-28 bg-gray-300/80 rounded-md mb-2"></div>
          <div className="h-4 w-20 bg-gray-300/80 rounded-md"></div>
        </div>
      </div>
      <div className="space-y-3 mb-5">
        <div className="h-4 bg-gray-300/80 rounded-md w-full"></div>
        <div className="h-4 bg-gray-300/80 rounded-md w-5/6"></div>
        <div className="h-4 bg-gray-300/80 rounded-md w-3/4"></div>
      </div>
       <div className="flex items-center pt-4 border-t border-gray-300/80">
          <div className="w-6 h-6 bg-gray-300/80 rounded-full"></div>
          <div className="w-8"></div>
          <div className="w-6 h-6 bg-gray-300/80 rounded-full"></div>
        </div>
    </div>
  );
};

export default SkeletonCard;