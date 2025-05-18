package com.projects.cartalogSystem.APIs;

import com.projects.cartalogSystem.entities.Car;
import com.projects.cartalogSystem.entities.Category;
import com.projects.cartalogSystem.entities.Supplier;
import com.projects.cartalogSystem.entities.enums.CarColor;
import com.projects.cartalogSystem.entities.enums.EngineType;
import com.projects.cartalogSystem.entities.enums.Transmission;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.Date;
import java.util.List;

@Repository
public interface CarRepository extends JpaRepository<Car, Long> {
    boolean existsByName(String carName);
    boolean existsByDescription(String carDescription);
    boolean existsByPrice(BigDecimal carPrice);
    boolean existsByMileage(BigDecimal carMileage);
    boolean existsByManufacturedDate(Date manufacturedDate);
    boolean existsBySupplier(Supplier supplier);
    boolean existsByImage(List<String> image);
    boolean existsByCarColors(List<CarColor> carColors);

    boolean existsByNameAndSupplierAndTransmissionAndEngineTypeAndCategory(
            String name,
            Supplier supplier,
            Transmission transmission,
            EngineType engineType,
            Category category
    );

    boolean existsByNameAndSupplierAndTransmissionAndEngineTypeAndCategoryAndCarIdNot(
            String name,
            Supplier supplier,
            Transmission transmission,
            EngineType engineType,
            Category category,
            Long carId
    );


    //Query for filtering cars.
    @Query("""
        SELECT c FROM Car c
            WHERE (:categoryId IS NULL OR c.category = :categoryId)
                AND (:transmission IS NULL OR c.transmission = :transmission)
                AND (:engineType IS NULL OR c.engineType = :engineType)
                AND (:minPrice IS NULL OR c.price >= :minPrice)
                AND (:maxPrice IS NULL OR c.price = :maxPrice)
                AND (:carColors IS NULL OR EXISTS(
                        SELECT 1 FROM c.carColors cc WHERE cc IN :carColors
                    ))
    """)
    List<Car> filterCars(
            @Param("categoryId") Long categoryId,
            @Param("transmission") Transmission transmission,
            @Param("engineType") EngineType engineType,
            @Param("minPrice") BigDecimal minPrice,
            @Param("maxPrice") BigDecimal maxPrice,
            @Param("carColors") List<CarColor> carColors
    );

    //Query for searching cars based on name and description.
    @Query("SELECT c FROM Car c WHERE LOWER(c.name) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(c.description) LIKE LOWER(CONCAT('%', :query, '%'))")
    List<Car> searchCars(@Param("query") String query);

    //This one provides pagination for all cars.
//    Page<Car> findByDeletedFalse(Specification specification, Pageable pageable);

    Page<Car> findAll(Specification<Car> specification, Pageable pageable);
}
