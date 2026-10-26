package com.placement.portal.service;

import com.placement.portal.dto.JobDto;
import com.placement.portal.entity.Company;
import com.placement.portal.entity.Job;
import com.placement.portal.entity.Skill;
import com.placement.portal.repository.ApplicationRepository;
import com.placement.portal.repository.CompanyRepository;
import com.placement.portal.repository.JobRepository;
import com.placement.portal.repository.SkillRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class JobService {

    private final JobRepository jobRepository;
    private final CompanyRepository companyRepository;
    private final SkillRepository skillRepository;
    private final ApplicationRepository applicationRepository;

    public JobService(JobRepository jobRepository,
                      CompanyRepository companyRepository,
                      SkillRepository skillRepository,
                      ApplicationRepository applicationRepository) {
        this.jobRepository = jobRepository;
        this.companyRepository = companyRepository;
        this.skillRepository = skillRepository;
        this.applicationRepository = applicationRepository;
    }

    public List<JobDto> getAllJobs(String query) {
        List<Job> jobs = (query != null && !query.trim().isEmpty())
                ? jobRepository.searchJobs(query.trim())
                : jobRepository.findAll();

        return jobs.stream().map(this::mapToDto).collect(Collectors.toList());
    }

    public JobDto getJobById(Long id) {
        Job job = jobRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Job not found with id: " + id));
        return mapToDto(job);
    }

    @Transactional
    public JobDto createJob(JobDto dto) {
        Company company = companyRepository.findByNameIgnoreCase(dto.getCompany())
                .orElseGet(() -> companyRepository.save(Company.builder()
                        .name(dto.getCompany())
                        .location(dto.getLocation())
                        .description("Leading innovative technology solutions company.")
                        .logoUrl(dto.getCompanyLogo() != null ? dto.getCompanyLogo() : "https://images.unsplash.com/photo-1549923746-c502d488b3ea?w=120&auto=format&fit=crop&q=80")
                        .build()));

        Set<Skill> skills = new HashSet<>();
        if (dto.getSkills() != null) {
            for (String sName : dto.getSkills()) {
                Skill skill = skillRepository.findByNameIgnoreCase(sName.trim())
                        .orElseGet(() -> skillRepository.save(Skill.builder().name(sName.trim()).build()));
                skills.add(skill);
            }
        }

        LocalDate deadline = dto.getDeadline() != null && !dto.getDeadline().isEmpty()
                ? LocalDate.parse(dto.getDeadline())
                : LocalDate.now().plusMonths(1);

        String responsibilitiesText = dto.getResponsibilities() != null
                ? String.join("\n", dto.getResponsibilities())
                : "• Write testable code\n• Collaborate with engineering teams";

        Job job = Job.builder()
                .title(dto.getTitle())
                .company(company)
                .description(dto.getDescription())
                .responsibilities(responsibilitiesText)
                .location(dto.getLocation())
                .jobType(dto.getJobType())
                .salary(dto.getSalary())
                .eligibility(dto.getEligibility())
                .minimumCgpa(dto.getMinCgpa())
                .applicationDeadline(deadline)
                .requiredSkills(skills)
                .build();

        job = jobRepository.save(job);
        return mapToDto(job);
    }

    @Transactional
    public void deleteJob(Long id) {
        jobRepository.deleteById(id);
    }

    public JobDto mapToDto(Job job) {
        List<String> skillNames = job.getRequiredSkills().stream()
                .map(Skill::getName)
                .collect(Collectors.toList());

        List<String> respList = job.getResponsibilities() != null
                ? Arrays.asList(job.getResponsibilities().split("\n"))
                : Collections.emptyList();

        int applicantsCount = applicationRepository.findByJobId(job.getId()).size();

        return JobDto.builder()
                .id(job.getId())
                .title(job.getTitle())
                .company(job.getCompany().getName())
                .companyLogo(job.getCompany().getLogoUrl())
                .location(job.getLocation())
                .jobType(job.getJobType())
                .salary(job.getSalary())
                .eligibility(job.getEligibility())
                .minCgpa(job.getMinimumCgpa())
                .deadline(job.getApplicationDeadline() != null ? job.getApplicationDeadline().toString() : "")
                .postedDate(job.getCreatedAt() != null ? job.getCreatedAt().toLocalDate().toString() : "")
                .description(job.getDescription())
                .responsibilities(respList)
                .qualifications(Arrays.asList(
                        "Sound knowledge in core algorithms and programming principles.",
                        "Good problem-solving attitude and team collaboration skills."
                ))
                .skills(skillNames)
                .applicantCount(applicantsCount)
                .build();
    }
}
