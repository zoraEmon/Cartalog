package com.projects.cartalogSystem.entities.enums;

public enum Transmission {
    AUTOMATIC("Automatic"),
    MANUAL("Manual"),
    SEMI_AUTOMATIC("Semi-Automatic");

    private final String name;

    Transmission(String name) {
        this.name = name;
    }



    @Override
    public String toString() {
        return name;
    }
}
