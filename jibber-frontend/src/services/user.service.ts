import api from "@/services/api";
import type { SearchUser } from "@/types";

export const getUsersByQuery = async (query: string): Promise<SearchUser[]> => {
  if (!query.trim()) return [];
  const res = await api.get(`/users/getUsers?query=${query}`);
  return res.data.data;
};
