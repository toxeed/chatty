package com.chatty.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.UUID;

@Entity
@Table(name = "messages", schema = "public")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Message {

    @Id
    @Column(nullable = false)
    private UUID id;

    @Column(nullable = false)
    private UUID sender;

    @Column
    private UUID receiver;

    @Column(name = "created_at")
    private Long createdAt;  // Epoch milliseconds - timezone agnostic

    @Column(name = "is_deleted")
    @Builder.Default
    private Boolean isDeleted = false;

    @Column
    private String text;

    @PrePersist
    protected void onCreate() {
        if (id == null) {
            id = UUID.randomUUID();
        }
        if (createdAt == null) {
            createdAt = System.currentTimeMillis();  // Server timestamp
        }
    }
}

