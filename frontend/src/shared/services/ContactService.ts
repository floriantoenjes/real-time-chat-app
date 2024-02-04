import { initClient } from "@ts-rest/core";
import { Contact, contract } from "../contract";
import { BACKEND_URL } from "../../environment";

export class ContactService {
    client;

    constructor() {
        this.client = initClient(contract, {
            baseUrl: BACKEND_URL,
            baseHeaders: {},
        });
    }

    async getContacts(userId: string): Promise<Contact[]> {
        const messages = await this.client.getContacts({ body: { userId } });

        if (messages.status === 200) {
            return messages.body;
        }

        return [];
    }
}
