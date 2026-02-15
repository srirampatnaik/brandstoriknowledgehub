import { MessageSquare, Plus } from 'lucide-react';
import { motion } from 'framer-motion';
import { conversations } from '@/data/mockData';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

interface Props {
  activeId: string;
  onSelect: (id: string) => void;
}

export default function ConversationHistory({ activeId, onSelect }: Props) {
  return (
    <div className="flex flex-col h-full border-r">
      <div className="p-3 border-b flex items-center justify-between">
        <h3 className="text-sm font-semibold">History</h3>
        <Button variant="ghost" size="icon" className="h-7 w-7">
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      <ScrollArea className="flex-1">
        <div className="p-2 space-y-1">
          {conversations.map((conv) => (
            <motion.button
              key={conv.id}
              whileHover={{ x: 2 }}
              onClick={() => onSelect(conv.id)}
              className={`w-full text-left p-2.5 rounded-lg text-sm transition-colors ${
                activeId === conv.id ? 'bg-primary/10 text-primary' : 'hover:bg-secondary'
              }`}
            >
              <div className="flex items-center gap-2">
                <MessageSquare className="h-3.5 w-3.5 shrink-0" />
                <span className="truncate font-medium">{conv.title}</span>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5 truncate pl-5">{conv.lastMessage}</p>
              <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1 pl-5">
                <span>{conv.date}</span>
                <span>·</span>
                <span>{conv.messageCount} msgs</span>
              </div>
            </motion.button>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
