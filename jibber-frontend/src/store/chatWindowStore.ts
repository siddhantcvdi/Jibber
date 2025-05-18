import {create} from 'zustand';

type ChatWindowStore = {
    chatWindow: {
        id: string;
        name: string;
        icon: string;
    } | null;
    setChatWindow: (chatWindow: {
        id: string;
        name: string;
        icon: string;
    } | null) => void;
    };

const useChatWindowStore = create<ChatWindowStore>((set) => ({
    chatWindow: null,
    setChatWindow: (chatWindow) => set({ chatWindow }),
}));

export default useChatWindowStore;