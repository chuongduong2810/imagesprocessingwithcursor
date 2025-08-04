#!/bin/bash

echo "Setting up Gym API Development Database..."

# Start PostgreSQL container if not running
if ! docker ps | grep -q "gym-api-postgres"; then
    echo "Starting PostgreSQL container..."
    docker-compose up -d postgres
    
    # Wait for PostgreSQL to be ready
    echo "Waiting for PostgreSQL to be ready..."
    sleep 10
fi

# Run EF Core migrations
echo "Running database migrations..."
dotnet ef database update --project src/GymAPI.Infrastructure --startup-project src/GymAPI.API

echo "Database setup complete!"
echo "You can now start the API with: dotnet run --project src/GymAPI.API"