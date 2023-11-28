import { getChatDocuments, processChatDocuments } from '../Firebase/Chat';
import { makeAutoObservable } from "mobx"

export class Chat {
  constructor(chatData) {
	makeAutoObservable(this)
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
