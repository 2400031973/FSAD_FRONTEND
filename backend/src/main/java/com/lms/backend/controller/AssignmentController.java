package com.lms.backend.controller;

import com.lms.backend.model.Assignment;
import com.lms.backend.repository.AssignmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/assignments")
@CrossOrigin("http://localhost:3000")
public class AssignmentController {

    @Autowired
    private AssignmentRepository assignmentRepository;

    @PostMapping
    public ResponseEntity<Assignment> createAssignment(@RequestBody Assignment assignment) {
        Assignment saved = assignmentRepository.save(assignment);
        return ResponseEntity.ok(saved);
    }

    @GetMapping
    public ResponseEntity<List<Assignment>> getAllAssignments() {
        return ResponseEntity.ok(assignmentRepository.findAll());
    }
}
