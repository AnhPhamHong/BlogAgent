using MediatR;

namespace AgentCore.Application.Commands;

public record ResearchCommand(string Topic) : IRequest<string>;
public record GenerateOutlineCommand(string Topic, string ResearchData) : IRequest<string>;
public record GenerateDraftCommand(string Topic, string Outline) : IRequest<string>;
public record EditContentCommand(string Draft) : IRequest<string>;
public record AnalyzeSeoCommand(string Content) : IRequest<string>;

// Workflow Management Commands
public record StartWorkflowCommand(string Topic, string? Tone) : IRequest<Guid>;
public record ApproveOutlineCommand(Guid WorkflowId, string? Notes) : IRequest<bool>;
public record RejectOutlineCommand(Guid WorkflowId, string Feedback) : IRequest<bool>;
public record ReviseDraftCommand(Guid WorkflowId, string Instructions) : IRequest<bool>;
public record ChatCommand(Guid WorkflowId, string Message) : IRequest<string>;
