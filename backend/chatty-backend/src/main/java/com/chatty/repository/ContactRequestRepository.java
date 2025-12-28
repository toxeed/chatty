package com.chatty.repository;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.chatty.entity.ContactRequest;

public interface ContactRequestRepository extends JpaRepository<ContactRequest, UUID> {
    
    List<ContactRequest> findByRequester(UUID requester);
    
    ContactRequest findByRequesterAndRecipient(UUID requester, UUID recipient);

}
