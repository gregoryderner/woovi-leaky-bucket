import { Tenant } from '../../domain/entities/tenant';

export class TenantService {
  private tenants: Map<string, Tenant>;
  private intervalId: NodeJS.Timeout | null;

  constructor() {
    this.tenants = new Map();
    this.intervalId = null;
    this.scheduleTokenRegeneration();
  }

  public getOrCreateTenant(userId: string): Tenant {
    if (!this.tenants.has(userId)) {
      this.tenants.set(userId, new Tenant(userId));
    }
    return this.tenants.get(userId)!;
  }

  public getTokens(userId: string): number {
    const tenant = this.getOrCreateTenant(userId);
    return tenant.getTokens();
  }

  public addToken(userId: string): void {
    const tenant = this.getOrCreateTenant(userId);
    tenant.addToken();
  }

  public consumeToken(userId: string): boolean {
    const tenant = this.getOrCreateTenant(userId);
    return tenant.consumeToken();
  }

  public failRequest(userId: string): void {
    const tenant = this.getOrCreateTenant(userId);
    tenant.failRequest();
  }

  private scheduleTokenRegeneration(): void {
    this.intervalId = setInterval(() => {
      this.tenants.forEach((tenant) => {
        tenant.addToken();
      });
    }, 3600000); // Regerar tokens a cada uma hora
  }

  public clearTokenRegeneration(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }
}
