import api from "./api";
import { USE_MOCK_API } from "@/config/api";
import { mockCreateThread, mockGetThreadById } from "@/mocks/mockApi";

export async function createThread(forumId: number, title: string, description: string) {
    if (USE_MOCK_API) {
        return mockCreateThread(forumId, title, description);
    }

    const response = await api.post(`/threads`, { title: title, description: description, forum_id: forumId });
    return response.data;
}

export async function getThreadById(threadId: number) {
    if (USE_MOCK_API) {
        return mockGetThreadById(threadId);
    }

    const response = await api.get(`/threads/${threadId}`);
    return response.data;
}
