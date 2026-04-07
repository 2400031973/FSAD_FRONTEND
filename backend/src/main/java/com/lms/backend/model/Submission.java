package com.lms.backend.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;

@Data
@Entity
@Table(name = "submissions")
public class Submission {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long assignmentId;
    private Long studentId;
    
    private String fileUrl;
    private String feedback; // student comments

    private LocalDate submittedDate;

    // Grading fields
    private Integer marks;
    private String teacherFeedback;
    private String status = "Pending"; // 'Pending' or 'Graded'

    // Used for transient frontend usage
    @Transient
    private String studentName;
    @Transient
    private String assignmentTitle;
    @Transient
    private Integer maxMarks;
}
