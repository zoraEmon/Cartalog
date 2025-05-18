import axios from 'axios';

export interface FilterParams {
  categoryId?: number;
  supplierId?: number;
  transmission?: 'AUTOMATIC' | 'MANUAL' | 'SEMI_AUTOMATIC';
  engineType?: 'PETROL' | 'DIESEL' | 'ELECTRIC' | 'HYBRID';
  carColors?: string[];
  minPrice?: number;
  maxPrice?: number;
  minMileage?: number;
  maxMileage?: number;
  keyword?: string;
  page?: number;
  size?: number;
}

export interface Category {
  id: number;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  deleted: boolean;
}

export interface Supplier {
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

export interface PageResponse<T> {
  content: T[];
  pageable: {
    pageNumber: number;
    pageSize: number;
    sort: {
      empty: boolean;
      sorted: boolean;
      unsorted: boolean;
    };
    offset: number;
    paged: boolean;
    unpaged: boolean;
  };
  last: boolean;
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  sort: {
    empty: boolean;
    sorted: boolean;
    unsorted: boolean;
  };
  numberOfElements: number;
  first: boolean;
  empty: boolean;
}

const API_BASE_URL = 'http://localhost:8082/CarCatalog';

export const filterCars = async (params: FilterParams): Promise<PageResponse<Car>> => {
  const queryParams = new URLSearchParams();
  
  // Add non-empty parameters to query string
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      if (Array.isArray(value)) {
        value.forEach(v => queryParams.append(key, v.toString()));
      } else {
        queryParams.append(key, value.toString());
      }
    }
  });

  const response = await axios.get(
    `${API_BASE_URL}/admin/cars/filter?${queryParams.toString()}`
  );
  
  return response.data;
};

export const getCategories = async (): Promise<Category[]> => {
  const response = await axios.get(`${API_BASE_URL}/admin/categories/collections`);
  return response.data;
};

export const getSuppliers = async (): Promise<Supplier[]> => {
  const response = await axios.get(`${API_BASE_URL}/admin/suppliers/collections`);
  return response.data;
};

export interface Car {
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
  createdAt: string;
  updatedAt: string;
  deleted: boolean;
} 