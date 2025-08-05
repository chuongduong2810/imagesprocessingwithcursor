using FluentValidation;
using GymAPI.Application.Common.Behaviors;
using GymAPI.Application.Features.WorkoutSuggestions;
using MediatR;
using Microsoft.Extensions.DependencyInjection;
using System.Reflection;

namespace GymAPI.Application;

public static class DependencyInjection
{
    public static IServiceCollection AddApplication(this IServiceCollection services)
    {
        services.AddMediatR(cfg => cfg.RegisterServicesFromAssembly(Assembly.GetExecutingAssembly()));
        
        services.AddValidatorsFromAssembly(Assembly.GetExecutingAssembly());
        
        services.AddTransient(typeof(IPipelineBehavior<,>), typeof(ValidationBehavior<,>));
        
        // Register Gemini Workout Suggestion Service
        services.AddScoped<IGeminiWorkoutSuggestionService, GeminiWorkoutSuggestionService>();
        
        return services;
    }
}