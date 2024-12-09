
window._sodium = {

    memoryLimit: {},
    operationsLimit: {},

    ready: async () => {
        await sodium.ready;
        window.sodiumInstance = sodium;
        console.log("--sodium initialised--", window.sodium);
        _sodium.memoryLimit['INTERACTIVE'] = () => sodium.crypto_pwhash_MEMLIMIT_INTERACTIVE;
        _sodium.operationsLimit['INTERACTIVE'] = () => sodium.crypto_pwhash_OPSLIMIT_INTERACTIVE;
    },

    getSaltLength: () => {
        return sodium.crypto_pwhash_argon2id_SALTBYTES;
    },
    getNonceLength: () => {
        return sodium.crypto_aead_xchacha20poly1305_ietf_NPUBBYTES;
    },
    deriveKey: (passphrase, salt, operationsLimit, memoryLimit) => {

        return window.sodiumInstance.crypto_pwhash(
            sodium.crypto_aead_xchacha20poly1305_ietf_KEYBYTES,
            passphrase,
            salt,
            operationsLimit,
            memoryLimit,
            sodium.crypto_pwhash_ALG_ARGON2ID13
        );
    },
    randombytes_buf: (length) => {
        return randomBytes = sodium.randombytes_buf(length);
    },
    crypto_aead_xchacha20poly1305_ietf_encrypt: (message, additionalData, privateNonde, publicNonce, derivedKey) => {

        return sodium.crypto_aead_xchacha20poly1305_ietf_encrypt(
            sodium.from_string(message),
            additionalData,
            null,
            publicNonce,
            derivedKey);
    },
    crypto_aead_xchacha20poly1305_ietf_decrypt: (publicNonce, cipherText, additionalDate, nonce, derivedKey) => {

        return sodium.crypto_aead_xchacha20poly1305_ietf_decrypt(
            null,
            cipherText,
            additionalDate,
            nonce,
            derivedKey);
    }
};
