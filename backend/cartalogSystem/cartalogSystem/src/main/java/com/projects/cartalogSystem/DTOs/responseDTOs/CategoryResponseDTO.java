package com.projects.cartalogSystem.DTOs.responseDTOs;

import java.util.Date;

public record CategoryResponseDTO(
    Long id,
    String name,
    String description,
    Date createdAt,
    Date updatedAt,
    boolean deleted
) {}
