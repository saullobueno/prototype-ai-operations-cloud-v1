import { SettingsSection } from "@/components/layout/settings-section";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { organization } from "@/data/mock";
import { daysAgo } from "@/lib/time";
import { formatCurrency, formatDate } from "@/lib/format";

const INVOICES = [
  { id: "INV-2026-08", amountCents: 399000, date: daysAgo(3) },
  { id: "INV-2026-07", amountCents: 399000, date: daysAgo(33) },
  { id: "INV-2026-06", amountCents: 399000, date: daysAgo(63) },
];

export default function BillingSettingsPage() {
  return (
    <SettingsSection title="Faturamento" description="Plano, uso e faturas deste workspace.">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base">Plano atual</CardTitle>
          <Badge className="capitalize">{organization.plan}</Badge>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          <p>2.481 clientes · 7 agentes de IA ativos · 34 workflows</p>
          <p className="mt-1">Forma de pagamento: Visa •••• 4242</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-base">Faturas</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Fatura</TableHead>
                <TableHead>Data</TableHead>
                <TableHead className="text-right">Valor</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {INVOICES.map((inv) => (
                <TableRow key={inv.id}>
                  <TableCell className="font-medium">{inv.id}</TableCell>
                  <TableCell className="text-muted-foreground">{formatDate(inv.date)}</TableCell>
                  <TableCell className="text-right">{formatCurrency(inv.amountCents)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </SettingsSection>
  );
}
