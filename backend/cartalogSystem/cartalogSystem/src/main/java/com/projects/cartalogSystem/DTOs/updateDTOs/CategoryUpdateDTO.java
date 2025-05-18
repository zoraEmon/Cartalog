package com.projects.cartalogSystem.DTOs.updateDTOs;

import jakarta.validation.constraints.NotBlank;

public record CategoryUpdateDTO(
        @NotBlank(message = "Name cannot be empty")
        String name,
        String description
) {}
