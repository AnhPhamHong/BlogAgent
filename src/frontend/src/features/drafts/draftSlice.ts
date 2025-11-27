import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { Draft } from '@/types';

interface DraftState {
    currentDraft: Draft | null;
    isGenerating: boolean;
}

const initialState: DraftState = {
    currentDraft: null,
    isGenerating: false,
};

const draftSlice = createSlice({
    name: 'drafts',
    initialState,
    reducers: {
        setCurrentDraft: (state, action: PayloadAction<Draft | null>) => {
            state.currentDraft = action.payload;
        },
        setDraftGenerating: (state, action: PayloadAction<boolean>) => {
            state.isGenerating = action.payload;
        },
    },
});

export const { setCurrentDraft, setDraftGenerating } = draftSlice.actions;
export default draftSlice.reducer;
