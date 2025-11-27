using AgentCore.Domain.Entities;

namespace AgentCore.Domain.Interfaces;

public interface IWorkflowRepository
{
    Task<Workflow?> GetAsync(Guid id);
    Task SaveAsync(Workflow workflow);
}
