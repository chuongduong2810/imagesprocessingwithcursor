# Gemini AI Workout Suggestion Integration

This document explains how to use the Google Gemini AI integration for generating personalized workout schedules in the Gym API.

## 🎯 Overview

The Gemini integration provides AI-powered workout suggestions based on user profiles including:
- Personal characteristics (age, gender, weight, height)
- Fitness goals (gain muscle, lose fat, maintain fitness)
- Available equipment
- Workout frequency preferences

## 🔧 Setup Instructions

### 1. Get Google Gemini API Key

1. Go to [Google AI Studio](https://aistudio.google.com/)
2. Sign in with your Google account
3. Create a new API key
4. Copy the generated API key

### 2. Configure the API Key

Add your Gemini API key to the configuration files:

**appsettings.json:**
```json
{
  "Gemini": {
    "ApiKey": "YOUR_ACTUAL_GEMINI_API_KEY_HERE",
    "ApiUrl": "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent",
    "Model": "gemini-1.5-flash-latest"
  }
}
```

**appsettings.Development.json:**
```json
{
  "Gemini": {
    "ApiKey": "YOUR_ACTUAL_GEMINI_API_KEY_HERE",
    "ApiUrl": "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent",
    "Model": "gemini-1.5-flash-latest"
  }
}
```

### 3. Environment Variables (Optional)

For production, consider using environment variables:
```bash
export Gemini__ApiKey="your_api_key_here"
```

## 📡 API Endpoint

### POST /api/schedule/suggest

Generates a personalized 7-day workout schedule based on user profile.

**Request Body:**
```json
{
  "gender": "Male",
  "age": 25,
  "weight": 70,
  "height": 175,
  "goal": "Gain Muscle",
  "workoutDaysPerWeek": 5,
  "equipment": "Dumbbells, Resistance Bands",
  "additionalNotes": "I want to focus on upper body strength"
}
```

**Field Descriptions:**
- `gender`: "Male" or "Female"
- `age`: Age in years (10-100)
- `weight`: Weight in kg (30-300)
- `height`: Height in cm (100-250)
- `goal`: "Gain Muscle", "Lose Fat", or "Maintain"
- `workoutDaysPerWeek`: Number of workout days (1-7)
- `equipment`: Available equipment (e.g., "Dumbbells", "No Equipment", "Full Gym Access")
- `additionalNotes`: Optional additional preferences or notes

**Response:**
```json
{
  "weeklyPlan": {
    "Monday": ["Push-ups 3x10", "Plank 3x30sec", "Squats 3x15"],
    "Tuesday": ["Rest"],
    "Wednesday": ["Lunges 3x12", "Mountain Climbers 3x15", "Burpees 3x8"],
    "Thursday": ["Rest"],
    "Friday": ["Pull-ups 3x8", "Jumping Jacks 3x20", "Calf Raises 3x15"],
    "Saturday": ["Rest"],
    "Sunday": ["Rest"]
  },
  "additionalTips": "Focus on proper form and progressive overload...",
  "isSuccess": true,
  "errorMessage": null
}
```

## 🔍 Usage Examples

### Example 1: Beginner Female - Fat Loss
```bash
curl -X POST "https://localhost:7162/api/schedule/suggest" \
  -H "Content-Type: application/json" \
  -d '{
    "gender": "Female",
    "age": 28,
    "weight": 65,
    "height": 165,
    "goal": "Lose Fat",
    "workoutDaysPerWeek": 4,
    "equipment": "No Equipment",
    "additionalNotes": "I prefer bodyweight exercises and cardio"
  }'
```

### Example 2: Experienced Male - Muscle Gain
```bash
curl -X POST "https://localhost:7162/api/schedule/suggest" \
  -H "Content-Type: application/json" \
  -d '{
    "gender": "Male",
    "age": 25,
    "weight": 70,
    "height": 175,
    "goal": "Gain Muscle",
    "workoutDaysPerWeek": 5,
    "equipment": "Dumbbells, Resistance Bands",
    "additionalNotes": "I want to focus on upper body strength"
  }'
```

## 🏗️ Architecture

### Components

1. **GeminiConfig** - Configuration settings for Gemini API
2. **WorkoutSuggestionRequest** - Request model with validation
3. **WorkoutSuggestionResponse** - Response model with weekly plan
4. **IGeminiWorkoutSuggestionService** - Service interface
5. **GeminiWorkoutSuggestionService** - Implementation with HTTP client
6. **ScheduleController** - API controller with endpoint

### Data Flow

1. Client sends POST request to `/api/schedule/suggest`
2. Request is validated using data annotations
3. Service builds intelligent prompt for Gemini AI
4. HTTP request is sent to Google Gemini API
5. AI response is parsed and structured
6. Weekly workout plan is returned to client

## 🛡️ Error Handling

The integration includes comprehensive error handling:

- **Validation Errors**: Invalid input data returns 400 Bad Request
- **API Failures**: Gemini API errors are logged and return structured error response
- **Network Issues**: Timeout and connectivity issues are handled gracefully
- **Parsing Errors**: If AI response cannot be parsed, a default workout plan is provided

## 🔒 Security Considerations

1. **API Key Protection**: Never commit API keys to version control
2. **Rate Limiting**: Consider implementing rate limiting for the endpoint
3. **Input Validation**: All user inputs are validated before sending to AI
4. **Error Information**: Sensitive error details are not exposed to clients

## 📊 Monitoring and Logging

The service includes structured logging for:
- API request/response timing
- Gemini API errors
- JSON parsing issues
- Service-level errors

Logs can be monitored using standard ASP.NET Core logging infrastructure.

## 🚀 Performance Considerations

- **Caching**: Consider caching similar requests to reduce API calls
- **Timeout**: HTTP client timeout is set to 30 seconds
- **Async Operations**: All operations are fully asynchronous
- **Resource Management**: HttpClient is properly managed through DI

## 🧪 Testing

Use the provided HTTP examples in `Examples/WorkoutSuggestion.http` to test the integration:

1. Start the application: `dotnet run`
2. Open the HTTP file in your IDE
3. Execute the example requests
4. Verify the responses contain valid workout plans

## 🔄 Customization

To customize the AI prompts or response parsing:

1. Modify the `BuildPrompt()` method in `GeminiWorkoutSuggestionService`
2. Adjust the `ParseWorkoutPlan()` method for different response formats
3. Update the `GetDefaultWorkoutPlan()` method for fallback scenarios

## 📝 Notes

- The integration uses Gemini 1.5 Flash model for fast and cost-effective responses
- Workout plans are generated in real-time based on user profiles
- The system includes fallback mechanisms for reliability
- All API interactions are logged for debugging and monitoring