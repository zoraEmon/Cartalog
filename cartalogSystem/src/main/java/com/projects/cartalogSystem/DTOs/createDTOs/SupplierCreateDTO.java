package com.projects.cartalogSystem.DTOs.createDTOs;

public record SupplierCreateDTO(
        String name,
        String email,
        String address,
        String website,
        String phone
) {}