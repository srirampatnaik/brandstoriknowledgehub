import { useState } from 'react';
import { PanelLeftClose, PanelLeftOpen, PanelRightClose, PanelRightOpen, History } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import Header from '@/components/layout/Header';
import DocumentSidebar from '@/components/documents/DocumentSidebar';
import ChatPanel from '@/components/chat/ChatPanel';
import InsightsPanel from '@/components/insights/InsightsPanel';
import ConversationHistory from '@/components/chat/ConversationHistory';
import { type SourceRef } from '@/data/mockData';

export default function Index() {
  const [leftOpen, setLeftOpen] = useState(true);
  const [rightOpen, setRightOpen] = useState(true);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [sources, setSources] = useState<SourceRef[]>([]);
  const [activeConv, setActiveConv] = useState('c1');

  return (
    <div className="h-screen flex flex-col bg-background">
      <Header />

      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar — Document Library */}
        <AnimatePresence>
          {leftOpen && (
            <motion.aside
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 280, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="border-r bg-card overflow-hidden shrink-0"
            >
              <DocumentSidebar />
            </motion.aside>
          )}
        </AnimatePresence>

        {/* Conversation History */}
        <AnimatePresence>
          {historyOpen && (
            <motion.aside
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 240, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden shrink-0 bg-card"
            >
              <ConversationHistory activeId={activeConv} onSelect={setActiveConv} />
            </motion.aside>
          )}
        </AnimatePresence>

        {/* Center — Chat */}
        <main className="flex-1 flex flex-col min-w-0 relative">
          {/* Toolbar */}
          <div className="flex items-center gap-1 px-2 py-1.5 border-b">
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setLeftOpen(!leftOpen)}>
              {leftOpen ? <PanelLeftClose className="h-4 w-4" /> : <PanelLeftOpen className="h-4 w-4" />}
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setHistoryOpen(!historyOpen)}>
              <History className="h-4 w-4" />
            </Button>
            <div className="flex-1" />
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setRightOpen(!rightOpen)}>
              {rightOpen ? <PanelRightClose className="h-4 w-4" /> : <PanelRightOpen className="h-4 w-4" />}
            </Button>
          </div>

          <ChatPanel onSourcesUpdate={setSources} />
        </main>

        {/* Right Panel — Insights */}
        <AnimatePresence>
          {rightOpen && (
            <motion.aside
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 320, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="border-l bg-card overflow-hidden shrink-0"
            >
              <InsightsPanel sources={sources} />
            </motion.aside>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
