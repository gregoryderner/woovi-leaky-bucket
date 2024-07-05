import { AuthService } from '../../application/services/authService';
import { TenantService } from '../../application/services/tenantService';

const tenantService = new TenantService();

export const resolvers = {
  Query: {
    ping: () => 'pong!',
    getPixKey: (_: any, { userId }: { userId: string }) => {
      return `PIX-KEY-${userId}`;
    },
  },
  Mutation: {
    initiatePixTransaction: async (
      _: any,
      { pixKey, value }: { pixKey: string; value: number },
      context: any,
    ) => {
      const authorizationHeader = context.req.headers['authorization'];
      if (!authorizationHeader) {
        throw new Error('Authorization header is required');
      }

      const token = authorizationHeader.split(' ')[1];
      const userId = AuthService.authenticate(token);
      if (!userId) {
        throw new Error('Invalid token');
      }

      const success = tenantService.consumeToken(userId);
      if (!success) {
        throw new Error('No tokens available');
      }

      const transactionSuccess = Math.random() > 0.5;
      if (transactionSuccess) {
        return `Transaction of ${value} to ${pixKey} was successful`;
      } else {
        tenantService.failRequest(userId);
        throw new Error('Transaction failed');
      }
    },
  },
};
