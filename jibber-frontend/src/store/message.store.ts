import {create} from 'zustand'
import api from "@/services/api.ts";
import useCryptoStore from '@/store/crypto.store.ts';
import { useChatStore } from '@/store/chats.store.ts';
import { useSocketStore } from './socket.store';
import authStore from './auth.store';
import type { EncryptedMessage } from '@/types';
export interface Message {
  text: string;
  isSentByMe: boolean;
  timestamp: string;
}



interface GroupedMessage extends Message {
  showTimestamp: boolean;
}

interface MessageStore{
  messages: Message[],
  newMessage: string,
  groupMessages: (messages: Message[]) => GroupedMessage[],
  parseTimeString: (timeStr: string) => Date | null,
  handleSendMessage:() => Promise<void>
  setNewMessage: (message: string) => void,
  fetchMessages: (id: string | undefined) => Promise<void>,
  addReceivedMessage: (message: string) => void;
}

export const useMessageStore = create<MessageStore>((set, get)=>({
  messages: [],
  newMessage: '',
  groupMessages(messages){
    if (messages.length === 0) return [];
    const grouped: GroupedMessage[] = [];

    for (let i = 0; i < messages.length; i++) {
      const currentMessage = messages[i];
      const nextMessage = messages[i + 1];
      const parseTimeString = get().parseTimeString;
      let showTimestamp = true;
      if (nextMessage) {
        const currentTime = parseTimeString(currentMessage.timestamp);
        const nextTime = parseTimeString(nextMessage.timestamp);
        if (
          currentMessage.isSentByMe === nextMessage.isSentByMe &&
          nextTime &&
          currentTime &&
          Math.abs(nextTime.getTime() - currentTime.getTime()) <= 60000 // 1 minute = 60000ms
        ) showTimestamp = false;
      }

      grouped.push({
        ...currentMessage,
        showTimestamp
      });
    }

    return grouped;
  },
  parseTimeString(timeStr){
    try {
      const today = new Date();
      const [time, meridiem] = timeStr.split(' ');
      const [hours, minutes] = time.split(':').map(Number);

      let hour24 = hours;
      if (meridiem === 'PM' && hours !== 12) {
        hour24 += 12;
      } else if (meridiem === 'AM' && hours === 12) {
        hour24 = 0;
      }

      const date = new Date(today.getFullYear(), today.getMonth(), today.getDate(), hour24, minutes);
      return date;
    } catch {
      return null;
    }
  },
  async handleSendMessage(){
    const newMessage = get().newMessage;
    const messages = get().messages;
    
    if (newMessage.trim() === '') return;
    const currentTime = new Date().toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
    set({
      messages: [
        ...messages,
        { text: newMessage, isSentByMe: true, timestamp: currentTime },
      ]
    })


    //  Encrypt and sign message
    const {encryptMessage, signMessage} = useCryptoStore.getState()
    const {getSelectedChatUser, getSelectedChat} = useChatStore.getState()
    const receiverPublicIdKey = getSelectedChatUser()?.publicIdKey;
    let encryptedMessage,signature;
    if(receiverPublicIdKey){
      encryptedMessage = await encryptMessage(newMessage, receiverPublicIdKey);
    }
    if(encryptedMessage){
      signature = await signMessage(encryptedMessage.cipher);
    }

    const { user } = authStore.getState();
    const { emitMessage } = useSocketStore.getState();
    const message = {
      chatId: getSelectedChat()?._id ,
      sender: user?._id,
      receiver: getSelectedChatUser()?._id,
      cipher: encryptedMessage?.cipher,
      iv: encryptedMessage?.iv,
      signature,
      senderPublicIdKey: user?.publicIdKey,
      senderPublicSigningKey: user?.publicSigningKey,
      receiverPublicIdKey,
      timestamp: currentTime
    }
    emitMessage('sendMessage', message);
    set({newMessage: ''})
  },


  setNewMessage: (message: string) => {
    set({newMessage: message})
  },

  async fetchMessages(id) {
  if (id) {
    try {
      const res = await api.get(`/messages/${id}`);
      console.log("Messages fetched", res.data.data);
      const encryptedMessages = res.data.data;

      const { decryptMessage } = useCryptoStore.getState();
      const { user } = authStore.getState();

      const decryptedMessages = await Promise.all(
        encryptedMessages.map(async (message: EncryptedMessage) => {
          return {
            text: await decryptMessage(message),
            isSentByMe: message.sender === user?._id,
            timestamp: message.timestamp
          };
        })
      );

      console.log(decryptedMessages);
      set({ messages: decryptedMessages });
    } catch (err) {
      console.log("Error Fetching Messages", err);
    }
  }
},

  addReceivedMessage: (message) => {
    const messages = get().messages;
    const currentTime = new Date().toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
    set({
      messages: [
        ...messages,
        { text: message, isSentByMe: false, timestamp: currentTime },
      ]
    })
  }
}))