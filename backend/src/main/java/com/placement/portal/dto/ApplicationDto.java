package com.placement.portal.dto;

import lombok.*;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ApplicationDto {
    private Long id;
    private Long studentId;
    private String studentName;
    private String email;
    private String phone;
    private String college;
    private String department;
    private Double cgpa;
    private Long jobId;
    private String jobTitle;
    private String company;
    private String location;
    private String salary;
    private String jobType;
    private String status;
    private String note;
    private String resumeUrl;
    private String coverLetter;
    private String appliedAt;
    private String updatedAt;
    private List<String> skills;
}
