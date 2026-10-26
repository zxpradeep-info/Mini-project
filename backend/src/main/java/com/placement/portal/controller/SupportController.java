package com.placement.portal.controller;

import com.placement.portal.dto.SupportTicketDto;
import com.placement.portal.service.SupportService;
import lombok.Data;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/support")
public class SupportController {

    private final SupportService supportService;

    public SupportController(SupportService supportService) {
        this.supportService = supportService;
    }

    @PostMapping("/tickets")
    public ResponseEntity<SupportTicketDto> createTicket(@AuthenticationPrincipal UserDetails userDetails,
                                                         @RequestBody SupportTicketDto ticketDto) {
        return ResponseEntity.ok(supportService.createTicket(userDetails.getUsername(), ticketDto));
    }

    @GetMapping("/tickets")
    public ResponseEntity<List<SupportTicketDto>> getUserTickets(@AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(supportService.getUserTickets(userDetails.getUsername()));
    }

    @GetMapping("/tickets/all")
    public ResponseEntity<List<SupportTicketDto>> getAllTickets() {
        return ResponseEntity.ok(supportService.getAllTickets());
    }

    @GetMapping("/tickets/{id}")
    public ResponseEntity<SupportTicketDto> getTicketById(@PathVariable Long id) {
        return ResponseEntity.ok(supportService.getTicketById(id));
    }

    @Data
    public static class TicketStatusUpdateRequest {
        private String status;
        private String reply;
    }

    @PutMapping("/tickets/{id}/status")
    public ResponseEntity<SupportTicketDto> updateTicketStatus(@PathVariable Long id,
                                                               @RequestBody TicketStatusUpdateRequest request) {
        return ResponseEntity.ok(supportService.updateTicket(id, request.getStatus(), request.getReply()));
    }
}
