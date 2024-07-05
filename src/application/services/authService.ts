import { AuthenticationService } from '../../domain/services/authenticationService';

export class AuthService {
  static login(userId: string): string {
    return AuthenticationService.generateToken(userId);
  }

  static authenticate(token: string): string | null {
    return AuthenticationService.verifyToken(token);
  }
}
