export enum StaffRoleEnum {
  BOSS = "Boss",
  WORKER = "Worker",
}

export const STAFF_ROLE_LABELS: Record<StaffRoleEnum, string> = {
  [StaffRoleEnum.BOSS]: "Jefe",
  [StaffRoleEnum.WORKER]: "Trabajador",
};

export type StaffFormType = {
  mode: "create";
  data: {
    name: string;
    email: string;
    role: StaffRoleEnum;
    document: string;
    phone: string;
    address: string;
  };
} | {
  mode: "update";
  data: {
    name: string;
    phone: string;
    address: string;
  };
}; 