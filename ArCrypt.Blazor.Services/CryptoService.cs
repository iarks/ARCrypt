using ArCrypt.Blazor.Services.Abstractions;
using Microsoft.JSInterop;
using System.Collections.Concurrent;
using System.Text;

namespace ArCrypt.Blazor.Services;

internal class CryptoService : ICryptoService
{
    private bool _isInit = false;
    private readonly IJSRuntime _runtime;

    private static ConcurrentDictionary<string, int> _constants = new ConcurrentDictionary<string, int>();

    public CryptoService(IJSRuntime jSRuntime)
    {
        _runtime = jSRuntime;
    }

    public async Task Initialise()
    {
        if (_isInit)
        {
            return;
        }

        await _runtime.InvokeVoidAsync("_sodium.ready");
        _isInit = true;
    }

    public async Task<byte[]> Encrypt(string plainText, string userKey, string? additionalData)
    {
        var nonceLength = await _runtime.InvokeAsync<int>("_sodium.getNonceLength");
        var nonce = await _runtime.InvokeAsync<byte[]>("_sodium.randombytes_buf", nonceLength);

        var generateSaltTask = GenerateSalt();
        var memoryLimitTask = GetMemoryLimit();
        var opsLimitTask = GetOperationsLimit();

        await Task.WhenAll(generateSaltTask, memoryLimitTask, opsLimitTask);

        var salt = await generateSaltTask;
        var memoryLimit = await memoryLimitTask;
        var opsLimit = await opsLimitTask;

        var generatedKey = await DeriveKey(userKey, salt, memoryLimit, opsLimit);
        var cipherText = await _runtime.InvokeAsync<byte[]>("_sodium.crypto_aead_xchacha20poly1305_ietf_encrypt", plainText, additionalData, null, nonce, generatedKey);

        var packedCipher = PackCipher(memoryLimit, opsLimit, nonce, salt, cipherText);

        var plaintext = await Decrypt(packedCipher, userKey, additionalData);

        return packedCipher;
    }

    public async Task<byte[]> Decrypt(byte[] cipherText, string userKey, string? additionalData)
    {
        var unpackedCipher = await UnpackCipher(cipherText);
        var derivedKey = await DeriveKey(userKey, unpackedCipher.salt, unpackedCipher.memoryLimit, unpackedCipher.opsLimit);
        var plainText = await _runtime.InvokeAsync<byte[]>("_sodium.crypto_aead_xchacha20poly1305_ietf_decrypt", null, unpackedCipher.cipherText, additionalData, unpackedCipher.nonce, derivedKey);
        return plainText;
    }

    private async Task<byte[]> DeriveKey(string userKey, byte[] salt, int memoryLimit, int operationsLimit)
    {
        byte[] keyBytes = new byte[userKey.Length];
        Encoding.UTF8.GetBytes(userKey, keyBytes);

        var derivedKey = await _runtime.InvokeAsync<byte[]>("_sodium.deriveKey", keyBytes, salt, operationsLimit, memoryLimit);

        return derivedKey;
    }

    private async Task<int> GetOperationsLimit()
    {
        const string interactiveOpsLimit = "_sodium.operationsLimit.INTERACTIVE";
        if (!_constants.TryGetValue(interactiveOpsLimit, out var cachedOpsLimit))
        {
            cachedOpsLimit = await _runtime.InvokeAsync<int>(interactiveOpsLimit);
            _constants.TryAdd(interactiveOpsLimit, cachedOpsLimit);
        }

        return cachedOpsLimit;
    }

    private async Task<int> GetMemoryLimit()
    {
        const string interactiveMemoryLimit = "_sodium.memoryLimit.INTERACTIVE";

        if (!_constants.TryGetValue(interactiveMemoryLimit, out var cachedMemoryLimit))
        {
            cachedMemoryLimit = await _runtime.InvokeAsync<int>(interactiveMemoryLimit);
            _constants.TryAdd(interactiveMemoryLimit, cachedMemoryLimit);
        }
        return cachedMemoryLimit;
    }

    private async Task<byte[]> GenerateSalt()
    {
        if (!_constants.TryGetValue("_sodium.getSaltLength", out var saltLength))
        {
            saltLength = await _runtime.InvokeAsync<int>("_sodium.getSaltLength");
            _constants.TryAdd("_sodium.getSaltLength", saltLength);
        }
        var salt = await _runtime.InvokeAsync<byte[]>("_sodium.randombytes_buf", saltLength);
        return salt;
    }

    private static byte[] PackCipher(int memoryLimit, int opsLimit, byte[] nonce, byte[] salt, byte[] cipherText)
    {
        var memoryLimitBytes = IntToBytesBigEndian(memoryLimit);
        var opsLimitBytes = IntToBytesBigEndian(opsLimit);

        return nonce.Concat(memoryLimitBytes).Concat(salt).Concat(opsLimitBytes).Concat(cipherText).ToArray();
    }

    private async Task<(int memoryLimit, int opsLimit, byte[] nonce, byte[] salt, byte[] cipherText)> UnpackCipher(byte[] packedData)
    {
        var nonceLength = await _runtime.InvokeAsync<int>("_sodium.getNonceLength");

        if (_constants.TryGetValue("_sodium.getSaltLength", out var saltLength))
        {
            saltLength = await _runtime.InvokeAsync<int>("_sodium.getSaltLength");
            _constants.TryAdd("_sodium.getSaltLength", saltLength);
        }

        byte[] nonce = packedData.Take(nonceLength).ToArray();
        byte[] memoryLimitBytes = packedData.Skip(nonceLength).Take(4).ToArray();
        byte[] salt = packedData.Skip(nonceLength + 4).Take(saltLength).ToArray();
        byte[] opsLimitBytes = packedData.Skip(nonceLength + 4 + saltLength).Take(4).ToArray();
        byte[] cipherText = packedData.Skip(nonceLength + 4 + saltLength + 4).ToArray();

        // Convert integers back from Big-endian
        int memoryLimit = BytesToIntBigEndian(memoryLimitBytes);
        int opsLimit = BytesToIntBigEndian(opsLimitBytes);

        return (memoryLimit, opsLimit, nonce, salt, cipherText);
    }

    private static byte[] IntToBytesBigEndian(int value)
    {
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


}
