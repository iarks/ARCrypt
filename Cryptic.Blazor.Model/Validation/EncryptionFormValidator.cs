using FluentValidation;

namespace Cryptic.Blazor.Model.Validation;

public class EncryptionFormValidator : AbstractValidator<EncryptionForm>
{
    public EncryptionFormValidator()
    {
        RuleFor(f => f.Plaintext).NotEmpty().WithMessage("Plaintext is required");
        RuleFor(f => f.Password).NotEmpty().WithMessage("Password is required");
    }
}

