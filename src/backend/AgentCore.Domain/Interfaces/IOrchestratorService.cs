namespace AgentCore.Domain.Interfaces;

public interface IOrchestratorService
{
    Task<Guid> StartWorkflowAsync(string topic);
    Task ProcessWorkflowAsync(Guid workflowId);
    Task<string> GetStatusAsync(Guid workflowId);
}
