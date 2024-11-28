import { EncryptionParameters } from './encryption-params';

export class EncryptionHelpers {

  public static combinedCipherKey(nonce: Uint8Array, salt: Uint8Array, ciphertext: Uint8Array, encryptionParameters: EncryptionParameters): Uint8Array | PromiseLike<Uint8Array> {
    return new Uint8Array([
      ...this.intToBytes(encryptionParameters.memoryLimit),
      ...this.intToBytes(encryptionParameters.operationsLimit),
      ...nonce,
      ...salt,
      ...ciphertext]);
  }

  public static splitCipherKey(cipherText: Uint8Array, nonceLength: number, saltLength: number): { cipherText: Uint8Array, nonce: Uint8Array, salt: Uint8Array, encryptionParameters: EncryptionParameters } {
    debugger;
    let memoryLimit = this.bytesToInt(cipherText.slice(0, 4));
    let operationsLimit = this.bytesToInt(cipherText.slice(4, 8));
    let nonce = cipherText.slice(8, 8 + nonceLength);
    let salt = cipherText.slice(8 + nonceLength, 8 + nonceLength + saltLength);
    let ciphertext = cipherText.slice(8 + nonceLength + saltLength)

    const encryptionParameters = { memoryLimit, operationsLimit };
    return { cipherText: ciphertext, nonce, salt, encryptionParameters };
  }



  private static intToBytes(value: number): Uint8Array {
    return new Uint8Array([
      (value >> 24) & 0xff, // Most significant byte
      (value >> 16) & 0xff,
      (value >> 8) & 0xff,
      value & 0xff // Least significant byte
    ]);
  }

  private static bytesToInt(bytes: Uint8Array): number {
    return (
      (bytes[0] << 24) |
      (bytes[1] << 16) |
      (bytes[2] << 8) |
      bytes[3]
    );
  }


}
