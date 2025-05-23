package com.projects.cartalogSystem.DTOs.updateDTOs;

import jakarta.validation.constraints.NotBlank;

public record SupplierUpdateDTO(
        @NotBlank(message = "Name cannot be blanked.")
        String name,
        @NotBlank(message = "Email cannot be blanked.")
        String email,
        @NotBlank(message = "Address cannot be blanked.")
        String address,
        @NotBlank(message = "Website cannot be blanked.")
        String website,
        @NotBlank(message = "Phone cannot be blanked.")
        String phone
        ) {}
