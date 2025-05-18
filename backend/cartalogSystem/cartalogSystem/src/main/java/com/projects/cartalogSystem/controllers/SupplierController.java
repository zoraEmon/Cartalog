package com.projects.cartalogSystem.controllers;


import com.projects.cartalogSystem.APIs.SupplierRepository;
import com.projects.cartalogSystem.DTOs.createDTOs.SupplierCreateDTO;
import com.projects.cartalogSystem.DTOs.responseDTOs.SupplierResponseDTO;
import com.projects.cartalogSystem.DTOs.updateDTOs.SupplierUpdateDTO;
import com.projects.cartalogSystem.services.SupplierService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequiredArgsConstructor
@RestController
@RequestMapping("/CarCatalog/admin/suppliers")
public class SupplierController {
    final SupplierService supplierService;

    @PostMapping
    public ResponseEntity<SupplierResponseDTO> createSupplier(@Valid @RequestBody SupplierCreateDTO supplierCreateDTO) {
        SupplierResponseDTO supplierResponseDTO = supplierService.createSupplier(supplierCreateDTO);

        return ResponseEntity.ok(supplierResponseDTO);
    }

    @GetMapping("/{id}")
    public ResponseEntity<SupplierResponseDTO> getSupplier(@PathVariable Long id) {
        SupplierResponseDTO supplierResponseDTO = supplierService.getSupplier(id);

        return ResponseEntity.ok(supplierResponseDTO);
    }

    @GetMapping("/collections")
    public ResponseEntity<List<SupplierResponseDTO>> getAllSuppliers() {
        List<SupplierResponseDTO> supplierResponseDTOs = supplierService.getAllSuppliers();

        return ResponseEntity.ok(supplierResponseDTOs);
    }

    @PutMapping("/{id}")
    public ResponseEntity<SupplierResponseDTO> updateSupplier(@PathVariable Long id,
        @Valid @RequestBody SupplierUpdateDTO supplierUpdateDTO) {

        SupplierResponseDTO supplierResponseDTO = supplierService.updateSupplier(id, supplierUpdateDTO);

        return ResponseEntity.ok(supplierResponseDTO);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSupplier(@PathVariable Long id) {
        supplierService.deleteSupplier(id);

        return ResponseEntity.noContent().build();
    }

}
