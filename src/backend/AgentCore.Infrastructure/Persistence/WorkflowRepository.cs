using AgentCore.Domain.Entities;
using AgentCore.Domain.Interfaces;
using AgentCore.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace AgentCore.Infrastructure.Persistence;

public class WorkflowRepository : IWorkflowRepository
{
    private readonly AgentCoreDbContext _context;

    public WorkflowRepository(AgentCoreDbContext context)
    {
        _context = context;
    }

    public async Task<Workflow?> GetAsync(Guid id)
    {
        return await _context.Workflows.FindAsync(id);
    }

    public async Task<IEnumerable<Workflow>> GetAllAsync()
    {
        return await _context.Workflows.OrderByDescending(w => w.CreatedAt).ToListAsync();
    }

    public async Task SaveAsync(Workflow workflow)
    {
        if (_context.Entry(workflow).State == EntityState.Detached)
        {
            await _context.Workflows.AddAsync(workflow);
        }
        await _context.SaveChangesAsync();
    }
}
