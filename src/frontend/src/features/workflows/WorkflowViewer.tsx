import { useState, useEffect } from 'react';
import { useAppSelector } from '@/app/hooks';
import { useGetWorkflowQuery } from '@/services/api';
import { useWorkflowSubscription } from '@/hooks/useWorkflowSubscription';
import OutlineEditor from './OutlineEditor';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import ReactMarkdown from 'react-markdown';
import CollapsibleSection from '@/components/ui/CollapsibleSection';

export default function WorkflowViewer() {
    const currentWorkflow = useAppSelector((state) => state.workflow.currentWorkflow);

    // Subscribe to real-time updates via SignalR
    useWorkflowSubscription(currentWorkflow?.id);

    // Initial fetch only
    const { data: initialWorkflow } = useGetWorkflowQuery(
        currentWorkflow?.id || '',
        {
            skip: !currentWorkflow?.id,
        }
    );

    const workflow = currentWorkflow || initialWorkflow;

    // State for collapsible sections
    const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
        draft: false,
        outline: false,
        research: false,
    });

    // Automatically expand the current active stage
    useEffect(() => {
        if (!workflow) return;

        const newExpanded = { ...expandedSections };

        if (['Drafting', 'Review', 'Optimizing', 'Completed'].includes(workflow.state)) {
            newExpanded.draft = true;
        } else if (['Outlining', 'WaitingApproval'].includes(workflow.state)) {
            newExpanded.outline = true;
        } else if (workflow.state === 'Researching') {
            newExpanded.research = true;
        }

        setExpandedSections(newExpanded);
    }, [workflow?.state]);

    if (!workflow) {
        return null;
    }

    const toggleSection = (section: string) => {
        setExpandedSections(prev => ({
            ...prev,
            [section]: !prev[section]
        }));
    };

    const getStateColor = (state: string) => {
        switch (state) {
            case 'Researching':
            case 'Outlining':
            case 'Drafting':
            case 'Optimizing':
                return 'bg-blue-500';
            case 'WaitingApproval':
                return 'bg-yellow-500';
            case 'Review':
                return 'bg-purple-500';
            case 'Completed':
                return 'bg-green-500';
            case 'Failed':
                return 'bg-red-500';
            default:
                return 'bg-gray-500';
        }
    };

    // Determine status for each section
    const getResearchStatus = () => {
        if (workflow.state === 'Researching') return 'active';
        if (workflow.data.research) return 'completed';
        return 'pending';
    };

    const getOutlineStatus = () => {
        if (workflow.state === 'Outlining' || workflow.state === 'WaitingApproval') return 'active';
        if (workflow.data.outline && ['Drafting', 'Review', 'Optimizing', 'Completed'].includes(workflow.state)) return 'completed';
        return 'pending';
    };

    const getDraftStatus = () => {
        if (['Drafting', 'Review', 'Optimizing'].includes(workflow.state)) return 'active';
        if (workflow.state === 'Completed') return 'completed';
        return 'pending';
    };

    const getProgress = (state: string) => {
        switch (state) {
            case 'Researching': return 25;
            case 'Outlining': return 50;
            case 'WaitingApproval': return 50;
            case 'Drafting': return 75;
            case 'Review': return 85;
            case 'Optimizing': return 95;
            case 'Completed': return 100;
            default: return 0;
        }
    };

    return (
        <div className="space-y-6">
            <div className="card">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-semibold text-gray-800">Workflow Progress</h3>
                    <span className={`px-3 py-1 rounded-full text-white text-sm font-medium ${getStateColor(workflow.state)}`}>
                        {workflow.state}
                    </span>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-gray-200 rounded-full h-2.5 mb-6">
                    <div
                        className={`h-2.5 rounded-full transition-all duration-500 ${getStateColor(workflow.state)}`}
                        style={{ width: `${getProgress(workflow.state)}%` }}
                    ></div>
                </div>

                {/* Current Step & Error Display */}
                <div>
                    <p className="text-sm text-gray-600 mb-1">Current Step</p>
                    <p className="text-base font-medium text-gray-800">{workflow.currentStep}</p>
                    {workflow.state === 'Failed' && (
                        <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-md text-sm text-red-700">
                            <strong>Error:</strong> The workflow encountered an issue. Please check the chat history for details.
                        </div>
                    )}
                </div>
            </div>

            <div className="space-y-4">
                {/* 1. Draft Section (Top Priority) */}
                {(workflow.data.draft || ['Drafting', 'Review', 'Optimizing', 'Completed'].includes(workflow.state)) && (
                    <CollapsibleSection
                        title="Draft Generation"
                        status={getDraftStatus()}
                        isOpen={expandedSections.draft}
                        onToggle={() => toggleSection('draft')}
                    >
                        {workflow.data.draft ? (
                            <div className="space-y-4">
                                <div className="border-b border-gray-100 pb-3">
                                    <h5 className="font-semibold text-lg text-gray-900">{workflow.data.draft.metaTitle}</h5>
                                    <p className="text-sm text-gray-500 mt-1">{workflow.data.draft.metaDescription}</p>
                                </div>

                                <div className="prose prose-sm max-w-none text-gray-700">
                                    <ReactMarkdown>{workflow.data.draft.content}</ReactMarkdown>
                                </div>

                                <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
                                    <div className="flex items-center space-x-2">
                                        <span className="text-xs text-gray-500">SEO Score:</span>
                                        <span className={`text-sm font-bold ${workflow.data.draft.seoScore >= 80 ? 'text-green-600' :
                                            workflow.data.draft.seoScore >= 60 ? 'text-yellow-600' :
                                                'text-red-600'
                                            }`}>
                                            {workflow.data.draft.seoScore}/100
                                        </span>
                                    </div>
                                    <span className="text-xs text-gray-400">
                                        Last updated: {new Date(workflow.data.draft.lastUpdated).toLocaleTimeString()}
                                    </span>
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-8">
                                <LoadingSpinner size="lg" className="mb-4 text-blue-500" />
                                <p className="text-gray-500">Generating draft content...</p>
                            </div>
                        )}
                    </CollapsibleSection>
                )}

                {/* 2. Outline Section */}
                {(workflow.data.outline || ['Outlining', 'WaitingApproval'].includes(workflow.state) || getOutlineStatus() === 'completed') && (
                    <CollapsibleSection
                        title="Outline"
                        status={getOutlineStatus()}
                        isOpen={expandedSections.outline}
                        onToggle={() => toggleSection('outline')}
                    >
                        {workflow.data.outline ? (
                            <OutlineEditor
                                workflowId={workflow.id}
                                initialOutline={workflow.data.outline}
                                isReadOnly={workflow.state !== 'WaitingApproval'}
                            />
                        ) : (
                            <div className="flex flex-col items-center justify-center py-8">
                                <LoadingSpinner size="lg" className="mb-4 text-purple-500" />
                                <p className="text-gray-500">Generating outline structure...</p>
                            </div>
                        )}
                    </CollapsibleSection>
                )}

                {/* 3. Research Section (Bottom Priority) */}
                {(workflow.data.research || workflow.state === 'Researching' || getResearchStatus() === 'completed') && (
                    <CollapsibleSection
                        title="Research Findings"
                        status={getResearchStatus()}
                        isOpen={expandedSections.research}
                        onToggle={() => toggleSection('research')}
                    >
                        {workflow.data.research ? (
                            <div className="prose prose-sm max-w-none text-gray-700 max-h-96 overflow-y-auto">
                                {typeof workflow.data.research === 'string' ? (
                                    <ReactMarkdown>{workflow.data.research}</ReactMarkdown>
                                ) : (
                                    <pre>{JSON.stringify(workflow.data.research, null, 2)}</pre>
                                )}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-8">
                                <LoadingSpinner size="lg" className="mb-4 text-blue-500" />
                                <p className="text-gray-500">Gathering research data...</p>
                            </div>
                        )}
                    </CollapsibleSection>
                )}
            </div>
        </div>
    );
}
