import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { EntityAvatar } from "@/components/domain/entity-avatar";
import { getUserById, teams } from "@/data/mock";

export function TeamsTable() {
  return (
    <div className="overflow-hidden rounded-lg border border-border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Time</TableHead>
            <TableHead>Membros</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {teams.map((t) => (
            <TableRow key={t.id}>
              <TableCell className="font-medium">{t.name}</TableCell>
              <TableCell>
                <div className="flex -space-x-2">
                  {t.memberIds.length === 0 && <span className="text-sm text-muted-foreground">Sem membros</span>}
                  {t.memberIds.map((id) => {
                    const user = getUserById(id);
                    return user ? <EntityAvatar key={id} name={user.name} size="xs" className="ring-2 ring-background" /> : null;
                  })}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
