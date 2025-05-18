package com.projects.cartalogSystem.entities.enums;


import lombok.Getter;

//This is for the transmissions.
public enum Transmission {
    AUTOMATIC("Automatic", "A transmission that shifts gears automatically without requiring driver input."),
    MANUAL("Manual", "A transmission where the driver must manually change gears using a clutch and gear lever."),
    SEMI_AUTOMATIC("Semi-Automatic", "A transmission that allows the driver to manually select gears but without a clutch pedal; gear changes are often electronically assisted.");

    @Getter
    private final String name;
    @Getter
    private final String description;


    Transmission(String name, String description) {

        this.name = name;
        this.description = description;
    }

    @Override
    public String toString() {
        return name;
    }
}
