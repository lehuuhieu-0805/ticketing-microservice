import { scrypt, randomBytes } from 'crypto';

export class Password {
  static async toHash(password: string) {
    return new Promise((resolve, reject) => {
      const salt = randomBytes(8).toString('hex');
      scrypt(password, salt, 64, (error, derivedKey) => {
        if (error) {
          reject(error);
        } else {
          resolve(`${derivedKey.toString('hex')}.${salt}`);
        }
      });
    });
  }

  static compare(storedPassword: string, suppliedPassword: string) {
    return new Promise((resolve, reject) => {
      const [hashedPassword, salt] = storedPassword.split('.');
      scrypt(suppliedPassword, salt, 64, (error, derivedKey) => {
        if (error) {
          reject(error);
        } else {
          resolve(derivedKey.toString('hex') === hashedPassword);
        }
      });
    });
  }
}
