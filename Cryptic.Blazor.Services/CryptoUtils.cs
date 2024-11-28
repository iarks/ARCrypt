using Microsoft.JSInterop;
using System.Collections.Concurrent;
using System.Text;
using Cryptic.Blazor.Model;

namespace Cryptic.Blazor.Services;
internal static class CryptoUtils
{
    private static ConcurrentDictionary<string, int> _constants = new ConcurrentDictionary<string, int>();

    public static async Task<byte[]> GenerateNonce(this IJSRuntime jSRuntime)
    {
        var nonceLength = await jSRuntime.InvokeAsync<int>("_sodium.getNonceLength");
        var nonce = await jSRuntime.InvokeAsync<byte[]>("_sodium.randombytes_buf", nonceLength);
        return nonce;
    }

    public static async Task<byte[]> GenerateSalt(this IJSRuntime _runtime)
    {
        if (!_constants.TryGetValue("_sodium.getSaltLength", out var saltLength))
        {
            saltLength = await _runtime.InvokeAsync<int>("_sodium.getSaltLength");
            _constants.TryAdd("_sodium.getSaltLength", saltLength);
        }
        var salt = await _runtime.InvokeAsync<byte[]>("_sodium.randombytes_buf", saltLength);
        return salt;
    }

    public static async Task<int> GetOperationsLimit(this IJSRuntime _runtime, MemoryLimits limits)
    {
        string interactiveOpsLimit = "_sodium.operationsLimit."+limits.ToString();
        if (!_constants.TryGetValue(interactiveOpsLimit, out var cachedOpsLimit))
        {
            cachedOpsLimit = await _runtime.InvokeAsync<int>(interactiveOpsLimit);
            _constants.TryAdd(interactiveOpsLimit, cachedOpsLimit);
        }

        return cachedOpsLimit;
    }

    public static async Task<int> GetMemoryLimit(this IJSRuntime _runtime, MemoryLimits limits)
    {
        string interactiveMemoryLimit = "_sodium.memoryLimit." + limits.ToString();

        if (!_constants.TryGetValue(interactiveMemoryLimit, out var cachedMemoryLimit))
        {
            cachedMemoryLimit = await _runtime.InvokeAsync<int>(interactiveMemoryLimit);
            _constants.TryAdd(interactiveMemoryLimit, cachedMemoryLimit);
        }
        return cachedMemoryLimit;
    }


    public static async Task<byte[]> DeriveKey(this IJSRuntime _runtime, string userKey, byte[] salt, int memoryLimit, int operationsLimit)
    {
        byte[] keyBytes = new byte[userKey.Length];
        Encoding.UTF8.GetBytes(userKey, keyBytes);

        var derivedKey = await _runtime.InvokeAsync<byte[]>("_sodium.deriveKey", keyBytes, salt, operationsLimit, memoryLimit);

        return derivedKey;
    }

    public static byte[] PackCipher(this IJSRuntime jSRuntime, int memoryLimit, int opsLimit, byte[] nonce, byte[] salt, byte[] cipherText)
    {
        var memoryLimitBytes = IntToBytesBigEndian(memoryLimit);
        var opsLimitBytes = IntToBytesBigEndian(opsLimit);

        var memoryHeader = new byte[1] { (byte)memoryLimitBytes.Length };
        var opsHeader = new byte[1] { (byte)opsLimitBytes.Length };
        var nonceHeader = new byte[1] { (byte)nonce.Length };
        var saltHeader = new byte[1] { (byte)salt.Length };

        return memoryHeader.Concat(memoryLimitBytes)
            .Concat(opsHeader).Concat(opsLimitBytes)
            .Concat(saltHeader).Concat(salt)
            .Concat(nonceHeader).Concat(nonce)
            .Concat(cipherText)
            .ToArray();
    }

    private static byte[] IntToBytesBigEndian(int? value)
    {
        if (value == null) return [];

        return new byte[]
        {
            (byte)((value >> 24) & 0xFF),
            (byte)((value >> 16) & 0xFF),
            (byte)((value >> 8) & 0xFF),
            (byte)(value & 0xFF)
        };
    }

    private static int BytesToIntBigEndian(byte[] bytes)
    {
        if (bytes.Length != 4) throw new ArgumentException("Invalid byte array length");
        return (bytes[0] << 24) | (bytes[1] << 16) | (bytes[2] << 8) | bytes[3];
    }

    public static (int memoryLimit, int opsLimit, byte[] nonce, byte[] salt, byte[] cipherText) UnpackCipher(this IJSRuntime _runtime, byte[] packedData)
    {
        int offset = 0;

        // Memory limit
        var memoryHeader = packedData[offset];
        offset += 1;
        var memoryLimit = BytesToIntBigEndian(packedData.Skip(offset).Take(memoryHeader).ToArray());
        offset += memoryHeader;

        // Ops limit
        var opsHeader = packedData[offset];
        offset += 1;
        var opsLimit = BytesToIntBigEndian(packedData.Skip(offset).Take(opsHeader).ToArray());
        offset += opsHeader;

        // Salt
        var saltHeader = packedData[offset];
        offset += 1;
        var salt = packedData.Skip(offset).Take(saltHeader).ToArray();
        offset += saltHeader;

        // Nonce
        var nonceHeader = packedData[offset];
        offset += 1;
        var nonce = packedData.Skip(offset).Take(nonceHeader).ToArray();
        offset += nonceHeader;

        // Cipher text
        var cipherText = packedData.Skip(offset).ToArray();

        return (memoryLimit, opsLimit, nonce, salt, cipherText);
    }
}
