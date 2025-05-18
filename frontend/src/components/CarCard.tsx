import React, { useState } from 'react';

interface CarCardProps {
  id: number;
  name: string;
  description: string;
  price: number;
  imageUrls: string[];
  engineType: string;
  transmission: string;
  manufacturerName: string;
  onViewDetails: () => void;
}

const CarCard: React.FC<CarCardProps> = ({
  name,
  description,
  price,
  imageUrls,
  engineType,
  transmission,
  manufacturerName,
  onViewDetails
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev + 1) % imageUrls.length);
  };

  const previousImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev - 1 + imageUrls.length) % imageUrls.length);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden w-[360px] h-[520px] flex flex-col">
      {/* Image Carousel */}
      <div className="relative h-[240px] w-full flex-shrink-0">
        <img
          src={imageUrls[currentImageIndex]}
          alt={name}
          className="w-full h-full object-cover"
        />
        {imageUrls.length > 1 && (
          <>
            <button
              onClick={previousImage}
              className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white rounded-full p-2 hover:bg-opacity-75 transition-all z-10"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={nextImage}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white rounded-full p-2 hover:bg-opacity-75 transition-all z-10"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
            <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1 z-10">
              {imageUrls.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full ${
                    index === currentImageIndex ? 'bg-white' : 'bg-white bg-opacity-50'
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Content */}
      <div className="p-4 flex-1 flex flex-col">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-800 truncate mb-1" title={name}>
            {name}
          </h3>
          <p className="text-sm text-gray-500 mb-2">{manufacturerName}</p>
          <p 
            className="text-gray-600 line-clamp-2 text-sm"
            style={{
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}
            title={description}
          >
            {description}
          </p>
        </div>

        {/* Car Details */}
        <div className="mt-4 space-y-2">
          <div className="flex items-center text-sm text-gray-500">
            <span className="mr-2">•</span>
            <span>{engineType}</span>
          </div>
          <div className="flex items-center text-sm text-gray-500">
            <span className="mr-2">•</span>
            <span>{transmission}</span>
          </div>
        </div>

        {/* Price and Button */}
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <span className="text-xl font-bold text-gray-900">${price.toLocaleString()}</span>
            <button
              onClick={onViewDetails}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
            >
              View Details
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarCard; 