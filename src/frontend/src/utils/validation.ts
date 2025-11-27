import { z } from 'zod';

export const topicInputSchema = z.object({
    keywords: z
        .string()
        .min(3, 'Keywords must be at least 3 characters')
        .max(200, 'Keywords must not exceed 200 characters'),
    tone: z.enum(['professional', 'casual', 'witty', 'persuasive'], {
        required_error: 'Please select a tone',
    }),
    targetWordCount: z.number().min(300).max(5000).optional(),
});

export type TopicInputFormData = z.infer<typeof topicInputSchema>;
