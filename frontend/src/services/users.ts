import api from "./api";
import { USE_MOCK_API } from "@/config/api";
import { mockBanUser, mockGetUsers, mockUnbanUser } from "@/mocks/mockApi";

export async function getUsers() {
    if (USE_MOCK_API) {
        return mockGetUsers();
    }

    const response = await api.get("/users");
    return response.data;
}

export async function banUser(userId: number) {
    if (USE_MOCK_API) {
        return mockBanUser(userId);
    }

    const response = await api.post(`/users/${userId}/ban`);
    return response.data;
}

export async function unbanUser(userId: number) {
    if (USE_MOCK_API) {
        return mockUnbanUser(userId);
    }

    const response = await api.post(`/users/${userId}/unban`);
    return response.data;
}
