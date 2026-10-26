package com.placement.portal.service;

import com.placement.portal.dto.ProfileDto;
import com.placement.portal.dto.SkillDto;
import com.placement.portal.entity.*;
import com.placement.portal.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class StudentService {

    private final UserRepository userRepository;
    private final StudentProfileRepository profileRepository;
    private final SkillRepository skillRepository;
    private final StudentSkillRepository studentSkillRepository;

    public StudentService(UserRepository userRepository,
                          StudentProfileRepository profileRepository,
                          SkillRepository skillRepository,
                          StudentSkillRepository studentSkillRepository) {
        this.userRepository = userRepository;
        this.profileRepository = profileRepository;
        this.skillRepository = skillRepository;
        this.studentSkillRepository = studentSkillRepository;
    }

    public ProfileDto getProfile(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        StudentProfile profile = profileRepository.findByUser(user)
                .orElseThrow(() -> new RuntimeException("Student profile not found"));

        return ProfileDto.builder()
                .name(user.getName())
                .email(user.getEmail())
                .phone(profile.getPhone())
                .college(profile.getCollege())
                .department(profile.getDepartment())
                .year(profile.getYear())
                .cgpa(profile.getCgpa())
                .location(profile.getLocation())
                .about(profile.getAbout())
                .resumeUrl(profile.getResumeUrl())
                .profilePhotoUrl(profile.getProfilePhotoUrl())
                .build();
    }

    @Transactional
    public ProfileDto updateProfile(String email, ProfileDto dto) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (dto.getName() != null) {
            user.setName(dto.getName());
            userRepository.save(user);
        }

        StudentProfile profile = profileRepository.findByUser(user).orElseGet(() -> {
            StudentProfile newProfile = new StudentProfile();
            newProfile.setUser(user);
            return newProfile;
        });

        if (dto.getPhone() != null) profile.setPhone(dto.getPhone());
        if (dto.getCollege() != null) profile.setCollege(dto.getCollege());
        if (dto.getDepartment() != null) profile.setDepartment(dto.getDepartment());
        if (dto.getYear() != null) profile.setYear(dto.getYear());
        if (dto.getCgpa() != null) profile.setCgpa(dto.getCgpa());
        if (dto.getLocation() != null) profile.setLocation(dto.getLocation());
        if (dto.getAbout() != null) profile.setAbout(dto.getAbout());
        if (dto.getResumeUrl() != null) profile.setResumeUrl(dto.getResumeUrl());
        if (dto.getProfilePhotoUrl() != null) profile.setProfilePhotoUrl(dto.getProfilePhotoUrl());

        profile = profileRepository.save(profile);

        return getProfile(email);
    }

    public List<SkillDto> getSkills(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        StudentProfile profile = profileRepository.findByUser(user)
                .orElseThrow(() -> new RuntimeException("Profile not found"));

        return studentSkillRepository.findByStudentProfile(profile).stream()
                .map(ss -> SkillDto.builder()
                        .id(ss.getId())
                        .name(ss.getSkill().getName())
                        .level(ss.getSkillLevel())
                        .build())
                .collect(Collectors.toList());
    }

    @Transactional
    public SkillDto addSkill(String email, SkillDto dto) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        StudentProfile profile = profileRepository.findByUser(user)
                .orElseThrow(() -> new RuntimeException("Profile not found"));

        Skill skill = skillRepository.findByNameIgnoreCase(dto.getName().trim())
                .orElseGet(() -> skillRepository.save(Skill.builder().name(dto.getName().trim()).build()));

        String level = dto.getLevel() != null ? dto.getLevel().toUpperCase() : "INTERMEDIATE";

        StudentSkill studentSkill = studentSkillRepository
                .findByStudentProfileIdAndSkillId(profile.getId(), skill.getId())
                .orElseGet(() -> StudentSkill.builder()
                        .studentProfile(profile)
                        .skill(skill)
                        .skillLevel(level)
                        .build());

        studentSkill.setSkillLevel(level);
        studentSkill = studentSkillRepository.save(studentSkill);

        return SkillDto.builder()
                .id(studentSkill.getId())
                .name(skill.getName())
                .level(studentSkill.getSkillLevel())
                .build();
    }

    @Transactional
    public void removeSkill(String email, Long skillId) {
        studentSkillRepository.deleteById(skillId);
    }
}
