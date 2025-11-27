import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { describe, it, expect } from 'vitest';
import TopicInputForm from './TopicInputForm';
import topicReducer from './topicSlice';
import { blogAgentApi } from '@/services/api';

// Mock the API
const mockStore = configureStore({
    reducer: {
        topics: topicReducer,
        [blogAgentApi.reducerPath]: blogAgentApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(blogAgentApi.middleware),
});

describe('TopicInputForm', () => {
    it('renders correctly', () => {
        render(
            <Provider store={mockStore}>
                <TopicInputForm />
            </Provider>
        );

        expect(screen.getByText(/Generate Blog Topics/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Keywords or Topic/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Tone/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Generate Ideas/i })).toBeInTheDocument();
    });
});
