package com.chatty.controller;

import com.chatty.dto.ContactDTO;
import com.chatty.dto.ContactRequestDTO;
import com.chatty.entity.Contact;
import com.chatty.entity.ContactRequest;
import com.chatty.enums.ContactRequestStatus;
import com.chatty.repository.ContactRepository;
import com.chatty.service.ContactService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/contacts")
public class ContactController {

    @Autowired
    private ContactRepository contactRepository;

    @Autowired
    private ContactService contactService;

    /**
     * Get all contacts with user details
     */
    @GetMapping
    public ResponseEntity<List<ContactDTO>> getAllContacts() {
        List<ContactDTO> contacts = contactService.getAllContactsWithDetails();
        return ResponseEntity.ok(contacts);
    }

    /**
     * Get contact by initiator ID
     */
    @GetMapping("/{initiatorId}")
    public ResponseEntity<List<Contact>> getContactById(@PathVariable UUID initiatorId) {
        List<Contact> contact = contactRepository.findByInitiator(initiatorId);
        return ResponseEntity.ok(contact);
    }

    /**
     * Get all contacts initiated by a user
     */
    @GetMapping("/initiator/{initiatorId}")
    public ResponseEntity<List<Contact>> getContactsByInitiator(@PathVariable UUID initiatorId) {
        List<Contact> contacts = contactRepository.findByInitiator(initiatorId);
        return ResponseEntity.ok(contacts);
    }

    /**
     * Get all contacts where user is the target
     */
    @GetMapping("/target/{targetId}")
    public ResponseEntity<List<Contact>> getContactsByTarget(@PathVariable UUID targetId) {
        List<Contact> contacts = contactRepository.findByTarget(targetId);
        return ResponseEntity.ok(contacts);
    }

    /**
     * Get all contacts for a user (both as initiator and target) with user details
     */
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<ContactDTO>> getAllContactsForUser(@PathVariable UUID userId) {
        List<ContactDTO> contacts = contactService.getAllContactsForUserWithDetails(userId);
        return ResponseEntity.ok(contacts);
    }

    /**
     * Create a new contact
     */
    @PostMapping
    public ResponseEntity<Contact> createContact(@RequestBody Contact contact) {
        if (contactRepository.existsByInitiatorAndTarget(contact.getInitiator(), contact.getTarget())) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(null);
        }
        Contact savedContact = contactRepository.save(contact);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedContact);
    }

    /**
     * Delete a contact by ID
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteContact(@PathVariable Long id) {
        if (!contactRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        contactRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/sendRequest")
    public ResponseEntity<List<ContactRequest>> sendFriendRequest(@RequestBody ContactRequestDTO contactRequestDTO){
        ContactRequest contactRequest = ContactRequest.builder()
        .requester(contactRequestDTO.getRequester())
        .recipient(contactRequestDTO.getRecipient())
        .status(ContactRequestStatus.PENDING)
        .build();

        List<ContactRequest> contactRequestResponse = contactService.createContactRequest(contactRequest);
        return ResponseEntity.status(HttpStatus.CREATED).body(contactRequestResponse);
    }

    @PostMapping("/acceptRequest/{userId}/{requesterId}")
    public ResponseEntity<Boolean> acceptFriendRequest(@PathVariable UUID userId, @PathVariable UUID requesterId){
        return ResponseEntity.ok(contactService.acceptFriendRequest(userId, requesterId));
    }
}

