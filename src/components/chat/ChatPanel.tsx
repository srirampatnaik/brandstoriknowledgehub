import { useState, useRef, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { initialMessages, type ChatMessage, type SourceRef } from '@/data/mockData';
import { askQuestion } from '@/services/api';
import ChatMessageBubble from './ChatMessage';
import ChatInput from './ChatInput';

interface Props {
  onSourcesUpdate: (sources: SourceRef[]) => void;
}

export default function ChatPanel({ onSourcesUpdate }: Props) {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [streamingText, setStreamingText] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, streamingText]);

  const handleSend = useCallback(async (text: string) => {
    const userMsg: ChatMessage = {
      id: `m${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);
    setStreamingText('');

    // Small delay then start streaming
    setTimeout(async () => {
      setIsLoading(false);
      setIsStreaming(true);
      let accumulated = '';

      await askQuestion(
        text,
        (char) => {
          accumulated += char;
          setStreamingText(accumulated);
        },
        (sources) => {
          onSourcesUpdate(sources);
        }
      );

      // Finalize message
      const assistantMsg: ChatMessage = {
        id: `m${Date.now()}`,
        role: 'assistant',
        content: accumulated,
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, assistantMsg]);
      setStreamingText('');
      setIsStreaming(false);
    }, 600);
  }, [onSourcesUpdate]);

  return (
    <div className="flex flex-col h-full">
      <ScrollArea className="flex-1 px-4">
        <div className="max-w-3xl mx-auto py-6 space-y-4">
          {messages.map((msg) => (
            <ChatMessageBubble key={msg.id} message={msg} />
          ))}

          {isLoading && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex gap-3">
              <div className="h-8 w-8 rounded-full gradient-bg shrink-0" />
              <div className="space-y-2 flex-1 max-w-md">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            </motion.div>
          )}

          {isStreaming && streamingText && (
            <ChatMessageBubble
              message={{ id: 'streaming', role: 'assistant', content: streamingText, timestamp: new Date().toISOString() }}
              isStreaming
            />
          )}

          <div ref={bottomRef} />
        </div>
      </ScrollArea>

      <ChatInput onSend={handleSend} disabled={isStreaming || isLoading} />
    </div>
  );
}
