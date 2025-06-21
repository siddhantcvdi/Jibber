import {create} from 'zustand'

interface MessageStore{
  messages: [],
  sendMessage: () => Promise<void>,
  getMessagesWithUserIds: (id1: string, id2: string) => Promise<void>,
}

const useMessageStore = create<MessageStore>(()=>({
  messages: [],
  sendMessage: async () => {
    
  },
  async getMessagesWithUserIds(id1, id2) {
      
  },
}))

export default useMessageStore