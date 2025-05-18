package com.projects.cartalogSystem.services;

import com.projects.cartalogSystem.DTOs.createDTOs.CarCreateDTO;
import com.projects.cartalogSystem.DTOs.filterDTOs.CarFilterDTO;
import com.projects.cartalogSystem.DTOs.responseDTOs.CarResponseDTO;
import com.projects.cartalogSystem.DTOs.updateDTOs.CarUpdateDTO;
import com.projects.cartalogSystem.entities.enums.CarColor;
import com.projects.cartalogSystem.entities.enums.EngineType;
import com.projects.cartalogSystem.entities.enums.Transmission;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

public interface CarService {
    CarResponseDTO createCar(CarCreateDTO carCreateDTO, MultipartFile[] images);
    CarResponseDTO updateCar(Long carId,CarUpdateDTO carUpdateDTO);
    CarResponseDTO getCarById(Long carId);
    void deleteCar(Long carId);
    ArrayList<CarResponseDTO> getAllCars();
    Page<CarResponseDTO> filterCars(CarFilterDTO carFilterDTO, Pageable pageable);
    Page<CarResponseDTO> findAllCars(Pageable pageable);
    CarFilterDTO mapCarFilterDTO(Long categoryId, Long supplierId, Transmission transmission, EngineType engineType, List<CarColor> carColors, BigDecimal minPrice, BigDecimal maxPrice, BigDecimal minMileage, BigDecimal maxMileage, String keyword);
}
