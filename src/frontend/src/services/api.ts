import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type {
    GenerateTopicsRequest,
    GenerateTopicsResponse,
    Workflow,
    CreateWorkflowRequest,
    ApproveOutlineRequest,
    RejectOutlineRequest,
    ReviseDraftRequest,
    ChatRequest,
    PublishRequest,
} from '@/types';

export const blogAgentApi = createApi({
    reducerPath: 'blogAgentApi',
    baseQuery: fetchBaseQuery({
        baseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5128/api',
        prepareHeaders: (headers) => {
            headers.set('Content-Type', 'application/json');
            return headers;
        },
    }),
    tagTypes: ['Topics', 'Workflow'],
    endpoints: (builder) => ({
        // Generate topic ideas
        generateTopics: builder.mutation<GenerateTopicsResponse, GenerateTopicsRequest>({
            query: (request) => ({
                url: '/topics/generate',
                method: 'POST',
                body: request,
            }),
            invalidatesTags: ['Topics'],
        }),

        // Create a new workflow
        createWorkflow: builder.mutation<Workflow, CreateWorkflowRequest>({
            query: (request) => ({
                url: '/workflows',
                method: 'POST',
                body: request,
            }),
            invalidatesTags: ['Workflow'],
        }),

        // Get workflow state
        getWorkflow: builder.query<Workflow, string>({
            query: (id) => `/workflows/${id}`,
            providesTags: (_result, _error, id) => [{ type: 'Workflow', id }],
        }),

        // Approve outline
        approveOutline: builder.mutation<Workflow, ApproveOutlineRequest>({
            query: ({ workflowId, ...body }) => ({
                url: `/workflows/${workflowId}/approve-outline`,
                method: 'POST',
                body,
            }),
            invalidatesTags: (_result, _error, { workflowId }) => [{ type: 'Workflow', id: workflowId }],
        }),

        // Reject outline
        rejectOutline: builder.mutation<Workflow, RejectOutlineRequest>({
            query: ({ workflowId, ...body }) => ({
                url: `/workflows/${workflowId}/reject-outline`,
                method: 'POST',
                body,
            }),
            invalidatesTags: (_result, _error, { workflowId }) => [{ type: 'Workflow', id: workflowId }],
        }),

        // Revise draft
        reviseDraft: builder.mutation<Workflow, ReviseDraftRequest>({
            query: ({ workflowId, ...body }) => ({
                url: `/workflows/${workflowId}/revise`,
                method: 'POST',
                body,
            }),
            invalidatesTags: (_result, _error, { workflowId }) => [{ type: 'Workflow', id: workflowId }],
        }),

        // Chat with agent
        chatWithAgent: builder.mutation<void, ChatRequest>({
            query: ({ workflowId, ...body }) => ({
                url: `/workflows/${workflowId}/chat`,
                method: 'POST',
                body,
            }),
        }),

        // Publish to CMS
        publishToCMS: builder.mutation<void, PublishRequest>({
            query: ({ platform, ...body }) => ({
                url: `/publish/${platform}`,
                method: 'POST',
                body,
            }),
        }),
    }),
});

// TODO: What are mutations btw?
export const {
    useGenerateTopicsMutation,
    useCreateWorkflowMutation,
    useGetWorkflowQuery,
    useApproveOutlineMutation,
    useRejectOutlineMutation,
    useReviseDraftMutation,
    useChatWithAgentMutation,
    usePublishToCMSMutation,
} = blogAgentApi;
