package com.chatty.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ContactDTO {
    private UUID target;
    private LocalDateTime createdAt;
    
    // Target user details
    private String targetUsername;
    private String targetDisplayName;
    private String targetPhotoUri;
    private String targetEmail;
    private String status;
}

