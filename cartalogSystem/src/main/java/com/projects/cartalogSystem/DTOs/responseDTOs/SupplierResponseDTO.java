package com.projects.cartalogSystem.DTOs.responseDTOs;

import java.util.Date;

public record SupplierResponseDTO(
        Long id,
        String name,
        String email,
        String address,
        String website,
        String phone,
        Date createdAt,
        Date updatedAt,
        boolean deleted
) {}
