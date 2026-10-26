package com.placement.portal.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SupportTicketDto {
    private Long id;
    private Long userId;
    private String studentName;
    private String email;
    private String subject;
    private String category;
    private String description;
    private String priority;
    private String status;
    private String reply;
    private String createdAt;
}
