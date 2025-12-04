using AgentCore.Domain.Entities;

namespace AgentCore.Domain.Interfaces;

public interface IWorkflowRepository
{
    Task<Workflow?> GetAsync(Guid id);
    Task<IEnumerable<Workflow>> GetAllAsync();
    Task SaveAsync(Workflow workflow);
}
