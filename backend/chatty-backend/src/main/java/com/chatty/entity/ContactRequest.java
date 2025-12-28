package com.chatty.entity;

import java.time.LocalDateTime;
import java.util.UUID;

import com.chatty.enums.ContactRequestStatus;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Enumerated;
import jakarta.persistence.EnumType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "contact_requests", schema = "public")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ContactRequest {
    @Id
    @Column(name = "requester")
    private UUID requester;

    @Column(name = "recipient")
    private UUID recipient;

    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private ContactRequestStatus status;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate(){
        if(this.createdAt == null){
            this.createdAt = LocalDateTime.now();
        }

        if(this.updatedAt == null){
            this.updatedAt = LocalDateTime.now();
        }
    }
}
