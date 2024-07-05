import jwt from 'jsonwebtoken';

const SECRET_KEY = 'S3cr37eKE!';

export class AuthenticationService {
  static generateToken(userId: string): string {
    return jwt.sign({ userId }, SECRET_KEY, { expiresIn: '1h' });
  }

  static verifyToken(token: string): string | null {
    try {
      const decoded = jwt.verify(token, SECRET_KEY) as { userId: string };
      return decoded.userId;
    } catch (error) {
      return null;
    }
  }
}
