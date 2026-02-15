import { useState, useCallback } from 'react';
import { Upload, FileText, X, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { uploadDocument } from '@/services/api';
import { useToast } from '@/hooks/use-toast';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function UploadModal({ open, onOpenChange }: Props) {
  const [dragOver, setDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);
  const [fileName, setFileName] = useState('');
  const { toast } = useToast();

  const handleFile = useCallback(async (file: File) => {
    if (!file.name.endsWith('.pdf')) {
      toast({ title: 'Invalid file', description: 'Only PDF files are supported.', variant: 'destructive' });
      return;
    }
    setFileName(file.name);
    setUploading(true);
    setProgress(0);
    setDone(false);
    try {
      await uploadDocument(file, setProgress);
      setDone(true);
      toast({ title: 'Upload complete', description: `${file.name} is now being indexed.` });
    } catch {
      toast({ title: 'Upload failed', description: 'Please try again.', variant: 'destructive' });
    } finally {
      setUploading(false);
    }
  }, [toast]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, [handleFile]);

  const reset = () => { setDone(false); setProgress(0); setFileName(''); };

  return (
    <Dialog open={open} onOpenChange={(v) => { onOpenChange(v); if (!v) reset(); }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Upload Document</DialogTitle>
        </DialogHeader>

        {!uploading && !done && (
          <div
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-colors ${
              dragOver ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
            }`}
            onClick={() => {
              const input = document.createElement('input');
              input.type = 'file';
              input.accept = '.pdf';
              input.onchange = (e) => {
                const file = (e.target as HTMLInputElement).files?.[0];
                if (file) handleFile(file);
              };
              input.click();
            }}
          >
            <Upload className="h-10 w-10 mx-auto mb-3 text-muted-foreground" />
            <p className="font-medium">Drop a PDF here or click to browse</p>
            <p className="text-sm text-muted-foreground mt-1">Max 50MB per file</p>
          </div>
        )}

        {uploading && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4 py-4">
            <div className="flex items-center gap-3">
              <FileText className="h-8 w-8 text-primary shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{fileName}</p>
                <p className="text-xs text-muted-foreground">Uploading…</p>
              </div>
              <span className="text-sm font-mono text-muted-foreground">{progress}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </motion.div>
        )}

        {done && (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-6">
            <CheckCircle2 className="h-12 w-12 mx-auto mb-3 text-success" />
            <p className="font-medium">Upload Successful</p>
            <p className="text-sm text-muted-foreground mt-1">{fileName} is being indexed</p>
            <div className="flex gap-2 mt-4 justify-center">
              <Button variant="outline" size="sm" onClick={reset}>Upload another</Button>
              <Button size="sm" onClick={() => onOpenChange(false)}>Done</Button>
            </div>
          </motion.div>
        )}
      </DialogContent>
    </Dialog>
  );
}
