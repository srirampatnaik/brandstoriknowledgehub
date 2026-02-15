import { motion } from 'framer-motion';
import { User, Sparkles } from 'lucide-react';
import { type ChatMessage } from '@/data/mockData';

interface Props {
  message: ChatMessage;
  isStreaming?: boolean;
}

export default function ChatMessageBubble({ message, isStreaming }: Props) {
  const isUser = message.role === 'user';
  const time = new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className={`flex gap-3 ${isUser ? 'flex-row-reverse' : ''}`}
    >
      {/* Avatar */}
      <div className={`h-8 w-8 rounded-full shrink-0 flex items-center justify-center ${
        isUser ? 'bg-secondary' : 'gradient-bg'
      }`}>
        {isUser ? <User className="h-4 w-4 text-secondary-foreground" /> : <Sparkles className="h-4 w-4 text-primary-foreground" />}
      </div>

      {/* Bubble */}
      <div className={`max-w-[80%] ${isUser ? 'text-right' : ''}`}>
        <div className={`rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
          isUser
            ? 'bg-primary text-primary-foreground rounded-tr-sm'
            : 'glass rounded-tl-sm'
        }`}>
          {isUser ? (
            <p>{message.content}</p>
          ) : (
            <div className="prose prose-sm dark:prose-invert max-w-none [&>p]:mb-2 [&>ol]:mb-2 [&>ul]:mb-2">
              {message.content.split('\n').map((line, i) => {
                // Bold text
                const parts = line.split(/(\*\*[^*]+\*\*)/g).map((part, j) => {
                  if (part.startsWith('**') && part.endsWith('**')) {
                    return <strong key={j}>{part.slice(2, -2)}</strong>;
                  }
                  return <span key={j}>{part}</span>;
                });
                return <p key={i} className={line === '' ? 'h-2' : ''}>{parts}</p>;
              })}
              {isStreaming && (
                <span className="inline-flex gap-1 ml-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary animate-typing-dot" style={{ animationDelay: '0ms' }} />
                  <span className="h-1.5 w-1.5 rounded-full bg-primary animate-typing-dot" style={{ animationDelay: '200ms' }} />
                  <span className="h-1.5 w-1.5 rounded-full bg-primary animate-typing-dot" style={{ animationDelay: '400ms' }} />
                </span>
              )}
            </div>
          )}
        </div>
        <p className="text-xs text-muted-foreground mt-1 px-1">{time}</p>
      </div>
    </motion.div>
  );
}
