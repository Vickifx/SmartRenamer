import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { FileText, AlertTriangle, CheckCircle } from 'lucide-react';

interface RenameConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  fileCount: number;
  modifiedCount: number;
  isProcessing: boolean;
}

export const RenameConfirmDialog: React.FC<RenameConfirmDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  fileCount,
  modifiedCount,
  isProcessing
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary" />
            Confirm Batch Rename
          </DialogTitle>
          <DialogDescription className="space-y-3 pt-2">
            <div className="flex items-start gap-3 p-3 bg-accent/10 rounded-lg">
              <CheckCircle className="w-5 h-5 text-success mt-0.5" />
              <div>
                <p className="font-medium text-foreground">Ready to rename</p>
                <p className="text-sm text-muted-foreground">
                  {modifiedCount} out of {fileCount} files will be renamed
                </p>
              </div>
            </div>

            {modifiedCount === 0 && (
              <div className="flex items-start gap-3 p-3 bg-warning/10 rounded-lg border border-warning/20">
                <AlertTriangle className="w-5 h-5 text-warning mt-0.5" />
                <div>
                  <p className="font-medium text-foreground">No changes detected</p>
                  <p className="text-sm text-muted-foreground">
                    None of the files have been modified
                  </p>
                </div>
              </div>
            )}

            <p className="text-sm text-muted-foreground">
              This action cannot be undone. Please make sure the new filenames are correct.
            </p>
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isProcessing}
          >
            Cancel
          </Button>
          <Button
            variant="default"
            onClick={onConfirm}
            disabled={isProcessing || modifiedCount === 0}
            className="min-w-[100px]"
          >
            {isProcessing ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Renaming...
              </div>
            ) : (
              `Rename ${modifiedCount} Files`
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};