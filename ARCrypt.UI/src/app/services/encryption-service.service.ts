import { Injectable } from '@angular/core';
import _sodium, { add } from 'libsodium-wrappers-sumo';
import { EncryptionParameters } from './encryption-params';
import { EncryptionHelpers } from './encryption-helper';

@Injectable({
  providedIn: 'root'
})
export class EncryptionService {

  generateRandom(): string {
    const sodium = _sodium;
    let password = sodium.to_base64(
      sodium.randombytes_buf(20),
      sodium.base64_variants.URLSAFE_NO_PADDING
    );
    return password;
  }
  private isInitialised = false;

  private defaultEncryptionParams!: EncryptionParameters;

  constructor() {
    this.initSodium();
  }

  get nonceLength(): number {
    return _sodium.crypto_aead_xchacha20poly1305_ietf_NPUBBYTES;
  }

  get saltLength(): number {
    return _sodium.crypto_pwhash_argon2id_SALTBYTES;
  }

  private async initSodium(): Promise<void> {

    if (this.isInitialised) {
      return;
    }
    await _sodium.ready;
    this.isInitialised = true;
    this.defaultEncryptionParams = { operationsLimit: _sodium.crypto_pwhash_OPSLIMIT_INTERACTIVE, memoryLimit: _sodium.crypto_pwhash_MEMLIMIT_INTERACTIVE };
  }

  private async deriveKey(passphrase: Uint8Array, salt: Uint8Array, operationLimit: EncryptionParameters): Promise<(Uint8Array)> {
    
    return _sodium.crypto_pwhash(
      _sodium.crypto_aead_xchacha20poly1305_ietf_KEYBYTES,
      passphrase,
      salt,
      operationLimit.operationsLimit,
      operationLimit.memoryLimit,
      _sodium.crypto_pwhash_ALG_ARGON2ID13
    );
  }

  public async encrypt(message: string, additionalData: string | null, key: string, encryptionParameters: EncryptionParameters | null): Promise<Uint8Array> {

    let nonce = _sodium.randombytes_buf(this.nonceLength);
    let salt = _sodium.randombytes_buf(this.saltLength);
    encryptionParameters ??= this.defaultEncryptionParams;

    var keyBytes = _sodium.from_string(key);
    let derivedKey = await this.deriveKey(keyBytes, salt, encryptionParameters);

    let ciphertext = _sodium.crypto_aead_xchacha20poly1305_ietf_encrypt(
      _sodium.from_string(message),
      additionalData,
      null,
      nonce,
      derivedKey
    );
    console.log('cipher text', ciphertext);

    let plaintext = _sodium.crypto_aead_xchacha20poly1305_ietf_decrypt(null, ciphertext, additionalData, nonce, derivedKey);

    console.log('--key--', keyBytes);
    console.log('--nonce--', nonce);
    console.log('--salt--', salt);
    console.log('--additional-data--', additionalData);

    console.log("--plaintext--", plaintext)
    console.log("--derived-key--", derivedKey)
    console.log("--encryption-parameters--", encryptionParameters)

    return EncryptionHelpers.combinedCipherKey(nonce, salt, ciphertext, encryptionParameters);
  }

  public async decrypt(cipherText: Uint8Array, key: string, additionalDate: string | null): Promise<Uint8Array> {

    const separateShit = EncryptionHelpers.splitCipherKey(cipherText, this.nonceLength, this.saltLength);

    let keyBytes = _sodium.from_string(key);
    let derivedKey = await this.deriveKey(keyBytes, separateShit.salt, separateShit.encryptionParameters);

    console.log('key', keyBytes);
    console.log('cipher text', separateShit.cipherText);
    console.log('encryption-params', separateShit.encryptionParameters)
    console.log('nonce', separateShit.nonce);
    console.log('salt', separateShit.salt);
    console.log('additional-data', additionalDate);
    console.log('derived-key', derivedKey);

    try {
      let plaintext = _sodium.crypto_aead_xchacha20poly1305_ietf_decrypt(null, separateShit.cipherText, additionalDate, separateShit.nonce, derivedKey);
      return plaintext;
    }
    catch (error) {
      console.log("Unable to decrypt cipher", error);
      throw error;
    }
  }

 

}


