package com.projects.cartalogSystem.APIs;

import com.projects.cartalogSystem.entities.Car;
import com.projects.cartalogSystem.entities.Category;
import com.projects.cartalogSystem.entities.Supplier;
import com.projects.cartalogSystem.entities.enums.CarColor;
import com.projects.cartalogSystem.entities.enums.EngineType;
import com.projects.cartalogSystem.entities.enums.Transmission;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.Date;
import java.util.Optional;

@Repository
public interface CarRepository extends JpaRepository<Car, Long> {
    boolean existsByName(String carName);
    boolean existsByDescription(String carDescription);
    boolean existsByPrice(BigDecimal carPrice);
    boolean existsByMileage(BigDecimal carMileage);
    boolean existsByManufacturedDate(Date manufacturedDate);
    boolean existsBySupplier(Supplier supplier);
    boolean existsByImage(String imageUrl);
    boolean existsByColor(CarColor carColor);

    boolean existsByNameAndColorAndSupplierAndTransmissionAndEngineTypeAndCategory(
            String name,
            CarColor color,
            Supplier supplier,
            Transmission transmission,
            EngineType engineType,
            Category category
    );

    boolean existsByNameAndColorAndSupplierAndTransmissionAndEngineTypeAndCategoryAndCarIdNot(
            String name,
            CarColor color,
            Supplier supplier,
            Transmission transmission,
            EngineType engineType,
            Category category,
            Long carId
    );
}
