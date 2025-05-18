package com.projects.cartalogSystem.DTOs.responseDTOs;

import com.projects.cartalogSystem.entities.enums.CarColor;
import com.projects.cartalogSystem.entities.enums.EngineType;
import com.projects.cartalogSystem.entities.enums.Transmission;

import java.math.BigDecimal;
import java.util.Date;
import java.util.List;

public record CarResponseDTO(
        Long id,
        String name,
        String description,
        String supplierName,
        String categoryName,
        BigDecimal price,
        List<String> carColors,
        List<String> colorCode,
        String transmission,
        String transmissionDescription,
        String engineType,
        String engineDescription,
        BigDecimal mileage,
        List<String> imageUrls,
        Date manufacturedDate,
        Date createdAt,
        Date updatedAt,
        boolean deleted
) {}