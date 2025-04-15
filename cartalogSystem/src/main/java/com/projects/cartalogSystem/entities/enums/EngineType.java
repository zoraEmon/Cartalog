package com.projects.cartalogSystem.entities.enums;

//This is the enum class for car engine types.
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