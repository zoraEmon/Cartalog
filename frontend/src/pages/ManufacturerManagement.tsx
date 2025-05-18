import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

interface Manufacturer {
  id: number;
  name: string;
  email: string;
  address: string;
  website: string;
  phone: string;
  createdAt: string;
  updatedAt: string;
  deleted: boolean;
}

interface ManufacturerFormData {
  name: string;
  email: string;
  address: string;
  website: string;
  phone: string;
}

const ManufacturerManagement = () => {
  const navigate = useNavigate();
  const [manufacturers, setManufacturers] = useState<Manufacturer[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingManufacturer, setEditingManufacturer] = useState<Manufacturer | null>(null);
  const [formData, setFormData] = useState<ManufacturerFormData>({
    name: '',
    email: '',
    address: '',
    website: '',
    phone: ''
  });

  useEffect(() => {
    const isAuthenticated = localStorage.getItem('isAdminAuthenticated');
    if (!isAuthenticated) {
      navigate('/admin/login');
      return;
    }

    fetchManufacturers();
  }, [navigate]);

  const fetchManufacturers = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await axios.get(
        'http://localhost:8082/CarCatalog/admin/suppliers/collections',
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      setManufacturers(response.data);
    } catch (error) {
      console.error('Error fetching manufacturers:', error);
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        navigate('/admin/login');
      }
    }
  };

  const handleEdit = (manufacturer: Manufacturer) => {
    setEditingManufacturer(manufacturer);
    setFormData({
      name: manufacturer.name,
      email: manufacturer.email,
      address: manufacturer.address,
      website: manufacturer.website,
      phone: manufacturer.phone
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (manufacturerId: number) => {
    if (!window.confirm('Are you sure you want to delete this manufacturer?')) {
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
        `http://localhost:8082/CarCatalog/admin/suppliers/${manufacturerId}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      toast.success('Manufacturer deleted successfully!');
      fetchManufacturers();
    } catch (error) {
      console.error('Error deleting manufacturer:', error);
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.message || 'Failed to delete manufacturer. Please try again.';
        toast.error(errorMessage);
        if (error.response?.status === 401) {
          navigate('/admin/login');
        }
      } else {
        toast.error('Failed to delete manufacturer. Please try again.');
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate all fields are filled
    if (!formData.name || !formData.email || !formData.address || !formData.website || !formData.phone) {
      toast.error('Please fill in all required fields');
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    // Validate website format
    const websiteRegex = /^https?:\/\/[^\s/$.?#].[^\s]*$/;
    if (!websiteRegex.test(formData.website)) {
      toast.error('Please enter a valid website URL (starting with http:// or https://)');
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
      if (editingManufacturer) {
        // Update existing manufacturer
        await axios.put(
          `http://localhost:8082/CarCatalog/admin/suppliers/${editingManufacturer.id}`,
          formData,
          {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            }
          }
        );
        toast.success('Manufacturer updated successfully!');
      } else {
        // Create new manufacturer
        await axios.post(
          'http://localhost:8082/CarCatalog/admin/suppliers',
          formData,
          {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            }
          }
        );
        toast.success('Manufacturer created successfully!');
      }

      // Reset form
      setFormData({
        name: '',
        email: '',
        address: '',
        website: '',
        phone: ''
      });
      setEditingManufacturer(null);
      // Refresh manufacturers list
      fetchManufacturers();
    } catch (error) {
      console.error('Error saving manufacturer:', error);
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.message || 'Failed to save manufacturer. Please try again.';
        toast.error(errorMessage);
        if (error.response?.status === 401) {
          navigate('/admin/login');
        }
      } else {
        toast.error('Failed to save manufacturer. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setEditingManufacturer(null);
    setFormData({
      name: '',
      email: '',
      address: '',
      website: '',
      phone: ''
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Create/Edit Manufacturer Form */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <h1 className="text-3xl font-bold mb-8">
            {editingManufacturer ? 'Edit Manufacturer' : 'Create a Manufacturer'}
          </h1>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Manufacturer Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* Address */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Address
              </label>
              <textarea
                value={formData.address}
                onChange={(e) => setFormData({...formData, address: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
                required
              />
            </div>

            {/* Website */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Website
              </label>
              <input
                type="url"
                value={formData.website}
                onChange={(e) => setFormData({...formData, website: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="https://www.example.com"
                required
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="+1-234-567-8900"
                required
              />
            </div>

            {/* Submit and Cancel Buttons */}
            <div className="flex justify-end space-x-4">
              {editingManufacturer && (
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
                  ? editingManufacturer ? 'Updating...' : 'Creating...'
                  : editingManufacturer ? 'Update Manufacturer' : 'Create Manufacturer'}
              </button>
            </div>
          </form>
        </div>

        {/* Manufacturers List */}
        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold mb-6">Existing Manufacturers</h2>
          <div className="space-y-4">
            {manufacturers.map((manufacturer) => (
              <div key={manufacturer.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-semibold">{manufacturer.name}</h3>
                    <div className="mt-2 space-y-1 text-gray-600">
                      <p>
                        <span className="font-medium">Email:</span>{' '}
                        <a href={`mailto:${manufacturer.email}`} className="text-blue-500 hover:underline">
                          {manufacturer.email}
                        </a>
                      </p>
                      <p>
                        <span className="font-medium">Website:</span>{' '}
                        <a href={manufacturer.website} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                          {manufacturer.website}
                        </a>
                      </p>
                      <p>
                        <span className="font-medium">Phone:</span>{' '}
                        <a href={`tel:${manufacturer.phone}`} className="text-blue-500 hover:underline">
                          {manufacturer.phone}
                        </a>
                      </p>
                      <p><span className="font-medium">Address:</span> {manufacturer.address}</p>
                    </div>
                    <div className="mt-2 text-sm text-gray-500">
                      <p>Created: {new Date(manufacturer.createdAt).toLocaleDateString()}</p>
                      <p>Updated: {new Date(manufacturer.updatedAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(manufacturer)}
                      className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(manufacturer.id)}
                      className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManufacturerManagement; 