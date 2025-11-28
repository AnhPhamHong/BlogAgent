using AgentCore.Application.Commands;
using AgentCore.Domain.Interfaces;
using MediatR;
using Microsoft.Extensions.Logging;

namespace AgentCore.Application.Handlers;

public class GenerateDraftHandler : IRequestHandler<GenerateDraftCommand, string>
{
    private readonly IGeminiClient _geminiClient;
    private readonly ILogger<GenerateDraftHandler> _logger;

    public GenerateDraftHandler(IGeminiClient geminiClient, ILogger<GenerateDraftHandler> logger)
    {
        _geminiClient = geminiClient;
        _logger = logger;
    }

    public async Task<string> Handle(GenerateDraftCommand request, CancellationToken cancellationToken)
    {
        _logger.LogInformation("Generating draft for topic: {Topic}", request.Topic);

        var prompt = $@"You are an expert blog writer.

Topic: {request.Topic}

Outline:
{request.Outline}

Based on the topic and outline above, write a complete, engaging blog post. The blog post should:
- Follow the provided outline structure
- Be informative and well-researched
- Use a clear, professional writing style
- Be approximately 800-1200 words
- Include smooth transitions between sections
- Have a strong introduction and conclusion

Write the complete blog post in markdown format.";

        try
        {
            var draft = await _geminiClient.GenerateContentAsync(prompt);
            _logger.LogInformation("Successfully generated draft for topic: {Topic}", request.Topic);
            return draft;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error generating draft for topic: {Topic}", request.Topic);
            throw;
        }
    }
}
