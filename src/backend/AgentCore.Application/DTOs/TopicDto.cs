namespace AgentCore.Application.DTOs;

public class GenerateTopicsRequest
{
    public string Keywords { get; set; } = string.Empty;
    public string Tone { get; set; } = string.Empty;
    public int? TargetWordCount { get; set; }
}

public class TopicSuggestionDto
{
    public string Id { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public int EstimatedWordCount { get; set; }
    public List<string> Keywords { get; set; } = new();
    public string Tone { get; set; } = string.Empty;
}

public class GenerateTopicsResponse
{
    public List<TopicSuggestionDto> Topics { get; set; } = new();
}
