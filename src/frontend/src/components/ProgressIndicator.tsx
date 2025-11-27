import { motion } from 'framer-motion';
import { useAppSelector } from '@/app/hooks';

const WORKFLOW_STEPS = [
    { key: 'initial', label: 'Initial', icon: '📝' },
    { key: 'research', label: 'Research', icon: '🔍' },
    { key: 'outline', label: 'Outline', icon: '📋' },
    { key: 'draft', label: 'Draft', icon: '✍️' },
    { key: 'review', label: 'Review', icon: '👀' },
    { key: 'optimize', label: 'Optimize', icon: '⚡' },
    { key: 'complete', label: 'Complete', icon: '✅' },
] as const;

export default function ProgressIndicator() {
    const workflowStep = useAppSelector((state) => state.ui.workflowStep);
    const progress = useAppSelector((state) => state.ui.progress);
    const estimatedTime = useAppSelector((state) => state.ui.estimatedTimeRemaining);

    const currentStepIndex = WORKFLOW_STEPS.findIndex((step) => step.key === workflowStep);

    // Don't show if still in initial state
    if (workflowStep === 'initial') {
        return null;
    }

    return (
        <div className="card bg-gradient-to-r from-primary-50 to-secondary-50">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Progress</h3>
                {estimatedTime && estimatedTime > 0 && (
                    <span className="text-sm text-gray-600">
                        Est. {Math.ceil(estimatedTime / 60)} min remaining
                    </span>
                )}
            </div>

            {/* Progress Bar */}
            <div className="relative w-full h-2 bg-gray-200 rounded-full overflow-hidden mb-6">
                <motion.div
                    className="absolute top-0 left-0 h-full bg-gradient-to-r from-primary-500 to-secondary-500"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.5 }}
                />
            </div>

            {/* Workflow Steps */}
            <div className="flex items-center justify-between">
                {WORKFLOW_STEPS.map((step, index) => {
                    const isComplete = index < currentStepIndex;
                    const isCurrent = index === currentStepIndex;

                    return (
                        <div key={step.key} className="flex flex-col items-center flex-1">
                            {/* Step Icon/Circle */}
                            <motion.div
                                className={`relative w-10 h-10 rounded-full flex items-center justify-center text-lg ${isComplete
                                        ? 'bg-primary-500 text-white'
                                        : isCurrent
                                            ? 'bg-secondary-500 text-white ring-4 ring-secondary-200'
                                            : 'bg-gray-200 text-gray-400'
                                    }`}
                                initial={{ scale: 0.8 }}
                                animate={{ scale: isCurrent ? 1.1 : 1 }}
                                transition={{ duration: 0.3 }}
                            >
                                {isComplete ? '✓' : step.icon}

                                {/* Pulse animation for current step */}
                                {isCurrent && (
                                    <motion.div
                                        className="absolute inset-0 rounded-full bg-secondary-400"
                                        initial={{ scale: 1, opacity: 0.5 }}
                                        animate={{ scale: 1.5, opacity: 0 }}
                                        transition={{
                                            duration: 1.5,
                                            repeat: Infinity,
                                            repeatType: 'loop',
                                        }}
                                    />
                                )}
                            </motion.div>

                            {/* Step Label */}
                            <span
                                className={`mt-2 text-xs font-medium ${isComplete || isCurrent ? 'text-gray-800' : 'text-gray-400'
                                    }`}
                            >
                                {step.label}
                            </span>

                            {/* Connector Line */}
                            {index < WORKFLOW_STEPS.length - 1 && (
                                <div className="absolute top-5 left-1/2 w-full h-0.5 -z-10">
                                    <div
                                        className={`h-full ${isComplete ? 'bg-primary-500' : 'bg-gray-200'}`}
                                        style={{ width: 'calc(100% - 2.5rem)' }}
                                    />
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Current Step Description */}
            <div className="mt-6 text-center">
                <p className="text-sm text-gray-700">
                    Currently {workflowStep === 'complete' ? 'completed' : `working on ${WORKFLOW_STEPS[currentStepIndex]?.label.toLowerCase()}`}
                </p>
            </div>
        </div>
    );
}
