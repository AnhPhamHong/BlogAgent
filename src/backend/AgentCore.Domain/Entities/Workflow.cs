using AgentCore.Domain.Enums;

namespace AgentCore.Domain.Entities;

public class Workflow
{
    public Guid Id { get; private set; }
    public string Topic { get; private set; }
    public WorkflowState State { get; private set; }
    public string? ResearchData { get; private set; }
    public string? Outline { get; private set; }
    public string? DraftContent { get; private set; }
    public DateTime UpdatedAt { get; private set; }

    public Workflow(string topic)
    {
        Id = Guid.NewGuid();
        Topic = topic;
        State = WorkflowState.Idle;
        UpdatedAt = DateTime.UtcNow;
    }

    public void TransitionTo(WorkflowState newState)
    {
        // Add validation logic here if needed
        State = newState;
        UpdatedAt = DateTime.UtcNow;
    }

    public void UpdateResearch(string data)
    {
        ResearchData = data;
        UpdatedAt = DateTime.UtcNow;
    }

    public void SetOutline(string outline)
    {
        Outline = outline;
        UpdatedAt = DateTime.UtcNow;
    }

    public void SetDraft(string draft)
    {
        DraftContent = draft;
        UpdatedAt = DateTime.UtcNow;
    }
}
