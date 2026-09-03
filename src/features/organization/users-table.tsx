import { StatusBadge } from "@/components/domain/badges";
import { EntityAvatar } from "@/components/domain/entity-avatar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getRoleById, users } from "@/data/mock";

export function UsersTable() {
  return (
    <div className="overflow-hidden rounded-lg border border-border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead>Papel</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((u) => (
            <TableRow key={u.id}>
              <TableCell>
                <div className="flex items-center gap-2.5">
                  <EntityAvatar name={u.name} size="sm" />
                  <div>
                    <p className="font-medium text-foreground">{u.name}</p>
                    <p className="text-xs text-muted-foreground">{u.email}</p>
                  </div>
                </div>
              </TableCell>
              <TableCell>{getRoleById(u.roleId)?.name}</TableCell>
              <TableCell><StatusBadge status={u.status} /></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
