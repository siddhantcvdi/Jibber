import { MessageCircle } from 'lucide-react';

const EmptyChatState = () => {
  return (
    <div className="flex flex-col h-[100dvh] flex-1 dark:bg-background bg-muted shadow-lg p-2 pl-0  overflow-hidden">
      <div className='h-full flex'>
      <div className="flex-1 flex flex-col items-center justify-center p-8 bg-background dark:bg-muted/20 rounded-2xl shadow-lg">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 mx-auto mb-6 text-muted-foreground/40">
            <MessageCircle size={64} strokeWidth={1} />
          </div>
          <h3 className="text-xl font-semibold text-foreground mb-2">
            Welcome to Jibber
          </h3>
          <p className="text-muted-foreground text-sm leading-relaxed">
            Select a conversation from the sidebar to start chatting with your
            contacts. Your messages are end-to-end encrypted for privacy and
            security.
          </p>
        </div>
      </div>
      </div>

    </div>
  );
};

export default EmptyChatState;
