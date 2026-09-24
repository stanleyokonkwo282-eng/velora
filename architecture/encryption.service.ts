/**
 * NestJS SecurityModule — EncryptionService
 * AES-256-GCM at rest for client secrets and OAuth access/refresh tokens.
 * ENCRYPTION_KEY must be 32 bytes, sourced from KMS / env.
 */
import { createCipheriv, createDecipheriv, randomBytes } from "crypto";

export class EncryptionService {
  constructor(private readonly key: Buffer) {
    if (key.length !== 32) {
      throw new Error("ENCRYPTION_KEY must be 32 bytes for aes-256-gcm");
    }
  }

  encrypt(text: string): string {
    const iv = randomBytes(12);
    const cipher = createCipheriv("aes-256-gcm", this.key, iv);
    const encrypted = Buffer.concat([cipher.update(text, "utf8"), cipher.final()]);
    const tag = cipher.getAuthTag();
    return Buffer.concat([iv, tag, encrypted]).toString("base64");
  }

  decrypt(hash: string): string {
    const buf = Buffer.from(hash, "base64");
    const iv = buf.subarray(0, 12);
    const tag = buf.subarray(12, 28);
    const encrypted = buf.subarray(28);
    const decipher = createDecipheriv("aes-256-gcm", this.key, iv);
    decipher.setAuthTag(tag);
    return Buffer.concat([decipher.update(encrypted), decipher.final()]).toString("utf8");
  }
}
