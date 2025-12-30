package com.chatty.controller;

import java.util.List;
import java.util.UUID;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import com.chatty.dto.MessageWSDTO;
import com.chatty.entity.Message;
import com.chatty.repository.MessageRepository;

@Controller
public class MessageWSController {

    private static final Logger logger = LoggerFactory.getLogger(MessageWSController.class);

    @Autowired
    MessageRepository messageRepository;

    @Autowired
    SimpMessagingTemplate messagingTemplate;

    @MessageMapping("/messages/send/{sender}/{receiver}")
    public void handleMessage(@DestinationVariable UUID sender, @DestinationVariable UUID receiver, MessageWSDTO messageDTO) {
        logger.info("Received WebSocket message from {} to {}", sender, receiver);

        Message message = Message.builder()
            .sender(messageDTO.sender())
            .receiver(messageDTO.receiver())
            .text(messageDTO.messageText()).build();

        // Save the incoming message
        Message savedMessage = messageRepository.save(message);
        logger.info("Saved message with id: {}", savedMessage.getId());

        // Send the saved message directly (no need to query, we already have it)
        List<Message> messages = List.of(savedMessage);

        // Send to receiver's queue
        logger.info("Sending message to receiver queue: /queue/messages/{}", receiver);
        messagingTemplate.convertAndSend("/queue/messages/" + receiver, messages);

        // Also send to sender's queue so they see their own message confirmed
        // This is important for message confirmation and consistent UI
        logger.info("Sending message to sender queue: /queue/messages/{}", sender);
        messagingTemplate.convertAndSend("/queue/messages/" + sender, messages);
    }
}
