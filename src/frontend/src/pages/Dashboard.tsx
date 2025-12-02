import { useEffect } from 'react';
import { useAppDispatch } from '@/app/hooks';
import { setCurrentView } from '@/features/ui/uiSlice';
import TopicInputForm from '@/features/topics/TopicInputForm';
import TopicList from '@/features/topics/TopicList';
import ProgressIndicator from '@/components/ProgressIndicator';
import WorkflowViewer from '@/features/workflows/WorkflowViewer';

export default function Dashboard() {
    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(setCurrentView('dashboard'));
    }, [dispatch]);

    return (
        <div className="space-y-8">
            {/* Page Header */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                <p className="mt-2 text-gray-600">
                    Generate blog topics and create compelling content with AI assistance.
                </p>
            </div>

            {/* Progress Indicator */}
            <ProgressIndicator />

            {/* Workflow Viewer */}
            <WorkflowViewer />

            {/* Topic Input Form */}
            <TopicInputForm />

            {/* Topic Suggestions List */}
            <TopicList />
        </div>
    );
}
