package com.projects.cartalogSystem.entities.enums;

import lombok.Getter;
import org.apache.catalina.Engine;

//This is the enum class for car engine types.
public enum EngineType {
    PETROL("Petrol", "This refers to a common type of liquid fuel used in internal combustion engines. It is derived from crude oil through a refining process. Petrol engines ignite a mixture of petrol vapor and air using a spark plug, converting the chemical energy into mechanical power to propel a vehicle. Petrol is known for its relatively high energy density and widespread availability."),
    DIESEL("Diesel", "Another type of liquid fuel derived from crude oil, but with a different refining process than petrol. Diesel engines also use internal combustion but rely on compression ignition. Air is highly compressed in the cylinder, which heats it to a temperature high enough to ignite the injected diesel fuel. Diesel engines are often more fuel-efficient than petrol engines and are known for their higher torque output, making them suitable for larger vehicles and heavy-duty applications."),
    ELECTRIC("Electric", "This refers to vehicles powered by electric motors rather than internal combustion engines. These vehicles draw energy from rechargeable batteries, which are then used to drive the electric motor(s). Electric vehicles (EVs) produce zero tailpipe emissions, contributing to cleaner air. They offer instant torque, quiet operation, and can be charged at home or at public charging stations."),
    HYBRID("Hybrid", "This category encompasses vehicles that combine two or more sources of power, most commonly an internal combustion engine (either petrol or diesel) with one or more electric motors and a battery. The electric component can assist the engine, improve fuel efficiency, and sometimes allow for short periods of electric-only driving. Different types of hybrids exist, including mild hybrids, full hybrids, and plug-in hybrids (PHEVs), each with varying levels of electric driving capability.");

    @Getter
    private final String name;
    @Getter
    private final String description;

    EngineType(String name, String description) {
        this.name = name;
        this.description = description;
    }

    @Override
    public String toString() {
        return name;
    }
}