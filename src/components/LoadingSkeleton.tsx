import React from 'react';

export const LoadingSkeleton = () => (
  <div className="w-full h-full p-4 md:p-6 space-y-6 animate-pulse">
    {/* Header Skeleton */}
    <div className="flex items-center space-x-4">
      <div className="w-10 h-10 md:w-12 md:h-12 bg-gray-200 rounded-full"></div>
      <div className="flex-1 space-y-2">
        <div className="w-1/4 h-4 bg-gray-200 rounded"></div>
        <div className="w-1/2 h-3 bg-gray-200 rounded"></div>
      </div>
    </div>
    
    {/* Grid / Body Blocks */}
    <div className="space-y-4">
      <div className="w-full h-24 md:h-32 bg-gray-200 rounded-2xl"></div>
      <div className="grid grid-cols-2 gap-4">
        <div className="h-20 bg-gray-200 rounded-2xl"></div>
        <div className="h-20 bg-gray-200 rounded-2xl"></div>
      </div>
      <div className="w-full h-16 md:h-20 bg-gray-200 rounded-xl"></div>
    </div>

    {/* Table Rows skeleton representation */}
    <div className="space-y-3 pt-2">
      <div className="h-4 bg-gray-200 rounded w-5/6"></div>
      <div className="h-4 bg-gray-200 rounded"></div>
      <div className="h-4 bg-gray-200 rounded w-2/3"></div>
    </div>
  </div>
);

export default LoadingSkeleton;
