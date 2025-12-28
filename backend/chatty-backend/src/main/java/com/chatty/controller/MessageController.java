package com.chatty.controller;

import com.chatty.entity.Message;
import com.chatty.repository.MessageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api/messages")
public class MessageController {

    @Autowired
    private MessageRepository messageRepository;

    /**
     * Get all messages
     */
    @GetMapping
    public ResponseEntity<List<Message>> getAllMessages() {
        List<Message> messages = messageRepository.findAll();
        return ResponseEntity.ok(messages);
    }

    /**
     * Get message by ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<Message> getMessageById(@PathVariable UUID id) {
        Optional<Message> message = messageRepository.findById(id);
        return message.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    /**
     * Get messages by sender
     */
    @GetMapping("/sender/{senderId}")
    public ResponseEntity<List<Message>> getMessagesBySender(@PathVariable UUID senderId) {
        List<Message> messages = messageRepository.findBySender(senderId);
        return ResponseEntity.ok(messages);
    }

    /**
     * Get messages by receiver
     */
    @GetMapping("/receiver/{receiverId}")
    public ResponseEntity<List<Message>> getMessagesByReceiver(@PathVariable UUID receiverId) {
        List<Message> messages = messageRepository.findByReceiver(receiverId);
        return ResponseEntity.ok(messages);
    }

    /**
     * Get conversation between two users
     */
    @GetMapping("/conversation")
    public ResponseEntity<List<Message>> getConversation(
            @RequestParam UUID user1,
            @RequestParam UUID user2) {
        List<Message> messages = messageRepository.findConversation(user1, user2);
        return ResponseEntity.ok(messages);
    }

    /**
     * Long polling endpoint for new messages.
     * Holds the connection for up to 30 seconds waiting for new messages.
     * Returns immediately if new messages are found.
     *
     * @param user1 first user's UUID
     * @param user2 second user's UUID
     * @param since epoch timestamp in milliseconds to check for messages after
     * @return List of new messages (empty if timeout with no new messages)
     */
    @GetMapping("/poll")
    public ResponseEntity<List<Message>> pollForNewMessages(
            @RequestParam UUID user1,
            @RequestParam UUID user2,
            @RequestParam Long since) {

        System.out.println("Long polling started for user1=" + user1 + ", user2=" + user2 + ", since=" + since);

        // Poll for up to 30 seconds
        int maxAttempts = 30;
        int pollIntervalMs = 1000; // Check every second

        for (int i = 0; i < maxAttempts; i++) {
            List<Message> newMessages = messageRepository.findNewMessagesInConversation(user1, user2, since);

            if (!newMessages.isEmpty()) {
                System.out.println("Found " + newMessages.size() + " new messages after " + i + " seconds");
                return ResponseEntity.ok(newMessages);
            }

            try {
                Thread.sleep(pollIntervalMs);
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
                return ResponseEntity.ok(List.of());
            }
        }

        System.out.println("Long polling timeout after 30 seconds");
        // Timeout - return empty list
        return ResponseEntity.ok(List.of());
    }

    /**
     * Create a new message
     */
    @PostMapping
    public ResponseEntity<Message> createMessage(@RequestBody Message message) {
        Message savedMessage = messageRepository.save(message);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedMessage);
    }

    /**
     * Soft delete a message (set isDeleted = true)
     */
    @PutMapping("/{id}/delete")
    public ResponseEntity<Message> softDeleteMessage(@PathVariable UUID id) {
        Optional<Message> optionalMessage = messageRepository.findById(id);
        if (optionalMessage.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Message message = optionalMessage.get();
        message.setIsDeleted(true);
        Message updatedMessage = messageRepository.save(message);
        return ResponseEntity.ok(updatedMessage);
    }

    /**
     * Delete a message permanently
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMessage(@PathVariable UUID id) {
        if (!messageRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        messageRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}

