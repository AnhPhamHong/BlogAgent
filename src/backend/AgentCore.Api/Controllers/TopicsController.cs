using AgentCore.Application.Commands;
using AgentCore.Application.DTOs;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace AgentCore.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TopicsController : ControllerBase
{
    private readonly IMediator _mediator;
    private readonly ILogger<TopicsController> _logger;

    public TopicsController(IMediator mediator, ILogger<TopicsController> logger)
    {
        _mediator = mediator;
        _logger = logger;
    }

    /// <summary>
    /// Generate topic suggestions based on keywords and preferences (stateless)
    /// </summary>
    [HttpPost("generate")]
    [ProducesResponseType(typeof(GenerateTopicsResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<GenerateTopicsResponse>> GenerateTopics([FromBody] GenerateTopicsRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Keywords))
        {
            return BadRequest("Keywords are required");
        }

        if (string.IsNullOrWhiteSpace(request.Tone))
        {
            return BadRequest("Tone is required");
        }

        try
        {
            var topics = await _mediator.Send(new GenerateTopicsCommand(
                request.Keywords,
                request.Tone,
                request.TargetWordCount
            ));

            return Ok(new GenerateTopicsResponse { Topics = topics });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error generating topics for keywords: {Keywords}", request.Keywords);
            return StatusCode(500, "An error occurred while generating topic suggestions");
        }
    }
}
