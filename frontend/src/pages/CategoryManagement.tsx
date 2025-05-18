import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

interface Category {
  id: number;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  deleted: boolean;
}

interface CategoryFormData {
  name: string;
  description: string;
}

const CategoryManagement = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<Category[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState<CategoryFormData>({
    name: '',
    description: ''
  });

  useEffect(() => {
    const isAuthenticated = localStorage.getItem('isAdminAuthenticated');
    if (!isAuthenticated) {
      navigate('/admin/login');
      return;
    }

    fetchCategories();
  }, [navigate]);

  const fetchCategories = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await axios.get(
        'http://localhost:8082/CarCatalog/admin/categories/collections',
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        navigate('/admin/login');
      }
    }
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      description: category.description
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (categoryId: number) => {
    if (!window.confirm('Are you sure you want to delete this category?')) {
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
        `http://localhost:8082/CarCatalog/admin/categories/${categoryId}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      toast.success('Category deleted successfully!');
      fetchCategories();
    } catch (error) {
      console.error('Error deleting category:', error);
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.message || 'Failed to delete category. Please try again.';
        toast.error(errorMessage);
        if (error.response?.status === 401) {
          navigate('/admin/login');
        }
      } else {
        toast.error('Failed to delete category. Please try again.');
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.description) {
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
      if (editingCategory) {
        // Update existing category
        await axios.put(
          `http://localhost:8082/CarCatalog/admin/categories/${editingCategory.id}`,
          formData,
          {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            }
          }
        );
        toast.success('Category updated successfully!');
      } else {
        // Create new category
        await axios.post(
          'http://localhost:8082/CarCatalog/admin/categories',
          formData,
          {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            }
          }
        );
        toast.success('Category created successfully!');
      }

      // Reset form
      setFormData({
        name: '',
        description: ''
      });
      setEditingCategory(null);
      // Refresh categories list
      fetchCategories();
    } catch (error) {
      console.error('Error saving category:', error);
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.message || 'Failed to save category. Please try again.';
        toast.error(errorMessage);
        if (error.response?.status === 401) {
          navigate('/admin/login');
        }
      } else {
        toast.error('Failed to save category. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setEditingCategory(null);
    setFormData({
      name: '',
      description: ''
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Create/Edit Category Form */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <h1 className="text-3xl font-bold mb-8">
            {editingCategory ? 'Edit Category' : 'Create a Category'}
          </h1>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category Name
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

            {/* Submit and Cancel Buttons */}
            <div className="flex justify-end space-x-4">
              {editingCategory && (
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
                  ? editingCategory ? 'Updating...' : 'Creating...'
                  : editingCategory ? 'Update Category' : 'Create Category'}
              </button>
            </div>
          </form>
        </div>

        {/* Categories List */}
        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold mb-6">Existing Categories</h2>
          <div className="space-y-4">
            {categories.map((category) => (
              <div key={category.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-semibold">{category.name}</h3>
                    <p className="text-gray-600 mt-2">{category.description}</p>
                    <div className="mt-2 text-sm text-gray-500">
                      <p>Created: {new Date(category.createdAt).toLocaleDateString()}</p>
                      <p>Updated: {new Date(category.updatedAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(category)}
                      className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(category.id)}
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

export default CategoryManagement; 