package com.placement.portal.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NotificationDto {
    private Long id;
    private Long userId;
    private String title;
    private String message;
    private String type;
    private Boolean isRead;
    private String createdAt;
    private String jobTitle;
    private String companyName;
    private Long applicationId;
}
