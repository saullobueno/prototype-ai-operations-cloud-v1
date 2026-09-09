"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { addVendor, updateVendor } from "@/data/mock/vendors";
import { NOW } from "@/lib/time";
import type { Vendor, VendorStatus } from "@/types";

const STATUS_OPTIONS: { value: VendorStatus; label: string }[] = [
  { value: "active", label: "Ativo" },
  { value: "pending_approval", label: "Aguardando aprovação" },
  { value: "inactive", label: "Inativo" },
];

const CATEGORY_OPTIONS = ["Software & Cloud", "Office & Facilities", "Professional Services", "Marketing & Media", "Travel"];

interface VendorFormState {
  name: string;
  category: string;
  status: VendorStatus;
  contactEmail: string;
  taxId: string;
}

function toFormState(vendor?: Vendor): VendorFormState {
  return {
    name: vendor?.name ?? "",
    category: vendor?.category ?? CATEGORY_OPTIONS[0],
    status: vendor?.status ?? "pending_approval",
    contactEmail: vendor?.contactEmail ?? "",
    taxId: vendor?.taxId ?? "",
  };
}

interface VendorFormDialogProps {
  /** Presente = modo edição (muta este fornecedor). Ausente = modo criação. */
  vendor?: Vendor;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (vendor: Vendor) => void;
}

export function VendorFormDialog({ vendor, open, onOpenChange, onSave }: VendorFormDialogProps) {
  const isEdit = Boolean(vendor);
  const [form, setForm] = useState<VendorFormState>(() => toFormState(vendor));

  const [wasOpen, setWasOpen] = useState(open);
  if (open !== wasOpen) {
    setWasOpen(open);
    if (open) setForm(toFormState(vendor));
  }

  function handleSave() {
    if (!form.name.trim()) return;

    if (isEdit && vendor) {
      const updated = updateVendor(vendor.id, {
        name: form.name.trim(),
        category: form.category,
        status: form.status,
        contactEmail: form.contactEmail.trim() || undefined,
        taxId: form.taxId.trim() || undefined,
        onboardedAt: form.status === "active" ? vendor.onboardedAt ?? NOW.toISOString() : vendor.onboardedAt,
      });
      if (updated) {
        onSave(updated);
        toast.success("Fornecedor atualizado", { description: `${updated.name} foi atualizado.` });
      }
    } else {
      const newVendor: Vendor = {
        id: `ven_${Date.now()}`,
        name: form.name.trim(),
        category: form.category,
        status: form.status,
        contactEmail: form.contactEmail.trim() || undefined,
        taxId: form.taxId.trim() || undefined,
        onboardedAt: form.status === "active" ? NOW.toISOString() : undefined,
        createdAt: NOW.toISOString(),
      };
      addVendor(newVendor);
      onSave(newVendor);
      toast.success("Fornecedor criado", { description: `${newVendor.name} foi adicionado ao cadastro.` });
    }
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Editar fornecedor" : "Novo fornecedor"}</DialogTitle>
          <DialogDescription>
            {isEdit ? "Atualize os dados cadastrais deste fornecedor." : "Cadastre um novo fornecedor para contas a pagar."}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          <div className="space-y-1.5">
            <Label htmlFor="vendor-name">Nome</Label>
            <Input id="vendor-name" value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} autoFocus />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Categoria</Label>
              <Select value={form.category} onValueChange={(v) => setForm((p) => ({ ...p, category: v }))}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORY_OPTIONS.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Status</Label>
              <Select value={form.status} onValueChange={(v) => setForm((p) => ({ ...p, status: v as VendorStatus }))}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {STATUS_OPTIONS.map((o) => (
                    <SelectItem key={o.value} value={o.value}>
                      {o.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="vendor-email">E-mail de contato</Label>
            <Input
              id="vendor-email"
              type="email"
              value={form.contactEmail}
              onChange={(e) => setForm((p) => ({ ...p, contactEmail: e.target.value }))}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="vendor-tax-id">CNPJ/Tax ID (opcional)</Label>
            <Input id="vendor-tax-id" value={form.taxId} onChange={(e) => setForm((p) => ({ ...p, taxId: e.target.value }))} />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSave} disabled={!form.name.trim()}>
            {isEdit ? "Salvar alterações" : "Criar fornecedor"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
