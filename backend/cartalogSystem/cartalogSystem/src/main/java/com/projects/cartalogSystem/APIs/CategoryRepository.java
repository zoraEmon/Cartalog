package com.projects.cartalogSystem.APIs;

import com.projects.cartalogSystem.entities.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {
    Optional<Category> findByCategoryId(Long categoryId);

    boolean existsByName(String name);
    boolean existsByCategoryId(Long categoryId);
    @Query("SELECT c.deleted FROM Category c WHERE c.categoryId = :categoryId")
    boolean isDeleted(@Param("categoryId") Long categoryId);
}
