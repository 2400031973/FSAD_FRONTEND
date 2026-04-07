package com.lms.backend.controller;

import com.lms.backend.model.Assignment;
import com.lms.backend.model.Submission;
import com.lms.backend.model.User;
import com.lms.backend.repository.AssignmentRepository;
import com.lms.backend.repository.SubmissionRepository;
import com.lms.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/submissions")
public class SubmissionController {

    @Autowired
    private SubmissionRepository submissionRepository;

    @Autowired
    private AssignmentRepository assignmentRepository;

    @Autowired
    private UserRepository userRepository;

    @PostMapping
    public ResponseEntity<Submission> submitAssignment(@RequestBody Submission submission) {
        submission.setSubmittedDate(LocalDate.now());
        submission.setStatus("Pending");
        return ResponseEntity.ok(submissionRepository.save(submission));
    }

    @GetMapping("/student/{studentId}")
    public ResponseEntity<List<Submission>> getSubmissionsByStudent(@PathVariable Long studentId) {
        if (studentId == null || studentId <= 0) {
            return ResponseEntity.badRequest().body(List.of());
        }
        List<Submission> submissions = submissionRepository.findByStudentId(studentId);
        // Enrich with assignment titles
        for (Submission sub : submissions) {
            if (sub.getAssignmentId() != null) {
                assignmentRepository.findById(sub.getAssignmentId()).ifPresent(a -> {
                    sub.setAssignmentTitle(a.getTitle());
                    sub.setMaxMarks(a.getMaxMarks());
                });
            }
        }
        return ResponseEntity.ok(submissions);
    }

    @GetMapping("/assignment/{assignmentId}")
    public ResponseEntity<List<Submission>> getSubmissionsByAssignment(@PathVariable Long assignmentId) {
        if (assignmentId == null || assignmentId <= 0) {
            return ResponseEntity.badRequest().body(List.of());
        }
        List<Submission> submissions = submissionRepository.findByAssignmentId(assignmentId);
        // Enrich with student names
        for (Submission sub : submissions) {
            if (sub.getStudentId() != null && sub.getAssignmentId() != null) {
                userRepository.findById(sub.getStudentId()).ifPresent(u -> {
                    sub.setStudentName(u.getName());
                });
            }
        }
        return ResponseEntity.ok(submissions);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateSubmission(@PathVariable Long id, @RequestBody Submission updatedReq) {
        Optional<Submission> opt = submissionRepository.findById(id);
        if (opt.isEmpty()) return ResponseEntity.notFound().build();

        Submission submission = opt.get();
        // Students can only edit if it is not Graded yet
        if ("Graded".equalsIgnoreCase(submission.getStatus())) {
            return ResponseEntity.badRequest().body("Cannot edit a graded submission");
        }

        if (updatedReq.getFileUrl() != null) {
            submission.setFileUrl(updatedReq.getFileUrl());
        }
        if (updatedReq.getFeedback() != null) {
            submission.setFeedback(updatedReq.getFeedback());
        }
        
        // update submission date
        submission.setSubmittedDate(LocalDate.now());

        return ResponseEntity.ok(submissionRepository.save(submission));
    }

    @PutMapping("/{id}/grade")
    public ResponseEntity<?> gradeSubmission(@PathVariable Long id, @RequestBody Map<String, Object> payload) {
        Optional<Submission> opt = submissionRepository.findById(id);
        if (opt.isEmpty())
            return ResponseEntity.notFound().build();

        Submission submission = opt.get();
        if (payload.containsKey("marks")) {
            submission.setMarks(Integer.parseInt(payload.get("marks").toString()));
        }
        if (payload.containsKey("feedback")) {
            submission.setTeacherFeedback(payload.get("feedback").toString());
        }
        submission.setStatus("Graded");
        return ResponseEntity.ok(submissionRepository.save(submission));
    }
}
