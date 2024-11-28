namespace ArCrypt.Blazor.Model;
public sealed class EncryptionForm
{
    public string Plaintext { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
    public string Ciphertext { get; set; } = string.Empty;

    public void Reset()
    {
        Plaintext = string.Empty;
        Password = string.Empty;
        Ciphertext = string.Empty;
    }
}