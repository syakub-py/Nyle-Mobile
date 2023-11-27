import {firestore} from '../Components/Firebase';

export class Chat {
  constructor(chatData) {
    this.owners = chatData.owners;
    this.messages = chatData.messages;
    this.conversationID = chatData.id;
    this.latestMessage = chatData.latestMessage;
    this.latestImageUri = chatData.latestImageUri;
    this.latestMessageReceived = chatData.received;
  }
  updateLatestMessage = (username)=>{
    const MyChatQuery = firestore.collection('Chats');
    MyChatQuery.get().then((ChatSnapshot) => {
      ChatSnapshot.docs.forEach((doc) => {
        const owner = doc.data().owners.find((owner) => owner.username === username);
        if (owner) {
          const latestMessageQuery = firestore
              .collection(`Chats/${doc.id}/messages`)
              .orderBy('createdAt', 'desc')
              .limit(1);
          Promise.all(latestMessageQuery.get()).then((results) => {
            results.forEach((latestMessageSnapshot) => {
              if (!latestMessageSnapshot.empty &&
                  latestMessageSnapshot.docs[0].data().user.name !== username) {
                this.latestMessageReceived = latestMessageSnapshot.docs[0].data().received;
              }
            });
          });
        }
      });
    });
  };
}
