(function () {
    const _sodium = {
        memoryLimit: {},
        operationsLimit: {},

        ready: async () => {
            await sodium.ready;

            Object.defineProperty(_sodium, 'sodiumInstance', {
                value: sodium,
                writable: false,
                configurable: false
            });

            console.log("--sodium initialised--", _sodium.sodiumInstance);

            _sodium.memoryLimit['INTERACTIVE'] = () => _sodium.sodiumInstance.crypto_pwhash_MEMLIMIT_INTERACTIVE;
            _sodium.memoryLimit['MODERATE'] = () => _sodium.sodiumInstance.crypto_pwhash_MEMLIMIT_MODERATE;
            _sodium.memoryLimit['SENSITIVE'] = () => _sodium.sodiumInstance.crypto_pwhash_MEMLIMIT_SENSITIVE;

            _sodium.operationsLimit['INTERACTIVE'] = () => _sodium.sodiumInstance.crypto_pwhash_OPSLIMIT_INTERACTIVE;
            _sodium.operationsLimit['MODERATE'] = () => _sodium.sodiumInstance.crypto_pwhash_OPSLIMIT_MODERATE;
            _sodium.operationsLimit['SENSITIVE'] = () => _sodium.sodiumInstance.crypto_pwhash_OPSLIMIT_SENSITIVE;

            Object.freeze(_sodium);
            Object.freeze(sodium);
        },

        getSaltLength: () => _sodium.sodiumInstance.crypto_pwhash_argon2id_SALTBYTES,
        getNonceLength: () => _sodium.sodiumInstance.crypto_aead_xchacha20poly1305_ietf_NPUBBYTES,

        deriveKey: (passphrase, salt, operationsLimit, memoryLimit) => {
            return _sodium.sodiumInstance.crypto_pwhash(
                _sodium.sodiumInstance.crypto_aead_xchacha20poly1305_ietf_KEYBYTES,
                passphrase,
                salt,
                operationsLimit,
                memoryLimit,
                _sodium.sodiumInstance.crypto_pwhash_ALG_ARGON2ID13
            );
        },

        randombytes_buf: (length) => _sodium.sodiumInstance.randombytes_buf(length),

        crypto_aead_xchacha20poly1305_ietf_encrypt: (message, additionalData, privateNonce, publicNonce, derivedKey) => {
            return _sodium.sodiumInstance.crypto_aead_xchacha20poly1305_ietf_encrypt(
                _sodium.sodiumInstance.from_string(message),
                additionalData,
                null,
                publicNonce,
                derivedKey
            );
        },

        crypto_aead_xchacha20poly1305_ietf_decrypt: (publicNonce, cipherText, additionalData, nonce, derivedKey) => {
            return _sodium.sodiumInstance.crypto_aead_xchacha20poly1305_ietf_decrypt(
                null,
                cipherText,
                additionalData,
                nonce,
                derivedKey
            );
        }
    };

    // Define `_sodium` as a read-only, non-configurable property
    Object.defineProperty(window, '_sodium', {
        value: _sodium,
        writable: false, // Cannot reassign `_sodium`
        configurable: false // Cannot delete or redefine `_sodium`
    });

    console.log("Locked `_sodium` and `sodiumInstance` to prevent overriding.");
})();
