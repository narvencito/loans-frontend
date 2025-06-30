import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CreateStaffDto, Staff, UpdateStaffDto } from "../api/staff_api";
import { StaffRoleEnum } from "../types/staff.types";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createStaffSchema, updateStaffSchema } from "../schemas/staff.schema";
import { useLoaderStore } from "@/shared/store/loader.store";

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: CreateStaffDto | UpdateStaffDto, isUpdate: boolean) => void;
  staff?: Staff;
}

export const StaffFormModal = ({ open, onClose, onSubmit, staff }: Props) => {
  const isUpdateMode = Boolean(staff);
  const { isLoading } = useLoaderStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm({
    resolver: zodResolver(isUpdateMode ? updateStaffSchema : createStaffSchema),
    defaultValues: isUpdateMode ? {
      name: staff?.name || "",
      phone: staff?.staff?.phone || "",
      address: staff?.staff?.address || "",
    } : {
      name: "",
      email: "",
      role: StaffRoleEnum.WORKER,
      document: "",
      phone: "",
      address: "",
    }
  });

  const role = watch("role");

  useEffect(() => {
    if (open) {
      reset(isUpdateMode ? {
        name: staff?.name || "",
        phone: staff?.staff?.phone || "",
        address: staff?.staff?.address || "",
      } : {
        name: "",
        email: "",
        role: StaffRoleEnum.WORKER,
        document: "",
        phone: "",
        address: "",
      });
    }
  }, [open, staff, reset, isUpdateMode]);

  const handleFormSubmit = handleSubmit((data) => {
    if (typeof onSubmit === 'function') {
      onSubmit(data, isUpdateMode);
    }
  });

  const getFieldError = (fieldName: string) => {
    return (errors as Record<string, { message: string }>)?.[fieldName]?.message;
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isUpdateMode ? "Editar Personal" : "Registrar Personal"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleFormSubmit} className="space-y-4">
          <div>
            <Label>Nombre</Label>
            <Input
              {...register("name")}
              disabled={isLoading}
            />
            {getFieldError("name") && (
              <p className="text-sm text-red-500 mt-1">{getFieldError("name")}</p>
            )}
          </div>

          {!isUpdateMode && (
            <>
              <div>
                <Label>Email</Label>
                <Input
                  type="email"
                  {...register("email")}
                  disabled={isLoading}
                />
                {getFieldError("email") && (
                  <p className="text-sm text-red-500 mt-1">{getFieldError("email")}</p>
                )}
              </div>

              <div>
                <Label>Documento (DNI)</Label>
                <Input
                  {...register("document")}
                  disabled={isLoading}
                  maxLength={8}
                />
                {getFieldError("document") && (
                  <p className="text-sm text-red-500 mt-1">{getFieldError("document")}</p>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <Label>Rol</Label>
                <Select
                  value={role}
                  onValueChange={(value: string) => setValue("role", value as StaffRoleEnum)}
                  disabled={isLoading}
                >
                  <SelectTrigger className="bg-white">
                    <SelectValue placeholder="Seleccionar rol" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    <SelectItem value={StaffRoleEnum.BOSS}>Jefe</SelectItem>
                    <SelectItem value={StaffRoleEnum.WORKER}>Trabajador</SelectItem>
                  </SelectContent>
                </Select>
                {getFieldError("role") && (
                  <p className="text-sm text-red-500 mt-1">{getFieldError("role")}</p>
                )}
              </div>
            </>
          )}

          <div>
            <Label>Teléfono</Label>
            <Input
              {...register("phone")}
              disabled={isLoading}
            />
            {getFieldError("phone") && (
              <p className="text-sm text-red-500 mt-1">{getFieldError("phone")}</p>
            )}
          </div>

          <div>
            <Label>Dirección</Label>
            <Input
              {...register("address")}
              disabled={isLoading}
            />
            {getFieldError("address") && (
              <p className="text-sm text-red-500 mt-1">{getFieldError("address")}</p>
            )}
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Guardando..." : "Guardar"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}; 