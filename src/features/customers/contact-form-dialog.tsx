"use client";

import { useState } from "react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { addContact, updateContact } from "@/data/mock";
import type { Contact } from "@/types";

interface ContactFormState {
  name: string;
  email: string;
  role: string;
}

function toFormState(contact?: Contact): ContactFormState {
  return {
    name: contact?.name ?? "",
    email: contact?.email ?? "",
    role: contact?.role ?? "",
  };
}

interface ContactFormDialogProps {
  /** Presente = modo edição (muta este contato). Ausente = modo criação. */
  contact?: Contact;
  customerId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (contact: Contact) => void;
}

export function ContactFormDialog({ contact, customerId, open, onOpenChange, onSave }: ContactFormDialogProps) {
  const isEdit = Boolean(contact);
  const [form, setForm] = useState<ContactFormState>(() => toFormState(contact));

  // Recarrega o formulário sempre que o dialog transiciona de fechado para aberto (troca de
  // contato em edição, ou reset em criação). Ajuste de estado durante a renderização (em vez de
  // useEffect) conforme https://react.dev/learn/you-might-not-need-an-effect.
  const [wasOpen, setWasOpen] = useState(open);
  if (open !== wasOpen) {
    setWasOpen(open);
    if (open) setForm(toFormState(contact));
  }

  function handleSave() {
    if (!form.name.trim() || !form.email.trim()) return;

    if (isEdit && contact) {
      const updated = updateContact(contact.id, {
        name: form.name.trim(),
        email: form.email.trim(),
        role: form.role.trim() || undefined,
      });
      if (updated) {
        onSave(updated);
        toast.success("Contato atualizado", { description: `${updated.name} foi atualizado.` });
      }
    } else {
      const newContact: Contact = {
        id: `contact_${customerId}_${Date.now()}`,
        customerId,
        name: form.name.trim(),
        email: form.email.trim(),
        role: form.role.trim() || undefined,
      };
      addContact(newContact);
      onSave(newContact);
      toast.success("Contato criado", { description: `${newContact.name} foi adicionado a este cliente.` });
    }
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Editar contato" : "Novo contato"}</DialogTitle>
          <DialogDescription>
            {isEdit ? "Atualize os dados deste contato." : "Adicione um contato adicional a este cliente."}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          <div className="space-y-1.5">
            <Label htmlFor="contact-name">Nome</Label>
            <Input id="contact-name" value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} autoFocus />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="contact-email">Email</Label>
            <Input id="contact-email" type="email" value={form.email} onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="contact-role">Função</Label>
            <Input id="contact-role" value={form.role} onChange={(e) => setForm((p) => ({ ...p, role: e.target.value }))} placeholder="ex: Contato de billing" />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSave} disabled={!form.name.trim() || !form.email.trim()}>
            {isEdit ? "Salvar alterações" : "Criar contato"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
