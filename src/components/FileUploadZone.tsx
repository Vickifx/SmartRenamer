import React, { useState } from 'react';
import { Upload, FolderOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface FileUploadZoneProps {
  onFilesSelected: (files: File[]) => void;
  hasFiles: boolean;
}

export const FileUploadZone: React.FC<FileUploadZoneProps> = ({ onFilesSelected, hasFiles }) => {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      onFilesSelected(files);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      onFilesSelected(files);
    }
    // Reset input to allow selecting the same files again
    e.target.value = '';
  };

  const openFileDialog = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.multiple = true;
    input.onchange = (e) => handleFileInput(e as any);
    input.click();
  };

  if (hasFiles) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <Button 
          variant="floating" 
          size="icon" 
          className="w-14 h-14 animate-bounce-in"
          onClick={openFileDialog}
        >
          <FolderOpen className="w-6 h-6" />
        </Button>
      </div>
    );
  }

  return (
    <div
      className={`
        border-2 border-dashed rounded-2xl p-16 text-center transition-all duration-500
        ${isDragOver 
          ? 'border-primary bg-gradient-to-br from-primary/10 to-accent/5 shadow-glow transform scale-[1.02]' 
          : 'border-border hover:border-primary/60 hover:bg-gradient-to-br hover:from-primary/5 hover:to-accent/5 hover:shadow-soft'
        }
      `}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="space-y-6">
        <div className="w-20 h-20 mx-auto bg-gradient-primary rounded-full flex items-center justify-center shadow-glow animate-bounce-in">
          <Upload className="w-9 h-9 text-white" />
        </div>
        
        <div className="space-y-3">
          <h3 className="text-2xl font-bold text-foreground">
            Select Files to Rename
          </h3>
          <p className="text-muted-foreground leading-relaxed">
            Drag and drop files here, or click to browse your device
          </p>
        </div>
        
        <Button 
          variant="default" 
          onClick={openFileDialog}
          className="mt-8 text-base"
          size="lg"
        >
          Choose Files
        </Button>
      </div>
    </div>
  );
};