import { FileText, Lightbulb, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { type SourceRef } from '@/data/mockData';
import { documents } from '@/data/mockData';

interface Props {
  sources: SourceRef[];
}

export default function InsightsPanel({ sources }: Props) {
  return (
    <div className="flex flex-col h-full">
      <div className="p-3 border-b">
        <h2 className="text-sm font-semibold flex items-center gap-2">
          <Lightbulb className="h-4 w-4 text-primary" />
          Insights & Sources
        </h2>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-3 space-y-4">
          {/* Sources */}
          <AnimatePresence mode="popLayout">
            {sources.length > 0 ? (
              <>
                <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Referenced Sources</div>
                {sources.map((src, i) => {
                  const doc = documents.find((d) => d.id === src.docId);
                  return (
                    <motion.div
                      key={src.docId}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="glass rounded-xl p-3 space-y-2 cursor-pointer hover:border-primary/30 transition-colors"
                    >
                      <div className="flex items-start gap-2">
                        <FileText className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{src.docName}</p>
                          <p className="text-xs text-muted-foreground">Page {src.page}</p>
                        </div>
                        <ExternalLink className="h-3 w-3 text-muted-foreground shrink-0" />
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed italic">"{src.excerpt}"</p>
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 flex-1 rounded-full bg-secondary overflow-hidden">
                          <div className="h-full gradient-bg rounded-full" style={{ width: `${src.relevance * 100}%` }} />
                        </div>
                        <span className="text-xs font-mono text-muted-foreground">{Math.round(src.relevance * 100)}%</span>
                      </div>

                      {/* Metadata */}
                      {doc && (
                        <div className="flex flex-wrap gap-1 pt-1">
                          {doc.tags.map((tag) => (
                            <Badge key={tag} variant="secondary" className="text-[10px] px-1.5 py-0">{tag}</Badge>
                          ))}
                          <span className="text-[10px] text-muted-foreground ml-auto">{doc.pageCount} pages · {doc.size}</span>
                        </div>
                      )}
                    </motion.div>
                  );
                })}
              </>
            ) : (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-10">
                <Lightbulb className="h-8 w-8 mx-auto mb-2 text-muted-foreground/40" />
                <p className="text-sm text-muted-foreground">Ask a question to see relevant sources and insights here</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Key Insights */}
          {sources.length > 0 && (
            <div className="space-y-2">
              <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Key Insights</div>
              {['Market growth of 23% YoY indicates strong demand', 'AI solutions dominating enterprise sales at 38%', 'Knowledge platforms drive 2.7x productivity gains'].map((insight, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                  className="flex items-start gap-2 text-sm"
                >
                  <div className="h-2 w-2 rounded-full gradient-bg mt-1.5 shrink-0" />
                  <span>{insight}</span>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
