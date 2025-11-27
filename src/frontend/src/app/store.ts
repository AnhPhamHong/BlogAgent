import { configureStore } from '@reduxjs/toolkit';
import { blogAgentApi } from '@/services/api';
import topicReducer from '@/features/topics/topicSlice';
import draftReducer from '@/features/drafts/draftSlice';
import uiReducer from '@/features/ui/uiSlice';

export const store = configureStore({
    reducer: {
        [blogAgentApi.reducerPath]: blogAgentApi.reducer,
        topics: topicReducer,
        drafts: draftReducer,
        ui: uiReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(blogAgentApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
