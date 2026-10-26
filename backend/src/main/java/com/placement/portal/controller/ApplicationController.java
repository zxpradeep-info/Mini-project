package com.placement.portal.controller;

import com.placement.portal.dto.ApplicationDto;
import com.placement.portal.dto.StatusUpdateDto;
import com.placement.portal.service.ApplicationService;
import lombok.Data;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/applications")
public class ApplicationController {

    private final ApplicationService applicationService;

    public ApplicationController(ApplicationService applicationService) {
        this.applicationService = applicationService;
    }

    @Data
    public static class ApplyRequest {
        private Long jobId;
        private String coverLetter;
        private String resumeUrl;
    }

    @PostMapping
    public ResponseEntity<ApplicationDto> apply(@AuthenticationPrincipal UserDetails userDetails,
                                                @RequestBody ApplyRequest request) {
        ApplicationDto dto = applicationService.apply(
                userDetails.getUsername(),
                request.getJobId(),
                request.getCoverLetter(),
                request.getResumeUrl()
        );
        return ResponseEntity.ok(dto);
    }

    @GetMapping("/my")
    public ResponseEntity<List<ApplicationDto>> getMyApplications(@AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(applicationService.getMyApplications(userDetails.getUsername()));
    }

    @GetMapping("/job/{jobId}")
    public ResponseEntity<List<ApplicationDto>> getJobApplications(@PathVariable Long jobId) {
        return ResponseEntity.ok(applicationService.getJobApplications(jobId));
    }

    @GetMapping
    public ResponseEntity<List<ApplicationDto>> getAllApplications() {
        return ResponseEntity.ok(applicationService.getAllApplications());
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<ApplicationDto> updateStatus(@PathVariable Long id,
                                                       @RequestBody StatusUpdateDto statusUpdateDto) {
        return ResponseEntity.ok(applicationService.updateStatus(id, statusUpdateDto));
    }
}
