import React, { useState, useEffect } from 'react';
import type { FilterParams, Category, Supplier } from '../services/carService';
import { getCategories, getSuppliers } from '../services/carService';

interface FilterPanelProps {
  onFilterChange: (filters: Partial<FilterParams>) => void;
  onReset: () => void;
}

const CAR_COLORS = [
  { value: 'RED', label: 'Red', color: '#fc0303' },
  { value: 'GREEN', label: 'Green', color: '#03fc4e' },
  { value: 'BLUE', label: 'Blue', color: '#0331fc' },
  { value: 'YELLOW', label: 'Yellow', color: '#fcf403' },
  { value: 'BLACK', label: 'Black', color: '#080808' },
  { value: 'WHITE', label: 'White', color: '#ffffff' }
] as const;

const TRANSMISSION_TYPES = [
  { value: 'AUTOMATIC', label: 'Automatic', description: 'A transmission that shifts gears automatically without requiring driver input.' },
  { value: 'MANUAL', label: 'Manual', description: 'A transmission where the driver must manually change gears using a clutch and gear lever.' },
  { value: 'SEMI_AUTOMATIC', label: 'Semi-Automatic', description: 'A transmission that allows the driver to manually select gears but without a clutch pedal; gear changes are often electronically assisted.' }
] as const;

const ENGINE_TYPES = [
  { value: 'PETROL', label: 'Petrol', description: 'This refers to a common type of liquid fuel used in internal combustion engines. It is derived from crude oil through a refining process.' },
  { value: 'DIESEL', label: 'Diesel', description: 'Another type of liquid fuel derived from crude oil, but with a different refining process than petrol. Diesel engines also use internal combustion but rely on compression ignition.' },
  { value: 'ELECTRIC', label: 'Electric', description: 'This refers to vehicles powered by electric motors rather than internal combustion engines. These vehicles draw energy from rechargeable batteries.' },
  { value: 'HYBRID', label: 'Hybrid', description: 'This category encompasses vehicles that combine two or more sources of power, most commonly an internal combustion engine with one or more electric motors and a battery.' }
] as const;

