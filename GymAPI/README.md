# Gym API - RESTful API Backend

A comprehensive RESTful API backend for Gym Management System built with modern .NET technologies following Domain-Driven Design (DDD) principles and Clean Architecture.

## 🚀 Technologies Used

- **ASP.NET Core 8.0** - Web API framework
- **Entity Framework Core** - Code First approach with PostgreSQL
- **PostgreSQL** - Primary database
- **MediatR** - CQRS (Command Query Responsibility Segregation) pattern
- **FluentValidation** - Input validation
- **Swagger/OpenAPI** - API documentation
- **Repository Pattern** - Data access abstraction
- **Unit of Work Pattern** - Transaction management
- **Domain-Driven Design (DDD)** - Architecture approach

## 📁 Project Structure

```
GymAPI/
├── src/
│   ├── GymAPI.Domain/           # Domain layer (Entities, Value Objects, Interfaces)
│   │   ├── Common/              # Base entities and common types
│   │   ├── Entities/            # Domain entities
│   │   ├── ValueObjects/        # Enums and value objects
│   │   └── Interfaces/          # Repository interfaces
│   │
│   ├── GymAPI.Application/      # Application layer (CQRS, DTOs, Behaviors)
│   │   ├── Common/              # Common models and DTOs
│   │   ├── Features/            # Feature-based organization
│   │   │   ├── Members/         # Member commands and queries
│   │   │   └── Trainers/        # Trainer commands and queries
│   │   └── Behaviors/           # MediatR pipeline behaviors
│   │
│   ├── GymAPI.Infrastructure/   # Infrastructure layer (Data access, External services)
│   │   ├── Data/                # EF Core DbContext and configurations
│   │   └── Repositories/        # Repository implementations
│   │
│   └── GymAPI.API/              # Presentation layer (Controllers, Startup)
│       ├── Controllers/         # API controllers
│       └── Program.cs           # Application entry point
│
└── README.md
```

## 🏗️ Architecture

This project follows **Clean Architecture** principles with **Domain-Driven Design (DDD)**:

- **Domain Layer**: Contains business entities, value objects, and domain interfaces
- **Application Layer**: Contains application logic, CQRS handlers, and DTOs
- **Infrastructure Layer**: Contains data access implementations and external service integrations
- **API Layer**: Contains controllers and API configuration

### Key Patterns Implemented

1. **CQRS**: Separate commands and queries for better separation of concerns
2. **Repository Pattern**: Abstract data access logic
3. **Unit of Work**: Manage transactions across multiple repositories
4. **Result Pattern**: Consistent error handling and response structure
5. **Validation Pipeline**: Automatic request validation using FluentValidation

## 🏋️ Domain Model

### Core Entities

1. **Member**: Gym members with personal information and membership status
2. **Trainer**: Gym trainers with specializations and certifications
3. **Equipment**: Gym equipment with maintenance tracking
4. **Membership**: Member subscription plans and billing
5. **MembershipPlan**: Available subscription plans
6. **WorkoutSession**: Training sessions with members and trainers
7. **Exercise**: Individual exercises within workout sessions
8. **Booking**: Equipment and trainer reservations

### Value Objects

- Gender, MembershipStatus, TrainerStatus
- SessionType, WorkoutStatus, ExerciseCategory
- EquipmentCategory, EquipmentStatus
- BookingType, BookingStatus

## 🚀 Getting Started

### Prerequisites

- .NET 8.0 SDK
- PostgreSQL 12+ 
- Visual Studio 2022 / VS Code / JetBrains Rider

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd GymAPI
   ```

2. **Install dependencies**
   ```bash
   dotnet restore
   ```

3. **Set up PostgreSQL database**
   - Install PostgreSQL
   - Create a database named `GymApiDb_Dev`
   - Update connection string in `appsettings.Development.json`

4. **Update connection string**
   ```json
   {
     "ConnectionStrings": {
       "DefaultConnection": "Host=localhost;Database=GymApiDb_Dev;Username=your_username;Password=your_password;Port=5432"
     }
   }
   ```

5. **Run database migrations**
   ```bash
   dotnet ef database update --project src/GymAPI.Infrastructure --startup-project src/GymAPI.API
   ```

6. **Run the application**
   ```bash
   dotnet run --project src/GymAPI.API
   ```

7. **Access Swagger UI**
   - Open your browser and navigate to `https://localhost:5001` or `http://localhost:5000`
   - The Swagger UI will be available at the root URL

