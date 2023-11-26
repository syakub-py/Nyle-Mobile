export class Chat {
  constructor(chatData) {
    this.owners = chatData.owners;
    this.messages = chatData.messages;
    this.conversationID = chatData.id;
    this.latestMessage = chatData.latestMessage;
    this.latestImageUri = chatData.latestImageUri;
  }
}
