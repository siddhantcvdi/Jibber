export interface EncryptedMessage{
  chatId: string,
  sender: string,
  receiver: string,
  cipher: string,
  iv: string,
  senderPublicIdKey: string,
  senderPublicSigningKey: string,
  receiverPublicIdKey: string,
  timestamp: string
}

