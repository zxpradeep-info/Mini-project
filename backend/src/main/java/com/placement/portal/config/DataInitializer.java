package com.placement.portal.config;

import com.placement.portal.entity.*;
import com.placement.portal.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDate;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Configuration
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final StudentProfileRepository profileRepository;
    private final SkillRepository skillRepository;
    private final StudentSkillRepository studentSkillRepository;
    private final CompanyRepository companyRepository;
    private final JobRepository jobRepository;
    private final ApplicationRepository applicationRepository;
    private final NotificationRepository notificationRepository;
    private final SupportTicketRepository supportTicketRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(UserRepository userRepository,
                           StudentProfileRepository profileRepository,
                           SkillRepository skillRepository,
                           StudentSkillRepository studentSkillRepository,
                           CompanyRepository companyRepository,
                           JobRepository jobRepository,
                           ApplicationRepository applicationRepository,
                           NotificationRepository notificationRepository,
                           SupportTicketRepository supportTicketRepository,
                           PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.profileRepository = profileRepository;
        this.skillRepository = skillRepository;
        this.studentSkillRepository = studentSkillRepository;
        this.companyRepository = companyRepository;
        this.jobRepository = jobRepository;
        this.applicationRepository = applicationRepository;
        this.notificationRepository = notificationRepository;
        this.supportTicketRepository = supportTicketRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        if (userRepository.count() > 0) {
            return; // Seed data already initialized
        }

        System.out.println(">>> Initializing Placement Portal Seed Data...");

        // 1. Create Core Users
        String encodedPass = passwordEncoder.encode("password123");

        User student1 = userRepository.save(User.builder()
                .name("Pradeep Kumar")
                .email("student@placement.edu")
                .passwordHash(encodedPass)
                .role("STUDENT")
                .build());

        User recruiter = userRepository.save(User.builder()
                .name("Sarah Jenkins")
                .email("recruiter@abctech.com")
                .passwordHash(encodedPass)
                .role("COMPANY")
                .build());

        User admin = userRepository.save(User.builder()
                .name("Placement Officer")
                .email("admin@placement.edu")
                .passwordHash(encodedPass)
                .role("ADMIN")
                .build());

        User student2 = userRepository.save(User.builder()
                .name("Arun Venkatesh")
                .email("arun.v@college.edu")
                .passwordHash(encodedPass)
                .role("STUDENT")
                .build());

        User student3 = userRepository.save(User.builder()
                .name("Sneha Rao")
                .email("sneha.rao@college.edu")
                .passwordHash(encodedPass)
                .role("STUDENT")
                .build());

        // 2. Student Profiles
        StudentProfile p1 = profileRepository.save(StudentProfile.builder()
                .user(student1)
                .phone("+91 98765 43210")
                .college("College of Engineering & Technology")
                .department("Computer Science & Engineering")
                .year("4th Year")
                .cgpa(8.75)
                .location("Chennai, India")
                .about("Aspiring full-stack engineer passionate about cloud architectures, Spring Boot microservices, and React.")
                .resumeUrl("https://example.com/resumes/pradeep_kumar_resume.pdf")
                .profilePhotoUrl("https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80")
                .build());

        StudentProfile p2 = profileRepository.save(StudentProfile.builder()
                .user(student2)
                .phone("+91 98123 45678")
                .college("College of Engineering & Technology")
                .department("Computer Science & Engineering")
                .year("4th Year")
                .cgpa(8.5)
                .location("Chennai, India")
                .about("Backend enthusiast skilled in Java, Spring Data JPA, and high-performance database indexing.")
                .resumeUrl("https://example.com/resumes/arun_v_resume.pdf")
                .profilePhotoUrl("https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80")
                .build());

        StudentProfile p3 = profileRepository.save(StudentProfile.builder()
                .user(student3)
                .phone("+91 98345 67890")
                .college("College of Engineering & Technology")
                .department("Computer Science & Engineering")
                .year("3rd Year")
                .cgpa(8.9)
                .location("Chennai, India")
                .about("UI/UX focused frontend engineer specialized in React, modern Tailwind styling, and accessibility.")
                .resumeUrl("https://example.com/resumes/sneha_rao_resume.pdf")
                .profilePhotoUrl("https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80")
                .build());

        // 3. Skills
        Skill javaSkill = skillRepository.save(Skill.builder().name("Java").build());
        Skill springSkill = skillRepository.save(Skill.builder().name("Spring Boot").build());
        Skill reactSkill = skillRepository.save(Skill.builder().name("React.js").build());
        Skill tailwindSkill = skillRepository.save(Skill.builder().name("Tailwind CSS").build());
        Skill pgSkill = skillRepository.save(Skill.builder().name("PostgreSQL").build());
        Skill pythonSkill = skillRepository.save(Skill.builder().name("Python").build());
        Skill dockerSkill = skillRepository.save(Skill.builder().name("Docker").build());
        Skill gitSkill = skillRepository.save(Skill.builder().name("Git").build());

        // 4. Student Skills
        studentSkillRepository.save(StudentSkill.builder().studentProfile(p1).skill(javaSkill).skillLevel("ADVANCED").build());
        studentSkillRepository.save(StudentSkill.builder().studentProfile(p1).skill(springSkill).skillLevel("ADVANCED").build());
        studentSkillRepository.save(StudentSkill.builder().studentProfile(p1).skill(reactSkill).skillLevel("INTERMEDIATE").build());
        studentSkillRepository.save(StudentSkill.builder().studentProfile(p1).skill(pgSkill).skillLevel("INTERMEDIATE").build());

        studentSkillRepository.save(StudentSkill.builder().studentProfile(p2).skill(javaSkill).skillLevel("ADVANCED").build());
        studentSkillRepository.save(StudentSkill.builder().studentProfile(p2).skill(springSkill).skillLevel("ADVANCED").build());
        studentSkillRepository.save(StudentSkill.builder().studentProfile(p2).skill(dockerSkill).skillLevel("INTERMEDIATE").build());

        studentSkillRepository.save(StudentSkill.builder().studentProfile(p3).skill(reactSkill).skillLevel("ADVANCED").build());
        studentSkillRepository.save(StudentSkill.builder().studentProfile(p3).skill(tailwindSkill).skillLevel("ADVANCED").build());
        studentSkillRepository.save(StudentSkill.builder().studentProfile(p3).skill(gitSkill).skillLevel("INTERMEDIATE").build());

        // 5. Companies
        Company abcTech = companyRepository.save(Company.builder()
                .name("ABC Technologies")
                .location("Chennai & Bengaluru")
                .description("Global software products and enterprise consulting firm driving digital transformation.")
                .logoUrl("https://images.unsplash.com/photo-1549923746-c502d488b3ea?w=120&auto=format&fit=crop&q=80")
                .build());

        Company xyzSol = companyRepository.save(Company.builder()
                .name("XYZ Solutions")
                .location("Bengaluru, India")
                .description("Next-generation web applications, cloud native systems, and design systems powerhouse.")
                .logoUrl("https://images.unsplash.com/photo-1572021335469-31706a17aaef?w=120&auto=format&fit=crop&q=80")
                .build());

        Company cloudScale = companyRepository.save(Company.builder()
                .name("CloudScale Labs")
                .location("Hyderabad, India")
                .description("High-throughput microservices and distributed cloud infrastructure solutions.")
                .logoUrl("https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=120&auto=format&fit=crop&q=80")
                .build());

        // 6. Job Postings
        Job job1 = jobRepository.save(Job.builder()
                .title("Full Stack Java Developer")
                .company(abcTech)
                .location("Chennai (Hybrid)")
                .jobType("Full-Time")
                .salary("₹7.5 - 10.0 LPA")
                .eligibility("B.E / B.Tech CSE, IT, ECE (2026 Batch)")
                .minimumCgpa(7.5)
                .applicationDeadline(LocalDate.now().plusDays(25))
                .description("We are looking for enthusiastic Full Stack Java Developers to build scalable enterprise web solutions with Spring Boot and React.")
                .responsibilities("• Design and develop performant RESTful APIs in Spring Boot\n• Integrate responsive React frontends with state management\n• Collaborate in Agile sprints and write comprehensive unit tests")
                .requiredSkills(new HashSet<>(List.of(javaSkill, springSkill, reactSkill, pgSkill)))
                .build());

        Job job2 = jobRepository.save(Job.builder()
                .title("Frontend Developer Intern")
                .company(xyzSol)
                .location("Bengaluru (On-site)")
                .jobType("Internship")
                .salary("₹30,000 / month")
                .eligibility("B.E / B.Tech all streams with strong JavaScript skills")
                .minimumCgpa(7.0)
                .applicationDeadline(LocalDate.now().plusDays(18))
                .description("Join our UI engineering team to build sleek, accessible, modern user interfaces using React, Tailwind CSS, and Vite.")
                .responsibilities("• Implement responsive components from Figma designs\n• Optimize client-side bundle size and rendering performance\n• Write clean, maintainable modular code")
                .requiredSkills(new HashSet<>(List.of(reactSkill, tailwindSkill, gitSkill)))
                .build());

        Job job3 = jobRepository.save(Job.builder()
                .title("Backend Cloud Engineer")
                .company(cloudScale)
                .location("Hyderabad (Remote)")
                .jobType("Full-Time")
                .salary("₹12.0 - 15.0 LPA")
                .eligibility("B.E / B.Tech CSE, IT (CGPA >= 8.0)")
                .minimumCgpa(8.0)
                .applicationDeadline(LocalDate.now().plusDays(30))
                .description("Build hyper-scale distributed microservices running on Docker containers and PostgreSQL backends.")
                .responsibilities("• Architect high-throughput backend services\n• Manage database transactions, partitioning, and schema tuning\n• Implement resilient security and authentication filters")
                .requiredSkills(new HashSet<>(List.of(javaSkill, springSkill, dockerSkill, pgSkill)))
                .build());

        // 7. Applications
        Application app1 = applicationRepository.save(Application.builder()
                .studentProfile(p1)
                .job(job1)
                .status("SHORTLISTED")
                .note("Screened by technical team. Profile meets all skill prerequisites.")
                .resumeUrl(p1.getResumeUrl())
                .coverLetter("I have hands-on experience building full stack systems with Spring Boot 3 and React. Excited for the opportunity!")
                .build());

        Application app2 = applicationRepository.save(Application.builder()
                .studentProfile(p1)
                .job(job2)
                .status("APPLIED")
                .note("Application received and awaiting screening.")
                .resumeUrl(p1.getResumeUrl())
                .coverLetter("Excited to apply modern React and Tailwind CSS techniques to build seamless interfaces.")
                .build());

        Application app3 = applicationRepository.save(Application.builder()
                .studentProfile(p2)
                .job(job1)
                .status("INTERVIEW_SCHEDULED")
                .note("Technical round 1 scheduled for next Monday 10:30 AM via Google Meet.")
                .resumeUrl(p2.getResumeUrl())
                .coverLetter("Passionate about Java Enterprise architecture and database query tuning.")
                .build());

        // 8. Notifications for Pradeep (student1)
        notificationRepository.save(Notification.builder()
                .user(student1)
                .title("Congratulations! Shortlisted")
                .message("Congratulations! You have been shortlisted for Full Stack Java Developer at ABC Technologies.")
                .type("SHORTLISTED")
                .isRead(false)
                .jobTitle("Full Stack Java Developer")
                .companyName("ABC Technologies")
                .applicationId(app1.getId())
                .build());

        notificationRepository.save(Notification.builder()
                .user(student1)
                .title("Application Submitted")
                .message("Your application for Frontend Developer Intern at XYZ Solutions was submitted successfully.")
                .type("APPLIED")
                .isRead(true)
                .jobTitle("Frontend Developer Intern")
                .companyName("XYZ Solutions")
                .applicationId(app2.getId())
                .build());

        notificationRepository.save(Notification.builder()
                .user(student1)
                .title("Welcome to Placement Portal")
                .message("Welcome Pradeep! Complete your profile and add your technical skills to boost placement matching.")
                .type("SYSTEM")
                .isRead(true)
                .jobTitle("Portal Onboarding")
                .companyName("Placement Cell")
                .build());

        // 9. Support Tickets
        supportTicketRepository.save(SupportTicket.builder()
                .user(student1)
                .subject("Query regarding interview round format")
                .category("Application Problem")
                .priority("Medium")
                .status("RESOLVED")
                .description("Could you please clarify whether the first interview round for ABC Technologies will be a live coding round or technical MCQs?")
                .reply("Round 1 consists of 45 minutes live problem solving in Java data structures followed by system design questions.")
                .build());

        supportTicketRepository.save(SupportTicket.builder()
                .user(student1)
                .subject("Uploaded resume link update")
                .category("Resume Problem")
                .priority("Low")
                .status("OPEN")
                .description("I recently earned an AWS Cloud Practitioner certification and uploaded an updated resume. Please verify that recruiters view the new version.")
                .build());

        System.out.println(">>> Placement Portal Seed Data Initialization Completed!");
    }
}
