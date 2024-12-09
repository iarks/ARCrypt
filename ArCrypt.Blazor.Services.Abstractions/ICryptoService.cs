

namespace ArCrypt.Blazor.Services.Abstractions;
public interface ICryptoService
{
    Task Initialise();
    Task<byte[]> Encrypt(string plainText, string userKey, string? additionalData);
    Task<byte[]> Decrypt(byte[] cipherText, string userKey, string? additionalData);
}

