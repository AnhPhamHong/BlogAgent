using AgentCore.Application.DTOs;
using MediatR;

namespace AgentCore.Application.Queries;

public record ListWorkflowsQuery : IRequest<IEnumerable<WorkflowDto>>;
