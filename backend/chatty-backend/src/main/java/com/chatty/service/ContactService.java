package com.chatty.service;

import com.chatty.dto.ContactDTO;
import com.chatty.entity.Contact;
import com.chatty.entity.ContactRequest;
import com.chatty.entity.User;
import com.chatty.enums.ContactRequestStatus;
import com.chatty.repository.ContactRepository;
import com.chatty.repository.ContactRequestRepository;
import com.chatty.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class ContactService {

    @Autowired
    private ContactRepository contactRepository;

    @Autowired
    private ContactRequestRepository contactRequestRepository;

    @Autowired
    private UserRepository userRepository;

    /**
     * Get all contacts for a user with user details
     */
    public List<ContactDTO> getAllContactsForUserWithDetails(UUID userId) {
        List<Contact> contacts = contactRepository.findByInitiator(userId);
        List<ContactRequest> requests = contactRequestRepository.findByRequester(userId);
        return enrichContactsWithUserDetails(contacts, requests);
    }

    /**
     * Get all contacts with user details
     */
    public List<ContactDTO> getAllContactsWithDetails() {
        List<Contact> contacts = contactRepository.findAll();
        return enrichContactsWithUserDetails(contacts, null);
    }

    /**
     * 
     * Create a friend request
     */
    public List<ContactRequest> createContactRequest(ContactRequest contactRequest){
        contactRequestRepository.save(contactRequest);
        return contactRequestRepository.findByRequester(contactRequest.getRequester());
    }

    /**
     * 
     * Accept a friend request
     */
    public boolean acceptFriendRequest(UUID userId, UUID requesterId){
        ContactRequest contactRequest = contactRequestRepository.findByRequesterAndRecipient(requesterId, userId);
        contactRequestRepository.delete(contactRequest);

        Contact contactFrom = Contact.builder().initiator(userId).target(requesterId).build();
        Contact contactTo = Contact.builder().initiator(requesterId).target(userId).build();
        contactRepository.save(contactFrom);
        contactRepository.save(contactTo);
        return true;
    }

    /**
     * Enrich contacts with user details
     */
    private List<ContactDTO> enrichContactsWithUserDetails(List<Contact> contacts, List<ContactRequest> requests) {
        // Collect all unique user IDs
        Set<UUID> userIds = new HashSet<>();
        Set<UUID> pendingUuids = new HashSet<>();
        for (Contact contact : contacts) {
            userIds.add(contact.getTarget());
        }

        for (ContactRequest request : requests) {
            if(request.getStatus()==ContactRequestStatus.PENDING){
                userIds.add(request.getRecipient());
                pendingUuids.add(request.getRecipient());
            }
        }

        // Fetch all users in one query
        List<User> users = userRepository.findAllById(userIds);
        Map<UUID, User> userMap = users.stream()
                .collect(Collectors.toMap(User::getId, user -> user));

        // Build DTOs with user details
        List<ContactDTO> contactDTOs = new ArrayList<>();
        contactDTOs = contacts.stream()
                .map(contact -> buildContactDTO(contact, userMap))
                .collect(Collectors.toList());

        List<ContactDTO> pendingRequestDTOs = requests.stream()
                .filter(request -> request.getStatus()==ContactRequestStatus.PENDING)
                .map(request -> buildContactDTO(request, userMap))
                .collect(Collectors.toList());

        contactDTOs.addAll(pendingRequestDTOs);

        return contactDTOs;
    }

    private ContactDTO buildContactDTO(Contact contact, Map<UUID, User> userMap) {
        User targetUser = userMap.get(contact.getTarget());

        return ContactDTO.builder()
                .target(contact.getTarget())
                .createdAt(contact.getCreatedAt())
                .targetUsername(targetUser != null ? targetUser.getUsername() : null)
                .targetDisplayName(targetUser != null ? targetUser.getDisplayName() : null)
                .targetPhotoUri(targetUser != null ? targetUser.getPhotoUri() : null)
                .targetEmail(targetUser != null ? targetUser.getEmail() : null)
                .status(ContactRequestStatus.ACCEPTED.getDisplayString())
                .build();
    }

    private ContactDTO buildContactDTO(ContactRequest request, Map<UUID, User> userMap) {
        User recipientUser = userMap.get(request.getRecipient());

        return ContactDTO.builder()
                .target(request.getRecipient())
                .createdAt(request.getCreatedAt())
                .targetUsername(recipientUser != null ? recipientUser.getUsername() : null)
                .targetDisplayName(recipientUser != null ? recipientUser.getDisplayName() : null)
                .targetPhotoUri(recipientUser != null ? recipientUser.getPhotoUri() : null)
                .targetEmail(recipientUser != null ? recipientUser.getEmail() : null)
                .status(request.getStatus().getDisplayString())
                .build();
    }
}

