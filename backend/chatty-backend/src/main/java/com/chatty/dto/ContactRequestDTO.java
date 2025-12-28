package com.chatty.dto;

import java.util.UUID;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ContactRequestDTO {
    private UUID requester;
    private UUID recipient;
}
