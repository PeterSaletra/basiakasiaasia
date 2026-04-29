import api from "./api";
import { USE_MOCK_API } from "@/config/api";
import { mockCreateComment, mockGetCommentsByThreadId } from "@/mocks/mockApi";

export async function getCommentsByThreadId(threadId: number) {
    if (USE_MOCK_API) {
        return mockGetCommentsByThreadId(threadId);
    }

    const response = await api.get(`/threads/${threadId}/comments`);
    return response.data;
}

export async function createComment(threadId: number, content: string) {
    if (USE_MOCK_API) {
        return mockCreateComment(threadId, content);
    }

    const response = await api.post('/comments', {
        thread_id: threadId,
        content: content,
    });
    return response.data;
}
