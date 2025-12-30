package com.chatty.dto;

import java.util.UUID;

public record MessageWSDTO(UUID sender, UUID receiver, String messageText) {

}
