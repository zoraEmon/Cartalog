package com.projects.cartalogSystem.DTOs.createDTOs;

import jakarta.validation.constraints.NotBlank;

public record CategoryCreateDTO(
        @NotBlank(message = "Name cannot be blank.")
        String name,
        String description
) {}
