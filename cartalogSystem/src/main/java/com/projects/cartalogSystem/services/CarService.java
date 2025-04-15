package com.projects.cartalogSystem.services;

import com.projects.cartalogSystem.DTOs.createDTOs.CarCreateDTO;
import com.projects.cartalogSystem.DTOs.responseDTOs.CarResponseDTO;
import com.projects.cartalogSystem.DTOs.updateDTOs.CarUpdateDTO;

public interface CarService {
    CarResponseDTO createCar(CarCreateDTO carCreateDTO);
    CarResponseDTO updateCar(Long carId,CarUpdateDTO carUpdateDTO);
    CarResponseDTO getCarById(Long carId);
    void deleteCar(Long carId);
}
