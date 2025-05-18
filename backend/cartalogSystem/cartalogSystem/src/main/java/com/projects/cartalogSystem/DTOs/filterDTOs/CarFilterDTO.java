package com.projects.cartalogSystem.DTOs.filterDTOs;

import com.projects.cartalogSystem.entities.enums.CarColor;
import com.projects.cartalogSystem.entities.enums.EngineType;
import com.projects.cartalogSystem.entities.enums.Transmission;

import java.math.BigDecimal;
import java.util.List;

public record CarFilterDTO(
        Long categoryId,
        Long supplierId,
        Transmission transmission,
        EngineType engineType,
        List<CarColor> carColors,
        BigDecimal minPrice,
        BigDecimal maxPrice,
        BigDecimal minMileage,
        BigDecimal maxMileage,
        String keyword
) {
}
