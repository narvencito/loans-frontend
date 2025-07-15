import React from 'react';
import { UserItem } from '../api/user_api';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { BlueButton, RedButton, GreenButton } from '@/components/common/ColorButtons';

interface Props {
  users: UserItem[];
  onToggle: (id: string) => void;
}

const roleTranslations: Record<string, string> = {
  Admin: 'Administrador',
  Operator: 'Operador',
  Client: 'Cliente',
  Worker: 'Trabajador',
};

const UserTable = ({ users, onToggle }: Props) => {
  return (
    <div className="rounded-md border border-border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="text-muted-foreground">
            <TableHead>Nombre</TableHead>
            <TableHead>Correo</TableHead>
            <TableHead>Rol</TableHead>
            <TableHead className="text-center">Estado</TableHead>
            <TableHead className="text-center">Acción</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((u) => (
            <TableRow key={u.id}>
              <TableCell className="text-foreground">{u.name}</TableCell>
              <TableCell className="text-foreground">{u.email}</TableCell>
              <TableCell className="text-foreground">
                {roleTranslations[u.role] || u.role}
              </TableCell>
              <TableCell className="text-center">
                <span className={u.isActive ? 'text-green-600' : 'text-red-600'}>
                  {u.isActive ? 'Activo' : 'Inactivo'}
                </span>
              </TableCell>
              <TableCell className="text-center">
                {u.isActive ? (
                  <RedButton
                    size="sm"
                    onClick={() => onToggle(u.id)}
                  >
                    Desactivar
                  </RedButton>
                ) : (
                  <GreenButton
                    size="sm"
                    onClick={() => onToggle(u.id)}
                  >
                    Activar
                  </GreenButton>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default UserTable;
