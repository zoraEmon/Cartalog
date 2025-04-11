package com.projects.cartalogSystem.entities.enums;

import lombok.Getter;

public enum CarColor {
    RED("Red", "#fc0303"),
    GREEN("Green", "#03fc4e"),
    BLUE("Blue", "#0331fc"),
    YELLOW("Yellow", "#fcf403"),
    BLACK("Black", "#080808"),
    WHITE("White", "#ffffff");

    private final String name;
    @Getter
    private final String hexCode;

    CarColor(String name, String hexCode) {
        this.name = name;
        this.hexCode = hexCode;
    }

    @Override
    public String toString() {
        return name;
    }


}