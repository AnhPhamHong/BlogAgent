using AgentCore.Application.Commands;
using AgentCore.Application.DTOs;
using AgentCore.Domain.Interfaces;
using MediatR;
using Microsoft.Extensions.Logging;
using System.Text.Json;

namespace AgentCore.Application.Handlers;

public class GenerateTopicsHandler : IRequestHandler<GenerateTopicsCommand, List<TopicSuggestionDto>>
{
    private readonly IGeminiClient _geminiClient;
    private readonly ILogger<GenerateTopicsHandler> _logger;

    public GenerateTopicsHandler(IGeminiClient geminiClient, ILogger<GenerateTopicsHandler> logger)
    {
        _geminiClient = geminiClient;
        _logger = logger;
    }

    public async Task<List<TopicSuggestionDto>> Handle(GenerateTopicsCommand request, CancellationToken cancellationToken)
    {
        try
        {
            var prompt = BuildPrompt(request.Keywords, request.Tone, request.TargetWordCount);
            _logger.LogInformation("Generating topics for keywords: {Keywords}, tone: {Tone}", request.Keywords, request.Tone);

            var response = await _geminiClient.GenerateContentAsync(prompt);
            
            var topics = ParseTopicsFromResponse(response, request.Tone, request.TargetWordCount ?? 1000);
            
            _logger.LogInformation("Successfully generated {Count} topic suggestions", topics.Count);
            return topics;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error generating topics for keywords: {Keywords}", request.Keywords);
            throw;
        }
    }

    private string BuildPrompt(string keywords, string tone, int? targetWordCount)
    {
        var wordCount = targetWordCount ?? 1000;
        
        return $@"Generate 5 blog post topic suggestions based on the following keywords: ""{keywords}""

Requirements:
- Tone: {tone}
- Target word count: approximately {wordCount} words
- Each topic should be engaging and searchable

For each topic, provide:
1. A compelling title
2. A brief description (2-3 sentences)
3. 3-5 relevant keywords
4. Estimated word count

Format your response as a JSON array with this structure:
[
  {{
    ""title"": ""Example Blog Title"",
    ""description"": ""Brief description of what this blog post will cover."",
    ""keywords"": [""keyword1"", ""keyword2"", ""keyword3""],
    ""estimatedWordCount"": 1000
  }}
]

Return ONLY the JSON array, no additional text.";
    }

    private List<TopicSuggestionDto> ParseTopicsFromResponse(string response, string tone, int defaultWordCount)
    {
        try
        {
            // Clean up the response - remove markdown code blocks if present
            var jsonContent = response.Trim();
            if (jsonContent.StartsWith("```json"))
            {
                jsonContent = jsonContent.Substring(7);
            }
            if (jsonContent.StartsWith("```"))
            {
                jsonContent = jsonContent.Substring(3);
            }
            if (jsonContent.EndsWith("```"))
            {
                jsonContent = jsonContent.Substring(0, jsonContent.Length - 3);
            }
            jsonContent = jsonContent.Trim();

            var topics = JsonSerializer.Deserialize<List<TopicSuggestionDto>>(jsonContent, new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true
            }) ?? new List<TopicSuggestionDto>();

            // Assign IDs and tone to each topic
            foreach (var topic in topics)
            {
                topic.Id = Guid.NewGuid().ToString();
                topic.Tone = tone;
                
                // Ensure we have reasonable defaults
                if (topic.EstimatedWordCount == 0)
                {
                    topic.EstimatedWordCount = defaultWordCount;
                }
                if (topic.Keywords == null || !topic.Keywords.Any())
                {
                    topic.Keywords = new List<string> { tone, "blog" };
                }
            }

            return topics;
        }
        catch (JsonException ex)
        {
            _logger.LogError(ex, "Failed to parse topics from Gemini response: {Response}", response);
            
            // Return a fallback topic so the user doesn't get an empty list
            return new List<TopicSuggestionDto>
            {
                new TopicSuggestionDto
                {
                    Id = Guid.NewGuid().ToString(),
                    Title = $"Blog Post about {tone} Content",
                    Description = "An engaging blog post based on your keywords.",
                    EstimatedWordCount = defaultWordCount,
                    Keywords = new List<string> { tone },
                    Tone = tone
                }
            };
        }
    }
}
