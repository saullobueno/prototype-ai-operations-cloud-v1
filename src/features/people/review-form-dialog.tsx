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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { addPerformanceReview, updatePerformanceReview } from "@/data/mock/performanceReviews";
import { employees } from "@/data/mock/employees";
import type { PerformanceReview, ReviewStatus } from "@/types";

const STATUS_OPTIONS: { value: ReviewStatus; label: string }[] = [
  { value: "scheduled", label: "Agendada" },
  { value: "in_progress", label: "Em andamento" },
  { value: "completed", label: "Concluída" },
];

interface ReviewFormState {
  employeeId: string;
  cycle: string;
  status: ReviewStatus;
  rating: string;
}

function toFormState(review?: PerformanceReview, defaultEmployeeId?: string): ReviewFormState {
  return {
    employeeId: review?.employeeId ?? defaultEmployeeId ?? employees[0]?.id ?? "",
    cycle: review?.cycle ?? "",
    status: review?.status ?? "scheduled",
    rating: review?.rating != null ? String(review.rating) : "",
  };
}

interface ReviewFormDialogProps {
  /** Presente = modo edição (corrige esta avaliação, ex.: nota lançada errada). Ausente = modo criação.
   * Não há exclusão pela UI — avaliação é registro histórico oficial (ver data/mock/performanceReviews.ts). */
  review?: PerformanceReview;
  /** Fixa o colaborador (usado dentro da página do colaborador) — esconde o seletor. */
  defaultEmployeeId?: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (review: PerformanceReview) => void;
}

export function ReviewFormDialog({ review, defaultEmployeeId, open, onOpenChange, onSave }: ReviewFormDialogProps) {
  const isEdit = Boolean(review);
  const [form, setForm] = useState<ReviewFormState>(() => toFormState(review, defaultEmployeeId));

  const [wasOpen, setWasOpen] = useState(open);
  if (open !== wasOpen) {
    setWasOpen(open);
    if (open) setForm(toFormState(review, defaultEmployeeId));
  }

  function handleSave() {
    if (!form.cycle.trim() || !form.employeeId) return;
    const rating = form.rating.trim() ? Math.min(5, Math.max(0, Number(form.rating))) : undefined;

    if (isEdit && review) {
      const updated = updatePerformanceReview(review.id, {
        employeeId: form.employeeId,
        cycle: form.cycle.trim(),
        status: form.status,
        rating,
      });
      if (updated) {
        onSave(updated);
        toast.success("Avaliação atualizada", { description: `${updated.cycle} foi atualizada.` });
      }
    } else {
      const newReview: PerformanceReview = {
        id: `rev_${Date.now()}`,
        employeeId: form.employeeId,
        cycle: form.cycle.trim(),
        status: form.status,
        rating,
      };
      addPerformanceReview(newReview);
      onSave(newReview);
      toast.success("Avaliação criada", { description: `${newReview.cycle} foi agendada.` });
    }
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Editar avaliação" : "Nova avaliação"}</DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Corrija os dados desta avaliação de performance."
              : "Agende uma nova avaliação de performance para um colaborador."}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          {!defaultEmployeeId && (
            <div className="space-y-1.5">
              <Label>Colaborador</Label>
              <Select value={form.employeeId} onValueChange={(v) => setForm((p) => ({ ...p, employeeId: v }))}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {employees.map((e) => (
                    <SelectItem key={e.id} value={e.id}>
                      {e.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
          <div className="space-y-1.5">
            <Label htmlFor="review-cycle">Ciclo</Label>
            <Input
              id="review-cycle"
              placeholder="ex: 2026 H1"
              value={form.cycle}
              onChange={(e) => setForm((p) => ({ ...p, cycle: e.target.value }))}
              autoFocus
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Status</Label>
              <Select value={form.status} onValueChange={(v) => setForm((p) => ({ ...p, status: v as ReviewStatus }))}>
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
            <div className="space-y-1.5">
              <Label htmlFor="review-rating">Nota (0-5)</Label>
              <Input
                id="review-rating"
                type="number"
                min={0}
                max={5}
                step={0.1}
                placeholder="—"
                value={form.rating}
                onChange={(e) => setForm((p) => ({ ...p, rating: e.target.value }))}
              />
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSave} disabled={!form.cycle.trim()}>
            {isEdit ? "Salvar alterações" : "Criar avaliação"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