const FilterPanel: React.FC<FilterPanelProps> = ({ onFilterChange, onReset }) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedCategory, setSelectedCategory] = useState<number | ''>('');
  const [selectedSupplier, setSelectedSupplier] = useState<number | ''>('');
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [transmission, setTransmission] = useState<typeof TRANSMISSION_TYPES[number]['value'] | ''>('');
  const [engineType, setEngineType] = useState<typeof ENGINE_TYPES[number]['value'] | ''>('');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [mileageRange, setMileageRange] = useState({ min: '', max: '' });
  const [priceError, setPriceError] = useState('');
  const [mileageError, setMileageError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [categoriesData, suppliersData] = await Promise.all([
          getCategories(),
          getSuppliers()
        ]);
        setCategories(categoriesData);
        setSuppliers(suppliersData);
        setError(null);
      } catch (err) {
        setError('Failed to load filter data. Please try again later.');
        console.error('Error fetching filter data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleColorToggle = (color: string) => {
    setSelectedColors(prev => {
      if (prev.includes(color)) {
        return prev.filter(c => c !== color);
      }
      return [...prev, color];
    });
  };

  const validatePriceRange = (newRange: { min: string; max: string }) => {
    const min = Number(newRange.min);
    const max = Number(newRange.max);

    if (newRange.min && newRange.max && min > max) {
      setPriceError('Minimum price cannot be greater than maximum price');
      return false;
    }
    if (min < 0 || max < 0) {
      setPriceError('Price cannot be negative');
      return false;
    }
    setPriceError('');
    return true;
  };

  const validateMileageRange = (newRange: { min: string; max: string }) => {
    const min = Number(newRange.min);
    const max = Number(newRange.max);

    if (newRange.min && newRange.max && min > max) {
      setMileageError('Minimum mileage cannot be greater than maximum mileage');
      return false;
    }
    if (min < 0 || max < 0) {
      setMileageError('Mileage cannot be negative');
      return false;
    }
    setMileageError('');
    return true;
  };

  const handlePriceChange = (type: 'min' | 'max', value: string) => {
    const newRange = { ...priceRange, [type]: value };
    setPriceRange(newRange);
    validatePriceRange(newRange);
  };

  const handleMileageChange = (type: 'min' | 'max', value: string) => {
    const newRange = { ...mileageRange, [type]: value };
    setMileageRange(newRange);
    validateMileageRange(newRange);
  };

  const handleReset = () => {
    setSelectedCategory('');
    setSelectedSupplier('');
    setSelectedColors([]);
    setTransmission('');
    setEngineType('');
    setPriceRange({ min: '', max: '' });
    setMileageRange({ min: '', max: '' });
    onReset();
  };

  const handleApply = () => {
    const isPriceValid = validatePriceRange(priceRange);
    const isMileageValid = validateMileageRange(mileageRange);

    if (!isPriceValid || !isMileageValid) {
      return;
    }

    onFilterChange({
      categoryId: selectedCategory || undefined,
      supplierId: selectedSupplier || undefined,
      carColors: selectedColors.length > 0 ? selectedColors : undefined,
      transmission: transmission || undefined,
      engineType: engineType || undefined,
      minPrice: priceRange.min ? Number(priceRange.min) : undefined,
      maxPrice: priceRange.max ? Number(priceRange.max) : undefined,
      minMileage: mileageRange.min ? Number(mileageRange.min) : undefined,
      maxMileage: mileageRange.max ? Number(mileageRange.max) : undefined,
    });
  };

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="flex justify-center items-center min-h-[200px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="text-red-600 text-center">
          {error}
          <button
            onClick={() => window.location.reload()}
            className="block mx-auto mt-2 text-blue-600 hover:text-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h2 className="text-lg font-semibold mb-4">Filtering</h2>

      {/* Category */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Category
        </label>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value ? Number(e.target.value) : '')}
          className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        >
          <option value="">All Categories</option>
          {categories.map(category => (
            <option key={category.id} value={category.id} title={category.description}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      {/* Manufacturer/Supplier */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Manufacturer
        </label>
        <select
          value={selectedSupplier}
          onChange={(e) => setSelectedSupplier(e.target.value ? Number(e.target.value) : '')}
          className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        >
          <option value="">All Manufacturers</option>
          {suppliers.map(supplier => (
            <option 
              key={supplier.id} 
              value={supplier.id}
              title={`${supplier.name}\nEmail: ${supplier.email}\nPhone: ${supplier.phone}\nWebsite: ${supplier.website}\nAddress: ${supplier.address}`}
            >
              {supplier.name}
            </option>
          ))}
        </select>
      </div>

      {/* Colors */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Colors
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {CAR_COLORS.map(color => (
            <label key={color.value} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={selectedColors.includes(color.value)}
                onChange={() => handleColorToggle(color.value)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <div className="flex items-center space-x-2">
                <div 
                  className="w-4 h-4 rounded-full border border-gray-300"
                  style={{ backgroundColor: color.color }}
                  title={color.label}
                />
                <span className="text-sm text-gray-700">{color.label}</span>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Transmission */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Transmission
        </label>
        <select
          value={transmission}
          onChange={(e) => setTransmission(e.target.value as typeof TRANSMISSION_TYPES[number]['value'] | '')}
          className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        >
          <option value="">All Transmissions</option>
          {TRANSMISSION_TYPES.map(type => (
            <option key={type.value} value={type.value} title={type.description}>
              {type.label}
            </option>
          ))}
        </select>
      </div>

      {/* Engine Type */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Engine Type
        </label>
        <select
          value={engineType}
          onChange={(e) => setEngineType(e.target.value as typeof ENGINE_TYPES[number]['value'] | '')}
          className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        >
          <option value="">All Engine Types</option>
          {ENGINE_TYPES.map(type => (
            <option key={type.value} value={type.value} title={type.description}>
              {type.label}
            </option>
          ))}
        </select>
      </div>

      {/* Price Range */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Price Range
        </label>
        <div className="space-y-2">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500">$</span>
              </div>
              <input
                type="number"
                min="0"
                placeholder="Min"
                value={priceRange.min}
                onChange={(e) => handlePriceChange('min', e.target.value)}
                className="pl-7 w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500">$</span>
              </div>
              <input
                type="number"
                min="0"
                placeholder="Max"
                value={priceRange.max}
                onChange={(e) => handlePriceChange('max', e.target.value)}
                className="pl-7 w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>
          {priceError && (
            <p className="text-red-500 text-sm">{priceError}</p>
          )}
        </div>
      </div>

      {/* Mileage Range */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Mileage Range (km/L)
        </label>
        <div className="space-y-2">
          <div className="flex gap-2">
            <input
              type="number"
              min="0"
              step="0.1"
              placeholder="Min"
              value={mileageRange.min}
              onChange={(e) => handleMileageChange('min', e.target.value)}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
            <input
              type="number"
              min="0"
              step="0.1"
              placeholder="Max"
              value={mileageRange.max}
              onChange={(e) => handleMileageChange('max', e.target.value)}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          {mileageError && (
            <p className="text-red-500 text-sm">{mileageError}</p>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-between mt-8">
        <button
          onClick={handleReset}
          className="text-blue-600 hover:text-blue-700 font-medium"
        >
          Reset default
        </button>
        <button
          onClick={handleApply}
          className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200"
          disabled={!!priceError || !!mileageError}
        >
          Apply
        </button>
      </div>
    </div>
  );
};

export default FilterPanel; 