package com.placement.portal.dto;

import lombok.*;
import java.time.LocalDate;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class JobDto {
    private Long id;
    private String title;
    private String company;
    private String companyLogo;
    private String description;
    private List<String> responsibilities;
    private List<String> qualifications;
    private String location;
    private String jobType;
    private String salary;
    private String eligibility;
    private Double minCgpa;
    private String deadline;
    private String postedDate;
    private List<String> skills;
    private Integer applicantCount;
}
