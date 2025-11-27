// Topic related types
export interface TopicSuggestion {
    id: string;
    title: string;
    description: string;
    estimatedWordCount: number;
    keywords: string[];
    tone: ToneType;
}

export type ToneType = 'professional' | 'casual' | 'witty' | 'persuasive';

// Draft related types
export interface Draft {
    id: string;
    topicId: string;
    outline: Section[];
    content: string;
    metaTitle: string;
    metaDescription: string;
    seoScore: number;
    status: DraftStatus;
    createdAt: string;
    updatedAt: string;
}

export type DraftStatus = 'outline' | 'draft' | 'review' | 'final';

export interface Section {
    id: string;
    heading: string;
    subheadings: string[];
    order: number;
}

// API request/response types
export interface GenerateTopicsRequest {
    keywords: string;
    tone: ToneType;
    targetWordCount?: number;
}

export interface GenerateTopicsResponse {
    topics: TopicSuggestion[];
}

export interface GenerateOutlineRequest {
    topicId: string;
}

export interface GenerateDraftRequest {
    topicId: string;
    outlineId?: string;
}

// Workflow state (from backend)
export interface WorkflowState {
    id: string;
    state: 'initial' | 'research' | 'outline' | 'draft' | 'review' | 'optimize' | 'complete';
    currentStep: string;
    progress: number;
    estimatedTimeRemaining?: number;
}
