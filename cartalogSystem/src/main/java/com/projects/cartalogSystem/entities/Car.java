package com.projects.cartalogSystem.entities;

import com.projects.cartalogSystem.entities.enums.CarColor;
import com.projects.cartalogSystem.entities.enums.EngineType;
import com.projects.cartalogSystem.entities.enums.Transmission;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.util.Date;

@Data
@Entity
@NoArgsConstructor
@AllArgsConstructor
public class Car {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long carId;

    private String description;

    @Column(nullable = false)
    private String name;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "supplier_id", nullable = false)
    private Supplier supplier;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id", nullable = false)
    private Category category;

    @Column(nullable = false)
    private BigDecimal price;

    @Enumerated(EnumType.STRING) @Column(nullable = false)
    private CarColor color;

    @Enumerated(EnumType.STRING) @Column(nullable = false)
    private Transmission transmission;

    @Enumerated(EnumType.STRING) @Column(nullable = false)
    private EngineType engineType;

    private BigDecimal mileage;

    private String image;

    @Temporal(TemporalType.DATE)
    private Date manufacturedDate;

    @CreationTimestamp
    @Temporal(TemporalType.TIMESTAMP)
    @Column(updatable = false)
    private Date createdAt;

    @UpdateTimestamp
    @Temporal(TemporalType.TIMESTAMP)
    private Date updatedAt;

    @Column(nullable = false)
    private boolean deleted = false;
}
