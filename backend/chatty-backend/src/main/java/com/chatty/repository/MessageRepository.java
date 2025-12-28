package com.chatty.repository;

import com.chatty.entity.Message;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface MessageRepository extends JpaRepository<Message, UUID> {

    /**
     * Find all messages sent by a user
     * @param sender the sender's UUID
     * @return List of messages sent by the user
     */
    List<Message> findBySender(UUID sender);

    /**
     * Find all messages received by a user
     * @param receiver the receiver's UUID
     * @return List of messages received by the user
     */
    List<Message> findByReceiver(UUID receiver);

    /**
     * Find all messages between two users
     * @param sender the sender's UUID
     * @param receiver the receiver's UUID
     * @return List of messages between the two users
     */
    List<Message> findBySenderAndReceiver(UUID sender, UUID receiver);

    /**
     * Find all non-deleted messages by sender
     * @param sender the sender's UUID
     * @return List of non-deleted messages
     */
    List<Message> findBySenderAndIsDeletedFalse(UUID sender);

    /**
     * Find conversation between two users (messages in both directions)
     * @param user1 first user's UUID
     * @param user2 second user's UUID
     * @return List of messages in the conversation
     */
    @Query("SELECT m FROM Message m WHERE " +
           "(m.sender = :user1 AND m.receiver = :user2) OR " +
           "(m.sender = :user2 AND m.receiver = :user1) " +
           "ORDER BY m.createdAt ASC")
    List<Message> findConversation(@Param("user1") UUID user1, @Param("user2") UUID user2);

    /**
     * Find new messages in conversation after a certain timestamp (for long polling)
     * @param user1 first user's UUID
     * @param user2 second user's UUID
     * @param since epoch timestamp in milliseconds to check for messages after
     * @return List of new messages
     */
    @Query("SELECT m FROM Message m WHERE " +
           "((m.sender = :user1 AND m.receiver = :user2) OR " +
           "(m.sender = :user2 AND m.receiver = :user1)) " +
           "AND m.createdAt > :since " +
           "ORDER BY m.createdAt ASC")
    List<Message> findNewMessagesInConversation(
            @Param("user1") UUID user1,
            @Param("user2") UUID user2,
            @Param("since") Long since);
}

