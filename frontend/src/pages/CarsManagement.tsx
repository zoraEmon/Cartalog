import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import type { Category, Manufacturer } from '../types/car';
import { CAR_COLORS, ENGINE_TYPES, TRANSMISSIONS } from '../types/car';
import Select from 'react-select';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { toast } from 'react-toastify';

interface SelectOption {
  value: number | string;
  label: string;
}

interface CarFormData {
  name: string;
  description: string;
  categories: Category | null;
  manufacturer: Manufacturer | null;
  releaseDate: Date | null;
  images: File[];
  transmission: string;
  engineType: string;
  selectedColors: string[];
  price: number;
  mileage: number;
}

interface Car {
  id: number;
  name: string;
  description: string;
  supplierName: string;
  categoryName: string;
  price: number;
  carColors: string[];
  colorCode: string[];
  transmission: string;
  transmissionDescription: string;
  engineType: string;
  engineDescription: string;
  mileage: number;
  imageUrls: string[];
  manufacturedDate: string;
  createdAt: string;
  updatedAt: string;
  deleted: boolean;
}

const CarsManagement = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<Category[]>([]);
  const [manufacturers, setManufacturers] = useState<Manufacturer[]>([]);
  const [cars, setCars] = useState<Car[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingCar, setEditingCar] = useState<Car | null>(null);
  const [searchInput, setSearchInput] = useState('');
  const [validationErrors, setValidationErrors] = useState<{
    manufacturer?: string;
    category?: string;
    transmission?: string;
    engineType?: string;
  }>({});
  const [formData, setFormData] = useState<CarFormData>({
    name: '',
    description: '',
    categories: null,
    manufacturer: null,
    releaseDate: null,
    images: [],
    transmission: '',
    engineType: '',
    selectedColors: [],
    price: 0,
    mileage: 0
  });

  useEffect(() => {
    const isAuthenticated = localStorage.getItem('isAdminAuthenticated');
    if (!isAuthenticated) {
      navigate('/admin/login');
      return;
    }

    fetchInitialData();
  }, [navigate]);

  const fetchInitialData = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const [categoriesRes, manufacturersRes, carsRes] = await Promise.all([
        axios.get('http://localhost:8082/CarCatalog/admin/categories/collections', {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        axios.get('http://localhost:8082/CarCatalog/admin/suppliers/collections', {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        axios.get('http://localhost:8082/CarCatalog/admin/cars/collections', {
          headers: { 'Authorization': `Bearer ${token}` }
        })
      ]);

      setCategories(categoriesRes.data);
      setManufacturers(manufacturersRes.data);
      setCars(carsRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        navigate('/admin/login');
      }
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const newImages = Array.from(event.target.files);
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, ...newImages]
      }));
    }
  };

  const handleColorToggle = (hex: string) => {
    setFormData(prev => ({
      ...prev,
      selectedColors: prev.selectedColors.includes(hex)
        ? prev.selectedColors.filter(color => color !== hex)
        : [...prev.selectedColors, hex]
    }));
  };

  const handleEdit = (car: Car) => {
    // Find the manufacturer and category objects
    const manufacturer = manufacturers.find(m => m.name === car.supplierName);
    if (!manufacturer) {
      toast.error('Could not find matching manufacturer. Please refresh the page.');
      return;
    }

    const category = categories.find(c => c.name === car.categoryName);
    if (!category) {
      toast.error('Could not find matching category. Please refresh the page.');
      return;
    }

    // Convert color names to hex codes for selection
    const selectedColors = car.carColors.map(colorName => {
      const color = CAR_COLORS.find(c => c.name.toLowerCase() === colorName.toLowerCase());
      return color ? color.hex : '';
    }).filter(hex => hex !== '');

    setEditingCar(car);
    setFormData({
      name: car.name,
      description: car.description,
      categories: category,
      manufacturer: manufacturer,
      releaseDate: new Date(car.manufacturedDate),
      images: [], // Can't pre-fill images as they're File objects
      transmission: car.transmission.toUpperCase(),
      engineType: car.engineType.toUpperCase(),
      selectedColors: selectedColors,
      price: car.price,
      mileage: car.mileage
    });

    // Log the pre-filled data for verification
    console.log('Pre-filled form data:', {
      name: car.name,
      description: car.description,
      category: category.name,
      manufacturer: manufacturer.name,
      releaseDate: car.manufacturedDate,
      transmission: car.transmission,
      engineType: car.engineType,
      colors: selectedColors,
      price: car.price,
      mileage: car.mileage
    });

    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (carId: number) => {
    if (!window.confirm('Are you sure you want to delete this car?')) {
      return;
    }

    const token = localStorage.getItem('adminToken');
    if (!token) {
      toast.error('Authentication token not found. Please login again.');
      navigate('/admin/login');
      return;
    }

    try {
      await axios.delete(
        `http://localhost:8082/CarCatalog/admin/cars/${carId}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      toast.success('Car deleted successfully!');
      fetchInitialData(); // Refresh cars list
    } catch (error) {
      console.error('Error deleting car:', error);
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.message || 'Failed to delete car. Please try again.';
        toast.error(errorMessage);
        if (error.response?.status === 401) {
          navigate('/admin/login');
        }
      } else {
        toast.error('Failed to delete car. Please try again.');
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.manufacturer || !formData.categories || !formData.releaseDate) {
      toast.error('Please fill in all required fields');
      return;
    }

    const token = localStorage.getItem('adminToken');
    if (!token) {
      toast.error('Authentication token not found. Please login again.');
      navigate('/admin/login');
      return;
    }

    setIsSubmitting(true);

    try {
      // Convert selected colors to the correct format
      const selectedColorNames = formData.selectedColors.map(hex => {
        const color = CAR_COLORS.find(c => c.hex === hex);
        return color ? color.name.toUpperCase() : '';
      }).filter(name => name !== '');

      // Prepare the car data
      const carData = {
        name: formData.name,
        description: formData.description,
        supplierId: formData.manufacturer.id,
        categoryId: formData.categories.id,
        price: formData.price,
        carColors: selectedColorNames,
        carTransmission: formData.transmission.toUpperCase(),
        engineType: formData.engineType.toUpperCase(),
        imageUrls: [],
        mileage: formData.mileage,
        manufacturedDate: formData.releaseDate.toISOString().split('T')[0]
      };

      // Create form data
      const formDataToSend = new FormData();
      
      // Convert carData to a proper string
      const carBlob = new Blob([JSON.stringify(carData)], {
        type: 'application/json'
      });
      formDataToSend.append('car', carBlob);
      
      // Append each image
      formData.images.forEach((image, index) => {
        formDataToSend.append('images', image, `image${index + 1}.${image.name.split('.').pop()}`);
      });

      if (editingCar) {
        // Update existing car
        await axios.put(
          `http://localhost:8082/CarCatalog/admin/cars/${editingCar.id}`,
          formDataToSend,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
              'Authorization': `Bearer ${token}`
            }
          }
        );
        toast.success('Car updated successfully!');
      } else {
        // Create new car
        await axios.post(
          'http://localhost:8082/CarCatalog/admin/cars',
          formDataToSend,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
              'Authorization': `Bearer ${token}`
            }
          }
        );
        toast.success('Car created successfully!');
      }

      // Reset form
      setFormData({
        name: '',
        description: '',
        categories: null,
        manufacturer: null,
        releaseDate: null,
        images: [],
        transmission: '',
        engineType: '',
        selectedColors: [],
        price: 0,
        mileage: 0
      });
      setEditingCar(null);
      // Refresh cars list
      fetchInitialData();
    } catch (error) {
      console.error('Error saving car:', error);
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.message || 'Failed to save car. Please try again.';
        toast.error(errorMessage);
        if (error.response?.status === 401) {
          navigate('/admin/login');
        }
      } else {
        toast.error('Failed to save car. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setEditingCar(null);
    setFormData({
      name: '',
      description: '',
      categories: null,
      manufacturer: null,
      releaseDate: null,
      images: [],
      transmission: '',
      engineType: '',
      selectedColors: [],
      price: 0,
      mileage: 0
    });
  };

  const validateInputs = (input: string) => {
    const [manufacturerName, categoryName, transmissionType, engineTypeValue] = input.split(' ');
    const errors: { [key: string]: string } = {};

    // Validate manufacturer
    if (manufacturerName) {
      const manufacturerExists = manufacturers.some(
        m => m.name.toLowerCase() === manufacturerName.toLowerCase()
      );
      if (!manufacturerExists) {
        errors.manufacturer = `Manufacturer "${manufacturerName}" not found`;
      } else {
        const manufacturer = manufacturers.find(
          m => m.name.toLowerCase() === manufacturerName.toLowerCase()
        );
        if (manufacturer) {
          setFormData(prev => ({ ...prev, manufacturer }));
        }
      }
    }

    // Validate category
    if (categoryName) {
      const categoryExists = categories.some(
        c => c.name.toLowerCase() === categoryName.toLowerCase()
      );
      if (!categoryExists) {
        errors.category = `Category "${categoryName}" not found`;
      } else {
        const category = categories.find(
          c => c.name.toLowerCase() === categoryName.toLowerCase()
        );
        if (category) {
          setFormData(prev => ({ ...prev, categories: category }));
        }
      }
    }

    // Validate transmission
    if (transmissionType) {
      const transmissionExists = TRANSMISSIONS.some(
        t => t.name.toLowerCase() === transmissionType.toLowerCase()
      );
      if (!transmissionExists) {
        errors.transmission = `Transmission "${transmissionType}" not found`;
      } else {
        setFormData(prev => ({ ...prev, transmission: transmissionType.toUpperCase() }));
      }
    }

    // Validate engine type
    if (engineTypeValue) {
      const engineTypeExists = ENGINE_TYPES.some(
        e => e.name.toLowerCase() === engineTypeValue.toLowerCase()
      );
      if (!engineTypeExists) {
        errors.engineType = `Engine type "${engineTypeValue}" not found`;
      } else {
        setFormData(prev => ({ ...prev, engineType: engineTypeValue.toUpperCase() }));
      }
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    setSearchInput(input);
    if (input.trim()) {
      validateInputs(input);
    } else {
      setValidationErrors({});
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <h1 className="text-3xl font-bold mb-8">
            {editingCar ? 'Edit Car' : 'Create a Car'}
          </h1>
          
          {/* Add search input field */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Quick Search (Format: Manufacturer Category Transmission EngineType)
            </label>
            <input
              type="text"
              value={searchInput}
              onChange={handleSearchInputChange}
              placeholder="e.g. Honda Sedan Automatic Diesel"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {/* Display validation errors */}
            {Object.entries(validationErrors).map(([key, error]) => (
              <p key={key} className="text-red-500 text-sm mt-1">
                {error}
              </p>
            ))}
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Car Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Car Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={4}
                required
              />
            </div>

            {/* Categories - now single select */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <Select<SelectOption>
                value={formData.categories ? { 
                  value: formData.categories.id, 
                  label: formData.categories.name 
                } : null}
                options={categories.map(cat => ({ value: cat.id, label: cat.name }))}
                onChange={(selected) => {
                  if (selected) {
                    const selectedCategory = categories.find(cat => cat.id === selected.value);
                    setFormData({...formData, categories: selectedCategory || null});
                  }
                }}
                className="basic-select"
                classNamePrefix="select"
                isClearable
              />
            </div>

            {/* Manufacturer */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Manufacturer
              </label>
              <Select<SelectOption>
                value={formData.manufacturer ? {
                  value: formData.manufacturer.id,
                  label: formData.manufacturer.name
                } : null}
                options={manufacturers.map(man => ({ value: man.id, label: man.name }))}
                onChange={(selected) => {
                  if (selected) {
                    const selectedManufacturer = manufacturers.find(man => man.id === selected.value);
                    setFormData({...formData, manufacturer: selectedManufacturer || null});
                  }
                }}
                className="basic-select"
                classNamePrefix="select"
              />
            </div>

            {/* Release Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Release Date
              </label>
              <DatePicker
                selected={formData.releaseDate}
                onChange={(date) => setFormData({...formData, releaseDate: date})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                dateFormat="MMMM d, yyyy"
              />
            </div>

            {/* Images */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Images
              </label>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                className="w-full"
              />
              <div className="mt-2 flex flex-wrap gap-2">
                {formData.images.map((file, index) => (
                  <div key={index} className="relative">
                    <img
                      src={URL.createObjectURL(file)}
                      alt={`Preview ${index}`}
                      className="h-20 w-20 object-cover rounded"
                    />
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({
                        ...prev,
                        images: prev.images.filter((_, i) => i !== index)
                      }))}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Transmission */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Transmission
              </label>
              <Select<SelectOption>
                value={formData.transmission ? {
                  value: formData.transmission,
                  label: formData.transmission
                } : null}
                options={TRANSMISSIONS.map(trans => ({ value: trans.name, label: trans.name }))}
                onChange={(selected) => {
                  if (selected) {
                    setFormData({...formData, transmission: selected.value.toString()});
                  }
                }}
                className="basic-select"
                classNamePrefix="select"
              />
            </div>

            {/* Engine Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Engine Type
              </label>
              <Select<SelectOption>
                value={formData.engineType ? {
                  value: formData.engineType,
                  label: formData.engineType
                } : null}
                options={ENGINE_TYPES.map(engine => ({ value: engine.name, label: engine.name }))}
                onChange={(selected) => {
                  if (selected) {
                    setFormData({...formData, engineType: selected.value.toString()});
                  }
                }}
                className="basic-select"
                classNamePrefix="select"
              />
            </div>

            {/* Colors */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Colors
              </label>
              <div className="flex flex-wrap gap-4">
                {CAR_COLORS.map((color) => (
                  <label key={color.hex} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={formData.selectedColors.includes(color.hex)}
                      onChange={() => handleColorToggle(color.hex)}
                      className="form-checkbox h-5 w-5 text-blue-600"
                    />
                    <span className="flex items-center space-x-2">
                      <div
                        className="w-6 h-6 rounded border border-gray-300"
                        style={{ backgroundColor: color.hex }}
                      />
                      <span>{color.name}</span>
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Price */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price
              </label>
              <input
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({...formData, price: parseFloat(e.target.value)})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="0"
                step="0.01"
                required
              />
            </div>

            {/* Mileage */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mileage (km/L)
              </label>
              <input
                type="number"
                value={formData.mileage}
                onChange={(e) => setFormData({...formData, mileage: parseFloat(e.target.value)})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="0"
                step="0.1"
                required
              />
            </div>

            {/* Submit and Cancel Buttons */}
            <div className="flex justify-end space-x-4">
              {editingCar && (
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500"
                >
                  Cancel
                </button>
              )}
              <button
                type="submit"
                disabled={isSubmitting}
                className={`${
                  isSubmitting ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-600'
                } text-white px-6 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
              >
                {isSubmitting
                  ? editingCar ? 'Updating...' : 'Creating...'
                  : editingCar ? 'Update Car' : 'Create Car'}
              </button>
            </div>
          </form>
        </div>

        {/* Cars List */}
        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold mb-6">Existing Cars</h2>
          <div className="space-y-6">
            {cars.map((car) => (
              <div key={car.id} className="border rounded-lg p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-xl font-semibold">{car.name}</h3>
                    <p className="text-gray-600 mt-2">{car.description}</p>
                  </div>
                  <div className="flex flex-col items-end">
                    <p className="text-lg font-bold text-green-600">${car.price.toLocaleString()}</p>
                    <p className="text-sm text-gray-500">Mileage: {car.mileage} km/L</p>
                    <div className="flex space-x-2 mt-2">
                      <button
                        onClick={() => handleEdit(car)}
                        className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(car.id)}
                        className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-4">
                  <div>
                    <p><span className="font-medium">Manufacturer:</span> {car.supplierName}</p>
                    <p><span className="font-medium">Category:</span> {car.categoryName}</p>
                    <p><span className="font-medium">Transmission:</span> {car.transmission}</p>
                    <p><span className="font-medium">Engine Type:</span> {car.engineType}</p>
                    <p><span className="font-medium">Manufactured Date:</span> {new Date(car.manufacturedDate).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="font-medium">Colors:</p>
                    <div className="flex gap-2 mt-1">
                      {car.carColors.map((color, index) => (
                        <div
                          key={color}
                          className="flex items-center gap-1"
                        >
                          <div
                            className="w-6 h-6 rounded border border-gray-300"
                            style={{ backgroundColor: car.colorCode[index] }}
                            title={color}
                          />
                          <span className="text-sm">{color}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {car.imageUrls.length > 0 && (
                  <div className="mt-4">
                    <p className="font-medium mb-2">Images:</p>
                    <div className="flex gap-4 overflow-x-auto pb-2">
                      {car.imageUrls.map((url, index) => (
                        <img
                          key={index}
                          src={url}
                          alt={`${car.name} - ${index + 1}`}
                          className="w-40 h-32 object-cover rounded-lg"
                        />
                      ))}
                    </div>
                  </div>
                )}

                <div className="mt-4 text-sm text-gray-500">
                  <p>Created: {new Date(car.createdAt).toLocaleDateString()}</p>
                  <p>Updated: {new Date(car.updatedAt).toLocaleDateString()}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarsManagement; 