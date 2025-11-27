using AgentCore.Application.Commands;
using AgentCore.Domain.Entities;
using AgentCore.Domain.Enums;
using AgentCore.Domain.Interfaces;
using MediatR;

namespace AgentCore.Application.Services;

public class OrchestratorService : IOrchestratorService
{
    private readonly IMediator _mediator;
    private readonly IWorkflowRepository _repository;

    public OrchestratorService(IMediator mediator, IWorkflowRepository repository)
    {
        _mediator = mediator;
        _repository = repository;
    }

    public async Task<Guid> StartWorkflowAsync(string topic)
    {
        var workflow = new Workflow(topic);
        await _repository.SaveAsync(workflow);
        
        // Start processing in background (fire and forget for now, or just return ID)
        // In a real app, this might be a background job.
        // For this POC, we'll assume the client calls ProcessWorkflowAsync explicitly or we trigger it here.
        
        return workflow.Id;
    }

    public async Task ProcessWorkflowAsync(Guid workflowId)
    {
        var workflow = await _repository.GetAsync(workflowId);
        if (workflow == null) throw new ArgumentException("Workflow not found", nameof(workflowId));

        switch (workflow.State)
        {
            case WorkflowState.Idle:
                workflow.TransitionTo(WorkflowState.Researching);
                break;

            case WorkflowState.Researching:
                var researchData = await _mediator.Send(new ResearchCommand(workflow.Topic));
                workflow.UpdateResearch(researchData);
                workflow.TransitionTo(WorkflowState.Outlining);
                break;

            case WorkflowState.Outlining:
                if (string.IsNullOrEmpty(workflow.ResearchData)) throw new InvalidOperationException("Research data missing");
                var outline = await _mediator.Send(new GenerateOutlineCommand(workflow.Topic, workflow.ResearchData));
                workflow.SetOutline(outline);
                workflow.TransitionTo(WorkflowState.WaitingApproval);
                break;

            case WorkflowState.WaitingApproval:
                // Needs manual intervention. 
                // In a real app, we'd stop here. 
                // For auto-pilot mode, we might auto-approve.
                // Let's assume we auto-approve for now to move to Drafting.
                workflow.TransitionTo(WorkflowState.Drafting);
                break;

            case WorkflowState.Drafting:
                 if (string.IsNullOrEmpty(workflow.Outline)) throw new InvalidOperationException("Outline missing");
                var draft = await _mediator.Send(new GenerateDraftCommand(workflow.Topic, workflow.Outline));
                workflow.SetDraft(draft);
                workflow.TransitionTo(WorkflowState.Editing);
                break;

            case WorkflowState.Editing:
                if (string.IsNullOrEmpty(workflow.DraftContent)) throw new InvalidOperationException("Draft content missing");
                var edited = await _mediator.Send(new EditContentCommand(workflow.DraftContent));
                workflow.SetDraft(edited); // Update draft with edited version
                workflow.TransitionTo(WorkflowState.Optimizing);
                break;

            case WorkflowState.Optimizing:
                 if (string.IsNullOrEmpty(workflow.DraftContent)) throw new InvalidOperationException("Draft content missing");
                var seoResult = await _mediator.Send(new AnalyzeSeoCommand(workflow.DraftContent));
                // We might store SEO result, but for now just finish
                workflow.TransitionTo(WorkflowState.Final);
                break;
                
            case WorkflowState.Final:
                // Already done
                break;
        }

        await _repository.SaveAsync(workflow);
    }

    public async Task<string> GetStatusAsync(Guid workflowId)
    {
        var workflow = await _repository.GetAsync(workflowId);
        return workflow?.State.ToString() ?? "NotFound";
    }
}
