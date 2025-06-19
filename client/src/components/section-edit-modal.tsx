import React, { useState, useEffect, FC } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

interface SectionEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  sectionContent: string;
  onSave: (newContent: string) => void;
}

export const SectionEditModal: FC<SectionEditModalProps> = ({ isOpen, onClose, sectionContent, onSave }) => {
  const [editedContent, setEditedContent] = useState<string>(sectionContent);

  useEffect(() => {
    setEditedContent(sectionContent);
  }, [sectionContent]);

  const handleSave = (): void => {
    onSave(editedContent);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle>Editar Seção do Roteiro</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Textarea
            value={editedContent}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setEditedContent(e.target.value)}
            className="min-h-[300px]"
            placeholder="Edite o conteúdo da seção aqui..."
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancelar</Button>
          <Button onClick={handleSave}>Salvar Alterações</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}