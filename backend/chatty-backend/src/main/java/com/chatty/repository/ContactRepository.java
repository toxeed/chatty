package com.chatty.repository;

import com.chatty.entity.Contact;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ContactRepository extends JpaRepository<Contact, Long> {

    /**
     * Find all contacts initiated by a user
     * @param initiator the initiator's UUID
     * @return List of contacts initiated by the user
     */
    List<Contact> findByInitiator(UUID initiator);

    /**
     * Find all contacts where user is the target
     * @param target the target's UUID
     * @return List of contacts where user is target
     */
    List<Contact> findByTarget(UUID target);

    /**
     * Check if a contact exists between initiator and target
     * @param initiator the initiator's UUID
     * @param target the target's UUID
     * @return true if contact exists
     */
    boolean existsByInitiatorAndTarget(UUID initiator, UUID target);

    /**
     * Find a specific contact by initiator and target
     * @param initiator the initiator's UUID
     * @param target the target's UUID
     * @return Optional containing the contact if found
     */
    Optional<Contact> findByInitiatorAndTarget(UUID initiator, UUID target);

    /**
     * Find all contacts for a user (either as initiator or target)
     * @param userId the user's UUID
     * @return List of all contacts involving the user
     */
    @Query("SELECT c FROM Contact c WHERE c.initiator = :userId OR c.target = :userId")
    List<Contact> findAllContactsForUser(@Param("userId") UUID userId);
}

