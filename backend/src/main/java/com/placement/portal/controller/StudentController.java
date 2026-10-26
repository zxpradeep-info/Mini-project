package com.placement.portal.controller;

import com.placement.portal.dto.ProfileDto;
import com.placement.portal.dto.SkillDto;
import com.placement.portal.service.StudentService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/students")
public class StudentController {

    private final StudentService studentService;

    public StudentController(StudentService studentService) {
        this.studentService = studentService;
    }

    @GetMapping("/profile")
    public ResponseEntity<ProfileDto> getProfile(@AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(studentService.getProfile(userDetails.getUsername()));
    }

    @PutMapping("/profile")
    public ResponseEntity<ProfileDto> updateProfile(@AuthenticationPrincipal UserDetails userDetails,
                                                    @RequestBody ProfileDto profileDto) {
        return ResponseEntity.ok(studentService.updateProfile(userDetails.getUsername(), profileDto));
    }

    @GetMapping("/skills")
    public ResponseEntity<List<SkillDto>> getSkills(@AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(studentService.getSkills(userDetails.getUsername()));
    }

    @PostMapping("/skills")
    public ResponseEntity<SkillDto> addSkill(@AuthenticationPrincipal UserDetails userDetails,
                                             @RequestBody SkillDto skillDto) {
        return ResponseEntity.ok(studentService.addSkill(userDetails.getUsername(), skillDto));
    }

    @DeleteMapping("/skills/{id}")
    public ResponseEntity<Void> removeSkill(@AuthenticationPrincipal UserDetails userDetails,
                                            @PathVariable Long id) {
        studentService.removeSkill(userDetails.getUsername(), id);
        return ResponseEntity.noContent().build();
    }
}
