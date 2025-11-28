using AgentCore.Application.DTOs;
using MediatR;

namespace AgentCore.Application.Queries;

public record GetWorkflowQuery(Guid WorkflowId) : IRequest<WorkflowDto>;
