using AgentCore.Application.Services;
using AgentCore.Domain.Interfaces;
using AgentCore.Infrastructure;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container
builder.Services.AddInfrastructure(builder.Configuration);
builder.Services.AddScoped<IOrchestratorService, OrchestratorService>();
builder.Services.AddMediatR(cfg => cfg.RegisterServicesFromAssembly(typeof(OrchestratorService).Assembly));

// Add controllers
builder.Services.AddControllers();

// Add API Explorer and OpenAPI
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddOpenApi();

var app = builder.Build();

// Configure the HTTP request pipeline
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
