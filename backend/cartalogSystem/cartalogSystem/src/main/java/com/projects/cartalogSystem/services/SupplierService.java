package com.projects.cartalogSystem.services;

import com.projects.cartalogSystem.DTOs.createDTOs.SupplierCreateDTO;
import com.projects.cartalogSystem.DTOs.responseDTOs.SupplierResponseDTO;
import com.projects.cartalogSystem.DTOs.updateDTOs.SupplierUpdateDTO;

import java.util.ArrayList;

public interface SupplierService {
    SupplierResponseDTO createSupplier(SupplierCreateDTO supplierCreateDTO);
    SupplierResponseDTO getSupplier(Long id);
    SupplierResponseDTO updateSupplier(Long id, SupplierUpdateDTO supplierUpdateDTO);
    void deleteSupplier(Long id);
    ArrayList<SupplierResponseDTO> getAllSuppliers();
}
