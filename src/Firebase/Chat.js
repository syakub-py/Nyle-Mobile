import { firestore } from "./Firebase";

export async function getChatDocuments() {
    const myChatQuery = firestore.collection('Chats');
    return await myChatQuery.get();
}

export async function processChatDocuments(chatSnapshot, username) {
    for (const doc of chatSnapshot.docs) {
      const owner = doc.data().owners.find((owner) => owner.username === username);
      if (owner) {
        await fetchLatestMessage(doc.id, username);
      }
    }
}

async function fetchLatestMessage(docId, username) {
    const latestMessageQuery = this.firestore
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
