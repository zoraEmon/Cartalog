package com.projects.cartalogSystem.services;

import com.projects.cartalogSystem.APIs.CategoryRepository;
import com.projects.cartalogSystem.DTOs.createDTOs.CategoryCreateDTO;
import com.projects.cartalogSystem.DTOs.responseDTOs.CategoryResponseDTO;
import com.projects.cartalogSystem.DTOs.updateDTOs.CategoryUpdateDTO;
import com.projects.cartalogSystem.entities.Category;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CategoryServiceImp implements CategoryService {
    private final CategoryRepository categoryRepository;

    @Override
    public CategoryResponseDTO createCategory(CategoryCreateDTO categoryCreateDTO) {
        if(categoryRepository.existsByName(categoryCreateDTO.name())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Category name already exists");
        }

        Category category = new Category();
        category.setName(categoryCreateDTO.name());
        category.setDescription(categoryCreateDTO.description());

        Category savedCategory = categoryRepository.save(category);
        return this.mapCategoryToCategoryResponseDTO(savedCategory);
    }

    @Override
    public CategoryResponseDTO updateCategory(Long id, CategoryUpdateDTO categoryUpdateDTO) {
        Category category = categoryRepository.findById(id).
                orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Category not found"));

        category.setName(categoryUpdateDTO.name());
        category.setDescription(categoryUpdateDTO.description());

        Category updatedCategory = categoryRepository.save(category);
        return this.mapCategoryToCategoryResponseDTO(updatedCategory);
    }

    @Override
    public CategoryResponseDTO getCategory(Long id) {
        Category category = categoryRepository.findById(id).
                orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Category not found"));

        return this.mapCategoryToCategoryResponseDTO(category);

    }

    @Override
    public void deleteCategory(Long id) {
        Category category = categoryRepository.findById(id).
                orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Category not found"));

        category.setDeleted(true);
        categoryRepository.save(category);
    }

    @Override
    public ArrayList<CategoryResponseDTO> getAllCategories() {
        List<Category> categories = categoryRepository.findAll()
                .stream()
                .filter(category -> !category.isDeleted())
                .toList();

        ArrayList<CategoryResponseDTO> categoriesDTO = new ArrayList<>();

        for(Category category : categories) {
            CategoryResponseDTO categoryResponseDTO = this.mapCategoryToCategoryResponseDTO(category);
            categoriesDTO.add(categoryResponseDTO);
        }

        return categoriesDTO;
    }

    private CategoryResponseDTO mapCategoryToCategoryResponseDTO(Category category) {
        return new CategoryResponseDTO(
                category.getCategoryId(),
                category.getName(),
                category.getDescription(),
                category.getCreatedAt(),
                category.getUpdatedAt(),
                category.isDeleted()
        );
    }


}
