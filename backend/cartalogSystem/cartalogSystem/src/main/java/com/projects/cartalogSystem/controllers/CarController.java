package com.projects.cartalogSystem.controllers;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.projects.cartalogSystem.DTOs.createDTOs.CarCreateDTO;
import com.projects.cartalogSystem.DTOs.filterDTOs.CarFilterDTO;
import com.projects.cartalogSystem.DTOs.responseDTOs.CarResponseDTO;
import com.projects.cartalogSystem.DTOs.updateDTOs.CarUpdateDTO;
import com.projects.cartalogSystem.entities.enums.CarColor;
import com.projects.cartalogSystem.entities.enums.EngineType;
import com.projects.cartalogSystem.entities.enums.Transmission;
import com.projects.cartalogSystem.services.CarService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.util.List;

@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
@RequiredArgsConstructor
@RestController
@RequestMapping("/CarCatalog/admin/cars")
public class CarController {
    private final CarService carService;

    //This is for creating a car
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<CarResponseDTO> createCar(
            @RequestPart("car") @Valid String carJson,
            @RequestPart("images") MultipartFile[] images) {

        ObjectMapper objectMapper = new ObjectMapper();


        CarCreateDTO carCreateDTO;
        try{
             carCreateDTO = objectMapper.readValue(carJson, CarCreateDTO.class);
        }catch (Exception e){
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid JSON for car data");
        }

        CarResponseDTO carResponseDTO = carService.createCar(carCreateDTO, images);

        return ResponseEntity.ok(carResponseDTO);
    }

    //While this one is for getting a specific car based on ID
    @GetMapping("/{id}")
    public ResponseEntity<CarResponseDTO> getCar(@PathVariable Long id) {
        CarResponseDTO carResponseDTO = carService.getCarById(id);

        return ResponseEntity.ok(carResponseDTO);
    }

    //Gets all car collection
    @GetMapping("/collections")
    public ResponseEntity<List<CarResponseDTO>> getAllCars() {
        List<CarResponseDTO> carResponseDTOs = carService.getAllCars();

        return ResponseEntity.ok(carResponseDTOs);
    }

    //Updates a specific car
    @PutMapping("/{id}")
    public ResponseEntity<CarResponseDTO> updateCar(@PathVariable Long id,
        @Valid @RequestBody CarUpdateDTO carUpdateDTO) {
        CarResponseDTO carResponseDTO = carService.updateCar(id, carUpdateDTO);

        return ResponseEntity.ok(carResponseDTO);
    }

    //Deletes a car by id
    @DeleteMapping
    public ResponseEntity<Void> deleteCar(@PathVariable Long id) {
        carService.deleteCar(id);

        return ResponseEntity.noContent().build();
    }

    //Get all cars based on the filter.
    @GetMapping("/filter")
    public ResponseEntity<Page<CarResponseDTO>> filterCars(
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) Long supplierId,
            @RequestParam(required = false) Transmission transmission,
            @RequestParam(required = false) EngineType engineType,
            @RequestParam(required = false) List<CarColor> carColors,
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice,
            @RequestParam(required = false) BigDecimal minMileage,
            @RequestParam(required = false) BigDecimal maxMileage,
            @RequestParam(required = false, defaultValue = "") String keyword, Pageable pageable) {

        CarFilterDTO carFilterDTO = carService.mapCarFilterDTO(categoryId, supplierId, transmission, engineType,
        carColors, minPrice, maxPrice, minMileage, maxMileage, keyword);

        return ResponseEntity.ok(carService.filterCars(carFilterDTO, pageable));
    }

}
