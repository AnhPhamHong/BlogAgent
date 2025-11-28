using AgentCore.Application.Commands;
using AgentCore.Domain.Interfaces;
using MediatR;
using Microsoft.Extensions.Logging;

namespace AgentCore.Application.Handlers;

public class GenerateOutlineHandler : IRequestHandler<GenerateOutlineCommand, string>
{
    private readonly IGeminiClient _geminiClient;
    private readonly ILogger<GenerateOutlineHandler> _logger;

    public GenerateOutlineHandler(IGeminiClient geminiClient, ILogger<GenerateOutlineHandler> logger)
    {
        _geminiClient = geminiClient;
        _logger = logger;
    }

    public async Task<string> Handle(GenerateOutlineCommand request, CancellationToken cancellationToken)
    {
        _logger.LogInformation("Generating outline for topic: {Topic}", request.Topic);

        var prompt = $@"You are an expert content strategist and blog writer.

Topic: {request.Topic}

Research Data:
{request.ResearchData}

Based on the topic and research data above, create a detailed blog post outline. The outline should:
- Have a compelling title
- Include an introduction section
- Have 3-5 main sections with descriptive headings
- Include a conclusion section
- Be structured and clear

Provide the outline in markdown format.";

        try
        {
            var outline = await _geminiClient.GenerateContentAsync(prompt);
            _logger.LogInformation("Successfully generated outline for topic: {Topic}", request.Topic);
            return outline;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error generating outline for topic: {Topic}", request.Topic);
            throw;
        }
    }
}
