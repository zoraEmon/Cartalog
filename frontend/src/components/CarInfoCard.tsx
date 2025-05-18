import React from 'react';

interface CarInfoCardProps {
  isOpen: boolean;
  onClose: () => void;
  car: {
    id: number;
    name: string;
    description: string;
    supplierId: number;
    categoryId: number;
    price: number;
    carColors: string[];
    transmission: string;
    engineType: string;
    mileage: number;
    imageUrls: string[];
    manufacturedDate: string;
  };
}

const CarInfoCard: React.FC<CarInfoCardProps> = ({ isOpen, onClose, car }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg overflow-hidden max-w-4xl w-full mx-4 flex">
        {/* Left side - Image */}
        <div className="w-1/2 p-3">
          <img
            src={car.imageUrls[0]}
            alt={car.name}
            className="w-full h-full object-cover rounded-lg"
          />
        </div>

        {/* Right side - Info */}
        <div className="w-1/2 p-8">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-3xl font-bold text-gray-800 mb-1">{car.name}</h2>
              <p className="text-gray-500 mb-4">Supplier ID: {car.supplierId}</p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="space-y-4 mb-6">
            <div className="border-b border-gray-200 pb-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Features</h3>
              <ul className="space-y-2">
                <li className="flex items-center text-gray-600">
                  <span className="w-4 h-4 mr-2 text-emerald-500">•</span>
                  {car.engineType} Engine
                </li>
                <li className="flex items-center text-gray-600">
                  <span className="w-4 h-4 mr-2 text-emerald-500">•</span>
                  {car.transmission} Transmission
                </li>
                <li className="flex items-center text-gray-600">
                  <span className="w-4 h-4 mr-2 text-emerald-500">•</span>
                  {car.mileage} km/L Mileage
                </li>
                <li className="flex items-center text-gray-600">
                  <span className="w-4 h-4 mr-2 text-emerald-500">•</span>
                  Manufactured: {new Date(car.manufacturedDate).getFullYear()}
                </li>
              </ul>
            </div>

            <div className="flex items-center gap-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1">Available Colors</label>
                <div className="flex gap-2">
                  {car.carColors.map((color) => (
                    <div
                      key={color}
                      className="w-6 h-6 rounded-full border border-gray-300"
                      style={{ backgroundColor: color.toLowerCase() }}
                      title={color}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between mt-6">
            <div>
              <p className="text-4xl font-bold text-gray-800">
                ${car.price.toLocaleString()}
              </p>
            </div>
          
          </div>

          <p className="mt-6 text-gray-600">{car.description}</p>
        </div>
      </div>
    </div>
  );
};

export default CarInfoCard; 