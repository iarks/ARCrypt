namespace Cryptic.Blazor.Model;
public sealed class EncryptionForm
{
    public string Plaintext { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
    public string Ciphertext { get; set; } = string.Empty;
    public MemoryLimits MemoryLimits { get; set; } = MemoryLimits.INTERACTIVE;
    public MemoryLimits OperationsLimits { get; set; } = MemoryLimits.INTERACTIVE;
}