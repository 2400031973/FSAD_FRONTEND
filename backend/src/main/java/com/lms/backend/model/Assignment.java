package com.lms.backend.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;

@Data
@Entity
@Table(name = "assignments")
public class Assignment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    
    @Column(columnDefinition = "TEXT")
    private String description;
    
    private LocalDate deadline;
    
    // E.g., max marks. Can be mapped or defaulted
    private Integer maxMarks = 100;

    private Long createdBy; // Reference to teacher's User ID
}
