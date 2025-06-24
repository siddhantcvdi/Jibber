import {create} from 'zustand'
import api from "@/services/api.ts";
import useCryptoStore from '@/store/crypto.store.ts';
import { useChatStore } from '@/store/chats.store.ts';

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
    const {encryptMessage, signMessage, base64toRaw} = useCryptoStore.getState()
    const {getSelectedChatUser} = useChatStore.getState()
    const recipientPublicIdKey = getSelectedChatUser()?.publicIdKey;
    let encryptedMessage, signedMessage;
    if(recipientPublicIdKey){
      encryptedMessage = await encryptMessage(newMessage, base64toRaw(recipientPublicIdKey));
    }
    if(encryptedMessage){
      signedMessage = await signMessage(encryptedMessage);
    }
    console.log(signedMessage);
    set({newMessage: ''})
  },
  setNewMessage: (message: string) => {
    set({newMessage: message})
  },

  async fetchMessages(id){
    if(id) {
      api.get(`/messages/${id}`)
          .then((res) => {
            console.log("Messages fetched", res.data.data);
            set({messages: res.data.data})
          })
          .catch(err => {
            console.log("Error Fetching Messages", err);
          })
    }
  }
}))