package com.projects.cartalogSystem.APIs;

import com.projects.cartalogSystem.entities.Supplier;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface SupplierRepository extends JpaRepository<Supplier, Long> {
    Optional<Supplier> findBySupplierId(Long supplierId);

    boolean existsByName(String name);
    @Query("SELECT c.deleted FROM Supplier c WHERE c.supplierId = :supplierId")
    boolean isDeleted(@Param("supplierId") Long supplierId);
}
