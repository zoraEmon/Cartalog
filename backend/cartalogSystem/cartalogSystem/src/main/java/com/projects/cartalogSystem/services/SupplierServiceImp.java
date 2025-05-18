package com.projects.cartalogSystem.services;

import com.projects.cartalogSystem.APIs.SupplierRepository;
import com.projects.cartalogSystem.DTOs.createDTOs.SupplierCreateDTO;
import com.projects.cartalogSystem.DTOs.responseDTOs.SupplierResponseDTO;
import com.projects.cartalogSystem.DTOs.updateDTOs.SupplierUpdateDTO;
import com.projects.cartalogSystem.entities.Supplier;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class SupplierServiceImp implements SupplierService {
    private final SupplierRepository supplierRepository;

    @Override
    public SupplierResponseDTO createSupplier(SupplierCreateDTO supplierCreateDTO) {
        if(supplierRepository.existsByName(supplierCreateDTO.name())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Supplier name already exists");
        }

        Supplier supplier = new Supplier();
        supplier.setName(supplierCreateDTO.name());
        supplier.setEmail(supplierCreateDTO.email());
        supplier.setAddress(supplierCreateDTO.address());
        supplier.setWebsite(supplierCreateDTO.website());
        supplier.setPhone(supplierCreateDTO.phone());

        Supplier savedSupplier = supplierRepository.save(supplier);

        return this.mapSupplierToSupplierResponseDTO(savedSupplier);
    }

    @Override
    public SupplierResponseDTO getSupplier(Long id) {
        Supplier supplier = supplierRepository.findById(id).
                orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Supplier not found"));

        return this.mapSupplierToSupplierResponseDTO(supplier);
    }

    @Override
    public ArrayList<SupplierResponseDTO> getAllSuppliers() {
        List<Supplier> suppliers = supplierRepository.findAll()
                .stream()
                .filter(supplier -> !supplier.isDeleted())
                .toList();

        ArrayList<SupplierResponseDTO> supplierResponseDTOs = new ArrayList<>();

        for (Supplier supplier : suppliers) {
            SupplierResponseDTO supplierResponseDTO = this.mapSupplierToSupplierResponseDTO(supplier);
            supplierResponseDTOs.add(supplierResponseDTO);
        }

        return supplierResponseDTOs;
    }

    @Override
    public void deleteSupplier(Long id) {
        Supplier supplier = supplierRepository.findById(id).
                orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Supplier not found"));

        supplier.setDeleted(true);
        supplierRepository.save(supplier);
    }

    @Override
    public SupplierResponseDTO updateSupplier(Long id, SupplierUpdateDTO supplierUpdateDTO) {
        Supplier supplier = supplierRepository.findById(id).
                orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Supplier not found"));

        supplier.setName(supplierUpdateDTO.name());
        supplier.setEmail(supplierUpdateDTO.email());
        supplier.setAddress(supplierUpdateDTO.address());
        supplier.setWebsite(supplierUpdateDTO.website());
        supplier.setPhone(supplierUpdateDTO.phone());

        Supplier savedSupplier = supplierRepository.save(supplier);
        return this.mapSupplierToSupplierResponseDTO(savedSupplier);
    }

    private SupplierResponseDTO mapSupplierToSupplierResponseDTO(Supplier supplier) {
        return new SupplierResponseDTO(
                supplier.getSupplierId(),
                supplier.getName(),
                supplier.getEmail(),
                supplier.getAddress(),
                supplier.getWebsite(),
                supplier.getPhone(),
                supplier.getCreatedAt(),
                supplier.getUpdatedAt(),
                supplier.isDeleted()
        );
    }
}
