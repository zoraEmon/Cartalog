package com.projects.cartalogSystem.services;

import com.projects.cartalogSystem.DTOs.createDTOs.CategoryCreateDTO;
import com.projects.cartalogSystem.DTOs.responseDTOs.CategoryResponseDTO;
import com.projects.cartalogSystem.DTOs.updateDTOs.CategoryUpdateDTO;

import java.util.ArrayList;

public interface CategoryService {
    CategoryResponseDTO createCategory(CategoryCreateDTO categoryCreateDTO);
    CategoryResponseDTO getCategory(Long id);
    CategoryResponseDTO updateCategory(Long id, CategoryUpdateDTO categoryUpdateDTO);
    void deleteCategory(Long id);
    ArrayList<CategoryResponseDTO> getAllCategories();
}
