import { api } from "@/shared/utils/api";

export interface UserItem {
  id: string;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
}

export const userApi = {
  async getUsers(): Promise<UserItem[]> {
    const res = await api.get('/users');
    return res.data;
  },

  async toggleStatus(id: string): Promise<void> {
    await api.patch(`/users/${id}/toggle-status`);
  },
};
