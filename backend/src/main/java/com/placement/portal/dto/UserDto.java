package com.placement.portal.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserDto {
    private Long id;
    private String name;
    private String email;
    private String role;
    private String phone;
    private String college;
    private String department;
    private String year;
    private Double cgpa;
    private String location;
    private String about;
    private String resumeUrl;
    private String profilePhotoUrl;
}
