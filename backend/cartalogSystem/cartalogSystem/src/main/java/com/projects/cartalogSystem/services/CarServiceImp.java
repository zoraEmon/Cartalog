package com.projects.cartalogSystem.services;

import com.projects.cartalogSystem.APIs.CarRepository;
import com.projects.cartalogSystem.APIs.CategoryRepository;
import com.projects.cartalogSystem.APIs.SupplierRepository;
import com.projects.cartalogSystem.APIs.specifications.CarSpecifications;
import com.projects.cartalogSystem.DTOs.createDTOs.CarCreateDTO;
import com.projects.cartalogSystem.DTOs.filterDTOs.CarFilterDTO;
import com.projects.cartalogSystem.DTOs.responseDTOs.CarResponseDTO;
import com.projects.cartalogSystem.DTOs.updateDTOs.CarUpdateDTO;
import com.projects.cartalogSystem.entities.Car;
import com.projects.cartalogSystem.entities.Category;
import com.projects.cartalogSystem.entities.Supplier;
import com.projects.cartalogSystem.entities.enums.CarColor;
import com.projects.cartalogSystem.entities.enums.EngineType;
import com.projects.cartalogSystem.entities.enums.Transmission;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.io.File;
import java.io.IOException;
import java.math.BigDecimal;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class CarServiceImp implements CarService {
    private final CarRepository carRepository;
    private final CategoryRepository categoryRepository;
    private final SupplierRepository supplierRepository;

    @Override
    public CarResponseDTO createCar(CarCreateDTO carCreateDTO, MultipartFile[] images) {
        Category category = categoryRepository.findByCategoryId(carCreateDTO.categoryId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Category not found"));

        Supplier supplier = supplierRepository.findBySupplierId(carCreateDTO.supplierId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Supplier not found"));

        if(carRepository.existsByNameAndSupplierAndTransmissionAndEngineTypeAndCategory(
                carCreateDTO.name(),
                supplier,
                carCreateDTO.carTransmission(),
                carCreateDTO.engineType(),
                category
        )) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Car already exists!");
        }

        List<String> imageUrls = this.saveImages(images);

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
        newCar.setImage(imageUrls);
        newCar.setCarColors(carCreateDTO.carColors());

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
        if(carRepository.existsByNameAndSupplierAndTransmissionAndEngineTypeAndCategoryAndCarIdNot(
                carUpdateDTO.name(),
                supplier,
                carUpdateDTO.carTransmission(),
                carUpdateDTO.engineType(),
                category,
                id
        )){
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Car already exists!");
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
        car.setImage(carUpdateDTO.imageUrls());
        car.setCarColors(carUpdateDTO.carColors());

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
    public ArrayList<CarResponseDTO> getAllCars() {
            System.out.println(System.getProperty("user.dir"));

        List<Car> cars = carRepository.findAll()
                .stream()
                .filter(car -> !car.isDeleted())
                .toList();

        ArrayList<CarResponseDTO> carResponseDTOS = new ArrayList<>();

        for (Car car : cars) {
            carResponseDTOS.add(this.mapCarToCarResponseDTO(car));
        }

        return carResponseDTOS;
    }

    @Override
    public Page<CarResponseDTO> findAllCars(Pageable pageable) {
        Specification<Car> specification = Specification.where(CarSpecifications.isNotDeleted());

        return carRepository.findAll(specification, pageable)
                .map(this::mapCarToCarResponseDTO);
    }


    @Override
    public void deleteCar(Long id) {
        Car car = carRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Car not found"));

        car.setDeleted(true);
        carRepository.save(car);
    }

    @Override
    public Page<CarResponseDTO> filterCars(CarFilterDTO carFilterDTO, Pageable pageable) {
        Specification<Car> specification = Specification.where(CarSpecifications.isNotDeleted());

        if(carFilterDTO.categoryId() != null){
            specification = specification.and(CarSpecifications.hasCategory(carFilterDTO.categoryId()));
        }

        if(carFilterDTO.supplierId() != null){
            specification = specification.and(CarSpecifications.hasSupplier(carFilterDTO.supplierId()));
        }

        if(carFilterDTO.transmission() != null){
            specification = specification.and(CarSpecifications.hasTransmission(carFilterDTO.transmission()));
        }

        if(carFilterDTO.engineType() != null){
            specification = specification.and(CarSpecifications.hasEngineType(carFilterDTO.engineType()));
        }

        if(carFilterDTO.minPrice() != null && carFilterDTO.maxPrice() != null){
            specification = specification.and(CarSpecifications.priceBetween(carFilterDTO.minPrice(), carFilterDTO.maxPrice()));
        }

        if(carFilterDTO.carColors() != null && !carFilterDTO.carColors().isEmpty()){
            specification = specification.and(CarSpecifications.hasAnyColor(carFilterDTO.carColors()));
        }

        if(!(carFilterDTO.keyword().isEmpty() && carFilterDTO.keyword().isEmpty())){
            specification = specification.and(CarSpecifications.nameOrDescriptionContains(carFilterDTO.keyword()));
        }

        return carRepository.findAll(specification, pageable)
                .map(this::mapCarToCarResponseDTO);

    }

    private CarResponseDTO mapCarToCarResponseDTO(Car car) {
        String supplierName = car.getSupplier().getName();
        String categoryName = car.getCategory().getName();

        List<CarColor> rawCarColors = car.getCarColors();
        List<String> carColors = new ArrayList<>();
        List<String> colorCodes = new ArrayList<>();

        String engineType = car.getEngineType().toString();
        String engineTypeDescription = car.getEngineType().getDescription();
        String transmission = car.getTransmission().toString();
        String transmissionDescription = car.getTransmission().getDescription();


        rawCarColors.forEach(carColor -> {
            carColors.add(carColor.getName());
        });

        rawCarColors.forEach(carColor -> {
            colorCodes.add(carColor.getHexCode());
        });

        if(car.getSupplier().isDeleted()){
            supplierName = "None";
        }

        if(car.getCategory().isDeleted()){
            categoryName = "None";
        }

        return new CarResponseDTO(
          car.getCarId(),
          car.getName(),
          car.getDescription(),
          supplierName,
          categoryName,
          car.getPrice(),
          carColors,
          colorCodes,
          transmission,
          transmissionDescription,
          engineType,
          engineTypeDescription,
          car.getMileage(),
          car.getImage(),
          car.getManufacturedDate(),
          car.getCreatedAt(),
          car.getUpdatedAt(),
          car.isDeleted()
        );
    }
//    Save images in the folder so frontend(NextJS) can access them.
    private List<String> saveImages(MultipartFile[] images) {
        List<String> imageUrls = new ArrayList<>();
        String folderDir = System.getProperty("user.dir") + "/cartalogSystem" +"/uploads";

        File uploadFolder = new File(folderDir);
        if(!uploadFolder.exists()){
            uploadFolder.mkdirs();
        }

        for(MultipartFile image : images){
           if(!image.isEmpty()){
               try{
                   String fileName = UUID.randomUUID().toString() + "_" + image.getOriginalFilename();
                   Path filePath = Paths.get(folderDir, fileName);
                   Files.copy(image.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
                   imageUrls.add("http://localhost:8082/CarCatalog/images/" + fileName);
               }catch(IOException e){
                   throw new RuntimeException("Failed to save image " + image.getOriginalFilename(), e);
               }
           }
        }

        return imageUrls;
    }


    public CarFilterDTO mapCarFilterDTO(Long categoryId, Long supplierId, Transmission transmission,
                                        EngineType engineType, List<CarColor> carColors, BigDecimal minPrice,
                                        BigDecimal maxPrice, BigDecimal minMileage, BigDecimal maxMileage, String keyword ) {

        return new CarFilterDTO(
                categoryId,
                supplierId,
                transmission,
                engineType,
                carColors,
                minPrice,
                maxPrice,
                minMileage,
                maxMileage,
                keyword
        );
    }
}
