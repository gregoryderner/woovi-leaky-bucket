export class Tenant {
  public readonly userId: string;
  private tokens: number;

  constructor(userId: string, tokens: number = 10) {
    this.userId = userId;
    this.tokens = tokens;
  }

  public getTokens(): number {
    return this.tokens;
  }

  public addToken(): void {
    if (this.tokens < 10) {
      this.tokens += 1;
    }
  }

  public consumeToken(): boolean {
    if (this.tokens > 0) {
      this.tokens -= 1;
      return true;
    }
    return false;
  }

  public failRequest(): void {
    if (this.tokens > 0) {
      this.tokens -= 1;
    }
  }
}
