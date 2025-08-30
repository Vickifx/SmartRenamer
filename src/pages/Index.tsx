import React, { useState } from 'react';
import { FileUploadZone } from '@/components/FileUploadZone';
import { FileRenameList } from '@/components/FileRenameList';
import { RenameConfirmDialog } from '@/components/RenameConfirmDialog';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { isFilenameModified } from '@/utils/fileValidation';
import { RotateCcw, Play } from 'lucide-react';

const Index = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [hasValidationErrors, setHasValidationErrors] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const handleFilesSelected = (selectedFiles: File[]) => {
    setFiles(prev => [...prev, ...selectedFiles]);
    toast({
      title: "Files added",
      description: `${selectedFiles.length} files added to rename list`,
    });
  };

  const handleClearFiles = () => {
    setFiles([]);
    toast({
      title: "Files cleared",
      description: "All files removed from the list",
    });
  };

  const getModifiedFiles = () => {
    return files.filter(file => {
      // In a real app, we'd track the new names. For now, we'll simulate this.
      return Math.random() > 0.3; // Simulate some files being modified
    });
  };

  const handleRename = async () => {
    setIsProcessing(true);
    
    try {
      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // In a real app, this would actually rename the files
      toast({
        title: "Rename completed",
        description: `Successfully renamed ${getModifiedFiles().length} files`,
      });
      
      setShowConfirmDialog(false);
      setFiles([]);
    } catch (error) {
      toast({
        title: "Rename failed", 
        description: "An error occurred while renaming files",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const modifiedCount = getModifiedFiles().length;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                File Refactor Wizard
              </h1>
              <p className="text-sm text-muted-foreground">
                Batch rename files with ease
              </p>
            </div>
            
            {files.length > 0 && (
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleClearFiles}
                  className="gap-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  Clear All
                </Button>
                
                <Button
                  variant="default"
                  onClick={() => setShowConfirmDialog(true)}
                  disabled={hasValidationErrors || modifiedCount === 0}
                  className="gap-2 min-w-[120px]"
                >
                  <Play className="w-4 h-4" />
                  Rename {modifiedCount > 0 ? `(${modifiedCount})` : 'All'}
                </Button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto space-y-8">
          {files.length === 0 ? (
            <div className="min-h-[60vh] flex items-center justify-center">
              <FileUploadZone 
                onFilesSelected={handleFilesSelected} 
                hasFiles={false}
              />
            </div>
          ) : (
            <>
              <FileRenameList 
                files={files}
                onFilesChange={setFiles}
                onValidationChange={setHasValidationErrors}
              />
              
              <FileUploadZone 
                onFilesSelected={handleFilesSelected} 
                hasFiles={true}
              />
            </>
          )}
        </div>
      </main>

      {/* Confirm Dialog */}
      <RenameConfirmDialog
        isOpen={showConfirmDialog}
        onClose={() => setShowConfirmDialog(false)}
        onConfirm={handleRename}
        fileCount={files.length}
        modifiedCount={modifiedCount}
        isProcessing={isProcessing}
      />
    </div>
  );
};

export default Index;
