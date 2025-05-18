package com.projects.cartalogSystem.controllers;

import com.projects.cartalogSystem.APIs.CategoryRepository;
import com.projects.cartalogSystem.DTOs.createDTOs.CategoryCreateDTO;
import com.projects.cartalogSystem.DTOs.responseDTOs.CategoryResponseDTO;
import com.projects.cartalogSystem.DTOs.updateDTOs.CategoryUpdateDTO;
import com.projects.cartalogSystem.services.CategoryService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequiredArgsConstructor
@RestController
@RequestMapping("/CarCatalog/admin/categories")
public class CategoryController {
    private final CategoryService categoryService;

    @PostMapping
    public ResponseEntity<CategoryResponseDTO> createCategory(@Valid @RequestBody CategoryCreateDTO categoryCreateDTO) {
        CategoryResponseDTO categoryResponseDTO = categoryService.createCategory(categoryCreateDTO);

        return ResponseEntity.ok(categoryResponseDTO);
    }

    @GetMapping("/{id}")
    public ResponseEntity<CategoryResponseDTO> getCategoryById(@PathVariable Long id) {
        CategoryResponseDTO categoryResponseDTO = categoryService.getCategory(id);

        return ResponseEntity.ok(categoryResponseDTO);
    }

    @GetMapping("/collections")
    public ResponseEntity<List<CategoryResponseDTO>> getAllCategories() {
        List<CategoryResponseDTO> categoryResponseDTOList = categoryService.getAllCategories();

        return ResponseEntity.ok(categoryResponseDTOList);
    }

    @PutMapping("/{id}")
    public ResponseEntity<CategoryResponseDTO> updateCategory(@PathVariable Long id,
        @Valid @RequestBody CategoryUpdateDTO categoryUpdateDTO) {
        CategoryResponseDTO categoryResponseDTO = categoryService.updateCategory(id, categoryUpdateDTO);

        return ResponseEntity.ok(categoryResponseDTO);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCategory(@PathVariable Long id) {
        categoryService.deleteCategory(id);

        return ResponseEntity.noContent().build();
    }
}
