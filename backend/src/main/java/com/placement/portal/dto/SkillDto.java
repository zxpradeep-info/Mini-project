package com.placement.portal.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SkillDto {
    private Long id;
    private String name;
    private String level; // BEGINNER, INTERMEDIATE, ADVANCED
}
