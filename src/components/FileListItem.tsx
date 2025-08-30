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
        group flex items-center gap-4 p-4 bg-card rounded-lg shadow-card border transition-all duration-200
        ${isDragging ? 'opacity-50 shadow-elevated z-50' : ''}
        ${isModified && !isFocused ? 'border-l-4 border-l-primary' : ''}
        ${!isValid && !isFocused ? 'border-l-4 border-l-destructive' : ''}
        hover:shadow-elevated
      `}
    >
      {/* Drag Handle */}
      <Button
        variant="ghost"
        size="icon"
        className="cursor-grab active:cursor-grabbing opacity-40 group-hover:opacity-100 transition-opacity"
        {...attributes}
        {...listeners}
      >
        <GripVertical className="w-4 h-4" />
      </Button>

      {/* File Icon */}
      <div className="flex-shrink-0">
        <FileIcon className="w-5 h-5 text-muted-foreground" />
      </div>

      {/* Original Name */}
      <div className="flex-1 min-w-0">
        <p className="text-sm text-muted-foreground truncate">
          {file.name}
        </p>
        <p className="text-xs text-muted-foreground/70">
          {(file.size / 1024).toFixed(1)} KB
        </p>
      </div>

      {/* Arrow */}
      <div className="flex-shrink-0 text-muted-foreground">
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
            w-full px-3 py-2 text-sm bg-background border rounded-md transition-all duration-200
            focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary
            ${!isValid && !isFocused ? 'border-destructive bg-destructive/5' : 'border-input'}
          `}
          placeholder="Enter new name..."
        />
        
        {/* Validation Indicator */}
        <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
          {!isFocused && (
            <>
              {isValid && isModified && (
                <Check className="w-4 h-4 text-success" />
              )}
              {!isValid && (
                <AlertTriangle className="w-4 h-4 text-destructive" />
              )}
            </>
          )}
        </div>
      </div>

      {/* Error Message */}
      {error && !isFocused && (
        <div className="absolute top-full left-4 right-4 mt-1 p-2 bg-destructive/10 border border-destructive/20 rounded text-xs text-destructive animate-fade-in">
          {error}
        </div>
      )}
    </div>
  );
};