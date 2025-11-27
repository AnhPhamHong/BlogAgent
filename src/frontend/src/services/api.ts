import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type {
    GenerateTopicsRequest,
    GenerateTopicsResponse,
    Draft,
    GenerateOutlineRequest,
    GenerateDraftRequest,
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
    tagTypes: ['Topics', 'Drafts', 'Workflow'],
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

        // Generate outline for a topic
        generateOutline: builder.mutation<Draft, GenerateOutlineRequest>({
            query: (request) => ({
                url: '/drafts/outline',
                method: 'POST',
                body: request,
            }),
            invalidatesTags: ['Drafts'],
        }),

        // Generate full draft
        generateDraft: builder.mutation<Draft, GenerateDraftRequest>({
            query: (request) => ({
                url: '/drafts/generate',
                method: 'POST',
                body: request,
            }),
            invalidatesTags: ['Drafts'],
        }),

        // Get draft by ID
        getDraft: builder.query<Draft, string>({
            query: (id) => `/drafts/${id}`,
            providesTags: (_result, _error, id) => [{ type: 'Drafts', id }],
        }),
    }),
});

export const {
    useGenerateTopicsMutation,
    useGenerateOutlineMutation,
    useGenerateDraftMutation,
    useGetDraftQuery,
} = blogAgentApi;
