package com.chatty.enums;

import lombok.Getter;

public enum ContactRequestStatus {
    
    PENDING("Pending"), 
    ACCEPTED("Accepted"), 
    REJECTED("Rejected");

    @Getter
    private String displayString;

    ContactRequestStatus(String displayString) {
        this.displayString = displayString;
    }
}