## 📡 API Endpoints

### Members
- `GET /api/members` - Get all members
- `GET /api/members/{id}` - Get member by ID
- `POST /api/members` - Create new member

### Trainers
- `GET /api/trainers` - Get all trainers
- `POST /api/trainers` - Create new trainer

### Sample Request - Create Member
```json
POST /api/members
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@example.com",
  "phoneNumber": "+1234567890",
  "dateOfBirth": "1990-01-15T00:00:00Z",
  "gender": 1,
  "emergencyContactName": "Jane Doe",
  "emergencyContactPhone": "+1234567891"
}
```

## 🛠️ Development

### Adding New Features

1. **Domain**: Add new entities to `GymAPI.Domain/Entities/`
2. **Application**: Create commands/queries in `GymAPI.Application/Features/`
3. **Infrastructure**: Add repository implementations if needed
4. **API**: Create controllers in `GymAPI.API/Controllers/`

### Database Migrations

```bash
# Add new migration
dotnet ef migrations add MigrationName --project src/GymAPI.Infrastructure --startup-project src/GymAPI.API

# Update database
dotnet ef database update --project src/GymAPI.Infrastructure --startup-project src/GymAPI.API
```

### Running Tests

```bash
# Build the solution
dotnet build

# Run all tests (when test projects are added)
dotnet test
```

## 🔧 Configuration

### Environment Variables
- `ASPNETCORE_ENVIRONMENT`: Set to "Development" for development
- Connection strings can be overridden via environment variables

### Logging
The application uses built-in .NET logging with the following levels:
- Information for general application flow
- Warning for ASP.NET Core events
- Information for Entity Framework commands

## 🗄️ Database Schema

The application uses Code First approach with Entity Framework Core. Key relationships:

- Member → Memberships (One-to-Many)
- Member → WorkoutSessions (One-to-Many)
- Member → Bookings (One-to-Many)
- Trainer → WorkoutSessions (One-to-Many)
- Trainer → Bookings (One-to-Many)
- Equipment → Bookings (One-to-Many)
- WorkoutSession → Exercises (One-to-Many)

## 🔒 Features

- ✅ **Soft Delete**: All entities support soft deletion
- ✅ **Audit Trails**: Automatic CreatedAt/UpdatedAt timestamps
- ✅ **Validation**: Comprehensive input validation
- ✅ **Error Handling**: Consistent error responses
- ✅ **CORS**: Configured for cross-origin requests
- ✅ **Swagger**: Interactive API documentation
- ✅ **Repository Pattern**: Clean data access abstraction
- ✅ **Unit of Work**: Transaction management
- ✅ **CQRS**: Command/Query separation

## 🎯 Future Enhancements

- [ ] Authentication & Authorization (JWT)
- [ ] Role-based access control
- [ ] Caching (Redis)
- [ ] Background jobs (Hangfire)
- [ ] File upload for member photos
- [ ] Email notifications
- [ ] Payment integration
- [ ] Reporting and analytics
- [ ] Mobile app support
- [ ] Integration tests
- [ ] Docker containerization

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

Built with ❤️ using .NET 8 and modern development practices.

---

For more information about the technologies used:
- [ASP.NET Core](https://docs.microsoft.com/en-us/aspnet/core/)
- [Entity Framework Core](https://docs.microsoft.com/en-us/ef/core/)
- [MediatR](https://github.com/jbogard/MediatR)
- [FluentValidation](https://fluentvalidation.net/)
- [PostgreSQL](https://www.postgresql.org/)