import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { Workflow } from '@/types';

interface WorkflowState {
    currentWorkflow: Workflow | null;
    isCreating: boolean;
    error: string | null;
}

const initialState: WorkflowState = {
    currentWorkflow: null,
    isCreating: false,
    error: null,
};

// Bundle everything of a Redux state into one unit
// including initial state, reducers and actions
const workflowSlice = createSlice({
    name: 'workflow',
    initialState,
    reducers: {
        setCurrentWorkflow: (state, action: PayloadAction<Workflow>) => {
            state.currentWorkflow = action.payload;
        },
        clearCurrentWorkflow: (state) => {
            state.currentWorkflow = null;
        },
        setCreating: (state, action: PayloadAction<boolean>) => {
            state.isCreating = action.payload;
        },
        setError: (state, action: PayloadAction<string | null>) => {
            state.error = action.payload;
        },
    },
});

export const { setCurrentWorkflow, clearCurrentWorkflow, setCreating, setError } =
    workflowSlice.actions;
export default workflowSlice.reducer;
