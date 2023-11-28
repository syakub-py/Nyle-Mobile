import { getChatDocuments, processChatDocuments } from '../Firebase/Chat';

export class Chat {
  constructor(chatData) {
    this.owners = chatData.owners;
    this.messages = chatData.messages;
    this.conversationID = chatData.id;
    this.latestMessage = chatData.latestMessage;
    this.latestImageUri = chatData.latestImageUri;
    this.latestMessageReceived = chatData.received;
  }

  async updateLatestMessage(username) {
	const chatSnapShot = await getChatDocuments()
	await processChatDocuments(chatSnapShot, username)
  }
}
