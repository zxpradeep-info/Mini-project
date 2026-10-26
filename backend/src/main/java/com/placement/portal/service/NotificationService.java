package com.placement.portal.service;

import com.placement.portal.dto.NotificationDto;
import com.placement.portal.entity.Notification;
import com.placement.portal.entity.User;
import com.placement.portal.repository.NotificationRepository;
import com.placement.portal.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;

    public NotificationService(NotificationRepository notificationRepository, UserRepository userRepository) {
        this.notificationRepository = notificationRepository;
        this.userRepository = userRepository;
    }

    public List<NotificationDto> getUserNotifications(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return notificationRepository.findByUserIdOrderByCreatedAtDesc(user.getId()).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public void markAsRead(Long id) {
        notificationRepository.findById(id).ifPresent(n -> {
            n.setIsRead(true);
            notificationRepository.save(n);
        });
    }

    @Transactional
    public Notification createNotification(Long userId, String title, String message, String type, String jobTitle, String companyName, Long applicationId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));

        Notification notification = Notification.builder()
                .user(user)
                .title(title)
                .message(message)
                .type(type)
                .isRead(false)
                .jobTitle(jobTitle)
                .companyName(companyName)
                .applicationId(applicationId)
                .build();

        return notificationRepository.save(notification);
    }

    public NotificationDto mapToDto(Notification n) {
        return NotificationDto.builder()
                .id(n.getId())
                .userId(n.getUser().getId())
                .title(n.getTitle())
                .message(n.getMessage())
                .type(n.getType())
                .isRead(n.getIsRead())
                .createdAt(n.getCreatedAt() != null ? n.getCreatedAt().toString() : "")
                .jobTitle(n.getJobTitle())
                .companyName(n.getCompanyName())
                .applicationId(n.getApplicationId())
                .build();
    }
}
