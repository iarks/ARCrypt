using Cryptic.Blazor.Model;
using Cryptic.Blazor.Services.Abstractions;
using Microsoft.JSInterop;

namespace Cryptic.Blazor.Services;

internal class CryptoService : ICryptoService
{
    private bool _isInit = false;
    private readonly IJSRuntime _runtime;

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

    public async Task<byte[]> Encrypt(string plainText, string userKey, MemoryLimits memLimit, int? memoryLimit, MemoryLimits opLimit, int? opsLimit, string? additionalData)
    {
        var nonce = await _runtime.GenerateNonce();
        var generateSaltTask = _runtime.GenerateSalt();
        var memoryLimitTask = memLimit == MemoryLimits.CUSTOM ? null: _runtime.GetMemoryLimit(memLimit);
        var opsLimitTask = opLimit == MemoryLimits.CUSTOM ? null: _runtime.GetOperationsLimit(opLimit);

        await Task.WhenAll(generateSaltTask, memoryLimitTask??Task.CompletedTask, opsLimitTask??Task.CompletedTask);

        var salt = await generateSaltTask;
        memoryLimit = memoryLimitTask == null ? memoryLimit!.Value : await memoryLimitTask;
        opsLimit = opsLimitTask == null ? opsLimit!.Value : await opsLimitTask;

        var generatedKey = await _runtime.DeriveKey(userKey, salt, memoryLimit.Value, opsLimit.Value);
        var cipherText = await _runtime.InvokeAsync<byte[]>("_sodium.crypto_aead_xchacha20poly1305_ietf_encrypt", plainText, additionalData, null, nonce, generatedKey);

        var packedCipher = _runtime.PackCipher(memoryLimit.Value, opsLimit.Value, nonce, salt, cipherText);

#if DEBUG
        // decrypt the packed cipher back for testing
        var plaintext = await Decrypt(packedCipher, userKey, additionalData);
#endif
        return packedCipher;
    }

    public async Task<byte[]> Decrypt(byte[] cipherText, string userKey, string? additionalData)
    {
        var unpackedCipher = _runtime.UnpackCipher(cipherText);
        var derivedKey = await _runtime.DeriveKey(userKey, unpackedCipher.salt, unpackedCipher.memoryLimit, unpackedCipher.opsLimit);
        var plainText = await _runtime.InvokeAsync<byte[]>("_sodium.crypto_aead_xchacha20poly1305_ietf_decrypt", null, unpackedCipher.cipherText, additionalData, unpackedCipher.nonce, derivedKey);
        return plainText;
    }
}
