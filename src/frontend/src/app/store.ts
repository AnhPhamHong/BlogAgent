import { configureStore } from '@reduxjs/toolkit';
import { blogAgentApi } from '@/services/api';
import topicReducer from '@/features/topics/topicSlice';
import draftReducer from '@/features/drafts/draftSlice';
import uiReducer from '@/features/ui/uiSlice';
import workflowReducer from '@/features/workflows/workflowSlice';

export const store = configureStore({
    reducer: {
        // Pure functions returning new state objects
        // instead of modifying the existing state
        [blogAgentApi.reducerPath]: blogAgentApi.reducer,
        topics: topicReducer,
        drafts: draftReducer,
        ui: uiReducer,
        workflow: workflowReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(blogAgentApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
