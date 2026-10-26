package com.placement.portal.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "student_profiles")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StudentProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    private String phone;
    private String college;
    private String department;
    private String year;
    private Double cgpa;
    private String location;

    @Column(columnDefinition = "TEXT")
    private String about;

    @Column(name = "resume_url")
    private String resumeUrl;

    @Column(name = "profile_photo_url")
    private String profilePhotoUrl;
}
