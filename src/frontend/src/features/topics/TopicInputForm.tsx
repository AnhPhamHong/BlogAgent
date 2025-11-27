import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';
import { topicInputSchema, type TopicInputFormData } from '@/utils/validation';
import { useGenerateTopicsMutation } from '@/services/api';
import { useAppDispatch } from '@/app/hooks';
import { setTopicSuggestions } from './topicSlice';

const TONE_OPTIONS = [
    { value: 'professional', label: 'Professional' },
    { value: 'casual', label: 'Casual' },
    { value: 'witty', label: 'Witty' },
    { value: 'persuasive', label: 'Persuasive' },
] as const;

export default function TopicInputForm() {
    const dispatch = useAppDispatch();
    const [generateTopics, { isLoading }] = useGenerateTopicsMutation();

    const {
        register,
        handleSubmit,
        formState: { errors },
        watch,
    } = useForm<TopicInputFormData>({
        resolver: zodResolver(topicInputSchema),
        defaultValues: {
            tone: 'professional',
        },
    });

    const keywords = watch('keywords') || '';

    const onSubmit = async (data: TopicInputFormData) => {
        try {
            const result = await generateTopics(data).unwrap();
            dispatch(setTopicSuggestions(result.topics));
            toast.success(`Generated ${result.topics.length} topic ideas!`);
        } catch (error) {
            console.error('Failed to generate topics:', error);
            toast.error('Failed to generate topic ideas. Please try again.');
        }
    };

    return (
        <div className="card">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Generate Blog Topics</h2>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Keywords Input */}
                <div>
                    <label htmlFor="keywords" className="block text-sm font-medium text-gray-700 mb-2">
                        Keywords or Topic
                    </label>
                    <textarea
                        id="keywords"
                        {...register('keywords')}
                        rows={3}
                        className="input-field resize-none"
                        placeholder="Enter keywords or a topic you want to write about..."
                    />
                    <div className="flex justify-between items-center mt-2">
                        <p className="text-sm text-gray-500">
                            {keywords.length} / 200 characters
                        </p>
                        {errors.keywords && (
                            <p className="text-sm text-red-600">{errors.keywords.message}</p>
                        )}
                    </div>
                </div>

                {/* Tone Selector */}
                <div>
                    <label htmlFor="tone" className="block text-sm font-medium text-gray-700 mb-2">
                        Tone
                    </label>
                    <select id="tone" {...register('tone')} className="input-field">
                        {TONE_OPTIONS.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                    {errors.tone && <p className="text-sm text-red-600 mt-1">{errors.tone.message}</p>}
                </div>

                {/* Submit Button */}
                <button type="submit" disabled={isLoading} className="btn-primary w-full">
                    {isLoading ? (
                        <span className="flex items-center justify-center">
                            <svg
                                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                            >
                                <circle
                                    className="opacity-25"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                ></circle>
                                <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                ></path>
                            </svg>
                            Generating Ideas...
                        </span>
                    ) : (
                        'Generate Ideas'
                    )}
                </button>
            </form>
        </div>
    );
}
