export interface Message {
  text: string;
  isSentByMe: boolean;
  timestamp: string;
}

export interface Contact {
  id: string;
  name: string; // username
  icon: string;
  isOnline: boolean;
  lastChatText: string;
  time: string;
  unread?: number;
  messages: Message[];
}

// Mock data for contacts and their messages
export const contactsData: Contact[] = [
  {
    id: '1234',
    name: 'siddhantcvdi',
    icon: 'https://plus.unsplash.com/premium_photo-1689568126014-06fea9d5d341?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8cHJvZmlsZXxlbnwwfHwwfHx8MA%3D%3D',
    isOnline: true,
    lastChatText: "Yes, I'll be there in 5 minutes",
    time: '11:45 AM',
    unread: 0,
    messages: [
      {
        text: "Hey! How's the project going?",
        isSentByMe: false,
        timestamp: '11:30 AM',
      },
      {
        text: "It's going well! Just finished the authentication pages.",
        isSentByMe: true,
        timestamp: '11:32 AM',
      },
      {
        text: "That's awesome! When can I test it?",
        isSentByMe: false,
        timestamp: '11:33 AM',
      },
      {
        text: "I'll deploy it later today. Will send you the link.",
        isSentByMe: true,
        timestamp: '11:35 AM',
      },
      {
        text: 'Perfect! Looking forward to it.',
        isSentByMe: false,
        timestamp: '11:40 AM',
      },
      {
        text: "Yes, I'll be there in 5 minutes",
        isSentByMe: true,
        timestamp: '11:45 AM',
      },
    ],
  },
  {
    id: '4567',
    name: 'donaldduck',
    icon: 'https://images.moneycontrol.com/static-mcnews/2024/12/20241211112438_BeFunky-collage-2024-12-11T165424.810.jpg?impolicy=website&width=770&height=431',
    isOnline: true,
    lastChatText:
      'That sounds really interesting! Can you tell me more about it?',
    time: '10:35 AM',
    unread: 2,
    messages: [
      { text: 'Hello, how are you?', isSentByMe: false, timestamp: '10:30 AM' },
      {
        text: "I'm good, thanks! How about you?",
        isSentByMe: true,
        timestamp: '10:31 AM',
      },
      { text: "I'm doing well too!", isSentByMe: false, timestamp: '10:31 AM' },
      {
        text: 'What have you been up to lately?',
        isSentByMe: false,
        timestamp: '10:32 AM',
      },
      {
        text: "Just working on a new project. It's a messaging app with end-to-end encryption.",
        isSentByMe: true,
        timestamp: '10:34 AM',
      },
      {
        text: 'That sounds really interesting! Can you tell me more about it?',
        isSentByMe: false,
        timestamp: '10:35 AM',
      },
    ],
  },
  {
    id: '8901',
    name: 'joewho',
    icon: 'https://www.thoughtco.com/thmb/naT2Yc0Z1u0kz37osn29jkOSm-g=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/GettyImages-1055820900-ed9e56a18e5e464e8b00620f1174dbfa.jpg',
    isOnline: false,
    lastChatText: "Where am I? I don't remember...",
    time: 'Yesterday',
    unread: 1,
    messages: [
      {
        text: 'Hey, do you remember where we parked?',
        isSentByMe: false,
        timestamp: 'Yesterday 3:45 PM',
      },
      {
        text: 'I think it was near the mall entrance',
        isSentByMe: true,
        timestamp: 'Yesterday 3:47 PM',
      },
      {
        text: "Where am I? I don't remember...",
        isSentByMe: false,
        timestamp: 'Yesterday 3:50 PM',
      },
    ],
  },
  {
    id: '5678',
    name: 'alicethompson',
    icon: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8dXNlcnxlbnwwfHwwfHx8MA%3D%3D',
    isOnline: false,
    lastChatText: 'Thanks for the information!',
    time: 'Tuesday',
    unread: 0,
    messages: [
      {
        text: 'Can you send me the meeting notes?',
        isSentByMe: false,
        timestamp: 'Tuesday 2:15 PM',
      },
      {
        text: "Sure! I'll email them to you right now.",
        isSentByMe: true,
        timestamp: 'Tuesday 2:17 PM',
      },
      {
        text: 'Thanks for the information!',
        isSentByMe: false,
        timestamp: 'Tuesday 2:20 PM',
      },
    ],
  },
];

export const findContactById = (id: string): Contact | undefined => {
  return contactsData.find((contact) => contact.id === id);
};
