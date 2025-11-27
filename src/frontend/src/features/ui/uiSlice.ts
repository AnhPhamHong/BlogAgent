import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UIState {
    currentView: 'dashboard' | 'chat' | 'settings';
    workflowStep: 'initial' | 'research' | 'outline' | 'draft' | 'review' | 'optimize' | 'complete';
    progress: number;
    estimatedTimeRemaining?: number;
}

const initialState: UIState = {
    currentView: 'dashboard',
    workflowStep: 'initial',
    progress: 0,
};

const uiSlice = createSlice({
    name: 'ui',
    initialState,
    reducers: {
        setCurrentView: (state, action: PayloadAction<UIState['currentView']>) => {
            state.currentView = action.payload;
        },
        setWorkflowStep: (state, action: PayloadAction<UIState['workflowStep']>) => {
            state.workflowStep = action.payload;
        },
        setProgress: (state, action: PayloadAction<number>) => {
            state.progress = action.payload;
        },
        setEstimatedTime: (state, action: PayloadAction<number | undefined>) => {
            state.estimatedTimeRemaining = action.payload;
        },
    },
});

export const { setCurrentView, setWorkflowStep, setProgress, setEstimatedTime } = uiSlice.actions;
export default uiSlice.reducer;
