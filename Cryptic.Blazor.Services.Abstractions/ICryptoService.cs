using Cryptic.Blazor.Model;

namespace Cryptic.Blazor.Services.Abstractions;
public interface ICryptoService
{
    Task Initialise();
    Task<byte[]> Encrypt(string plainText, string userKey, MemoryLimits memLimit, int? memoryLimit, MemoryLimits opLimit, int? opsLimit, string? additionalData);
    Task<byte[]> Decrypt(byte[] cipherText, string userKey, string? additionalData);
}

