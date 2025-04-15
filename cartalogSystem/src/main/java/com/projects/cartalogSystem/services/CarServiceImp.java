package com.projects.cartalogSystem.services;

import com.projects.cartalogSystem.APIs.CarRepository;
import com.projects.cartalogSystem.APIs.CategoryRepository;
import com.projects.cartalogSystem.APIs.SupplierRepository;
import com.projects.cartalogSystem.DTOs.createDTOs.CarCreateDTO;
import com.projects.cartalogSystem.DTOs.responseDTOs.CarResponseDTO;
import com.projects.cartalogSystem.DTOs.updateDTOs.CarUpdateDTO;
import com.projects.cartalogSystem.entities.Car;
import com.projects.cartalogSystem.entities.Category;
import com.projects.cartalogSystem.entities.Supplier;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
@RequiredArgsConstructor
public class CarServiceImp implements CarService {
    private final CarRepository carRepository;
    private final CategoryRepository categoryRepository;
    private final SupplierRepository supplierRepository;
    private final CategoryServiceImp categoryService;
    private final SupplierServiceImp supplierService;

    @Override
    public CarResponseDTO createCar(CarCreateDTO carCreateDTO) {
        Category category = categoryRepository.findByCategoryId(carCreateDTO.supplierId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Category not found"));

        Supplier supplier = supplierRepository.findBySupplierId(carCreateDTO.supplierId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Supplier not found"));

        if(carRepository.existsByNameAndColorAndSupplierAndTransmissionAndEngineTypeAndCategory(
                carCreateDTO.name(),
                carCreateDTO.carColor(),
                supplier,
                carCreateDTO.carTransmission(),
                carCreateDTO.engineType(),
                category
        )) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Car already exists!");
        }

        Car newCar = new Car();
        newCar.setName(carCreateDTO.name());
        newCar.setDescription(carCreateDTO.description());
        newCar.setSupplier(supplier);
        newCar.setTransmission(carCreateDTO.carTransmission());
        newCar.setEngineType(carCreateDTO.engineType());
        newCar.setCategory(category);
        newCar.setPrice(carCreateDTO.price());
        newCar.setMileage(carCreateDTO.mileage());
        newCar.setManufacturedDate(carCreateDTO.manufacturedDate());
        newCar.setImage(carCreateDTO.imageUrl());
        newCar.setColor(carCreateDTO.carColor());

        Car savedCar = carRepository.save(newCar);

        return this.mapCarToCarResponseDTO(savedCar);
    }

    @Override
    public CarResponseDTO updateCar(Long id, CarUpdateDTO carUpdateDTO) {
        Car car = carRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Car not found"));

        Supplier supplier = supplierRepository.findBySupplierId(carUpdateDTO.supplierId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Supplier not found"));

        Category category = categoryRepository.findByCategoryId(carUpdateDTO.categoryId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Category not found"));

        // This checks whether the given updated details are same of the car being edited or the same specifications already exist.
        if(carRepository.existsByNameAndColorAndSupplierAndTransmissionAndEngineTypeAndCategoryAndCarIdNot(
                carUpdateDTO.name(),
                carUpdateDTO.carColor(),
                supplier,
                carUpdateDTO.carTransmission(),
                carUpdateDTO.engineType(),
                category,
                id
        )) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "A car with the same configuration already exists!   ");
        }

        car.setName(carUpdateDTO.name());
        car.setDescription(carUpdateDTO.description());
        car.setSupplier(supplier);
        car.setTransmission(carUpdateDTO.carTransmission());
        car.setEngineType(carUpdateDTO.engineType());
        car.setCategory(category);
        car.setPrice(carUpdateDTO.price());
        car.setMileage(carUpdateDTO.mileage());
        car.setManufacturedDate(carUpdateDTO.manufacturedDate());
        car.setImage(carUpdateDTO.imageUrl());
        car.setColor(carUpdateDTO.carColor());

        Car savedCar = carRepository.save(car);
        return this.mapCarToCarResponseDTO(savedCar);
    }

    @Override
    public CarResponseDTO getCarById(Long id) {
        Car car = carRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Car not found"));

        return this.mapCarToCarResponseDTO(car);
    }

    @Override
    public void deleteCar(Long id) {
        Car car = carRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Car not found"));

        car.setDeleted(true);
        carRepository.save(car);
    }


    private CarResponseDTO mapCarToCarResponseDTO(Car car) {
        return new CarResponseDTO(
          car.getCarId(),
          car.getName(),
          car.getDescription(),
          car.getSupplier().getSupplierId(),
          car.getCategory().getCategoryId(),
          car.getPrice(),
          car.getColor(),
          car.getTransmission(),
          car.getEngineType(),
          car.getMileage(),
          car.getImage(),
          car.getManufacturedDate(),
          car.getCreatedAt(),
          car.getUpdatedAt(),
          car.isDeleted()
        );
    }
}
