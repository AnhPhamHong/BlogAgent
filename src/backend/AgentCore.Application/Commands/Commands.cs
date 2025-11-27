using MediatR;

namespace AgentCore.Application.Commands;

public record ResearchCommand(string Topic) : IRequest<string>;
public record GenerateOutlineCommand(string Topic, string ResearchData) : IRequest<string>;
public record GenerateDraftCommand(string Topic, string Outline) : IRequest<string>;
public record EditContentCommand(string Draft) : IRequest<string>;
public record AnalyzeSeoCommand(string Content) : IRequest<string>;
