import api from "@/services/api";

export const createChat = async (userIds: string[]) => {
  const res = await api.post("/chats/createChat", { users: userIds });
  return res.data.data;
};
