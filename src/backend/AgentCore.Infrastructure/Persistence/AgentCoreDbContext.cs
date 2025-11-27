using AgentCore.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace AgentCore.Infrastructure.Persistence;

public class AgentCoreDbContext : DbContext
{
    public AgentCoreDbContext(DbContextOptions<AgentCoreDbContext> options) : base(options)
    {
    }

    public DbSet<Workflow> Workflows { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<Workflow>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Topic).IsRequired();
            entity.Property(e => e.State).HasConversion<string>();
        });
    }
}
