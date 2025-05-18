import React, { useState, useEffect } from 'react';
import Layout from '../layouts/Layout';
import { Search, Filter } from 'react-feather';
import CarInfoCard from '../components/CarInfoCard';
import CarCard from '../components/CarCard';
import FilterPanel from '../components/FilterPanel';
import type { FilterParams, Car as BaseCarType } from '../services/carService';
import { filterCars } from '../services/carService';
import { motion } from 'framer-motion';

// Define the API response type that includes additional fields
interface ApiCar extends BaseCarType {
  supplierName?: string;
  categoryName?: string;
}

// Our local Car type that makes additional fields required
interface Car extends Omit<BaseCarType, 'deleted'> {
  supplierName: string;
  categoryName: string;
  deleted?: boolean;
}

const Catalog = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [isBackspace, setIsBackspace] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCar, setSelectedCar] = useState<Car | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [filters, setFilters] = useState<FilterParams>({
    keyword: '',
    page: 0,
    size: 20,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await filterCars({
          ...filters,
          page: currentPage,
        });
        
        // Type assertion for the API response
        const apiCars = response.content as ApiCar[];
        
        // Map the API response to ensure required fields
        const mappedCars = apiCars.map(car => ({
          ...car,
          supplierName: car.supplierName || 'Unknown Supplier',
          categoryName: car.categoryName || 'Unknown Category',
        }));
        
        setCars(mappedCars);
        setTotalPages(response.totalPages);
      } catch (error) {
        console.error('Error fetching cars:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [filters, currentPage]);

  // Debounce search term updates
  useEffect(() => {
    const delay = isBackspace ? 2000 : 300; // 2s for backspace, 300ms for typing
    
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      setIsBackspace(false);
    }, delay);

    return () => clearTimeout(timer);
  }, [searchTerm, isBackspace]);

  // Update filters when debounced search term changes
  useEffect(() => {
    setFilters(prev => ({
      ...prev,
      keyword: debouncedSearchTerm,
      page: 0 // Reset to first page on new search
    }));
  }, [debouncedSearchTerm]);

  const handleViewDetails = (car: Car) => {
    setSelectedCar(car);
    setIsModalOpen(true);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      setIsBackspace(true);
      setLoading(true);
    }
  };

  const handleFilterChange = (newFilters: Partial<FilterParams>) => {
    setFilters(prev => ({
      ...prev,
      ...newFilters,
    }));
    setCurrentPage(0);
  };

  const handleFilterReset = () => {
    setFilters({
      keyword: '',
      page: 0,
      size: 20,
    });
    setCurrentPage(0);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        {/* Search and Filter Bar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
          <div className="flex items-center justify-between py-4">
            <div className="relative flex-1 max-w-xl">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Search cars..."
                value={searchTerm}
                onChange={handleSearch}
                onKeyDown={handleKeyDown}
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="ml-4 p-2 text-gray-400 hover:text-gray-500 focus:outline-none"
            >
              <Filter className="h-6 w-6" />
            </button>
          </div>

          {/* Filter Panel */}
          {showFilters && (
            <div className="mt-4">
              <FilterPanel
                onFilterChange={handleFilterChange}
                onReset={handleFilterReset}
              />
            </div>
          )}
        </div>

        {/* Product Grid */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-8 justify-items-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {cars.map((car) => (
              <motion.div
                key={car.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <CarCard
                  id={car.id}
                  name={car.name}
                  description={car.description}
                  price={car.price}
                  imageUrls={car.imageUrls}
                  engineType={car.engineType}
                  transmission={car.transmission}
                  manufacturerName={car.supplierName}
                  onViewDetails={() => handleViewDetails(car)}
                />
              </motion.div>
            ))}
          </motion.div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-8 gap-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
                disabled={currentPage === 0}
                className="px-4 py-2 border border-gray-300 rounded-md disabled:opacity-50"
              >
                Previous
              </button>
              <span className="px-4 py-2">
                Page {currentPage + 1} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(prev => Math.min(totalPages - 1, prev + 1))}
                disabled={currentPage === totalPages - 1}
                className="px-4 py-2 border border-gray-300 rounded-md disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </div>

        {/* Car Info Modal */}
        {selectedCar && (
          <CarInfoCard
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            car={selectedCar}
          />
        )}
      </div>
    </Layout>
  );
};

export default Catalog;