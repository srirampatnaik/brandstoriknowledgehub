import { useState } from "react";
import { uploadPDF, askQuestion } from "@/services/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FileText, X } from "lucide-react"; 

// Source Interface
interface Source {
  page_number: number;
  content: string;
}

// Message Interface
interface Message {
  type: "user" | "bot";
  text: string;
  sources?: Source[];
}

export default function ChatBot() {
  // CHANGE: Store an array of files, not just one
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);

  // Handle File Selection
  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files) {
      // Convert FileList to Array
      setSelectedFiles(Array.from(e.target.files));
    }
  }

  // Upload PDFs
  async function handleUpload() {
    if (selectedFiles.length === 0) {
      alert("Please select at least one PDF");
      return;
    }

    try {
      // CHANGE: Pass the array of files
      const res = await uploadPDF(selectedFiles);
      alert(`Success: ${res.message || "PDFs Uploaded & Indexed"}`);
      // Clear files after upload if you want, or keep them
      setSelectedFiles([]); 
    } catch (err) {
      console.error(err);
      alert("Upload failed. Check console.");
    }
  }

  // Ask AI
  async function handleAsk() {
    if (!question.trim()) return;

    setLoading(true);

    setMessages((prev) => [
      ...prev,
      { type: "user", text: question },
    ]);

    try {
      const res = await askQuestion(question);

      setMessages((prev) => [
        ...prev,
        {
          type: "bot",
          text: res.answer || "No response",
          sources: res.sources || [] 
        },
      ]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        { type: "bot", text: "Server error. Check backend console." },
      ]);
    }

    setQuestion("");
    setLoading(false);
  }

  return (
    <div className="flex flex-col h-full p-4 gap-3">

      {/* Upload Section */}
      <div className="flex flex-col gap-2 border-b pb-4">
        <div className="flex gap-2 items-center">
          <Input
            type="file"
            accept="application/pdf"
            multiple // CHANGE: Allow multiple files
            onChange={handleFileChange}
            className="bg-background"
          />
          <Button onClick={handleUpload} variant="secondary">
            Upload {selectedFiles.length > 0 && `(${selectedFiles.length})`}
          </Button>
        </div>
        
        {/* Show selected file names */}
        {selectedFiles.length > 0 && (
          <div className="text-xs text-muted-foreground flex flex-wrap gap-2">
            {selectedFiles.map((f, i) => (
              <span key={i} className="bg-muted px-2 py-1 rounded-md border">
                {f.name}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Chat Area */}
      <div className="flex-1 border rounded-md p-4 overflow-y-auto space-y-4 bg-muted/30">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`flex flex-col ${
              m.type === "user" ? "items-end" : "items-start"
            }`}
          >
            <div
              className={`max-w-[80%] rounded-lg p-3 ${
                m.type === "user"
                  ? "bg-primary text-primary-foreground"
                  : "bg-card border shadow-sm"
              }`}
            >
              <p className="text-sm leading-relaxed whitespace-pre-wrap">{m.text}</p>
            </div>

            {/* Display Sources */}
            {m.sources && m.sources.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-2 max-w-[80%]">
                {m.sources.map((src, idx) => (
                  <div
                    key={idx}
                    className="text-xs bg-background border px-2 py-1 rounded-md text-muted-foreground flex items-center gap-1 cursor-help"
                    title={src.content}
                  >
                    <FileText className="h-3 w-3" />
                    Page {src.page_number}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div className="flex items-center gap-2 text-muted-foreground text-sm">
            <div className="animate-pulse">●</div>
            Thinking...
          </div>
        )}
      </div>

      {/* Input */}
      <div className="flex gap-2">
        <Input
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Ask about your documents..."
          onKeyDown={(e) => e.key === "Enter" && handleAsk()}
        />
        <Button onClick={handleAsk}>Send</Button>
      </div>
    </div>
  );
}