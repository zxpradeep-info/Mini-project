package com.placement.portal.service;

import com.placement.portal.dto.SupportTicketDto;
import com.placement.portal.entity.SupportTicket;
import com.placement.portal.entity.User;
import com.placement.portal.repository.SupportTicketRepository;
import com.placement.portal.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class SupportService {

    private final SupportTicketRepository ticketRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;

    public SupportService(SupportTicketRepository ticketRepository,
                          UserRepository userRepository,
                          NotificationService notificationService) {
        this.ticketRepository = ticketRepository;
        this.userRepository = userRepository;
        this.notificationService = notificationService;
    }

    @Transactional
    public SupportTicketDto createTicket(String email, SupportTicketDto dto) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found with email: " + email));

        SupportTicket ticket = SupportTicket.builder()
                .user(user)
                .subject(dto.getSubject())
                .category(dto.getCategory() != null ? dto.getCategory() : "General")
                .description(dto.getDescription())
                .priority(dto.getPriority() != null ? dto.getPriority() : "Medium")
                .status("OPEN")
                .build();

        SupportTicket saved = ticketRepository.save(ticket);
        return mapToDto(saved);
    }

    public List<SupportTicketDto> getUserTickets(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found with email: " + email));
        return ticketRepository.findByUserIdOrderByCreatedAtDesc(user.getId()).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    public List<SupportTicketDto> getAllTickets() {
        return ticketRepository.findAllByOrderByCreatedAtDesc().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    public SupportTicketDto getTicketById(Long id) {
        SupportTicket ticket = ticketRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Ticket not found with id: " + id));
        return mapToDto(ticket);
    }

    @Transactional
    public SupportTicketDto updateTicket(Long id, String status, String reply) {
        SupportTicket ticket = ticketRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Ticket not found with id: " + id));

        if (status != null && !status.trim().isEmpty()) {
            ticket.setStatus(status.toUpperCase());
        }
        if (reply != null) {
            ticket.setReply(reply);
        }

        SupportTicket updated = ticketRepository.save(ticket);

        // Notify user about ticket update
        if (ticket.getUser() != null) {
            notificationService.createNotification(
                    ticket.getUser().getId(),
                    "Support Ticket Updated: #" + ticket.getId(),
                    "Your ticket regarding '" + ticket.getSubject() + "' status changed to " + ticket.getStatus() +
                            (reply != null && !reply.trim().isEmpty() ? ". Officer response: " + reply : "."),
                    "SUPPORT",
                    "Support Desk",
                    "Placement Admin",
                    null
            );
        }

        return mapToDto(updated);
    }

    private SupportTicketDto mapToDto(SupportTicket t) {
        return SupportTicketDto.builder()
                .id(t.getId())
                .userId(t.getUser() != null ? t.getUser().getId() : null)
                .studentName(t.getUser() != null ? t.getUser().getName() : "Anonymous")
                .email(t.getUser() != null ? t.getUser().getEmail() : "")
                .subject(t.getSubject())
                .category(t.getCategory())
                .description(t.getDescription())
                .priority(t.getPriority())
                .status(t.getStatus())
                .reply(t.getReply())
                .createdAt(t.getCreatedAt() != null ? t.getCreatedAt().toString() : "")
                .build();
    }
}
