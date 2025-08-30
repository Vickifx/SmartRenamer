import React, { useState, useEffect } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { 
  GripVertical, 
  File, 
  FileText, 
  FileImage, 
  FileVideo, 
  FileAudio,
  AlertTriangle,
  Check
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface FileListItemProps {
  file: File;
  newName: string;
  onNameChange: (newName: string) => void;
  id: string;
  isModified: boolean;
  isValid: boolean;
  error?: string;
}

const getFileIcon = (filename: string) => {
  const ext = filename.split('.').pop()?.toLowerCase();
  
  if (['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp'].includes(ext || '')) {
    return FileImage;
  }
  if (['mp4', 'avi', 'mov', 'wmv', 'flv'].includes(ext || '')) {
    return FileVideo;
  }
  if (['mp3', 'wav', 'aac', 'flac'].includes(ext || '')) {
    return FileAudio;
  }
  if (['txt', 'md', 'doc', 'docx', 'pdf'].includes(ext || '')) {
    return FileText;
  }
  return File;
};

export const FileListItem: React.FC<FileListItemProps> = ({
  file,
  newName,
  onNameChange,
  id,
  isModified,
  isValid,
  error
}) => {
  const [inputValue, setInputValue] = useState(newName);
  const [isFocused, setIsFocused] = useState(false);
  
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  useEffect(() => {
    setInputValue(newName);
  }, [newName]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleInputBlur = () => {
    setIsFocused(false);
    onNameChange(inputValue);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleInputBlur();
    }
  };

  const FileIcon = getFileIcon(file.name);

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`
        group flex items-center gap-6 p-6 bg-gradient-card backdrop-blur-sm rounded-2xl shadow-elevated border border-border/20 transition-all duration-300
        ${isDragging ? 'opacity-50 shadow-glow z-50 scale-105' : ''}
        ${isModified && !isFocused ? 'border-l-4 border-l-primary shadow-glow' : ''}
        ${!isValid && !isFocused ? 'border-l-4 border-l-destructive' : ''}
        hover:shadow-glow hover:scale-[1.02] hover:border-primary/30
      `}
    >
      {/* Drag Handle */}
      <Button
        variant="ghost"
        size="icon"
        className="cursor-grab active:cursor-grabbing opacity-40 group-hover:opacity-100 transition-all duration-300 hover:scale-110"
        {...attributes}
        {...listeners}
      >
        <GripVertical className="w-5 h-5" />
      </Button>

      {/* File Icon */}
      <div className="flex-shrink-0 p-2 bg-gradient-primary rounded-lg shadow-soft">
        <FileIcon className="w-6 h-6 text-white" />
      </div>

      {/* Original Name */}
      <div className="flex-1 min-w-0">
        <p className="text-base font-medium text-foreground truncate">
          {file.name}
        </p>
        <p className="text-sm text-muted-foreground font-medium">
          {(file.size / 1024).toFixed(1)} KB
        </p>
      </div>

      {/* Arrow */}
      <div className="flex-shrink-0 text-primary font-bold text-lg">
        →
      </div>

      {/* New Name Input */}
      <div className="flex-1 min-w-0 relative">
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onBlur={handleInputBlur}
          onFocus={() => setIsFocused(true)}
          onKeyPress={handleKeyPress}
          className={`
            w-full px-4 py-3 text-base font-medium bg-background border-2 rounded-xl transition-all duration-300
            focus:outline-none focus:ring-4 focus:ring-primary/20 focus:border-primary focus:shadow-glow
            ${!isValid && !isFocused ? 'border-destructive bg-destructive/5' : 'border-input hover:border-primary/40'}
          `}
          placeholder="Enter new name..."
        />
        
        {/* Validation Indicator */}
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
          {!isFocused && (
            <>
              {isValid && isModified && (
                <div className="w-6 h-6 bg-success rounded-full flex items-center justify-center animate-scale-bounce">
                  <Check className="w-4 h-4 text-white" />
                </div>
              )}
              {!isValid && (
                <div className="w-6 h-6 bg-destructive rounded-full flex items-center justify-center animate-scale-bounce">
                  <AlertTriangle className="w-4 h-4 text-white" />
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Error Message */}
      {error && !isFocused && (
        <div className="absolute top-full left-6 right-6 mt-2 p-3 bg-destructive/10 border border-destructive/20 rounded-xl text-sm text-destructive animate-fade-in font-medium">
          {error}
        </div>
      )}
    </div>
  );
};