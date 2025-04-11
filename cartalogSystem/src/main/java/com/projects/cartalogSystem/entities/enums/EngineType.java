package com.projects.cartalogSystem.entities.enums;

public enum EngineType {
    PETROL("Petrol"),
    DIESEL("Diesel"),
    ELECTRIC("Electric"),
    HYBRID("Hybrid");

    private final String name;

    EngineType(String name) {
        this.name = name;
    }

    @Override
    public String toString() {
        return name;
    }
}