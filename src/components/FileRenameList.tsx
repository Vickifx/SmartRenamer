import React, { useState, useEffect } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { FileListItem } from './FileListItem';
import { validateFilename, preserveExtension, isFilenameModified } from '@/utils/fileValidation';

interface FileItem {
  file: File;
  newName: string;
  id: string;
}

interface FileRenameListProps {
  files: File[];
  onFilesChange: (files: File[]) => void;
  onValidationChange: (hasErrors: boolean) => void;
}

export const FileRenameList: React.FC<FileRenameListProps> = ({
  files,
  onFilesChange,
  onValidationChange
}) => {
  const [fileItems, setFileItems] = useState<FileItem[]>([]);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Initialize file items when files change
  useEffect(() => {
    const newFileItems = files.map((file, index) => ({
      file,
      newName: file.name,
      id: `file-${index}-${file.name}`,
    }));
    setFileItems(newFileItems);
  }, [files]);

  // Validate all files and update parent
  useEffect(() => {
    const errors: Record<string, string> = {};
    
    fileItems.forEach(item => {
      const validation = validateFilename(item.newName);
      if (!validation.isValid) {
        errors[item.id] = validation.error || 'Invalid filename';
      }
    });

    setValidationErrors(errors);
    onValidationChange(Object.keys(errors).length > 0);
  }, [fileItems, onValidationChange]);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setFileItems((items) => {
        const oldIndex = items.findIndex(item => item.id === active.id);
        const newIndex = items.findIndex(item => item.id === over.id);

        const newItems = arrayMove(items, oldIndex, newIndex);
        
        // Update the files order in parent
        const newFiles = newItems.map(item => item.file);
        onFilesChange(newFiles);
        
        return newItems;
      });
    }
  };

  const handleNameChange = (id: string, newName: string) => {
    setFileItems(items =>
      items.map(item =>
        item.id === id
          ? { ...item, newName: preserveExtension(item.file.name, newName) }
          : item
      )
    );
  };

  const getModifiedCount = () => {
    return fileItems.filter(item => 
      isFilenameModified(item.file.name, item.newName)
    ).length;
  };

  const getValidCount = () => {
    return fileItems.filter(item => 
      validateFilename(item.newName).isValid
    ).length;
  };

  if (fileItems.length === 0) {
    return null;
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Stats Header */}
      <div className="flex items-center justify-between p-6 bg-gradient-glass backdrop-blur-sm rounded-2xl border border-border/20 shadow-elevated">
        <div className="space-y-2">
          <h2 className="text-xl font-bold text-foreground">
            File Rename List
          </h2>
          <p className="text-sm text-muted-foreground font-medium">
            {fileItems.length} files • {getModifiedCount()} modified • {getValidCount()} valid
          </p>
        </div>
        
        <div className="text-right text-xs text-muted-foreground space-y-1 font-medium">
          <p>Drag to reorder</p>
          <p>Click names to edit</p>
        </div>
      </div>

      {/* File List */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={fileItems.map(item => item.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-3">
            {fileItems.map((item) => {
              const validation = validateFilename(item.newName);
              const isModified = isFilenameModified(item.file.name, item.newName);
              
              return (
                <FileListItem
                  key={item.id}
                  id={item.id}
                  file={item.file}
                  newName={item.newName}
                  onNameChange={(newName) => handleNameChange(item.id, newName)}
                  isModified={isModified}
                  isValid={validation.isValid}
                  error={validationErrors[item.id]}
                />
              );
            })}
          </div>
        </SortableContext>
      </DndContext>

      {/* Helper Text */}
      <div className="p-6 bg-gradient-to-r from-primary/5 to-accent/5 rounded-2xl border border-primary/20 shadow-soft">
        <p className="text-sm text-muted-foreground leading-relaxed">
          <strong className="text-foreground">Tips:</strong> File extensions are automatically preserved. 
          Avoid special characters like {`< > : " / \\ | ? *`}. 
          Maximum filename length is 255 characters.
        </p>
      </div>
    </div>
  );
};