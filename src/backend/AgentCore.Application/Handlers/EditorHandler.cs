using AgentCore.Application.Commands;
using AgentCore.Domain.Interfaces;
using MediatR;
using Microsoft.Extensions.Logging;
using System.Text.Json;
using System.Text.RegularExpressions;

namespace AgentCore.Application.Handlers;

public class EditorHandler : IRequestHandler<EditContentCommand, EditedContent>
{
    private readonly IGeminiClient _geminiClient;
    private readonly ILogger<EditorHandler> _logger;

    public EditorHandler(IGeminiClient geminiClient, ILogger<EditorHandler> logger)
    {
        _geminiClient = geminiClient;
        _logger = logger;
    }

    public async Task<EditedContent> Handle(EditContentCommand request, CancellationToken cancellationToken)
    {
        _logger.LogInformation("Editing content with tone: {Tone}", request.TargetTone);

        var prompt = $@"
You are an expert editor. Review the following blog post draft and improve it for grammar, clarity, flow, and tone consistency.

Target Tone: {request.TargetTone}

Draft Content:
{request.DraftContent}

Please provide the output in the following JSON format:
{{
    ""content"": ""The full edited content in markdown format"",
    ""changes"": [
        ""List of specific major changes made (e.g., 'Fixed grammar in paragraph 2', 'Improved transition between section A and B')""
    ]
}}

Ensure the JSON is valid and the content is properly escaped. Do not include any markdown formatting around the JSON (like ```json).
";

        try
        {
            var response = await _geminiClient.GenerateContentAsync(prompt);
            
            // Clean up response if it contains markdown code blocks
            var cleanResponse = response.Trim();
            if (cleanResponse.StartsWith("```json"))
            {
                cleanResponse = cleanResponse.Substring(7);
                if (cleanResponse.EndsWith("```"))
                {
                    cleanResponse = cleanResponse.Substring(0, cleanResponse.Length - 3);
                }
            }
            else if (cleanResponse.StartsWith("```"))
            {
                cleanResponse = cleanResponse.Substring(3);
                if (cleanResponse.EndsWith("```"))
                {
                    cleanResponse = cleanResponse.Substring(0, cleanResponse.Length - 3);
                }
            }

            var options = new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true
            };

            try 
            {
                var result = JsonSerializer.Deserialize<EditedContent>(cleanResponse, options);
                if (result == null)
                {
                    throw new JsonException("Deserialized result is null");
                }
                
                _logger.LogInformation("Successfully edited content. Changes: {ChangeCount}", result.Changes.Count);
                return result;
            }
            catch (JsonException)
            {
                // Fallback if JSON parsing fails - try to extract content manually or just return raw response as content
                _logger.LogWarning("Failed to parse JSON response from Editor Agent. Falling back to raw text.");
                
                // Simple fallback: assume the whole text is the content if JSON fails, or try to salvage
                return new EditedContent(response, new List<string> { "Automated editing (parsing details failed)" });
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error editing content");
            throw;
        }
    }
}
