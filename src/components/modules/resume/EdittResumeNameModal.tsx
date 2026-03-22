import React, { useState } from "react";
import { ResumeItem } from "./ResumeListItem";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface EditNameDialogProps {
  resume: ResumeItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (id: string, newName: string,templateId:string) => void;
  isUpdating: boolean;
}

export function EditNameDialog({ resume, open, onOpenChange, onSave, isUpdating }: EditNameDialogProps) {
  const [name, setName] = useState(resume?.name || "");

  // Update local state when resume changes
  React.useEffect(() => {
    if (resume) {
      setName(resume.name || "");
    }
  }, [resume]);

  const handleSave = () => {
    if (resume && name.trim()) {
      onSave(resume.id, name.trim(),resume.templateId);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md rounded-2xl">
        <DialogHeader>
          <DialogTitle>Edit resume name</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter resume name"
            className="rounded-xl"
            autoFocus
            disabled={isUpdating}
          />
        </div>
        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)} 
            className="rounded-full"
            disabled={isUpdating}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSave} 
            className="rounded-full" 
            disabled={!name.trim() || isUpdating}
          >
            {isUpdating ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              "Save changes"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}