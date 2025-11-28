import { useAppSelector } from '@/app/hooks';
import { useGetWorkflowQuery } from '@/services/api';

export default function WorkflowViewer() {
    const currentWorkflow = useAppSelector((state) => state.workflow.currentWorkflow);

    // Poll for workflow updates if we have a workflow
    const { data: updatedWorkflow } = useGetWorkflowQuery(
        currentWorkflow?.id || '',
        {
            skip: !currentWorkflow?.id,
            pollingInterval: 2000, // Poll every 2 seconds
        }
    );

    const workflow = updatedWorkflow || currentWorkflow;

    if (!workflow) {
        return null;
    }

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
            default:
                return 'bg-gray-500';
        }
    };

    return (
        <div className="card">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-gray-800">Workflow Progress</h3>
                <span className={`px-3 py-1 rounded-full text-white text-sm font-medium ${getStateColor(workflow.state)}`}>
                    {workflow.state}
                </span>
            </div>

            <div className="space-y-4">
                {/* Current Step */}
                <div>
                    <p className="text-sm text-gray-600 mb-1">Current Step</p>
                    <p className="text-base font-medium text-gray-800">{workflow.currentStep}</p>
                </div>

                {/* Progress Timeline */}
                <div className="space-y-2">
                    <p className="text-sm text-gray-600 mb-2">Timeline</p>
                    <div className="flex items-center space-x-2">
                        {['Researching', 'Outlining', 'WaitingApproval', 'Drafting', 'Review', 'Completed'].map((step) => {
                            const stateIndex = ['Researching', 'Outlining', 'WaitingApproval', 'Drafting', 'Review', 'Optimizing', 'Completed'].indexOf(workflow.state);
                            const currentIndex = ['Researching', 'Outlining', 'WaitingApproval', 'Drafting', 'Review', 'Optimizing', 'Completed'].indexOf(step);
                            const isActive = currentIndex === stateIndex;
                            const isCompleted = currentIndex < stateIndex;

                            return (
                                <div key={step} className="flex-1">
                                    <div className={`h-2 rounded-full ${isCompleted ? 'bg-green-500' :
                                        isActive ? 'bg-blue-500' :
                                            'bg-gray-200'
                                        }`} />
                                    <p className={`text-xs mt-1 ${isActive || isCompleted ? 'text-gray-800 font-medium' : 'text-gray-500'
                                        }`}>
                                        {step.replace(/([A-Z])/g, ' $1').trim()}
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Data Sections */}
                {workflow.data.outline && workflow.data.outline.length > 0 && (
                    <div>
                        <p className="text-sm text-gray-600 mb-2">Outline</p>
                        <div className="space-y-2">
                            {workflow.data.outline.map((section) => (
                                <div key={section.id} className="border-l-2 border-primary-500 pl-3">
                                    <p className="font-medium text-gray-800">{section.heading}</p>
                                    {section.subheadings.length > 0 && (
                                        <ul className="list-disc list-inside text-sm text-gray-600 ml-2">
                                            {section.subheadings.map((subheading, idx) => (
                                                <li key={idx}>{subheading}</li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {workflow.data.draft && (
                    <div>
                        <p className="text-sm text-gray-600 mb-2">Draft Preview</p>
                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                            <h4 className="font-semibold mb-2">{workflow.data.draft.metaTitle}</h4>
                            <p className="text-sm text-gray-600 mb-2">{workflow.data.draft.metaDescription}</p>
                            <div className="text-sm text-gray-700 line-clamp-6">
                                {workflow.data.draft.content.substring(0, 300)}...
                            </div>
                            <div className="mt-2 flex items-center space-x-2">
                                <span className="text-xs text-gray-600">SEO Score:</span>
                                <span className={`text-xs font-medium ${workflow.data.draft.seoScore >= 80 ? 'text-green-600' :
                                    workflow.data.draft.seoScore >= 60 ? 'text-yellow-600' :
                                        'text-red-600'
                                    }`}>
                                    {workflow.data.draft.seoScore}/100
                                </span>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
