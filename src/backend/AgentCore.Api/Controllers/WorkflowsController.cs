using AgentCore.Application.Commands;
using AgentCore.Application.DTOs;
using AgentCore.Application.Queries;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace AgentCore.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class WorkflowsController : ControllerBase
{
    private readonly IMediator _mediator;
    private readonly ILogger<WorkflowsController> _logger;

    public WorkflowsController(IMediator mediator, ILogger<WorkflowsController> logger)
    {
        _mediator = mediator;
        _logger = logger;
    }

    /// <summary>
    /// List all workflows
    /// </summary>
    [HttpGet]
    [ProducesResponseType(typeof(IEnumerable<WorkflowDto>), StatusCodes.Status200OK)]
    public async Task<ActionResult<IEnumerable<WorkflowDto>>> ListWorkflows()
    {
        try
        {
            var workflows = await _mediator.Send(new ListWorkflowsQuery());
            return Ok(workflows);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error listing workflows");
            return StatusCode(500, "An error occurred while listing workflows");
        }
    }

    /// <summary>
    /// Start a new blog generation workflow
    /// </summary>
    [HttpPost]
    [ProducesResponseType(typeof(WorkflowDto), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<WorkflowDto>> CreateWorkflow([FromBody] CreateWorkflowRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Topic))
        {
            return BadRequest("Topic is required");
        }

        try
        {
            var workflowId = await _mediator.Send(new StartWorkflowCommand(request.Topic, request.Tone));
            
            // Fetch the created workflow to return
            var workflow = await _mediator.Send(new GetWorkflowQuery(workflowId));
            
            return CreatedAtAction(nameof(GetWorkflow), new { id = workflowId }, workflow);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating workflow for topic: {Topic}", request.Topic);
            return StatusCode(500, "An error occurred while creating the workflow");
        }
    }

    /// <summary>
    /// Get the current state of a workflow
    /// </summary>
    [HttpGet("{id}")]
    [ProducesResponseType(typeof(WorkflowDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<WorkflowDto>> GetWorkflow(Guid id)
    {
        try
        {
            var workflow = await _mediator.Send(new GetWorkflowQuery(id));
            return Ok(workflow);
        }
        catch (KeyNotFoundException)
        {
            return NotFound($"Workflow {id} not found");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving workflow: {WorkflowId}", id);
            return StatusCode(500, "An error occurred while retrieving the workflow");
        }
    }

    /// <summary>
    /// Approve the generated outline and proceed to drafting
    /// </summary>
    [HttpPost("{id}/approve-outline")]
    [ProducesResponseType(typeof(WorkflowDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<WorkflowDto>> ApproveOutline(Guid id, [FromBody] ApproveOutlineRequest request)
    {
        try
        {
            var success = await _mediator.Send(new ApproveOutlineCommand(id, request.Notes));
            
            if (!success)
            {
                return BadRequest("Cannot approve outline. Workflow may not be in WaitingApproval state.");
            }

            var workflow = await _mediator.Send(new GetWorkflowQuery(id));
            return Ok(workflow);
        }
        catch (KeyNotFoundException)
        {
            return NotFound($"Workflow {id} not found");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error approving outline for workflow: {WorkflowId}", id);
            return StatusCode(500, "An error occurred while approving the outline");
        }
    }

    /// <summary>
    /// Reject the generated outline and request regeneration
    /// </summary>
    [HttpPost("{id}/reject-outline")]
    [ProducesResponseType(typeof(WorkflowDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<WorkflowDto>> RejectOutline(Guid id, [FromBody] RejectOutlineRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Feedback))
        {
            return BadRequest("Feedback is required when rejecting an outline");
        }

        try
        {
            var success = await _mediator.Send(new RejectOutlineCommand(id, request.Feedback));
            
            if (!success)
            {
                return BadRequest("Cannot reject outline. Workflow may not be in WaitingApproval state.");
            }

            var workflow = await _mediator.Send(new GetWorkflowQuery(id));
            return Ok(workflow);
        }
        catch (KeyNotFoundException)
        {
            return NotFound($"Workflow {id} not found");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error rejecting outline for workflow: {WorkflowId}", id);
            return StatusCode(500, "An error occurred while rejecting the outline");
        }
    }

    /// <summary>
    /// Request revisions to the current draft
    /// </summary>
    [HttpPost("{id}/revise")]
    [ProducesResponseType(typeof(WorkflowDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<WorkflowDto>> ReviseDraft(Guid id, [FromBody] ReviseDraftRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Instructions))
        {
            return BadRequest("Revision instructions are required");
        }

        try
        {
            var success = await _mediator.Send(new ReviseDraftCommand(id, request.Instructions));
            
            if (!success)
            {
                return BadRequest("Cannot revise draft. Workflow may not exist.");
            }

            var workflow = await _mediator.Send(new GetWorkflowQuery(id));
            return Ok(workflow);
        }
        catch (KeyNotFoundException)
        {
            return NotFound($"Workflow {id} not found");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error revising draft for workflow: {WorkflowId}", id);
            return StatusCode(500, "An error occurred while revising the draft");
        }
    }

    /// <summary>
    /// Send a chat message to the agent in the context of this workflow
    /// </summary>
    [HttpPost("{id}/chat")]
    [ProducesResponseType(typeof(ChatResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<ChatResponse>> Chat(Guid id, [FromBody] ChatRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Message))
        {
            return BadRequest("Message is required");
        }

        try
        {
            var response = await _mediator.Send(new ChatCommand(id, request.Message));
            
            return Ok(new ChatResponse { Message = response });
        }
        catch (ArgumentException ex)
        {
            return NotFound(ex.Message);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error processing chat message for workflow: {WorkflowId}", id);
            return StatusCode(500, "An error occurred while processing the chat message");
        }
    }
}

public class ChatResponse
{
    public string Message { get; set; } = string.Empty;
}
