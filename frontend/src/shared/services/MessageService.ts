import { initClient } from "@ts-rest/core";
import { BACKEND_URL } from "../../environment";
import { messageContract } from "real-time-chat-backend/dist/shared/message.contract";

export class MessageService {
    client;

    constructor() {
        this.client = initClient(messageContract, {
            baseUrl: BACKEND_URL,
            baseHeaders: {},
        });
    }

    async getMessages(userId: string, contactId: string) {
        const messages = await this.client.getMessages({
            body: { userId, contactId },
        });

        if (messages.status === 200) {
            return messages.body;
        }

        return [];
    }

    deleteMessages(fromUserId: string, toUserId: string) {
        void this.client.deleteMessages({ body: { fromUserId, toUserId } });
    }

    sendMessage(userIdAuthor: string, message: string, contactId: string) {
        return this.client.sendMessage({
            body: {
                toUserId: contactId,
                message,
                fromUserId: userIdAuthor,
            },
        });
    }
}
