using FluentValidation;

namespace GymAPI.Application.Features.Members.Commands.CreateMember;

public class CreateMemberCommandValidator : AbstractValidator<CreateMemberCommand>
{
    public CreateMemberCommandValidator()
    {
        RuleFor(x => x.FirstName)
            .NotEmpty().WithMessage("First name is required.")
            .MaximumLength(50).WithMessage("First name must not exceed 50 characters.");

        RuleFor(x => x.LastName)
            .NotEmpty().WithMessage("Last name is required.")
            .MaximumLength(50).WithMessage("Last name must not exceed 50 characters.");

        RuleFor(x => x.Email)
            .NotEmpty().WithMessage("Email is required.")
            .EmailAddress().WithMessage("A valid email address is required.")
            .MaximumLength(100).WithMessage("Email must not exceed 100 characters.");

        RuleFor(x => x.PhoneNumber)
            .NotEmpty().WithMessage("Phone number is required.")
            .Matches(@"^\+?[1-9]\d{1,14}$").WithMessage("Please enter a valid phone number.");

        RuleFor(x => x.DateOfBirth)
            .Must(BeAtLeast16YearsOld).WithMessage("Member must be at least 16 years old.")
            .Must(NotBeFutureDate).WithMessage("Date of birth cannot be in the future.");

        RuleFor(x => x.EmergencyContactName)
            .NotEmpty().WithMessage("Emergency contact name is required.")
            .MaximumLength(100).WithMessage("Emergency contact name must not exceed 100 characters.");

        RuleFor(x => x.EmergencyContactPhone)
            .NotEmpty().WithMessage("Emergency contact phone is required.")
            .Matches(@"^\+?[1-9]\d{1,14}$").WithMessage("Please enter a valid emergency contact phone number.");
    }

    private static bool BeAtLeast16YearsOld(DateTime dateOfBirth)
    {
        return DateTime.Today.AddYears(-16) >= dateOfBirth;
    }

    private static bool NotBeFutureDate(DateTime dateOfBirth)
    {
        return dateOfBirth <= DateTime.Today;
    }
}