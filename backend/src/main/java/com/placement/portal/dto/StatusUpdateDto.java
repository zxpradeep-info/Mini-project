package com.placement.portal.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class StatusUpdateDto {
    @NotBlank(message = "Status is required")
    private String status; // APPLIED, UNDER_REVIEW, SHORTLISTED, INTERVIEW_SCHEDULED, SELECTED, REJECTED
    private String note;
}
