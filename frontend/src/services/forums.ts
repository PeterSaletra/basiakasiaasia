import api from "./api";
import { USE_MOCK_API } from "@/config/api";
import {
    mockCreateForum,
    mockGetForumById,
    mockGetForums,
    mockGetThreadsByForumId,
} from "@/mocks/mockApi";

export async function getForums() {
    if (USE_MOCK_API) {
        return mockGetForums();
    }

    const response = await api.get("/forums");
    return response.data;
}

export async function getForumsById(forumId: number) {
    if (USE_MOCK_API) {
        return mockGetForumById(forumId);
    }

    const response = await api.get(`/forums/${forumId}`);
    return response.data;
}

export async function getThreadsByForumId(forumId: number) {
    if (USE_MOCK_API) {
        return mockGetThreadsByForumId(forumId);
    }

    const response = await api.get(`/forums/${forumId}/threads`);
    return response.data;
}

export async function createForum(title: string, description: string) {
    if (USE_MOCK_API) {
        return mockCreateForum(title, description);
    }

    const response = await api.post("/forums", { title, description });
    return response.data;
}
