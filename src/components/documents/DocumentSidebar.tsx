import { useState } from 'react';
import { Search, Upload, FolderOpen, Folder, ChevronRight, ChevronDown, FileText, CheckCircle2, Clock, XCircle, Tag } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { folders, documents, type Document } from '@/data/mockData';
import UploadModal from './UploadModal';

const allTags = [...new Set(documents.flatMap((d) => d.tags))];

const statusConfig = {
  indexed: { icon: CheckCircle2, label: 'Indexed', className: 'text-success' },
  processing: { icon: Clock, label: 'Processing', className: 'text-warning' },
  failed: { icon: XCircle, label: 'Failed', className: 'text-destructive' },
};

export default function DocumentSidebar() {
  const [search, setSearch] = useState('');
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set(['f1', 'f2']));
  const [selectedTags, setSelectedTags] = useState<Set<string>>(new Set());
  const [showUpload, setShowUpload] = useState(false);

  const toggleFolder = (id: string) => {
    setExpandedFolders((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) => {
      const next = new Set(prev);
      next.has(tag) ? next.delete(tag) : next.add(tag);
      return next;
    });
  };

  const filteredDocs = documents.filter((d) => {
    const matchSearch = d.name.toLowerCase().includes(search.toLowerCase());
    const matchTags = selectedTags.size === 0 || d.tags.some((t) => selectedTags.has(t));
    return matchSearch && matchTags;
  });

  const rootFolders = folders.filter((f) => !f.parentId);
  const getChildren = (parentId: string) => folders.filter((f) => f.parentId === parentId);
  const getDocsInFolder = (folderId: string) => filteredDocs.filter((d) => d.folderId === folderId);

  const renderFolder = (folder: (typeof folders)[0], depth = 0) => {
    const isExpanded = expandedFolders.has(folder.id);
    const children = getChildren(folder.id);
    const docs = getDocsInFolder(folder.id);
    const childFolderDocs = children.flatMap((c) => getDocsInFolder(c.id));
    const totalDocs = docs.length + childFolderDocs.length;

    return (
      <div key={folder.id}>
        <button
          onClick={() => toggleFolder(folder.id)}
          className="w-full flex items-center gap-2 px-3 py-1.5 text-sm hover:bg-secondary/60 rounded-md transition-colors"
          style={{ paddingLeft: `${12 + depth * 16}px` }}
        >
          {isExpanded ? <ChevronDown className="h-3 w-3 text-muted-foreground shrink-0" /> : <ChevronRight className="h-3 w-3 text-muted-foreground shrink-0" />}
          {isExpanded ? <FolderOpen className="h-4 w-4 text-primary shrink-0" /> : <Folder className="h-4 w-4 text-muted-foreground shrink-0" />}
          <span className="truncate flex-1 text-left">{folder.name}</span>
          <span className="text-xs text-muted-foreground">{totalDocs}</span>
        </button>
        <AnimatePresence>
          {isExpanded && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.15 }}>
              {children.map((c) => renderFolder(c, depth + 1))}
              {docs.map((doc) => renderDocItem(doc, depth + 1))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  const renderDocItem = (doc: Document, depth = 0) => {
    const StatusIcon = statusConfig[doc.status].icon;
    return (
      <div
        key={doc.id}
        className="flex items-center gap-2 px-3 py-1.5 text-sm hover:bg-secondary/60 rounded-md cursor-pointer transition-colors"
        style={{ paddingLeft: `${28 + depth * 16}px` }}
      >
        <FileText className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
        <span className="truncate flex-1">{doc.name}</span>
        <StatusIcon className={`h-3.5 w-3.5 shrink-0 ${statusConfig[doc.status].className}`} />
      </div>
    );
  };

  return (
    <>
      <div className="flex flex-col h-full">
        {/* Search & Upload */}
        <div className="p-3 space-y-2 border-b">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search documents…" value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 h-9 text-sm" />
          </div>
          <Button onClick={() => setShowUpload(true)} className="w-full gradient-bg text-primary-foreground h-9 text-sm font-medium">
            <Upload className="h-4 w-4 mr-2" /> Upload PDF
          </Button>
        </div>

        {/* Tags */}
        <div className="px-3 py-2 border-b">
          <div className="flex items-center gap-1 mb-1.5">
            <Tag className="h-3 w-3 text-muted-foreground" />
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Tags</span>
          </div>
          <div className="flex flex-wrap gap-1">
            {allTags.map((tag) => (
              <Badge
                key={tag}
                variant={selectedTags.has(tag) ? 'default' : 'secondary'}
                className="cursor-pointer text-xs px-2 py-0"
                onClick={() => toggleTag(tag)}
              >
                {tag}
              </Badge>
            ))}
          </div>
        </div>

        {/* Folder tree */}
        <ScrollArea className="flex-1">
          <div className="p-2 space-y-0.5">
            {rootFolders.map((f) => renderFolder(f))}
          </div>
        </ScrollArea>

        {/* Doc count */}
        <div className="px-3 py-2 border-t text-xs text-muted-foreground">
          {filteredDocs.length} document{filteredDocs.length !== 1 ? 's' : ''}
        </div>
      </div>

      <UploadModal open={showUpload} onOpenChange={setShowUpload} />
    </>
  );
}
