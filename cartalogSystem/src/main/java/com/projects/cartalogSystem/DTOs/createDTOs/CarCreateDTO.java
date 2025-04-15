package com.projects.cartalogSystem.DTOs.createDTOs;

import com.projects.cartalogSystem.entities.enums.CarColor;
import com.projects.cartalogSystem.entities.enums.EngineType;
import com.projects.cartalogSystem.entities.enums.Transmission;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;
import java.util.Date;

public record CarCreateDTO(
        @NotBlank(message = "Car name is required.")
        String name,
        String description,
        @NotNull(message = "You must supply the supplier's id")
        Long supplierId,
        @NotNull(message = "You must supply the supplier's id")
        Long categoryId,
        @NotNull(message = "Price cannot be empty")
        BigDecimal price,
        @NotNull(message = "You must provide the color of the car")
        CarColor carColor,
        @NotNull(message = "You must provide the transmission of the car")
        Transmission carTransmission,
        @NotNull(message = "You must provide the engine type of the car")
        EngineType engineType,
        BigDecimal mileage,
        String imageUrl,
        @NotNull(message = "You must provide manufactured date for the car.")
        Date manufacturedDate
) {

}
