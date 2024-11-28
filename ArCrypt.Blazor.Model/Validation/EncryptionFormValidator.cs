using System.ComponentModel.DataAnnotations;

namespace ArCrypt.Blazor.Model.Validation;

public class EncryptionFormValidator : ValidationAttribute
{
    protected override ValidationResult IsValid(object? value, ValidationContext validationContext)
    {
        var model = (EncryptionForm)validationContext.ObjectInstance;

        if (string.IsNullOrWhiteSpace(model.Plaintext))
        {
            return new ValidationResult("Plaintext is required for encryption.", new[] { nameof(model.Plaintext) });
        }

        if (string.IsNullOrWhiteSpace(model.Password))
        {
            return new ValidationResult("Password is required for encryption.", new[] { nameof(model.Password) });
        }

        return ValidationResult.Success!;
    }
}

