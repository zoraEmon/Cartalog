package com.projects.cartalogSystem.DTOs.responseDTOs;

import com.projects.cartalogSystem.entities.enums.CarColor;
import com.projects.cartalogSystem.entities.enums.EngineType;
import com.projects.cartalogSystem.entities.enums.Transmission;

import java.math.BigDecimal;
import java.util.Date;

public record CarResponseDTO(
        Long id,
        String name,
        String description,
        Long supplierId,
        Long categoryId,
        BigDecimal price,
        CarColor color,
        Transmission transmission,
        EngineType engineType,
        BigDecimal mileage,
        String image,
        Date manufacturedDate,
        Date createdAt,
        Date updatedAt,
        boolean deleted
) {}