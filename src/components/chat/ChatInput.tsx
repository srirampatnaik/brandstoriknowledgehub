import { useState, useRef } from 'react';
import { Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

interface Props {
  onSend: (text: string) => void;
  disabled?: boolean;
}

export default function ChatInput({ onSend, disabled }: Props) {
  const [value, setValue] = useState('');
  const ref = useRef<HTMLTextAreaElement>(null);

  const send = () => {
    const text = value.trim();
    if (!text || disabled) return;
    onSend(text);
    setValue('');
    ref.current?.focus();
  };

  return (
    <div className="border-t p-4">
      <div className="max-w-3xl mx-auto relative">
        <Textarea
          ref={ref}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); } }}
          placeholder="Ask about your documents…"
          className="min-h-[52px] max-h-32 resize-none pr-12 rounded-xl text-sm"
          disabled={disabled}
          rows={1}
        />
        <Button
          size="icon"
          onClick={send}
          disabled={disabled || !value.trim()}
          className="absolute right-2 bottom-2 h-8 w-8 rounded-lg gradient-bg text-primary-foreground"
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
      <p className="text-center text-xs text-muted-foreground mt-2">Press Enter to send · Shift+Enter for new line</p>
    </div>
  );
}
