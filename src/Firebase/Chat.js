import { Chat } from "../Classes/Chat";
import { firestore } from "./Firebase";

async function getUserChatDocuments(username) {
    const myChatQuery = firestore.collection('Chats').where('owners', 'array-contains', { username: username });
	return await myChatQuery.get();
}

export async function processChatDocuments(chatSnapshot, username) {
    for (const doc of chatSnapshot.docs) {
        await fetchLatestMessage(doc.id, username);
    }
}

async function fetchLatestMessage(docId, username) {
    const latestMessageQuery = firestore
      .collection(`Chats/${docId}/messages`)
      .orderBy('createdAt', 'desc')
      .limit(1);

    const results = await latestMessageQuery.get();
    processLatestMessageResults(results, username);
}

async function processLatestMessageResults(results, username) {
    results.forEach((latestMessageSnapshot) => {
      if (!latestMessageSnapshot.empty &&
          latestMessageSnapshot.docs[0].data().user.name !== username) {
        latestMessageReceived = latestMessageSnapshot.docs[0].data().received;
      }
    });
}

export async function getUserChats(username) {
    try {
        const ChatSnapshot = await getUserChatDocuments(username);
        const chatDocs = ChatSnapshot.docs;
        const userChats = [];

        for (const doc of chatDocs) {
            const messagesQuery = firestore.collection(`Chats/${doc.id}/messages`).orderBy('createdAt', 'desc');
            const AllMessagesSnapshot = await messagesQuery.get();
            const AllMessageDocs = AllMessagesSnapshot.docs;

            let chatData = {
                owners: doc.data().owners,
                id: doc.id,
                latestMessage: '',
                latestImageUri: '',
                messages: [],
                received: false,
            };

            if (!_.isEmpty(AllMessageDocs)) {
                const latestMessageData = AllMessageDocs[0].data();
                chatData.latestMessage = latestMessageData.user.name === username ? 'You: ' + latestMessageData.text : latestMessageData.text;
                chatData.received = latestMessageData.received;
                chatData.latestImageUri = !_.isEmpty(latestMessageData.image) ? latestMessageData.image[0] : '';
                chatData.messages = AllMessageDocs.map((message) => message.data());
            }

            userChats.push(new Chat(chatData));
        }

        return userChats;
    } catch (error) {
        console.error(error);
        return [];
    }
}
