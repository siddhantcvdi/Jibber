import { handleSocketConnection } from '@/socket/handlers/connection';
import { registerMessageHandlers } from '@/socket/handlers/message.handler';
import { registerChatHandlers } from '@/socket/handlers/chat.handler';

export {
  handleSocketConnection,
  registerMessageHandlers,
  registerChatHandlers,
};
