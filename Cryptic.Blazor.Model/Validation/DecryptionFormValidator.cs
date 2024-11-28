using FluentValidation;

namespace Cryptic.Blazor.Model.Validation;

public class DecryptionFormValidator : AbstractValidator<EncryptionForm>
{
    public DecryptionFormValidator()
    {
        RuleFor(f => f.Ciphertext).NotEmpty().WithMessage("Ciphertext is required");
        RuleFor(f => f.Password).NotEmpty().WithMessage("Password is required");
    }
}

