package com.projects.cartalogSystem.APIs;

import com.projects.cartalogSystem.entities.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {
    Optional<Category> findByCategoryId(Long categoryId);

    boolean existsByName(String name);
    boolean existsByCategoryId(Long categoryId);
}
