package com.placement.portal.service;

import com.placement.portal.dto.*;
import com.placement.portal.entity.StudentProfile;
import com.placement.portal.entity.User;
import com.placement.portal.repository.StudentProfileRepository;
import com.placement.portal.repository.UserRepository;
import com.placement.portal.security.JwtTokenProvider;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final StudentProfileRepository profileRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider tokenProvider;

    public AuthService(UserRepository userRepository,
                       StudentProfileRepository profileRepository,
                       PasswordEncoder passwordEncoder,
                       JwtTokenProvider tokenProvider) {
        this.userRepository = userRepository;
        this.profileRepository = profileRepository;
        this.passwordEncoder = passwordEncoder;
        this.tokenProvider = tokenProvider;
    }

    @Transactional
    public AuthResponse register(RegisterRequest req) {
        if (userRepository.existsByEmail(req.getEmail())) {
            throw new RuntimeException("Email is already registered");
        }

        String role = req.getRole() != null ? req.getRole().toUpperCase() : "STUDENT";

        User user = User.builder()
                .name(req.getName())
                .email(req.getEmail())
                .passwordHash(passwordEncoder.encode(req.getPassword()))
                .role(role)
                .build();

        user = userRepository.save(user);

        StudentProfile profile = StudentProfile.builder()
                .user(user)
                .phone(req.getPhone())
                .college(req.getCollege())
                .department(req.getDepartment())
                .year(req.getYear())
                .cgpa(req.getCgpa() != null ? req.getCgpa() : 8.0)
                .location("Chennai, India")
                .about("Computer Science student interested in Software Development.")
                .resumeUrl("https://example.com/resume/sample.pdf")
                .profilePhotoUrl("https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80")
                .build();

        profile = profileRepository.save(profile);

        String token = tokenProvider.generateToken(user.getEmail(), user.getRole());
        return AuthResponse.builder()
                .token(token)
                .user(mapToUserDto(user, profile))
                .build();
    }

    public AuthResponse login(AuthRequest req) {
        User user = userRepository.findByEmail(req.getEmail())
                .orElseThrow(() -> new RuntimeException("Invalid email or password"));

        if (!passwordEncoder.matches(req.getPassword(), user.getPasswordHash())) {
            throw new RuntimeException("Invalid email or password");
        }

        StudentProfile profile = profileRepository.findByUser(user).orElse(null);
        String token = tokenProvider.generateToken(user.getEmail(), user.getRole());

        return AuthResponse.builder()
                .token(token)
                .user(mapToUserDto(user, profile))
                .build();
    }

    @Transactional
    public AuthResponse socialLogin(String provider, String tokenOrCode) {
        String mockEmail = provider.equalsIgnoreCase("google")
                ? "student.google@placement.edu"
                : "student.apple@placement.edu";

        String mockName = provider.equalsIgnoreCase("google")
                ? "Google Student User"
                : "Apple Student User";

        User user = userRepository.findByEmail(mockEmail).orElseGet(() -> {
            User newUser = User.builder()
                    .name(mockName)
                    .email(mockEmail)
                    .passwordHash(passwordEncoder.encode("social_secure_oauth_" + System.currentTimeMillis()))
                    .role("STUDENT")
                    .build();
            newUser = userRepository.save(newUser);

            StudentProfile newProfile = StudentProfile.builder()
                    .user(newUser)
                    .college("College of Engineering & Technology")
                    .department("Computer Science & Engineering")
                    .year("4th Year")
                    .cgpa(8.8)
                    .location("Chennai, India")
                    .about("Student logged in via " + provider)
                    .resumeUrl("https://example.com/resume/sample.pdf")
                    .build();
            profileRepository.save(newProfile);
            return newUser;
        });

        StudentProfile profile = profileRepository.findByUser(user).orElse(null);
        String jwt = tokenProvider.generateToken(user.getEmail(), user.getRole());

        return AuthResponse.builder()
                .token(jwt)
                .user(mapToUserDto(user, profile))
                .build();
    }

    public UserDto getCurrentUser(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found with email: " + email));
        StudentProfile profile = profileRepository.findByUser(user).orElse(null);
        return mapToUserDto(user, profile);
    }

    public UserDto mapToUserDto(User user, StudentProfile profile) {
        return UserDto.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .role(user.getRole())
                .phone(profile != null ? profile.getPhone() : null)
                .college(profile != null ? profile.getCollege() : null)
                .department(profile != null ? profile.getDepartment() : null)
                .year(profile != null ? profile.getYear() : null)
                .cgpa(profile != null ? profile.getCgpa() : null)
                .location(profile != null ? profile.getLocation() : null)
                .about(profile != null ? profile.getAbout() : null)
                .resumeUrl(profile != null ? profile.getResumeUrl() : null)
                .profilePhotoUrl(profile != null ? profile.getProfilePhotoUrl() : null)
                .build();
    }
}
