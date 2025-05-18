package com.projects.cartalogSystem.APIs.specifications;

import com.projects.cartalogSystem.entities.Car;
import com.projects.cartalogSystem.entities.enums.CarColor;
import com.projects.cartalogSystem.entities.enums.EngineType;
import com.projects.cartalogSystem.entities.enums.Transmission;
import jakarta.persistence.criteria.Join;
import org.springframework.data.jpa.domain.Specification;

import java.math.BigDecimal;
import java.util.List;

public class CarSpecifications {
    public static Specification<Car> isNotDeleted() {
        return((root, query, criteriaBuilder) ->
                criteriaBuilder.isFalse(root.get("deleted")));
    };

    public static Specification<Car> hasCategory(Long categoryId) {
        return((root, query, criteriaBuilder) ->
                criteriaBuilder.equal(root.get("category").get("categoryId"), categoryId));
    }

    public static Specification<Car> hasSupplier(Long supplierId) {
        return((root, query, criteriaBuilder) ->
                criteriaBuilder.equal(root.get("supplier").get("supplierId"), supplierId));
    }

    public static Specification<Car> hasEngineType(EngineType engineType) {
        return((root, query, criteriaBuilder) ->
                criteriaBuilder.equal(root.get("engineType"), engineType));
    }

    public static Specification<Car> hasTransmission(Transmission transmission) {
        return((root, query, criteriaBuilder) ->
                criteriaBuilder.equal(root.get("transmission"), transmission));
    }

    public static Specification<Car> mileageBetween(BigDecimal minMileage, BigDecimal maxMileage) {
        return((root, query, criteriaBuilder) ->
                criteriaBuilder.between(root.get("mileage"), minMileage, maxMileage));
    }

    public static Specification<Car> priceBetween(BigDecimal minPrice, BigDecimal maxPrice) {
        return((root, query, criteriaBuilder) ->
                criteriaBuilder.between(root.get("price"), minPrice, maxPrice));
    }

    public static Specification<Car> hasAnyColor(List<CarColor> colors) {
        return(root, query, criteriaBuilder) -> {
            Join<Object, Object> colorJoin = root.join("carColors");
            return colorJoin.in(colors);
        };
    }

    public static Specification<Car> nameOrDescriptionContains(String keyword) {
        return(root, query, criteriaBuilder) -> {
            String likePattern = "%" + keyword.toLowerCase() + "%";

            return criteriaBuilder.or(
                    criteriaBuilder.like(criteriaBuilder.lower(root.get("name")), likePattern),
                    criteriaBuilder.like(criteriaBuilder.lower(root.get("description")), likePattern)
            );
        };
    }
}
