package com.azhen.blog.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "categories")
public class Category {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(name = "name", nullable = false, unique = true, length = 100)
    private String name;

    @Column(name = "order", nullable = false, length = 10)
    private String order = "0";

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
}
