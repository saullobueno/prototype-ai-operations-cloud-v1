import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { permissions } from "@/data/mock";

export function PermissionsTable() {
  return (
    <div className="overflow-hidden rounded-lg border border-border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Chave</TableHead>
            <TableHead>Descrição</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {permissions.map((p) => (
            <TableRow key={p.id}>
              <TableCell className="font-mono text-xs">{p.key}</TableCell>
              <TableCell className="text-muted-foreground">{p.description}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
