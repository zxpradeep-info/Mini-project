package com.placement.portal.service;

import com.placement.portal.dto.ApplicationDto;
import com.placement.portal.dto.StatusUpdateDto;
import com.placement.portal.entity.*;
import com.placement.portal.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ApplicationService {

    private final ApplicationRepository applicationRepository;
    private final JobRepository jobRepository;
    private final StudentProfileRepository profileRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;
    private final StudentSkillRepository studentSkillRepository;

    public ApplicationService(ApplicationRepository applicationRepository,
                              JobRepository jobRepository,
                              StudentProfileRepository profileRepository,
                              UserRepository userRepository,
                              NotificationService notificationService,
                              StudentSkillRepository studentSkillRepository) {
        this.applicationRepository = applicationRepository;
        this.jobRepository = jobRepository;
        this.profileRepository = profileRepository;
        this.userRepository = userRepository;
        this.notificationService = notificationService;
        this.studentSkillRepository = studentSkillRepository;
    }

    @Transactional
    public ApplicationDto apply(String email, Long jobId, String coverLetter, String resumeUrl) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        StudentProfile profile = profileRepository.findByUser(user)
                .orElseThrow(() -> new RuntimeException("Student profile not found. Please complete profile first."));

        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new RuntimeException("Job not found with id: " + jobId));

        if (applicationRepository.existsByStudentProfileIdAndJobId(profile.getId(), job.getId())) {
            throw new RuntimeException("You have already applied for this position.");
        }

        Application application = Application.builder()
                .studentProfile(profile)
                .job(job)
                .coverLetter(coverLetter)
                .resumeUrl(resumeUrl != null ? resumeUrl : profile.getResumeUrl())
                .status("APPLIED")
                .note("Application received and awaiting screening.")
                .build();

        application = applicationRepository.save(application);

        // Send submission notification
        notificationService.createNotification(
                user.getId(),
                "Application Submitted",
                "Your application for " + job.getTitle() + " at " + job.getCompany().getName() + " was submitted successfully.",
                "APPLIED",
                job.getTitle(),
                job.getCompany().getName(),
                application.getId()
        );

        return mapToDto(application);
    }

    public List<ApplicationDto> getMyApplications(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        StudentProfile profile = profileRepository.findByUser(user)
                .orElseThrow(() -> new RuntimeException("Student profile not found"));

        return applicationRepository.findByStudentProfileId(profile.getId()).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    public List<ApplicationDto> getJobApplications(Long jobId) {
        return applicationRepository.findByJobId(jobId).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    public List<ApplicationDto> getAllApplications() {
        return applicationRepository.findAll().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public ApplicationDto updateStatus(Long applicationId, StatusUpdateDto dto) {
        Application application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new RuntimeException("Application not found with id: " + applicationId));

        String oldStatus = application.getStatus();
        String newStatus = dto.getStatus().toUpperCase();
        application.setStatus(newStatus);
        if (dto.getNote() != null && !dto.getNote().trim().isEmpty()) {
            application.setNote(dto.getNote());
        }

        application = applicationRepository.save(application);

        // ============================================================
        // AUTOMATIC NOTIFICATION LOGIC (Section 14 & 15)
        // When Company/Admin changes status, notify student in DB
        // ============================================================
        User studentUser = application.getStudentProfile().getUser();
        String jobTitle = application.getJob().getTitle();
        String companyName = application.getJob().getCompany().getName();

        String notifTitle;
        String notifMsg;

        switch (newStatus) {
            case "SHORTLISTED":
                notifTitle = "Congratulations! Shortlisted";
                notifMsg = "Congratulations! You have been shortlisted for the " + jobTitle + " position at " + companyName + ".";
                break;
            case "INTERVIEW_SCHEDULED":
                notifTitle = "Interview Scheduled";
                notifMsg = "An interview round has been scheduled for your application to " + jobTitle + " at " + companyName + ".";
                break;
            case "SELECTED":
                notifTitle = "Congratulations! Job Offer";
                notifMsg = "Congratulations! You have been selected for the " + jobTitle + " role at " + companyName + "!";
                break;
            case "REJECTED":
                notifTitle = "Application Status Update";
                notifMsg = "Thank you for interviewing for " + jobTitle + " at " + companyName + ". The position has now been closed.";
                break;
            default:
                notifTitle = "Application Status Update";
                notifMsg = "Your application for " + jobTitle + " at " + companyName + " is now " + newStatus + ".";
                break;
        }

        notificationService.createNotification(
                studentUser.getId(),
                notifTitle,
                notifMsg,
                newStatus,
                jobTitle,
                companyName,
                application.getId()
        );

        return mapToDto(application);
    }

    public ApplicationDto mapToDto(Application a) {
        StudentProfile p = a.getStudentProfile();
        User u = p.getUser();
        Job j = a.getJob();

        List<String> studentSkills = studentSkillRepository.findByStudentProfile(p).stream()
                .map(ss -> ss.getSkill().getName())
                .collect(Collectors.toList());

        return ApplicationDto.builder()
                .id(a.getId())
                .studentId(u.getId())
                .studentName(u.getName())
                .email(u.getEmail())
                .phone(p.getPhone())
                .college(p.getCollege())
                .department(p.getDepartment())
                .cgpa(p.getCgpa())
                .jobId(j.getId())
                .jobTitle(j.getTitle())
                .company(j.getCompany().getName())
                .location(j.getLocation())
                .salary(j.getSalary())
                .jobType(j.getJobType())
                .status(a.getStatus())
                .note(a.getNote())
                .resumeUrl(a.getResumeUrl())
                .coverLetter(a.getCoverLetter())
                .appliedAt(a.getAppliedAt() != null ? a.getAppliedAt().toLocalDate().toString() : "")
                .updatedAt(a.getUpdatedAt() != null ? a.getUpdatedAt().toLocalDate().toString() : "")
                .skills(studentSkills)
                .build();
    }
}
