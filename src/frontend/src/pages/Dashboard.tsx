import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAppDispatch } from '@/app/hooks';
import { setCurrentView } from '@/features/ui/uiSlice';
import { useGetWorkflowsQuery } from '@/services/api';

export default function Dashboard() {
    const dispatch = useAppDispatch();
    const { data: workflows, isLoading, error } = useGetWorkflowsQuery();

    useEffect(() => {
        dispatch(setCurrentView('dashboard'));
    }, [dispatch]);

    if (isLoading) {
        return <div className="text-center py-8">Loading workflows...</div>;
    }

    if (error) {
        return <div className="text-center py-8 text-red-600">Error loading workflows</div>;
    }

    return (
        <div className="space-y-8">
            {/* Page Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                    <p className="mt-2 text-gray-600">
                        Manage your content generation workflows.
                    </p>
                </div>
                <Link
                    to="/generate"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                    New Workflow
                </Link>
            </div>

            {/* Workflows List */}
            <div className="bg-white shadow overflow-hidden sm:rounded-md">
                <ul className="divide-y divide-gray-200">
                    {workflows?.map((workflow) => (
                        <li key={workflow.id}>
                            <Link to={`/generate?id=${workflow.id}`} className="block hover:bg-gray-50">
                                <div className="px-4 py-4 sm:px-6">
                                    <div className="flex items-center justify-between">
                                        <p className="text-sm font-medium text-primary-600 truncate">
                                            {workflow.topic}
                                        </p>
                                        <div className="ml-2 flex-shrink-0 flex">
                                            <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                                {workflow.state}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="mt-2 sm:flex sm:justify-between">
                                        <div className="sm:flex">
                                            <p className="flex items-center text-sm text-gray-500">
                                                {workflow.currentStep}
                                            </p>
                                        </div>
                                        <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                                            <p>
                                                Created on <time dateTime={workflow.createdAt}>{new Date(workflow.createdAt).toLocaleDateString()}</time>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        </li>
                    ))}
                    {workflows?.length === 0 && (
                        <li className="px-4 py-8 text-center text-gray-500">
                            No workflows found. Start by creating a new one!
                        </li>
                    )}
                </ul>
            </div>
        </div>
    );
}
