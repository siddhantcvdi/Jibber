export interface EncryptedMessage{
  chatId: string,
  senderId: string,
  receiverId: string,
  cipher: string,
  iv: string,
  senderPublicIdKey: string,
  senderPublicSigningKey: string,
  receiverPublicIdKey: string,
  timestamp: string
}

export interface SearchUser {
  _id: string
  username: string;
  email: string;
  profilePhoto?: string;
}

export interface RegisterData {
  username: string;
  password: string;
  email: string;
}

export interface LoginData {
  usernameOrEmail: string;
  password: string;
}

export interface User {
  _id: string;
  username: string;
  email: string;
  encPrivateIdKey: string,
  encPrivateSigningKey: string,
  publicIdKey: string,
  publicSigningKey: string,
  idKeyNonce: string,
  signingKeyNonce: string,
  idKeySalt: string,
  signingKeySalt: string,
  profilePhoto: string,
}

export interface Message {
  text: string;
  isSentByMe: boolean;
  timestamp: string;
}

export interface GroupedMessage extends Message {
  showTimestamp: boolean;
}
