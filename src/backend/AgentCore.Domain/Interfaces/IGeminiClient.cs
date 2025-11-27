namespace AgentCore.Domain.Interfaces;

public interface IGeminiClient
{
    Task<string> GenerateContentAsync(string prompt);
}
