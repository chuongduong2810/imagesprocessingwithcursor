using GymAPI.Application;
using GymAPI.Application.Features.WorkoutSuggestions;
using GymAPI.Infrastructure;
using GymAPI.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();

// Add Swagger/OpenAPI
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new() 
    { 
        Title = "Gym API", 
        Version = "v1",
        Description = "A comprehensive RESTful API for Gym Management System built with ASP.NET Core, Entity Framework Core, and PostgreSQL",
        Contact = new()
        {
            Name = "Gym API Support",
            Email = "support@gymapi.com"
        }
    });
});

// Add CORS
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

// Add Application and Infrastructure layers
builder.Services.AddApplication();
builder.Services.AddInfrastructure(builder.Configuration);

// Configure Gemini API
builder.Services.Configure<GeminiConfig>(
    builder.Configuration.GetSection(GeminiConfig.SectionName));

// Add HttpClient for Gemini API
builder.Services.AddHttpClient<IGeminiWorkoutSuggestionService, GeminiWorkoutSuggestionService>(client =>
{
    client.Timeout = TimeSpan.FromSeconds(30);
    client.DefaultRequestHeaders.Add("User-Agent", "GymAPI/1.0");
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "Gym API v1");
        c.RoutePrefix = string.Empty; // Set Swagger UI at the app's root
    });
}

app.UseHttpsRedirection();
app.UseCors();

// Enable serving static files for uploaded media
app.UseStaticFiles();

app.UseAuthorization();

app.MapControllers();

// Auto-migrate database in development
if (app.Environment.IsDevelopment())
{
    using var scope = app.Services.CreateScope();
    var context = scope.ServiceProvider.GetRequiredService<GymDbContext>();
    await context.Database.MigrateAsync();
}

app.Run();
